import type { JSDocTagInfo } from "@/@types/compiler.ts"
import { inferType, inferIdentifier, inferModifiers, inferDescription, inferRoute } from "@/syntax/infer/index.ts"

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
                /**
                 * Not standard OpenAPI.
                 */
                type: typeRes.type,
            },
        }
    }
    return {
        key: "parameters",
        value: "unknown",
    }
})
