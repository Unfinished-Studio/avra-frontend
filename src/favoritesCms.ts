// Audio/Videos Template, Avra Wikis Template, Session Insights Template

window.Webflow ||= [];
window.Webflow.push(async () => {
    if (!window.location.search.includes("test")) return;

    const ms = window.$memberstackDom;
    let json: any = await ms.getMemberJSON();
    console.log(json);

    let favArr: any[] = [];
    if (json && json.data && json.favorites) {
        favArr = json.favorites;
    }

    let favorited = favArr.some((x: any) => x.slug === slug);

    // handle favorites buttons
    const dataEl = document.querySelector<HTMLElement>("[avra-element='item-data']");
    if (!dataEl) throw new Error("No data element for this CMS page");

    const slug = dataEl.getAttribute("data-avra-slug");
    if (!slug) throw new Error("No slug for this CMS item");

    const favoriteBtns = document.querySelectorAll<HTMLElement>("[avra-element='favorite-btn']");
    for (const btn of favoriteBtns) {
        if (favorited) {
            btn.textContent = "Favorite Page";
        } else {
            btn.textContent = "Unfavorite Page";
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

        if (favorited) {
            btn.textContent = "unfavorite";
        }
        btn.classList.remove("hide");
    }

    // onfavorite store on user object

    // on favorite page, display all favorites by filtering using collection lists and whatnot
});
