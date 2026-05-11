import type { JSDocTagInfo } from "@/@types/compiler.ts"
import {
    inferType,
    inferIdentifier,
    inferModifiers,
    inferDescription,
    inferRoute,
    inferStatusCode,
} from "@/syntax/infer/index.ts"
import { inferContentType } from "./infer/infer-content-type.ts"

export type TagProcessor = (tag: JSDocTagInfo) => { key: string; value: any }

export const createTagRegistry = () => {
    const processors = new Map<string, TagProcessor>()

    return {
        register(tagName: string, processor: TagProcessor) {
            processors.set(tagName, processor)
        },
        process(tag: JSDocTagInfo) {
            const processor = processors.get(tag.tag)
            if (processor) {
                return processor(tag)
            }
            return { key: "unknown", value: tag.raw }
        },
    }
}

export const tagRegistry = createTagRegistry()

tagRegistry.register("summary", (tag) => {
    const value = tag.raw.trim()

    return {
        key: "summary",
        value: value || "unknown",
    }
})

tagRegistry.register("description", (tag) => {
    const value = tag.raw.trim()
    if (!value) {
        return { key: "description", value: "unknown" }
    }

    return {
        key: "description",
        value,
    }
})

tagRegistry.register("route", (tag) => {
    const route = inferRoute(tag.raw)
    if (route.method && route.route) {
        return {
            key: "route",
            value: {
                method: route.method,
                route: route.route,
            },
        }
    }
    return {
        key: "route",
        value: "unknown",
    }
})

tagRegistry.register("tag", (tag) => {
    const value = tag.raw.trim()

    return {
        key: "tags",
        value: value || "unknown",
    }
})

tagRegistry.register("operationId", (tag) => {
    const value = tag.raw.trim()

    return {
        key: "operationId",
        value: value || "unknown",
    }
})

tagRegistry.register("externalDocs", (tag) => {
    const value = tag.raw.trim()
    const [url, ...description] = value.split(" ")
    const descriptionStr = description.join(" ")
    if (!url) {
        return {
            key: "externalDocs",
            value: "unknown",
        }
    }

    if (url && descriptionStr) {
        return {
            key: "externalDocs",
            value: {
                url,
                description: descriptionStr,
            },
        }
    }
    return {
        key: "externalDocs",
        value: {
            url: value,
        },
    }
})

tagRegistry.register("param", (tag) => {
    let raw = tag.raw

    const typeRes = inferType(raw)
    raw = typeRes.remaining

    const idRes = inferIdentifier(raw)
    raw = idRes.remaining

    const modRes = inferModifiers(raw)
    raw = modRes.remaining

    const descRes = inferDescription(raw)

    if (idRes.name && idRes.location) {
        return {
            key: "parameters",
            value: {
                name: idRes.name,
                in: idRes.location,
                description: descRes.description,
                required: modRes.required ?? (idRes.location === "path" ? true : false),
                schema: {
                    type: typeRes.type,
                },
            },
        }
    }
    return {
        key: "parameters",
        value: "unknown",
    }
})

tagRegistry.register("body", (tag) => {
    let raw = tag.raw

    const type = inferType(raw, "object")
    raw = type.remaining

    const contentType = inferContentType(raw)
    raw = contentType.remaining

    const modifier = inferModifiers(raw)
    raw = modifier.remaining

    const desc = inferDescription(raw)

    const mediaType = contentType.contentType ?? "application/json"

    const value: Record<string, any> = {
        required: modifier.required ?? true,
        content: {
            [mediaType]: {
                schema: {
                    type: type.type,
                },
            },
        },
    }

    if (desc.description) {
        value.description = desc.description
    }

    return {
        key: "requestBody",
        value,
    }
})

tagRegistry.register("response", (tag) => {
    let raw = tag.raw

    const status = inferStatusCode(raw)
    raw = status.remaining

    const contentType = inferContentType(raw)
    raw = contentType.remaining

    const type = inferType(raw)
    raw = type.remaining

    const desc = inferDescription(raw)

    const statusCode = status.statusCode

    if (!statusCode) {
        return { key: "responses", value: "unknown" }
    }

    const value: Record<string, any> = {
        [statusCode]: {},
    }

    if (desc.description) {
        value[statusCode].description = desc.description
    }

    if (contentType.contentType) {
        let responseType = type.type
        if (!responseType || responseType === "string") {
            if (contentType.contentType === "application/json") {
                responseType = "object"
            }
        }

        value[statusCode].content = {
            [contentType.contentType]: {
                schema: {
                    type: responseType,
                },
            },
        }
    }

    return {
        key: "responses",
        value,
    }
})

tagRegistry.register("security", (tag) => {
    const raw = tag.raw.trim()
    if (!raw) return { key: "security", value: "unknown" }

    const parts = raw.split(/\s+/)
    const scheme = parts[0]
    const scopes = parts.slice(1)

    return {
        key: "security",
        value: {
            [scheme]: scopes,
        },
    }
})

tagRegistry.register("server", (tag) => {
    const raw = tag.raw.trim()
    if (!raw) return { key: "servers", value: "unknown" }

    const match = raw.match(/^([^\s]+)(?:\s*-\s*(.*))?$/)
    if (!match) return { key: "servers", value: { url: raw } }

    const url = match[1]
    const description = match[2]

    const value: Record<string, any> = { url }
    if (description) {
        value.description = description
    }

    return {
        key: "servers",
        value,
    }
})

tagRegistry.register("deprecated", (tag) => {
    return {
        key: "deprecated",
        value: true,
    }
})

tagRegistry.register("version", (tag) => {
    return {
        key: "version",
        value: tag.raw.trim(),
    }
})

tagRegistry.register("title", (tag) => {
    return {
        key: "title",
        value: tag.raw.trim(),
    }
})

tagRegistry.register("termsOfService", (tag) => {
    return {
        key: "termsOfService",
        value: tag.raw.trim(),
    }
})

tagRegistry.register("contact", (tag) => {
    const raw = tag.raw.trim()
    const emailMatch = raw.match(/<([^>]+)>/)
    const email = emailMatch ? emailMatch[1] : undefined
    let remaining = emailMatch
        ? (raw.slice(0, emailMatch.index) + raw.slice(emailMatch.index! + emailMatch[0].length)).trim()
        : raw

    const urlMatch = remaining.match(/(https?:\/\/[^\s]+)/)
    const url = urlMatch ? urlMatch[1] : undefined
    const name = urlMatch
        ? (remaining.slice(0, urlMatch.index) + remaining.slice(urlMatch.index! + urlMatch[0].length)).trim()
        : remaining

    const value: Record<string, any> = {}
    if (name) value.name = name
    if (url) value.url = url
    if (email) value.email = email

    return {
        key: "contact",
        value,
    }
})

tagRegistry.register("license", (tag) => {
    const raw = tag.raw.trim()
    const urlMatch = raw.match(/(https?:\/\/[^\s]+)/)
    const url = urlMatch ? urlMatch[1] : undefined
    const name = urlMatch ? (raw.slice(0, urlMatch.index) + raw.slice(urlMatch.index! + urlMatch[0].length)).trim() : raw

    const value: Record<string, any> = { name }
    if (url) value.url = url

    return {
        key: "license",
        value,
    }
})
