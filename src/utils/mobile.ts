import { MOBILE_BREAKPOINT } from "./constants";

// Mobile detection utility
export const isMobile = (): boolean => {
    return window.innerWidth <= MOBILE_BREAKPOINT;
};
