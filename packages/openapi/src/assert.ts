export const isPlainKey = (key: any): boolean => {
    const plainKeys = ["summary", "description", "operationId", "externalDocs"]
    return plainKeys.includes(key)
}

export const isArrayKey = (key: any): boolean => {
    const arrayKeys = ["tags", "parameters"]
    return arrayKeys.includes(key)
}

export const isObjectKey = (key: any): boolean => {
    const objectKeys = ["requestBody", "responses"]
    return objectKeys.includes(key)
}
