import ts from "typescript"
import { resolve, extname, basename } from "node:path"
import { readdir, stat, readFile } from "node:fs/promises"
import { getFunctionMetadataFromJSDoc } from "@/jsdoc-metadata.ts"
import { getPathsObject } from "@/transform/paths-object.ts"
import { getInfoObject } from "@/transform/info-object.ts"
import type { OpenAPISpec, HTTPMethod } from "@/@types/index.ts"

export const getFiles = async (dir: string): Promise<string[]> => {
    const dirents = await readdir(dir, { withFileTypes: true })
    const files = await Promise.all(
        dirents.map((dirent) => {
            const res = resolve(dir, dirent.name)
            return dirent.isDirectory() ? getFiles(res) : res
        })
    )
    return Array.prototype.concat(...files)
}

export const getMetadata = async (targetPath: string): Promise<OpenAPISpec> => {
    const openAPISpec: OpenAPISpec = {
        openapi: "3.0.0",
        info: {
            title: "API Documentation",
            version: "0.0.0",
        },
        paths: {},
    }

    const stats = await stat(targetPath)
    let filesToProcess: string[] = []
    if (stats.isDirectory()) {
        const allFiles = await getFiles(targetPath)
        filesToProcess = allFiles.filter((file) => {
            const ext = extname(file)
            return (ext === ".ts" || ext === ".tsx") && !file.endsWith(".d.ts")
        })
    } else {
        const ext = extname(targetPath)
        if ((ext === ".ts" || ext === ".tsx") && !targetPath.endsWith(".d.ts")) {
            filesToProcess = [resolve(targetPath)]
        } else {
            return openAPISpec
        }
    }

    for (const filePath of filesToProcess) {
        const content = await readFile(filePath, "utf-8")
        const sourceFile = ts.createSourceFile(basename(filePath), content, ts.ScriptTarget.Latest, true)

        const allTagsPerBlock = getFunctionMetadataFromJSDoc(sourceFile)
        for (const tags of allTagsPerBlock) {
            const info = getInfoObject(tags)
            if (info) {
                openAPISpec.info = { ...openAPISpec.info, ...info }
            }

            const pathObject = getPathsObject(tags)
            if (pathObject) {
                const { route, operation } = pathObject
                if (!openAPISpec.paths[route.route]) {
                    openAPISpec.paths[route.route] = {}
                }

                const descTag = tags.find((t) => t.tag === "description")
                if (descTag && !openAPISpec.paths[route.route].description) {
                    openAPISpec.paths[route.route].description = descTag.raw
                }

                openAPISpec.paths[route.route][route.method as HTTPMethod] = operation
            }
        }
    }
    return openAPISpec
}
