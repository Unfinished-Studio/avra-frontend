import { updateBreadcrumbs } from "@/modules/wiki/breadcrumb";
import { initializePersistentContentElements } from "@/modules/wiki/mobile-search";
import { refreshScrollToc } from "@/modules/wiki/scroll-toc";
import { initContentPage } from "@/pages/page-initializer";
import { updateSidebar } from "@/pages/wiki";
import SwupPreloadPlugin from "@swup/preload-plugin";
import Swup from "swup";
import { updateSidebarState } from "./sidebar";

export const swupLinkSelector =
    'a[href*="/avra-wiki/"], a[href*="/session-insights/"], a[href*="/case-studies/"], a[href*="/audio-video/"]';

/**
 * Swup Manager - Centralized access to the Swup instance
 * Allows multiple modules to access and modify the same Swup instance
 */
class SwupManager {
    private static instance: SwupManager;
    private swup: Swup | null = null;

    private constructor() {}

    public static getInstance(): SwupManager {
        if (!SwupManager.instance) {
            SwupManager.instance = new SwupManager();
        }
        return SwupManager.instance;
    }

    /**
     * Initialize Swup with default configuration
     */
    public init(): Swup {
        if (this.swup) {
            this.swup.destroy();
        }

        this.swup = new Swup({
            animationSelector: '[class*="transition-"]',
            containers: ["[avra-element='wiki-content']"],
            linkSelector: swupLinkSelector,
            // cache: false,
            plugins: [new SwupPreloadPlugin()],
        });

        this.registerDefaultHooks();
        return this.swup;
    }

    /**
     * Get the current Swup instance
     */
    public getSwup(): Swup | null {
        return this.swup;
    }

    /**
     * Update Swup with a new link selector
     */
    public updateLinks(newLinkSelector: string): Swup {
        if (this.swup) {
            this.swup.destroy();
        }

        this.swup = new Swup({
            animationSelector: '[class*="transition-"]',
            containers: ["[avra-element='wiki-content']"],
            linkSelector: newLinkSelector,
            // cache: false,
            plugins: [new SwupPreloadPlugin()],
        });

        this.registerDefaultHooks();
        return this.swup;
    }

    /**
     * Navigate to a URL using Swup
     */
    public navigate(url: string): void {
        if (this.swup) {
            this.swup.navigate(url);
        }
    }

    /**
     * Destroy the Swup instance
     */
    public destroy(): void {
        if (this.swup) {
            this.swup.destroy();
            this.swup = null;
        }
    }

