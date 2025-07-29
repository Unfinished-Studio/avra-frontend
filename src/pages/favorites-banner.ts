window.Webflow ||= [];
window.Webflow.push(async () => {
    const wrapper = document.querySelector<HTMLElement>("[avra-element='notification-banner-wrapper']");
    if (!wrapper) return;

    // check user favorites
    const ms = window.$memberstackDom;
    const member = await ms.getCurrentMember();
    if (!member || !member.data || !member.data.customFields) return;
    console.log(member);

    const userFields: any = member.data.customFields;

    // if favorited, display banner
    // const powersStr = member.data.customFields["super-powers"] || "";
    // const powers = powersStr.split(",").map((str) => str.trim());
    // console.log(powers);

    if (!userFields["super-powers"] || userFields["super-powers"] === "") {
        wrapper.classList.remove("hide");
    }
});
