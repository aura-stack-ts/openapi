export const infoKeys = ["version", "title", "description", "termsOfService", "contact", "license"] as const

export const isPlainKey = (key: any): boolean => {
    const plainKeys = ["summary", "description", "operationId", "deprecated", "version", "title", "termsOfService"]
    return plainKeys.includes(key)
}

export const isArrayKey = (key: any): boolean => {
    const arrayKeys = ["tags", "parameters", "security", "servers"]
    return arrayKeys.includes(key)
}

export const isObjectKey = (key: any): boolean => {
    const objectKeys = ["requestBody", "responses", "externalDocs", "contact", "license"]
    return objectKeys.includes(key)
}

export const isInfoKey = (key: any): boolean => {
    return infoKeys.includes(key)
}

export const isGlobalKey = (key: any): boolean => {
    const globalKeys = ["security", "tags", "externalDocs", "servers", ...infoKeys]
    return globalKeys.includes(key)
}
