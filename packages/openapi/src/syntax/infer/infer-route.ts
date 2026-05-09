export interface InferRoute {
    method?: string
    route?: string
    remaining: string
}

export const inferRoute = (raw: string): InferRoute => {
    raw = raw.trim()
    const match = raw.match(/^([A-Z]+)\s+(\S+)/i)
    if (match) {
        return {
            method: match[1].toUpperCase(),
            route: match[2],
            remaining: raw.slice(match[0].length).trim(),
        }
    }
    return { remaining: raw }
}
