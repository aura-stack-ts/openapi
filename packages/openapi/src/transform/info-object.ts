import ts from "typescript"
import { getFunctionMetadataFromJSDoc } from "@/jsdoc-metadata.ts"
import { tagRegistry } from "@/syntax/registry.ts"
import { isInfoKey } from "@/shared/assert.ts"
import type { JSDocTagInfo } from "@/@types/compiler.ts"
import type { InfoObject } from "@/@types/openapi.ts"

/**
 * Extracts InfoObject metadata from JSDoc tags.
 */
export const getInfoObject = (tags: JSDocTagInfo[]): Partial<InfoObject> | undefined => {
    const hasRoute = tags.some((t) => t.tag === "route")
    if (hasRoute) return undefined

    const info: Record<string, any> = {}
    let found = false

    for (const tag of tags) {
        if (tag.tag === "openapi") continue
        const { key, value } = tagRegistry.process(tag)

        if (isInfoKey(key) && value !== "unknown") {
            info[key] = value
            found = true
        }
    }
    return found ? (info as Partial<InfoObject>) : undefined
}

/**
 * Extracts combined InfoObject metadata from all @openapi blocks in a source file.
 */
export const getInfoObjectMetadata = (sourceFile: ts.SourceFile): Partial<InfoObject> | undefined => {
    const allTags = getFunctionMetadataFromJSDoc(sourceFile)
    let combinedInfo: Partial<InfoObject> = {}
    let found = false

    for (const tags of allTags) {
        const info = getInfoObject(tags)
        if (info) {
            combinedInfo = { ...combinedInfo, ...info }
            found = true
        }
    }
    return found ? combinedInfo : undefined
}
