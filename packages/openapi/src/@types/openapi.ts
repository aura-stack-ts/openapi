/**
 * OpenAPI 3.0.x Specification Types
 * Based on: https://spec.openapis.org/oas/v3.0.3
 */

/**
 * The OpenAPI Object is the root object of the OpenAPI specification document.
 */
export interface OpenAPISpec {
    openapi: `3.${number}.${number}`
    info: InfoObject
    servers?: ServerObject[]
    paths: PathsObject
    components?: ComponentsObject
    security?: SecurityRequirementObject[]
    tags?: TagObject[]
    externalDocs?: ExternalDocumentationObject
}

/**
 * The Info Object contains the API information such as title, description, version.
 */
export interface InfoObject {
    title: string
    description?: string
    termsOfService?: string
    contact?: ContactObject
    license?: LicenseObject
    version: string
}

/**
 * Contact information for the exposed API.
 */
export interface ContactObject {
    name?: string
    url?: string
    email?: string
}

/**
 * License information for the exposed API.
 */
export interface LicenseObject {
    name: string
    url?: string
}

/**
 * Server object contains information about the servers to which the API may be deployed.
 */
export interface ServerObject {
    url: string
    description?: string
    variables?: Record<string, ServerVariableObject>
}

/**
 * Server Variable Object contains values for a server variable.
 */
export interface ServerVariableObject {
    enum?: string[]
    default: string
    description?: string
}

/**
 * Paths Object contains the relative paths to the individual endpoints.
 * Each path is passed as a key that MUST begin with a leading slash (/).
 */
export type PathsObject = Record<string, PathItemObject>

/**
 * Path Item Object describes the operations available on a single path.
 */
export interface PathItemObject {
    $ref?: string
    summary?: string
    description?: string
    get?: OperationObject
    put?: OperationObject
    post?: OperationObject
    delete?: OperationObject
    options?: OperationObject
    head?: OperationObject
    patch?: OperationObject
    trace?: OperationObject
    servers?: ServerObject[]
    parameters?: (ParameterObject | ReferenceObject)[]
}

/**
 * Operation Object describes a single API operation on a path.
 */
export interface OperationObject {
    tags?: string[]
    summary?: string
    description?: string
    externalDocs?: ExternalDocumentationObject
    operationId?: string
    parameters?: (ParameterObject | ReferenceObject)[]
    requestBody?: RequestBodyObject | ReferenceObject
    responses: ResponsesObject
    deprecated?: boolean
    security?: SecurityRequirementObject[]
    servers?: ServerObject[]
}

/**
 * External Documentation Object.
 */
export interface ExternalDocumentationObject {
    url: string
    description?: string
}

/**
 * Parameter Object describes a single operation parameter.
 */
export interface ParameterObject {
    name: string
    in: "query" | "header" | "path" | "cookie"
    description?: string
    required?: boolean
    deprecated?: boolean
    allowEmptyValue?: boolean
    style?: string
    explode?: boolean
    allowReserved?: boolean
    schema?: SchemaObject | ReferenceObject
    example?: any
    examples?: Record<string, ExampleObject | ReferenceObject>
    content?: Record<string, MediaTypeObject>
}

/**
 * Request Body Object describes a single request body.
 */
export interface RequestBodyObject {
    description?: string
    content: Record<string, MediaTypeObject>
    required?: boolean
}

/**
 * Media Type Object provides schema and examples for a media type.
 */
export interface MediaTypeObject {
    schema?: SchemaObject | ReferenceObject
    example?: any
    examples?: Record<string, ExampleObject | ReferenceObject>
    encoding?: Record<string, EncodingObject>
}

/**
 * Example Object.
 */
export interface ExampleObject {
    summary?: string
    description?: string
    value?: any
    externalValue?: string
}

/**
 * Encoding Object.
 */
export interface EncodingObject {
    contentType?: string
    headers?: Record<string, HeaderObject | ReferenceObject>
    style?: string
    explode?: boolean
    allowReserved?: boolean
}

/**
 * Responses Object is a container for the possible responses as they are returned from executing this operation.
 */
export type ResponsesObject = Record<string, ResponseObject | ReferenceObject>

/**
 * Response Object describes a single response from an API Operation.
 */
export interface ResponseObject {
    description: string
    headers?: Record<string, HeaderObject | ReferenceObject>
    content?: Record<string, MediaTypeObject>
    links?: Record<string, LinkObject | ReferenceObject>
}

/**
 * Header Object follows the structure of the Parameter Object.
 */
export interface HeaderObject extends Omit<ParameterObject, "name" | "in"> {}

/**
 * Link Object represents a possible design-time link for a response.
 */
