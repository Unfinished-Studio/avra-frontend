import { COOKIE_NAMES, SLACK_NOTIFIER } from "@/constants";
import { avraGetCookie } from "@/utils/avra-get-cookie";
import { avraSetCookie } from "@/utils/avra-set-cookie";
import { getUser } from "@/utils/memberstack/user";
import { initNavigationTracking } from "@/utils/slack-notifier";

console.log("index page, tracking login...");

let loginTracked = false;

async function trackLogin() {
    console.log("[index] tracking login...");

    const user = await getUser();
    if (!user) {
        throw new Error("No logged in user");
    }

    console.log("[index] user:", user);

    const loginCookie = avraGetCookie(COOKIE_NAMES.USER_ID);

    console.log("[index] loginCookie:", loginCookie);

    // if no login cookie, create one and send login event
    // cookie expires in 1 day to reset tracking
    if (!loginCookie) {
        let expire_date = new Date();
        expire_date.setDate(expire_date.getDate() + 1);
        avraSetCookie(COOKIE_NAMES.USER_ID, user.id, expire_date);
    }

    if (SLACK_NOTIFIER) {
        initNavigationTracking(loginCookie ? false : true);
    }
}

window.Webflow ||= [];
window.Webflow.push(async () => {
    const page = window.location.pathname;
    if (page.includes("/avra-gpt")) {
        console.log("avra-gpt page, skipping login tracking");
        return;
    }

    // check if user is logged in
    if (loginTracked) {
        return;
    }

    try {
        await trackLogin();
        loginTracked = true;
    } catch (err) {
        console.log("[index] Error tracking login:", err);
    }
});
