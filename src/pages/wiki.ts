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

export const updateSidebar = () => {
    const sessionInsightsSection = getElement("[data-title='Session Insights']");
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

window.Webflow ||= [];
window.Webflow.push(async () => {
    sidebar();
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

    // Take mobile users to default page after Swup is initialized
    if (isMobile()) {
        swupManager.navigate("/avra-wiki/hiring-and-managing-execs");
    }
});
