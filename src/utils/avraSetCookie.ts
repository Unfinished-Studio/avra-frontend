export const avraSetCookie = (name: string, value: any, expiration?: any) => {
    let expires = "";
    if (expiration) expires = ";expires=" + expiration;
    const date = new Date();
    date.setTime(date.getTime() + 1 * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
};
