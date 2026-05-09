import ts from "typescript"
import { resolve, extname, basename } from "node:path"
import { readdir, stat, readFile } from "node:fs/promises"
import { getJSDocMetadata } from "@/jsdoc-metadata.ts"
import type { OpenAPISpec } from "@/@types/openapi.ts"

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
            version: "1.0.0",
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

        const pathsObject = getJSDocMetadata(sourceFile)
        openAPISpec.paths = { ...openAPISpec.paths, ...pathsObject }
    }
    return openAPISpec
}
