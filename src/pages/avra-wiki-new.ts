import { Sidebar, updateSidebarState } from "@/components/sidebar";
import { SMART_SEARCH_CONFIG } from "@/constants";
import { CONTENT_ITEMS } from "@/data/content";
import { wikiItems } from "@/data/sidebar";
import { initContentPage } from "@/pages/page-initializer";
import type { SwiftTypeResults } from "@/types/smart-search";
import { getContentType, sortByContentType } from "@/utils/content-type";
import { debounce } from "@/utils/debounce";
import { getElement, getElements, avraQuery, avraQueryAllArray } from "@/utils/dom/elements";
import { isMobile } from "@/utils/mobile";
import { getCurrentPageInfo } from "@/utils/page-info";
import { STAGGER_DELAY, ACTIVE_CLASS } from "@/utils/constants";
import Swup from "swup";
import gsap from "gsap";

const swupLinkSelector = 'a[href*="/avra-wiki/"], a[href*="/session-insights/"], a[href*="/case-studies/"], a[href*="/audio-video/"]';
let swup: Swup | null = null;

// Store persistent copies of content elements to avoid Swup interference
let persistentContentElements: HTMLElement[] = [];
let persistentArticleElements: HTMLElement[] = [];

// Open sidebar and nested dropdowns on mobile
const handleBreadcrumbClick = (event: Event, title: string) => {
    if (isMobile()) {
        event.preventDefault();

        const sidebarBtn = avraQuery<HTMLElement>("sidebar-btn");
        if (sidebarBtn) {
            sidebarBtn.click();
        }

        setTimeout(() => {
            expandDropdownsToRevealLink(title);
        }, STAGGER_DELAY);
    }
};

const expandDropdownsToRevealLink = (title: string) => {
    // Determine section to expand based on title text content
    let sectionToExpand = "";

    if (title === "Wiki Topics") {
        sectionToExpand = "Wiki Topics";
    } else if (title === "Session Insights") {
        sectionToExpand = "Session Insights";
    } else if (title === "Case Studies") {
        sectionToExpand = "Wiki Topics"; // Case studies are under wiki topics
    } else if (title === "Podcast Episodes") {
        sectionToExpand = "Podcast Episodes";
    } else {
        // For specific items, find which section they belong to by searching the DOM
        const wikiTopicElements = document.querySelectorAll<HTMLElement>("[avra-element='wiki-section-item-text']");
        for (const element of wikiTopicElements) {
            if (element.textContent === title) {
                sectionToExpand = "Wiki Topics";
                break;
            }
        }

        // Check session insights if not found in wiki topics
        if (!sectionToExpand) {
            const sessionElements = document.querySelectorAll<HTMLElement>("[avra-element='wiki-insight-item-text']");
            for (const element of sessionElements) {
                if (element.textContent === title) {
                    sectionToExpand = "Session Insights";
                    break;
                }
            }
        }

        // Check podcast episodes if not found elsewhere
        if (!sectionToExpand) {
            const podcastElements = document.querySelectorAll<HTMLElement>("[avra-element='wiki-section-item-text']");
            for (const element of podcastElements) {
                if (element.textContent === title && element.closest('[data-title="Podcast Episodes"]')) {
                    sectionToExpand = "Podcast Episodes";
                    break;
                }
            }
        }
    }

    if (sectionToExpand) {
        // Find the section title element
        const sectionTitleElement = document.querySelector<HTMLElement>(
            `[data-title="${sectionToExpand}"] [avra-element="wiki-section-title-text"]`
        );
        if (sectionTitleElement) {
            // Find the dropdown button next to it
            const dropdownBtn = sectionTitleElement.nextElementSibling as HTMLElement;
            if (dropdownBtn && dropdownBtn.getAttribute("data-avra-dropdown-expanded") !== "true") {
                dropdownBtn.click();
            }

            // If this is a specific item within a section, also expand that item's dropdown
            setTimeout(() => {
                // Find the specific item by title text content
                const allItemElements = document.querySelectorAll<HTMLElement>(
                    "[avra-element='wiki-section-item-text'], [avra-element='wiki-insight-item-text']"
                );
                for (const [index, element] of allItemElements.entries()) {
                    if (element.textContent === title) {
                        const itemDropdownBtn = element.nextElementSibling as HTMLElement;
                        if (itemDropdownBtn && itemDropdownBtn.getAttribute("data-avra-dropdown-expanded") !== "true") {
                            setTimeout(() => {
                                itemDropdownBtn.click();
                            }, index * STAGGER_DELAY);
                        }
                        break;
                    }
                }
            }, STAGGER_DELAY);
        }
    }
};

