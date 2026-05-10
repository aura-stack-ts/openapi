import { describe, test, expect } from "vitest"
import ts from "typescript"
import { getFunctionMetadataFromJSDoc } from "@/jsdoc-metadata.ts"

describe("JSDoc Metadata Extraction", () => {
    test("gets JSDoc metadata from a function declaration", () => {
        const source = `
        /**
         * @openapi
         *
         * Create a new user
         *
         * Creates a user and returns the created entity.
         *
         * @route GET /users
         * 
         * @tag Users
         * @tag Admin
         *
         * @operationId createUser
         * 
         * @body {CreateUserInput} required - User payload
         * 
         * @security bearerAuth
         */
        export const createUser = () => {}

        /**
         * @openapi
         *
         * Get a user by ID
         *
         * @route GET /users/:userId
         *
         * @param {string} userId.path The ID of the user
         * @param {string} include.query Additional fields to include
         *
         * @response 200 {User} application/json The user object
         * @response 404 {NotFoundError} application/json User not found
         */
        export const getUser = (_userId: string, _include?: string) => {}
        `
        const sourceFile = ts.createSourceFile("test.ts", source, ts.ScriptTarget.ES2022, true, ts.ScriptKind.TS)
        const metadata = getFunctionMetadataFromJSDoc(sourceFile)
        expect(metadata).toEqual([
            [
                {
                    tag: "openapi",
                    raw: "Create a new user Creates a user and returns the created entity.",
                },
                {
                    tag: "route",
                    raw: "GET /users",
                },
                {
                    tag: "tag",
                    raw: "Users",
                },
                {
                    tag: "tag",
                    raw: "Admin",
                },
                {
                    tag: "operationId",
                    raw: "createUser",
                },
                {
                    tag: "body",
                    raw: "{CreateUserInput} required - User payload",
                },
                {
                    tag: "security",
                    raw: "bearerAuth",
                },
                {
                    tag: "description",
                    raw: "Create a new user Creates a user and returns the created entity.",
                },
            ],
            [
                {
                    tag: "openapi",
                    raw: "Get a user by ID",
                },
                {
                    tag: "route",
                    raw: "GET /users/:userId",
                },
                {
                    tag: "param",
                    raw: "{string} userId.path The ID of the user",
                },
                {
                    tag: "param",
                    raw: "{string} include.query Additional fields to include",
                },
                {
                    tag: "response",
                    raw: "200 {User} application/json The user object",
                },
                {
                    tag: "response",
                    raw: "404 {NotFoundError} application/json User not found",
                },
                {
                    tag: "description",
                    raw: "Get a user by ID",
                },
            ],
        ])
    })
})
