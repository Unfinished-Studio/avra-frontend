import { getElement } from "@/utils/dom/elements";
import { WIKI_SESSION_MAPPINGS, type WikiSession } from "@/data/wiki-data";

export const initContentPage = async () => {
    // Handle scroll-to-highlight functionality
    const urlParams = new URLSearchParams(window.location.search);
    const highlightText = urlParams.get("highlight");

    // Favorites Button
    const dataEl = document.querySelector<HTMLElement>("[avra-element='item-data']");
    if (!dataEl) throw new Error("No data element for this CMS page");

    const slug = dataEl.getAttribute("data-avra-slug");
    if (!slug) throw new Error("No slug for this CMS item");

    const ms = window.$memberstackDom;
    let json: any = await ms.getMemberJSON();
    console.log(json);

    let favArr: any[] = [];
    if (json && (json.data || json.favorites)) {
        favArr = json.favorites || json.data.favorites || json.data.data.favorites;
    }
    console.log(favArr);

    let favorited = favArr.some((x: any) => {
        console.log(x.slug, slug);
        return x.slug === slug;
    });

    const favoriteBtns = document.querySelectorAll<HTMLElement>("[avra-element='favorite-btn']");
    for (const btn of favoriteBtns) {
        favorited ? (btn.textContent = "Unfavorite Page") : (btn.textContent = "Favorite Page");

        btn.addEventListener("click", async () => {
            if (favorited) {
                console.log("removing");
                favArr = favArr.filter((x: any) => x.slug !== slug);
                btn.textContent = "Favorite Page";
            } else {
                console.log("adding");
                favArr.push({ page: window.location.href, slug: slug });
                btn.textContent = "Unfavorite Page";
            }
            favorited = favArr.some((x: any) => x.slug === slug);

            if (json.data && json.data.favorites) {
                json.data.favorites = favArr;
            } else {
                json.data = {
                    favorites: favArr,
                };
            }

            const updated = await ms.updateMemberJSON({ json: json });
            json = updated;

            console.log("new json", json);
        });
        btn.classList.remove("hide");
    }

    // Wiki Logic
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

    if (highlightText) {
        // Function to find and scroll to matching text
        const scrollToHighlightedText = () => {
            const content = document.querySelector("[avra-element='wiki-content']");
            if (!content) return;

            // Create a walker to traverse all text nodes
            const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, null);

            let textNode;
            while ((textNode = walker.nextNode())) {
                const text = textNode.textContent?.toLowerCase() || "";
                const searchText = highlightText.toLowerCase();

                if (text.includes(searchText)) {
                    // Found matching text, scroll to it
                    const element = textNode.parentElement;
                    console.log("element", element);
                    if (element) {
                        // Get element position and scroll with 100px offset
                        const elementRect = element.getBoundingClientRect();
                        const elementTop = elementRect.top + window.pageYOffset;

                        window.scrollTo({
                            top: elementTop - 120,
                            behavior: "smooth",
                        });

                        // Highlight the text temporarily
                        const originalHTML = element.innerHTML;
                        const regex = new RegExp(`(${highlightText})`, "gi");
                        element.innerHTML = originalHTML.replace(regex, '<mark style="background: yellow; padding: 2px;">$1</mark>');

                        // Remove highlight after 3 seconds
                        setTimeout(() => {
                            element.innerHTML = originalHTML;
                        }, 3000);

                        break;
                    }
                }
            }
        };

        // Wait for content to load, then scroll
        setTimeout(scrollToHighlightedText, 500);
    }
};
