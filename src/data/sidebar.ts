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

export type PodcastArticle = {
    title: string;
    slug: string;
    subItems: WikiSubItem[];
};

export type Article = {
    name: string;
    slug: string;
    wikiTag?: string;
    smartSearchKeywords?: string[];
};

export const wikiItems: WikiItem[] = [
    {
        title: "Hiring & Managing",
        slug: "hiring-and-managing-execs",
        subItems: [
            {
                type: "heading",
                displayTitle: "The CEO's Job",
                title: "Defining the CEO’s Job",
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
                                type: "heading",
                                displayTitle: "Benchling",
                                title: "Benchling: VP of Engineering",
                            },
                            {
                                type: "heading",
                                displayTitle: "Faire",
                                title: "Faire: VP of Engineering",
                            },
                        ],
                    },
                    {
                        type: "heading",
                        displayTitle: "Head of Sales",
                        title: "Head of Sales",
                        subItems: [
                            {
                                type: "heading",
                                displayTitle: "Ironclad",
                                title: "Ironclad: VP of Sales",
                            },
                        ],
                    },
                    {
                        type: "heading",
                        displayTitle: "Head of Product",
                        title: "Head of Product",
                        subItems: [
                            {
                                type: "heading",
                                displayTitle: "Brex",
                                title: "Brex: Chief Product Officer",
                            },
                            {
                                type: "heading",
                                displayTitle: "Webflow",
                                title: "Webflow: Chief Product Officer",
                            },
                        ],
                    },
                    {
                        type: "heading",
                        displayTitle: "Head of Finance",
                        title: "Head of Finance",
                        subItems: [
                            {
                                type: "heading",
                                displayTitle: "First Head of Finance",
                                title: "What to look for in your first Head of Finance hire?",
                            },
                            {
                                type: "heading",
                                displayTitle: "Scale AI",
                                title: "Scale AI",
                            },
                        ],
                    },
                    {
                        type: "heading",
                        displayTitle: "Leadership Hires",
                        title: "Leadership Hires",
                        subItems: [
                            {
                                type: "heading",
                                displayTitle: "Scale",
                                title: "‍‍Scale's Executive Hiring Criteria",
                            },
                            {
                                type: "heading",
                                displayTitle: "DoorDash",
                                title: "Tony Xu's Criteria for A+ Executives",
                            },
                            {
                                type: "heading",
                                displayTitle: "Gusto",
                                title: "What does Joshua Reeves (CEO of Gusto) look for when hiring leaders?",
                            },
                            {
                                type: "heading",
                                displayTitle: "Generic",
                                title: "Generic Executive Interview",
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
                        type: "heading",
                        displayTitle: "Gusto",
                        title: "Gusto: Driving Alignment",
                    },
                    {
                        type: "heading",
                        displayTitle: "Twitch",
                        title: "Twitch: How to Write a Monthly Report",
                    },
                    {
                        type: "heading",
                        displayTitle: "Brex",
                        title: "Brex: Monthly Email to the Board",
                    },
                    {
                        type: "heading",
                        displayTitle: "Whatnot",
                        title: "Whatnot: Mission, Outcomes, Competencies",
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
                        type: "heading",
                        displayTitle: "Gusto",
                        title: "Gusto",
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
                        type: "heading",
                        displayTitle: "Faire: VP of Engineering",
                        title: "Faire: VP of Engineering",
                    },
                    {
                        type: "heading",
                        displayTitle: "Benchling: VP of Engineering",
                        title: "Benchling: VP of Engineering",
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
                        type: "heading",
                        displayTitle: "Expectation Setting",
                        title: "Example Documents: Training and Expectation Setting",
                    },
                ],
            },
            {
                type: "heading",
                displayTitle: "Communicating Expectations",
                title: "2. Clearly communicate expectations and assess performance.",
                subItems: [
                    {
                        type: "heading",
                        displayTitle: "Performance Reviews",
                        title: "Examples: Performance and Feedback",
                    },
                ],
            },
            {
                type: "heading",
                displayTitle: "Career Development",
                title: "3. Establish a framework for promotions and career development",
                subItems: [
                    {
                        type: "heading",
                        displayTitle: "Levels & Career Development",
                        title: "Levels, Ladders, and Compensation",
                    },
                    {
                        type: "heading",
                        displayTitle: "Promotions",
                        title: "Promotions and Workforce Planning",
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
                        type: "heading",
                        displayTitle: "Compensation Philosophies",
                        title: "Compensation Philosophies",
                    },
                    {
                        type: "heading",
                        displayTitle: "Communicating Equity Value",
                        title: "Communicating Equity Value",
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
                        type: "heading",
                        displayTitle: "Job Descriptions",
                        title: "HR and People Job Descriptions",
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
                        type: "heading",
                        displayTitle: "Checkr",
                        title: "Checkr‍",
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
                name: "Plaid & Replit",
                slug: "plaid-and-replit-on-scaling-engineering",
                wikiTag: "Scaling Engineering",
                smartSearchKeywords: ["CTO", "VP of Engineering", "Technical", "Developers"],
            },
            {
                name: "Lattice & Faire",
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
                name: "Plaid & Rippling",
                slug: "plaid-and-rippling-on-scaling-engineering",
                wikiTag: "Scaling Engineering",
                smartSearchKeywords: ["CTO", "VP of Engineering", "Technical", "Developers"],
            },
            {
                name: "Lattice & Weebly",
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
                name: "Checkr & Rubrik",
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
                name: "Webflow & Whatnot",
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

export const podcastArticles: Article[] = [
    {
        name: "Carvana",
        slug: "conversation-with-ernie-garcia-ceo-of-carvana",
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
        name: "Rappi",
        slug: "episode-2-rappi",
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
            "Org Structure",
            "Scaling Teams",
            "Hiring",
            "Managing",
            "Leveling",
            "Compensation",
        ],
    },
    {
        name: "Monzo",
        slug: "episode-3-monzo",
        wikiTag: "Operating Cadence, Hiring and Managing Leaders",
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
        name: "a16z & DST",
        slug: "episode-4-a16z-dst",
        wikiTag: "Financial Planning and Fundraising",
        smartSearchKeywords: ["Fundraising", "VC", "Investors"],
    },
];

export const DROPDOWN_TIERS = [
    {
        tier: 1,
        textSelector: "[avra-element='wiki-section-title-text']",
        childSelector: "[avra-element='wiki-section-item']",
        containerAttribute: "wiki-section-title",
    },
    {
        tier: 2,
        textSelector: "[avra-element='wiki-section-item-text']",
        childSelector: "[avra-element='wiki-insight-item']",
        containerAttribute: "wiki-section-item",
    },
    {
        tier: 3,
        textSelector: "[avra-element='wiki-insight-item-text']",
        childSelector: "[avra-element='wiki-insight-heading-item']",
        containerAttribute: "wiki-insight-item",
    },
    {
        tier: 4,
        textSelector: "[avra-element='wiki-insight-heading-item-text']",
        childSelector: "[avra-element='wiki-insight-heading-item-2']",
        containerAttribute: "wiki-insight-heading-item",
    },
];
