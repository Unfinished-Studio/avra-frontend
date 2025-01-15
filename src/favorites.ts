import { categories, testmode } from "./global";

window.Webflow ||= [];
window.Webflow.push(async () => {
    const ms = window.$memberstackDom;

    // get all favorites
    let json: any = await ms.getMemberJSON();

    let favArr: any[] = [];
    if (json && json.data && json.data.data && json.data.data.favorites) {
        favArr = json.data.data.favorites;
    }
    console.log(json, favArr);

    // sort filter non-favorites from list
    if (!testmode) {
        const wikiList = document.querySelector<HTMLElement>("[avra-element='favorite-wiki-list']");
        const sessionList = document.querySelector<HTMLElement>("[avra-element='favorite-session-list']");
        const podcastList = document.querySelector<HTMLElement>("[avra-element='favorite-podcast-list']");
        const studyList = document.querySelector<HTMLElement>("[avra-element='favorite-study-list']");
        if (!wikiList || !sessionList || !podcastList || !studyList) throw new Error("Missing list elements");

        const wikiEls = [...wikiList.querySelectorAll<HTMLElement>("[data-avra-slug]")];
        const wikiKeep = wikiEls.filter((el) => {
            const slug = el.getAttribute("data-avra-slug");
            return favArr.some((f) => f.slug === slug);
        });
        if (wikiKeep.length) {
            wikiList.replaceChildren(...wikiKeep);
        } else {
            wikiList.parentElement?.parentElement?.remove();
        }

        const sessionEls = [...sessionList.querySelectorAll<HTMLElement>("[data-avra-slug]")];
        const sessionKeep = sessionEls.filter((el) => {
            const slug = el.getAttribute("data-avra-slug");
            return favArr.some((f) => f.slug === slug);
        });
        if (sessionKeep.length) {
            sessionList.replaceChildren(...sessionKeep);
        } else {
            sessionList.parentElement?.parentElement?.remove();
        }

        const podcastEls = [...podcastList.querySelectorAll<HTMLElement>("[data-avra-slug]")];
        const podcastKeep = podcastEls.filter((el) => {
            const slug = el.getAttribute("data-avra-slug");
            return favArr.some((f) => f.slug === slug);
        });
        if (podcastKeep.length) {
            podcastList.replaceChildren(...podcastKeep);
        } else {
            podcastList.parentElement?.parentElement?.remove();
        }

        const studyEls = [...studyList.querySelectorAll<HTMLElement>("[data-avra-slug]")];
        const studyKeep = studyEls.filter((el) => {
            const slug = el.getAttribute("data-avra-slug");
            return favArr.some((f) => f.slug === slug);
        });
        if (studyKeep.length) {
            studyList.replaceChildren(...studyKeep);
        } else {
            studyList.parentElement?.parentElement?.remove();
        }
    }

    if (!favArr.length) {
        const emptyBanner = document.querySelector<HTMLElement>("[avra-element='empty-banner']");
        if (!emptyBanner) return;
        emptyBanner.classList.remove("hide");
    }

    if (testmode) {
        window.fsAttributes = window.fsAttributes || [];
        window.fsAttributes.push([
            "cmscombine",
            () => {
                console.log("cmscombine loaded");

                const listEl = document.querySelector<HTMLElement>("[fs-cmscombine-element='list']");
                if (!listEl) throw new Error("No list element");

                const cardEls = [...listEl.querySelectorAll<HTMLElement>(`[avra-category]`)];
                removeNonFavorites(listEl);

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

                const selectEl = document.querySelector<HTMLSelectElement>("[name='Filter-Favorites']");
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

                window.fsAttributes = window.fsAttributes || [];
                window.fsAttributes.push([
                    "cmsfilter",
                    (filterInstances: any) => {
                        console.log("cmsfilter Successfully loaded!");

                        const [filterInstance] = filterInstances;

                        // remove non-favorites on each filter (finsweet automatically adds all items back)
                        filterInstance.listInstance.on("renderitems", (renderedItems: any) => {
                            removeNonFavorites(listEl);
                        });
                    },
                ]);

                function removeNonFavorites(listEl: HTMLElement) {
                    const cardEls = [...listEl.querySelectorAll<HTMLElement>(`[avra-category]`)];
                    const cardsToRemove = cardEls.filter((el) => {
                        const slug = el.getAttribute("data-avra-slug");
                        return !favArr.some((f) => f.slug === slug);
                    });
                    for (const card of cardsToRemove) {
                        card.remove();
                    }
                }
            },
        ]);
    }
});
