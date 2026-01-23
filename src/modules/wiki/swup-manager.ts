import { updateBreadcrumbs } from "@/modules/wiki/breadcrumb";
import { initializePersistentContentElements } from "@/modules/wiki/mobile-search";
import { refreshScrollToc } from "@/modules/wiki/scroll-toc";
import { initContentPage } from "@/pages/page-initializer";
import { updateSidebar } from "@/pages/wiki";
import SwupPreloadPlugin from "@swup/preload-plugin";
import Swup from "swup";
import { updateSidebarState } from "./sidebar";
import { initPageNavigation } from "@/modules/wiki/page-navigation";
import { initializeClickableHeadings } from "@/modules/wiki/clickable-headings";

export const swupLinkSelector =
    'a[href*="/avra-wiki/"], a[href*="/session-insights/"], a[href*="/case-studies/"], a[href*="/audio-video/"], a[href*="/deals"], a[href*="/partners"]';

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
    public navigate(url: string, preserveParams: boolean = false): void {
        if (this.swup) {
            let finalUrl = url;

            if (preserveParams) {
                // Preserve existing URL parameters from current location
                const currentUrl = new URL(window.location.href);
                const params = currentUrl.searchParams;
                const hash = currentUrl.hash;

                // Create URL object for the target URL
                const targetUrl = new URL(url, window.location.origin);

                // Copy existing parameters that don't already exist in target URL
                params.forEach((value, key) => {
                    if (!targetUrl.searchParams.has(key)) {
                        targetUrl.searchParams.set(key, value);
                    }
                });

                // Add hash if target URL doesn't have one and current URL does
                if (!targetUrl.hash && hash) {
                    targetUrl.hash = hash;
                }

                finalUrl = targetUrl.toString().replace(window.location.origin, "");
            }

            this.swup.navigate(finalUrl);
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
        const wikiContent = document.querySelector<HTMLElement>("[avra-element='wiki-container']");
        if (wikiContent) {
            wikiContent.scrollTop = 0;
        }
    }

    private scrollToHighlightedText(highlightedText: string): void {
        console.warn("[SWUP-SCROLL] Starting scroll to highlighted text:", highlightedText);

        const wikiContainer = document.querySelector<HTMLElement>("[avra-element='wiki-container']");
        const wikiContent = document.querySelector<HTMLElement>("[avra-element='wiki-content']");

        if (!wikiContent) {
            console.warn("[SWUP-SCROLL] Wiki content element not found");
            return;
        }

        // Close sidebar if open
        const closeBtn = document.querySelector<HTMLElement>(".wiki-section-close");
        if (closeBtn) {
            closeBtn.click();
            console.warn("[SWUP-SCROLL] Closed sidebar");
        }

        // Find the target heading
        const targetHeading = this.findTargetHeading(wikiContent, highlightedText);
        if (!targetHeading) {
            console.warn("[SWUP-SCROLL] No matching heading found for:", highlightedText);
            return;
        }

        console.warn("[SWUP-SCROLL] Found target heading:", targetHeading.textContent?.trim());

        // Start scroll and verification process
        this.scrollToHeadingWithRetry(targetHeading, wikiContainer, highlightedText);
    }

    private findTargetHeading(container: HTMLElement, highlightedText: string): HTMLElement | null {
        const headings = container.querySelectorAll("h1, h2, h3, h4, h5, h6");
        console.warn("[SWUP-SCROLL] Searching through", headings.length, "headings");

        // Normalize text to handle special characters
        const normalizeText = (text: string): string => {
            return text
                .toLowerCase()
                .replace(/['''''''‛‚´`\u2019]/g, "'")
                .replace(/[""„‟]/g, '"')
                .replace(/[–—]/g, "-")
                .replace(/\u200D/g, "")
                .replace(/\s+/g, " ")
                .trim();
        };

        const searchText = normalizeText(highlightedText);
        console.warn("[SWUP-SCROLL] Normalized search text:", searchText);

        for (const heading of headings) {
            const headingText = normalizeText(heading.textContent || "");
            if (headingText.includes(searchText)) {
                console.warn("[SWUP-SCROLL] Match found:", headingText);
                return heading as HTMLElement;
            }
        }

        return null;
    }

    private scrollToHeadingWithRetry(
        heading: HTMLElement,
        wikiContainer: HTMLElement | null,
        highlightedText: string,
        attempt: number = 1,
        maxAttempts: number = 50
    ): void {
        console.warn(`[SWUP-SCROLL] Scroll attempt ${attempt}/${maxAttempts}`);

        // Perform the scroll
        this.performScroll(heading, wikiContainer);

        // Wait for scroll to complete, then verify position
        setTimeout(() => {
            const isCorrectlyPositioned = this.verifyHeadingPosition(heading, wikiContainer);

            if (isCorrectlyPositioned) {
                console.warn("[SWUP-SCROLL] ✅ Scroll successful on attempt", attempt);
                this.highlightHeadingText(heading, highlightedText);
            } else if (attempt < maxAttempts) {
                // Ultra-fast progressive retry delays: 10ms, 25ms, then 50ms for subsequent retries
                let retryDelay: number;
                if (attempt === 1) {
                    retryDelay = 10;
                } else if (attempt === 2) {
                    retryDelay = 25;
                } else {
                    retryDelay = 50;
                }
                console.warn(`[SWUP-SCROLL] ❌ Scroll attempt ${attempt} failed, retrying in ${retryDelay}ms...`);
                setTimeout(() => {
                    this.scrollToHeadingWithRetry(heading, wikiContainer, highlightedText, attempt + 1, maxAttempts);
                }, retryDelay);
            } else {
                console.warn(`[SWUP-SCROLL] ❌ Scroll failed after ${maxAttempts} attempts, highlighting anyway`);
                this.highlightHeadingText(heading, highlightedText);
            }
        }, 100); // Wait for smooth scroll to complete
    }

    private performScroll(heading: HTMLElement, wikiContainer: HTMLElement | null): void {
        const headingRect = heading.getBoundingClientRect();
        const desiredOffset = 64; // Pixels from top

        if (wikiContainer && wikiContainer.scrollHeight > wikiContainer.clientHeight) {
            // Scroll within wiki container
            const containerRect = wikiContainer.getBoundingClientRect();
            const currentScrollTop = wikiContainer.scrollTop;
            const headingOffsetInContainer = headingRect.top - containerRect.top;
            const targetScrollTop = currentScrollTop + headingOffsetInContainer - desiredOffset;

            console.warn("[SWUP-SCROLL] Scrolling wiki-container:", {
                containerScrollHeight: wikiContainer.scrollHeight,
                containerClientHeight: wikiContainer.clientHeight,
                currentScrollTop,
                headingOffsetInContainer,
                targetScrollTop,
                headingRect: {
                    top: headingRect.top,
                    bottom: headingRect.bottom,
                },
                containerRect: {
                    top: containerRect.top,
                    bottom: containerRect.bottom,
                },
            });

            wikiContainer.scrollTo({
                top: targetScrollTop,
                behavior: "smooth",
            });
        } else {
            // Scroll window
            const targetScrollTop = window.pageYOffset + headingRect.top - desiredOffset;

            console.warn("[SWUP-SCROLL] Scrolling window:", {
                currentPageYOffset: window.pageYOffset,
                headingTop: headingRect.top,
                targetScrollTop,
                headingRect,
            });

            window.scrollTo({
                top: targetScrollTop,
                behavior: "smooth",
            });
        }
    }

    private verifyHeadingPosition(heading: HTMLElement, wikiContainer: HTMLElement | null): boolean {
        const headingRect = heading.getBoundingClientRect();
        const targetTopPosition = 200; // Within top 200 pixels as requested

        let actualPosition: number;
        let referencePoint: string;

        if (wikiContainer && wikiContainer.scrollHeight > wikiContainer.clientHeight) {
            // Check position relative to container
            const containerRect = wikiContainer.getBoundingClientRect();
            actualPosition = headingRect.top - containerRect.top;
            referencePoint = "container";
        } else {
            // Check position relative to viewport
            actualPosition = headingRect.top;
            referencePoint = "viewport";
        }

        const isCorrect = actualPosition >= 0 && actualPosition <= targetTopPosition;

        console.warn("[SWUP-SCROLL] Position verification:", {
            referencePoint,
            actualPosition: Math.round(actualPosition),
            targetRange: `0-${targetTopPosition}px`,
            isCorrect,
            headingRect: {
                top: Math.round(headingRect.top),
                bottom: Math.round(headingRect.bottom),
                height: Math.round(headingRect.height),
            },
        });

        return isCorrect;
    }

    private highlightHeadingText(heading: HTMLElement, highlightedText: string): void {
        console.warn("[SWUP-SCROLL] Applying text highlighting");

        const originalHTML = heading.innerHTML;
        const escapedText = highlightedText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        try {
            // Create highlighted version
            const highlightedHTML = this.createHighlightedHTML(originalHTML, escapedText);
            heading.innerHTML = highlightedHTML;

            const marks = heading.querySelectorAll<HTMLElement>(".highlight-fade");
            console.warn("[SWUP-SCROLL] Created", marks.length, "highlight marks");

            // Fade in highlight
            setTimeout(() => {
                marks.forEach((mark) => {
                    mark.style.backgroundColor = "#d6d5d1";
                });
                console.warn("[SWUP-SCROLL] Highlight fade-in applied");
            }, 100);

            // Fade out and remove highlight
            setTimeout(() => {
                marks.forEach((mark) => {
                    mark.style.backgroundColor = "transparent";
                });
                console.warn("[SWUP-SCROLL] Highlight fade-out started");

                setTimeout(() => {
                    heading.innerHTML = originalHTML;
                    console.warn("[SWUP-SCROLL] Highlight removed, original HTML restored");
                }, 500);
            }, 2500);
        } catch (error) {
            console.warn("[SWUP-SCROLL] Highlighting failed:", error);
        }
    }

    private createHighlightedHTML(originalHTML: string, escapedText: string): string {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = originalHTML;

        const highlightInNode = (node: Node): void => {
            if (node.nodeType === Node.TEXT_NODE) {
                const textContent = node.textContent || "";
                const regex = new RegExp(`(${escapedText})`, "gi");
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
                Array.from(node.childNodes).forEach((child) => highlightInNode(child));
            }
        };

        highlightInNode(tempDiv);
        return tempDiv.innerHTML;
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
                backBtn.href = "/avra-wiki";
                backBtn.textContent = "Return to Wiki";
            }

            // Re-initialize persistent content elements after content replacement
            setTimeout(() => initializePersistentContentElements(), 100);

            console.log("scrolling to highlighted text or top of page");

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
            // Initialize page navigation
            setTimeout(() => {
                initPageNavigation();
                initializeClickableHeadings();
            }, 100);
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
