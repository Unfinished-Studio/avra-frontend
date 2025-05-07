type ContentType = "wiki" | "insight" | "podcast" | "other";

const contentTypeUrlMappings: Record<string, ContentType> = {
    "/avra-wiki/": "wiki",
    "/session-insights/": "insight",
    "/audio-video/": "podcast",
};

const contentTypeOrder = ["wiki", "insight", "podcast", "other"] as const;

export const getContentType = (url: string): ContentType => {
    for (const [urlPattern, contentType] of Object.entries(contentTypeUrlMappings)) {
        if (url.includes(urlPattern)) {
            return contentType;
        }
    }
    return "other";
};

export const sortByContentType = (a: Element, b: Element) => {
    const typeA = getContentType(a.getAttribute("href") || "");
    const typeB = getContentType(b.getAttribute("href") || "");

    if (typeA !== typeB) {
        return (contentTypeOrder.indexOf(typeA) || 3) - (contentTypeOrder.indexOf(typeB) || 3);
    }

    const titleA = a.querySelector('[avra-element="title"]')?.textContent || "";
    const titleB = b.querySelector('[avra-element="title"]')?.textContent || "";
    return titleA.localeCompare(titleB);
};

export type { ContentType };
