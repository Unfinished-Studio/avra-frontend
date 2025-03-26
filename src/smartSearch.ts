import { getElement, getElements } from "utils/dom/elements";

// const api = "http://localhost:8787";
const api = "https://avra-worker.nic-f66.workers.dev";
const searchDebounce = 1000;

// query -> array of insights matching the search
const handleSearch = async (query: string) => {
    const params = new URLSearchParams();
    params.set("query", query);
    const response = await fetch(`${api}/search?${String(params)}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    console.log(response.status);
    if (!response.ok) {
        console.log(await response.text());
        throw new Error("Failed to fetch insights");
    }

    const data: {
        insights: {
            title: string;
            slug: string;
            transcript: string;
            matchContext: string;
        }[];
    } = await response.json();

    return data;
};

window.Webflow ||= [];
window.Webflow.push(async () => {
    // if (!window.location.search.includes("test")) return;

    const searchInput = getElement<HTMLInputElement>("[avra-element='ss-search-input']");

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

    // Show 5 random alumni elements at start
    const shuffledAlumni = [...alumniEls].sort(() => Math.random() - 0.5);
    const initialAlumniVisibleCount = Math.min(5, alumniEls.length);

    // Initially hide all alumni elements
    for (const alumniEl of alumniEls) {
        alumniEl.style.display = "none";
    }

    // Show the randomly selected alumni
    for (let i = 0; i < initialAlumniVisibleCount; i++) {
        shuffledAlumni[i].style.display = "";
    }

    // Update the alumni count display initially
    if (alumniBtn) {
        const hiddenAlumniCount = alumniEls.length - initialAlumniVisibleCount;
        alumniBtn.textContent = hiddenAlumniCount > 0 ? `View ${hiddenAlumniCount} More` : "View All";
    }

    // Show 5 random podcast elements at start
    const shuffledPodcasts = [...podcastEls].sort(() => Math.random() - 0.5);
    const initialPodcastVisibleCount = Math.min(4, podcastEls.length);

    // Initially hide all podcast elements
    for (const podcastEl of podcastEls) {
        podcastEl.style.display = "none";
    }

    // Show the randomly selected podcasts
    for (let i = 0; i < initialPodcastVisibleCount; i++) {
        shuffledPodcasts[i].style.display = "";
    }

    // Update the podcast count display initially
    if (contentBtn) {
        const hiddenPodcastCount = podcastEls.length - initialPodcastVisibleCount;
        contentBtn.textContent = hiddenPodcastCount > 0 ? `View ${hiddenPodcastCount} More` : "View All";
    }

    // Show 5 random insight elements at start
    const shuffledInsights = [...insightEls].sort(() => Math.random() - 0.5);
    const initialInsightVisibleCount = Math.min(2, insightEls.length);

    // Initially hide all insight elements
    for (const insightEl of insightEls) {
        insightEl.style.display = "none";
    }

    // Show the randomly selected insights
    for (let i = 0; i < initialInsightVisibleCount; i++) {
        shuffledInsights[i].style.display = "";
    }

    // Show 5 random wiki elements at start
    const shuffledWikis = [...wikiEls].sort(() => Math.random() - 0.5);
    const initialWikiVisibleCount = Math.min(3, wikiEls.length);

    // Initially hide all wiki elements
    for (const wikiEl of wikiEls) {
        wikiEl.style.display = "none";
    }

    // Show the randomly selected wikis
    for (let i = 0; i < initialWikiVisibleCount; i++) {
        shuffledWikis[i].style.display = "";
    }

    // Add debounce function to delay search
    const debounce = <F extends (...args: any[]) => any>(func: F, delay: number) => {
        let timeoutId: ReturnType<typeof setTimeout>;
        return (...args: Parameters<F>) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    };

    // Create debounced search handler
    const debouncedSearch = debounce(async (searchValue: string) => {
        let visibleAlumniCount = 0;
        let hiddenAlumniCount = 0;

        let visibleContentCount = 0;
        let hiddenContentCount = 0;

        let visiblePodcastCount = 0;
        let visibleInsightCount = 0;
        let visibleWikiCount = 0;

        // Filter insight elements
        try {
            if (insightEls && insightEls.length > 0) {
                const { insights } = await handleSearch(searchValue);

                console.log("Insights:", insights);

                for (const insightEl of insightEls) {
                    const slug = insightEl.getAttribute("data-avra-slug");
                    if (!slug) continue;

                    const insight = insights.find((insight) => insight.slug === slug);

                    console.log("Insight:", insight);

                    const insightText = getElement("[avra-element='ss-insight-text']", insightEl);
                    insightText.style.display = insight ? "block" : "none";
                    insightEl.style.display = insight ? "block" : "none";

                    if (insight) {
                        insightText.innerHTML = insight.matchContext;
                        visibleContentCount++;
                        visibleInsightCount++;
                    } else {
                        hiddenContentCount++;
                    }
                }
            }

            if (insightList) {
                insightList.parentElement!.style.display = visibleInsightCount === 0 ? "none" : "";
            }
        } catch (err) {
            console.log("Error filtering Session Insight elements:", err);
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

        // Filter podcast elements
        if (podcastEls && podcastEls.length > 0) {
            for (const podcastEl of podcastEls) {
                const titleEl = getElement("[avra-element='ss-podcast-title']", podcastEl);
                const title = titleEl?.textContent?.toLowerCase() || "";

                const isMatch = title.includes(searchValue);
                podcastEl.style.display = isMatch ? "" : "none";

                if (isMatch) {
                    visibleContentCount++;
                    visiblePodcastCount++;
                } else {
                    hiddenContentCount++;
                }
            }
        }

        // Show/hide podcast list based on visible count
        if (podcastList) {
            podcastList.parentElement!.style.display = visiblePodcastCount === 0 ? "none" : "";
        }

        // Filter wiki elements
        if (wikiEls && wikiEls.length > 0) {
            for (const wikiEl of wikiEls) {
                const titleEl = getElement("[avra-element='ss-wiki-title']", wikiEl);
                const title = titleEl?.textContent?.toLowerCase() || "";

                // const contentEl = getElement("[avra-element='ss-wiki-content']", wikiEl);
                // const content = contentEl?.textContent?.toLowerCase() || "";

                // const isMatch = title.includes(searchValue) || content.includes(searchValue);
                const isMatch = title.includes(searchValue);
                wikiEl.style.display = isMatch ? "" : "none";

                if (isMatch) {
                    visibleContentCount++;
                    visibleWikiCount++;
                } else {
                    hiddenContentCount++;
                }
            }
        }

        // Show/hide wiki list based on visible count
        if (wikiList) {
            wikiList.parentElement!.style.display = visibleWikiCount === 0 ? "none" : "";
        }

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
    }, searchDebounce);

    // Add event listener for search input
    searchInput.addEventListener("input", async (e) => {
        const searchValue = (e.target as HTMLInputElement).value.toLowerCase().trim();
        debouncedSearch(searchValue);
    });
});