    /**
     * Scroll to top of wiki container
     */
    private scrollToTopOfWikiContainer(): void {
        const wikiContainer = document.querySelector<HTMLElement>("[avra-element='wiki-container']");
        if (wikiContainer) {
            wikiContainer.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }

    private scrollToHighlightedText(highlightedText: string): void {
        const wikiContainer = document.querySelector<HTMLElement>("[avra-element='wiki-content']");
        if (wikiContainer) {
            const closeBtn = document.querySelector<HTMLElement>(".wiki-section-close");
            if (closeBtn) {
                closeBtn.click();
            }

            // Function to find and scroll to matching text in headings only
            const scrollToHighlightedText = () => {
                const content = document.querySelector("#wiki-content");
                if (!content) return;

                // Only search within heading elements (h1, h2, h3, h4, h5, h6)
                const headings = wikiContainer.querySelectorAll("h1, h2, h3, h4, h5, h6");

                // Normalize text to handle special characters like apostrophes
                const normalizeText = (text: string): string => {
                    return text
                        .toLowerCase()
                        .replace(/['''''''‛‚´`\u2019]/g, "'") // Normalize all apostrophe variations to straight apostrophe
                        .replace(/[""„‟]/g, '"') // Normalize smart quotes to straight quotes
                        .replace(/[–—]/g, "-") // Normalize em/en dashes to hyphen
                        .replace(/\u200D/g, "") // Remove Zero Width Joiner characters
                        .replace(/\s+/g, " ") // Normalize whitespace
                        .trim();
                };

                const searchText = normalizeText(highlightedText);

                for (const heading of headings) {
                    const headingText = normalizeText(heading.textContent || "");

                    if (headingText.includes(searchText)) {
                        heading.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                            inline: "nearest",
                        });

                        // Highlight the text temporarily
                        const originalHTML = heading.innerHTML;

                        // Create a more robust regex that doesn't interfere with HTML tags
                        const escapedHighlightText = highlightedText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

                        // Function to highlight text while preserving HTML structure
                        const highlightTextInHTML = (html: string, searchText: string): string => {
                            // Create a temporary element to parse the HTML
                            const tempDiv = document.createElement("div");
                            tempDiv.innerHTML = html;

                            // Function to recursively highlight text in text nodes
                            const highlightInNode = (node: Node): void => {
                                if (node.nodeType === Node.TEXT_NODE) {
                                    const textContent = node.textContent || "";
                                    const regex = new RegExp(`(${escapedHighlightText})`, "gi");
                                    if (regex.test(textContent)) {
                                        const newHTML = textContent.replace(
                                            regex,
                                            '<mark class="highlight-fade" style="background-color: transparent; transition: background-color 0.5s ease-in-out; padding: 2px;">$1</mark>'
                                        );
                                        const wrapper = document.createElement("span");
                                        wrapper.innerHTML = newHTML;
                                        node.parentNode?.replaceChild(wrapper, node);
                                    }
                                } else if (node.nodeType === Node.ELEMENT_NODE) {
                                    // Recursively process child nodes
                                    Array.from(node.childNodes).forEach((child) => highlightInNode(child));
                                }
                            };

                            highlightInNode(tempDiv);
                            return tempDiv.innerHTML;
                        };

                        const newHTML = highlightTextInHTML(originalHTML, highlightedText);
                        heading.innerHTML = newHTML;

                        const marks = heading.querySelectorAll<HTMLElement>(".highlight-fade");

                        // Fade in
                        setTimeout(() => {
                            marks.forEach((mark) => {
                                mark.style.backgroundColor = "#d6d5d1";
                            });
                        }, 100);

                        // Fade out and remove
                        setTimeout(() => {
                            marks.forEach((mark) => {
                                mark.style.backgroundColor = "transparent";
                            });

                            // Remove the mark after fade out transition ends
                            setTimeout(() => {
                                heading.innerHTML = originalHTML;
                            }, 500); // This should match the transition duration
                        }, 2500);

                        break;
                    }
                }
            };

            scrollToHighlightedText();
        }
    }

    /**
     * Register default hooks that should always be present
     */
    private registerDefaultHooks(): void {
        if (!this.swup) return;

        // Content replacement hook
        this.swup.hooks.on("content:replace", () => {
            console.log("new content available");

            // Remove/change elements pulled in from wiki page
            const elementsToRemove = document.querySelectorAll<HTMLElement>(
                ".wiki-dropdown-wrapper, .sub-nav.smaller, .sub-nav.tall, .confidential, .back-button, #transcripts, #benchmarks, #all-comments"
            );
            for (const element of elementsToRemove) {
                element.remove();
            }

            const backBtn = document.querySelector<HTMLAnchorElement>(".back-button");
            if (backBtn) {
                backBtn.href = "/avra-wiki-new";
                backBtn.textContent = "Return to Wiki";
            }

            // Re-initialize persistent content elements after content replacement
            setTimeout(() => initializePersistentContentElements(), 100);

            // Scroll to highlighted text or top of page
            const urlParams = new URLSearchParams(window.location.search);
            const highlightText = urlParams.get("highlight");
            if (highlightText) {
                setTimeout(() => {
                    this.scrollToHighlightedText(highlightText);
                }, 300);
            } else {
                setTimeout(() => this.scrollToTopOfWikiContainer(), 150);
            }
        });

        // Visit end hook
        this.swup.hooks.on("visit:end", () => {
            updateSidebarState();
            initContentPage();
            updateSidebar();
            updateBreadcrumbs();
            // Re-initialize persistent content elements after navigation
            initializePersistentContentElements();
            // Refresh scroll-based table of contents after content change
            refreshScrollToc();
        });

        this.swup.hooks.on("page:preload", (_visit, { page }) => {
            console.log("[swup-manager] PRELOADED PAGE:", page);
        });
    }

    /**
     * Add a custom hook to the Swup instance
     */
    public addHook<T extends keyof any>(event: T, callback: (...args: any[]) => void): void {
        if (this.swup) {
            (this.swup.hooks as any).on(event, callback);
        }
    }

    /**
     * Remove a custom hook from the Swup instance
     */
    public removeHook<T extends keyof any>(event: T, callback: (...args: any[]) => void): void {
        if (this.swup) {
            (this.swup.hooks as any).off(event, callback);
        }
    }
}

// Export singleton instance
export const swupManager = SwupManager.getInstance();

// Convenience functions for common operations
export const getSwup = () => swupManager.getSwup();
export const initSwup = () => swupManager.init();
export const updateSwupLinks = (newLinkSelector: string) => swupManager.updateLinks(newLinkSelector);
export const navigateSwup = (url: string) => swupManager.navigate(url);

/**
 * EXAMPLE USAGE
 * Example file showing how to use the Swup Manager from any module
 * This demonstrates the solution to accessing and modifying Swup across multiple files
 */
// import { swupManager, getSwup, navigateSwup, updateSwupLinks } from "./swup-manager";

// // Example 1: Navigate to a page from any module
// export const navigateToPage = (url: string) => {
//     navigateSwup(url);
// };

// // Example 2: Check if Swup is available
// export const isSwupReady = () => {
//     return getSwup() !== null;
// };

// // Example 3: Add custom hooks from any module
// export const addCustomBehavior = () => {
//     swupManager.addHook("visit:start", () => {
//         console.log("Custom: Navigation started");
//     });

//     swupManager.addHook("visit:end", () => {
//         console.log("Custom: Navigation completed");
//     });
// };

// // Example 4: Update link selectors from any module
// export const updateSearchLinks = () => {
//     const newSelector = 'a[href*="/search/"], a[href*="/results/"]';
//     updateSwupLinks(newSelector);
// };

// // Example 5: Access the Swup instance directly for advanced operations
// export const advancedSwupOperation = () => {
//     const swup = getSwup();
//     if (swup) {
//         // Direct access to Swup API
//         console.log("Current page:", swup.getCurrentUrl());

//         // Add temporary hooks
//         const tempCallback = () => console.log("Temporary hook");
//         swupManager.addHook("content:replace", tempCallback);

//         // Remove hooks later
//         setTimeout(() => {
//             swupManager.removeHook("content:replace", tempCallback);
//         }, 5000);
//     }
// };
