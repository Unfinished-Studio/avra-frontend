import { getElement, getElements } from "utils/dom/elements";
import { getAdminAccess } from "utils/admin/getAdminAccess";

// Configuration
const config = {
    api: "https://avra-worker.nic-f66.workers.dev",
    searchDebounce: 500,
    initialCounts: {
        alumni: 5,
        podcasts: 4,
        insights: 2,
        wiki: 3,
    },
} as const;

interface SearchInsight {
    title: string;
    slug: string;
    transcript: string;
    matchContext: string;
}

interface SearchResponse {
    insights: SearchInsight[];
    podcasts: SearchInsight[];
    wikis: SearchInsight[];
}

interface ElementConfig {
    elements: Element[];
    initialVisibleCount: number;
    listElement: Element;
    buttonElement?: Element;
    emptyElement?: Element;
}

/**
 * Fetches insights from the API and converts them to an array of insights
 * @param query - The search query
 * @returns The insights matching the search
 */
const handleSearch = async (query: string) => {
    const params = new URLSearchParams();
    params.set("query", query);
    const response = await fetch(`${config.api}/api/search?${String(params)}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const res = await response.text();
        throw new Error(`Failed to fetch insights - ${response.status} ${res}`);
    }

    const data: SearchResponse = await response.json();
    return data;
};

function initializeRandomElements({ elements, initialVisibleCount, listElement, buttonElement, emptyElement }: ElementConfig) {
    // Hide all elements initially
    elements.forEach((el) => ((el as HTMLElement).style.display = "none"));

    // Show random elements
    const shuffled = [...elements].sort(() => Math.random() - 0.5);
    const visibleCount = Math.min(initialVisibleCount, elements.length);

    shuffled.slice(0, visibleCount).forEach((el) => ((el as HTMLElement).style.display = ""));

    // Update button text if exists
    if (buttonElement) {
        const hiddenCount = elements.length - visibleCount;
        buttonElement.textContent = hiddenCount > 0 ? `View ${hiddenCount} More` : "View All";
    }

    if (emptyElement) {
        (emptyElement as HTMLElement).style.display = "none";
    }

    return { shuffled, visibleCount };
}

const debounce = <F extends (...args: any[]) => any>(func: F, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: Parameters<F>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

window.Webflow ||= [];
window.Webflow.push(async () => {
    const adminAccess = getAdminAccess();
    if (!adminAccess) return;

    const searchForm = getElement("[avra-element='ss-search-form']");
    const searchInput = getElement<HTMLInputElement>("[avra-element='ss-search-input']", searchForm);

    const alumniBtn = getElement("[avra-element='ss-alumni-btn']");
    const alumniEmptyEl = getElement("[avra-element='ss-alumni-empty']");

    const contentBtn = getElement("[avra-element='ss-content-btn']");
    const contentEmptyEl = getElement("[avra-element='ss-content-empty']");

    const alumniList = getElement("[avra-element='ss-alumni-list']");
    const alumniEls = getElements("[avra-element='ss-alumni']", alumniList);

    const podcastList = getElement("[avra-element='ss-podcast-list']");
    const podcastEls = getElements("[avra-element='ss-podcast']", podcastList);

    const insightList = getElement("[avra-element='ss-insight-list']");
    const insightEls = getElements("[avra-element='ss-insight']", insightList);

    const wikiList = getElement("[avra-element='ss-wiki-list']");
    const wikiEls = getElements("[avra-element='ss-wiki']", wikiList);

    alumniEmptyEl.style.display = "none";
    contentEmptyEl.style.display = "none";

    initializeRandomElements({
        elements: alumniEls,
        initialVisibleCount: config.initialCounts.alumni,
        listElement: alumniList,
        buttonElement: alumniBtn,
        emptyElement: alumniEmptyEl,
    });

    initializeRandomElements({
        elements: podcastEls,
        initialVisibleCount: config.initialCounts.podcasts,
        listElement: podcastList,
        buttonElement: contentBtn,
        emptyElement: contentEmptyEl,
    });

    initializeRandomElements({
        elements: insightEls,
        initialVisibleCount: config.initialCounts.insights,
        listElement: insightList,
        buttonElement: contentBtn,
        emptyElement: contentEmptyEl,
    });

    initializeRandomElements({
        elements: wikiEls,
        initialVisibleCount: config.initialCounts.wiki,
        listElement: wikiList,
        buttonElement: contentBtn,
        emptyElement: contentEmptyEl,
    });

    // Create debounced search handler
    const debouncedSearch = debounce(async (searchValue: string) => {
        let visibleAlumniCount = 0;
        let hiddenAlumniCount = 0;

        let visibleContentCount = 0;
        let hiddenContentCount = 0;

        // TODO: better error logging
        function filterList(listEl: HTMLElement, listEls: HTMLElement[], searchResults: SearchInsight[]) {
            if (!listEls.length) {
                throw new Error("No list elements");
            }

            console.log("filtering list:", listEl, listEls, searchResults);

            let visibleCount = 0;

            for (const listEl of listEls) {
                const slug = listEl.getAttribute("data-avra-slug");
                if (!slug) {
                    continue;
                }

                const result = searchResults.find((result) => result.slug === slug);

                const resultText = getElement("[avra-element='ss-card-text']", listEl);

                resultText.style.display = result ? "block" : "none";
                listEl.style.display = result ? "block" : "none";

                if (result) {
                    resultText.innerHTML = result.matchContext;
                    visibleContentCount++;
                    visibleCount++;
                    resultText.classList.remove("w-dyn-bind-empty");
                    listEl.classList.remove("w-dyn-bind-empty");
                } else {
                    hiddenContentCount++;
                }
            }

            listEl.parentElement!.style.display = visibleCount === 0 ? "none" : "";
        }

        const { insights, podcasts, wikis } = await handleSearch(searchValue);

        try {
            filterList(insightList, insightEls, insights);
            filterList(podcastList, podcastEls, podcasts);
            filterList(wikiList, wikiEls, wikis);
        } catch (err) {
            console.log("Error filtering elements:", err);
        }

        // Filter alumni elements based on search input
        for (const alumniEl of alumniEls) {
            const fnameEl = getElement("[avra-element='ss-alumni-fname']", alumniEl);
            const lnameEl = getElement("[avra-element='ss-alumni-lname']", alumniEl);

            const fname = fnameEl?.textContent?.toLowerCase() || "";
            const lname = lnameEl?.textContent?.toLowerCase() || "";

            // Check if name contains search value
            const isMatch = fname.includes(searchValue) || lname.includes(searchValue);

            // Show/hide alumni element based on match and max visible count
            if (isMatch) {
                alumniEl.style.display = visibleAlumniCount < 5 ? "" : "none";
                if (visibleAlumniCount < 5) {
                    visibleAlumniCount++;
                } else {
                    hiddenAlumniCount++;
                }
            } else {
                alumniEl.style.display = "none";
                hiddenAlumniCount++;
            }
        }

        // Show/hide alumni list and empty state based on visible count
        if (alumniList) {
            alumniList.parentElement!.style.display = visibleAlumniCount === 0 ? "none" : "";
        }
        if (alumniEmptyEl) {
            alumniEmptyEl.style.display = visibleAlumniCount === 0 ? "" : "none";
            if (visibleAlumniCount === 0) {
                alumniBtn.textContent = "View All";
            }
        }

        // // Filter podcast elements
        // if (podcastEls && podcastEls.length > 0) {
        //     for (const podcastEl of podcastEls) {
        //         const titleEl = getElement("[avra-element='ss-podcast-title']", podcastEl);
        //         const title = titleEl?.textContent?.toLowerCase() || "";

        //         const isMatch = title.includes(searchValue);
        //         podcastEl.style.display = isMatch ? "" : "none";

        //         if (isMatch) {
        //             visibleContentCount++;
        //             visiblePodcastCount++;
        //         } else {
        //             hiddenContentCount++;
        //         }
        //     }
        // }

        // // Show/hide podcast list based on visible count
        // if (podcastList) {
        //     podcastList.parentElement!.style.display = visiblePodcastCount === 0 ? "none" : "";
        // }

        // // Filter wiki elements
        // if (wikiEls && wikiEls.length > 0) {
        //     for (const wikiEl of wikiEls) {
        //         const titleEl = getElement("[avra-element='ss-wiki-title']", wikiEl);
        //         const title = titleEl?.textContent?.toLowerCase() || "";

        //         // const contentEl = getElement("[avra-element='ss-wiki-content']", wikiEl);
        //         // const content = contentEl?.textContent?.toLowerCase() || "";

        //         // const isMatch = title.includes(searchValue) || content.includes(searchValue);
        //         const isMatch = title.includes(searchValue);
        //         wikiEl.style.display = isMatch ? "" : "none";

        //         if (isMatch) {
        //             visibleContentCount++;
        //             visibleWikiCount++;
        //         } else {
        //             hiddenContentCount++;
        //         }
        //     }
        // }

        // // Show/hide wiki list based on visible count
        // if (wikiList) {
        //     wikiList.parentElement!.style.display = visibleWikiCount === 0 ? "none" : "";
        // }

        // Show/hide content empty state based on visible count
        if (contentEmptyEl) {
            contentEmptyEl.style.display = visibleContentCount === 0 ? "" : "none";
        }

        // Update the alumni count display
        if (alumniBtn) {
            alumniBtn.textContent = hiddenAlumniCount > 0 ? `View ${hiddenAlumniCount} More` : "View All";
        }

        // Update the content count display
        if (contentBtn) {
            contentBtn.textContent = hiddenContentCount > 0 ? `View ${hiddenContentCount} More` : "View All";
        }

        if (visibleContentCount === 0) {
            contentBtn.textContent = "View All";
        }
    }, config.searchDebounce);

    searchInput.addEventListener("input", async (e) => {
        const searchValue = (e.target as HTMLInputElement).value.toLowerCase().trim();
        debouncedSearch(searchValue);
    });

    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        e.stopPropagation();
    });
});
