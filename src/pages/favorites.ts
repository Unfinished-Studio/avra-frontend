import { categories } from "src/global";

window.Webflow ||= [];
window.Webflow.push(async () => {
    const ms = window.$memberstackDom;

    // get all favorites
    let json: any = await ms.getMemberJSON();

    let favArr: any[] = [];
    if (json && json.data && json.data.data && json.data.data.favorites) {
        favArr = json.data.data.favorites;
    }

    if (!favArr.length) {
        const emptyBanner = document.querySelector<HTMLElement>("[avra-element='empty-banner']");
        if (!emptyBanner) return;
        emptyBanner.classList.remove("hide");
    }

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
});
