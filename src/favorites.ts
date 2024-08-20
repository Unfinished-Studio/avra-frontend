window.Webflow ||= [];
window.Webflow.push(async () => {
    const ms = window.$memberstackDom;

    // get all favorites
    let json: any = await ms.getMemberJSON();
    console.log(json);

    let favArr: any[] = [];
    if (json && json.data && json.data.data && json.data.data.favorites) {
        favArr = json.data.data.favorites;
    }
    console.log(json, favArr);

    // sort filter non-favorites from list
    const wikiList = document.querySelector<HTMLElement>("[avra-element='favorite-wiki-list']");
    const sessionList = document.querySelector<HTMLElement>("[avra-element='favorite-session-list']");
    const podcastList = document.querySelector<HTMLElement>("[avra-element='favorite-podcast-list']");
    if (!wikiList || !sessionList || !podcastList) throw new Error("Missing list elements");

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
});
