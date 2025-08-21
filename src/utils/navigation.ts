import { wikiItems, sessionInsightsBatches, podcastArticles } from "@/data/sidebar";
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

const buildContentPageLink = (contentType: ContentType, slug: string): string => {
    const pathSegment = CONTENT_TYPE_SLUG_MAPPINGS[contentType];
    return `/${pathSegment}/${slug}`;
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

const getArticlesForType = (type: PageType): NavigationItem[] => {
    switch (type) {
        case "wiki":
            return getAllWikiArticles();
        case "session":
            return getAllSessionInsights();
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
