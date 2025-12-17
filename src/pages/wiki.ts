import { updateBreadcrumbs } from "@/modules/wiki/breadcrumb";
import { initializePersistentContentElements, setupMobileSearchPopup } from "@/modules/wiki/mobile-search";
import { initializeNavPersistentContentElements, setupNavSearchDropdown } from "@/modules/wiki/nav-search";
import { initScrollToc, refreshScrollToc } from "@/modules/wiki/scroll-toc";
import { smartSearch } from "@/modules/wiki/search";
import { sidebar } from "@/modules/wiki/sidebar";
import { initSwup, swupManager } from "@/modules/wiki/swup-manager";
import { initContentPage } from "@/pages/page-initializer";
import { getElement, getElements } from "@/utils/dom/elements";
import { isMobile } from "@/utils/mobile";
import { initPageNavigation } from "@/modules/wiki/page-navigation";
import { getUserPlanRestrictions } from "@/utils/memberstack/user";

export const updateSidebar = () => {
    // Use querySelector to safely check if Session Insights section exists (may be hidden for some users)
    const sessionInsightsSection = document.querySelector("[data-title='Session Insights']");
    const sessionLinks = getElements("[avra-element='wiki-session-links'] a");

    console.log("[wiki] updating sidebar with session links");

    if (sessionInsightsSection && sessionLinks.length) {
        // Clear existing session links
        const existingLinks = sessionInsightsSection.querySelectorAll("a");
        existingLinks.forEach((link) => link.remove());

        // Add new session links
        sessionLinks.forEach((link) => {
            sessionInsightsSection.appendChild(link);
        });
    }
};

/**
 * Removes the page parameter from the current URL without triggering navigation
 */
const removePageParameter = () => {
    const url = new URL(window.location.href);
    if (url.searchParams.has("page")) {
        url.searchParams.delete("page");
        window.history.replaceState({}, "", url.toString());
        console.log("[wiki] Removed page parameter from URL");
    }
};

window.Webflow ||= [];
window.Webflow.push(async () => {
    await sidebar();
    smartSearch();

    // Initialize mobile and nav search (both use persistent content elements)
    initializePersistentContentElements();
    initializeNavPersistentContentElements();
    setupMobileSearchPopup();
    setupNavSearchDropdown();

    initContentPage();
    updateSidebar();
    updateBreadcrumbs();

    initScrollToc();
    initSwup();

    // Initialize page navigation on initial load
    setTimeout(() => {
        initPageNavigation();
    }, 200);

    const page = new URLSearchParams(window.location.search).get("page");
    removePageParameter();

    // Check if user should skip to first article
    const planRestrictions = await getUserPlanRestrictions();
    const shouldSkipToFirstArticle = isMobile() || planRestrictions.hideSessionInsights;

    if (page) {
        // Navigate to specified content page
        swupManager.navigate(page, true);
    } else if (shouldSkipToFirstArticle) {
        // Take mobile users and founders to default page (if no page parameter is present)
        swupManager.navigate("/avra-wiki/hiring-and-managing-execs", true);
    }
});
