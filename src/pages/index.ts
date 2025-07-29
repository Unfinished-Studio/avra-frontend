import { COOKIE_NAMES, SLACK_NOTIFIER } from "@/constants";
import { avraGetCookie } from "@/utils/avra-get-cookie";
import { avraSetCookie } from "@/utils/avra-set-cookie";
import { getUser } from "@/utils/memberstack/user";
import { initNavigationTracking } from "@/utils/slack-notifier";

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

    if (SLACK_NOTIFIER) {
        initNavigationTracking(loginCookie ? false : true);
    }
}

window.addEventListener("load", async () => {
    try {
        await trackLogin();
    } catch (err) {
        console.log("Error tracking login:", err);
    }
});
