/**
 * Checks if the staging cookie is set to true
 * @returns boolean indicating if the staging cookie is set
 */
export const getStaging = (): boolean => {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith("staging=")) {
            return cookie.substring(8) === "true";
        }
    }
    return false;
};
