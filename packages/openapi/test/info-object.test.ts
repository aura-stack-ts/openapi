import { describe, test, expect } from "vitest"
import ts from "typescript"
import { getInfoObjectMetadata } from "@/transform/info-object.ts"

describe("InfoObject", () => {
    test("should extract metadata from JSDoc comments", () => {
        const source = `
        /**
         * @openapi
         *
         * @version 3.0.0
         * @title OpenAPI Specification Example
         * @description This is an example of an OpenAPI specification document.
         * @termsOfService https://example.com/terms/
         * @contact Aura Stack <aurastackjs@gmail.com> https://github.com/aura-stack-ts/
         * @license MIT https://github.com/aura-stack-ts/.github/blob/master/LICENSE
         */
        export default function openAPI() {}
        `

        const sourceFile = ts.createSourceFile("test.ts", source, ts.ScriptTarget.ES2022, true)
        const infoObject = getInfoObjectMetadata(sourceFile)
        expect(infoObject).toEqual({
            title: "OpenAPI Specification Example",
            description: "This is an example of an OpenAPI specification document.",
            termsOfService: "https://example.com/terms/",
            contact: {
                name: "Aura Stack",
                email: "aurastackjs@gmail.com",
                url: "https://github.com/aura-stack-ts/",
            },
            license: {
                name: "MIT",
                url: "https://github.com/aura-stack-ts/.github/blob/master/LICENSE",
            },
            version: "3.0.0",
        })
    })
})
