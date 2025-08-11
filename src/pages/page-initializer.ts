import { WIKI_SESSION_MAPPINGS, type WikiSession } from "@/data/wiki-data";
import { getAvraElement, getElement } from "@/utils/dom/elements";

// TODO: rewrite to work with new scroll to highlight logic
const handleScrollToHighlight = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const highlightText = urlParams.get("highlight");

    const wikiContainer = getAvraElement("wiki-container");

    console.log("highlightText", highlightText);

    if (highlightText) {
        // Function to find and scroll to matching text in headings only
        const scrollToHighlightedText = () => {
            const content = document.querySelector("#wiki-content");
            if (!content) return;

            // Only search within heading elements (h1, h2, h3, h4, h5, h6)
            const headings = content.querySelectorAll("h1, h2, h3, h4, h5, h6");
            const searchText = highlightText.toLowerCase();

            for (const heading of headings) {
                const headingText = heading.textContent?.toLowerCase() || "";

                if (headingText.includes(searchText)) {
                    // Found matching text in heading, scroll to it
                    console.log("element", heading);

                    // Get element position and scroll with 100px offset
                    const elementRect = heading.getBoundingClientRect();
                    const elementTop = elementRect.top + window.pageYOffset;

                    wikiContainer.scrollTo({
                        top: elementTop - 60,
                        behavior: "smooth",
                    });

                    // Highlight the text temporarily
                    const originalHTML = heading.innerHTML;
                    const regex = new RegExp(`(${highlightText})`, "gi");
                    const newHTML = originalHTML.replace(
                        regex,
                        '<mark class="highlight-fade" style="background-color: transparent; transition: background-color 0.5s ease-in-out; padding: 2px;">$1</mark>'
                    );
                    heading.innerHTML = newHTML;

                    const marks = heading.querySelectorAll<HTMLElement>(".highlight-fade");

                    // Fade in
                    setTimeout(() => {
                        marks.forEach((mark) => {
                            mark.style.backgroundColor = "#d6d5d1";
                        });
                    }, 100);

                    // Fade out and remove
                    setTimeout(() => {
                        marks.forEach((mark) => {
                            mark.style.backgroundColor = "transparent";
                        });

                        // Remove the mark after fade out transition ends
                        setTimeout(() => {
                            heading.innerHTML = originalHTML;
                        }, 500); // This should match the transition duration
                    }, 2500);

                    break;
                }
            }
        };

        // Wait for content to load, then scroll
        setTimeout(scrollToHighlightedText, 500);
    }
};

