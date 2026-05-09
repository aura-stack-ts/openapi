import ts from "typescript"
import { describe, test, expect } from "vitest"
import { getJSDocMetadata } from "@/jsdoc-metadata.ts"

describe("JSDoc Metadata Extraction", () => {
    test("gets metadata from function declarations", () => {
        const source = `
        /**
         * Adds two numbers together.
         * @param {number} a The first number.
         * @param {number} b The second number.
         * @returns {number} The sum of a and b.
         */
        const add = (a, b) => {
            return a + b;
        }

        /**
         * Subtracts the second number from the first number.
         * @param {number} a The first number.
         * @param {number} b The second number.
         * @returns {number} The difference of a and b.
         */
        function subtract(a, b) {
            return a - b;
        }
        `
        const sourceFile = ts.createSourceFile("test.ts", source, ts.ScriptTarget.ES2022, true)
        const metadata = getJSDocMetadata(sourceFile)
        expect(metadata).toMatchObject([
            {
                name: "add",
                description: "Adds two numbers together.",
                tags: [
                    { name: "a", description: "The first number.", tag: "param", type: "number" },
                    { name: "b", description: "The second number.", tag: "param", type: "number" },
                    { description: "The sum of a and b.", tag: "returns", type: "number" },
                ],
            },
            {
                name: "subtract",
                description: "Subtracts the second number from the first number.",
                tags: [
                    { name: "a", description: "The first number.", tag: "param", type: "number" },
                    { name: "b", description: "The second number.", tag: "param", type: "number" },
                    { description: "The difference of a and b.", tag: "returns", type: "number" },
                ],
            },
        ])
    })
})
