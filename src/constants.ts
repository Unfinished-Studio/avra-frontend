import { getStaging } from "@/utils/admin/getStaging";

export const testmode = window.location.search.includes("test");

// TODO: configure worker to use avracap.com domain
export const api = getStaging() ? "http://localhost:8787" : "https://avra-worker.nic-f66.workers.dev";

export const categories = ["Session Insights", "Podcasts", "Case Studies", "Wikis"];

// Slack webhook URL for page navigation notification
// dev
export const SLACK_WEBHOOK_URL = "https://hooks.slack.com/services/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";
// prod
// export const SLACK_WEBHOOK_URL = "https://hooks.slack.com/services/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";

// Cookie names
export const COOKIE_NAMES = {
    USER_ID: "id",
    LOGIN_REDIRECT: "avra_login_redirect",
    LOGIN_LOG: "avra_log",
};
