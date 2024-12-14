window.Webflow ||= [];
window.Webflow.push(async () => {
    // TODO: abstract to function
    // Favorites Button
    const dataEl = document.querySelector<HTMLElement>("[avra-element='item-data']");
    if (!dataEl) throw new Error("No data element for this CMS page");

    const slug = dataEl.getAttribute("data-avra-slug");
    if (!slug) throw new Error("No slug for this CMS item");

    const ms = window.$memberstackDom;
    let json: any = await ms.getMemberJSON();
    console.log(json);

    let favArr: any[] = [];
    if (json && (json.data || json.favorites)) {
        favArr = json.favorites || json.data.favorites || json.data.data.favorites;
    }
    console.log(favArr);

    let favorited = favArr.some((x: any) => {
        console.log(x.slug, slug);
        return x.slug === slug;
    });

    const favoriteBtns = document.querySelectorAll<HTMLElement>("[avra-element='favorite-btn']");
    for (const btn of favoriteBtns) {
        if (favorited) {
            btn.textContent = "Unfavorite Page";
        } else {
            btn.textContent = "Favorite Page";
        }

        btn.addEventListener("click", async () => {
            if (favorited) {
                console.log("removing");
                favArr = favArr.filter((x: any) => x.slug !== slug);
                btn.textContent = "Favorite Page";
            } else {
                console.log("adding");
                favArr.push({ page: window.location.href, slug: slug });
                btn.textContent = "Unfavorite Page";
            }
            favorited = favArr.some((x: any) => x.slug === slug);

            if (json.data && json.data.favorites) {
                json.data.favorites = favArr;
            } else {
                json.data = {
                    favorites: favArr,
                };
            }

            const updated = await ms.updateMemberJSON({ json: json });
            json = updated;

            console.log("new json", json);
        });
        btn.classList.remove("hide");
    }

    // Wiki Logic
    try {
        if (!window.location.search.includes("test")) throw new Error("Not in test mode");

        const testOldEls = document.querySelectorAll<HTMLElement>("[avra-element='test-old']");
        const testNewEls = document.querySelectorAll<HTMLElement>("[avra-element='test-new']");
        for (const el of testOldEls) el.remove();
        for (const el of testNewEls) el.classList.remove("hide");

        setTimeout(() => {
            const headingEls = document.querySelectorAll<HTMLHeadingElement>(
                "#wiki-content h1, #wiki-content h2, #wiki-content h3, #wiki-content h4"
            );
            const links: HTMLAnchorElement[] = [];

            const wikiNavEl = document.querySelector<HTMLElement>("[avra-element='wiki-nav-links']");
            if (!wikiNavEl) throw new Error("No wiki nav");

            for (let i = 0; i < headingEls.length; i++) {
                const headingEl = headingEls[i];
                if (!headingEl || !headingEl.textContent) continue;

                const id = headingEl.textContent
                    .trim()
                    .toLowerCase()
                    .replace(/[^a-z0-9]/g, "-");
                headingEl.id = id;

                const link = document.createElement("a");
                link.href = "#" + id;
                link.textContent = headingEl.textContent;
                link.className = "wiki-nav-link";
                link.dataset.index = String(i); // Store index for reference

                switch (headingEl.nodeName) {
                    case "H1":
                    case "H2":
                        break;
                    case "H3":
                        link.classList.add("is-lv-2");
                        break;
                    case "H4":
                        link.classList.add("is-lv-3");
                        break;
                }

                wikiNavEl.appendChild(link);
                links.push(link); // Store link for later use
            }
        }, 1000);
    } catch (err) {
        console.log("Error running wiki logic:", err);
    }
});
