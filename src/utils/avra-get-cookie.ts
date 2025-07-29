// get cookies by name: https://stackoverflow.com/questions/23641531/get-a-cookie-value-javascript

export const avraGetCookie = (cookie: string) => {
    const name = cookie + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        const c = ca[i].trim();
        if (c.indexOf(name) === 0) {
            // console.log(`COOKIE ${cookie}: ${c.substr(name.length)}`);
            return c.substr(name.length);
        }
    }
    // console.log(`COOKIE ${cookie}: not found...`);
    return null;
};
