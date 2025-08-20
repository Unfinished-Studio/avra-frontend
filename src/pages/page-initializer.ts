import { getCurrentPageInfo } from "@/utils/page-info";
import Player from "@vimeo/player";
import { PODCAST_CHAPTER_MAPPINGS } from "@/data/sidebar";

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

/**
 * Initializes podcast-specific functionality when on a podcast page
 */
const initPodcastPage = (slug: string) => {
    console.log("[page-initializer] Initializing podcast page functionality");

    // Initialize the Vimeo Player
    const iframe = document.querySelector("iframe");
    if (!iframe) {
        return;
    }

    const player = new Player(iframe);

    // Example data structure for chapters
    const chapters = PODCAST_CHAPTER_MAPPINGS[slug as keyof typeof PODCAST_CHAPTER_MAPPINGS];

    // Function to display timestamps in a table
    function displayTimestamps() {
        const table = document.querySelector("#chaptersTable");
        if (!table) return;
        const tableBody = table.getElementsByTagName("tbody")[0];
        chapters.forEach((chapter) => {
            const row = document.createElement("tr");
            const titleCell = document.createElement("td");
            const timeCell = document.createElement("td");
            const link = document.createElement("a");
            link.href = "#";
            link.textContent = chapter.time;
            link.onclick = function (event) {
                event.preventDefault();
                // Convert timestamp to seconds
                const timeParts = chapter.time.split(":");
                const seconds = parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);
                player.setCurrentTime(seconds);
            };

            titleCell.textContent = chapter.title;
            timeCell.appendChild(link);
            row.appendChild(titleCell);
            row.appendChild(timeCell);
            tableBody.appendChild(row);
        });
    }

    displayTimestamps();

    console.log("[page-initializer] Podcast page initialization complete");
};

export const initContentPage = async () => {
    if (window.location.href.includes("/session-insights")) {
        fixListSpacing();
    }

    // Check if we're on a podcast page and initialize podcast-specific functionality
    const { currentType, currentSlug } = getCurrentPageInfo();

    if (currentType === "podcast" && currentSlug) {
        initPodcastPage(currentSlug);
    }

    console.log("[page-initializer] initialized page");
};
