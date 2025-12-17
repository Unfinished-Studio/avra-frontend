export type UserCustomFields = {
    bio: string;
    batch: string;
    title: string;
    "cms-id": string;
    industry: string;
    "last-name": string;
    logintime: string;
    "first-name": string;
    "city-country": string;
    "company-name": string;
    "phone-number": string;
    "super-powers": string;
    "business-model": string;
    "company-website": string;
};

export async function getUser() {
    const memberstack = window.$memberstackDom;
    const user = await memberstack.getCurrentMember();

    if (!user || !user.data) {
        console.log("[getUser] No logged in user.");
        return null;
    }

    return {
        ...user.data,
        customFields: user.data.customFields as UserCustomFields,
    };
}

export type PlanRestrictions = {
    hideWikiTopics: boolean;
    hideSessionInsights: boolean;
};

export async function getUserPlanRestrictions(): Promise<PlanRestrictions> {
    const memberstack = window.$memberstackDom;
    const user = await memberstack.getCurrentMember();

    if (!user || !user.data) {
        return { hideWikiTopics: false, hideSessionInsights: false };
    }

    const plansHidingBoth = ["pln_alumni-p6bx02su", "pln_practitioners-ep2w035m", "pln_session-guests-9e2v03j0"];
    const plansHidingSessionInsightsOnly = ["pln_founders-4g3y0k45"];

    const planConnections = user.data.planConnections || [];

    // Check if user has any restricted plan active
    for (const connection of planConnections) {
        if (connection.status === "ACTIVE") {
            const planId = connection.planId?.toLowerCase();

            if (plansHidingBoth.includes(planId)) {
                return { hideWikiTopics: true, hideSessionInsights: true };
            }

            if (plansHidingSessionInsightsOnly.includes(planId)) {
                return { hideWikiTopics: false, hideSessionInsights: true };
            }
        }
    }

    return { hideWikiTopics: false, hideSessionInsights: false };
}
