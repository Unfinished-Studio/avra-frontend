import { podcastArticles, sessionInsightsBatches, wikiItems } from "@/data/sidebar";
import { getAvraElement, getElements } from "@/utils/dom/elements";
import { gsap } from "gsap";

const activeClass = "is-active";
let sidebarInitialized = false;

export const getCurrentPageInfo = () => {
    const dataEl = document.querySelector<HTMLElement>("[avra-element='item-data']");
    const currentUrl = window.location.pathname;

    let currentSlug = null;
    let currentType: "wiki" | "session" | "podcast" | "case-study" | null = null;

    if (dataEl) {
        currentSlug = dataEl.getAttribute("data-avra-slug");
    }

    // Determine type from URL
    if (currentUrl.includes("/avra-wiki/")) {
        currentType = "wiki";
        if (!currentSlug) {
            // Extract slug from URL if not in data element
            const pathParts = currentUrl.split("/");
            currentSlug = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2];
        }
    } else if (currentUrl.includes("/session-insights/")) {
        currentType = "session";
        if (!currentSlug) {
            const pathParts = currentUrl.split("/");
            currentSlug = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2];
        }
    } else if (currentUrl.includes("/audio-video/")) {
        currentType = "podcast";
        if (!currentSlug) {
            const pathParts = currentUrl.split("/");
            currentSlug = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2];
        }
    } else if (currentUrl.includes("/case-studies/")) {
        currentType = "case-study";
        if (!currentSlug) {
            const pathParts = currentUrl.split("/");
            currentSlug = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2];
        }
    }

    return { currentSlug, currentType, currentUrl };
};

