import { DROPDOWN_TIERS, podcastArticles, sessionInsightsBatches, wikiItems, alumniSessionCategories } from "@/data/sidebar";
import { ACTIVE_CLASS } from "@/utils/constants";
import { getAvraElement, getElements } from "@/utils/dom/elements";
import { isMobile } from "@/utils/mobile";
import { getCurrentPageInfo } from "@/utils/page-info";
import { gsap } from "gsap";
import { type ContentType } from "@/data/content";
import { CONTENT_TYPE_SLUG_MAPPINGS } from "@/constants";
import { getUserPlanRestrictions } from "@/utils/memberstack/user";
import { avraGetCookie } from "@/utils/avra-get-cookie";

let sidebarInitialized = false;
const developmentCookie = avraGetCookie("development");

const buildContentPageLink = (type: ContentType, slug: string) => {
    return `/${CONTENT_TYPE_SLUG_MAPPINGS[type]}/${slug}`;
};

const initializeSidebar = async () => {
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

    // Check if wiki-showing element exists to determine if Wiki Topics should be displayed
    const wikiShowingElement = document.querySelector("[avra-element='wiki-showing']");
    const shouldShowWikiTopics = wikiShowingElement !== null;

    // Check user plan restrictions
    const planRestrictions = await getUserPlanRestrictions();
    const shouldShowWikiTopicsForUser = shouldShowWikiTopics && !planRestrictions.hideWikiTopics;
    const shouldShowSessionInsights = !planRestrictions.hideSessionInsights;

    // Sidebar sections data
    const sidebarSections = [
        // TODO: filter for favorited items from user localstorage (see favorites page logic)
        // { title: "Favorited", items: },
        ...(shouldShowWikiTopicsForUser ? [{ title: "Wiki Topics", items: wikiElements }] : []),
        // { title: "Case Studies", items: caseStudyItems },
        ...(shouldShowSessionInsights ? [{ title: "Session Insights", items: sessionInsightElements }] : []),
        { title: "Alumni Sessions", items: [] },
        { title: "Podcast Episodes", items: podcastElements },
    ];
    const sectionsToAdd: HTMLElement[] = [];

    if (developmentCookie === "true") {
        sidebarSections.push({ title: "Partners", items: [] }, { title: "Deals", items: [] });
    }

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
                sectionItemText.href = buildContentPageLink("Wiki", wikiTag.slug);
                sectionItemText.setAttribute("data-swup-preload", "");

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
                        const baseUrl = new URL(sectionItemText.href, window.location.origin);
                        baseUrl.searchParams.set("highlight", subItem.title);
                        insightItemText.href = baseUrl.toString().replace(window.location.origin, "");
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
                                    const baseUrl = new URL(sectionItemText.href, window.location.origin);
                                    baseUrl.searchParams.set("highlight", subSubItem.title);
                                    insightHeadingItemText.href = baseUrl.toString().replace(window.location.origin, "");
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
                                                const baseUrl = new URL(sectionItemText.href, window.location.origin);
                                                baseUrl.searchParams.set("highlight", subSubSubItem.title);
                                                subInsightHeadingItemText.href = baseUrl.toString().replace(window.location.origin, "");
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
                sectionItemText.href = buildContentPageLink("Session Insights", batch.sessionInsights[0].slug);
                sectionItemsToAdd.push(sectionItem);

                const subItemTemplate = getAvraElement("wiki-insight-item", sectionItem);
                const subItemsToAdd: HTMLElement[] = [];

                for (const sessionInsightItem of batch.sessionInsights) {
                    const subItem = subItemTemplate.cloneNode(true) as HTMLAnchorElement;
                    const subItemText = getAvraElement<HTMLAnchorElement>("wiki-insight-item-text", subItem);
                    subItemText.textContent = sessionInsightItem.name;
                    subItemText.href = buildContentPageLink("Session Insights", sessionInsightItem.slug);

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
        } else if (title === "Alumni Sessions") {
            for (const categoryGroup of alumniSessionCategories) {
                // Skip empty categories
                if (categoryGroup.sessions.length === 0) continue;

                const sectionItem = sectionItemTemplate.cloneNode(true) as HTMLAnchorElement;
                const sectionItemText = getAvraElement<HTMLAnchorElement>("wiki-section-item-text", sectionItem);
                sectionItemText.textContent = categoryGroup.category;
                sectionItemText.href = buildContentPageLink("Session Insights", categoryGroup.sessions[0].slug);
                sectionItemsToAdd.push(sectionItem);

                const subItemTemplate = getAvraElement("wiki-insight-item", sectionItem);
                const subItemsToAdd: HTMLElement[] = [];

                for (const alumniSession of categoryGroup.sessions) {
                    const subItem = subItemTemplate.cloneNode(true) as HTMLAnchorElement;
                    const subItemText = getAvraElement<HTMLAnchorElement>("wiki-insight-item-text", subItem);
                    subItemText.textContent = alumniSession.name;
                    subItemText.href = buildContentPageLink("Session Insights", alumniSession.slug);

                    // Store slug as data attribute for later highlighting
                    subItem.setAttribute("data-alumni-slug", alumniSession.slug);

                    subItemsToAdd.push(subItem);

                    // Remove sub-sub items template
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
                sectionItemText.href = buildContentPageLink("Podcasts", podcastArticle.slug);

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
        } else if (title === "Partners" && developmentCookie === "true") {
            const sectionItem = sectionItemTemplate.cloneNode(true) as HTMLAnchorElement;
            const sectionItemText = getAvraElement<HTMLAnchorElement>("wiki-section-item-text", sectionItem);
            sectionItemText.textContent = "Overview";
            sectionItemText.href = "/partners";

            sectionItem.setAttribute("data-partners-slug", "partners");

            sectionItemsToAdd.push(sectionItem);

            while (sectionItem.children.length > 1) {
                sectionItem.removeChild(sectionItem.lastChild!);
            }
        } else if (title === "Deals" && developmentCookie === "true") {
            const sectionItem = sectionItemTemplate.cloneNode(true) as HTMLAnchorElement;
            const sectionItemText = getAvraElement<HTMLAnchorElement>("wiki-section-item-text", sectionItem);
            sectionItemText.textContent = "Deals from Partners";
            sectionItemText.href = "/deals";

            sectionItem.setAttribute("data-deals-slug", "deals");

            sectionItemsToAdd.push(sectionItem);

            while (sectionItem.children.length > 1) {
                sectionItem.removeChild(sectionItem.lastChild!);
            }
        } else {
            for (const item of items) {
                const itemTitle = item.getAttribute("data-avra-title") || "#";
                const sectionItem = sectionItemTemplate.cloneNode(true) as HTMLAnchorElement;
                const sectionItemText = getAvraElement<HTMLAnchorElement>("wiki-section-item-text", sectionItem);

                sectionItemText.textContent = itemTitle;
                sectionItemText.href = item.href;
                sectionItemsToAdd.push(sectionItem);

                const insightItemTemplate = getAvraElement("wiki-insight-item", sectionItem);
                insightItemTemplate.remove();
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

const getSiblingDropdowns = (currentDropdownBtn: HTMLElement): HTMLElement[] => {
    const currentTier = currentDropdownBtn.getAttribute("data-dropdown-tier");
    if (!currentTier) return [];

    // Find all dropdown buttons at the same tier level
    return Array.from(document.querySelectorAll(`[data-dropdown-tier="${currentTier}"]`)).filter(
        (btn): btn is HTMLElement => btn !== currentDropdownBtn && btn instanceof HTMLElement
    );
};

const getDescendantDropdowns = (currentDropdownBtn: HTMLElement): HTMLElement[] => {
    const currentTier = parseInt(currentDropdownBtn.getAttribute("data-dropdown-tier") || "0");
    if (!currentTier) return [];

    const textElement = currentDropdownBtn.previousElementSibling as HTMLElement;
    if (!textElement) return [];

    const dropdownParent = textElement.parentElement!.parentElement!;
    if (!dropdownParent) return [];

    const tierConfig = DROPDOWN_TIERS.find((t) => t.tier === currentTier);
    if (!tierConfig) return [];

    const childItems = getElements<HTMLElement>(tierConfig.childSelector, dropdownParent);
    const descendantDropdowns: HTMLElement[] = [];

    // Find all dropdown buttons in child items and their descendants recursively
    const findDropdownsInChildren = (items: HTMLElement[], tier: number) => {
        items.forEach((item) => {
            // Find dropdown buttons in this item
            const dropdownBtns = item.querySelectorAll(`[data-dropdown-tier="${tier + 1}"]`);
            dropdownBtns.forEach((btn) => {
                if (btn instanceof HTMLElement) {
                    descendantDropdowns.push(btn);

                    // Recursively find dropdowns in this item's children
                    const btnTierConfig = DROPDOWN_TIERS.find((t) => t.tier === tier + 1);
                    if (btnTierConfig) {
                        const btnTextElement = btn.previousElementSibling as HTMLElement;
                        if (btnTextElement) {
                            const btnDropdownParent = btnTextElement.parentElement!.parentElement!;
                            if (btnDropdownParent) {
                                const btnChildItems = getElements<HTMLElement>(btnTierConfig.childSelector, btnDropdownParent);
                                findDropdownsInChildren(btnChildItems, tier + 1);
                            }
                        }
                    }
                }
            });
        });
    };

    findDropdownsInChildren(childItems, currentTier);
    return descendantDropdowns;
};

const openDropdown = (dropdownBtn: HTMLElement, instant: boolean = false): void => {
    const tier = dropdownBtn.getAttribute("data-dropdown-tier");
    const tierConfig = DROPDOWN_TIERS.find((t) => t.tier.toString() === tier);
    if (!tierConfig) return;

    const textElement = dropdownBtn.previousElementSibling as HTMLElement;
    if (!textElement) return;

    const dropdownParent = textElement.parentElement!.parentElement!;
    if (!dropdownParent) return;

    const childItems = getElements<HTMLElement>(tierConfig.childSelector, dropdownParent);

    // Open this dropdown
    dropdownBtn.setAttribute("data-avra-dropdown-expanded", "true");

    // Expand - first show elements, then animate
    childItems.forEach((item) => {
        gsap.set(item, { display: "flex" });
    });

    if (instant) {
        gsap.set(childItems, {
            height: "auto",
            opacity: 1,
            marginTop: "8px",
        });
        gsap.to(dropdownBtn, {
            rotation: 180,
        });
    } else {
        gsap.to(childItems, {
            height: "auto",
            opacity: 1,
            marginTop: "8px",
            duration: 0.25,
            ease: "power2.out",
            stagger: 0.05,
        });
        gsap.to(dropdownBtn, {
            rotation: 180,
            duration: 0.25,
            ease: "power2.out",
        });
    }
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
    const textElements = getElements<HTMLAnchorElement>(tierConfig.textSelector);

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
                        openDropdown(dropdownBtn);
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
    textElement: HTMLAnchorElement,
    childItems: HTMLElement[],
    currentType: string | null,
    currentSlug: string | null
): boolean => {
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
        } else if (sectionText === "alumni sessions" && currentType === "session") {
            return true;
        } else if (sectionText === "podcast episodes" && currentType === "podcast") {
            return true;
        } else if (sectionText === "wiki topics") {
            // Keep Wiki Topics open by default when not on a specific content page
            // Only if wiki-showing element exists
            const wikiShowingElement = document.querySelector("[avra-element='wiki-showing']");
            return currentType === null && wikiShowingElement !== null;
        } else if (currentType === null) {
            // If Wiki Topics is not available (wiki-showing element doesn't exist),
            // open the first available section by default
            const wikiShowingElement = document.querySelector("[avra-element='wiki-showing']");
            if (wikiShowingElement === null) {
                // Open Session Insights as the first fallback
                if (sectionText === "session insights") {
                    return true;
                }
                // If Session Insights is not available, open Podcast Episodes
                if (sectionText === "podcast episodes") {
                    // Check if Session Insights section exists before opening Podcast Episodes
                    const sessionInsightsSection = document.querySelector("[data-title='Session Insights']");
                    return sessionInsightsSection === null;
                }
            }
        }
    }

    if (tier === 2 && currentSlug && location.href === textElement.href) {
        return true;
    }

    // For other tiers, only expand if contains current page
    return false;
};

const setupSidebarDropdowns = (currentType: string | null, currentSlug: string | null) => {
    DROPDOWN_TIERS.forEach((tierConfig) => {
        setupDropdownForTier(tierConfig, currentType, currentSlug);
    });
};

export const updateSidebarState = () => {
    const { currentSlug, currentType, currentUrl } = getCurrentPageInfo();
    console.log("[sidebar] PAGE INFO:", { currentSlug, currentType, currentUrl });

    setupSidebarDropdowns(currentType, currentSlug);
    closeMobileSidebarIfOpen();
};

const isSidebarOpen = (): boolean => {
    // not mobile, sidebar is always open
    if (!isMobile()) {
        return false;
    }

    // Check the sidebar transform value
    try {
        const sidebar = getAvraElement("wiki-sidebar");
        if (!sidebar) {
            console.log("Sidebar element not found");
            return false;
        }

        const computedStyle = window.getComputedStyle(sidebar);
        const transform = computedStyle.transform;

        // Check if transform contains translateX(288px) or similar indicating open state
        // Sidebar is open if translateX is 288px (or close to it)
        if (transform && transform !== "none") {
            // Parse the transform matrix or translateX value
            const translateXMatch = transform.match(/translateX\(([^)]+)\)/);
            if (translateXMatch) {
                const translateX = parseFloat(translateXMatch[1]);
                console.log("Transform translateX value:", translateX);

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

const closeMobileSidebarIfOpen = () => {
    if (!isMobile() || !isSidebarOpen()) {
        return;
    }

    const sidebarCloseBtn = getAvraElement("sidebar-btn-close");
    if (!sidebarCloseBtn) {
        return;
    }

    sidebarCloseBtn.click();
};

// close mobile sidebar after clicking on a link
const setupMobileLinkHandler = () => {
    document.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
        const link = target.closest("a");
        if (!link || !link.href) {
            return;
        }

        closeMobileSidebarIfOpen();
    });
};

export const sidebar = async () => {
    if (!sidebarInitialized) {
        sidebarInitialized = true;
        await initializeSidebar();
        setupMobileLinkHandler();
    }
    updateSidebarState();
};