const updateBreadcrumbs = () => {
    const pageInfo = getCurrentPageInfo();
    const breadcrumb1 = avraQuery<HTMLElement>("breadcrumb-1");
    const breadcrumbArrow = avraQuery<HTMLElement>("breadcrumb-arrow");
    const breadcrumb2 = avraQuery<HTMLElement>("breadcrumb-2");

    if (!breadcrumb1 || !breadcrumb2 || !breadcrumbArrow) {
        console.warn("Breadcrumb elements not found");
        return;
    }

    // Hide breadcrumb2 and arrow by default
    breadcrumb2.style.display = "none";
    breadcrumbArrow.style.display = "none";

    if (pageInfo.currentType === "wiki" && pageInfo.currentSlug) {
        // Find the current wiki item and its parent
        let currentWikiItem = null;
        let parentWikiTitle = null;
        let currentSubItem = null;

        // Search through wiki items to find the current page
        for (const wikiItem of wikiItems) {
            if (wikiItem.slug === pageInfo.currentSlug) {
                currentWikiItem = wikiItem;
                break;
            }

            // Check if it's a sub-item
            const findInSubItems = (subItems: any[], parentTitle: string): any => {
                for (const subItem of subItems) {
                    if (subItem.type === "item" && subItem.title.includes(pageInfo.currentSlug)) {
                        return { subItem, parentTitle };
                    }
                    if (subItem.subItems) {
                        const found = findInSubItems(subItem.subItems, parentTitle);
                        if (found) return found;
                    }
                }
                return null;
            };

            const found = findInSubItems(wikiItem.subItems, wikiItem.title);
            if (found) {
                currentSubItem = found.subItem;
                parentWikiTitle = found.parentTitle;
                break;
            }
        }

        if (currentWikiItem) {
            // This is a main wiki page
            breadcrumb1.textContent = "Wiki Topics";
            breadcrumb2.textContent = currentWikiItem.title;
            breadcrumb2.style.display = "block";
            breadcrumbArrow.style.display = "block";
        } else if (currentSubItem && parentWikiTitle) {
            // This is a sub-item page
            const parentWikiItem = wikiItems.find((item) => item.title === parentWikiTitle);
            if (parentWikiItem) {
                breadcrumb1.textContent = parentWikiTitle;
                breadcrumb2.textContent = currentSubItem.displayTitle;
                breadcrumb2.style.display = "block";
                breadcrumbArrow.style.display = "block";
            }
        } else {
            // Fallback

            breadcrumb1.textContent = "Wiki Topics";
        }
    } else if (pageInfo.currentType === "session") {
        // For session insights - get the actual session title
        const dataEl = avraQuery<HTMLElement>("item-data");
        const pageTitle = dataEl?.getAttribute("data-avra-title") || "Session Insight";
        breadcrumb1.textContent = "Session Insights";
        breadcrumb2.textContent = pageTitle;
        breadcrumb2.style.display = "block";
        breadcrumbArrow.style.display = "block";
    } else if (pageInfo.currentType === "case-study") {
        // For case studies - get the actual page title
        const dataEl = avraQuery<HTMLElement>("item-data");
        const pageTitle = dataEl?.getAttribute("data-avra-title") || "Case Study";
        breadcrumb1.textContent = "Case Studies";
        breadcrumb2.textContent = pageTitle;
        breadcrumb2.style.display = "block";
        breadcrumbArrow.style.display = "block";
    } else if (pageInfo.currentType === "podcast") {
        // For podcast episodes - get the actual page title
        const dataEl = document.querySelector<HTMLElement>("[avra-element='item-data']");
        const pageTitle = dataEl?.getAttribute("data-avra-title") || "Podcast Episode";
        breadcrumb1.textContent = "Podcast Episodes";
        breadcrumb2.textContent = pageTitle;
        breadcrumb2.style.display = "block";
        breadcrumbArrow.style.display = "block";
    } else {
        // Default fallback
        breadcrumb1.textContent = "Wiki Topics";
    }

    // Add click handlers to both breadcrumbs for mobile (only if not already set)
    if (!breadcrumb1.hasAttribute("data-breadcrumb-listener-set")) {
        breadcrumb1.addEventListener("click", (e) => {
            const title = breadcrumb1.textContent || "";
            handleBreadcrumbClick(e, title);
            console.log("breadcrumb1 clicked");
        });
        breadcrumb1.setAttribute("data-breadcrumb-listener-set", "true");
    }

    if (!breadcrumb2.hasAttribute("data-breadcrumb-listener-set")) {
        breadcrumb2.addEventListener("click", (e) => {
            const title = breadcrumb2.textContent || "";
            handleBreadcrumbClick(e, title);
            console.log("breadcrumb2 clicked");
        });
        breadcrumb2.setAttribute("data-breadcrumb-listener-set", "true");
    }
};

