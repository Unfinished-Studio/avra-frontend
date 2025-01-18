import { categories } from "./global";

window.Webflow ||= [];
window.Webflow.push(async () => {
    const hideAnnouncements = document.querySelector<HTMLElement>("[data-hide-announcements]")?.dataset.hideAnnouncements === "true";
    const hideCommunity = document.querySelector<HTMLElement>("[data-hide-community]")?.dataset.hideCommunity === "true";
    const hideEvents = document.querySelector<HTMLElement>("[data-hide-events]")?.dataset.hideEvents === "true";
    const hideSessionInsights = document.querySelector<HTMLElement>("[data-hide-session-insights]")?.dataset.hideSessionInsights === "true";
    const hideWiki = document.querySelector<HTMLElement>("[data-hide-wiki]")?.dataset.hideWiki === "true";

    console.log({ hideAnnouncements, hideCommunity, hideEvents, hideSessionInsights, hideWiki });

    window.fsAttributes = window.fsAttributes || [];
    window.fsAttributes.push([
        "cmsfilter",
        (filterInstances: any) => {
            console.log("cmsfilter loaded");

            const [filterInstance] = filterInstances;
            filterInstance.listInstance.on("renderitems", (renderedItems: any) => {
                for (const item of renderedItems) {
                    const cardEl = item.element;
                    const category = cardEl.getAttribute("avra-category");

                    if (hideAnnouncements && category === "Announcements") {
                        console.log("removing announcement");
                        cardEl.remove();
                    }
                    if (hideCommunity && category === "Community") {
                        console.log("removing community");
                        cardEl.remove();
                    }
                    if (hideEvents && category === "Events") {
                        console.log("removing event");
                        cardEl.remove();
                    }
                    if (hideSessionInsights && category === "Session Insights") {
                        console.log("removing session insight");
                        cardEl.remove();
                    }
                    if (hideWiki && category === "Wikis") {
                        console.log("removing wiki");
                        cardEl.remove();
                    }
                }
            });

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
        },
    ]);

    // open first announcement
    const announceEl = document.querySelector<HTMLElement>("[avra-element='announcement']");
    if (announceEl) {
        announceEl.click();
    }
});
