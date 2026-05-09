export interface InferType {
    type?: string
    remaining: string
}

export const inferType = (raw: string): InferType => {
    raw = raw.trim()
    const match = raw.match(/^\{([^}]+)\}/)
    if (match) {
        return {
            type: match[1],
            remaining: raw.slice(match[0].length).trim(),
        }
    }
    return {
        type: "string",
        remaining: raw,
    }
}
