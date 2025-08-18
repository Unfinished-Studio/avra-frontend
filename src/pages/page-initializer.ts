import { getAvraElement } from "@/utils/dom/elements";

// const handleScrollToHighlight = () => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const highlightText = urlParams.get("highlight");

//     const wikiContainer = getAvraElement("wiki-content");
//     wikiContainer.style.paddingTop = "64px";

//     if (highlightText) {
//         console.log("scrolling to highlighted text", highlightText);

//         const closeBtn = document.querySelector<HTMLElement>(".wiki-section-close");
//         if (closeBtn) {
//             closeBtn.click();
//         }

//         // Function to find and scroll to matching text in headings only
//         const scrollToHighlightedText = () => {
//             const content = document.querySelector("#wiki-content");
//             if (!content) return;

//             // Only search within heading elements (h1, h2, h3, h4, h5, h6)
//             const headings = content.querySelectorAll("h1, h2, h3, h4, h5, h6");
//             const searchText = highlightText.toLowerCase();

//             for (const heading of headings) {
//                 const headingText = heading.textContent?.toLowerCase() || "";

//                 if (headingText.includes(searchText)) {
//                     // Found matching text in heading, scroll to it
//                     console.log("element", heading);

//                     // Get element position and scroll with 100px offset
//                     const elementRect = heading.getBoundingClientRect();
//                     const elementTop = elementRect.top + window.pageYOffset;

//                     wikiContainer.scrollTo({
//                         top: elementTop - 120,
//                         behavior: "smooth",
//                     });

//                     // Highlight the text temporarily
//                     const originalHTML = heading.innerHTML;

//                     // Create a more robust regex that doesn't interfere with HTML tags
//                     const escapedHighlightText = highlightText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

//                     // Function to highlight text while preserving HTML structure
//                     const highlightTextInHTML = (html: string, searchText: string): string => {
//                         // Create a temporary element to parse the HTML
//                         const tempDiv = document.createElement("div");
//                         tempDiv.innerHTML = html;

//                         // Function to recursively highlight text in text nodes
//                         const highlightInNode = (node: Node): void => {
//                             if (node.nodeType === Node.TEXT_NODE) {
//                                 const textContent = node.textContent || "";
//                                 const regex = new RegExp(`(${escapedHighlightText})`, "gi");
//                                 if (regex.test(textContent)) {
//                                     const newHTML = textContent.replace(
//                                         regex,
//                                         '<mark class="highlight-fade" style="background-color: transparent; transition: background-color 0.5s ease-in-out; padding: 2px;">$1</mark>'
//                                     );
//                                     const wrapper = document.createElement("span");
//                                     wrapper.innerHTML = newHTML;
//                                     node.parentNode?.replaceChild(wrapper, node);
//                                 }
//                             } else if (node.nodeType === Node.ELEMENT_NODE) {
//                                 // Recursively process child nodes
//                                 Array.from(node.childNodes).forEach((child) => highlightInNode(child));
//                             }
//                         };

//                         highlightInNode(tempDiv);
//                         return tempDiv.innerHTML;
//                     };

//                     const newHTML = highlightTextInHTML(originalHTML, highlightText);
//                     heading.innerHTML = newHTML;

//                     const marks = heading.querySelectorAll<HTMLElement>(".highlight-fade");

//                     // Fade in
//                     setTimeout(() => {
//                         marks.forEach((mark) => {
//                             mark.style.backgroundColor = "#d6d5d1";
//                         });
//                     }, 100);

//                     // Fade out and remove
//                     setTimeout(() => {
//                         marks.forEach((mark) => {
//                             mark.style.backgroundColor = "transparent";
//                         });

//                         // Remove the mark after fade out transition ends
//                         setTimeout(() => {
//                             heading.innerHTML = originalHTML;
//                         }, 500); // This should match the transition duration
//                     }, 2500);

//                     break;
//                 }
//             }
//         };

//         // Wait for content to load and stabilize, then scroll with retry mechanism
//         const attemptScroll = (attempt = 1, maxAttempts = 8) => {
//             console.log(`Scroll attempt ${attempt} for "${highlightText}"`);

//             const content = document.querySelector("#wiki-content");
//             if (!content) {
//                 if (attempt < maxAttempts) {
//                     setTimeout(() => attemptScroll(attempt + 1, maxAttempts), 300);
//                 }
//                 return;
//             }

//             const headings = content.querySelectorAll("h1, h2, h3, h4, h5, h6");
//             const searchText = highlightText.toLowerCase();
//             let foundHeading = null;

//             for (const heading of headings) {
//                 const headingText = heading.textContent?.toLowerCase() || "";
//                 if (headingText.includes(searchText)) {
//                     foundHeading = heading;
//                     break;
//                 }
//             }

//             if (foundHeading) {
//                 console.log("Found heading, scrolling to:", foundHeading.textContent);

//                 // Wait for layout to stabilize before scrolling
//                 requestAnimationFrame(() => {
//                     requestAnimationFrame(() => {
//                         scrollToHighlightedText();

//                         // Verify scroll position after a short delay and adjust if needed
//                         setTimeout(() => {
//                             const rect = foundHeading.getBoundingClientRect();
//                             const currentViewportTop = rect.top;

//                             // If element is still too close to bottom of screen, scroll more
//                             if (currentViewportTop > window.innerHeight * 0.7) {
//                                 console.log("Adjusting scroll position - element too low");
//                                 const elementTop = rect.top + window.pageYOffset;
//                                 wikiContainer.scrollTo({
//                                     top: elementTop - 150,
//                                     behavior: "smooth",
//                                 });
//                             }
//                         }, 500);
//                     });
//                 });
//             } else if (attempt < maxAttempts) {
//                 console.log(`Heading not found on attempt ${attempt}, retrying...`);
//                 setTimeout(() => attemptScroll(attempt + 1, maxAttempts), 300);
//             } else {
//                 console.warn(`Could not find heading with text "${highlightText}" after ${maxAttempts} attempts`);
//             }
//         };

//         // Use longer initial delay and check for document readiness
//         const startScrolling = () => {
//             if (document.readyState === "complete") {
//                 setTimeout(() => attemptScroll(), 1000);
//             } else {
//                 window.addEventListener("load", () => {
//                     setTimeout(() => attemptScroll(), 1000);
//                 });
//             }
//         };

//         startScrolling();
//     }
// };

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

    console.log("page initialized");
};
