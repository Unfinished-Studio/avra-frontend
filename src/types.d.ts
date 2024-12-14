import type memberstackDOM from "@memberstack/dom";

declare global {
    interface Window {
        $memberstackDom: ReturnType<typeof memberstackDOM.init>;
        $memberstackReady: boolean;
        $msChannelEvents: any;
        fsAttributes: any;
        onGleamEvent: any;
        Webflow: any[];
    }
}

export {};
