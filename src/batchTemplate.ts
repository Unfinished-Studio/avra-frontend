import { categories } from "./global";

window.Webflow ||= [];
window.Webflow.push(async () => {
    // open first announcement
    const announceEl = document.querySelector<HTMLElement>("[avra-element='announcement']");
    if (announceEl) {
        announceEl.click();
    }

    window.fsAttributes = window.fsAttributes || [];
    window.fsAttributes.push([
        "cmscombine",
        () => {
            console.log("cmscombine loaded");

            const listEl = document.querySelector<HTMLElement>("[fs-cmscombine-element='list']");
            if (!listEl) throw new Error("No list element");

            const cardEls = listEl.querySelectorAll<HTMLElement>(`[avra-category]`);

            // remove empty reading time and date
            for (const cardEl of cardEls) {
                const readingTimeEl = cardEl.querySelector<HTMLElement>("[avra-card-data='reading-time']");
                if (readingTimeEl && !readingTimeEl.textContent) {
                    readingTimeEl.parentElement?.remove();
                }

                const dateEl = cardEl.querySelector<HTMLElement>("[avra-card-data='date']");
                if (dateEl && !dateEl.textContent) {
                    dateEl.parentElement?.remove();
                }
            }

            const selectEl = document.querySelector<HTMLSelectElement>("[name='Filter-Content']");
            if (!selectEl) throw new Error("No select element");

            for (const category of categories) {
                const cards = listEl.querySelectorAll<HTMLElement>(`[avra-category="${category}"]`);
                console.log("found", cards.length, "cards for", category);

                if (cards.length === 0) {
                    const options = selectEl.options;
                    for (let i = options.length - 1; i >= 0; i--) {
                        if (options[i].value === category) {
                            console.log(category, "empty, removing from select");
                            selectEl.remove(i);
                        }
                    }
                }
            }
        },
    ]);

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
