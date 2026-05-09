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
        expect(pathsObject?.operation).toMatchObject({
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
        expect(pathsObject?.operation).toMatchObject({
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

        expect(pathsObject?.operation).toMatchObject({
            parameters: [
                {
                    description: "param description",
                    in: "path",
                    name: "name",
                    required: true,
                    type: "string",
                },
                {
                    description: "param description",
                    in: "query",
                    name: "age",
                    required: false,
                    type: "number",
                },
                {
                    description: "param description",
                    in: "header",
                    name: "active",
                    required: false,
                    type: "boolean",
                },
                {
                    description: "param description",
                    in: "cookie",
                    name: "session",
                    required: false,
                    type: "string",
                },
                {
                    description: "param description",
                    in: "path",
                    name: "id",
                    required: true,
                    type: "string",
                },
                {
                    description: "param description",
                    in: "query",
                    name: "age",
                    required: false,
                    type: "string",
                },
                {
                    description: "param description",
                    in: "query",
                    name: "id",
                    required: true,
                    type: "string",
                },
                {
                    description: "param description",
                    in: "query",
                    name: "id",
                    required: true,
                    type: "string",
                },
            ],
        })
    })
})
