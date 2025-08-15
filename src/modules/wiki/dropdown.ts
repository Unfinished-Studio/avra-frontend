import { STAGGER_DELAY } from "@/utils/constants";

export const expandDropdownsToRevealLink = (title: string) => {
    // Determine section to expand based on title text content
    let sectionToExpand = "";

    if (title === "Wiki Topics") {
        sectionToExpand = "Wiki Topics";
    } else if (title === "Session Insights") {
        sectionToExpand = "Session Insights";
    } else if (title === "Case Studies") {
        sectionToExpand = "Wiki Topics"; // Case studies are under wiki topics
    } else if (title === "Podcast Episodes") {
        sectionToExpand = "Podcast Episodes";
    } else {
        // For specific items, find which section they belong to by searching the DOM
        const wikiTopicElements = document.querySelectorAll<HTMLElement>("[avra-element='wiki-section-item-text']");
        for (const element of wikiTopicElements) {
            if (element.textContent === title) {
                sectionToExpand = "Wiki Topics";
                break;
            }
        }

        // Check session insights if not found in wiki topics
        if (!sectionToExpand) {
            const sessionElements = document.querySelectorAll<HTMLElement>("[avra-element='wiki-insight-item-text']");
            for (const element of sessionElements) {
                if (element.textContent === title) {
                    sectionToExpand = "Session Insights";
                    break;
                }
            }
        }

        // Check podcast episodes if not found elsewhere
        if (!sectionToExpand) {
            const podcastElements = document.querySelectorAll<HTMLElement>("[avra-element='wiki-section-item-text']");
            for (const element of podcastElements) {
                if (element.textContent === title && element.closest('[data-title="Podcast Episodes"]')) {
                    sectionToExpand = "Podcast Episodes";
                    break;
                }
            }
        }
    }

    if (sectionToExpand) {
        // Find the section title element
        const sectionTitleElement = document.querySelector<HTMLElement>(
            `[data-title="${sectionToExpand}"] [avra-element="wiki-section-title-text"]`
        );
        if (sectionTitleElement) {
            // Find the dropdown button next to it
            const dropdownBtn = sectionTitleElement.nextElementSibling as HTMLElement;
            if (dropdownBtn && dropdownBtn.getAttribute("data-avra-dropdown-expanded") !== "true") {
                dropdownBtn.click();
            }

            // If this is a specific item within a section, also expand that item's dropdown
            setTimeout(() => {
                // Find the specific item by title text content
                const allItemElements = document.querySelectorAll<HTMLElement>(
                    "[avra-element='wiki-section-item-text'], [avra-element='wiki-insight-item-text']"
                );
                for (const [index, element] of allItemElements.entries()) {
                    if (element.textContent === title) {
                        const itemDropdownBtn = element.nextElementSibling as HTMLElement;
                        if (itemDropdownBtn && itemDropdownBtn.getAttribute("data-avra-dropdown-expanded") !== "true") {
                            setTimeout(() => {
                                itemDropdownBtn.click();
                            }, index * STAGGER_DELAY);
                        }
                        break;
                    }
                }
            }, STAGGER_DELAY);
        }
    }
};
