import { getCurrentPageInfo } from "@/utils/page-info";
import { CONTENT_TYPE_SLUG_MAPPINGS } from "@/constants";

/**
 * Maps PageType to ContentType for URL building
 */
const getContentTypeFromPageType = (pageType: string): keyof typeof CONTENT_TYPE_SLUG_MAPPINGS | null => {
    switch (pageType) {
        case "wiki":
            return "Wiki";
        case "session":
            return "Session Insights";
        case "podcast":
            return "Podcasts";
        case "case-study":
            return "Case Studies";
        default:
            return null;
    }
};

/**
 * Builds a URL with highlight parameter for a specific heading
 */
const buildHeadingURL = (headingText: string): string => {
    const { currentType, currentSlug } = getCurrentPageInfo();

    if (!currentType || !currentSlug) {
        return window.location.href;
    }

    // Convert PageType to ContentType
    const contentType = getContentTypeFromPageType(currentType);
    if (!contentType) {
        return window.location.href;
    }

    // Build the base URL using the same logic as sidebar links
    let baseUrl = `/${CONTENT_TYPE_SLUG_MAPPINGS[contentType]}/${currentSlug}`;

    // Preserve existing URL parameters
    const currentUrl = new URL(window.location.href);
    const params = currentUrl.searchParams;

    // Create new URL with highlight parameter
    const url = new URL(baseUrl, window.location.origin);

    // Copy existing parameters (excluding page and highlight)
    params.forEach((value, key) => {
        if (key !== "highlight" && key !== "page") {
            // Don't copy highlight or page parameters
            url.searchParams.set(key, value);
        }
    });

    // Add the highlight parameter
    url.searchParams.set("highlight", headingText);

    return url.toString();
};

/**
 * Copies text to clipboard using the modern Clipboard API with fallback
 */
const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            // Fallback for older browsers or non-HTTPS contexts
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            textArea.style.top = "-999999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            const success = document.execCommand("copy");
            document.body.removeChild(textArea);
            return success;
        }
    } catch (err) {
        console.error("Failed to copy text to clipboard:", err);
        return false;
    }
};

/**
 * Shows a temporary notification that the link was copied
 */
const showCopyNotification = (heading: HTMLElement) => {
    // Create notification element
    const notification = document.createElement("div");
    notification.textContent = "Link copied to clipboard!";
    notification.style.cssText = `
        position: absolute;
        background: #e9e7e1;
        color: #14151a;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 12px;
        z-index: 1000;
        white-space: nowrap;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s ease;
        font-weight: 500;
    `;

    // Position relative to heading
    const rect = heading.getBoundingClientRect();
    notification.style.left = `${rect.left}px`;
    notification.style.top = `${rect.bottom + 8}px`;

    document.body.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
        notification.style.opacity = "1";
    });

    // Function to remove notification
    const removeNotification = () => {
        if (notification.parentNode) {
            notification.style.opacity = "0";
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 200);
        }
    };

    // Remove on scroll (both window and container)
    const scrollHandler = () => {
        removeNotification();
        window.removeEventListener("scroll", scrollHandler);
        // Also remove container scroll listener if it exists
        const wikiContainer = document.querySelector("[avra-element='wiki-container']");
        if (wikiContainer) {
            wikiContainer.removeEventListener("scroll", scrollHandler);
        }
    };

    // Listen for window scroll
    window.addEventListener("scroll", scrollHandler);

    // Listen for container scroll
    const wikiContainer = document.querySelector("[avra-element='wiki-container']");
    if (wikiContainer) {
        wikiContainer.addEventListener("scroll", scrollHandler);
    }

    // Remove after delay
    setTimeout(() => {
        removeNotification();
        window.removeEventListener("scroll", scrollHandler);
        if (wikiContainer) {
            wikiContainer.removeEventListener("scroll", scrollHandler);
        }
    }, 1000);
};

/**
 * Adds click handler to a heading element
 */
