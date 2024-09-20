window.Webflow ||= [];
window.Webflow.push(async () => {
    console.log("webflow loaded");

    const oldWpr = document.querySelector<HTMLElement>("[pfm-element='old-wrapper']");
    const newWpr = document.querySelector<HTMLElement>("[pfm-element='new-wrapper']");
    if (!oldWpr || !newWpr) return;

    if (!window.location.search.includes("test")) {
        oldWpr.classList.remove("hide");
        newWpr.remove();
        return;
    }

    oldWpr.classList.add("hide");
    newWpr.classList.remove("hide");

    // notification bar
    // reveal notif bar if user has not set any vals

    // podcast

    // events + events filter
    // other batch members
    // table of contents
});
