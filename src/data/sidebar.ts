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
    {
        title: "Mission, Strategy, Metrics",
        slug: "mission-strategy-and-metrics",
        subItems: [
            {
                type: "heading",
                displayTitle: "Mission",
                title: "Mission",
            },
            {
                type: "heading",
                displayTitle: "Strategy",
                title: "Strategy",
            },
            {
                type: "heading",
                displayTitle: "Metrics",
                title: "Metrics",
            },
            {
                type: "heading",
                displayTitle: "Communicating MSM",
                title: "Communicating MSM",
                subItems: [
                    {
                        type: "heading",
                        displayTitle: "Whatnot",
                        title: "/case-studies/whatnot",
                    },
                    {
                        type: "heading",
                        displayTitle: "Segment",
                        title: "/case-studies/segment",
                    },
                ],
            },
            {
                type: "heading",
                displayTitle: "Case Studies",
                title: "Case Studies",
                subItems: [
                    {
                        type: "item",
                        displayTitle: "Gusto",
                        title: "/case-studies/alignment-metrics",
                    },
                    {
                        type: "item",
                        displayTitle: "Twitch",
                        title: "/case-studies/twitch-monthly-business-review",
                    },
                    {
                        type: "item",
                        displayTitle: "Brex",
                        title: "/case-studies/brex-monthly-email-to-the-board",
                    },
                    {
                        type: "item",
                        displayTitle: "Whatnot",
                        title: "/case-studies/whatnot-mission-outcomes-competencies",
                    },
                ],
            },
        ],
    },
    {
        title: "Leading Leaders",
        slug: "leading-leaders",
        subItems: [
            {
                type: "heading",
                displayTitle: "Senior Executives",
                title: "Senior Executives",
                subItems: [
                    {
                        type: "heading",
                        displayTitle: "Onboarding Execs",
                        title: "onboarding-execs",
                    },
                    {
                        type: "heading",
                        displayTitle: "Aligning Execs",
                        title: "aligning-execs",
                    },
                    {
                        type: "heading",
                        displayTitle: "Evaluating Performance",
                        title: "evaluating-performance",
                    },
                    {
                        type: "heading",
                        displayTitle: "Firing Execs",
                        title: "firing-execs",
                    },
                ],
            },
            {
                type: "heading",
                displayTitle: "Hiring a COO",
                title: "Hiring a COO",
                subItems: [
                    {
                        type: "heading",
                        displayTitle: "When to Hire",
                        title: "when-to-hire",
                    },
                    {
                        type: "heading",
                        displayTitle: "Interviewing",
                        title: "interviewing",
                    },
                    {
                        type: "heading",
                        displayTitle: "Interview Tactics",
                        title: "interview-tactics",
                    },
                ],
            },
            {
                type: "heading",
                displayTitle: "Case Studies",
                title: "Case Studies",
                subItems: [
                    {
                        type: "item",
                        displayTitle: "Gusto",
                        title: "/case-studies/building-high-performing-teams",
                    },
                ],
            },
        ],
    },
    {
        title: "Operating Cadence",
        slug: "operating-cadence",
        subItems: [
            {
                type: "heading",
                displayTitle: "Scaling Company Culture",
                title: "Scaling Company Culture",
                subItems: [
                    {
                        type: "heading",
                        displayTitle: "Staying Customer Centric",
                        title: "staying-customer-centric",
                    },
                ],
            },
            {
                type: "heading",
                displayTitle: "Where to Spend Time",
                title: "Where to Spend Time",
                subItems: [
                    {
                        type: "heading",
                        displayTitle: "Identifying Bottlenecks",
                        title: "identifying-bottlenecks",
                    },
                    {
                        type: "heading",
                        displayTitle: "Building Your Team",
                        title: "building-your-team",
                    },
                    {
                        type: "heading",
                        displayTitle: "Communicating at Scale",
                        title: "communicating-at-scale",
                    },
                    {
                        type: "heading",
                        displayTitle: "Auditing Team Health",
                        title: "auditing-team-health",
                    },
                    {
                        type: "heading",
                        displayTitle: "Stay Close to Customers",
                        title: "stay-close-to-customers",
                    },
                ],
            },
            {
                type: "heading",
                displayTitle: "Assessing Performance",
                title: "Assessing Performance",
            },
        ],
    },
    {
        title: "Scaling Engineering",
        slug: "scaling-engineering",
        subItems: [
            {
                type: "heading",
                displayTitle: "Maintaining Velocity",
                title: "Maintaining Velocity",
                subItems: [
                    {
                        type: "heading",
                        displayTitle: "Hiring",
                        title: "hiring",
                    },
                    {
                        type: "heading",
                        displayTitle: "Building a Foundation",
                        title: "building-a-foundation",
                    },
                    {
                        type: "heading",
                        displayTitle: "Tracking Metrics",
                        title: "tracking-metrics",
                    },
                    {
                        type: "heading",
                        displayTitle: "Small and Independent Teams",
                        title: "small-and-independent-teams",
                    },
                ],
            },
            {
                type: "heading",
                displayTitle: "Recruiting Brand",
                title: "Recruiting Brand",
            },
            {
                type: "heading",
                displayTitle: "Recruiting Machine",
                title: "Recruiting Machine",
            },
            {
                type: "heading",
                displayTitle: "Standardizing Recruiting",
                title: "Standardizing Recruiting",
            },
            {
                type: "heading",
                displayTitle: "Recruiting is Everyone's Job",
                title: "Recruiting is Everyone's Job",
            },
            {
                type: "heading",
                displayTitle: "Recruiting Team",
                title: "Recruiting Team",
            },
            {
                type: "heading",
                displayTitle: "Case Studies",
                title: "Case Studies",
                subItems: [
                    {
                        type: "item",
                        displayTitle: "Faire: VP of Engineering",
                        title: "/case-studies/faire-vp-of-engineering",
                    },
                    {
                        type: "item",
                        displayTitle: "Benchling: VP of Engineering",
                        title: "/case-studies/benchling-vp-of-engineering",
                    },
                ],
            },
        ],
    },
    {
        title: "Scaling People",
        slug: "scaling-people-culture",
        subItems: [
            {
                type: "heading",
                displayTitle: "People Managers",
                title: "People Managers",
                subItems: [
                    {
                        type: "item",
                        displayTitle: "Expectation Setting",
                        title: "/case-studies/manager-expectation-setting-and-training",
                    },
                ],
            },
            {
                type: "heading",
                displayTitle: "Communicating Expectations",
                title: "Communicating Expectations",
                subItems: [
                    {
                        type: "item",
                        displayTitle: "Performance Reviews",
                        title: "/case-studies/performance-management-examples",
                    },
                ],
            },
            {
                type: "heading",
                displayTitle: "Career Development",
                title: "Career Development",
                subItems: [
                    {
                        type: "item",
                        displayTitle: "Levels & Career Development",
                        title: "/case-studies/levels-and-career-development",
                    },
                    {
                        type: "item",
                        displayTitle: "Promotions",
                        title: "/case-studies/promotions-and-planning",
                    },
                ],
            },
            {
                type: "heading",
                displayTitle: "Compensation Models",
                title: "Compensation Models",
                subItems: [
                    {
                        type: "heading",
                        displayTitle: "General Comp Principles",
                        title: "general-comp-principles",
                    },
                    {
                        type: "item",
                        displayTitle: "Compensation Philosophies",
                        title: "/case-studies/compensation-philosophy",
                    },
                    {
                        type: "item",
                        displayTitle: "Communicating Equity Value",
                        title: "/case-studies/communicating-the-value-of-equity",
                    },
                ],
            },
            {
                type: "heading",
                displayTitle: "Empower Your Team",
                title: "Empower Your Team",
                subItems: [
                    {
                        type: "heading",
                        displayTitle: "Head of People",
                        title: "head-of-people",
                    },
                    {
                        type: "item",
                        displayTitle: "Job Descriptions",
                        title: "/case-studies/sample-job-descriptions",
                    },
                ],
            },
        ],
    },
    {
        title: "Strategic Planning",
        slug: "financial-planning-and-fundraising",
        subItems: [
            {
                type: "heading",
                displayTitle: "The Role of Finance",
                title: "The Role of Finance",
                subItems: [
                    {
                        type: "heading",
                        displayTitle: "Accounting",
                        title: "Accounting",
                    },
                    {
                        type: "heading",
                        displayTitle: "FP&A",
                        title: "FP&A",
                    },
                    {
                        type: "heading",
                        displayTitle: "Biz Ops",
                        title: "Biz Ops",
                    },
                    {
                        type: "heading",
                        displayTitle: "Team Structure",
                        title: "Team Structure",
                    },
                ],
            },
            {
                type: "heading",
                displayTitle: "First Head of Finance",
                title: "First Head of Finance",
                subItems: [
                    {
                        type: "heading",
                        displayTitle: "What to Look For",
                        title: "What to Look For",
                    },
                    {
                        type: "heading",
                        displayTitle: "Examples",
                        title: "Examples",
                    },
                    {
                        type: "heading",
                        displayTitle: "Testing a Head of Finance",
                        title: "Testing a Head of Finance",
                    },
                ],
            },
            {
                type: "heading",
                displayTitle: "Financial Planning",
                title: "Financial Planning",
                subItems: [
                    {
                        type: "heading",
                        displayTitle: "Evolution",
                        title: "Evolution",
                    },
                    {
                        type: "heading",
                        displayTitle: "Best Practices",
                        title: "Best Practices",
                    },
                ],
            },
            {
                type: "heading",
                displayTitle: "Growth Capital",
                title: "Growth Capital",
                subItems: [
                    {
                        type: "heading",
                        displayTitle: "Non-negotiables",
                        title: "Non-negotiables",
                    },
                    {
                        type: "heading",
                        displayTitle: "Investor Diligencing",
                        title: "Investor Diligencing",
                    },
                    {
                        type: "heading",
                        displayTitle: "Faire Series C",
                        title: "Faire Series C",
                    },
                ],
            },
            {
                type: "heading",
                displayTitle: "Case Studies",
                title: "Case Studies",
                subItems: [
                    {
                        type: "item",
                        displayTitle: "Checkr",
                        title: "/case-studies/checkrs-financial-planning-process",
                    },
                ],
            },
        ],
    },
];