const addHeadingClickHandler = (heading: HTMLElement) => {
    // Skip if already processed
    if (heading.hasAttribute("data-clickable-heading")) {
        return;
    }

    heading.setAttribute("data-clickable-heading", "true");

    // Add CSS class for styling
    heading.classList.add("clickable-heading");

    // Add click handler
    heading.addEventListener("click", async (e) => {
        e.preventDefault();

        const headingText = heading.textContent?.trim();
        if (!headingText) {
            return;
        }

        const url = buildHeadingURL(headingText);
        const success = await copyToClipboard(url);

        if (success) {
            showCopyNotification(heading);
            console.log("Copied heading URL to clipboard:", url);
        } else {
            console.error("Failed to copy heading URL to clipboard");
        }
    });

    // Add link icon on hover
    const linkIcon = document.createElement("span");
    linkIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="gray" height="12px" viewBox="0 0 576 512"><path d="M0 256C0 167.6 71.6 96 160 96h72c13.3 0 24 10.7 24 24s-10.7 24-24 24H160C98.1 144 48 194.1 48 256s50.1 112 112 112h72c13.3 0 24 10.7 24 24s-10.7 24-24 24H160C71.6 416 0 344.4 0 256zm576 0c0 88.4-71.6 160-160 160H344c-13.3 0-24-10.7-24-24s10.7-24 24-24h72c61.9 0 112-50.1 112-112s-50.1-112-112-112H344c-13.3 0-24-10.7-24-24s10.7-24 24-24h72c88.4 0 160 71.6 160 160zM184 232H392c13.3 0 24 10.7 24 24s-10.7 24-24 24H184c-13.3 0-24-10.7-24-24s10.7-24 24-24z"></path></svg>`;
    linkIcon.className = "heading-link-icon";
    linkIcon.style.cssText = `
        margin-left: 8px;
        opacity: 0;
        transition: opacity 0.2s ease;
        cursor: pointer;
        font-size: 0.8em;
        user-select: none;
    `;

    heading.appendChild(linkIcon);

    // Show/hide icon on hover
    heading.addEventListener("mouseenter", () => {
        linkIcon.style.opacity = "1";
    });

    heading.addEventListener("mouseleave", () => {
        linkIcon.style.opacity = "0";
    });

    // Make the icon clickable too
    linkIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        heading.click();
    });
};

/**
 * Initializes clickable headings for all heading elements in the wiki content
 */
export const initializeClickableHeadings = () => {
    const wikiContainer = document.querySelector("[avra-element='wiki-content']");
    if (!wikiContainer) {
        console.warn("Wiki content container not found, skipping clickable headings initialization");
        return;
    }

    // Find all heading elements
    const headings = wikiContainer.querySelectorAll("h1, h2, h3, h4, h5, h6");

    console.log(`[clickable-headings] Initializing ${headings.length} heading elements`);

    headings.forEach((heading) => {
        if (heading instanceof HTMLElement) {
            addHeadingClickHandler(heading);
        }
    });

    // Add global CSS for clickable headings
    if (!document.getElementById("clickable-headings-styles")) {
        const style = document.createElement("style");
        style.id = "clickable-headings-styles";
        style.textContent = `
            .clickable-heading {
                cursor: pointer;
                position: relative;
                transition: color 0.2s ease;
            }
            
            .clickable-heading:hover {
                color: #0066cc;
            }
            
            .clickable-heading .heading-link-icon {
                display: inline-block;
                vertical-align: middle;
            }
            
            @media (max-width: 768px) {
                .clickable-heading .heading-link-icon {
                    opacity: 0.6 !important; /* Always show on mobile */
                }
            }
        `;
        document.head.appendChild(style);
    }
};

/**
 * Cleanup function to remove clickable heading functionality
 */
export const cleanupClickableHeadings = () => {
    const headings = document.querySelectorAll("[data-clickable-heading]");
    headings.forEach((heading) => {
        heading.removeAttribute("data-clickable-heading");
        heading.classList.remove("clickable-heading");

        // Remove link icon
        const linkIcon = heading.querySelector(".heading-link-icon");
        if (linkIcon) {
            linkIcon.remove();
        }
    });
};