const initializeSidebar = () => {
    const dataContainer = getAvraElement("data-container");
    const wikiList = getAvraElement("ss-wiki-list", dataContainer);
    const sessionList = getAvraElement("ss-session-list", dataContainer);
    // const caseStudyList = getAvraElement("ss-case-study-list", dataContainer);
    const podcastList = getAvraElement("ss-podcast-list", dataContainer);

    const wikiElements = getElements<HTMLAnchorElement>("[avra-element='ss-wiki']", wikiList);
    const sessionInsightElements = getElements<HTMLAnchorElement>("[avra-element='ss-session']", sessionList);
    // const caseStudyItems = getElements<HTMLAnchorElement>("[avra-element='ss-case-study']", caseStudyList);
    const podcastElements = getElements<HTMLAnchorElement>("[avra-element='ss-podcast']", podcastList);

    const sidebar = getAvraElement("wiki-sidebar");

    /* 
    Section Template Structure:
    * wiki-section-title (div)
    *   wiki-section-title-text (div)
    * wiki-section-item (a)
    *   wiki-section-item-text (div)
    */
    const sectionList = getAvraElement("wiki-section-list", sidebar);
    const sectionTemplate = getAvraElement("wiki-section-template", sectionList).cloneNode(true) as HTMLElement;
    sectionTemplate.remove();

    // Sidebar sections data
    const sidebarSections = [
        // TODO: filter for favorited items from user localstorage (see favorites page logic)
        // { title: "Favorited", items: },
        { title: "Wiki Topics", items: wikiElements },
        // { title: "Case Studies", items: caseStudyItems },
        { title: "Session Insights", items: sessionInsightElements },
        { title: "Podcast Episodes", items: podcastElements },
    ];
    const sectionsToAdd: HTMLElement[] = [];

    // Create the sidebar sections
    for (const sidebarSection of sidebarSections) {
        const { title, items } = sidebarSection;

        const section = sectionTemplate.cloneNode(true) as HTMLElement;
        section.setAttribute("data-title", title);

        const sectionTitle = getAvraElement("wiki-section-title", section);
        const sectionTitleText = getAvraElement("wiki-section-title-text", sectionTitle);
        sectionTitleText.textContent = title;

        // build the wiki items
        const sectionItemTemplateElement = getAvraElement("wiki-section-item", section);
        const sectionItemTemplate = sectionItemTemplateElement.cloneNode(true) as HTMLElement;
        sectionItemTemplateElement.remove();
        const sectionItemsToAdd: HTMLElement[] = [];

        if (title === "Wiki Topics") {
            // use hardcoded wiki tag data to create the Wiki sidebar section
            for (const wikiTag of wikiItems) {
                const sectionItem = sectionItemTemplate.cloneNode(true) as HTMLAnchorElement;
                const sectionItemText = getAvraElement<HTMLAnchorElement>("wiki-section-item-text", sectionItem);
                sectionItemText.textContent = wikiTag.title;
                sectionItemText.href = `/avra-wiki/${wikiTag.slug}`; // TODO: correct slugs in hardcoded data

                // Store slug as data attribute for later highlighting
                sectionItem.setAttribute("data-wiki-slug", wikiTag.slug);

                sectionItemsToAdd.push(sectionItem);

                const insightItemTemplate = getAvraElement("wiki-insight-item", sectionItem);
                const insightItemsToAdd: HTMLElement[] = [];

                for (const subItem of wikiTag.subItems) {
                    const insightItem = insightItemTemplate.cloneNode(true) as HTMLAnchorElement;
                    const insightItemText = getAvraElement<HTMLAnchorElement>("wiki-insight-item-text", insightItem);
                    insightItemText.textContent = subItem.displayTitle;
                    if (subItem.type === "heading") {
                        insightItemText.href = sectionItemText.href + `?highlight=${subItem.title}`;
                    } else if (subItem.type === "item") {
                        insightItemText.href = subItem.title;
                    }
                    insightItemsToAdd.push(insightItem);

                    // build sub-subitems (if they exist)
                    try {
                        const insightHeadingItemTemplateElement = getAvraElement("wiki-insight-heading-item", insightItem);
                        const insightHeadingItemTemplate = insightHeadingItemTemplateElement.cloneNode(true) as HTMLElement;
                        insightHeadingItemTemplateElement.remove();
                        const insightHeadingItemsToAdd: HTMLElement[] = [];

                        if (subItem.subItems) {
                            for (const subSubItem of subItem.subItems) {
                                const insightHeadingItem = insightHeadingItemTemplate.cloneNode(true) as HTMLAnchorElement;
                                const insightHeadingItemText = getAvraElement<HTMLAnchorElement>(
                                    "wiki-insight-heading-item-text",
                                    insightHeadingItem
                                );
                                insightHeadingItemText.textContent = subSubItem.displayTitle;
                                if (subSubItem.type === "heading") {
                                    insightHeadingItemText.href = sectionItemText.href + `?highlight=${subSubItem.title}`;
                                } else if (subSubItem.type === "item") {
                                    insightHeadingItemText.href = subSubItem.title;
                                }
                                insightHeadingItemsToAdd.push(insightHeadingItem);

                                // build sub-sub-subitems (if they exist)
                                const subInsightHeadingItemTemplateElement = getAvraElement(
                                    "wiki-insight-heading-item-2",
                                    insightHeadingItem
                                );
                                const subInsightHeadingItemTemplate = subInsightHeadingItemTemplateElement.cloneNode(true) as HTMLElement;
                                subInsightHeadingItemTemplateElement.remove();
                                const subInsightHeadingItemsToAdd: HTMLElement[] = [];

                                if (subSubItem.subItems) {
                                    try {
                                        for (const subSubSubItem of subSubItem.subItems) {
                                            const subInsightHeadingItem = subInsightHeadingItemTemplate.cloneNode(
                                                true
                                            ) as HTMLAnchorElement;
                                            const subInsightHeadingItemText = getAvraElement<HTMLAnchorElement>(
                                                "wiki-insight-heading-item-text-2",
                                                subInsightHeadingItem
                                            );
                                            subInsightHeadingItemText.textContent = subSubSubItem.displayTitle;
                                            if (subSubSubItem.type === "heading") {
                                                subInsightHeadingItemText.href = sectionItemText.href + `?highlight=${subSubSubItem.title}`;
                                            } else if (subSubSubItem.type === "item") {
                                                subInsightHeadingItemText.href = subSubSubItem.title;
                                            }
                                            subInsightHeadingItemsToAdd.push(subInsightHeadingItem);
                                        }

                                        while (insightHeadingItem.children.length > 1) {
                                            insightHeadingItem.removeChild(insightHeadingItem.lastChild!);
                                        }
                                        for (const subInsightHeadingItem of subInsightHeadingItemsToAdd) {
                                            insightHeadingItem.appendChild(subInsightHeadingItem);
                                        }
                                    } catch (err) {
                                        console.log("Error getting sub-insight heading item for ", insightHeadingItem);
                                    }
                                }

                                subInsightHeadingItemTemplate.remove();
                            }

                            while (insightItem.children.length > 1) {
                                insightItem.removeChild(insightItem.lastChild!);
                            }
                            for (const insightHeadingItem of insightHeadingItemsToAdd) {
                                insightItem.appendChild(insightHeadingItem);
                            }

                            insightHeadingItemTemplate.remove();
                        }
                    } catch (err) {
                        console.log("Error getting insight heading item for ", insightItem);
                    }
                }

                while (sectionItem.children.length > 1) {
                    sectionItem.removeChild(sectionItem.lastChild!);
                }
                for (const insightItem of insightItemsToAdd) {
                    sectionItem.appendChild(insightItem);
                }

                insightItemTemplate.remove();
                // sectionsToAdd.push(section);
            }
        } else if (title === "Session Insights") {
            for (const batch of sessionInsightsBatches) {
                const sectionItem = sectionItemTemplate.cloneNode(true) as HTMLAnchorElement;
                const sectionItemText = getAvraElement<HTMLAnchorElement>("wiki-section-item-text", sectionItem);
                sectionItemText.textContent = batch.title;
                sectionItemsToAdd.push(sectionItem);

                const subItemTemplate = getAvraElement("wiki-insight-item", sectionItem);
                const subItemsToAdd: HTMLElement[] = [];

                for (const sessionInsightItem of batch.sessionInsights) {
                    const subItem = subItemTemplate.cloneNode(true) as HTMLAnchorElement;
                    const subItemText = getAvraElement<HTMLAnchorElement>("wiki-insight-item-text", subItem);
                    subItemText.textContent = sessionInsightItem.name;
                    subItemText.href = `/session-insights/${sessionInsightItem.slug}`;

                    // Store slug as data attribute for later highlighting
                    subItem.setAttribute("data-session-slug", sessionInsightItem.slug);

                    subItemsToAdd.push(subItem);

                    // TODO: handle sessionInsightItem properties (wikiTags and smartSearchKeywords)

                    // remove template element
                    const subSubItemTemplateElement = getAvraElement("wiki-insight-heading-item", subItem);
                    subSubItemTemplateElement.remove();
                }

                while (sectionItem.children.length > 1) {
                    sectionItem.removeChild(sectionItem.lastChild!);
                }
                for (const subItem of subItemsToAdd) {
                    sectionItem.appendChild(subItem);
                }

                subItemTemplate.remove();
            }
        } else if (title === "Podcast Episodes") {
            for (const podcastArticle of podcastArticles) {
                const sectionItem = sectionItemTemplate.cloneNode(true) as HTMLAnchorElement;
                const sectionItemText = getAvraElement<HTMLAnchorElement>("wiki-section-item-text", sectionItem);
                sectionItemText.textContent = podcastArticle.name;
                sectionItemText.href = `/audio-video/${podcastArticle.slug}`;

                // Store slug as data attribute for later highlighting
                sectionItem.setAttribute("data-podcast-slug", podcastArticle.slug);

                sectionItemsToAdd.push(sectionItem);

                const subItemTemplate = getAvraElement("wiki-insight-item", sectionItem);
                subItemTemplate.remove();

                // TODO: handle podcastArticle properties (wikiTags and smartSearchKeywords)

                while (sectionItem.children.length > 1) {
                    sectionItem.removeChild(sectionItem.lastChild!);
                }
            }
        } else {
            for (const item of items) {
                // build item
                const itemTitle = item.getAttribute("data-avra-title") || "#";
                const sectionItem = sectionItemTemplate.cloneNode(true) as HTMLAnchorElement;
                const sectionItemText = getAvraElement<HTMLAnchorElement>("wiki-section-item-text", sectionItem);

                sectionItemText.textContent = itemTitle;
                sectionItemText.href = item.href;
                sectionItemsToAdd.push(sectionItem);

                const insightItemTemplate = getAvraElement("wiki-insight-item", sectionItem);
                insightItemTemplate.remove();

                // if this is a valid wiki article, build the subitems (session insights)
                // const wikiTagData = wikiTags.find((tag) => tag.title === itemTitle);
                // if (wikiTagData) {
                //     const insightItemTemplate = getAvraElement("wiki-insight-item", sectionItem);
                //     const insightItemsToAdd: HTMLElement[] = [];

                //     for (const insight of wikiTagData.insights) {
                //         const insightItem = insightItemTemplate.cloneNode(true) as HTMLAnchorElement;
                //         const insightItemText = getAvraElement<HTMLAnchorElement>("wiki-insight-item-text", insightItem);
                //         insightItemText.textContent = insight.title;
                //         insightItemText.href = `/session-insights/${insight.slug}`;
                //         insightItemsToAdd.push(insightItem);

                //         // build sub-subitems (session insight headings)
                //         const insightHeadingItemTemplate = getAvraElement("wiki-insight-heading-item", insightItem);
                //         const insightHeadingItemsToAdd: HTMLElement[] = [];

                //         for (const heading of insight.headings) {
                //             const insightHeadingItem = insightHeadingItemTemplate.cloneNode(true) as HTMLAnchorElement;
                //             const insightHeadingItemText = getAvraElement<HTMLAnchorElement>(
                //                 "wiki-insight-heading-item-text",
                //                 insightHeadingItem
                //             );
                //             insightHeadingItemText.textContent = heading.title;
                //             insightHeadingItemText.href = `/session-insights/${heading.slug}`;
                //             insightHeadingItemsToAdd.push(insightHeadingItem);
                //         }

                //         while (insightItem.children.length > 1) {
                //             insightItem.removeChild(insightItem.lastChild!);
                //         }
                //         for (const insightHeadingItem of insightHeadingItemsToAdd) {
                //             insightItem.appendChild(insightHeadingItem);
                //         }

                //         insightHeadingItemTemplate.remove();
                //     }

                //     while (sectionItem.children.length > 1) {
                //         sectionItem.removeChild(sectionItem.lastChild!);
                //     }
                //     for (const insightItem of insightItemsToAdd) {
                //         sectionItem.appendChild(insightItem);
                //     }

                //     insightItemTemplate.remove();
                //     // sectionsToAdd.push(section);
                // }
            }
        }

        while (section.children.length > 1) {
            section.removeChild(section.lastChild!);
        }
        for (const sectionItem of sectionItemsToAdd) {
            section.appendChild(sectionItem); // TODO: add to top of list
        }

        sectionItemTemplate.remove();
        sectionsToAdd.push(section);
    }

    sectionList.innerHTML = "";
    for (const section of sectionsToAdd) {
        sectionList.appendChild(section);
    }
};

