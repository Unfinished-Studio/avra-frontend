import { avraGetCookie } from "@/utils/avra-get-cookie";
import { avraSetCookie } from "@/utils/avra-set-cookie";

declare const jwt_decode: any;
declare const google: any;

const memberstack = window.$memberstackDom;
let pw = "o!AwcYTw77JXikqRQ!D3";

window.Webflow ||= [];
window.Webflow.push(async () => {
    // workaround for login reload bug
    setTimeout(() => {
        const login_redirect = avraGetCookie("avra_login_redirect");
        if (login_redirect && login_redirect !== "") {
            avraSetCookie("avra_login_redirect", "");
            location.href = login_redirect;
        }
    }, 2000);

    const googleBtn = document.querySelector<HTMLElement>("[data-avra-element='google-button']");
    if (!googleBtn) throw new Error("No google button");
    googleBtn.classList.remove("hide");

    /**
     * runs when the user logs in using the google button
     * @param response
     */
    async function handleCredentialResponse(response: any) {
        console.log("Encoded JWT ID token: " + response.credential);

        var token = response.credential;
        var decoded = jwt_decode(token);

        console.log(decoded);

        try {
            // search for member
            const res = await fetch("https://admin.memberstack.com/members/" + encodeURIComponent(decoded.email), {
                method: "GET",
                headers: { "X-API-KEY": "sk_57eeb6de165154f630c2" },
            });
            if (res.status !== 200) throw new Error(await res.text());
            const user = await res.json();
            console.log({ user });
            if (!user || !user.data || !user.data.auth || !user.data.auth.email) throw new Error("User invalid");

            // send user email
            // let emailResult = await memberstack.sendMemberLoginPasswordlessEmail({
            //     email: user.data.auth.email,
            // });
            // console.log({ emailResult });
            // if (!emailResult || !emailResult.data || !emailResult.data.success) throw new Error("Error email result");

            // log user in using set pw
            let loginResult = await memberstack.loginMemberEmailPassword({
                email: user.data.auth.email,
                password: pw,
            });
            console.log({ loginResult });
            if (!loginResult || !loginResult.data) throw new Error("Error login result");

            avraSetCookie("avra_login_redirect", loginResult.data.redirect);

            location.reload();
        } catch (err) {
            console.log("Error:", err);
            location.reload();
        }
    }

    // google
    window.onload = function () {
        google.accounts.id.initialize({
            client_id: "894749856097-ogs083j7ng3qmiubl8irhd13klntnbo4.apps.googleusercontent.com",
            callback: handleCredentialResponse,
        });
        function createFakeGoogleWrapper() {
            const googleLoginWrapper = document.createElement("div");
            googleLoginWrapper.style.display = "none";
            googleLoginWrapper.classList.add("custom-google-button");
            document.body.appendChild(googleLoginWrapper);
            google.accounts.id.renderButton(googleLoginWrapper, {
                theme: "outline",
                size: "medium",
                text: "signup_with",
                logo_alignment: "center",
                width: "320",
            });
            const googleLoginWrapperButton = googleLoginWrapper.querySelector<HTMLElement>("div[role=button]");
            return {
                click: () => {
                    if (googleLoginWrapperButton) googleLoginWrapperButton.click();
                },
            };
        }
        const googleButtonWrapper = createFakeGoogleWrapper();
        const handleGoogleLogin = () => {
            googleButtonWrapper.click();
        };
        googleBtn.addEventListener("click", () => {
            handleGoogleLogin();
        });
    };
});
