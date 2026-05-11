import ts from "typescript"
import { tagRegistry } from "@/syntax/registry.ts"
import { getFunctionMetadataFromJSDoc } from "@/jsdoc-metadata.ts"
import { isArrayKey, isObjectKey, isPlainKey } from "@/shared/assert.ts"
import type { PathsObject, OperationObject, HTTPMethod, JSDocTagInfo, PathObjectDefinition } from "@/@types/index.ts"

export const getPathsObject = (tags: JSDocTagInfo[]): PathObjectDefinition | undefined => {
    const isOpenApi = tags.some((t) => t.tag === "openapi")
    if (!isOpenApi) return undefined
    const route = {} as PathObjectDefinition["route"]
    const operation: Record<string, any> = {}
    for (const tag of tags) {
        if (tag.tag === "openapi") continue
        const { key, value } = tagRegistry.process(tag)

        if (value === "unknown") continue
        if (key === "route") {
            route["method"] = value.method?.toLowerCase()
            route["route"] = value.route
        } else if (isPlainKey(key)) {
            operation[key] = value
        } else if (isArrayKey(key)) {
            if (!(key in operation)) {
                operation[key] = []
            }
            operation[key].push(value)
        } else if (isObjectKey(key)) {
            if (!(key in operation)) {
                operation[key] = {}
            }
            Object.assign(operation[key], value)
        }
    }
    return {
        route,
        operation: operation as OperationObject,
    }
}

export const getPathsObjectMetadata = (sourceFile: ts.SourceFile): PathsObject => {
    const metadata: PathsObject = {}
    const tagsPerFunction = getFunctionMetadataFromJSDoc(sourceFile)
    for (const tags of tagsPerFunction) {
        const pathObject = getPathsObject(tags)
        if (pathObject) {
            const { route, operation } = pathObject
            if (!metadata[route.route]) {
                metadata[route.route] = {}
                metadata[route.route]["description"] = "unknown"
            }
            metadata[route.route][route.method as HTTPMethod] = operation
        }
    }
    return metadata
}
