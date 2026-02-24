import { navigateSwup } from "@/modules/wiki/swup-manager";

/**
 * Filter partners list based on URL query parameters
 * Supports ?category=X and ?highlight=X parameters
 */
export const initializePartnersFilter = (): void => {
    if (window.location.pathname !== "/partners") {
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const categoryFilter = urlParams.get("category");
    // const highlightPartner = urlParams.get("highlight");

    if (!categoryFilter) {
        navigateSwup("/partners-deals-overview");
        return;
    }

    console.log(`[partners-filter] Filtering by category: ${categoryFilter}`);

    const headingEl = document.querySelector<HTMLElement>("[avra-element='partners-title']");
    if (headingEl) {
        headingEl.style.opacity = "0";
        headingEl.style.transition = "opacity 0.3s ease-in-out";
        headingEl.classList.remove("hide");
    }

    // const subheadingEls = document.querySelectorAll<HTMLElement>("[avra-element='partners-subheading']");
    // for (const subheadingEl of subheadingEls) {
    //     subheadingEl.style.opacity = "0";
    //     subheadingEl.style.transition = "opacity 0.3s ease-in-out";
    //     subheadingEl.classList.remove("hide");
    // }

    const subheadingEls: HTMLElement[] = [];

    // Find all partner items with data-category attribute
    const partnerItems = document.querySelectorAll<HTMLElement>("[data-category]");
    if (partnerItems.length === 0) {
        console.log("[partners-filter] No elements with data-category found");
        return;
    }

    console.log(`[partners-filter] Found ${partnerItems.length} partner items`);

    // Start with all items faded out
    for (const item of partnerItems) {
        item.style.opacity = "0";
        item.style.transition = "opacity 0.3s ease-in-out";

        const itemCategory = item.getAttribute("data-category");
        const itemSubCategory = item.getAttribute("data-subheading-category");

        if (itemCategory === categoryFilter.toLowerCase()) {
            if (itemSubCategory) {
                // find subheading
                // if it doesnt exist, create
                // move item into subheading parent
                const subheadingEl = subheadingEls.find((el) => el.textContent.toLowerCase() === itemSubCategory.toLowerCase());
                if (subheadingEl) {
                    console.log(`subheading ${itemSubCategory} exists! moving item into`, subheadingEl);
                    subheadingEl.parentElement?.appendChild(item);
                } else {
                    const newSubheadingEl = document.createElement("h3");
                    newSubheadingEl.classList.add("partners-subheading");
                    newSubheadingEl.style.opacity = "0";
                    newSubheadingEl.style.transition = "opacity 0.3s ease-in-out";
                    newSubheadingEl.textContent = itemSubCategory;
                    subheadingEls.push(newSubheadingEl);

                    const parent = document.createElement("div");
                    parent.classList.add("partners-subheading-wrapper");

                    parent.append(newSubheadingEl, item);

                    const ogList = document.querySelector(".accordion-wrapper.is-parent-wrapper");
                    if (ogList && ogList.parentElement) {
                        ogList.parentElement.insertBefore(parent, ogList);
                    }

                    console.log(parent, newSubheadingEl, item);
                }
            }

            item.classList.remove("hide");
            item.style.display = "";
        } else {
            item.style.display = "none";
        }
    }

    // Sort subheading wrappers A–Z by their heading text
    if (subheadingEls.length > 0) {
        const ogList = document.querySelector(".accordion-wrapper.is-parent-wrapper");
        if (ogList && ogList.parentElement) {
            const wrappers = subheadingEls
                .map((el) => el.parentElement)
                .filter((parent): parent is HTMLElement => parent instanceof HTMLElement);

            wrappers
                .sort((a, b) => {
                    const aText = (a.querySelector(".partners-subheading")?.textContent || "").toLowerCase();
                    const bText = (b.querySelector(".partners-subheading")?.textContent || "").toLowerCase();
                    return aText.localeCompare(bText);
                })
                .forEach((wrapper) => {
                    ogList.parentElement!.insertBefore(wrapper, ogList);
                });
        }
    }

    updatePartnersTitle(categoryFilter);

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
            if (headingEl) {
                headingEl.style.opacity = "1";
            }
            subheadingEls.forEach((item) => {
                if (item.style.display !== "none") {
                    item.style.opacity = "1";
                }
            });
        }, 50);
    });

    // if (highlightPartner) {
    //     console.log(`[partners-filter] Highlighting partner: ${highlightPartner}`);
    //     highlightPartnerItem(highlightPartner);
    // }
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
