export type WikiSession = {
    name: string;
    slug: string;
    batch: number;
};

export const WIKI_SESSION_MAPPINGS: { [key: string]: WikiSession[] } = {
    "hiring-and-managing-execs": [
        {
            name: "Ali Ghodsi on the 5 Ingredients a CEO Needs",
            slug: "ali-ghodsi-on-leadership",
            batch: 3,
        },
        {
            name: "Benchling and Brex on Hiring & Managing Execs",
            slug: "benchling-and-brex-on-hiring-managing-execs",
            batch: 3,
        },
        {
            name: "Brex & Webflow on Hiring & Managing Execs",
            slug: "2024marchhiring-managingexecutives-batch2-webflow-brex",
            batch: 2,
        },
        {
            name: "Webflow and Whatnot on Hiring & Managing Leaders",
            slug: "webflow-and-whatnot-on-hiring-managing-leaders",
            batch: 4,
        },
    ],
    "mission-strategy-and-metrics": [
        {
            name: "Applied Intuition and Brex on Mission, Strategy, and Metrics",
            slug: "applied-intuition-and-brex-on-mission-strategy-and-metrics",
            batch: 4,
        },
        {
            name: "Athelas and Zip on Mission, Strategy, and Metrics",
            slug: "athelas-and-zip-on-mission-strategy-and-metrics",
            batch: 3,
        },
        {
            name: "Whatnot & Segment on Mission, Strategy, and Metrics",
            slug: "whatnot-segment-on-mission-strategy-and-metrics",
            batch: 2,
        },
    ],
    "financial-planning-and-fundraising": [
        {
            name: "Checkr and Rubrik on Strategic Planning",
            slug: "checkr-and-rubrik-on-financial-planning",
            batch: 3,
        },
        {
            name: "DoorDash on Scaling Finance",
            slug: "doordash-on-scaling-finance",
            batch: 2,
        },
    ],
    "leading-leaders": [
        {
            name: "Claire Hughes Johnson on Leading Leaders",
            slug: "claire-hughes-johnson-on-leading-leaders",
            batch: 2,
        },
        {
            name: "Lexi Reese on Leading Leaders",
            slug: "lexi-reese-on-leading-leaders",
            batch: 3,
        },
        {
            name: "Rippling on Leading Leaders",
            slug: "rippling-on-leading-leaders",
            batch: 4,
        },
    ],
    "operating-cadence": [
        {
            name: "Coda on Product Cadence",
            slug: "shishir-mehrotra-on-product-cadence",
            batch: 2,
        },
        {
            name: "Deel on Operating Cadence",
            slug: "alex-bouaziz-on-operating-cadence",
            batch: 2,
        },
        {
            name: "Dylan Field on Scaling as a CEO",
            slug: "dylan-field-on-scaling-as-a-ceo",
            batch: 3,
        },
        {
            name: "Tony Xu on Hiring and Operating Cadence",
            slug: "tony-xu-on-hiring-and-operating-cadence",
            batch: 3,
        },
    ],
    "scaling-people-culture": [
        {
            name: "Lattice and Faire on Scaling People",
            slug: "lattice-and-faire-on-scaling-people",
            batch: 2,
        },
        {
            name: "Lattice and Weebly on Scaling People",
            slug: "lattice-and-weebly-on-scaling-people",
            batch: 3,
        },
    ],
    "scaling-engineering": [
        {
            name: "Plaid and Replit on Scaling Engineering",
            slug: "plaid-and-replit-on-scaling-engineering",
            batch: 2,
        },
        {
            name: "Plaid and Rippling on Scaling Engineering",
            slug: "plaid-and-rippling-on-scaling-engineering",
            batch: 3,
        },
    ],
};
