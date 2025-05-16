import { COOKIE_NAMES } from "@/constants";
import { avraGetCookie } from "@/utils/avraGetCookie";
import { avraSetCookie } from "@/utils/avraSetCookie";
import { getUser } from "@/utils/memberstack/user";
import { initNavigationTracking } from "@/utils/slackNotifier";

async function trackLogin() {
    const user = await getUser();

    // console.log("user:", user);

    const loginCookie = avraGetCookie(COOKIE_NAMES.USER_ID);

    // if no login cookie, create one and send login event
    // cookie expires in 1 day to reset tracking
    if (!loginCookie) {
        let expire_date = new Date();
        expire_date.setDate(expire_date.getDate() + 1);
        avraSetCookie(COOKIE_NAMES.USER_ID, user.id, expire_date);
    }

    initNavigationTracking(loginCookie ? false : true);
}

window.Webflow ||= [];
window.Webflow.push(async () => {
    try {
        await trackLogin();
    } catch (err) {
        console.log("Error tracking login:", err);
    }
});
