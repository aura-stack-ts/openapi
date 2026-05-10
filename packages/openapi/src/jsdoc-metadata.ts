import ts from "typescript"
import { getPathsObject } from "@/syntax/paths-object.ts"
import type { PathsObject } from "@/@types/openapi.ts"
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

export const getJSDocMetadata = (sourceFile: ts.SourceFile): PathsObject => {
    const metadata: PathsObject = {}

    const visit = (node: ts.Node) => {
        let name: string | undefined
        let isFunction = false

        if (ts.isFunctionDeclaration(node)) {
            name = node.name ? node.name.getText(sourceFile) : "default"
            isFunction = true
        } else if (ts.isMethodDeclaration(node)) {
            name = node.name.getText(sourceFile)
            isFunction = true
        } else if (ts.isVariableStatement(node)) {
            const declaration = node.declarationList.declarations[0]
            if (declaration && declaration.initializer) {
                if (ts.isArrowFunction(declaration.initializer) || ts.isFunctionExpression(declaration.initializer)) {
                    name = declaration.name.getText(sourceFile)
                    isFunction = true
                }
            }
        }

        if (isFunction && name) {
            const docs = ts.getJSDocCommentsAndTags(node)
            if (docs.length > 0) {
                const doc = docs.find(ts.isJSDoc)
                if (doc) {
                    const hasOpenAPITag = doc.tags?.some((tag) => tag.tagName.text === "openapi")
                    if (!hasOpenAPITag) return
                    const description = getCommentTextFromJSDoc(doc.comment)
                    const tags: JSDocTagInfo[] = []

                    getTagsFromJSDoc(doc.tags, sourceFile).forEach((tagInfo) => tags.push(tagInfo))

                    const pathObject = getPathsObject(tags)
                    if (pathObject) {
                        const { route, operation } = pathObject
                        if (!metadata[route.route]) {
                            metadata[route.route] = {}
                        }
                        metadata[route.route]["description"] = description
                        // @ts-ignore
                        metadata[route.route][route.method as string] = operation
                    }
                }
            }
        }
        ts.forEachChild(node, visit)
    }
    visit(sourceFile)
    return metadata
}
