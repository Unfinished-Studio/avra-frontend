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

export const getAvraElement = <T extends HTMLElement>(selector: string, parent?: HTMLElement): T => {
    return getElement<T>(`[avra-element='${selector}']`, parent);
};

// Helper functions that work like standard DOM query methods but for avra-element attributes
export const avraQuery = <T extends HTMLElement>(elementName: string, context: ParentNode = document): T | null => {
    return context.querySelector<T>(`[avra-element='${elementName}']`);
};

export const avraQueryAll = <T extends HTMLElement>(elementName: string, context: ParentNode = document): NodeListOf<T> => {
    return context.querySelectorAll<T>(`[avra-element='${elementName}']`);
};

// Non-null assertion versions (throws if not found)
export const avraQueryRequired = <T extends HTMLElement>(elementName: string, context: ParentNode = document): T => {
    const element = avraQuery<T>(elementName, context);
    if (!element) throw new Error(`Required avra-element not found: ${elementName}`);
    return element;
};

export const avraQueryAllArray = <T extends HTMLElement>(elementName: string, context: ParentNode = document): T[] => {
    return Array.from(avraQueryAll<T>(elementName, context));
};
