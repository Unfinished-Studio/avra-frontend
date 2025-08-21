import { ACTIVE_CLASS } from "@/utils/constants";
import { getAvraElement, getElements } from "@/utils/dom/elements";

/**
 * Scroll-based Table of Contents functionality
 * Highlights sidebar heading links based on current scroll position
 */

let headingElements: HTMLHeadingElement[] = [];
let sidebarLinks: HTMLAnchorElement[] = [];
let currentActiveLink: HTMLAnchorElement | null = null;
let currentActiveParents: HTMLElement[] = [];
let updateTimeout: number | null = null;
let isScrollListenerActive = false;
let lastScrollTime = 0;
let fastScrollThreshold = 100; // ms - if scroll events come faster than this, it's considered fast scrolling

/**
 * Normalizes text for comparison between headings and sidebar links
 */
const normalizeText = (text: string): string => {
    return text
        .toLowerCase()
        .replace(/['''''''‛‚´`\u2019]/g, "'") // Normalize all apostrophe variations
        .replace(/[""„‟]/g, '"') // Normalize smart quotes
        .replace(/[–—]/g, "-") // Normalize em/en dashes
        .replace(/\u200D/g, "") // Remove Zero Width Joiner characters
        .replace(/\s+/g, " ") // Normalize whitespace
        .trim();
};

/**
 * Extracts heading text from URL highlight parameter
 */
const extractHeadingFromUrl = (url: string): string | null => {
    try {
        const urlObj = new URL(url);
        return urlObj.searchParams.get("highlight");
    } catch {
        return null;
    }
};

/**
 * Finds the sidebar link that corresponds to a given heading element
 * Only searches within the current page's sidebar links for better performance
 */
const findCorrespondingSidebarLink = (heading: HTMLHeadingElement): HTMLAnchorElement | null => {
    const headingText = normalizeText(heading.textContent || "");

    // Since sidebarLinks is already filtered to current page, this search is more efficient
    for (const link of sidebarLinks) {
        const highlightText = extractHeadingFromUrl(link.href);
        if (highlightText && normalizeText(highlightText) === headingText) {
            return link;
        }
    }

    return null;
};

/**
 * Gets the parent elements of a sidebar link that should be highlighted
 * This includes section containers and nested heading containers
 */
const getParentElements = (link: HTMLAnchorElement): HTMLElement[] => {
    const parents: HTMLElement[] = [];
    let currentElement = link.parentElement;

    // Define the hierarchy levels we want to traverse upward
    const hierarchyLevels = [
        "wiki-insight-heading-item-2", // Level 4 (deepest)
        "wiki-insight-heading-item", // Level 3
        "wiki-insight-item", // Level 2
        "wiki-section-item", // Level 1 (top level)
    ];

    while (currentElement) {
        const avraElement = currentElement.getAttribute("avra-element");

        // Check if this element is one of our hierarchy levels
        if (avraElement && hierarchyLevels.includes(avraElement)) {
            // Find the text link within this container
            let containerLink: HTMLAnchorElement | null = null;

            // Look for the appropriate text element based on the container type
            if (avraElement === "wiki-section-item") {
                containerLink = currentElement.querySelector<HTMLAnchorElement>('[avra-element="wiki-section-item-text"]');
            } else if (avraElement === "wiki-insight-item") {
                containerLink = currentElement.querySelector<HTMLAnchorElement>('[avra-element="wiki-insight-item-text"]');
            } else if (avraElement === "wiki-insight-heading-item") {
                containerLink = currentElement.querySelector<HTMLAnchorElement>('[avra-element="wiki-insight-heading-item-text"]');
            } else if (avraElement === "wiki-insight-heading-item-2") {
                containerLink = currentElement.querySelector<HTMLAnchorElement>('[avra-element="wiki-insight-heading-item-text-2"]');
            }

            // Add to parents if it's different from the current link
            if (containerLink && containerLink !== link) {
                parents.push(containerLink);
            }
        }

        currentElement = currentElement.parentElement;
    }

    return parents;
};

/**
 * Updates the active state of sidebar links and their parent elements
 */
const updateActiveLink = (newActiveLink: HTMLAnchorElement | null): void => {
    const newActiveParents = newActiveLink ? getParentElements(newActiveLink) : [];

    // Remove active class from current active link and parents that won't be active anymore
    if (currentActiveLink) {
        currentActiveLink.classList.remove(ACTIVE_CLASS);
        // console.log(`[ScrollTOC] Removed active class from: "${currentActiveLink.textContent}"`);
    }

    // Remove active class from old parents that aren't in the new parent chain
    for (const oldParent of currentActiveParents) {
        if (!newActiveParents.includes(oldParent)) {
            oldParent.classList.remove(ACTIVE_CLASS);
            // console.log(`[ScrollTOC] Removed active class from old parent: "${oldParent.textContent}"`);
        }
    }

    // Set new active link and parents
    currentActiveLink = newActiveLink;
    currentActiveParents = newActiveParents;

    // Add active class to new active link and its parents
    if (currentActiveLink) {
        currentActiveLink.classList.add(ACTIVE_CLASS);
        // console.log(`[ScrollTOC] Added active class to: "${currentActiveLink.textContent}"`);
    }

    for (const parent of currentActiveParents) {
        parent.classList.add(ACTIVE_CLASS);
        // console.log(`[ScrollTOC] Added active class to parent: "${parent.textContent}"`);
    }
};

/**
 * Handles scroll events with adaptive throttling
 */
const handleScroll = (): void => {
    const currentTime = Date.now();
    const timeSinceLastScroll = currentTime - lastScrollTime;
    lastScrollTime = currentTime;

    // Clear any pending update
    if (updateTimeout) {
        clearTimeout(updateTimeout);
    }

    // For fast scrolling, use immediate update to avoid missing headings
    if (timeSinceLastScroll < fastScrollThreshold) {
        // console.log("Fast scrolling detected - immediate update");
        updateActiveHeading();
        return;
    }

    // Normal throttling for regular scrolling
    updateTimeout = window.setTimeout(() => {
        updateActiveHeading();
    }, 16); // ~60fps for smoother updates
};

/**
 * Determines which heading should be active based on scroll position
 * A heading stays active until the next heading is reached
 */
const determineActiveHeading = (): HTMLHeadingElement | null => {
    if (headingElements.length === 0) return null;

    const wikiContainer = getAvraElement("wiki-container");
    const containerScrollTop = wikiContainer.scrollTop;
    const containerRect = wikiContainer.getBoundingClientRect();
    const offset = 200; // Offset from top of container to trigger heading change

    // console.log("containerScrollTop", containerScrollTop);

    // Find the heading that should be active
    let activeHeading: HTMLHeadingElement | null = null;

    // Go through headings in order and find the last one that's been scrolled past
    for (const heading of headingElements) {
        const headingRect = heading.getBoundingClientRect();
        // Calculate heading position relative to the scrollable container
        const headingTopRelativeToContainer = headingRect.top - containerRect.top + containerScrollTop;

        // console.log(
        //     `Heading "${heading.textContent}" - position: ${headingTopRelativeToContainer}, trigger point: ${containerScrollTop + offset}`
        // );

        // If this heading is at or above our trigger point, it could be the active one
        if (headingTopRelativeToContainer <= containerScrollTop + offset) {
            activeHeading = heading;
            // console.log(`Setting active: "${heading.textContent}"`);
        } else {
            // This heading is below our trigger point, so the previous one should stay active
            // console.log(`Breaking at: "${heading.textContent}"`);
            break;
        }
    }

    return activeHeading;
};

/**
 * Updates the active heading based on current scroll position
 */
const updateActiveHeading = (): void => {
    const activeHeading = determineActiveHeading();

    if (activeHeading) {
        const correspondingLink = findCorrespondingSidebarLink(activeHeading);
        if (correspondingLink && correspondingLink !== currentActiveLink) {
            // console.log(`[ScrollTOC] Activating heading: "${activeHeading.textContent}"`);
            const parents = getParentElements(correspondingLink);
            // console.log(
            //     `[ScrollTOC] Found ${parents.length} parent elements:`,
            //     parents.map((p) => p.textContent)
            // );
            updateActiveLink(correspondingLink);
        }
    } else if (currentActiveLink) {
        // Clear active state if no heading should be active (at top of page)
        // console.log(`[ScrollTOC] Clearing active state - at top of page`);
        updateActiveLink(null);
    }
};

/**
 * Initializes the scroll-based table of contents
 */
export const initScrollToc = (): void => {
    // Clean up existing scroll listener
    cleanupScrollToc();

    // Find all heading elements in the main content
    const contentContainer = document.querySelector("#main-content, [avra-element='wiki-content']");
    if (!contentContainer) {
        console.warn("Could not find content container for scroll TOC");
        return;
    }

    headingElements = Array.from(contentContainer.querySelectorAll<HTMLHeadingElement>("h1, h2, h3, h4, h5, h6"));
    if (headingElements.length === 0) {
        console.warn("No heading elements found for scroll TOC");
        return;
    }

    // Find all sidebar links that have highlight parameters AND match the current page
    const currentPagePath = window.location.pathname;
    const allSidebarLinks = getElements<HTMLAnchorElement>("a[href*='highlight=']");

    // Filter to only include links that belong to the current page
    sidebarLinks = allSidebarLinks.filter((link) => {
        try {
            const linkUrl = new URL(link.href);
            return linkUrl.pathname === currentPagePath;
        } catch {
            return false;
        }
    });

    console.log(`Found ${allSidebarLinks.length} total sidebar links, ${sidebarLinks.length} for current page (${currentPagePath})`);

    // Debug: Show which links are being considered for this page
    if (sidebarLinks.length > 0) {
        console.log(
            "Current page sidebar links:",
            sidebarLinks.map((link) => ({
                text: link.textContent?.trim(),
                highlight: extractHeadingFromUrl(link.href),
            }))
        );
    }

    if (sidebarLinks.length === 0) {
        console.warn("No sidebar links with highlight parameters found for current page");
        return;
    }

    console.log(`Initialized scroll TOC with ${headingElements.length} headings and ${sidebarLinks.length} sidebar links`);

    // Add scroll event listener
    const wikiContent = getAvraElement("wiki-container");
    wikiContent.addEventListener("scroll", handleScroll, { passive: true });
    isScrollListenerActive = true;

    // Initial update to set the correct active heading
    updateActiveHeading();
};

/**
 * Cleans up the scroll-based table of contents
 */
export const cleanupScrollToc = (): void => {
    // Remove scroll event listener
    if (isScrollListenerActive) {
        const wikiContent = getAvraElement("wiki-container");
        if (wikiContent) {
            wikiContent.removeEventListener("scroll", handleScroll);
        }
        isScrollListenerActive = false;
    }

    // Clear any pending timeout
    if (updateTimeout) {
        clearTimeout(updateTimeout);
        updateTimeout = null;
    }

    updateActiveLink(null);
    headingElements = [];
    sidebarLinks = [];
    currentActiveParents = [];
};

/**
 * Re-initializes the scroll TOC (useful after content changes)
 */
export const refreshScrollToc = (): void => {
    cleanupScrollToc();
    // Add a small delay to ensure DOM is updated
    setTimeout(() => initScrollToc(), 100);
};
