window.Webflow ||= [];
window.Webflow.push(async () => {
    // TEMPORARY showing new page only when using test parameter
    const oldWpr = document.querySelector<HTMLElement>("[avra-element='old-wrapper']");
    const newWpr = document.querySelector<HTMLElement>("[avra-element='new-wrapper']");
    if (!oldWpr || !newWpr) return;

    if (!window.location.search.includes("test")) {
        oldWpr.classList.remove("hide");
        newWpr.remove();
        return;
    }
    oldWpr.classList.add("hide");
    newWpr.classList.remove("hide");

    // TEMPORARY using old data for nested cms collections (to bypass limit)
    // const annWpr = document.querySelector<HTMLElement>("[avra-element='announcements-wrapper']");
    // const oldAnnWpr = document.querySelector<HTMLElement>("[avra-element='old-announcements-wrapper']");
    // if (annWpr && oldAnnWpr) {
    //     annWpr.replaceWith(oldAnnWpr);
    // }

    // const wikiWpr = document.querySelector<HTMLElement>("[avra-element='wiki-wrapper']");
    // const oldWikiWpr = document.querySelector<HTMLElement>("[avra-element='old-wiki-wrapper']");
    // if (wikiWpr && oldWikiWpr) {
    //     wikiWpr.replaceWith(oldWikiWpr);
    // }

    // events filter
    // const eventsSelect = document.querySelector<HTMLSelectElement>("[avra-element='events-select']");

    // table of contents
});
