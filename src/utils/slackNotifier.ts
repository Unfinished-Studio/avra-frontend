import { COOKIE_NAMES, api } from "@/constants";
import { avraGetCookie } from "./avraGetCookie";

// Enable/disable debug mode
const DEBUG = true;

/**
 * Debug logger that only logs when DEBUG is true
 */
const debug = (message: string, ...data: any[]) => {
    if (DEBUG) {
        console.log(`[SlackNotifier] ${message}`, ...data);
    }
};

/**
 * Sends a notification to Slack when a user navigates to a page
 */
export const notifySlackOnPageNavigation = () => {
    // Get the user ID from the cookie
    const userId = avraGetCookie(COOKIE_NAMES.USER_ID);

    if (!userId) {
        debug("No user ID found in cookie");
        return;
    }

    debug("User navigation detected", { userId, url: window.location.href });

    // Send the notification to Slack
    sendSlackNotification({
        userId,
        url: window.location.href,
        timestamp: new Date().toISOString(),
        event: "page",
    });
};

export const notifySlackOnLogin = () => {
    // Get the user ID from the cookie
    const userId = avraGetCookie(COOKIE_NAMES.USER_ID);

    if (!userId) {
        debug("No user ID found in cookie");
        return;
    }

    sendSlackNotification({
        userId,
        url: window.location.href,
        timestamp: new Date().toISOString(),
        event: "login",
    });
};
/**
 * Sends a notification to Slack via webhook
 */
const sendSlackNotification = async (data: { userId: string; url: string; timestamp: string; event: "login" | "page" }) => {
    try {
        debug("Sending Slack notification", data);

        const response = await fetch(`${api}/api/slack/notify`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...data,
                text: `📣 Page Navigation: User (ID: ${data.userId}) navigated to ${data.url} at ${data.timestamp}`,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Failed to send Slack notification:", errorText);
            debug("Failed to send Slack notification", { status: response.status, error: errorText });
        } else {
            debug("Successfully sent Slack notification");
        }
    } catch (error) {
        console.error("Error sending Slack notification:", error);
        debug("Error sending Slack notification", { error });
    }
};

// Initialize the navigation tracking
export const initNavigationTracking = (initialLogin: boolean = false) => {
    debug("Initializing navigation tracking");

    if (initialLogin) {
        debug("initial login, tracking login...");

        notifySlackOnLogin();
    }

    debug("user is logged in, tracking page activity...");

    // Send notification for the initial page load
    notifySlackOnPageNavigation();

    // Set up tracking for page navigation via the History API
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
        originalPushState.apply(this, args);
        debug("pushState navigation detected");
        notifySlackOnPageNavigation();
    };

    history.replaceState = function (...args) {
        originalReplaceState.apply(this, args);
        debug("replaceState navigation detected");
        notifySlackOnPageNavigation();
    };

    // Also track regular navigation events
    window.addEventListener("popstate", () => {
        debug("popstate navigation detected");
        notifySlackOnPageNavigation();
    });

    debug("Navigation tracking initialized");
};
