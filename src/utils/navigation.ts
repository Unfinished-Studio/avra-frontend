import { wikiItems, sessionInsightsBatches, podcastArticles, alumniSessionCategories } from "@/data/sidebar";
import { getCurrentPageInfo, type PageType } from "@/utils/page-info";
import { CONTENT_TYPE_SLUG_MAPPINGS } from "@/constants";
import type { ContentType } from "@/data/content";

export interface NavigationItem {
    title: string;
    href: string;
}

export interface NavigationInfo {
    previous: NavigationItem | null;
    next: NavigationItem | null;
}

const buildContentPageLink = (contentType: ContentType, slug: string, preserveParams: boolean = false): string => {
    const pathSegment = CONTENT_TYPE_SLUG_MAPPINGS[contentType];
    let url = `/${pathSegment}/${slug}`;

    if (preserveParams) {
        // Preserve existing URL parameters and hash from current location
        const currentUrl = new URL(window.location.href);
        const params = currentUrl.searchParams;
        const hash = currentUrl.hash;

        // Only add parameters if they exist
        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        // Add hash if it exists
        if (hash) {
            url += hash;
        }
    }

    return url;
};

const getAllWikiArticles = (): NavigationItem[] => {
    return wikiItems.map((item) => ({
        title: item.title,
        href: buildContentPageLink("Wiki", item.slug),
    }));
};

const getAllSessionInsights = (): NavigationItem[] => {
    const articles: NavigationItem[] = [];

    for (const batch of sessionInsightsBatches) {
        for (const insight of batch.sessionInsights) {
            articles.push({
                title: insight.name,
                href: buildContentPageLink("Session Insights", insight.slug),
            });
        }
    }

    return articles;
};

const getAllPodcasts = (): NavigationItem[] => {
    return podcastArticles.map((article) => ({
        title: article.name,
        href: buildContentPageLink("Podcasts", article.slug),
    }));
};

const getAllAlumniSessions = (): NavigationItem[] => {
    const sessions: NavigationItem[] = [];

    for (const category of alumniSessionCategories) {
        for (const session of category.sessions) {
            sessions.push({
                title: session.name,
                href: buildContentPageLink("Session Insights", session.slug),
            });
        }
    }

    return sessions;
};

const getArticlesForType = (type: PageType): NavigationItem[] => {
    switch (type) {
        case "wiki":
            return getAllWikiArticles();
        case "session":
            // Combine regular session insights and alumni sessions
            return [...getAllSessionInsights(), ...getAllAlumniSessions()];
        case "podcast":
            return getAllPodcasts();
        case "case-study":
            // TODO: Add case studies if needed
            return [];
        default:
            return [];
    }
};

export const getNavigationInfo = (): NavigationInfo => {
    const { currentType, currentUrl } = getCurrentPageInfo();

    if (!currentType) {
        return { previous: null, next: null };
    }

    const articles = getArticlesForType(currentType);
    const currentIndex = articles.findIndex((article) => article.href === currentUrl);

    if (currentIndex === -1) {
        return { previous: null, next: null };
    }

    const previous = currentIndex > 0 ? articles[currentIndex - 1] : null;
    const next = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;

    return { previous, next };
};

/**
 * Utility function to preserve URL parameters when navigating
 * This can be used for testing or manual navigation
 */
export const preserveUrlParams = (targetUrl: string): string => {
    const currentUrl = new URL(window.location.href);
    const target = new URL(targetUrl, window.location.origin);

    // Copy all current search parameters to the target URL
    currentUrl.searchParams.forEach((value, key) => {
        // Don't override parameters that are already in the target URL
        if (!target.searchParams.has(key)) {
            target.searchParams.set(key, value);
        }
    });

    // Preserve hash if target URL doesn't have one
    if (!target.hash && currentUrl.hash) {
        target.hash = currentUrl.hash;
    }

    return target.toString().replace(window.location.origin, "");
};
