export interface InferContentType {
    contentType?: string
    remaining: string
}

export const inferContentType = (raw: string): InferContentType => {
    raw = raw.trim()
    const match = raw.match(/(application\/json|application\/xml|text\/plain|text\/html)(?=\s|$|-)/i)
    if (match && match.index !== undefined) {
        return {
            contentType: match[1].toLowerCase(),
            remaining: (raw.slice(0, match.index) + raw.slice(match.index + match[0].length)).trim(),
        }
    }
    return { remaining: raw }
}
