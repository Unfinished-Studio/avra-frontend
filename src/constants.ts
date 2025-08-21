import { getStaging } from "@/utils/admin/get-staging";
import { WikiTagEnum, type WikiTag, type ContentType } from "@/data/content";

export const TEST_MODE = window.location.search.includes("test");

// TODO: configure worker to use avracap.com domain
export const API = getStaging() ? "http://localhost:8787" : "https://avra-worker.nic-f66.workers.dev";

export const CATEGORIES = ["Session Insights", "Podcasts", "Case Studies", "Wikis"];

export const SLACK_NOTIFIER = true;

export const COOKIE_NAMES = {
    USER_ID: "ajs_user_id",
    LOGIN_REDIRECT: "avra_login_redirect",
    LOGIN_LOG: "avra_log",
    LOGGED_IN: "ms-auth",
};

export const SMART_SEARCH_CONFIG = {
    api: getStaging() ? "http://localhost:8787" : "https://avra-worker.nic-f66.workers.dev", // TODO: use avracap.com domain in prod
    searchDebounce: 500, // ms
    searchResults: 8, // the maximum number of results to show in the results preview
    contentTypeOrder: ["wiki", "insight", "podcast", "case-study", "other"],
    wikiTagFilters: Object.values(WikiTagEnum) as WikiTag[],
    resultsElement: "[avra-element='ss-results']",
    resultsCounterElement: "[avra-element='ss-results-counter']",
} as const;

export const CONTENT_TYPE_SLUG_MAPPINGS: Record<ContentType, string> = {
    Wiki: "avra-wiki",
    "Session Insights": "session-insights",
    Podcasts: "audio-video",
    "Case Studies": "case-studies",
};
