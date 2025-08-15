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

export const createMobileSearchPopup = () => {
    const popupHTML = `
        <div avra-element="mobile-search-popup" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 9999;">
            <div avra-element="mobile-search-backdrop" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.2); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);"></div>
            <div avra-element="mobile-search-content" style="position: relative; height: 100vh; display: flex; flex-direction: column; opacity: 0;">
                <div avra-element="mobile-search-header" style="position: sticky; top: 0; padding: 20px; z-index: 10; flex-shrink: 0;">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                        <button avra-element="mobile-search-close" style="background: none; border: none; font-size: 24px; cursor: pointer; padding: 4px;">×</button>
                    </div>
                    <form avra-element="mobile-search-form" style="width: 100%;">
                        <input 
                            avra-element="mobile-search-input" 
                            type="text" 
                            placeholder="Search wiki, insights, podcasts..." 
                            style="width: 100%; padding: 12px 16px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 16px; outline: none; box-sizing: border-box;"
                        />
                    </form>
                </div>
                <div avra-element="mobile-search-results" style="flex: 1; overflow-y: auto; padding: 20px 20px 40px 20px; display: flex; flex-direction: column; gap: 12px;">
                    <div avra-element="mobile-search-empty" style="text-align: center; padding: 40px 20px; color: #666; display: none;">
                        <p>No results found. Try a different search term.</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML("beforeend", popupHTML);
};

export const setupMobileSearchPopup = () => {
    const mobileSearchBtn = avraQuery<HTMLElement>("mobile-search-btn");
    if (!mobileSearchBtn) {
        console.warn("Mobile search button not found");
        return;
    }

    let mobileSearchPopup = avraQuery<HTMLElement>("mobile-search-popup");
    if (!mobileSearchPopup) {
        createMobileSearchPopup();
        mobileSearchPopup = avraQuery<HTMLElement>("mobile-search-popup")!;
    }

    const mobileSearchInput = avraQuery<HTMLInputElement>("mobile-search-input", mobileSearchPopup)!;
    const mobileSearchForm = avraQuery<HTMLFormElement>("mobile-search-form", mobileSearchPopup)!;
    const mobileSearchResults = avraQuery<HTMLElement>("mobile-search-results", mobileSearchPopup)!;
    const mobileSearchEmpty = avraQuery<HTMLElement>("mobile-search-empty", mobileSearchPopup)!;
    const mobileSearchClose = avraQuery<HTMLElement>("mobile-search-close", mobileSearchPopup)!;
    const mobileSearchBackdrop = avraQuery<HTMLElement>("mobile-search-backdrop", mobileSearchPopup)!;
    const mobileSearchContent = avraQuery<HTMLElement>("mobile-search-content", mobileSearchPopup)!;

    const showMobileSearchPopup = () => {
        mobileSearchPopup!.style.display = "block";
        document.body.style.overflow = "hidden";

        gsap.set(mobileSearchBackdrop, { opacity: 0 });
        gsap.set(mobileSearchContent, {
            opacity: 0,
        });

        // Create timeline for coordinated animation
        const tl = gsap.timeline();

        // Fade in backdrop
        tl.to(mobileSearchBackdrop, {
            opacity: 1,
            duration: 0.25,
            ease: "power2.out",
        });

        // Slide in and fade in content
        tl.to(
            mobileSearchContent,
            {
                opacity: 1,
                duration: 0.25,
                ease: "power2.out",
            },
            "-=0.1"
        ); // Start slightly before backdrop finishes

        // Focus input after animation
        tl.call(() => {
            mobileSearchInput.focus();
        });
    };

    const hideMobileSearchPopup = () => {
        const tl = gsap.timeline();

        // Slide out and fade out content
        tl.to(mobileSearchContent, {
            opacity: 0,
            duration: 0.25,
            ease: "power2.in",
        });

        // Fade out backdrop
        tl.to(
            mobileSearchBackdrop,
            {
                opacity: 0,
                duration: 0.2,
                ease: "power2.in",
            },
            "-=0.1"
        ); // Start slightly before content finishes

        // Hide popup and clean up after animation
        tl.call(() => {
            mobileSearchPopup!.style.display = "none";
            document.body.style.overflow = "";
            mobileSearchInput.value = "";
            mobileSearchResults.innerHTML = `<div avra-element="mobile-search-empty" style="text-align: center; padding: 40px 20px; color: #666; display: none;"><p>No results found. Try a different search term.</p></div>`;
        });
    };

    console.log("mobileSearchBtn", mobileSearchBtn);
    mobileSearchBtn.addEventListener("click", showMobileSearchPopup);
    mobileSearchClose.addEventListener("click", hideMobileSearchPopup);

    // Close on backdrop click
    mobileSearchPopup.addEventListener("click", (e) => {
        if (e.target === mobileSearchPopup) {
            hideMobileSearchPopup();
        }
    });

    // Close on escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && mobileSearchPopup!.style.display === "block") {
            hideMobileSearchPopup();
        }
    });

    // Setup mobile search functionality (reusing existing smart search logic)
    setupMobileSearch(mobileSearchInput, mobileSearchForm, mobileSearchResults, mobileSearchEmpty, hideMobileSearchPopup);
};

export const initializePersistentContentElements = () => {
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

        console.log("Initialized persistent content elements:", persistentContentElements.length);
        console.log("Initialized persistent article elements:", persistentArticleElements.length);
    } catch (error) {
        console.warn("Failed to initialize persistent content and article elements:", error);
        persistentContentElements = [];
        persistentArticleElements = [];
    }
};

export const setupMobileSearch = (
    searchInput: HTMLInputElement,
    searchForm: HTMLFormElement,
    resultsContainer: HTMLElement,
    emptyStateElement: HTMLElement,
    hidePopupCallback: () => void
) => {
    if (persistentContentElements.length === 0) {
        console.log("no content elements, initializing...");
        initializePersistentContentElements();
    }
    console.log({ persistentContentElements, persistentArticleElements });

    const debouncedMobileSearch = debounce(async (searchValue: string) => {
        let visibleContentCount = 0;

        // Clear previous results
        resultsContainer.innerHTML = "";

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

        // Helper function to create a mobile result card
        const createMobileResultCard = (result: any, isKeywordMatch = false) => {
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
                            searchTerms.some((term: string) => keyword.toLowerCase().includes(term) || term.includes(keyword.toLowerCase()))
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

                        // Add click handler to close mobile popup with animation
                        link.addEventListener("click", () => {
                            hidePopupCallback();
                        });
                    }
                });

                // Style the card for mobile
                clonedEl.removeAttribute("data-avra-hidden");

                return clonedEl;
            }
            return null;
        };

        // Process API results first
        for (const result of results) {
            if (visibleContentCount >= SMART_SEARCH_CONFIG.searchResults) break;
            const card = createMobileResultCard(result, false);
            if (card) {
                resultsContainer.appendChild(card);
                visibleContentCount++;
            }
        }

        // Process keyword matches that weren't in API results
        for (const keywordMatch of newKeywordMatches) {
            if (visibleContentCount >= SMART_SEARCH_CONFIG.searchResults) break;
            const card = createMobileResultCard(keywordMatch, true);
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
    }, SMART_SEARCH_CONFIG.searchDebounce);

    searchInput.addEventListener("input", async (e) => {
        const searchValue = (e.target as HTMLInputElement).value.toLowerCase().trim();

        if (searchValue.length > 0) {
            console.log("searching with value:", searchValue);
            await debouncedMobileSearch(searchValue);
        } else {
            console.log("search empty, clearing results...");
            resultsContainer.innerHTML = `<div avra-element="mobile-search-empty" style="text-align: center; padding: 40px 20px; color: #666; display: none;"><p>No results found. Try a different search term.</p></div>`;
        }
    });

    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        e.stopPropagation();
    });

    // Prevent enter key from causing issues
    searchInput.addEventListener("keyup", (e) => {
        const value = (e.target as HTMLInputElement).value;
        (e.target as HTMLInputElement).value = value.replace(/\r?\n/gi, "");
    });
};
