/**
 * Metadata information extracted from JSDoc comments for a function or method.
 *
 * @example
 * const tagInfo: JSDocTagInfo = {
 *   name: "a",
 *   description: "The first number.",
 *   tag: "param",
 *   type: "number"
 * }
 */
export interface JSDocTagInfo {
    /**
     * The description of the tag, which may include additional details about the parameter, return value, or other information relevant to the tag. This is optional and may not be present for all tags.
     */
    name?: string
    /**
     * The description of the tag, which may include additional details about the parameter, return value, or other information relevant to the tag. This is optional and may not be present for all tags.
     */
    description?: string
    /**
     * The name of the tag (e.g., "param", "returns", "deprecated", etc.).
     */
    tag: string
    /**
     * The type of the tag (e.g., "number", "string", "boolean", etc.). This is optional and may not be present for all tags.
     */
    type?: string
}

/**
 * Metadata information extracted from JSDoc comments for a function or method, including its name,
 * description, and associated tags. {@link JSDocTagInfo}
 *
 * @example
 * const metadata: FunctionMetadata = {
 *   name: "add",
 *   description: "Adds two numbers together.",
 *   tags: [
 *     { tag: "param", name: "a", description: "The first number.", type: "number" },
 *     { tag: "param", name: "b", description: "The second number.", type: "number" },
 *     { tag: "returns", description: "The sum of a and b.", type: "number" },
 *   ],
 * }
 */
export interface FunctionMetadata {
    /**
     * The name of the function or method.
     */
    name: string
    /**
     * The description of the function or method, which may include details about its purpose,
     * behavior, and usage. This is optional and may not be present for all functions or methods.
     */
    description?: string
    /**
     * An array of JSDoc tags associated with the function or method, providing additional
     * information about parameters, return values, deprecation status, and other relevant details.
     * Each tag includes its name, description, type, and the tag itself (e.g., "param", "returns", etc.).
     */
    tags: JSDocTagInfo[]
}

export interface FileMetadata {
    filePath: string
    functions: FunctionMetadata[]
}
