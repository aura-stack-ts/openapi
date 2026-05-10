import { getPathsObject } from "@/syntax/paths-object.ts"
import { describe, expect, test } from "vitest"

describe("Paths Object", () => {
    test("get description, summary and operationId", () => {
        const pathsObject = getPathsObject([
            {
                tag: "openapi",
                raw: "Create a new user Creates a user and returns the created entity.",
            },
            {
                tag: "summary",
                raw: "Create a new user",
            },
            {
                tag: "description",
                raw: "Creates a user and returns the created entity.",
            },
            {
                tag: "operationId",
                raw: "createUser",
            },
        ])
        expect(pathsObject?.operation).toEqual({
            summary: "Create a new user",
            description: "Creates a user and returns the created entity.",
            operationId: "createUser",
        })
    })

    test("get empty description, summary and operationId", () => {
        const pathsObject = getPathsObject([
            {
                tag: "openapi",
                raw: "Create a new user Creates a user and returns the created entity.",
            },
            {
                tag: "summary",
                raw: "",
            },
            {
                tag: "description",
                raw: "",
            },
            {
                tag: "operationId",
                raw: "",
            },
        ])
        expect(pathsObject?.operation).toEqual({})
    })

    test("get tags", () => {
        const pathsObject = getPathsObject([
            {
                tag: "openapi",
                raw: "Get user by ID Retrieves a user by their unique identifier.",
            },
            {
                tag: "tag",
                raw: "Users",
            },
            {
                tag: "tag",
                raw: "Admin",
            },
        ])
        expect(pathsObject?.operation).toEqual({
            tags: ["Users", "Admin"],
        })
    })

    test("get empty tags", () => {
        const pathsObject = getPathsObject([
            {
                tag: "openapi",
                raw: "Get user by ID Retrieves a user by their unique identifier.",
            },
            {
                tag: "tag",
                raw: "",
            },
            {
                tag: "tag",
                raw: "  ",
            },
        ])
        expect(pathsObject?.operation).toEqual({})
    })

    test("get externalDocs", () => {
        const withoutDescription = getPathsObject([
            {
                tag: "openapi",
                raw: "Get user by ID Retrieves a user by their unique identifier.",
            },
            {
                tag: "externalDocs",
                raw: "https://example.com/docs/get-user-by-id",
            },
        ])
        expect(withoutDescription?.operation).toEqual({
            externalDocs: {
                url: "https://example.com/docs/get-user-by-id",
            },
        })

        const withDescription = getPathsObject([
            {
                tag: "openapi",
                raw: "Get user by ID Retrieves a user by their unique identifier.",
            },
            {
                tag: "externalDocs",
                raw: "https://example.com/docs/get-user-by-id Documentation for Get User by ID endpoint",
            },
        ])
        expect(withDescription?.operation).toEqual({
            externalDocs: {
                url: "https://example.com/docs/get-user-by-id",
                description: "Documentation for Get User by ID endpoint",
            },
        })
    })

    test("get empty externalDocs", () => {
        const pathsObject = getPathsObject([
            {
                tag: "openapi",
                raw: "Get user by ID Retrieves a user by their unique identifier.",
            },
            {
                tag: "externalDocs",
                raw: "",
            },
        ])
        expect(pathsObject?.operation).toEqual({})
    })

    test("get parameters", () => {
        const pathsObject = getPathsObject([
            {
                tag: "openapi",
                raw: "openapi-annotation",
            },
            {
                tag: "param",
                raw: "{string} id invalid-param",
            },
            {
                tag: "param",
                raw: "{string} name.path param description",
            },
            {
                tag: "param",
                raw: "{number} age.query param description",
            },
            {
                tag: "param",
                raw: "{boolean} active.header param description",
            },
            {
                tag: "param",
                raw: "{string} session.cookie param description",
            },
            {
                tag: "param",
                raw: "id.path param description",
            },
            {
                tag: "param",
                raw: "age.query - param description",
            },
            {
                tag: "param",
                raw: "id.query required - param description",
            },
            {
                tag: "param",
                raw: "id.query required param description",
            },
        ])

        expect(pathsObject?.operation).toEqual({
            parameters: [
                {
                    description: "param description",
                    in: "path",
                    name: "name",
                    required: true,
                    schema: {
                        type: "string",
                    },
                },
                {
                    description: "param description",
                    in: "query",
                    name: "age",
                    required: false,
                    schema: {
                        type: "number",
                    },
                },
                {
                    description: "param description",
                    in: "header",
                    name: "active",
                    required: false,
                    schema: {
                        type: "boolean",
                    },
                },
                {
                    description: "param description",
                    in: "cookie",
                    name: "session",
                    required: false,
                    schema: {
                        type: "string",
                    },
                },
                {
                    description: "param description",
                    in: "path",
                    name: "id",
                    required: true,
                    schema: {
                        type: "string",
                    },
                },
                {
                    description: "param description",
                    in: "query",
                    name: "age",
                    required: false,
                    schema: {
                        type: "string",
                    },
                },
                {
                    description: "param description",
                    in: "query",
                    name: "id",
                    required: true,
                    schema: {
                        type: "string",
                    },
                },
                {
                    description: "param description",
                    in: "query",
                    name: "id",
                    required: true,
                    schema: {
                        type: "string",
                    },
                },
            ],
        })
    })

    test("get requestBody", () => {
        const testCases = [
            {
                raw: "{CreateUserInput} application/json required - User payload",
                expected: {
                    description: "User payload",
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "CreateUserInput",
                            },
                        },
                    },
                },
            },
            {
                raw: "application/json - User payload",
                expected: {
                    description: "User payload",
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                            },
                        },
                    },
                },
            },
            {
                raw: "application/json required - User payload",
                expected: {
                    description: "User payload",
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                            },
                        },
                    },
                },
            },
            {
                raw: "application/json optional - User payload",
                expected: {
                    description: "User payload",
                    required: false,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                            },
                        },
                    },
                },
            },
            {
                raw: "application/json",
                expected: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                            },
                        },
                    },
                },
            },
        ]

        for (const { raw, expected } of testCases) {
            const pathsObject = getPathsObject([
                {
                    tag: "openapi",
                    raw: "openapi-annotation",
                },
                {
                    tag: "body",
                    raw,
                },
            ])
            expect(pathsObject?.operation).toEqual({
                requestBody: expected,
            })
        }
    })

    test("get responses", () => {
        const pathsObject = getPathsObject([
            {
                tag: "openapi",
                raw: "openapi-annotation",
            },
            {
                tag: "response",
                raw: "200 {User} application/json - Successful response",
            },
            {
                tag: "response",
                raw: "404 - text/plain Not found",
            },
            {
                tag: "response",
                raw: "500 application/json - Internal server error",
            },
            {
                tag: "response",
                raw: "400 {ErrorResponse} - Bad request",
            },
            {
                tag: "response",
                raw: "204 - text/plain",
            },
            {
                tag: "response",
                raw: "default - text/plain Unexpected error",
            },
        ])

        expect(pathsObject?.operation).toEqual({
            responses: {
                "200": {
                    description: "Successful response",
                    content: {
                        "application/json": {
                            schema: {
                                type: "User",
                            },
                        },
                    },
                },
                "204": {
                    content: {
                        "text/plain": {
                            schema: {
                                type: "string",
                            },
                        },
                    },
                },
                "400": {
                    description: "Bad request",
                },
                "404": {
                    description: "Not found",
                    content: {
                        "text/plain": {
                            schema: {
                                type: "string",
                            },
                        },
                    },
                },
                "500": {
                    description: "Internal server error",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                            },
                        },
                    },
                },
                default: {
                    description: "Unexpected error",
                    content: {
                        "text/plain": {
                            schema: {
                                type: "string",
                            },
                        },
                    },
                },
            },
        })
    })

    test("get security", () => {
        const pathsObject = getPathsObject([
            {
                tag: "openapi",
                raw: "openapi-annotation",
            },
            {
                tag: "security",
                raw: "bearerAuth",
            },
            {
                tag: "security",
                raw: "oauth2 read:users write:users",
            },
        ])
        expect(pathsObject?.operation).toEqual({
            security: [
                {
                    bearerAuth: [],
                },
                {
                    oauth2: ["read:users", "write:users"],
                },
            ],
        })
    })

    test("get servers", () => {
        const pathsObject = getPathsObject([
            {
                tag: "openapi",
                raw: "openapi-annotation",
            },
            {
                tag: "server",
                raw: "https://api.example.com - Production server",
            },
            {
                tag: "server",
                raw: "https://staging.example.com",
            },
        ])
        expect(pathsObject?.operation).toEqual({
            servers: [
                {
                    url: "https://api.example.com",
                    description: "Production server",
                },
                {
                    url: "https://staging.example.com",
                },
            ],
        })
    })

    test("get deprecated", () => {
        const pathsObject = getPathsObject([
            {
                tag: "openapi",
                raw: "openapi-annotation",
            },
            {
                tag: "deprecated",
                raw: "",
            },
        ])
        expect(pathsObject?.operation).toEqual({
            deprecated: true,
        })
    })
})
