import { wikiItems } from "@/data/sidebar";
import { STAGGER_DELAY } from "@/utils/constants";
import { avraQuery } from "@/utils/dom/elements";
import { isMobile } from "@/utils/mobile";
import { getCurrentPageInfo } from "@/utils/page-info";
import { expandDropdownsToRevealLink } from "./dropdown";

const handleBreadcrumbClick = (event: Event, title: string) => {
    // Open sidebar and nested dropdowns on mobile
    if (isMobile()) {
        event.preventDefault();

        const sidebarBtn = avraQuery<HTMLElement>("sidebar-btn-open");
        if (sidebarBtn) {
            sidebarBtn.click();
        }

        setTimeout(() => {
            expandDropdownsToRevealLink(title);
        }, STAGGER_DELAY);
    }
};

export const updateBreadcrumbs = () => {
    const pageInfo = getCurrentPageInfo();
    const breadcrumb1 = avraQuery<HTMLElement>("breadcrumb-1");
    const breadcrumbArrow = avraQuery<HTMLElement>("breadcrumb-arrow");
    const breadcrumb2 = avraQuery<HTMLElement>("breadcrumb-2");

    if (!breadcrumb1 || !breadcrumb2 || !breadcrumbArrow) {
        console.warn("Breadcrumb elements not found");
        return;
    }

    // Hide breadcrumb2 and arrow by default
    breadcrumb2.style.display = "none";
    breadcrumbArrow.style.display = "none";

    if (pageInfo.currentType === "wiki" && pageInfo.currentSlug) {
        // Find the current wiki item and its parent
        let currentWikiItem = null;
        let parentWikiTitle = null;
        let currentSubItem = null;

        // Search through wiki items to find the current page
        for (const wikiItem of wikiItems) {
            if (wikiItem.slug === pageInfo.currentSlug) {
                currentWikiItem = wikiItem;
                break;
            }

            // Check if it's a sub-item
            const findInSubItems = (subItems: any[], parentTitle: string): any => {
                for (const subItem of subItems) {
                    if (subItem.type === "item" && subItem.title.includes(pageInfo.currentSlug)) {
                        return { subItem, parentTitle };
                    }
                    if (subItem.subItems) {
                        const found = findInSubItems(subItem.subItems, parentTitle);
                        if (found) return found;
                    }
                }
                return null;
            };

            const found = findInSubItems(wikiItem.subItems, wikiItem.title);
            if (found) {
                currentSubItem = found.subItem;
                parentWikiTitle = found.parentTitle;
                break;
            }
        }

        if (currentWikiItem) {
            // This is a main wiki page
            breadcrumb1.textContent = "Wiki Topics";
            breadcrumb2.textContent = currentWikiItem.title;
            breadcrumb2.style.display = "block";
            breadcrumbArrow.style.display = "block";
        } else if (currentSubItem && parentWikiTitle) {
            // This is a sub-item page
            const parentWikiItem = wikiItems.find((item) => item.title === parentWikiTitle);
            if (parentWikiItem) {
                breadcrumb1.textContent = parentWikiTitle;
                breadcrumb2.textContent = currentSubItem.displayTitle;
                breadcrumb2.style.display = "block";
                breadcrumbArrow.style.display = "block";
            }
        } else {
            // Fallback

            breadcrumb1.textContent = "Wiki Topics";
        }
    } else if (pageInfo.currentType === "session") {
        // For session insights - get the actual session title
        const dataEl = avraQuery<HTMLElement>("item-data");
        const pageTitle = dataEl?.getAttribute("data-avra-title") || "Session Insight";
        breadcrumb1.textContent = "Session Insights";
        breadcrumb2.textContent = pageTitle;
        breadcrumb2.style.display = "block";
        breadcrumbArrow.style.display = "block";
    } else if (pageInfo.currentType === "case-study") {
        // For case studies - get the actual page title
        const dataEl = avraQuery<HTMLElement>("item-data");
        const pageTitle = dataEl?.getAttribute("data-avra-title") || "Case Study";
        breadcrumb1.textContent = "Case Studies";
        breadcrumb2.textContent = pageTitle;
        breadcrumb2.style.display = "block";
        breadcrumbArrow.style.display = "block";
    } else if (pageInfo.currentType === "podcast") {
        // For podcast episodes - get the actual page title
        const dataEl = document.querySelector<HTMLElement>("[avra-element='item-data']");
        const pageTitle = dataEl?.getAttribute("data-avra-title") || "Podcast Episode";
        breadcrumb1.textContent = "Podcast Episodes";
        breadcrumb2.textContent = pageTitle;
        breadcrumb2.style.display = "block";
        breadcrumbArrow.style.display = "block";
    } else {
        // Default fallback
        breadcrumb1.textContent = "Wiki Topics";
    }

    // Add click handlers to both breadcrumbs for mobile (only if not already set)
    if (!breadcrumb1.hasAttribute("data-breadcrumb-listener-set")) {
        breadcrumb1.addEventListener("click", (e) => {
            const title = breadcrumb1.textContent || "";
            handleBreadcrumbClick(e, title);
            console.log("breadcrumb1 clicked");
        });
        breadcrumb1.setAttribute("data-breadcrumb-listener-set", "true");
    }

    if (!breadcrumb2.hasAttribute("data-breadcrumb-listener-set")) {
        breadcrumb2.addEventListener("click", (e) => {
            const title = breadcrumb2.textContent || "";
            handleBreadcrumbClick(e, title);
            console.log("breadcrumb2 clicked");
        });
        breadcrumb2.setAttribute("data-breadcrumb-listener-set", "true");
    }
};
