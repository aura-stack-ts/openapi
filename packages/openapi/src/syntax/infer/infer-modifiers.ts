export interface InferModifiers {
    required?: boolean
    remaining: string
}

export const inferModifiers = (raw: string): InferModifiers => {
    raw = raw.trim()
    const match = raw.match(/^(required|optional)/i)
    if (match) {
        return {
            required: match[1].toLowerCase() === "required",
            remaining: raw.slice(match[0].length).trim(),
        }
    }
    return { remaining: raw }
}
