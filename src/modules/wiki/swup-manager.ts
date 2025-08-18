import { updateBreadcrumbs } from "@/modules/wiki/breadcrumb";
import { initializePersistentContentElements } from "@/modules/wiki/mobile-search";
import { updateSidebar } from "@/pages/wiki";
import { initContentPage } from "@/pages/page-initializer";
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
            cache: false,
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
            cache: false,
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
        const wikiContainer = document.querySelector<HTMLElement>("[avra-element='wiki-content']");
        if (wikiContainer) {
            wikiContainer.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
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
                ".wiki-dropdown-wrapper, .sub-nav.smaller, .sub-nav.tall, .confidential, .back-button"
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

            // Scroll to top of wiki container after content loads
            setTimeout(() => this.scrollToTopOfWikiContainer(), 150);
        });

        // Visit end hook
        this.swup.hooks.on("visit:end", () => {
            updateSidebarState();
            initContentPage();
            updateSidebar();
            updateBreadcrumbs();
            // Re-initialize persistent content elements after navigation
            initializePersistentContentElements();
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
