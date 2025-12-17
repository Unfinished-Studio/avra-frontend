import { getUserPlanRestrictions } from "@/utils/memberstack/user";

(async () => {
    // Hide directory opt wrapper for users with restricted access
    const planRestrictions = await getUserPlanRestrictions();
    if (planRestrictions.hideWikiTopics || planRestrictions.hideSessionInsights) {
        const directoryOptWrapper = document.querySelector("[avra-element='directory-opt-wrapper']") as HTMLElement;
        if (directoryOptWrapper) {
            directoryOptWrapper.style.display = "none";
        }
    }

    const lastPage = localStorage.getItem("avra_last_page");
    if (lastPage) {
        // remove item, then redirect user
        localStorage.removeItem("avra_last_page");
        window.location.href = lastPage;
    }
})();
