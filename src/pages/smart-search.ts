import { getStaging } from "@/utils/admin/get-staging";
import { getContentType, sortByContentType } from "@/utils/content-type";
import { debounce } from "@/utils/debounce";
import { getElement, getElements } from "@/utils/dom/elements";
import { CONTENT_ITEMS, WikiTagEnum, type WikiTag } from "@/data/content";
import type { SwiftTypeResults, SwiftTypeSearchResult } from "@/types/smart-search";

// constants
const SMART_SEARCH_CONFIG = {
    api: getStaging() ? "http://localhost:8787" : "https://avra-worker.nic-f66.workers.dev", // TODO: use avracap.com domain in prod
    searchDebounce: 500, // ms
    searchResults: 8, // the maximum number of results to show in the results preview
    contentTypeOrder: ["wiki", "insight", "podcast", "case-study", "other"],
    wikiTagFilters: Object.values(WikiTagEnum) as WikiTag[],
} as const;

const handleSearch = async (query: string) => {
    const params = new URLSearchParams([["query", query]]);
    const response = await fetch(`${SMART_SEARCH_CONFIG.api}/api/site-search?${String(params)}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Failed to fetch search results - ${response.status} ${err}`);
    }

    const data: SwiftTypeResults = await response.json();
    return data.results;
};

// Helper function to extract clean text from highlight
const extractCleanHighlightText = (highlightBody: string): string => {
    // Remove HTML tags and get the text between <em> tags
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = highlightBody;
    const emElements = tempDiv.querySelectorAll("em");

    if (emElements.length > 0) {
        // Get the first highlighted term
        return emElements[0].textContent?.trim() || "";
    }

    // Fallback: remove all HTML and get first few words
    return tempDiv.textContent?.trim().split(" ").slice(0, 5).join(" ") || "";
};

// Define wiki tag filter options using the WikiTag enum
const WIKI_TAG_FILTERS: WikiTag[] = Object.values(WikiTagEnum);

// Helper function to check if an item matches a wiki tag filter
const itemMatchesWikiTag = (item: any, filterTag: string): boolean => {
    if (!item.wikiTag || item.wikiTag === "n/a") return false;

    // special case for mission, strategy, and metrics
    const tag = item.wikiTag;
    if (tag === WikiTagEnum.MISSION_STRATEGY_AND_METRICS) {
        return tag === filterTag;
    }

    // Handle comma-separated tags
    const itemTags = item.wikiTag.split(",").map((tag: string) => tag.trim());
    return itemTags.includes(filterTag);
};

