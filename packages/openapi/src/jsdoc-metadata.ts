import ts from "typescript"
import type { FunctionMetadata, JSDocTagInfo } from "@/@types/compiler.ts"

const getCommentTextFromJSDoc = (comment?: string | ts.NodeArray<ts.JSDocComment> | ts.JSDocText): string | undefined => {
    if (!comment) return undefined
    if (typeof comment === "string") return comment
    if (Array.isArray(comment)) {
        return comment.map((c) => c.getText()).join(" ")
    }
    return (comment as ts.JSDocText).text
}

export const getJSDocMetadata = (sourceFile: ts.SourceFile): FunctionMetadata[] => {
    const functions: FunctionMetadata[] = []

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
                    const description = getCommentTextFromJSDoc(doc.comment)
                    const tags: JSDocTagInfo[] = []

                    if (doc.tags) {
                        for (const tag of doc.tags) {
                            const tagInfo: JSDocTagInfo = {
                                tag: tag.tagName.text,
                            }

                            let typeExpr: ts.JSDocTypeExpression | undefined
                            let paramName: string | undefined

                            if (ts.isJSDocReturnTag(tag)) {
                                typeExpr = tag.typeExpression
                            } else if (ts.isJSDocParameterTag(tag)) {
                                typeExpr = tag.typeExpression
                                paramName = ts.isIdentifier(tag.name) ? tag.name.text : tag.name.getText(sourceFile)
                            } else if (ts.isJSDocTypeTag(tag)) {
                                typeExpr = tag.typeExpression
                            } else if ("typeExpression" in tag) {
                                typeExpr = (tag as any).typeExpression as ts.JSDocTypeExpression
                            }

                            if (typeExpr && typeExpr.type) {
                                tagInfo.type = typeExpr.type.getText(sourceFile)
                            }

                            if (paramName) {
                                tagInfo.name = paramName
                            }

                            const tagComment = getCommentTextFromJSDoc(tag.comment)
                            if (tagComment) {
                                tagInfo.description = tagComment
                            }

                            tags.push(tagInfo)
                        }
                    }

                    functions.push({
                        name,
                        description,
                        tags,
                    })
                }
            }
        }
        ts.forEachChild(node, visit)
    }
    visit(sourceFile)
    return functions
}
