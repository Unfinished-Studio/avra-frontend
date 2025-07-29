const lastPage = localStorage.getItem("avra_last_page");
if (lastPage) {
    // remove item, then redirect user
    localStorage.removeItem("avra_last_page");
    window.location.href = lastPage;
}