const updateSidebarHighlighting = (currentSlug: string | null, currentType: string | null) => {
    const textElementSelector = "[avra-element='wiki-section-item-text'], [avra-element='wiki-insight-item-text']";

    // Clear all existing highlighting
    const allItems = document.querySelectorAll<HTMLElement>("[data-wiki-slug], [data-session-slug], [data-podcast-slug]");

    allItems.forEach((item) => {
        const textElement = item.querySelector<HTMLElement>(textElementSelector);
        if (textElement) {
            textElement.classList.remove(activeClass);
        }
    });

    // Apply highlighting to current page
    if (currentSlug && currentType) {
        let selector = "";
        if (currentType === "wiki") {
            selector = `[data-wiki-slug="${currentSlug}"]`;
        } else if (currentType === "session") {
            selector = `[data-session-slug="${currentSlug}"]`;
        } else if (currentType === "podcast") {
            selector = `[data-podcast-slug="${currentSlug}"]`;
        }

        if (selector) {
            const currentItem = document.querySelector<HTMLElement>(selector);
            if (currentItem) {
                const textElement = currentItem.querySelector<HTMLElement>(textElementSelector);
                if (textElement) {
                    textElement.classList.add(activeClass);
                }
            }
        }
    }
};

const setupItemDropdown = (textSelector: string, childSelector: string, currentType: string | null, currentSlug: string | null) => {
    const textElements = getElements<HTMLElement>(textSelector);

    console.log("handling dropdown layer", { textSelector, childSelector, currentType, currentSlug });

    // the current item for the page, all dropdowns open to reveal this
    let currentItem: HTMLElement | null = null;
    let activeTextElements: Record<string, HTMLElement | null> = {
        one: null,
        two: null,
        three: null,
        four: null,
    };

    for (const textElement of textElements) {
        const dropdownBtn = textElement.nextElementSibling as HTMLElement;
        if (!dropdownBtn) continue;

        let dropdownParent = textElement.parentElement!.parentElement!;
        if (!dropdownParent) return;

        const childItems = getElements<HTMLElement>(childSelector, dropdownParent);

        for (const child of childItems) {
            const linkElement = child.querySelector("a");
            if (linkElement) {
                linkElement.classList.remove(activeClass);
            }
        }

        // set up dropdown if not configured
        const dropdownConfigured = dropdownParent.getAttribute("data-avra-dropdown-configured") === "true";
        try {
            if (!dropdownConfigured) {
                dropdownParent.setAttribute("data-avra-dropdown-configured", "true");

                if (childItems.length === 0) {
                    dropdownBtn.remove();
                    throw new Error("No child elements for dropdown, removing arrow");
                }

                dropdownBtn.addEventListener("click", (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    const dropdownExpanded = dropdownBtn.getAttribute("data-avra-dropdown-expanded") === "true";
                    if (dropdownExpanded) {
                        dropdownBtn.setAttribute("data-avra-dropdown-expanded", "false");

                        // Collapse - animate to height 0, opacity 0, and marginTop 0, then hide
                        gsap.to(childItems, {
                            height: 0,
                            opacity: 0,
                            marginTop: 0,
                            duration: 0.25,
                            ease: "power2.out",
                            stagger: 0.05,
                            onComplete: () => {
                                childItems.forEach((item) => {
                                    gsap.set(item, { display: "none" });
                                });
                            },
                        });

                        // Rotate arrow back
                        gsap.to(dropdownBtn, {
                            rotation: 0,
                            duration: 0.25,
                            ease: "power2.out",
                        });
                    } else {
                        dropdownBtn.setAttribute("data-avra-dropdown-expanded", "true");

                        // Expand - first show elements, then animate
                        childItems.forEach((item) => {
                            gsap.set(item, { display: "flex" });
                        });

                        gsap.to(childItems, {
                            height: "auto",
                            opacity: 1,
                            marginTop: "8px",
                            duration: 0.25,
                            ease: "power2.out",
                            stagger: 0.05,
                        });

                        // Rotate arrow down
                        gsap.to(dropdownBtn, {
                            rotation: 180,
                            duration: 0.25,
                            ease: "power2.out",
                        });
                    }
                });
            }
        } catch (err) {
            // console.log("Error configuring dropdown:", err);
        }

        // toggle open/close state based on current page
        const isWikiTopic = currentType === "wiki" || currentType === "case-study";
        let shouldBeExpanded = false;

        if (textSelector === "[avra-element='wiki-section-title-text']") {
            // Section titles - open the section that contains the current page
            const matchingChild = childItems.find((child) => {
                const links = child.querySelectorAll("a");
                return Array.from(links).some((link) => link.href === location.href);
            });

            if (matchingChild) {
                if (!activeTextElements.one) {
                    activeTextElements.one = matchingChild;
                    shouldBeExpanded = true;
                }

                for (const child of childItems) {
                    const linkElement = child.querySelector("a");
                    if (linkElement) {
                        linkElement.classList.remove(activeClass);
                    }
                }
                const matchingChildTextElement = matchingChild.querySelector("a");
                if (matchingChildTextElement) {
                    matchingChildTextElement.classList.add(activeClass);
                }
            }

            const sectionText = textElement.textContent?.toLowerCase() || "";
            if (sectionText === "wiki topics" && (currentType === "wiki" || currentType === "case-study")) {
                shouldBeExpanded = true;
            } else if (sectionText === "session insights" && currentType === "session") {
                shouldBeExpanded = true;
            } else if (sectionText === "podcast episodes" && currentType === "podcast") {
                shouldBeExpanded = true;
            } else if (sectionText === "wiki topics") {
                // Keep Wiki Topics open by default when not on a specific content page
                shouldBeExpanded = currentType === null;
            }
        } else if (textSelector === "[avra-element='wiki-section-item-text']" && isWikiTopic) {
            // Wiki article dropdowns - open if this is the current wiki article
            // const linkElement = textElement as HTMLAnchorElement;
            // shouldBeExpanded =
            //     linkElement.href.includes(`/avra-wiki/${currentSlug}`) || linkElement.href.includes(`/case-studies/${currentSlug}`);

            const matchingChild = childItems.find((child) => {
                const links = child.querySelectorAll("a");
                return Array.from(links).some((link) => link.href === location.href);
            });

            if (matchingChild) {
                if (!activeTextElements.two) {
                    activeTextElements.two = matchingChild;
                    shouldBeExpanded = true;
                }

                const matchingChildTextElement = matchingChild.querySelector("a");
                if (matchingChildTextElement) {
                    matchingChildTextElement.classList.add(activeClass);
                }
            }
        } else if (textSelector === "[avra-element='wiki-insight-item-text']" && isWikiTopic) {
            // Sub-item dropdowns - open if parent contains current page
            const matchingChild = childItems.find((child) => {
                const links = child.querySelectorAll("a");
                return Array.from(links).some((link) => link.href === location.href);
            });

            if (matchingChild) {
                currentItem = matchingChild;
                shouldBeExpanded = true;

                const matchingChildTextElement = matchingChild.querySelector("a");
                if (matchingChildTextElement) {
                    matchingChildTextElement.classList.add(activeClass);
                }
            }
        } else if (textSelector === "[avra-element='wiki-insight-heading-item-text']" && isWikiTopic) {
            const matchingChild = childItems.find((child) => {
                const links = child.querySelectorAll("a");
                return Array.from(links).some((link) => link.href === location.href);
                // return Array.from(links).some(
                //     (link) => link.href.includes(`/avra-wiki/${currentSlug}`) || link.href.includes(`/case-studies/${currentSlug}`)
                // );
            });

            if (matchingChild) {
                if (!activeTextElements.three) {
                    activeTextElements.three = matchingChild;
                    shouldBeExpanded = true;
                }

                const matchingChildTextElement = matchingChild.querySelector("a");
                if (matchingChildTextElement) {
                    matchingChildTextElement.classList.add(activeClass);
                }
            }
        } else {
            // For deeper nested items, keep closed by default unless specifically needed
            shouldBeExpanded = false;
        }

        if (shouldBeExpanded) {
            childItems.forEach((item) => {
                gsap.set(item, { height: "auto", opacity: 1, overflow: "visible", display: "flex", marginTop: "8px" });
            });
            gsap.set(dropdownBtn, { rotation: 180 });
            dropdownBtn.setAttribute("data-avra-dropdown-expanded", "true");
        } else {
            childItems.forEach((item) => {
                gsap.set(item, { height: 0, opacity: 0, overflow: "hidden", display: "none", marginTop: 0 });
            });
            dropdownBtn.setAttribute("data-avra-dropdown-expanded", "false");
            gsap.set(dropdownBtn, { rotation: 0 });
        }
    }
};

const setupSidebarDropdowns = (currentType: string | null, currentSlug: string | null) => {
    setupItemDropdown("[avra-element='wiki-section-title-text']", "[avra-element='wiki-section-item']", currentType, currentSlug);
    setupItemDropdown("[avra-element='wiki-section-item-text']", "[avra-element='wiki-insight-item']", currentType, currentSlug);
    setupItemDropdown("[avra-element='wiki-insight-item-text']", "[avra-element='wiki-insight-heading-item']", currentType, currentSlug);
    setupItemDropdown(
        "[avra-element='wiki-insight-heading-item-text']",
        "[avra-element='wiki-insight-heading-item-2']",
        currentType,
        currentSlug
    );
};

export const updateSidebarState = () => {
    const { currentSlug, currentType, currentUrl } = getCurrentPageInfo();
    console.log("PAGE INFO:", { currentSlug, currentType, currentUrl });

    // updateSidebarHighlighting(currentSlug, currentType);
    setupSidebarDropdowns(currentType, currentSlug);
};

export const Sidebar = () => {
    if (!sidebarInitialized) {
        initializeSidebar();
        sidebarInitialized = true;
    }
    updateSidebarState();
};
