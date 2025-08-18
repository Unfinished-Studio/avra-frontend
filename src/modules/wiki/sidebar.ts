import { DROPDOWN_TIERS, podcastArticles, sessionInsightsBatches, wikiItems } from "@/data/sidebar";
import { ACTIVE_CLASS } from "@/utils/constants";
import { getAvraElement, getElements } from "@/utils/dom/elements";
import { isMobile } from "@/utils/mobile";
import { getCurrentPageInfo } from "@/utils/page-info";
import { gsap } from "gsap";

let sidebarInitialized = false;

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
                        insightItemText.href = sectionItemText.href + `?highlight=${encodeURIComponent(subItem.title)}`;
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
                                    insightHeadingItemText.href =
                                        sectionItemText.href + `?highlight=${encodeURIComponent(subSubItem.title)}`;
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
                                                subInsightHeadingItemText.href =
                                                    sectionItemText.href + `?highlight=${encodeURIComponent(subSubSubItem.title)}`;
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

    // Remove all elements except those with class 'wiki-section-close'
    const elementsToKeep = sectionList.querySelectorAll(".wiki-section-close");
    sectionList.innerHTML = "";
    elementsToKeep.forEach((element) => sectionList.appendChild(element));
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
            textElement.classList.remove(ACTIVE_CLASS);
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
                    textElement.classList.add(ACTIVE_CLASS);
                }
            }
        }
    }
};

const getSiblingDropdowns = (currentDropdownBtn: HTMLElement): HTMLElement[] => {
    const currentTier = currentDropdownBtn.getAttribute("data-dropdown-tier");
    if (!currentTier) return [];

    // Find all dropdown buttons at the same tier level
    return Array.from(document.querySelectorAll(`[data-dropdown-tier="${currentTier}"]`)).filter(
        (btn): btn is HTMLElement => btn !== currentDropdownBtn && btn instanceof HTMLElement
    );
};

const closeDropdown = (dropdownBtn: HTMLElement): void => {
    const tier = dropdownBtn.getAttribute("data-dropdown-tier");
    const tierConfig = DROPDOWN_TIERS.find((t) => t.tier.toString() === tier);
    if (!tierConfig) return;

    const textElement = dropdownBtn.previousElementSibling as HTMLElement;
    if (!textElement) return;

    const dropdownParent = textElement.parentElement!.parentElement!;
    if (!dropdownParent) return;

    const childItems = getElements<HTMLElement>(tierConfig.childSelector, dropdownParent);

    dropdownBtn.setAttribute("data-avra-dropdown-expanded", "false");

    // Collapse animation
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
};

