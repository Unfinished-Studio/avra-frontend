import { getElement, getElements } from "utils/dom/elements";

window.Webflow ||= [];
window.Webflow.push(async () => {
    if (!window.location.search.includes("test")) return;

    const searchInput = getElement("[avra-element='ss-search-input']");

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

    // Add event listener for search input
    searchInput?.addEventListener("input", (e) => {
        const searchValue = (e.target as HTMLInputElement).value.toLowerCase().trim();

        let visibleAlumniCount = 0;
        let hiddenAlumniCount = 0;

        let visibleContentCount = 0;
        let hiddenContentCount = 0;

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

        // Show/hide alumni empty state based on visible count
        if (alumniEmptyEl) {
            alumniEmptyEl.style.display = visibleAlumniCount === 0 ? "" : "none";
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
                } else {
                    hiddenContentCount++;
                }
            }
        }

        // Filter insight elements
        if (insightEls && insightEls.length > 0) {
            for (const insightEl of insightEls) {
                const titleEl = getElement("[avra-element='ss-insight-title']", insightEl);
                const title = titleEl?.textContent?.toLowerCase() || "";

                const isMatch = title.includes(searchValue);
                insightEl.style.display = isMatch ? "" : "none";

                if (isMatch) {
                    visibleContentCount++;
                } else {
                    hiddenContentCount++;
                }
            }
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
                } else {
                    hiddenContentCount++;
                }
            }
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
    });
});
