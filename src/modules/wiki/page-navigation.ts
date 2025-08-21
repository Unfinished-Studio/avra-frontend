import { getNavigationInfo, type NavigationInfo } from "@/utils/navigation";
import { getElement } from "@/utils/dom/elements";

const NAVIGATION_CONTAINER_ID = "avra-page-navigation";

const createNavigationButton = (title: string, href: string, type: "previous" | "next"): HTMLElement => {
    const button = document.createElement("a");
    button.href = href;
    button.setAttribute("data-swup-preload", "");
    button.className = `avra-nav-button avra-nav-${type}`;

    // Create button structure
    const buttonContent = document.createElement("div");
    buttonContent.className = "avra-nav-button-content";

    const direction = document.createElement("div");
    direction.className = "avra-nav-direction";
    direction.textContent = type === "previous" ? "← Previous" : "Next →";

    const titleElement = document.createElement("div");
    titleElement.className = "avra-nav-title";
    titleElement.textContent = title;

    buttonContent.appendChild(direction);
    buttonContent.appendChild(titleElement);
    button.appendChild(buttonContent);

    return button;
};

const createNavigationContainer = (navigationInfo: NavigationInfo): HTMLElement => {
    const container = document.createElement("div");
    container.id = NAVIGATION_CONTAINER_ID;
    container.className = "avra-page-navigation";

    // Add styles inline since we don't have a CSS file
    container.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        margin: 3rem 0 2rem 0;
        padding: 1.5rem 0;
        border-top: 1px solid #e5e7eb;
    `;

    // Add button styles
    const style = document.createElement("style");
    style.textContent = `
        .avra-nav-button {
            display: flex;
            flex-direction: column;
            padding: 1rem 1.5rem;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            text-decoration: none;
            color: inherit;
            transition: all 0.2s ease;
            background: white;
            min-width: 200px;
            max-width: 300px;
        }
        
        .avra-nav-button:hover {
            border-color: #6366f1;
            /* box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15); */
            transform: translateY(-1px);
        }
        
        .avra-nav-previous {
            text-align: left;
        }
        
        .avra-nav-next {
            text-align: right;
            margin-left: auto;
        }
        
        .avra-nav-direction {
            font-size: 0.875rem;
            font-weight: 500;
            color: #6b7280;
            margin-bottom: 0.25rem;
        }
        
        .avra-nav-title {
            font-size: 1rem;
            font-weight: 600;
            color: #111827;
            line-height: 1.4;
        }
        
        .avra-nav-spacer {
            flex: 1;
        }
        
        @media (max-width: 768px) {
            .avra-page-navigation {
                flex-direction: column;
                gap: 1rem;
            }
            
            .avra-nav-button {
                width: 100%;
                max-width: none;
                text-align: center !important;
            }
            
            .avra-nav-next {
                margin-left: 0;
            }
        }
    `;

    if (!document.head.querySelector("style[data-avra-navigation]")) {
        style.setAttribute("data-avra-navigation", "true");
        document.head.appendChild(style);
    }

    // Create previous button or spacer
    if (navigationInfo.previous) {
        const prevButton = createNavigationButton(navigationInfo.previous.title, navigationInfo.previous.href, "previous");
        container.appendChild(prevButton);
    } else {
        const spacer = document.createElement("div");
        spacer.className = "avra-nav-spacer";
        container.appendChild(spacer);
    }

    // Create next button
    if (navigationInfo.next) {
        const nextButton = createNavigationButton(navigationInfo.next.title, navigationInfo.next.href, "next");
        container.appendChild(nextButton);
    }

    return container;
};

export const initPageNavigation = (): void => {
    // Remove existing navigation if present
    const existingNav = document.getElementById(NAVIGATION_CONTAINER_ID);
    if (existingNav) {
        existingNav.remove();
    }

    const navigationInfo = getNavigationInfo();

    // Only show navigation if there's a previous or next page
    if (!navigationInfo.previous && !navigationInfo.next) {
        return;
    }

    // Find content container to append navigation
    const contentContainer = document.querySelector("#main-content, [avra-element='wiki-content'], .wiki-content, .main-content");

    if (!contentContainer) {
        console.warn("Could not find content container for page navigation");
        return;
    }

    const navigationContainer = createNavigationContainer(navigationInfo);
    contentContainer.appendChild(navigationContainer);

    console.log("[page-navigation] Navigation initialized", navigationInfo);
};
