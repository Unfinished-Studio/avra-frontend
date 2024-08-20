import { avraGetCookie } from "utils/avraGetCookie";
import { avraSetCookie } from "utils/avraSetCookie";

window.Webflow ||= [];
window.Webflow.push(async () => {
    console.log("webflow loaded");

    // on google login

    // get list of memberstack members

    // if google email is in list, allow user to enter

    // if not, don't allow user to enter

    // get member
    const memberstack = window.$memberstackDom;
    const user = await memberstack.getCurrentMember();
    console.log(user);
    if (!user || !user.data) {
        console.log("No logged in user.");
        return;
    }
    let fields = user.data.customFields as any;

    // check for login cookie
    const cookie = avraGetCookie("avra_log");

    let login = true;
    let date = new Date();

    if (cookie) {
        login = false;
        date = new Date(cookie);
    }

    console.log({ cookie, login, date });

    let expire_date = new Date();
    expire_date.setDate(expire_date.getDate() + 1);

    // send login message
    try {
        let obj = {
            first_name: fields["first-name"],
            last_name: fields["last-name"],
            email: user.data.auth.email,
            batch: fields.batch,
            timestamp: date,
            date: new Date(),
            page: window.location.href,
            login: login,
        };
        console.log(obj);

        const res = await fetch("https://hooks.zapier.com/hooks/catch/18371170/2bfu4rh/", {
            method: "POST",
            body: JSON.stringify(obj),
        });
        console.log(res.status);

        avraSetCookie("avra_log", date, expire_date);
    } catch (err) {
        console.log("Error logging:", err);
    }
});
