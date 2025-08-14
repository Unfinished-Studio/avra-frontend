export type PageType = "wiki" | "session" | "podcast" | "case-study" | null;

export interface PageInfo {
    currentSlug: string | null;
    currentType: PageType;
    currentUrl: string;
}

export const getCurrentPageInfo = (): PageInfo => {
    const dataEl = document.querySelector<HTMLElement>("[avra-element='item-data']");
    const currentUrl = window.location.pathname;

    let currentSlug = null;
    let currentType: PageType = null;

    if (dataEl) {
        currentSlug = dataEl.getAttribute("data-avra-slug");
    }

    // Determine type from URL
    if (currentUrl.includes("/avra-wiki/")) {
        currentType = "wiki";
        if (!currentSlug) {
            // Extract slug from URL if not in data element
            const pathParts = currentUrl.split("/");
            currentSlug = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2];
        }
    } else if (currentUrl.includes("/session-insights/")) {
        currentType = "session";
        if (!currentSlug) {
            const pathParts = currentUrl.split("/");
            currentSlug = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2];
        }
    } else if (currentUrl.includes("/audio-video/")) {
        currentType = "podcast";
        if (!currentSlug) {
            const pathParts = currentUrl.split("/");
            currentSlug = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2];
        }
    } else if (currentUrl.includes("/case-studies/")) {
        currentType = "case-study";
        if (!currentSlug) {
            const pathParts = currentUrl.split("/");
            currentSlug = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2];
        }
    }

    return { currentSlug, currentType, currentUrl };
};
