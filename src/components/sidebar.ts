import { getElement, getElements } from "@/utils/dom/elements";

export const Sidebar = () => {
    const dataContainer = getElement("[avra-element='data-container']");
    const wikiList = getElement("[avra-element='ss-wiki-list']", dataContainer);
    const sessionList = getElement("[avra-element='ss-session-list']", dataContainer);
    const caseStudyList = getElement("[avra-element='ss-case-study-list']", dataContainer);
    const podcastList = getElement("[avra-element='ss-podcast-list']", dataContainer);

    const wikiItems = getElements<HTMLAnchorElement>("[avra-element='ss-wiki']", wikiList);
    const sessionItems = getElements<HTMLAnchorElement>("[avra-element='ss-session']", sessionList);
    const caseStudyItems = getElements<HTMLAnchorElement>("[avra-element='ss-case-study']", caseStudyList);
    const podcastItems = getElements<HTMLAnchorElement>("[avra-element='ss-podcast']", podcastList);

    const sidebar = getElement("[avra-element='wiki-sidebar']");

    /* 
    Section Template Structure:
    * wiki-section-title (div)
    *   wiki-section-title-text (div)
    * wiki-section-item (a)
    *   wiki-section-item-text (div)
    */
    const sectionList = getElement("[avra-element='wiki-section-list']", sidebar);
    const sectionTemplate = getElement("[avra-element='wiki-section-template']", sectionList);

    // Sidebar sections data
    const sidebarSections = [
        // TODO: filter for favorited items from user localstorage (see favorites page logic)
        // { title: "Favorited", items: },
        { title: "Wiki Topics", items: wikiItems },
        { title: "Case Studies", items: caseStudyItems },
        { title: "Session Insights", items: sessionItems },
        { title: "Podcast Episodes", items: podcastItems },
    ];

    const sectionsToAdd: HTMLElement[] = [];

    // Create the sidebar sections
    for (const sidebarSection of sidebarSections) {
        const { title, items } = sidebarSection;

        const section = sectionTemplate.cloneNode(true) as HTMLElement;
        section.setAttribute("data-title", title);

        const sectionTitle = getElement("[avra-element='wiki-section-title']", section);
        const sectionTitleText = getElement("[avra-element='wiki-section-title-text']", sectionTitle);
        sectionTitleText.textContent = title;

        const sectionItemTemplate = getElement("[avra-element='wiki-section-item']", section);

        const sectionItemsToAdd: HTMLElement[] = [];

        for (const item of items) {
            const sectionItem = sectionItemTemplate.cloneNode(true) as HTMLAnchorElement;
            const sectionItemText = getElement("[avra-element='wiki-section-item-text']", sectionItem);
            sectionItemText.textContent = item.getAttribute("data-avra-title") || "#";
            sectionItem.href = item.href;
            sectionItemsToAdd.push(sectionItem);
        }

        while (section.children.length > 1) {
            section.removeChild(section.lastChild!);
        }
        for (const sectionItem of sectionItemsToAdd) {
            section.appendChild(sectionItem); // TODO: add to top of list
        }

        sectionItemTemplate.remove();
        sectionsToAdd.push(section);
    }

    sectionList.innerHTML = "";
    for (const section of sectionsToAdd) {
        sectionList.appendChild(section);
    }

    // Handle search form and results
    // right side of the page, where the search/wiki content displays
    // const container = getElement("[avra-element='wiki-container']");

    // LOWKEY: remove this
    // structured list of all items for ease of use in search system
    // const items = [...wikiItems, ...sessionItems, ...caseStudyItems, ...podcastItems].map((item) => {
    //     const link = item.querySelector("a");
    //     return {
    //         title: item.getAttribute("data-avra-title"),
    //         slug: item.getAttribute("data-avra-slug"),
    //         link: link?.getAttribute("href") || null,
    //         type: item.getAttribute("data-avra-type"),
    //         element: item,
    //     };
    // });

    // console.log("structured item list:", items);
};