const setupDropdownForTier = (tierConfig: (typeof DROPDOWN_TIERS)[0], currentType: string | null, currentSlug: string | null) => {
    const textElements = getElements<HTMLElement>(tierConfig.textSelector);

    for (const textElement of textElements) {
        const dropdownBtn = textElement.nextElementSibling as HTMLElement;
        if (!dropdownBtn) continue;

        // Add tier attribute to dropdown button for unified sibling detection
        dropdownBtn.setAttribute("data-dropdown-tier", tierConfig.tier.toString());

        let dropdownParent = textElement.parentElement!.parentElement!;
        if (!dropdownParent) return;

        const childItems = getElements<HTMLElement>(tierConfig.childSelector, dropdownParent);

        // Clear existing active states
        for (const child of childItems) {
            const linkElement = child.querySelector("a");
            if (linkElement) {
                linkElement.classList.remove(ACTIVE_CLASS);
            }
        }

        // Set up dropdown if not configured
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
                        closeDropdown(dropdownBtn);
                    } else {
                        // Close all sibling dropdowns at the same tier level
                        const siblingDropdowns = getSiblingDropdowns(dropdownBtn);
                        siblingDropdowns.forEach((siblingBtn) => {
                            if (siblingBtn.getAttribute("data-avra-dropdown-expanded") === "true") {
                                closeDropdown(siblingBtn);
                            }
                        });

                        // Open this dropdown
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

        // Determine if this dropdown should be expanded based on current page
        const shouldBeExpanded = shouldDropdownBeExpanded(tierConfig.tier, textElement, childItems, currentType, currentSlug);

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

const shouldDropdownBeExpanded = (
    tier: number,
    textElement: HTMLElement,
    childItems: HTMLElement[],
    currentType: string | null,
    currentSlug: string | null
): boolean => {
    // On mobile (991px or smaller), all dropdowns should be closed by default
    if (isMobile()) {
        return false;
    }

    const isWikiTopic = currentType === "wiki" || currentType === "case-study";

    // Check if any child contains the current page
    const matchingChild = childItems.find((child) => {
        const links = child.querySelectorAll("a");
        return Array.from(links).some((link) => link.href === location.href);
    });

    if (matchingChild) {
        // Highlight the matching child
        const matchingChildTextElement = matchingChild.querySelector("a");
        if (matchingChildTextElement) {
            matchingChildTextElement.classList.add(ACTIVE_CLASS);
        }
        return true;
    }

    // Tier 1 specific logic (section titles)
    if (tier === 1) {
        const sectionText = textElement.textContent?.toLowerCase() || "";
        if (sectionText === "wiki topics" && (currentType === "wiki" || currentType === "case-study")) {
            return true;
        } else if (sectionText === "session insights" && currentType === "session") {
            return true;
        } else if (sectionText === "podcast episodes" && currentType === "podcast") {
            return true;
        } else if (sectionText === "wiki topics") {
            // Keep Wiki Topics open by default when not on a specific content page
            return currentType === null;
        }
    }

    // For other tiers, only expand if contains current page
    return false;
};

const setupSidebarDropdowns = (currentType: string | null, currentSlug: string | null) => {
    // Setup all dropdown tiers using the unified configuration
    DROPDOWN_TIERS.forEach((tierConfig) => {
        setupDropdownForTier(tierConfig, currentType, currentSlug);
    });
};

export const updateSidebarState = () => {
    const { currentSlug, currentType, currentUrl } = getCurrentPageInfo();
    console.log("PAGE INFO:", { currentSlug, currentType, currentUrl });
    console.log("updateSidebarState called - checking if should close sidebar");

    // updateSidebarHighlighting(currentSlug, currentType);
    setupSidebarDropdowns(currentType, currentSlug);

    // Close mobile sidebar after navigation (only if it's currently open)
    closeMobileSidebarIfOpen();
};

const isSidebarOpen = (): boolean => {
    console.log("Checking if sidebar is open...");

    if (!isMobile()) {
        console.log("Not mobile, sidebar not relevant");
        return false;
    }

    // Check the sidebar transform value (most reliable method)
    try {
        const sidebar = getAvraElement("wiki-sidebar");
        if (!sidebar) {
            console.log("Sidebar element not found");
            return false;
        }

        // Get the computed transform style
        const computedStyle = window.getComputedStyle(sidebar);
        const transform = computedStyle.transform;

        console.log("Sidebar transform:", transform);

        // Check if transform contains translateX(288px) or similar indicating open state
        if (transform && transform !== "none") {
            // Parse the transform matrix or translateX value
            const translateXMatch = transform.match(/translateX\(([^)]+)\)/);
            if (translateXMatch) {
                const translateX = parseFloat(translateXMatch[1]);
                console.log("Transform translateX value:", translateX);
                // Sidebar is open if translateX is 288px (or close to it)
                const isOpen = Math.abs(translateX - 288) < 10; // Allow small variance
                console.log("Sidebar is open (based on transform):", isOpen);
                return isOpen;
            }

            // Handle matrix transform format
            const matrixMatch = transform.match(/matrix\(([^)]+)\)/);
            if (matrixMatch) {
                const values = matrixMatch[1].split(",").map((v) => parseFloat(v.trim()));
                if (values.length >= 6) {
                    const translateX = values[4]; // translateX is the 5th value in matrix
                    console.log("Matrix translateX value:", translateX);
                    const isOpen = Math.abs(translateX - 288) < 10;
                    console.log("Sidebar is open (based on matrix):", isOpen);
                    return isOpen;
                }
            }
        }

        console.log("No transform detected, assuming sidebar is closed");
        return false;
    } catch (error) {
        console.log("Error checking sidebar transform:", error);
        return false;
    }
};

const closeMobileSidebar = () => {
    if (isMobile()) {
        const sidebarBtn = getAvraElement("sidebar-btn-close");
        if (sidebarBtn) {
            sidebarBtn.click();
        }
    }
};

const closeMobileSidebarIfOpen = () => {
    console.log("closeMobileSidebarIfOpen called");
    const isOpen = isSidebarOpen();
    console.log("Sidebar is open:", isOpen);

    if (isOpen) {
        console.log("Closing sidebar...");
        closeMobileSidebar();
    } else {
        console.log("Sidebar not open, no action needed");
    }
};

// toggle mobile sidebar on any link clicks
const setupMobileLinkHandler = () => {
    document.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
        const link = target.closest("a");
        if (link && link.href && isMobile()) {
            // delay to ensure navigation starts before closing sidebar
            setTimeout(closeMobileSidebarIfOpen, 50);
        }
    });
};

export const Sidebar = () => {
    if (!sidebarInitialized) {
        initializeSidebar();
        sidebarInitialized = true;
        setupMobileLinkHandler();
    }
    updateSidebarState();
};
