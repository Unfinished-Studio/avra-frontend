import { SMART_SEARCH_CONFIG } from "@/constants";
import { CONTENT_ITEMS } from "@/data/content";
import { getContentType, sortByContentType } from "@/utils/content-type";
import { debounce } from "@/utils/debounce";
import { avraQuery, avraQueryAllArray } from "@/utils/dom/elements";
import gsap from "gsap";
import { extractCleanHighlightText, handleSearch } from "./search";

// Store persistent copies of content elements to avoid Swup interference
let persistentContentElements: HTMLElement[] = [];
let persistentArticleElements: HTMLElement[] = [];

export const createNavSearchDropdown = () => {
    const dropdownHTML = `
        <div avra-element="nav-search-dropdown" style="display: none; position: absolute; top: 100%; left: 0; width: 400px; z-index: 999999; background: white; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15); overflow: hidden; box-sizing: border-box; isolation: isolate;">
            <div avra-element="nav-search-state-container" style="position: relative; min-height: 100px;">
                <div avra-element="nav-search-loading" style="position: absolute; top: 0; left: 0; right: 0; text-align: center; padding: 20px; color: #666; opacity: 0; transition: opacity 0.3s ease-in-out; pointer-events: none; z-index: 2;">
                    <div style="display: inline-block; width: 20px; height: 20px; border: 2px solid #f3f3f3; border-top: 2px solid #666; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 12px;"></div>
                    <p>Searching...</p>
                    <style>
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    </style>
                </div>
                <div avra-element="nav-search-results" style="max-height: 800px; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; box-sizing: border-box; width: 100%; opacity: 1; transition: opacity 0.3s ease-in-out; position: relative; z-index: 1;">
                    <div avra-element="nav-search-empty" style="text-align: center; padding: 40px 20px; color: #666; display: none;">
                        <p>No results found. Try a different search term.</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    return dropdownHTML;
};

export const setupNavSearchDropdown = () => {
    const navSearchInput = avraQuery<HTMLInputElement>("nav-search-input");
    if (!navSearchInput) {
        console.warn("Nav search input not found");
        return;
    }

    // Create container wrapper if it doesn't exist
    const navSearchContainer = navSearchInput.closest('[avra-element="nav-search-container"]') || navSearchInput.parentElement;
    if (!navSearchContainer) {
        console.warn("Nav search container not found");
        return;
    }

    // Make the container position relative for absolute positioning of dropdown
    (navSearchContainer as HTMLElement).style.position = "relative";

    // Create dropdown if it doesn't exist
    let navSearchDropdown = avraQuery<HTMLElement>("nav-search-dropdown", navSearchContainer);
    if (!navSearchDropdown) {
        navSearchContainer.insertAdjacentHTML("beforeend", createNavSearchDropdown());
        navSearchDropdown = avraQuery<HTMLElement>("nav-search-dropdown", navSearchContainer)!;
    }

    const navSearchResults = avraQuery<HTMLElement>("nav-search-results", navSearchDropdown)!;
    const navSearchLoading = avraQuery<HTMLElement>("nav-search-loading", navSearchDropdown)!;
    const navSearchEmpty = avraQuery<HTMLElement>("nav-search-empty", navSearchDropdown)!;

    // Show dropdown function with GSAP animation
    const showNavSearchDropdown = () => {
        navSearchDropdown!.style.display = "block";

        // Ensure dropdown is on top of everything
        navSearchDropdown!.style.zIndex = "999999";
        navSearchDropdown!.style.position = "absolute";

        // Set initial state
        gsap.set(navSearchDropdown, {
            opacity: 0,
            y: -10,
        });

        // Animate in
        gsap.to(navSearchDropdown, {
            opacity: 1,
            y: 0,
            duration: 0.2,
            ease: "power2.out",
        });
    };

    // Hide dropdown function with GSAP animation
    const hideNavSearchDropdown = () => {
        gsap.to(navSearchDropdown, {
            opacity: 0,
            y: -10,
            duration: 0.15,
            ease: "power2.in",
            onComplete: () => {
                navSearchDropdown!.style.display = "none";
                navSearchInput.value = "";
                navSearchResults.innerHTML = `<div avra-element="nav-search-empty" style="text-align: center; padding: 40px 20px; color: #666; display: none; width: 100%; box-sizing: border-box;"><p>No results found. Try a different search term.</p></div>`;
            },
        });
    };

    // Setup nav search functionality (reusing existing smart search logic)
    setupNavSearch(navSearchInput, navSearchResults, navSearchLoading, navSearchEmpty, hideNavSearchDropdown);

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
        if (!navSearchContainer.contains(target)) {
            hideNavSearchDropdown();
        }
    });

    // Close on escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && navSearchDropdown!.style.display === "block") {
            hideNavSearchDropdown();
        }
    });
};

export const initializeNavPersistentContentElements = () => {
    try {
        const dataContainer = avraQuery("data-container")!;
        const wikiList = avraQuery("ss-wiki-list", dataContainer)!;
        const sessionList = avraQuery("ss-session-list", dataContainer)!;
        const podcastList = avraQuery("ss-podcast-list", dataContainer)!;
        const caseStudyList = avraQuery("ss-case-study-list", dataContainer)!;

        const wikiEls = avraQueryAllArray("ss-wiki", wikiList);
        const insightEls = avraQueryAllArray("ss-session", sessionList);
        const podcastEls = avraQueryAllArray("ss-podcast", podcastList);
        const caseStudyEls = avraQueryAllArray("ss-case-study", caseStudyList);

        // Create and store the copies
        const allElements = [...wikiEls, ...insightEls, ...podcastEls, ...caseStudyEls];
        persistentContentElements = allElements.map((el) => el.cloneNode(true) as HTMLElement).sort(sortByContentType);
        persistentArticleElements = allElements.map((el) => el.nextElementSibling?.cloneNode(true) as HTMLElement).sort(sortByContentType);

        console.log("Initialized nav persistent content elements:", persistentContentElements.length);
        console.log("Initialized nav persistent article elements:", persistentArticleElements.length);
    } catch (error) {
        console.warn("Failed to initialize nav persistent content and article elements:", error);
        persistentContentElements = [];
        persistentArticleElements = [];
    }
};

const setupNavSearch = (
    searchInput: HTMLInputElement,
    resultsContainer: HTMLElement,
    loadingElement: HTMLElement,
    emptyStateElement: HTMLElement,
    hideDropdownCallback: () => void
) => {
    if (persistentContentElements.length === 0) {
        console.log("no nav content elements, initializing...");
        initializeNavPersistentContentElements();
    }
    console.log({ persistentContentElements, persistentArticleElements });

    const debouncedNavSearch = debounce(async (searchValue: string) => {
        let visibleContentCount = 0;

        // Loading state is already shown immediately on input
        // Clear previous results (already done in input handler)

        try {
            // Get search results from API
            const results = (await handleSearch(searchValue)).map((result) => {
                return {
                    ...result,
                    type: getContentType(result.url),
                };
            });

            console.log({ results });

            // Check for keyword matches in content items
            const searchTerms = searchValue.toLowerCase().split(/\s+/);
            const keywordMatches = CONTENT_ITEMS.filter((item) => {
                return item.keywords.some((keyword) =>
                    searchTerms.some((term) => keyword.toLowerCase().includes(term) || term.includes(keyword.toLowerCase()))
                );
            });

            // Get slugs from API results to avoid duplicates
            const apiResultSlugs = new Set(
                results.map((result) => {
                    const urlParts = result.url.split("/");
                    return urlParts[urlParts.length - 1];
                })
            );

            // Filter out keyword matches that are already in API results
            const newKeywordMatches = keywordMatches.filter((item) => !apiResultSlugs.has(item.slug));

            // Helper function to create a nav result card
            const createNavResultCard = (result: any, isKeywordMatch = false) => {
                const slug = isKeywordMatch ? result.slug : result.url.split("/").pop();
                const matchEl = persistentContentElements.find((el) => {
                    return el.getAttribute("data-avra-slug") === slug;
                });

                if (matchEl) {
                    const articleEl = persistentArticleElements.find((el) => {
                        return el.querySelector("a")?.href.split("/").pop() === slug;
                    });
                    const clonedEl = articleEl?.cloneNode(true) as HTMLElement;

                    // Update the result text
                    const resultText = clonedEl.querySelector<HTMLElement>("[avra-element='ss-card-text']");
                    if (resultText) {
                        if (isKeywordMatch) {
                            const matchedKeywords = result.keywords.filter((keyword: string) =>
                                searchTerms.some(
                                    (term: string) => keyword.toLowerCase().includes(term) || term.includes(keyword.toLowerCase())
                                )
                            );
                            resultText.innerHTML = `Keyword match: <strong>${matchedKeywords.join(", ")}</strong>`;
                        } else {
                            resultText.innerHTML = result.highlight.body.replace(/<em>/g, "<strong>").replace(/<\/em>/g, "</strong>");
                        }
                        resultText.classList.remove("w-dyn-bind-empty");
                    }

                    // Add highlighted text as query parameter to anchor links
                    const highlightText = isKeywordMatch ? searchValue : extractCleanHighlightText(result.highlight?.body || "");
                    const links = clonedEl.querySelectorAll<HTMLAnchorElement>("a");
                    links.forEach((link) => {
                        if (highlightText && link.href) {
                            const url = new URL(link.href);
                            url.searchParams.set("highlight", highlightText);
                            link.href = url.toString();

                            // Add click handler to close nav dropdown
                            link.addEventListener("click", () => {
                                hideDropdownCallback();
                            });
                        }
                    });

                    // Style the card for nav dropdown
                    clonedEl.removeAttribute("data-avra-hidden");
                    clonedEl.style.cursor = "pointer";
                    clonedEl.style.width = "100%";
                    clonedEl.style.boxSizing = "border-box";
                    clonedEl.style.display = "block";

                    // Ensure all child elements also take full width
                    const allChildElements = clonedEl.querySelectorAll("*");
                    allChildElements.forEach((child) => {
                        const childEl = child as HTMLElement;
                        if (childEl.style.width && childEl.style.width !== "100%") {
                            childEl.style.width = "100%";
                        }
                        childEl.style.boxSizing = "border-box";
                    });

                    return clonedEl;
                }
                return null;
            };

            // Process API results first
            for (const result of results) {
                if (visibleContentCount >= SMART_SEARCH_CONFIG.searchResults) break;
                const card = createNavResultCard(result, false);
                if (card) {
                    resultsContainer.appendChild(card);
                    visibleContentCount++;
                }
            }

            // Process keyword matches that weren't in API results
            for (const keywordMatch of newKeywordMatches) {
                if (visibleContentCount >= SMART_SEARCH_CONFIG.searchResults) break;
                const card = createNavResultCard(keywordMatch, true);
                if (card) {
                    resultsContainer.appendChild(card);
                    visibleContentCount++;
                }
            }

            // Show/hide empty state
            if (visibleContentCount === 0) {
                emptyStateElement.style.display = "block";
                resultsContainer.appendChild(emptyStateElement);
            } else {
                emptyStateElement.style.display = "none";
            }
        } catch (error) {
            console.error("Nav search error:", error);
        } finally {
            // Crossfade from loading to results
            if (loadingElement) {
                loadingElement.style.opacity = "0";
                loadingElement.style.pointerEvents = "none";
            }

            // Show results with crossfade animation
            setTimeout(() => {
                resultsContainer.style.opacity = "1";
            }, 100);
        }
    }, SMART_SEARCH_CONFIG.searchDebounce);

    searchInput.addEventListener("input", async (e) => {
        const searchValue = (e.target as HTMLInputElement).value.toLowerCase().trim();

        if (searchValue.length > 0) {
            console.log("nav searching with value:", searchValue);

            // Show dropdown if not visible
            const dropdown = avraQuery("nav-search-dropdown");
            if (dropdown && dropdown.style.display === "none") {
                const showEvent = new CustomEvent("showNavDropdown");
                searchInput.dispatchEvent(showEvent);
            }

            // Show loading state with crossfade
            if (loadingElement) {
                loadingElement.style.opacity = "1";
                loadingElement.style.pointerEvents = "auto";
            }

            // Hide results with crossfade
            resultsContainer.style.opacity = "0";
            setTimeout(() => {
                resultsContainer.innerHTML = "";
            }, 150);

            await debouncedNavSearch(searchValue);
        } else {
            console.log("nav search empty, clearing results...");
            if (loadingElement) {
                loadingElement.style.opacity = "0";
                loadingElement.style.pointerEvents = "none";
            }
            resultsContainer.style.opacity = "1";
            resultsContainer.innerHTML = `<div avra-element="nav-search-empty" style="text-align: center; padding: 40px 20px; color: #666; display: none; width: 100%; box-sizing: border-box;"><p>No results found. Try a different search term.</p></div>`;
            hideDropdownCallback();
        }
    });

    // Show dropdown on focus if there's a value
    searchInput.addEventListener("focus", () => {
        if (searchInput.value.trim().length > 0) {
            const showEvent = new CustomEvent("showNavDropdown");
            searchInput.dispatchEvent(showEvent);
        }
    });

    // Custom event to show dropdown
    searchInput.addEventListener("showNavDropdown", () => {
        const dropdown = avraQuery("nav-search-dropdown");
        if (dropdown) {
            dropdown.style.display = "block";
            gsap.set(dropdown, { opacity: 0, y: -10 });
            gsap.to(dropdown, {
                opacity: 1,
                y: 0,
                duration: 0.2,
                ease: "power2.out",
            });
        }
    });

    // Prevent form submission
    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    });

    // Clean up input value
    searchInput.addEventListener("keyup", (e) => {
        const value = (e.target as HTMLInputElement).value;
        (e.target as HTMLInputElement).value = value.replace(/\r?\n/gi, "");
    });
};
