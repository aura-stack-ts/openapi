import type { OperationObject } from "@/@types/openapi.ts"

export type HTTPMethod = "get" | "post" | "put" | "delete" | "patch" | "options" | "head" | "trace"

export interface PathObjectDefinition {
    route: {
        route: string
        method: string
    }
    operation: OperationObject
}
