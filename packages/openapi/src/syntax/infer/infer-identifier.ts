export interface InferIdentifier {
    name?: string
    location?: string
    remaining: string
}

export const inferIdentifier = (raw: string): InferIdentifier => {
    raw = raw.trim()
    const match = raw.match(/^([a-zA-Z0-9_]+)(?:\.([a-zA-Z0-9_]+))?/)
    if (match) {
        const name = match[1]
        if (name === "required" || name === "optional") {
            return { remaining: raw }
        }
        return {
            name,
            location: match[2],
            remaining: raw.slice(match[0].length).trim(),
        }
    }
    return { remaining: raw }
}
