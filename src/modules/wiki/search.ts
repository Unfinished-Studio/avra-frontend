import { SMART_SEARCH_CONFIG } from "@/constants";
import { CONTENT_ITEMS } from "@/data/content";
import type { SwiftTypeResults } from "@/types/smart-search";
import { ACTIVE_CLASS } from "@/utils/constants";
import { getContentType, sortByContentType } from "@/utils/content-type";
import { debounce } from "@/utils/debounce";
import { getElement, getElements } from "@/utils/dom/elements";
import { swupLinkSelector, updateSwupLinks } from "./swup-manager";

export const extractCleanHighlightText = (highlightBody: string): string => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = highlightBody;
    const emElements = tempDiv.querySelectorAll("em");

    if (emElements.length > 0) {
        return emElements[0].textContent?.trim() || "";
    }
    return tempDiv.textContent?.trim().split(" ").slice(0, 5).join(" ") || "";
};

export const handleSearch = async (query: string) => {
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

export const smartSearch = () => {
    console.log("using api", SMART_SEARCH_CONFIG.api);

    const searchForm = getElement("[avra-element='ss-search-form']");
    const searchInput = getElement<HTMLInputElement>("[avra-element='ss-search-input']", searchForm);
    const submitButton = getElement("[avra-element='submit-button']");
    submitButton.classList.remove(ACTIVE_CLASS);

    const contentEmptyEl = getElement("[avra-element='ss-content-empty']");
    const resultsListEl = getElement("[avra-element='ss-list']");
    if (resultsListEl.parentElement) {
        resultsListEl.parentElement.style.display = "none";
    }

    // Create a container for search states (loading + results) to prevent content shifting
    const searchStateContainer = document.createElement("div");
    searchStateContainer.setAttribute("avra-element", "ss-state-container");
    searchStateContainer.style.cssText = `
        position: relative;
        min-height: 60px;
    `;

    // Create loading indicator with absolute positioning
    const loadingIndicator = document.createElement("div");
    loadingIndicator.setAttribute("avra-element", "ss-loading");
    loadingIndicator.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        text-align: center;
        padding: 20px;
        color: #666;
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
        pointer-events: none;
    `;
    loadingIndicator.innerHTML = `
        <div style="display: inline-block; width: 20px; height: 20px; border: 2px solid #f3f3f3; border-top: 2px solid #666; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 12px;"></div>
        <p>Searching...</p>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;

    // Insert search state container after the search form and add loading indicator
    searchForm.insertAdjacentElement("afterend", searchStateContainer);
    searchStateContainer.appendChild(loadingIndicator);

    const podcastList = getElement("[avra-element='ss-podcast-list']");
    const podcastEls = getElements("[avra-element='ss-podcast']", podcastList);

    const insightList = getElement("[avra-element='ss-insight-list']");
    const insightEls = getElements("[avra-element='ss-insight']", insightList);

    const wikiList = getElement("[avra-element='ss-wiki-list']");
    const wikiEls = getElements("[avra-element='ss-wiki']", wikiList);

    const caseStudyList = getElement("[avra-element='ss-case-study-list']");
    const caseStudyEls = getElements("[avra-element='ss-case-study']", caseStudyList);

    // Move all content elements to the visible list and sort them
    const allContentElements = [...wikiEls, ...insightEls, ...podcastEls, ...caseStudyEls].sort(sortByContentType);

    resultsListEl.innerHTML = "";
    allContentElements.forEach((el) => {
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

    // Create debounced search handler
    const debouncedSearch = debounce(async (searchValue: string) => {
        let visibleContentCount = 0;
        let hiddenContentCount = 0;

        const listEl = getElement("[avra-element='ss-list']");
        const listEls = getElements("[avra-element]", listEl);

        // Loading state is already shown immediately on input

        try {
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
                return item.keywords.some((keyword) =>
                    searchTerms.some((term) => keyword.toLowerCase().includes(term) || term.includes(keyword.toLowerCase()))
                );
            });

            console.log("Keyword matches found:", keywordMatches);

            // Get slugs from API results to avoid duplicates
            const apiResultSlugs = new Set(
                results.map((result) => {
                    const urlParts = result.url.split("/");
                    return urlParts[urlParts.length - 1];
                })
            );

            // Filter out keyword matches that are already in API results
            const newKeywordMatches = keywordMatches.filter((item) => !apiResultSlugs.has(item.slug));

            console.log("New keyword matches (not in API results):", newKeywordMatches);

            // Content elements are already hidden from input handler

            // Helper function to process a result (API or keyword match) (modifies the html card)
            const processResult = (result: any, isKeywordMatch = false) => {
                const slug = isKeywordMatch ? result.slug : result.url.split("/").pop();
                const matchEl = listEls.find((el) => {
                    return el.getAttribute("data-avra-slug") === slug;
                });

                if (matchEl) {
                    // inject highlight text
                    const resultText = getElement("[avra-element='ss-card-text']", matchEl);
                    if (resultText) {
                        if (isKeywordMatch) {
                            // For keyword matches, show matched keywords
                            const matchedKeywords = result.keywords.filter((keyword: string) =>
                                searchTerms.some(
                                    (term: string) => keyword.toLowerCase().includes(term) || term.includes(keyword.toLowerCase())
                                )
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

                    // maximum
                    if (visibleContentCount >= SMART_SEARCH_CONFIG.searchResults) {
                        // console.log("max results reached, not showing in search results");
                        hiddenContentCount++;
                        return; // don't show in main results
                    }

                    // make visible and reset opacity
                    matchEl.style.display = "block";
                    matchEl.style.opacity = "1";
                    matchEl.style.transition = ""; // Remove any transition that might interfere
                    matchEl.removeAttribute("data-avra-hidden");
                    visibleContentCount++;

                    return; // was shown in main results
                } else {
                    const resultType = isKeywordMatch ? result.type : result.type;
                    const resultSlug = isKeywordMatch ? result.slug : result.url;
                    console.warn(`No matching element found for ${resultType} with slug: ${resultSlug}`);
                    hiddenContentCount++;
                    return;
                }
            };

            // Process API results first
            for (const result of results) {
                processResult(result, false);
            }

            // Process keyword matches that weren't in API results
            for (const keywordMatch of newKeywordMatches) {
                processResult(keywordMatch, true);
            }

            // Show/hide content empty state based on visible count
            if (contentEmptyEl) {
                contentEmptyEl.style.display = visibleContentCount === 0 ? "block" : "none";
            }

            if (resultsListEl.parentElement) {
                resultsListEl.parentElement.style.display = visibleContentCount > 0 ? "block" : "none";
                // Reset opacity for crossfade animation
                if (visibleContentCount > 0) {
                    resultsListEl.parentElement.style.opacity = "0";
                }
            }

            // Update the content count display
            if (visibleContentCount === 0) {
            }
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            // Crossfade from loading to results
            if (loadingIndicator) {
                loadingIndicator.style.opacity = "0";
                loadingIndicator.style.pointerEvents = "none";
            }

            // Show results with crossfade animation if there are results
            if (resultsListEl.parentElement && resultsListEl.parentElement.style.display === "block") {
                const parentEl = resultsListEl.parentElement;
                parentEl.style.opacity = "0";
                parentEl.style.transition = "opacity 0.3s ease-in-out";
                setTimeout(() => {
                    parentEl.style.opacity = "1";
                }, 100);
            }
        }
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
                submitButton.classList.add(ACTIVE_CLASS);
            } else {
                submitButton.classList.remove(ACTIVE_CLASS);
            }
        }

        if (searchValue.length > 0) {
            // Show loading state immediately with crossfade
            if (loadingIndicator) {
                loadingIndicator.style.opacity = "1";
                loadingIndicator.style.pointerEvents = "auto";
            }

            // Hide all content with fade
            for (const el of allContentElements) {
                el.style.transition = "opacity 0.2s ease-in-out";
                el.style.opacity = "0";
                setTimeout(() => {
                    el.style.display = "none";
                }, 200);
            }
            if (resultsListEl.parentElement) {
                const parentEl = resultsListEl.parentElement;
                parentEl.style.transition = "opacity 0.2s ease-in-out";
                parentEl.style.opacity = "0";
                setTimeout(() => {
                    parentEl.style.display = "none";
                }, 200);
            }
            if (contentEmptyEl) {
                contentEmptyEl.style.display = "none";
            }

            debouncedSearchWithClearSelection(searchValue);
        } else {
            // If search is cleared, crossfade from loading to content
            if (loadingIndicator) {
                loadingIndicator.style.opacity = "0";
                loadingIndicator.style.pointerEvents = "none";
            }
            if (resultsListEl.parentElement) {
                resultsListEl.parentElement.style.display = "none";
                resultsListEl.parentElement.style.opacity = "1";
            }
            for (const el of allContentElements) {
                el.style.display = "block";
                el.style.opacity = "0";
                el.style.transition = "opacity 0.3s ease-in-out";
                el.removeAttribute("data-avra-hidden");
                setTimeout(() => {
                    el.style.opacity = "1";
                }, 50);
            }
            if (contentEmptyEl) {
                contentEmptyEl.style.display = "none";
            }
        }
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
        updateSwupLinks(swupLinkSelector);
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
        // Only handle keyboard navigation when search has results
        const visibleElements = getVisibleElements();
        if (visibleElements.length === 0) {
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
};
