export const isPlainKey = (key: any): boolean => {
    const plainKeys = ["summary", "description", "operationId", "deprecated"]
    return plainKeys.includes(key)
}

export const isArrayKey = (key: any): boolean => {
    const arrayKeys = ["tags", "parameters", "security", "servers"]
    return arrayKeys.includes(key)
}

export const isObjectKey = (key: any): boolean => {
    const objectKeys = ["requestBody", "responses", "externalDocs"]
    return objectKeys.includes(key)
}
