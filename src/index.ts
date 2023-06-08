import { hello } from "utils/hello";

window.Webflow ||= [];
window.Webflow.push(() => {
    console.log("webflow loaded");
    hello();

    // do stuff
});
