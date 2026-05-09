export interface InferStatusCode {
    statusCode?: string
    remaining: string
}

export const inferStatusCode = (raw: string): InferStatusCode => {
    raw = raw.trim()
    const match = raw.match(/^(\d{3}|default)/i)
    if (match) {
        return {
            statusCode: match[1],
            remaining: raw.slice(match[0].length).trim(),
        }
    }
    return { remaining: raw }
}
