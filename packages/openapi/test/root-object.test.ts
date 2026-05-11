import { describe, test, expect } from "vitest"
import ts from "typescript"
import { getRootObjectMetadata } from "@/transform/root-object.ts"

describe("RootObject", () => {
    test("should extract root-level metadata from JSDoc comments", () => {
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
         *
         * @tag Users Description for users tag
         * @tag Admin
         * 
         * @security bearerAuth scope1 scope2
         * @security apiKeyAuth
         * 
         * @externalDocs https://example.com/docs External Documentation Description
         */
        export default function openAPI() {}
        `

        const sourceFile = ts.createSourceFile("test.ts", source, ts.ScriptTarget.ES2022, true)
        const rootObject = getRootObjectMetadata(sourceFile)
        expect(rootObject).toEqual({
            info: {
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
            },
            tags: [{ name: "Users", description: "Description for users tag" }, { name: "Admin" }],
            security: [{ bearerAuth: ["scope1", "scope2"] }, { apiKeyAuth: [] }],
            externalDocs: {
                url: "https://example.com/docs",
                description: "External Documentation Description",
            },
        })
    })
})
