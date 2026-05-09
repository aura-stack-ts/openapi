import { describe, test, expect } from "vitest"
import { getMetadata } from "@/metadata.ts"

describe("Metadata Extraction", () => {
    test("extracts metadata from a directory of TypeScript files", async () => {
        const metadata = await getMetadata("tests/fixtures/users.ts")
        expect(metadata).toMatchObject({
            openapi: "3.0.0",
            info: {
                title: "API Documentation",
                version: "1.0.0",
            },
            paths: {
                "/users": {
                    description: "Create a new user",
                    get: {
                        tags: ["Users", "Admin"],
                        operationId: "createUser",
                        parameters: [
                            {
                                name: "organizationId",
                                in: "path",
                                description: "Organization ID",
                                required: true,
                                type: "string",
                            },
                            {
                                name: "sendEmail",
                                in: "query",
                                description: "Send welcome email",
                                required: false,
                                type: "boolean",
                            },
                        ],
                    },
                    post: {
                        parameters: [
                            {
                                name: "role",
                                in: "query",
                                description: "The role of the new user",
                                required: false,
                                type: "string",
                            },
                        ],
                    },
                },
                "/users/:userId": {
                    get: {
                        parameters: [
                            {
                                name: "userId",
                                in: "path",
                                description: "The ID of the user",
                                required: true,
                                type: "string",
                            },
                            {
                                name: "include",
                                in: "query",
                                description: "Additional fields to include",
                                required: false,
                                type: "string",
                            },
                        ],
                    },
                },
                "/items/{itemId}": {
                    description: "Update an item",
                    put: {
                        parameters: [
                            {
                                name: "itemId",
                                in: "path",
                                description: "The ID of the item",
                                required: true,
                                type: "number",
                            },
                        ],
                    },
                },
            },
        })
    })
})
