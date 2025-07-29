import { Sidebar } from "@/components/sidebar";
import Swup from "swup";
import { initContentPage } from "@/pages/page-initializer";
import { getElement, getElements } from "@/utils/dom/elements";

const swup = new Swup({
    containers: ["[avra-element='wiki-content']"],
    linkSelector: 'a[href*="avra-wiki"], a[href*="session-insights"], a[href*="case-studies"], a[href*="audio-video"]',
    cache: false,
});

const updateSidebar = () => {
    const sessionInsightsSection = getElement("[data-title='Session Insights']");
    const sessionLinks = getElements("[avra-element='wiki-session-links'] a");

    if (sessionInsightsSection) {
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
    Sidebar();
    initContentPage();
    updateSidebar();

    swup.hooks.on("visit:end", (visit) => {
        Sidebar();
        initContentPage();
        updateSidebar();
    });
});
