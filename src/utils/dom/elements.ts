// Group simple, related DOM functions together
export const getElement = <T extends HTMLElement>(selector: string, context: ParentNode = document): T => {
    const element = context.querySelector<T>(selector);
    if (!element) throw new Error(`Element not found: ${selector}`);
    return element;
};

export const getElements = <T extends HTMLElement>(selector: string, context: ParentNode = document): T[] => {
    return Array.from(context.querySelectorAll<T>(selector));
};

export const createElement = <T extends HTMLElement>(tagName: string, options?: ElementCreationOptions): T => {
    return document.createElement(tagName, options) as T;
};
