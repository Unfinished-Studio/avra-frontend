const ACCESS_KEYS = ["avra-dev"];

export const getAdminAccess = (): boolean => {
    const storedToken = localStorage.getItem("adminToken");
    const urlToken = new URLSearchParams(window.location.search).get("branch");

    console.log("checking admin token:", urlToken);

    if (urlToken && ACCESS_KEYS.includes(urlToken)) {
        console.log("valid admin token, storing:", urlToken);
        localStorage.setItem("adminToken", urlToken);
        return true;
    } else {
        console.log("invalid admin token");
    }

    if (storedToken && ACCESS_KEYS.includes(storedToken)) {
        console.log("valid stored admin token:", storedToken);
        return true;
    } else {
        console.log("invalid stored admin token");
    }

    return false;
};
