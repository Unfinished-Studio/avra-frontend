/**
 * Filter partners list based on URL query parameters
 * Supports ?category=X and ?highlight=X parameters
 * Expects a flexbox container with div children that have data-category attributes
 */
export const initializePartnersFilter = (): void => {
    const pathname = window.location.pathname;

    // Only run on partners or deals page
    if (!pathname.includes("/partners") && !pathname.includes("/deals")) {
        return;
    }

    // Find all partner items with data-category attribute
    const partnerItems = document.querySelectorAll<HTMLElement>("[data-category]");
    if (partnerItems.length === 0) {
        console.log("[partners-filter] No elements with data-category found");
        return;
    }

    console.log(`[partners-filter] Found ${partnerItems.length} partner items`);

    // Start with all items faded out
    partnerItems.forEach((item) => {
        item.style.opacity = "0";
        item.style.transition = "opacity 0.3s ease-in-out";
    });

    // Apply filtering (only on partners page with category param)
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFilter = urlParams.get("category");
    const highlightPartner = urlParams.get("highlight");

    if (categoryFilter && pathname.includes("/partners")) {
        console.log(`[partners-filter] Filtering by category: ${categoryFilter}`);

        partnerItems.forEach((item) => {
            const itemCategory = item.getAttribute("data-category");
            if (itemCategory === categoryFilter.toLowerCase()) {
                item.classList.remove("hide");
                item.style.display = "";
            } else {
                item.style.display = "none";
            }
        });
    } else {
        // No category filter - show all items
        console.log("[partners-filter] No category filter, showing all items");
        partnerItems.forEach((item) => {
            item.classList.remove("hide");
            item.style.display = "";
        });
    }

    // Add border-bottom to the last visible item's header
    addLastItemBorder(partnerItems);

    // Fade in visible items after a short delay
    requestAnimationFrame(() => {
        setTimeout(() => {
            partnerItems.forEach((item) => {
                if (item.style.display !== "none") {
                    item.style.opacity = "1";
                }
            });
        }, 50);
    });

    if (highlightPartner) {
        console.log(`[partners-filter] Highlighting partner: ${highlightPartner}`);
        highlightPartnerItem(highlightPartner);
    }
};

/**
 * Add border-bottom to the last visible partner item's accordion header
 */
const addLastItemBorder = (partnerItems: NodeListOf<HTMLElement>): void => {
    // Find the last visible item using Array.from to avoid closure typing issues
    const itemsArray = Array.from(partnerItems);
    const lastVisibleItem = itemsArray.filter((item) => item.style.display !== "none").pop();

    if (lastVisibleItem) {
        lastVisibleItem.style.borderBottom = "1px solid #c8c8c8";
        lastVisibleItem.style.paddingBottom = "20px";
    }
};

/**
 * Highlight a specific partner item
 */
const highlightPartnerItem = (partnerSlug: string): void => {
    const targetItem = document.querySelector<HTMLElement>(`[data-partner="${partnerSlug}"]`);

    if (!targetItem) {
        console.log(`[partners-filter] Partner not found: ${partnerSlug}`);
        return;
    }

    // Make sure the item is visible
    targetItem.style.display = "";

    // Add highlight styling
    targetItem.style.backgroundColor = "#fff3cd";
    targetItem.style.transition = "background-color 0.5s ease-in-out";

    // Scroll to the item
    setTimeout(() => {
        targetItem.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);

    // Fade out highlight after a few seconds
    setTimeout(() => {
        targetItem.style.backgroundColor = "";
    }, 3000);
};