window.Webflow ||= [];
window.Webflow.push(async () => {
    if (!SMART_SEARCH_CONFIG) {
        return;
    }
    console.log("config.api", SMART_SEARCH_CONFIG.api);

    const searchForm = getElement("[avra-element='ss-search-form']");
    const searchInput = getElement<HTMLInputElement>("[avra-element='ss-search-input']", searchForm);
    const submitButton = getElement("[avra-element='submit-button']");
    submitButton.classList.remove("is-active");

    const contentBtn = getElement("[avra-element='ss-content-btn']");
    const contentEmptyEl = getElement("[avra-element='ss-content-empty']");
    const resultsListEl = getElement("[avra-element='ss-list']");

    const modalEl = getElement("[avra-element='ss-modal']");
    const modalListEl = getElement("[avra-element='ss-modal-list']", modalEl);

    const modalSearchForm = getElement("[avra-element='ss-modal-search-form']", modalEl);
    // const modalSearchInput = getElement<HTMLInputElement>("[avra-element='ss-modal-search-input']", modalSearchForm);

    const modalResultCountEl = getElement("[avra-element='ss-modal-result-count']", modalEl);
    const modalResultQueryEl = getElement("[avra-element='ss-modal-result-query']", modalEl);

    const podcastList = getElement("[avra-element='ss-podcast-list']");
    const podcastEls = getElements("[avra-element='ss-podcast']", podcastList);

    const insightList = getElement("[avra-element='ss-insight-list']");
    const insightEls = getElements("[avra-element='ss-insight']", insightList);

    const wikiList = getElement("[avra-element='ss-wiki-list']");
    const wikiEls = getElements("[avra-element='ss-wiki']", wikiList);

    const caseStudyList = getElement("[avra-element='ss-case-study-list']");
    const caseStudyEls = getElements("[avra-element='ss-case-study']", caseStudyList);

    const wikiFilterTemplate = getElement("[avra-element='ss-wiki-filter']");

    const createWikiFilters = (templateEl: HTMLElement) => {
        const filterList = templateEl.parentElement!;
        const wikiFilterEls: HTMLElement[] = [];

        console.log("creating wiki filters", WIKI_TAG_FILTERS);

        for (const tag of WIKI_TAG_FILTERS) {
            const filterEl = templateEl.cloneNode(true) as HTMLElement;
            filterEl.classList.remove("ss-filter-active");

            console.log(filterEl);

            const filterInput = getElement<HTMLInputElement>("input", filterEl);
            const filterTxt = getElement("span", filterEl);

            filterInput.value = tag;
            filterTxt.textContent = tag;

            filterInput.addEventListener("change", (e) => {
                const filterValue = (e.target as HTMLInputElement).value;
                const checked = (e.target as HTMLInputElement).checked;

                if (checked) {
                    console.log("setting filter value:", filterValue);

                    filterEl.classList.add("ss-filter-active");
                } else {
                    console.log("removing filter value:", filterValue);

                    filterEl.classList.remove("ss-filter-active");
                }

                for (const filter of wikiFilterEls) {
                    const input = getElement<HTMLInputElement>("input", filter);
                    if (input.value !== filterValue && input.checked) {
                        filter.click();
                    }
                }

                console.log("reset other filters");

                handleWikiFilter(filterInput.value);
            });

            wikiFilterEls.push(filterEl);
        }

        filterList.textContent = "";
        for (const filterEl of wikiFilterEls) {
            filterList.appendChild(filterEl);
        }

        return wikiFilterEls;
    };

    let activeFilters = new Set<string>();
    const handleWikiFilter = (filterValue: string) => {
        console.log("handling filter change", filterValue);

        if (activeFilters.has(filterValue)) {
            activeFilters.delete(filterValue);
        } else {
            activeFilters.add(filterValue);
        }

        // If there's an active search query, re-run the search with new filter
        const hasActiveSearch = searchInput.value.toLowerCase().trim().length > 0;
        if (hasActiveSearch) {
            const searchValue = searchInput.value.toLowerCase().trim();
            debouncedSearch(searchValue);
        } else {
            applyFilterToAllContent();
        }
    };

    const applyFilterToAllContent = () => {
        console.log("applying filter to all content", activeFilters);

        let visibleCount = 0;

        for (const el of allContentElements) {
            const slug = el.getAttribute("data-avra-slug");
            const contentItem = CONTENT_ITEMS.find((item) => item.slug === slug);

            // Check if element matches tag filter
            const matchesTagFilter =
                activeFilters.size === 0 ||
                (contentItem && Array.from(activeFilters).some((filter) => itemMatchesWikiTag(contentItem, filter)));

            // If there's no active search, show/hide based on tag filter only
            // If there's an active search, only show elements that match tag filter AND are not hidden by search
            const hasActiveSearch = searchInput.value.toLowerCase().trim().length > 0;

            if (matchesTagFilter && (!hasActiveSearch || el.getAttribute("data-avra-hidden") !== "search")) {
                el.style.display = "block";
                visibleCount++;
            } else {
                el.style.display = "none";
            }
        }

        if (contentEmptyEl) {
            contentEmptyEl.style.display = visibleCount === 0 ? "" : "none";
        }
    };

    createWikiFilters(wikiFilterTemplate);

    // Move all content elements to the visible list and sort them
    const allContentElements = [...wikiEls, ...insightEls, ...podcastEls, ...caseStudyEls].sort(sortByContentType);

    resultsListEl.innerHTML = "";
    allContentElements.forEach((el) => {
        // clear webflow CMS classes
        el.classList.remove("w-dyn-bind-empty");
        const resultText = getElement("[avra-element='ss-card-text']", el);
        if (resultText) {
            resultText.classList.remove("w-dyn-bind-empty");
        }

        // show only wikis initially (this logic might need adjustment based on your needs)
        const elementAttr = el.getAttribute("avra-element");
        if (elementAttr && elementAttr !== "ss-wiki") {
            el.style.display = "none";
        }

        resultsListEl.appendChild(el);
    });

    contentEmptyEl.style.display = "none";

    // Create debounced search handler
    const debouncedSearch = debounce(async (searchValue: string) => {
        let visibleContentCount = 0;
        let hiddenContentCount = 0;

        const listEl = getElement("[avra-element='ss-list']");
        const listEls = getElements("[avra-element]", listEl);

        // sort results by result type -> a-z
        const results = (await handleSearch(searchValue)).map((result) => {
            return {
                ...result,
                type: getContentType(result.url),
            };
        });

        // Check for keyword matches in content items
        const searchTerms = searchValue.toLowerCase().split(/\s+/);
        const keywordMatches = CONTENT_ITEMS.filter((item) => {
            // Check if any search term matches any keyword (case insensitive)
            const keywordMatch = item.keywords.some((keyword) =>
                searchTerms.some((term) => keyword.toLowerCase().includes(term) || term.includes(keyword.toLowerCase()))
            );

            // Apply wiki tag filter
            const tagMatch = activeFilters.size === 0 || Array.from(activeFilters).some((filter) => itemMatchesWikiTag(item, filter));

            return keywordMatch && tagMatch;
        });

        console.log("Keyword matches found:", keywordMatches);

        // Get slugs from API results to avoid duplicates
        const apiResultSlugs = new Set(
            results.map((result) => {
                const urlParts = result.url.split("/");
                return urlParts[urlParts.length - 1];
            })
        );

        // Filter API results by wiki tag
        const filteredResults = results.filter((result) => {
            if (activeFilters.size === 0) return true;

            const slug = result.url.split("/").pop();
            const contentItem = CONTENT_ITEMS.find((item) => item.slug === slug);
            return contentItem && Array.from(activeFilters).some((filter) => itemMatchesWikiTag(contentItem, filter));
        });

        // Filter out keyword matches that are already in API results
        const newKeywordMatches = keywordMatches.filter((item) => !apiResultSlugs.has(item.slug));

        console.log("New keyword matches (not in API results):", newKeywordMatches);

        // hide all content elements
        for (const el of allContentElements) {
            el.style.display = "none";
            el.setAttribute("data-avra-hidden", "search");
        }

        // Helper function to process a result (API or keyword match) (modifies the html card)
        const processResult = (result: any, isKeywordMatch = false) => {
            const matchEl = listEls.find((el) => {
                const slug = el.getAttribute("data-avra-slug");
                const resultSlug = isKeywordMatch ? result.slug : result.url.split("/").pop();
                return slug === resultSlug;
            });

            if (matchEl) {
                // inject highlight text
                const resultText = getElement("[avra-element='ss-card-text']", matchEl);
                if (resultText) {
                    if (isKeywordMatch) {
                        // For keyword matches, show matched keywords
                        const matchedKeywords = result.keywords.filter((keyword: string) =>
                            searchTerms.some((term: string) => keyword.toLowerCase().includes(term) || term.includes(keyword.toLowerCase()))
                        );
                        resultText.innerHTML = `Keyword match: <strong>${matchedKeywords.join(", ")}</strong>`;
                    } else {
                        // For API results, use highlight from search
                        resultText.innerHTML = result.highlight.body.replace(/<em>/g, "<strong>").replace(/<\/em>/g, "</strong>");
                    }
                    resultText.classList.remove("w-dyn-bind-empty");
                }

                // Add highlighted text as query parameter to anchor links
                const highlightText = isKeywordMatch ? searchValue : extractCleanHighlightText(result.highlight?.body || "");
                if (!isKeywordMatch) {
                    console.log("highlightText", highlightText);
                }
                const links = matchEl.querySelectorAll<HTMLAnchorElement>("a");
                links.forEach((link) => {
                    if (highlightText && link.href) {
                        const url = new URL(link.href);
                        url.searchParams.set("highlight", highlightText);
                        link.href = url.toString();
                    }
                });

                // add to results modal
                if (visibleContentCount === 0) {
                    modalListEl.innerHTML = "";
                }
                const matchElClone = matchEl.cloneNode(true) as HTMLElement;
                matchElClone.style.display = "block";

                // Also add highlight query parameter to modal clone links
                if (highlightText) {
                    const cloneLinks = matchElClone.querySelectorAll<HTMLAnchorElement>("a");
                    cloneLinks.forEach((link) => {
                        if (link.href) {
                            const url = new URL(link.href);
                            url.searchParams.set("highlight", highlightText);
                            link.href = url.toString();
                        }
                    });
                }

                modalListEl.appendChild(matchElClone);

                // maximum
                if (visibleContentCount >= SMART_SEARCH_CONFIG.searchResults) {
                    // console.log("max results reached, not showing in search results");
                    hiddenContentCount++;
                    return false; // don't show in main results
                }

                // make visible
                matchEl.style.display = "block";
                matchEl.removeAttribute("data-avra-hidden");
                visibleContentCount++;
                (listEl.parentElement as HTMLElement).style.display = "";

                return true; // was shown in main results
            } else {
                const resultType = isKeywordMatch ? result.type : result.type;
                const resultSlug = isKeywordMatch ? result.slug : result.url;
                console.warn(`No matching element found for ${resultType} with slug: ${resultSlug}`);
                hiddenContentCount++;
                return false;
            }
        };

        // Process filtered API results first
        // show/hide based on matching tag
        for (const result of filteredResults) {
            processResult(result, false);
        }

        // Process keyword matches that weren't in API results
        for (const keywordMatch of newKeywordMatches) {
            processResult(keywordMatch, true);
        }

        // Show/hide content empty state based on visible count
        if (contentEmptyEl) {
            contentEmptyEl.style.display = visibleContentCount === 0 ? "" : "none";
        }

        // Update the content count display
        if (contentBtn) {
            contentBtn.textContent = hiddenContentCount > 0 ? `View ${hiddenContentCount} More` : "View All";
        }

        if (visibleContentCount === 0) {
            contentBtn.textContent = "View All";
        }

        // Update the modal result count and query
        modalResultCountEl.textContent = `${visibleContentCount + hiddenContentCount} results for "${searchValue}"`;
        modalResultQueryEl.textContent = searchValue;

        // sort modal results by content type
        const sortedElements = Array.from(modalListEl.children);
        sortedElements.sort(sortByContentType);

        // Clear and re-append in sorted order
        modalListEl.innerHTML = "";
        sortedElements.forEach((element) => {
            modalListEl.appendChild(element);
        });
    }, SMART_SEARCH_CONFIG.searchDebounce);

    // Function to trigger immediate search
    const triggerImmediateSearch = async () => {
        const searchValue = searchInput.value.toLowerCase().trim();
        if (searchValue.length > 0) {
            clearSelection();
            await debouncedSearch(searchValue);
        }
    };

    searchInput.addEventListener("input", async (e) => {
        const searchValue = (e.target as HTMLInputElement).value.toLowerCase().trim();

        if (submitButton) {
            if (searchValue.length > 0) {
                submitButton.classList.add("is-active");
            } else {
                submitButton.classList.remove("is-active");
            }
        }

        if (searchValue.length > 0) {
            debouncedSearchWithClearSelection(searchValue);
        } else {
            // If search is cleared, apply current filter to all content
            // applyFilterToAllContent();
        }
        applyFilterToAllContent();
    });

    // Add submit button click handler
    if (submitButton) {
        submitButton.addEventListener("click", async (e) => {
            e.preventDefault();
            await triggerImmediateSearch();
        });
    }

    // remove webflow form functionality and trigger immediate search
    searchForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await triggerImmediateSearch();
    });
    modalSearchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        e.stopPropagation();
    });

    // Add modal functionality
    const openModal = () => {
        modalEl.style.display = "block";
        document.body.style.overflow = "hidden"; // Prevent background scrolling
    };

    const closeModal = () => {
        modalEl.style.display = "none";
        document.body.style.overflow = ""; // Restore scrolling
    };

    // Open modal when content button is clicked
    contentBtn.addEventListener("click", openModal);

    // Close modal when escape key is pressed
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modalEl.style.display === "block") {
            closeModal();
        }
    });

    // Keyboard navigation for search results
    let selectedIndex = -1;
    const selectedClass = "ss-selected";

    const getVisibleElements = (): Element[] => {
        return Array.from(resultsListEl.children).filter((el) => {
            const htmlEl = el as HTMLElement;
            return htmlEl.style.display !== "none";
        });
    };

    const updateSelection = (newIndex: number) => {
        const visibleElements = getVisibleElements();

        // Clear previous selection
        if (selectedIndex >= 0 && selectedIndex < visibleElements.length) {
            visibleElements[selectedIndex].classList.remove(selectedClass);
        }

        // Set new selection
        selectedIndex = newIndex;
        if (selectedIndex >= 0 && selectedIndex < visibleElements.length) {
            visibleElements[selectedIndex].classList.add(selectedClass);
            // Scroll selected element into view
            visibleElements[selectedIndex].scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            });
        }
    };

    const clearSelection = () => {
        updateSelection(-1);
    };

    const navigateToSelected = () => {
        const visibleElements = getVisibleElements();
        if (selectedIndex >= 0 && selectedIndex < visibleElements.length) {
            const selectedElement = visibleElements[selectedIndex];
            const link = selectedElement.querySelector("a");
            if (link) {
                console.log("navigating to selected element", link);
                link.click();
            }
        }
    };

    // Add keyboard event listener
    document.addEventListener("keydown", (e) => {
        // Only handle keyboard navigation when search has results and modal is not open
        const visibleElements = getVisibleElements();
        if (visibleElements.length === 0 || modalEl.style.display === "block") {
            return;
        }

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                const nextIndex = selectedIndex < visibleElements.length - 1 ? selectedIndex + 1 : 0;
                updateSelection(nextIndex);
                break;

            case "ArrowUp":
                e.preventDefault();
                const prevIndex = selectedIndex > 0 ? selectedIndex - 1 : visibleElements.length - 1;
                updateSelection(prevIndex);
                break;

            case "Enter":
                e.preventDefault();
                navigateToSelected();
                break;

            case "Escape":
                e.preventDefault();
                clearSelection();
                break;
        }
    });

    // Clear selection when new search results are loaded
    const originalDebouncedSearch = debouncedSearch;
    const debouncedSearchWithClearSelection = debounce(async (searchValue: string) => {
        clearSelection();
        await originalDebouncedSearch(searchValue);
    }, SMART_SEARCH_CONFIG.searchDebounce);

    searchInput.addEventListener("keyup", (e) => {
        const value = (e.target as HTMLInputElement).value;
        (e.target as HTMLInputElement).value = value.replace(/\r?\n/gi, "");
    });
});
