import { getAdminAccess } from "@/utils/admin/getAdminAccess";
import { getStaging } from "@/utils/admin/getStaging";
import { getContentType, sortByContentType } from "@/utils/contentType";
import { debounce } from "@/utils/debounce";
import { getElement, getElements } from "@/utils/dom/elements";

// TODO: sync to types.ts of avra-worker
type SwiftTypeSearchResult = {
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

type SwiftTypeResults = {
    results: SwiftTypeSearchResult[];
};

// TODO: extract to types file
type SearchInsight = {
    title: string;
    slug: string;
    transcript: string;
    matchContext: string;
};

type ElementConfig = {
    elements: Element[];
    initialVisibleCount: number;
    listElement: Element;
    buttonElement?: Element;
    emptyElement?: Element;
};

// constants
const config = {
    api: getStaging() ? "http://localhost:8787" : "https://avra-worker.nic-f66.workers.dev", // TODO: use avracap.com domain in prod
    searchDebounce: 500, // ms
    searchResults: 8, // the maximum number of results to show in the results preview
    contentTypeOrder: ["wiki", "insight", "podcast", "other"],
} as const;

const handleSearch = async (query: string) => {
    const params = new URLSearchParams([["query", query]]);
    const response = await fetch(`${config.api}/api/site-search?${String(params)}`, {
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

window.Webflow ||= [];
window.Webflow.push(async () => {
    console.log("config.api", config.api);

    const adminAccess = getAdminAccess();
    if (!adminAccess) return;

    const searchForm = getElement("[avra-element='ss-search-form']");
    const searchInput = getElement<HTMLInputElement>("[avra-element='ss-search-input']", searchForm);

    const contentBtn = getElement("[avra-element='ss-content-btn']");
    const contentEmptyEl = getElement("[avra-element='ss-content-empty']");
    const resultsListEl = getElement("[avra-element='ss-list']");

    const modalEl = getElement("[avra-element='ss-modal']");
    const modalListEl = getElement("[avra-element='ss-modal-list']", modalEl);

    const modalSearchForm = getElement("[avra-element='ss-modal-search-form']", modalEl);
    const modalSearchInput = getElement<HTMLInputElement>("[avra-element='ss-modal-search-input']", modalSearchForm);

    const modalResultCountEl = getElement("[avra-element='ss-modal-result-count']", modalEl);
    const modalResultQueryEl = getElement("[avra-element='ss-modal-result-query']", modalEl);

    const podcastList = getElement("[avra-element='ss-podcast-list']");
    const podcastEls = getElements("[avra-element='ss-podcast']", podcastList);

    const insightList = getElement("[avra-element='ss-insight-list']");
    const insightEls = getElements("[avra-element='ss-insight']", insightList);

    const wikiList = getElement("[avra-element='ss-wiki-list']");
    const wikiEls = getElements("[avra-element='ss-wiki']", wikiList);

    // Move all content elements to the visible list and sort them
    const allContentElements = [...wikiEls, ...insightEls, ...podcastEls].sort(sortByContentType);

    resultsListEl.innerHTML = "";
    allContentElements.forEach((el) => {
        // clear webflow CMS classes
        el.classList.remove("w-dyn-bind-empty");
        const resultText = getElement("[avra-element='ss-card-text']", el);
        if (resultText) {
            resultText.classList.remove("w-dyn-bind-empty");
        }

        // show only wikis
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

        // console.log("results", results);

        // hide all content elements
        for (const el of allContentElements) {
            el.style.display = "none";
        }

        for (const result of results) {
            const matchEl = listEls.find((el) => {
                const slug = el.getAttribute("data-avra-slug");
                const urlParts = result.url.split("/");
                const resultSlug = urlParts[urlParts.length - 1];
                return slug === resultSlug;
            });

            if (matchEl) {
                // console.log("found match:", result, matchEl);

                // inject highlight text
                const resultText = getElement("[avra-element='ss-card-text']", matchEl);
                if (resultText) {
                    // TODO: find text to highlight within body
                    resultText.innerHTML = result.highlight.body.replace(/<em>/g, "<strong>").replace(/<\/em>/g, "</strong>");
                    resultText.classList.remove("w-dyn-bind-empty");
                }

                // Add highlighted text as query parameter to anchor links
                const highlightText = extractCleanHighlightText(result.highlight.body);
                console.log("highlightText", highlightText);
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
                if (visibleContentCount >= config.searchResults) {
                    // console.log("max results reached, not showing in search results");
                    hiddenContentCount++;
                    continue;
                }

                // make visible
                matchEl.style.display = "block";
                visibleContentCount++;

                (listEl.parentElement as HTMLElement).style.display = "";
            } else {
                console.warn(`No matching element found for ${result.type} with slug from URL: ${result.url}`);
                hiddenContentCount++;
            }
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
        modalResultCountEl.textContent = `${visibleContentCount + hiddenContentCount} results for “${searchValue}”`;
        modalResultQueryEl.textContent = searchValue;

        // sort modal results by content type
        const sortedElements = Array.from(modalListEl.children);
        sortedElements.sort(sortByContentType);

        // Clear and re-append in sorted order
        modalListEl.innerHTML = "";
        sortedElements.forEach((element) => {
            modalListEl.appendChild(element);
        });
    }, config.searchDebounce);

    searchInput.addEventListener("input", async (e) => {
        const searchValue = (e.target as HTMLInputElement).value.toLowerCase().trim();
        if (searchValue.length > 0) {
            debouncedSearchWithClearSelection(searchValue);
        }
    });

    // remove webflow form functionality
    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        e.stopPropagation();
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
    }, config.searchDebounce);
});
