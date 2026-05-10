export interface InferDescription {
    description?: string
    remaining: string
}

export const inferDescription = (raw: string): InferDescription => {
    raw = raw.trim()
    let description = raw.replace(/^[-\s]+/, "")
    if (description.length > 0) {
        return {
            description,
            remaining: "",
        }
    }
    return { remaining: "" }
}
