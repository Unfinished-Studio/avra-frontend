import { getAvraElement, getElements } from "@/utils/dom/elements";
import { wikiTags } from "@/data/sidebar";

export const Sidebar = () => {
    const dataContainer = getAvraElement("data-container");
    const wikiList = getAvraElement("ss-wiki-list", dataContainer);
    const sessionList = getAvraElement("ss-session-list", dataContainer);
    const caseStudyList = getAvraElement("ss-case-study-list", dataContainer);
    const podcastList = getAvraElement("ss-podcast-list", dataContainer);

    const wikiItems = getElements<HTMLAnchorElement>("[avra-element='ss-wiki']", wikiList);
    const sessionItems = getElements<HTMLAnchorElement>("[avra-element='ss-session']", sessionList);
    const caseStudyItems = getElements<HTMLAnchorElement>("[avra-element='ss-case-study']", caseStudyList);
    const podcastItems = getElements<HTMLAnchorElement>("[avra-element='ss-podcast']", podcastList);

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
        { title: "Wiki Topics", items: wikiItems },
        { title: "Case Studies", items: caseStudyItems },
        { title: "Session Insights", items: sessionItems },
        { title: "Podcast Episodes", items: podcastItems },
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
            for (const wikiTag of wikiTags) {
                const sectionItem = sectionItemTemplate.cloneNode(true) as HTMLAnchorElement;
                const sectionItemText = getAvraElement<HTMLAnchorElement>("wiki-section-item-text", sectionItem);
                sectionItemText.textContent = wikiTag.title;
                sectionItemText.href = `/avra-wiki/${wikiTag.slug}`; // TODO: correct slugs in hardcoded data
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

    // Handle search form and results
    // right side of the page, where the search/wiki content displays
    // const container = getElement("[avra-element='wiki-container']");

    // LOWKEY: remove this
    // structured list of all items for ease of use in search system
    // const items = [...wikiItems, ...sessionItems, ...caseStudyItems, ...podcastItems].map((item) => {
    //     const link = item.querySelector("a");
    //     return {
    //         title: item.getAttribute("data-avra-title"),
    //         slug: item.getAttribute("data-avra-slug"),
    //         link: link?.getAttribute("href") || null,
    //         type: item.getAttribute("data-avra-type"),
    //         element: item,
    //     };
    // });

    // console.log("structured item list:", items);
};
