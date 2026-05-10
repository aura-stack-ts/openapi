import ts from "typescript"
import type { JSDocTagInfo } from "@/@types/compiler.ts"

const getCommentTextFromJSDoc = (comment?: string | ts.NodeArray<ts.JSDocComment> | ts.JSDocText): string | undefined => {
    if (!comment) return undefined
    if (typeof comment === "string") return comment
    if ("map" in comment && typeof comment.map === "function") {
        return comment.map((c) => c.getText()).join(" ")
    }
    return (comment as ts.JSDocText).text
}

const getTagsFromJSDoc = (tags: ts.NodeArray<ts.JSDocTag> | undefined, sourceFile: ts.SourceFile): JSDocTagInfo[] => {
    if (!tags) return []
    return tags.map((tag) => {
        const tagName = tag.tagName.text
        if (!/^[a-zA-Z0-9_-]+$/.test(tagName)) {
            return { tag: tagName, raw: "" }
        }
        const fullText = tag.getText(sourceFile)

        let raw = fullText.replace(new RegExp(`^@${tagName}\\s*`), "")

        raw = raw
            .split(/\r?\n/)
            .map((line) => line.replace(/^\s*\*\s?/, "").trim())
            .filter((line) => line.length > 0)
            .join(" ")
            .trim()

        return {
            tag: tagName,
            raw,
        }
    })
}

export const getFunctionMetadataFromJSDoc = (sourceFile: ts.SourceFile): JSDocTagInfo[][] => {
    const allTags: JSDocTagInfo[][] = []
    const seenJSDocs = new Set<ts.JSDoc>()

    const visit = (node: ts.Node) => {
        const docs = ts.getJSDocCommentsAndTags(node)
        for (const doc of docs) {
            if (ts.isJSDoc(doc) && !seenJSDocs.has(doc)) {
                seenJSDocs.add(doc)
                const openApiTag = doc.tags?.find((tag) => tag.tagName.text === "openapi")
                if (openApiTag) {
                    const tags = getTagsFromJSDoc(doc.tags, sourceFile)

                    const mainComment = getCommentTextFromJSDoc(doc.comment)
                    if (mainComment && !tags.some((t) => t.tag === "description")) {
                        const processedComment = mainComment
                            .split(/\r?\n/)
                            .map((line) => line.replace(/^\s*\*\s?/, "").trim())
                            .filter((line) => line.length > 0)
                            .join(" ")
                            .trim()
                        tags.push({ tag: "description", raw: processedComment })
                    } else if (!mainComment && openApiTag.comment) {
                        const openApiComment = getCommentTextFromJSDoc(openApiTag.comment)
                        if (openApiComment && !tags.some((t) => t.tag === "description")) {
                            const processedOpenApiComment = openApiComment
                                .split(/\r?\n/)
                                .map((line) => line.replace(/^\s*\*\s?/, "").trim())
                                .filter((line) => line.length > 0)
                                .join(" ")
                                .trim()
                            tags.push({ tag: "description", raw: processedOpenApiComment })
                        }
                    }

                    allTags.push(tags)
                }
            }
        }
        ts.forEachChild(node, visit)
    }
    visit(sourceFile)
    return allTags
}
