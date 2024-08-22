window.Webflow ||= [];
window.Webflow.push(async () => {
    if (!window.location.search.includes("test")) return;

    // get notif banner
    const wrapper = document.querySelector<HTMLElement>("[avra-element='notification-banner-wrapper']");
    if (!wrapper) return;

    // check superpower
    const ms = window.$memberstackDom;
    const member = await ms.getCurrentMember();
    if (!member || !member.data || !member.data.customFields) return;
    console.log(member);

    // display notif banner
    const memberFields: any = member.data.customFields;
    if (!memberFields["super-powers"] || memberFields["super-powers"] === "") {
        wrapper.classList.remove("hide");
    }
});
