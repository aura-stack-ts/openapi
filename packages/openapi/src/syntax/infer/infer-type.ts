export interface InferType {
    type?: string
    remaining: string
}

export const inferType = (raw: string, defaultType: string = "string"): InferType => {
    raw = raw.trim()
    // {User} content ...
    const match = raw.match(/\{([^}]+)\}/)
    if (match) {
        return {
            type: match[1],
            remaining: (raw.slice(0, match.index) + raw.slice(match.index! + match[0].length)).trim(),
        }
    }
    return {
        type: defaultType,
        remaining: raw,
    }
}