export interface LinkObject {
    operationRef?: string
    operationId?: string
    parameters?: Record<string, any>
    requestBody?: any
    description?: string
    server?: ServerObject
}

/**
 * Schema Object allows the definition of input and output data types.
 */
export interface SchemaObject {
    [key: string]: any
    type?: string
    format?: string
    title?: string
    multipleOf?: number
    maximum?: number
    exclusiveMaximum?: boolean
    minimum?: number
    exclusiveMinimum?: boolean
    maxLength?: number
    minLength?: number
    pattern?: string
    maxItems?: number
    minItems?: number
    uniqueItems?: boolean
    maxProperties?: number
    minProperties?: number
    required?: string[]
    enum?: any[]
    allOf?: (SchemaObject | ReferenceObject)[]
    oneOf?: (SchemaObject | ReferenceObject)[]
    anyOf?: (SchemaObject | ReferenceObject)[]
    not?: SchemaObject | ReferenceObject
    items?: SchemaObject | ReferenceObject
    properties?: Record<string, SchemaObject | ReferenceObject>
    additionalProperties?: boolean | SchemaObject | ReferenceObject
    description?: string
    default?: any
    nullable?: boolean
    discriminator?: DiscriminatorObject
    readOnly?: boolean
    writeOnly?: boolean
    xml?: XMLObject
    externalDocs?: ExternalDocumentationObject
    example?: any
    deprecated?: boolean
}

/**
 * Discriminator Object.
 */
export interface DiscriminatorObject {
    propertyName: string
    mapping?: Record<string, string>
}

/**
 * XML Object.
 */
export interface XMLObject {
    name?: string
    namespace?: string
    prefix?: string
    attribute?: boolean
    wrapped?: boolean
}

/**
 * Components Object holds a set of reusable objects for different aspects of the OAS.
 */
export interface ComponentsObject {
    schemas?: Record<string, SchemaObject | ReferenceObject>
    responses?: Record<string, ResponseObject | ReferenceObject>
    parameters?: Record<string, ParameterObject | ReferenceObject>
    examples?: Record<string, ExampleObject | ReferenceObject>
    requestBodies?: Record<string, RequestBodyObject | ReferenceObject>
    headers?: Record<string, HeaderObject | ReferenceObject>
    securitySchemes?: Record<string, SecuritySchemeObject | ReferenceObject>
    links?: Record<string, LinkObject | ReferenceObject>
    callbacks?: Record<string, CallbackObject | ReferenceObject>
}

/**
 * Security Scheme Object.
 */
export interface SecuritySchemeObject {
    type: "apiKey" | "http" | "oauth2" | "openIdConnect"
    description?: string
    name?: string
    in?: string
    scheme?: string
    bearerFormat?: string
    flows?: OAuthFlowsObject
    openIdConnectUrl?: string
}

/**
 * OAuth Flows Object.
 */
export interface OAuthFlowsObject {
    implicit?: OAuthFlowObject
    password?: OAuthFlowObject
    clientCredentials?: OAuthFlowObject
    authorizationCode?: OAuthFlowObject
}

/**
 * OAuth Flow Object.
 */
export interface OAuthFlowObject {
    authorizationUrl?: string
    tokenUrl?: string
    refreshUrl?: string
    scopes: Record<string, string>
}

/**
 * Security Requirement Object.
 */
export type SecurityRequirementObject = Record<string, string[]>

/**
 * Tag Object adds metadata to a single tag that is used by the Operation Object.
 */
export interface TagObject {
    name: string
    description?: string
    externalDocs?: ExternalDocumentationObject
}

/**
 * Callback Object.
 */
export type CallbackObject = Record<string, PathItemObject>

/**
 * Reference Object.
 */
export interface ReferenceObject {
    $ref: string
}

// #region OpenAPI Generation Metadata

/**
 * Metadata for OpenAPI generation from endpoints.
 */
export interface EndpointOpenAPIMetadata {
    description?: string
    tags?: string[]
    operationId?: string
    deprecated?: boolean
    externalDocs?: ExternalDocumentationObject
    responses?: Record<string, ResponseObject>
    security?: SecurityRequirementObject[]
    servers?: ServerObject[]
    summary?: string
}

/**
 * Configuration for creating an OpenAPI specification from endpoints.
 */
export interface CreateOpenAPIConfig {
    info: InfoObject
    servers?: ServerObject[]
    components?: ComponentsObject
    security?: SecurityRequirementObject[]
    tags?: TagObject[]
    externalDocs?: ExternalDocumentationObject
}

/**
 * OpenAPI generation result with the spec and metadata.
 */
export interface OpenAPIGenerationResult {
    spec: OpenAPISpec
    components: {
        schemas: Record<string, SchemaObject>
    }
}
