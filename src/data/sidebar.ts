// keys should correspond to wiki tags in CMS
export type WikiSubItem = {
    type: "heading" | "item";
    displayTitle: string; // the text displayed on the sidebar
    // (heading element) the exact text to search for in the article
    // (item element) the slug for the linked article
    title: string;
    subItems?: WikiSubItem[];
};
export type Wikitag = {
    title: string;
    slug: string;
    subItems: WikiSubItem[];
};

export const wikiTags: Wikitag[] = [
    {
        title: "Hiring & Managing",
        slug: "hiring-and-managing-execs",
        subItems: [
            {
                type: "heading",
                displayTitle: "The CEO's Job",
                title: "Defining the CEO's Job",
            },
            {
                type: "heading",
                displayTitle: "Building Leadership",
                title: "Building your Leadership Team",
            },
            {
                type: "heading",
                displayTitle: "Getting Started",
                title: "How do you get started?",
            },
            {
                type: "heading",
                displayTitle: "Case Studies",
                title: "Case Studies",
                subItems: [
                    {
                        type: "heading",
                        displayTitle: "Head of Engineering",
                        title: "Head of Engineering",
                        subItems: [
                            {
                                type: "item",
                                displayTitle: "Benchling",
                                title: "/case-studies/benchling-vp-of-engineering",
                            },
                            {
                                type: "item",
                                displayTitle: "Faire",
                                title: "/case-studies/faire-vp-of-engineering",
                            },
                        ],
                    },
                    {
                        type: "heading",
                        displayTitle: "Head of Sales",
                        title: "Head of Sales",
                        subItems: [
                            {
                                type: "item",
                                displayTitle: "Ironclad",
                                title: "/case-studies/ironclad-vp-of-sales",
                            },
                        ],
                    },
                    {
                        type: "heading",
                        displayTitle: "Head of Product",
                        title: "Head of Product",
                        subItems: [
                            {
                                type: "item",
                                displayTitle: "Brex",
                                title: "/case-studies/brexs-cpo",
                            },
                            {
                                type: "item",
                                displayTitle: "Webflow",
                                title: "/case-studies/webflows-cpo",
                            },
                        ],
                    },
                    {
                        type: "heading",
                        displayTitle: "Head of Finance",
                        title: "Head of Finance",
                        subItems: [
                            {
                                type: "item",
                                displayTitle: "First Head of Finance",
                                title: "/case-studies/first-head-of-finance",
                            },
                            {
                                type: "item",
                                displayTitle: "Scale AI",
                                title: "/case-studies/scale-ai-head-of-finance",
                            },
                        ],
                    },
                    {
                        type: "heading",
                        displayTitle: "Leadership Hires",
                        title: "Leadership Hires",
                        subItems: [
                            {
                                type: "item",
                                displayTitle: "Scale",
                                title: "/case-studies/scale-executives",
                            },
                            {
                                type: "item",
                                displayTitle: "DoorDash",
                                title: "/case-studies/what-does-tony-xu-ceo-of-doordash-look-for-when-hiring-leaders",
                            },
                            {
                                type: "item",
                                displayTitle: "Gusto",
                                title: "/case-studies/joshua-reevess-criteria-for-hiring-leaders",
                            },
                            {
                                type: "item",
                                displayTitle: "Generic",
                                title: "/case-studies/generic-executive-interview-question-bank",
                            },
                        ],
                    },
                    {
                        type: "heading",
                        displayTitle: "Chief of Staff",
                        title: "Considering a Chief of Staff?",
                    },
                ],
            },
            {
                type: "heading",
                displayTitle: "Managing Leaders",
                title: "On Managing Leaders",
            },
            {
                type: "heading",
                displayTitle: "FAQs",
                title: "Frequently Asked Questions",
            },
        ],
    },
];
