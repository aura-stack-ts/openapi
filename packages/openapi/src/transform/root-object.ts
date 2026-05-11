import ts from "typescript"
import { extractAllOpenApiTags } from "@/jsdoc-metadata.ts"
import { tagRegistry } from "@/syntax/registry.ts"
import { isGlobalKey, isInfoKey } from "@/shared/assert.ts"
import type { JSDocTagInfo } from "@/@types/compiler.ts"
import type { OpenAPISpec } from "@/@types/openapi.ts"

/**
 * Extracts root-level metadata from JSDoc tags.
 */
export const getRootObject = (tags: JSDocTagInfo[]): Partial<OpenAPISpec> | undefined => {
    const hasRoute = tags.some((t) => t.tag === "route" || t.tag === "endpoint")
    if (hasRoute) return undefined

    const root: Record<string, any> = {
        info: {},
    }
    let found = false

    for (const tag of tags) {
        if (tag.tag === "openapi") continue
        const { key, value } = tagRegistry.process(tag)

        if (isGlobalKey(key) && value !== "unknown") {
            found = true
            if (isInfoKey(key)) {
                root.info[key] = value
            } else if (key === "tags" || key === "security" || key === "servers") {
                if (!(key in root)) {
                    root[key] = []
                }
                root[key].push(value)
            } else {
                root[key] = value
            }
        }
    }

    if (Object.keys(root.info).length === 0) {
        delete root.info
    }

    return found ? (root as Partial<OpenAPISpec>) : undefined
}

/**
 * Extracts combined root-level metadata from all @openapi blocks in a source file.
 */
export const getRootObjectMetadata = (sourceFile: ts.SourceFile): Partial<OpenAPISpec> | undefined => {
    const allTags = extractAllOpenApiTags(sourceFile)
    let combinedRoot: Partial<OpenAPISpec> = {}
    let found = false

    for (const tags of allTags) {
        const root = getRootObject(tags)
        if (root) {
            found = true
            if (root.info) {
                combinedRoot.info = { ...(combinedRoot.info || {}), ...root.info } as any
            }
            if (root.tags) {
                const existingTags = combinedRoot.tags || []
                for (const newTag of root.tags) {
                    if (!existingTags.some((t) => t.name === newTag.name)) {
                        existingTags.push(newTag)
                    }
                }
                combinedRoot.tags = existingTags
            }
            if (root.security) {
                combinedRoot.security = [...(combinedRoot.security || []), ...root.security]
            }
            if (root.servers) {
                combinedRoot.servers = [...(combinedRoot.servers || []), ...root.servers]
            }
            if (root.externalDocs) {
                combinedRoot.externalDocs = root.externalDocs
            }
        }
    }

    return found ? combinedRoot : undefined
}
