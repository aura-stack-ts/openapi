import { describe, test, expect } from "vitest"
import { getMetadata } from "@/metadata.ts"

describe("Metadata Extraction", () => {
    test("extracts metadata from a directory of TypeScript files", async () => {
        const metadata = await getMetadata("test/fixtures/users.ts")
        expect(metadata).toEqual({
            openapi: "3.0.0",
            info: {
                title: "API Documentation",
                version: "0.0.0",
            },
            paths: {
                "/users": {
                    description: "Create a new user Creates a user and returns the created entity.",
                    get: {
                        description: "Create a new user Creates a user and returns the created entity.",
                        tags: ["Users", "Admin"],
                        operationId: "createUser",
                        parameters: [
                            {
                                name: "organizationId",
                                in: "path",
                                description: "Organization ID",
                                required: true,
                                schema: {
                                    type: "string",
                                },
                            },
                            {
                                name: "sendEmail",
                                in: "query",
                                description: "Send welcome email",
                                required: false,
                                schema: {
                                    type: "boolean",
                                },
                            },
                        ],
                        requestBody: {
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "CreateUserInput",
                                    },
                                },
                            },
                            description: "User payload",
                            required: true,
                        },
                        responses: {
                            "201": {
                                description: "User created",
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "User",
                                        },
                                    },
                                },
                            },
                            "400": {
                                description: "Invalid payload",
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "ValidationError",
                                        },
                                    },
                                },
                            },
                            "409": {
                                description: "Email already exists",
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "ConflictError",
                                        },
                                    },
                                },
                            },
                        },
                        security: [
                            {
                                bearerAuth: [],
                            },
                        ],
                    },
                    post: {
                        description: "Create a new user",
                        parameters: [
                            {
                                name: "role",
                                in: "query",
                                description: "The role of the new user",
                                required: false,
                                schema: {
                                    type: "string",
                                },
                            },
                        ],
                        requestBody: {
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "CreateUserInput",
                                    },
                                },
                            },
                            description: "User payload",
                            required: true,
                        },
                        responses: {
                            "201": {
                                description: "The created user object",
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "User",
                                        },
                                    },
                                },
                            },
                            "400": {
                                description: "Invalid input",
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "ValidationError",
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                "/users/{userId}": {
                    description: "Get a user by ID",
                    get: {
                        description: "Get a user by ID",
                        parameters: [
                            {
                                name: "userId",
                                in: "path",
                                description: "The ID of the user",
                                required: true,
                                schema: {
                                    type: "string",
                                },
                            },
                            {
                                name: "include",
                                in: "query",
                                description: "Additional fields to include",
                                required: false,
                                schema: {
                                    type: "string",
                                },
                            },
                        ],
                        responses: {
                            "200": {
                                description: "The user object",
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "User",
                                        },
                                    },
                                },
                            },
                            "404": {
                                description: "User not found",
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "NotFoundError",
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                "/items/{itemId}": {
                    description: "Update an item",
                    put: {
                        description: "Update an item",
                        parameters: [
                            {
                                name: "itemId",
                                in: "path",
                                description: "The ID of the item",
                                required: true,
                                schema: {
                                    type: "number",
                                },
                            },
                        ],
                        requestBody: {
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "UpdateItemInput",
                                    },
                                },
                            },
                            description: "Item payload",
                            required: true,
                        },
                        responses: {
                            "200": {
                                description: "Updated item",
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "Item",
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        })
    })

    test("get info object metadata", async () => {
        const metadata = await getMetadata("test/fixtures/info.ts")
        expect(metadata.info).toEqual({
            title: "OpenAPI Specification Example",
            version: "0.1.0",
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
        })
    })
})