const handleMobileNavigation = () => {
    if (isMobile()) {
        if (swup) {
            swup.navigate("/avra-wiki/hiring-and-managing-execs");
        }
    }
};

export const updateSwupLinks = (newLinkSelector: string) => {
    if (swup) {
        swup.destroy();
    }
    swup = new Swup({
        animationSelector: '[class*="transition-"]',
        containers: ["[avra-element='wiki-content']"],
        linkSelector: newLinkSelector,
        cache: false,
    });

    // re-register hooks
    swup.hooks.on("content:replace", () => {
        console.log("new content available");
        // Re-initialize persistent content elements after content replacement
        setTimeout(() => initializePersistentContentElements(), 100);
    });
    swup.hooks.on("visit:end", (visit) => {
        updateSidebarState();
        initContentPage();
        updateSidebar();
        updateBreadcrumbs();
    });
};

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

const extractCleanHighlightText = (highlightBody: string): string => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = highlightBody;
    const emElements = tempDiv.querySelectorAll("em");

    if (emElements.length > 0) {
        return emElements[0].textContent?.trim() || "";
    }
    return tempDiv.textContent?.trim().split(" ").slice(0, 5).join(" ") || "";
};

const createMobileSearchPopup = () => {
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

const setupMobileSearchPopup = () => {
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
            duration: 0.3,
            ease: "power2.out",
        });

        // Slide in and fade in content
        tl.to(
            mobileSearchContent,
            {
                opacity: 1,
                duration: 0.4,
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
            duration: 0.3,
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

const initializePersistentContentElements = () => {
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

const setupMobileSearch = (
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

const smartSearch = () => {
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

        // hide all content elements
        for (const el of allContentElements) {
            el.style.display = "none";
            el.setAttribute("data-avra-hidden", "search");
        }

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

                // maximum
                if (visibleContentCount >= SMART_SEARCH_CONFIG.searchResults) {
                    // console.log("max results reached, not showing in search results");
                    hiddenContentCount++;
                    return; // don't show in main results
                }

                // make visible
                matchEl.style.display = "block";
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
        }

        // Update the content count display
        if (visibleContentCount === 0) {
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
            debouncedSearchWithClearSelection(searchValue);
        } else {
            // If search is cleared, hide all results and show all content
            if (resultsListEl.parentElement) {
                resultsListEl.parentElement.style.display = "none";
            }
            for (const el of allContentElements) {
                el.style.display = "block";
                el.removeAttribute("data-avra-hidden");
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

const updateSidebar = () => {
    const sessionInsightsSection = getElement("[data-title='Session Insights']");
    const sessionLinks = getElements("[avra-element='wiki-session-links'] a");

    console.log(sessionInsightsSection, sessionLinks);

    if (sessionInsightsSection && sessionLinks.length) {
        // Clear existing session links
        const existingLinks = sessionInsightsSection.querySelectorAll("a");
        existingLinks.forEach((link) => link.remove());

        // Add new session links
        sessionLinks.forEach((link) => {
            sessionInsightsSection.appendChild(link);
        });
    }
};

const initSwup = () => {
    return new Swup({
        animationSelector: '[class*="transition-"]',
        containers: ["[avra-element='wiki-content']"],
        linkSelector: swupLinkSelector,
        cache: false,
    });
};

window.Webflow ||= [];
window.Webflow.push(async () => {
    Sidebar();
    smartSearch();
    initializePersistentContentElements(); // Initialize before mobile search setup
    setupMobileSearchPopup();
    initContentPage();
    updateSidebar();
    updateBreadcrumbs();

    swup = initSwup();

    // Handle mobile navigation after Swup is initialized
    handleMobileNavigation();
    swup.hooks.on("content:replace", () => {
        // remove/change elements pulled in from wiki page
        const elementsToRemove = document.querySelectorAll<HTMLElement>(
            ".wiki-dropdown-wrapper, .sub-nav.smaller, .sub-nav.tall, .confidential, .back-button"
        );
        for (const element of elementsToRemove) {
            element.remove();
        }

        const backBtn = document.querySelector<HTMLAnchorElement>(".back-button");
        if (backBtn) {
            backBtn.href = "/avra-wiki-new";
            backBtn.textContent = "Return to Wiki";
        }
    });
    swup.hooks.on("visit:end", (visit) => {
        updateSidebarState();
        initContentPage();
        updateSidebar();
        updateBreadcrumbs();
        // Re-initialize persistent content elements after navigation
        initializePersistentContentElements();
    });
});
