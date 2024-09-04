// Page: Avra Wiki

window.Webflow ||= [];
window.Webflow.push(async () => {
    if (!window.location.search.includes("test")) return;
    console.log("testmode");

    // get all tags on user's plan
    const ms = window.$memberstackDom;
    const member = await ms.getCurrentMember();
    if (!member) return;

    // filter out items based on tags
    const wikiEls = document.querySelectorAll<HTMLElement>("[avra-element='wiki']");
    for (const el of wikiEls) {
        // grab the tags and assign them to the parent wiki
        // memberstack detects these and auto-removes if user has no permissions to view
        const tags = el.querySelectorAll<HTMLElement>("[avra-element='tag']");
        for (const tag of tags) {
            const slug = tag.getAttribute("data-avra-slug");
            if (slug) el.setAttribute("data-ms-content", slug);
        }
    }
});
