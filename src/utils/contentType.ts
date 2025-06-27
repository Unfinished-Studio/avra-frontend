type ContentType = "wiki" | "insight" | "podcast" | "case-study" | "other";

const contentTypeUrlMappings: Record<string, ContentType> = {
    "/avra-wiki/": "wiki",
    "/session-insights/": "insight",
    "/audio-video/": "podcast",
    "/case-studies/": "case-study",
};

const contentTypeOrder = ["wiki", "insight", "podcast", "case-study", "other"] as const;

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
        return (contentTypeOrder.indexOf(typeA) || 4) - (contentTypeOrder.indexOf(typeB) || 4);
    }

    const titleA = a.querySelector('[avra-element="title"]')?.textContent || "";
    const titleB = b.querySelector('[avra-element="title"]')?.textContent || "";
    return titleA.localeCompare(titleB);
};

export type { ContentType };
