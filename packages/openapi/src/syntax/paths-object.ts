import { tagRegistry } from "@/syntax/registry.ts"
import { isArrayKey, isObjectKey, isPlainKey } from "@/assert.ts"
import type { JSDocTagInfo } from "@/@types/compiler.ts"
import type { OperationObject } from "@/@types/openapi.ts"

export interface PathObjectDefinition {
    route: {
        route: string
        method: string
    }
    operation: OperationObject
}

export const getPathsObject = (tags: JSDocTagInfo[]): PathObjectDefinition | undefined => {
    const isOpenApi = tags.some((t) => t.tag === "openapi")
    if (!isOpenApi) return undefined
    const route = {} as PathObjectDefinition["route"]
    const operation = {} as OperationObject
    for (const tag of tags) {
        if (tag.tag === "openapi") continue
        const { key, value } = tagRegistry.process(tag)

        if (value === "unknown") continue
        if (key === "route") {
            route["method"] = value.method?.toLowerCase()
            route["route"] = value.route
        } else if (isPlainKey(key)) {
            // @ts-ignore
            operation[key] = value
        } else if (isArrayKey(key)) {
            if (!(key in operation)) {
                // @ts-ignore
                operation[key] = []
            }
            // @ts-ignore
            operation[key].push(value)
        } else if (isObjectKey(key)) {
            if (!(key in operation)) {
                // @ts-ignore
                operation[key] = {}
            }
            // @ts-ignore
            Object.assign(operation[key], value)
        }
    }
    return {
        route,
        operation,
    }
}