const createTableOfContents = () => {
    try {
        // create table of contents
        const contentContainer = getElement("[avra-element='wiki-content']");
        const headingEls = contentContainer.querySelectorAll<HTMLHeadingElement>("h1, h2, h3, h4");
        const links: HTMLAnchorElement[] = [];

        const wikiNavEl = document.querySelector<HTMLElement>("[avra-element='wiki-nav-links']");
        if (!wikiNavEl) throw new Error("No wiki nav");
        wikiNavEl.innerHTML = "";

        for (let i = 0; i < headingEls.length; i++) {
            const headingEl = headingEls[i];
            if (!headingEl || !headingEl.textContent) continue;

            const id = headingEl.textContent
                .trim()
                .toLowerCase()
                .replace(/[^a-z0-9]/g, "-");
            headingEl.id = id;

            const link = document.createElement("a");
            link.href = "#" + id;
            link.textContent = headingEl.textContent;
            link.className = "wiki-nav-link";
            link.dataset.index = String(i); // Store index for reference

            switch (headingEl.nodeName) {
                case "H1":
                case "H2":
                    break;
                case "H3":
                    link.classList.add("is-lv-2");
                    break;
                case "H4":
                    link.classList.add("is-lv-3");
                    break;
            }

            wikiNavEl.appendChild(link);
            links.push(link); // Store link for later use

            // special for case studies
            if (headingEl.textContent.includes("Case Studies")) {
                // get next list elements and add
                const listEls = headingEl.nextElementSibling?.querySelectorAll<HTMLElement>("ol > li");
                if (listEls) {
                    for (let i = 0; i < listEls.length; i++) {
                        const listHead = listEls[i].querySelector<HTMLElement>("strong");
                        const listItems = listEls[i].querySelectorAll<HTMLElement>("ul > li");

                        const listDiv = document.createElement("div");
                        listDiv.classList.add("wiki-nav-list");

                        // handle heading
                        if (!listHead || !listHead.textContent) continue;
                        const listHeadId = listHead.textContent
                            .trim()
                            .toLowerCase()
                            .replace(/[^a-z0-9]/g, "-");
                        listHead.id = listHeadId;

                        const listHeadLink = document.createElement("a");
                        listHeadLink.href = "#" + listHeadId;
                        listHeadLink.textContent = `${i + 1}. ${listHead.textContent}`;
                        listHeadLink.className = "wiki-nav-link";
                        listHeadLink.classList.add("is-lv-2");

                        listDiv.appendChild(listHeadLink);
                        links.push(listHeadLink);

                        // handle items
                        for (let index = 0; index < listItems.length; index++) {
                            const item = listItems[index];
                            if (!item) continue;

                            let itemEl: HTMLElement | HTMLAnchorElement = item;
                            if (item.querySelector<HTMLAnchorElement>("a")) {
                                itemEl = item.querySelector<HTMLAnchorElement>("a")!;
                            }

                            if (!itemEl || !itemEl.textContent) continue;
                            const itemId = itemEl.textContent
                                .trim()
                                .toLowerCase()
                                .replace(/[^a-z0-9]/g, "-");
                            itemEl.id = itemId;

                            const listItemLink = document.createElement("a");
                            listItemLink.href = "#" + itemId;
                            listItemLink.textContent = `${index + 1}. ${itemEl.textContent}`;
                            listItemLink.className = "wiki-nav-link";
                            listItemLink.classList.add("is-lv-3");

                            listDiv.appendChild(listItemLink);
                            links.push(listItemLink);
                        }

                        wikiNavEl.appendChild(listDiv);
                    }
                }
            }
        }
    } catch (err) {
        console.log("Error running wiki logic:", err);
    }
};

const createSessionLinks = () => {
    const dataEl = document.querySelector<HTMLElement>("[avra-element='item-data']");
    if (!dataEl) return;
    const slug = dataEl.getAttribute("data-avra-slug");
    if (!slug) return;

    try {
        const wikiSessions: WikiSession[] = [];
        const batches: number[] = [];

        for (const [wikiSlug, sessions] of Object.entries(WIKI_SESSION_MAPPINGS)) {
            if (wikiSlug !== slug) {
                continue;
            }

            for (const session of sessions) {
                wikiSessions.push(session);

                if (!batches.includes(session.batch)) {
                    batches.push(session.batch);
                }
            }
        }

        if (!wikiSessions.length) {
            throw new Error("No wiki sessions found for slug: " + slug);
        }
        if (!batches.length) {
            throw new Error("No batches found for slug: " + slug);
        }

        batches.sort((a, b) => a - b);

        const wikiSessionContainer = getElement("[avra-element='wiki-session-links']");
        wikiSessionContainer.innerHTML = "";

        for (const batch of batches) {
            const batchElement = document.createElement("div");
            batchElement.className = "wiki-nav-link";
            batchElement.textContent = `Batch ${batch}`;
            wikiSessionContainer.appendChild(batchElement);

            const batchSessions = wikiSessions.filter((session) => session.batch === batch);
            for (const session of batchSessions) {
                const linkElement = document.createElement("a");
                linkElement.className = "wiki-nav-link-sml";
                linkElement.href = `/session-insights/${session.slug}`;
                linkElement.textContent = session.name;
                wikiSessionContainer.appendChild(linkElement);
            }
        }
    } catch (error) {
        console.error("Error creating dynamic elements:", error);
    }
};

export const initContentPage = async () => {
    handleScrollToHighlight();
    // createTableOfContents();
    // createSessionLinks();
};
