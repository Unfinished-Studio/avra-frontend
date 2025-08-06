export type WikiSubItem = {
    type: "heading" | "item";

    // text displayed on the sidebar
    displayTitle: string;

    // (type = heading) the exact text to search for in the article
    // (type = item) the slug for the linked article
    title: string;

    subItems?: WikiSubItem[];
};
export type WikiItem = {
    title: string;
    slug: string;
    subItems: WikiSubItem[];
};

export type SessionInsightItem = {
    name: string;
    slug: string;
    wikiTag?: string;
    smartSearchKeywords?: string[];
};
export type SessionInsightsBatch = {
    title: string;
    sessionInsights: SessionInsightItem[];
};

export const wikiItems: WikiItem[] = [
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
                        type: "item",
                        displayTitle: "Chief of Staff",
                        title: "/case-studies/chief-of-staff",
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
                title: "1. Mission",
            },
            {
                type: "heading",
                displayTitle: "Strategy",
                title: "2. Strategy",
            },
            {
                type: "heading",
                displayTitle: "Metrics",
                title: "3. Metrics",
            },
            {
                type: "heading",
                displayTitle: "Communicating MSM",
                title: "4. Communicating your mission, strategy, and key metrics",
                subItems: [
                    {
                        type: "heading",
                        displayTitle: "Whatnot",
                        title: "5. Example I: Whatnot's Mission-to-Metrics",
                    },
                    {
                        type: "heading",
                        displayTitle: "Segment",
                        title: "5. Example II: Segment’s 100 Week Plan",
                    },
                ],
            },
            {
                type: "heading",
                displayTitle: "Case Studies",
                title: "6. Case Studies",
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
                title: "I. Onboarding and Managing Senior Executives",
                subItems: [
                    {
                        type: "heading",
                        displayTitle: "Onboarding Execs",
                        title: "Onboarding Executives",
                    },
                    {
                        type: "heading",
                        displayTitle: "Aligning Execs",
                        title: "Delegating and Aligning with Executives",
                    },
                    {
                        type: "heading",
                        displayTitle: "Evaluating Performance",
                        title: "Evaluating Executive Performance",
                    },
                    {
                        type: "heading",
                        displayTitle: "Firing Execs",
                        title: "Firing an Executive",
                    },
                ],
            },
            {
                type: "heading",
                displayTitle: "Hiring a COO",
                title: "II. Hiring a Chief Operating Officer (COO)",
                subItems: [
                    {
                        type: "heading",
                        displayTitle: "When to Hire",
                        title: "When to Hire a COO",
                    },
                    {
                        type: "heading",
                        displayTitle: "Interviewing",
                        title: "Interviewing a COO",
                    },
                    {
                        type: "heading",
                        displayTitle: "Interview Tactics",
                        title: "Tactics for Interviewing COOs",
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
                title: "I. Scaling Company Culture & Operating Cadence",
                subItems: [
                    {
                        type: "heading",
                        displayTitle: "Staying Customer Centric",
                        title: "Examples: Tactics to move fast and maintain customer centricity",
                    },
                ],
            },
            {
                type: "heading",
                displayTitle: "Where to Spend Time",
                title: "II. Where should you spend your time?",
                subItems: [
                    {
                        type: "heading",
                        displayTitle: "Identifying Bottlenecks",
                        title: "identifying-bottlenecks",
                    },
                    {
                        type: "heading",
                        displayTitle: "Building Your Team",
                        title: "Identifying bottlenecks and making sure the company is set up to deal with them.",
                    },
                    {
                        type: "heading",
                        displayTitle: "Communicating at Scale",
                        title: "Examples: Tactics for communicating at scale",
                    },
                    {
                        type: "heading",
                        displayTitle: "Auditing Team Health",
                        title: "Auditing function/team health.",
                    },
                    {
                        type: "heading",
                        displayTitle: "Stay Close to Customers",
                        title: "Staying close to customers.",
                    },
                ],
            },
            {
                type: "heading",
                displayTitle: "Assessing Performance",
                title: "III. Assessing Your Performance",
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
                title: "I. Maintaining engineering velocity as you scale",
                subItems: [
                    {
                        type: "heading",
                        displayTitle: "Hiring",
                        title: "1. Hire the best engineers",
                    },
                    {
                        type: "heading",
                        displayTitle: "Building a Foundation",
                        title: "2. Build a solid long-term foundation from day one",
                    },
                    {
                        type: "heading",
                        displayTitle: "Tracking Metrics",
                        title: "3. Track metrics to drive decision-making",
                    },
                    {
                        type: "heading",
                        displayTitle: "Small and Independent Teams",
                        title: "4. Keep teams small and independent",
                    },
                ],
            },
            {
                type: "heading",
                displayTitle: "Recruiting Brand",
                title: "II. Building an engineering recruiting brand",
            },
            {
                type: "heading",
                displayTitle: "Recruiting Machine",
                title: "III. Building an engineering recruiting machine",
            },
            {
                type: "heading",
                displayTitle: "Standardizing Recruiting",
                title: "2. Standardize your process and train interviewers",
            },
            {
                type: "heading",
                displayTitle: "Recruiting is Everyone's Job",
                title: "3. Make recruiting part of everyone’s job",
            },
            {
                type: "heading",
                displayTitle: "Recruiting Team",
                title: "4. Recruiting team",
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
                title: "1. Develop an effective team of people managers.",
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
                title: "2. Clearly communicate expectations and assess performance.",
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
                title: "3. Establish a framework for promotions and career development",
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
                title: "4. Establish a compensation model that rewards and retains talent",
                subItems: [
                    {
                        type: "heading",
                        displayTitle: "General Comp Principles",
                        title: "General Compensation Principles",
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
                title: "5. Empower a stellar people team to support you",
                subItems: [
                    {
                        type: "heading",
                        displayTitle: "Head of People",
                        title: "When selecting a Head of People, look for:",
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
                        title: "Accounting and Controllership",
                    },
                    {
                        type: "heading",
                        displayTitle: "FP&A",
                        title: "FP&A and Strategic Finance",
                    },
                    {
                        type: "heading",
                        displayTitle: "Biz Ops",
                        title: "Biz Ops",
                    },
                    {
                        type: "heading",
                        displayTitle: "Team Structure",
                        title: "Example: Finance Team Structure",
                    },
                ],
            },
            {
                type: "heading",
                displayTitle: "First Head of Finance",
                title: "Hiring your first Head of Finance",
                subItems: [
                    {
                        type: "heading",
                        displayTitle: "What to Look For",
                        title: "What to Look for in a Head of Finance",
                    },
                    {
                        type: "heading",
                        displayTitle: "Examples",
                        title: "First Head of Finance Examples",
                    },
                    {
                        type: "heading",
                        displayTitle: "Testing a Head of Finance",
                        title: "How to Test a Head of Finance",
                    },
                ],
            },
            {
                type: "heading",
                displayTitle: "Financial Planning",
                title: "Scaling Financial Planning",
                subItems: [
                    {
                        type: "heading",
                        displayTitle: "Evolution",
                        title: "The Evolution of Financial Planning",
                    },
                    {
                        type: "heading",
                        displayTitle: "Best Practices",
                        title: "Financial Planning Best Practices",
                    },
                ],
            },
            {
                type: "heading",
                displayTitle: "Growth Capital",
                title: "Raising Growth Capital",
                subItems: [
                    {
                        type: "heading",
                        displayTitle: "Non-negotiables",
                        title: "Growth fundraising non-negotiables",
                    },
                    {
                        type: "heading",
                        displayTitle: "Investor Diligencing",
                        title: "Growth Investor Diligence Process",
                    },
                    {
                        type: "heading",
                        displayTitle: "Faire Series C",
                        title: "Example: Faire Series C - Diligence",
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

export const sessionInsightsBatches: SessionInsightsBatch[] = [
    {
        title: "Batch 2",
        sessionInsights: [
            {
                name: "Brex & Webflow",
                slug: "2024marchhiring-managingexecutives-batch2-webflow-brex",
                wikiTag: "Hiring and Managing Leaders",
                smartSearchKeywords: [
                    "Hiring Executives",
                    "Leadership",
                    "Recruiting",
                    "Team Building",
                    "Executive Search",
                    "Management",
                    "Onboarding",
                    "Talent",
                    "Promotions",
                    "Firing",
                    "Org Design",
                    "Headcount",
                    "Talent",
                    "Org Structure",
                    "Scaling Teams",
                    "Hiring",
                    "Managing",
                    "Leveling",
                    "Compensation",
                ],
            },
            {
                name: "Whatnot & Segment",
                slug: "whatnot-segment-on-mission-strategy-and-metrics",
                wikiTag: "Mission, Strategy, and Metrics",
                smartSearchKeywords: [
                    "Mission",
                    "Vision",
                    "North Star",
                    "KPIs",
                    "Goals",
                    "Prioritization",
                    "Long-Term Planning",
                    "Alignment",
                ],
            },
            {
                name: "Claire Hughes Johnson (Stripe)",
                slug: "claire-hughes-johnson-on-leading-leaders",
                wikiTag: "Leading Leaders",
                smartSearchKeywords: [
                    "Hiring Executives",
                    "Leadership",
                    "Recruiting",
                    "Team Building",
                    "Executive Search",
                    "Management",
                    "Onboarding",
                    "Talent",
                    "Promotions",
                    "Firing",
                    "Org Design",
                    "Headcount",
                    "Talent",
                    "Org Structure",
                    "Scaling Teams",
                    "Hiring",
                    "Managing",
                    "Leveling",
                    "Compensation",
                ],
            },
            {
                name: "Alex Bouaziz (Deel)",
                slug: "alex-bouaziz-on-operating-cadence",
                wikiTag: "Operating Cadence",
                smartSearchKeywords: [
                    "Operating",
                    "Scaling",
                    "Meetings",
                    "OKRs",
                    "Goals",
                    "Planning",
                    "Metrics",
                    "Business Reviews",
                    "Execution",
                    "Strategic Planning",
                ],
            },
            {
                name: "Shishir Mehrotra (Coda)",
                slug: "shishir-mehrotra-on-product-cadence",
                wikiTag: "Operating Cadence",
                smartSearchKeywords: [
                    "Operating",
                    "Scaling",
                    "Meetings",
                    "OKRs",
                    "Goals",
                    "Planning",
                    "Metrics",
                    "Business Reviews",
                    "Execution",
                    "Strategic Planning",
                ],
            },
            {
                name: "Plaid and Replit",
                slug: "plaid-and-replit-on-scaling-engineering",
                wikiTag: "Scaling Engineering",
                smartSearchKeywords: ["CTO", "VP of Engineering", "Technical", "Developers"],
            },
            {
                name: "Lattice and Faire",
                slug: "lattice-and-faire-on-scaling-people",
                wikiTag: "Scaling People",
                smartSearchKeywords: [
                    "Org Design",
                    "Headcount",
                    "Talent",
                    "Org Structure",
                    "Scaling Teams",
                    "Hiring",
                    "Managing",
                    "Leveling",
                    "Compensation",
                ],
            },
            {
                name: "Prabir Adarkar (DoorDash)",
                slug: "doordash-on-scaling-finance",
                wikiTag: "Financial Planning and Fundraising",
                smartSearchKeywords: ["Finance", "CFO", "Fundraising", "Budgeting", "Runway", "Burn", "Forecasting", "Revenue"],
            },
        ],
    },
    {
        title: "Batch 3",
        sessionInsights: [
            {
                name: "Benchling & Brex",
                slug: "benchling-and-brex-on-hiring-managing-execs",
                wikiTag: "Hiring and Managing Leaders",
                smartSearchKeywords: [
                    "Hiring Executives",
                    "Leadership",
                    "Recruiting",
                    "Team Building",
                    "Executive Search",
                    "Management",
                    "Onboarding",
                    "Talent",
                    "Promotions",
                    "Firing",
                    "Org Design",
                    "Headcount",
                    "Talent",
                    "Org Structure",
                    "Scaling Teams",
                    "Hiring",
                    "Managing",
                    "Leveling",
                    "Compensation",
                ],
            },
            {
                name: "Ali Ghodsi (Databricks)",
                slug: "ali-ghodsi-on-leadership",
                wikiTag: "Hiring and Managing Leaders",
                smartSearchKeywords: [
                    "Hiring Executives",
                    "Leadership",
                    "Recruiting",
                    "Team Building",
                    "Executive Search",
                    "Management",
                    "Onboarding",
                    "Talent",
                    "Promotions",
                    "Firing",
                    "Org Design",
                    "Headcount",
                    "Talent",
                    "Org Structure",
                    "Scaling Teams",
                    "Hiring",
                    "Managing",
                    "Leveling",
                    "Compensation",
                ],
            },
            {
                name: "Athelas & Zip",
                slug: "athelas-and-zip-on-mission-strategy-and-metrics",
                wikiTag: "Mission, Strategy, and Metrics",
                smartSearchKeywords: [
                    "Mission",
                    "Vision",
                    "North Star",
                    "KPIs",
                    "Goals",
                    "Prioritization",
                    "Long-Term Planning",
                    "Alignment",
                ],
            },
            {
                name: "Lexi Reese (Gusto)",
                slug: "lexi-reese-on-leading-leaders",
                wikiTag: "Leading Leaders",
                smartSearchKeywords: [
                    "Hiring Executives",
                    "Leadership",
                    "Recruiting",
                    "Team Building",
                    "Executive Search",
                    "Management",
                    "Onboarding",
                    "Talent",
                    "Promotions",
                    "Firing",
                    "Org Design",
                    "Headcount",
                    "Talent",
                    "Org Structure",
                    "Scaling Teams",
                    "Hiring",
                    "Managing",
                    "Leveling",
                    "Compensation",
                ],
            },
            {
                name: "Tony Xu (DoorDash)",
                slug: "tony-xu-on-hiring-and-operating-cadence",
                wikiTag: "Operating Cadence",
                smartSearchKeywords: [
                    "Operating",
                    "Scaling",
                    "Meetings",
                    "OKRs",
                    "Goals",
                    "Planning",
                    "Metrics",
                    "Business Reviews",
                    "Execution",
                    "Strategic Planning",
                ],
            },
            {
                name: "Plaid and Rippling",
                slug: "plaid-and-rippling-on-scaling-engineering",
                wikiTag: "Scaling Engineering",
                smartSearchKeywords: ["CTO", "VP of Engineering", "Technical", "Developers"],
            },
            {
                name: "Lattice and Weebly",
                slug: "lattice-and-weebly-on-scaling-people",
                wikiTag: "Scaling People",
                smartSearchKeywords: [
                    "Org Design",
                    "Headcount",
                    "Talent",
                    "Org Structure",
                    "Scaling Teams",
                    "Hiring",
                    "Managing",
                    "Leveling",
                    "Compensation",
                ],
            },
            {
                name: "Dylan Field (Figma)",
                slug: "dylan-field-on-scaling-as-a-ceo",
                wikiTag: "Operating Cadence",
                smartSearchKeywords: [
                    "Operating",
                    "Scaling",
                    "Meetings",
                    "OKRs",
                    "Goals",
                    "Planning",
                    "Metrics",
                    "Business Reviews",
                    "Execution",
                    "Strategic Planning",
                ],
            },
            {
                name: "Checkr and Rubrik",
                slug: "checkr-and-rubrik-on-financial-planning",
                wikiTag: "Financial Planning and Fundraising",
                smartSearchKeywords: ["Finance", "CFO", "Fundraising", "Budgeting", "Runway", "Burn", "Forecasting", "Revenue"],
            },
        ],
    },
    {
        title: "Batch 4",
        sessionInsights: [
            {
                name: "Webflow and Whatnot",
                slug: "webflow-and-whatnot-on-hiring-managing-leaders",
                wikiTag: "Hiring and Managing Leaders",
                smartSearchKeywords: [
                    "Hiring Executives",
                    "Leadership",
                    "Recruiting",
                    "Team Building",
                    "Executive Search",
                    "Management",
                    "Onboarding",
                    "Talent",
                    "Promotions",
                    "Firing",
                    "Org Design",
                    "Headcount",
                    "Talent",
                    "Org Structure",
                    "Scaling Teams",
                    "Hiring",
                    "Managing",
                    "Leveling",
                    "Compensation",
                ],
            },
            {
                name: "Applied Intuition & Brex",
                slug: "applied-intuition-and-brex-on-mission-strategy-and-metrics",
                wikiTag: "Mission, Strategy, and Metrics",
                smartSearchKeywords: [
                    "Mission",
                    "Vision",
                    "North Star",
                    "KPIs",
                    "Goals",
                    "Prioritization",
                    "Long-Term Planning",
                    "Alignment",
                ],
            },
            {
                name: "Parker Conrad (Rippling)",
                slug: "rippling-on-leading-leaders",
                wikiTag: "Leading Leaders",
                smartSearchKeywords: [
                    "Hiring Executives",
                    "Leadership",
                    "Recruiting",
                    "Team Building",
                    "Executive Search",
                    "Management",
                    "Onboarding",
                    "Talent",
                    "Promotions",
                    "Firing",
                    "Org Design",
                    "Headcount",
                    "Talent",
                    "Org Structure",
                    "Scaling Teams",
                    "Hiring",
                    "Managing",
                    "Leveling",
                    "Compensation",
                ],
            },
            {
                name: "Jeff Lawson (Twilio)",
                slug: "twilio-on-shipping-fast",
                wikiTag: "Operating Cadence",
                smartSearchKeywords: [
                    "Operating",
                    "Scaling",
                    "Meetings",
                    "OKRs",
                    "Goals",
                    "Planning",
                    "Metrics",
                    "Business Reviews",
                    "Execution",
                    "Strategic Planning",
                ],
            },
            {
                name: "Faire & Segment",
                slug: "faire-and-segment-on-scaling-engineering",
                wikiTag: "Scaling Engineering",
                smartSearchKeywords: ["CTO", "VP of Engineering", "Technical", "Developers"],
            },
            {
                name: "Claire Hughes Johnson (Stripe)",
                slug: "stripe-on-scaling-people",
                wikiTag: "Scaling People",
                smartSearchKeywords: [
                    "Hiring Executives",
                    "Leadership",
                    "Recruiting",
                    "Team Building",
                    "Executive Search",
                    "Management",
                    "Onboarding",
                    "Talent",
                    "Promotions",
                    "Firing",
                    "Org Design",
                    "Headcount",
                    "Talent",
                    "Org Structure",
                    "Scaling Teams",
                    "Hiring",
                    "Managing",
                    "Leveling",
                    "Compensation",
                ],
            },
            {
                name: "Ravi Inukonda (DoorDash)",
                slug: "ravi-on-strategic-planning",
                wikiTag: "Operating Cadence, Financial Planning and Fundraising",
                smartSearchKeywords: [
                    "Operating",
                    "Scaling",
                    "Meetings",
                    "OKRs",
                    "Goals",
                    "Planning",
                    "Metrics",
                    "Business Reviews",
                    "Execution",
                    "Strategic Planning",
                    "Finance",
                    "CFO",
                    "Fundraising",
                    "Budgeting",
                    "Runway",
                    "Burn",
                    "Forecasting",
                    "Revenue",
                ],
            },
            {
                name: "Nikesh Arora (Palo Alto Networks)",
                slug: "nikesh-on-scaling-as-a-ceo",
                wikiTag: "Operating Cadence",
                smartSearchKeywords: [
                    "Operating",
                    "Scaling",
                    "Meetings",
                    "OKRs",
                    "Goals",
                    "Planning",
                    "Metrics",
                    "Business Reviews",
                    "Execution",
                    "Strategic Planning",
                ],
            },
        ],
    },
    {
        title: "Alumni Sessions",
        sessionInsights: [
            {
                name: "Bill Magnuson (Braze)",
                slug: "bill-magnusons-lessons-from-scaling-braze",
            },
            {
                name: "Dev Ittycheria (MongoDB)",
                slug: "scaling-b2b-gtm",
            },
            {
                name: "Greg Schott (Mulesoft)",
                slug: "scaling-enterprise-gtm",
            },
            {
                name: "Bipul Sinha (Rubrik)",
                slug: "bipul-sinha-rubrik-on-ceo-scaling",
            },
            {
                name: "Arvind Jain (Glean)",
                slug: "utilizing-ai-in-your-company",
            },
            {
                name: "Matt Botvinick (DeepMind)",
                slug: "the-history-state-of-ai",
            },
        ],
    },
];
