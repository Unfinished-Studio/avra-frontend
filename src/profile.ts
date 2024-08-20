window.Webflow ||= [];
window.Webflow.push(async () => {
    // get opt-out button
    const btn = document.querySelector("#Directory-Opt-out");
    if (!btn || !btn.parentElement) return;
    const parent = btn.parentElement;

    // whenever opt-out button toggled
    btn.addEventListener("input", async () => {
        let checked = btn.checked;
        if (checked) {
            parent.classList.add("checked");
        } else {
            parent.classList.remove("checked");
        }

        const name_input = document.querySelector("input[name='Directory Member Name']");
        if (!name_input) return;

        // notify zapier to edit webflow item
        try {
            const res = await fetch("https://hooks.zapier.com/hooks/catch/18371170/23xu915/", {
                method: "POST",
                body: JSON.stringify({ checked: checked, name: name_input.value }),
            });
        } catch (err) {
            console.log(err);
        }
    });
});
