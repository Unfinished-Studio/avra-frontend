/**
 * Initialize deal modals by numbering fs-modal-element attributes
 * so each deal item gets its own modal instance
 */
export const initializeDealModals = (): void => {
    // Check if we're on the deals page
    if (!window.location.pathname.includes("/deals")) {
        return;
    }

    const dealItems = document.querySelectorAll<HTMLElement>("[avra-element='deal-item']");
    if (dealItems.length === 0) {
        console.log("[deal-modals] No deal items found");
        return;
    }

    console.log(`[deal-modals] Found ${dealItems.length} deal items, numbering modal attributes`);

    dealItems.forEach((dealItem, index) => {
        const modalIndex = index + 1;

        // Find and relabel modal elements within this deal item
        const modalElement = dealItem.querySelector("[fs-modal-element='modal']");
        const openTriggers = dealItem.querySelectorAll("[fs-modal-element='open']");
        const closeTriggers = dealItem.querySelectorAll("[fs-modal-element='close']");

        if (modalElement) {
            modalElement.setAttribute("fs-modal-element", `modal-${modalIndex}`);
        }

        openTriggers.forEach((trigger) => {
            trigger.setAttribute("fs-modal-element", `open-${modalIndex}`);
        });

        closeTriggers.forEach((trigger) => {
            trigger.setAttribute("fs-modal-element", `close-${modalIndex}`);
        });

        console.log(
            `[deal-modals] Deal ${modalIndex}: modal=${!!modalElement}, open=${openTriggers.length}, close=${closeTriggers.length}`
        );
    });

    // Reinitialize Finsweet modal attributes
    reinitFinsweetModals();
};

/**
 * Reinitialize Finsweet modal attributes after DOM changes
 */
const reinitFinsweetModals = (): void => {
    try {
        const fsAttributes = (window as any).fsAttributes;
        if (!fsAttributes) {
            console.warn("[deal-modals] fsAttributes not found on window");
            return;
        }

        // Destroy existing modal instances if destroy function exists
        if (fsAttributes.modal?.destroy) {
            fsAttributes.modal.destroy();
            console.log("[deal-modals] Destroyed existing modal instances");
        }

        // Reinitialize modals
        if (fsAttributes.modal?.init) {
            fsAttributes.modal.init({});
            console.log("[deal-modals] Reinitialized Finsweet modals");
        } else {
            console.warn("[deal-modals] fsAttributes.modal.init not available");
        }
    } catch (error) {
        console.error("[deal-modals] Error reinitializing Finsweet modals:", error);
    }
};
