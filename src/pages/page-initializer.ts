const fixListSpacing = () => {
    // Add CSS rule for nested unordered lists to have margin-bottom: 0px
    const style = document.createElement("style");
    style.textContent = `
        ul ul {
            margin-bottom: 0px !important;
        }
        p:has(+ ul),
        p:has(+ ol) {
            margin-bottom: 0px !important;
        }
    `;
    document.head.appendChild(style);
};

export const initContentPage = async () => {
    if (window.location.href.includes("/session-insights")) {
        fixListSpacing();
    }

    console.log("[page-initializer] initialized page");
};
