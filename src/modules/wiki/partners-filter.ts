/**
 * Filter partners list based on URL query parameters
 * Supports ?category=X and ?highlight=X parameters
 */
export const initializePartnersFilter = (): void => {
    const pathname = window.location.pathname;

    // Only run on partners page
    if (!pathname.includes("/partners")) {
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const categoryFilter = urlParams.get("category");
    const highlightPartner = urlParams.get("highlight");

    // Get the title element
    const titleElement = document.querySelector<HTMLElement>("[avra-element='partners-title']");
    if (titleElement) {
        titleElement.style.opacity = "0";
        titleElement.style.transition = "opacity 0.3s ease-in-out";
        titleElement.classList.remove("hide");
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

    if (categoryFilter) {
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

        updatePartnersTitle(categoryFilter);
    } else {
        // No category filter - show all items
        console.log("[partners-filter] No category filter, showing all items");
        partnerItems.forEach((item) => {
            item.classList.remove("hide");
            item.style.display = "";
        });

        updatePartnersTitle(null);
    }

    // Add border-bottom to the last visible item's header
    addLastItemBorder(partnerItems);

    // Fade in visible items and title after a short delay
    requestAnimationFrame(() => {
        setTimeout(() => {
            partnerItems.forEach((item) => {
                if (item.style.display !== "none") {
                    item.style.opacity = "1";
                }
            });
            if (titleElement) {
                titleElement.style.opacity = "1";
            }
        }, 50);
    });

    if (highlightPartner) {
        console.log(`[partners-filter] Highlighting partner: ${highlightPartner}`);
        highlightPartnerItem(highlightPartner);
    }
};

/**
 * Update the partners page title based on category
 */
const updatePartnersTitle = (category: string | null): void => {
    const titleElement = document.querySelector<HTMLElement>("[avra-element='partners-title']");
    if (!titleElement) {
        console.log("[partners-filter] No partners-title element found");
        return;
    }

    if (category) {
        const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
        titleElement.textContent = capitalizedCategory;
    } else {
        titleElement.textContent = "Partners";
    }
};

/**
 * Add border-bottom to the last visible partner item's accordion header
 */
const addLastItemBorder = (partnerItems: NodeListOf<HTMLElement>): void => {
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

    targetItem.style.display = "";
    targetItem.style.backgroundColor = "#fff3cd";
    targetItem.style.transition = "background-color 0.5s ease-in-out";

    setTimeout(() => {
        targetItem.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);

    setTimeout(() => {
        targetItem.style.backgroundColor = "";
    }, 3000);
};
