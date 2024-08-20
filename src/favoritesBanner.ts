window.Webflow ||= [];
window.Webflow.push(async () => {
    if (!window.location.search.includes("test")) return;

    const wrapper = document.querySelector<HTMLElement>("[avra-element='notification-banner-wrapper']");
    if (!wrapper) return;

    // check user favorites
    const ms = window.$memberstackDom;
    const member = await ms.getCurrentMember();
    if (!member || !member.data || !member.data.customFields) return;
    console.log(member);

    // if favorited, display banner
    // const powersStr = member.data.customFields["super-powers"] || "";
    // const powers = powersStr.split(",").map((str) => str.trim());
    // console.log(powers);

    if (!member.data.customFields["super-powers"] || member.data.customFields["super-powers"] === "") {
        wrapper.classList.remove("hide");
    }
});
