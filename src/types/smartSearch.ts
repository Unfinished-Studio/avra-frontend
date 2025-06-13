// Smart Search Types

export type SwiftTypeSearchResult = {
    id: string;
    title: string;
    body: string;
    url: string;
    highlight: {
        sections: string;
        body: string;
    };
    published_at: string;
    updated_at: string;
};

export type SwiftTypeResults = {
    results: SwiftTypeSearchResult[];
};

export type SearchInsight = {
    title: string;
    slug: string;
    transcript: string;
    matchContext: string;
};

export type ElementConfig = {
    elements: Element[];
    initialVisibleCount: number;
    listElement: Element;
    buttonElement?: Element;
    emptyElement?: Element;
};

export type FilterState = {
    activeFilters: Set<string>;
    searchQuery: string;
};
