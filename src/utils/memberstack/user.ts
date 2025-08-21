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
