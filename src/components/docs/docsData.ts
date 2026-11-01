export interface DocArticle {
  id: string
  title: string
  section: string
  description: string
  readTime: string
  badge?: string
  keywords: string[]
  content: {
    lead: string
    sections: {
      heading: string
      body: string[]
      callout?: {
        type: 'tip' | 'info' | 'important' | 'success'
        title: string
        text: string
      }
      bullets?: string[]
      steps?: { title: string; text: string }[]
    }[]
  }
}

export interface DocSection {
  title: string
  articles: string[]
}

export const DOC_SECTIONS: DocSection[] = [
  {
    title: 'Getting Started',
    articles: ['overview', 'quickstart', 'how-it-works'],
  },
  {
    title: 'Core Roles',
    articles: ['for-builders', 'for-organizers', 'for-reviewers'],
  },
  {
    title: 'Escrow & Payouts',
    articles: ['milestone-escrow', 'evidence-and-proof', 'claiming-usdc', 'refunds-and-safety'],
  },
  {
    title: 'Arc Network & USDC',
    articles: ['arc-network', 'network-setup'],
  },
  {
    title: 'Help & FAQ',
    articles: ['faq', 'troubleshooting', 'support'],
  },
]

export const DOC_ARTICLES: Record<string, DocArticle> = {
  overview: {
    id: 'overview',
    title: 'Overview of Fundora',
    section: 'Getting Started',
    description: 'Learn what Fundora is, how reserved USDC escrow works, and why builders and sponsors love it.',
    readTime: '3 min read',
    badge: 'Introduction',
    keywords: ['overview', 'what is fundora', 'introduction', 'basics', 'escrow', 'usdc'],
    content: {
      lead: 'Fundora is a modern microgrants and hackathons platform where funding is locked in verifiable onchain escrow ahead of time, ensuring builders are guaranteed payment the moment their milestones are approved.',
      sections: [
        {
          heading: 'The Problem Fundora Solves',
          body: [
            'Traditional freelance platforms, open-source grants, and hackathons often struggle with trust. Builders put in weeks of intensive work only to face delayed payouts, opaque review panels, or unpaid milestones.',
            'At the same time, grant sponsors and event organizers fear depositing funds into centralized custodians where hidden fees or administrative hold-ups slow down their initiatives.',
            'Fundora bridges this gap with a transparent, self-settling escrow model. Sponsors deposit USDC upfront into a secure escrow vault. Funds cannot be diverted or spent on anything else, and builders pull their earned rewards directly into their own wallets as each milestone is verified.',
          ],
          callout: {
            type: 'info',
            title: 'Simple Guarantee',
            text: 'If a milestone is approved by the assigned reviewers, the funds are instantly released to the builder. No waiting for accounting cycles or manual wire transfers.',
          },
        },
        {
          heading: 'Core Advantages',
          body: [
            'Fundora was created with a clear focus on ease-of-use, fast settlement, and absolute fairness.',
          ],
          bullets: [
            'Guaranteed Upfront Funding: Organizers lock 100% of the milestone or prize pool before submissions open.',
            'Milestone-Driven Progress: Break large grants into manageable phases (e.g. 30% prototype, 40% beta, 30% production launch).',
            'Direct-to-Wallet Claims: You hold the private keys. Approved funds are claimed directly by your wallet in USDC.',
            'Zero Middleman Fees: Fundora does not take a percentage cut from builder prizes or grant deliverables.',
            'Powered by Arc: Built on the Arc network with sub-second finality and transactions paid natively in USDC.',
          ],
        },
        {
          heading: 'Who Uses Fundora?',
          body: [
            'Fundora supports three distinct groups of collaborators:',
          ],
          steps: [
            {
              title: 'Builders & Creators',
              text: 'Developers, designers, researchers, and writers who build software, submit deliverables, and get paid promptly in USDC.',
            },
            {
              title: 'Organizers & Grant Sponsors',
              text: 'Protocols, communities, venture programs, and foundations looking to distribute microgrants or host hackathons with guaranteed escrow.',
            },
            {
              title: 'Reviewers & Judges',
              text: 'Domain experts and community evaluators who review proof-of-work submissions, verify criteria, and approve payouts.',
            },
          ],
        },
      ],
    },
  },

  quickstart: {
    id: 'quickstart',
    title: 'Interactive Quickstart',
    section: 'Getting Started',
    description: 'Get up and running in minutes with live wallet verification, network check, and guided actions.',
    readTime: '2 min read',
    badge: 'Hands-on',
    keywords: ['quickstart', 'connect wallet', 'start', 'guide', 'setup', 'tutorial'],
    content: {
      lead: 'Follow this working step-by-step onboarding guide. You can connect your wallet, check your Arc network connection, and see your live USDC status right inside this page.',
      sections: [
        {
          heading: 'Five Simple Steps to Get Started',
          body: [
            'You do not need prior crypto trading experience or complex setup. All you need is a Web3 wallet (such as MetaMask, Coinbase Wallet, or Rabby) and USDC on Arc to start building or sponsoring.',
          ],
          steps: [
            {
              title: '1. Connect Your Wallet',
              text: 'Click the Connect button in the interactive widget below to link your preferred wallet.',
            },
            {
              title: '2. Check Your Arc Network',
              text: 'Verify you are on Arc Mainnet (Chain ID 5042). Our 1-click switcher handles network configuration and prompts your wallet to switch automatically.',
            },
            {
              title: '3. Verify USDC for Gas & Payments',
              text: 'Arc is unique: USDC is the native gas currency! You never need to purchase volatile tokens just to pay for network transactions.',
            },
            {
              title: '4. Explore Open Grants or Hackathons',
              text: 'Browse the directory to find open bounties and events that match your skills, or create your first grant event as an organizer.',
            },
            {
              title: '5. Submit Proof & Claim USDC',
              text: 'Submit your deliverables, receive reviewer approval, and click Claim to transfer your rewards directly to your wallet.',
            },
          ],
          callout: {
            type: 'tip',
            title: 'Try the Live Widget Below',
            text: 'The widget below detects your active wallet connection in real time and provides one-click actions for every step.',
          },
        },
      ],
    },
  },

  'how-it-works': {
    id: 'how-it-works',
    title: 'How Fundora Works',
    section: 'Getting Started',
    description: 'The end-to-end lifecycle of a grant or hackathon event from initial deposit to final settlement.',
    readTime: '4 min read',
    keywords: ['how it works', 'lifecycle', 'workflow', 'escrow flow', 'payout flow'],
    content: {
      lead: 'Fundora automates milestone verification and financial settlement. Here is how the complete workflow operates from beginning to end.',
      sections: [
        {
          heading: 'The 5-Phase Lifecycle',
          body: [
            'Every grant, hackathon, or bounty follows a transparent 5-phase journey designed to protect all participants equally.',
          ],
          steps: [
            {
              title: 'Phase 1: Creation & Escrow Deposit',
              text: 'The organizer defines event parameters: title, requirements, milestones, deadlines, and reviewer assignments. They approve and deposit the exact prize pool in USDC into the onchain escrow vault.',
            },
            {
              title: 'Phase 2: Applications & Submissions',
              text: 'Builders explore open opportunities, review criteria, and submit their deliverables before the deadline. Submissions include live demo links, repository URLs, documentation, and video walkthroughs.',
            },
            {
              title: 'Phase 3: Deliberation & Review',
              text: 'Assigned reviewers or community judges examine the submitted evidence. Reviewers cast their votes or scores according to the milestone rubric. When the required approval threshold is reached, the milestone is confirmed.',
            },
            {
              title: 'Phase 4: Milestone Release',
              text: 'The onchain escrow moves the approved USDC from the active deposit pool into the builder’s personal claim balance. The funds are now exclusively earmarked for that builder.',
            },
            {
              title: 'Phase 5: Self-Claiming Payout',
              text: 'The builder clicks "Claim" on their dashboard. The USDC moves directly from the escrow vault into their wallet in a single, fast transaction.',
            },
          ],
        },
        {
          heading: 'What Makes This Model Safer?',
          body: [
            'In conventional platforms, builders worry: "Will they actually pay me once I finish?" and sponsors worry: "Will the builder vanish with an advance payment?"',
            'Fundora resolves both concerns simultaneously: the funds are locked upfront so the builder knows the money exists, but the payout is only released once reviewers approve the completed milestone deliverables.',
          ],
          callout: {
            type: 'success',
            title: 'No Frozen Funds',
            text: 'If an event expires with no qualified submissions or a milestone cannot be completed, the organizer can safely reclaim the unspent USDC through our automated refund safeguards.',
          },
        },
      ],
    },
  },

  'for-builders': {
    id: 'for-builders',
    title: 'For Builders & Applicants',
    section: 'Core Roles',
    description: 'Everything you need to know about finding grants, submitting proof, and getting paid.',
    readTime: '3 min read',
    keywords: ['builders', 'applicants', 'developers', 'submissions', 'apply', 'get paid'],
    content: {
      lead: 'Whether you are an independent developer, designer, or team building on Arc, Fundora lets you find funded opportunities and receive guaranteed USDC payouts upon delivery.',
      sections: [
        {
          heading: 'Finding the Right Opportunity',
          body: [
            'Visit the "Explore" or "Grants" directory in the navigation bar to see all active events and microgrants.',
            'Each card displays the total prize pool, active milestone breakdown, deadline countdown, and eligibility requirements.',
            'You can filter by category, skill requirements, or funding size to find tasks that align with your expertise.',
          ],
        },
        {
          heading: 'Submitting Your Milestone Evidence',
          body: [
            'When you are ready to submit your work, navigate to the event page and click "Submit Project" or "Submit Milestone".',
            'Make your submission thorough and easy to evaluate. Include clear proof of delivery:',
          ],
          bullets: [
            'Live Demo or Deployment URL: A working web app, test deployment, or hosted service.',
            'Source Code Repository: Public or accessible GitHub, GitLab, or open-source repository link.',
            'Video Walkthrough: A short 2 to 3-minute Loom or YouTube video demonstrating functionality.',
            'Milestone Summary: A concise explanation of how your submission meets each stated requirement.',
          ],
          callout: {
            type: 'tip',
            title: 'First Impressions Matter',
            text: 'Submissions with a live working link and a quick video demo get reviewed up to 3x faster than text-only submissions.',
          },
        },
        {
          heading: 'Receiving Approvals & Claiming Funds',
          body: [
            'Once submitted, the assigned reviewers will evaluate your proof against the milestone rubric.',
            'You will see the review status change on your participant dashboard. As soon as the required approvals are recorded, your claimable USDC balance updates.',
            'Click the "Claim Payment" button on your dashboard to withdraw your USDC. The funds arrive in your wallet within seconds.',
          ],
        },
      ],
    },
  },

  'for-organizers': {
    id: 'for-organizers',
    title: 'For Organizers & Sponsors',
    section: 'Core Roles',
    description: 'Create milestone-based grants, deposit escrow safely, assign judges, and manage payouts.',
    readTime: '4 min read',
    keywords: ['organizers', 'sponsors', 'create grant', 'hackathon host', 'escrow deposit'],
    content: {
      lead: 'Host transparent competitions, hackathons, and microgrants. Lock prize pools into escrow, assign expert reviewers, and attract top-tier builders to your ecosystem.',
      sections: [
        {
          heading: 'Creating an Event or Grant',
          body: [
            'To create an event, click "Organize" in the navigation bar and launch the event creation wizard.',
            'The wizard guides you through specifying key parameters in plain language:',
          ],
          steps: [
            {
              title: 'Basic Details',
              text: 'Give your grant or hackathon a descriptive title, category, clear summary, and detailed instructions for builders.',
            },
            {
              title: 'Timeline & Milestones',
              text: 'Set submission deadlines and deliberation dates. You can structure the grant as a single lump-sum prize or multiple sequential milestones.',
            },
            {
              title: 'Reviewers & Approval Threshold',
              text: 'Assign wallet addresses of trusted reviewers or judges, and specify how many approvals are required (e.g. 2 out of 3 reviewers).',
            },
            {
              title: 'USDC Escrow Funding',
              text: 'Approve and deposit the exact prize amount. Your funds are locked into the onchain vault, visible to all potential participants.',
            },
          ],
        },
        {
          heading: 'Managing Review & Settlement',
          body: [
            'During the deliberation phase, your assigned reviewers access their dedicated Review Console.',
            'Reviewers score submissions, leave feedback, and vote to approve milestones. The moment approvals reach your designated threshold, the payout queue triggers automatically.',
          ],
          callout: {
            type: 'important',
            title: 'Organizer Refund Guarantee',
            text: 'If an event concludes with unallocated prize money, or if a builder fails to deliver by the agreed deadline, you can safely initiate a refund from the Organizer Console to return unspent USDC to your wallet.',
          },
        },
      ],
    },
  },

  'for-reviewers': {
    id: 'for-reviewers',
    title: 'For Reviewers & Judges',
    section: 'Core Roles',
    description: 'How to evaluate evidence, cast votes, and maintain fair onchain governance.',
    readTime: '3 min read',
    keywords: ['reviewers', 'judges', 'evaluation', 'scoring', 'voting', 'deliberation'],
    content: {
      lead: 'Reviewers are the trusted guardians of quality in Fundora. They verify that submitted deliverables satisfy milestone requirements before funds are released.',
      sections: [
        {
          heading: 'Accessing the Reviewer Workspace',
          body: [
            'When an organizer assigns your wallet as a reviewer, the "Review" option will light up in your Consoles navigation.',
            'Your workspace displays all submissions awaiting evaluation, complete with links to demos, repositories, and documentation.',
          ],
        },
        {
          heading: 'Evaluation Best Practices',
          body: [
            'Reviewers should evaluate each submission objectively based on the criteria specified by the organizer:',
          ],
          bullets: [
            'Functionality: Does the project work as advertised? Can you test the features directly in the demo URL?',
            'Code Quality & Completeness: Is the codebase legitimate, original, and properly structured?',
            'Milestone Alignment: Did the builder address all key items listed for this specific milestone?',
            'Clarity & Documentation: Are setup instructions and usage details provided?',
          ],
          callout: {
            type: 'info',
            title: 'Threshold Consensus',
            text: 'Payouts only release when the minimum required number of reviewer votes is reached. This multi-party consensus prevents unilateral decisions and protects the community.',
          },
        },
        {
          heading: 'Casting Your Decision',
          body: [
            'In the review console, click on any submission to inspect its evidence.',
            'You can cast an "Approve" vote if the work meets standards, or provide actionable feedback for the builder if revisions are necessary.',
            'All review actions are permanently recorded onchain for full transparency.',
          ],
        },
      ],
    },
  },

  'milestone-escrow': {
    id: 'milestone-escrow',
    title: 'Milestone Escrow Explained',
    section: 'Escrow & Payouts',
    description: 'Understand how onchain escrow protects both sides and guarantees payment.',
    readTime: '3 min read',
    keywords: ['milestones', 'escrow', 'trustless', 'vault', 'security', 'deposits'],
    content: {
      lead: 'Fundora’s escrow mechanism replaces verbal promises with programmatic security. Here is how funds are stored and managed.',
      sections: [
        {
          heading: 'Why Escrow Matters',
          body: [
            'In the traditional world, freelancers and grant recipients often spend significant time chasing invoices after completing their work.',
            'With Fundora, the full grant amount is deposited into an onchain escrow vault before work begins. This means the money is already set aside and cannot be spent on other things by the sponsor.',
            'Neither Fundora administrators nor the organizer can unilaterally take back active funds while a builder is actively working on an approved milestone.',
          ],
        },
        {
          heading: 'Phased Milestone Distribution',
          body: [
            'Grants are typically divided into logical milestones. For example:',
          ],
          bullets: [
            'Milestone 1 (30%): Architecture blueprint, UX wireframes, and project scaffolding.',
            'Milestone 2 (40%): Core backend implementation, functional smart contracts, and working demo.',
            'Milestone 3 (30%): Final audit, user documentation, and production launch.',
          ],
          callout: {
            type: 'tip',
            title: 'Continuous Momentum',
            text: 'Breaking work into phases ensures builders receive regular cash flow, while organizers can review incremental progress before the final phase begins.',
          },
        },
      ],
    },
  },

  'evidence-and-proof': {
    id: 'evidence-and-proof',
    title: 'Evidence & Proof Verification',
    section: 'Escrow & Payouts',
    description: 'What counts as valid proof of work and how reviewers verify deliverables.',
    readTime: '3 min read',
    keywords: ['evidence', 'proof of work', 'deliverables', 'verification', 'links'],
    content: {
      lead: 'To trigger a milestone payout, builders provide verifiable evidence of their completed deliverables.',
      sections: [
        {
          heading: 'Acceptable Forms of Evidence',
          body: [
            'Fundora supports flexible delivery proof. Builders can submit any combination of the following:',
          ],
          bullets: [
            'Web URLs: Live product links, Vercel/Netlify preview deployments, or staging environments.',
            'Repository Links: GitHub or GitLab links showing commit history and pull requests.',
            'Decentralized Storage: IPFS hashes or Arweave permanent storage links for decentralized assets.',
            'Media Demonstrations: Video screen recordings (Loom, YouTube) showing user workflows.',
            'Documentation: Notion docs, Google Docs (view-only), or Markdown files detailing architecture and guides.',
          ],
        },
        {
          heading: 'Handling Feedback & Revisions',
          body: [
            'If a reviewer determines that a submission does not fully meet the milestone criteria, they can request revisions.',
            'The builder can update their evidence, upload additional documentation, and notify the reviewers for a second look.',
            'This collaborative back-and-forth ensures high standards while giving builders a fair chance to resolve minor shortcomings.',
          ],
        },
      ],
    },
  },

  'claiming-usdc': {
    id: 'claiming-usdc',
    title: 'Claiming Your USDC',
    section: 'Escrow & Payouts',
    description: 'How to withdraw your earned rewards straight to your personal wallet.',
    readTime: '2 min read',
    keywords: ['claim', 'withdraw', 'pull payment', 'usdc balance', 'payout'],
    content: {
      lead: 'Fundora uses a pull-based payment design. When your milestone is approved, your USDC is queued in the escrow vault and ready for you to claim whenever you wish.',
      sections: [
        {
          heading: 'Why Pull-Based Claims?',
          body: [
            'In automated push payment systems, transfers can fail if a recipient wallet has custom security rules, or the sender’s transaction runs out of gas.',
            'With pull-based claims, funds are safely isolated under your address. You initiate the claim at your convenience, ensuring the transaction always succeeds and arrives directly into your wallet.',
          ],
          callout: {
            type: 'success',
            title: 'Instant Finality',
            text: 'Because Fundora runs on Arc, claim transactions confirm in under one second with microscopic gas fees paid directly in USDC.',
          },
        },
        {
          heading: 'How to Claim in 3 Steps',
          body: [
            'Claiming your funds takes less than 30 seconds:',
          ],
          steps: [
            {
              title: '1. Connect Your Wallet',
              text: 'Ensure you are connected with the wallet address you used to apply for the grant or submit to the competition.',
            },
            {
              title: '2. Check Your Participant Dashboard',
              text: 'Look at the "Available to Claim" banner on your dashboard. It displays the total USDC earned across all approved milestones.',
            },
            {
              title: '3. Click Claim Payment',
              text: 'Confirm the single transaction in your wallet. The USDC transfers immediately into your balance.',
            },
          ],
        },
      ],
    },
  },

  'refunds-and-safety': {
    id: 'refunds-and-safety',
    title: 'Refunds & Safety Guarantees',
    section: 'Escrow & Payouts',
    description: 'How organizers reclaim unallocated capital and how builder rights are safeguarded.',
    readTime: '3 min read',
    keywords: ['refunds', 'safety', 'protections', 'expiry', 'cancellation', 'guarantee'],
    content: {
      lead: 'Fundora includes built-in safeguards to ensure funds never get stuck or abandoned in contract escrow.',
      sections: [
        {
          heading: 'Organizer Capital Protection',
          body: [
            'What happens if an event deadline passes and no submissions were qualified? Or what if a grant ends with leftover funds?',
            'Fundora allows organizers to reclaim unallocated funds once the event deadline or grace period has elapsed. This guarantees that sponsor capital is never lost or trapped in smart contracts.',
          ],
        },
        {
          heading: 'Builder Protection Against Unfair Cancellation',
          body: [
            'Organizers cannot unilaterally cancel a grant or withdraw escrow while a milestone submission is under active review.',
            'Once a builder begins work and submits valid evidence before the deadline, the funds remain locked until the assigned reviewers complete their deliberation.',
            'This two-sided protection creates a balanced, trustworthy environment where both builders and funders can cooperate with complete confidence.',
          ],
        },
      ],
    },
  },

  'arc-network': {
    id: 'arc-network',
    title: 'Why Arc Blockchain?',
    section: 'Arc Network & USDC',
    description: 'Learn why Fundora is built on Arc: sub-second finality and USDC as the native gas token.',
    readTime: '3 min read',
    keywords: ['arc', 'network', 'blockchain', 'speed', 'sub-second', 'finality'],
    content: {
      lead: 'Fundora runs on Arc, Circle’s purpose-built blockchain designed specifically for predictable, money-powered decentralized applications.',
      sections: [
        {
          heading: 'USDC as the Native Gas Token',
          body: [
            'On almost every traditional blockchain (like Ethereum or Polygon), users have to hold a separate volatile token (like ETH or POL) just to pay for network gas.',
            'On Arc, USDC itself is the native gas token. You only ever need USDC to interact with Fundora. This eliminates the confusion of having to buy multiple different cryptocurrencies just to claim a prize or submit an application.',
          ],
          callout: {
            type: 'info',
            title: 'Stable & Predictable Fees',
            text: 'Because gas is priced in USDC rather than a fluctuating market asset, transaction costs remain ultra-low, predictable, and transparent at all times.',
          },
        },
        {
          heading: 'Sub-Second Finality',
          body: [
            'Arc provides sub-second transaction finality. When you create a grant, submit a project, or claim your rewards, your action confirms almost instantly.',
            'There is no waiting minutes for block confirmations or worrying about stuck transactions.',
          ],
        },
      ],
    },
  },

  'network-setup': {
    id: 'network-setup',
    title: 'Network Setup & Addresses',
    section: 'Arc Network & USDC',
    description: 'Chain ID, explorer links, and network settings for Arc.',
    readTime: '2 min read',
    keywords: ['network setup', 'chain id', 'rpc', 'explorer', 'arc', 'mainnet'],
    content: {
      lead: 'Fundora operates on Arc, Circle’s purpose-built blockchain for digital dollar payments and microgrant escrow.',
      sections: [
        {
          heading: 'Arc Network Parameters',
          body: [
            'Arc hosts live community grants, bounties, and hackathon prize pools with guaranteed onchain escrow.',
          ],
          bullets: [
            'Network Name: Arc Mainnet',
            'Chain ID: 5042',
            'Native Currency: USDC (6 decimals)',
            'USDC Address: 0x3600000000000000000000000000000000000000',
            'Explorer URL: https://explorer.mainnet.arc.io',
          ],
          callout: {
            type: 'tip',
            title: 'Automatic Setup in Wallet',
            text: 'You do not need to enter these RPC details manually. When you connect your wallet to Fundora, clicking the network switcher will automatically configure and prompt your wallet to switch to Arc.',
          },
        },
      ],
    },
  },

  faq: {
    id: 'faq',
    title: 'Frequently Asked Questions',
    section: 'Help & FAQ',
    description: 'Common questions and clear answers about using Fundora.',
    readTime: '3 min read',
    keywords: ['faq', 'questions', 'help', 'answers', 'common questions'],
    content: {
      lead: 'Here are answers to the most frequent questions asked by builders, organizers, and sponsors.',
      sections: [
        {
          heading: 'General Questions',
          body: [],
          steps: [
            {
              title: 'Do I need crypto trading experience to use Fundora?',
              text: 'Not at all. You only need a standard Web3 browser wallet (like MetaMask) and USDC. You don’t need to worry about complex trading, slippage, or buying multiple tokens for gas.',
            },
            {
              title: 'Does Fundora take a cut of my grant money?',
              text: 'No. Fundora does not deduct rent or percentage cuts from builder prize money or grant milestone claims. 100% of approved milestone funds go directly to the builder.',
            },
            {
              title: 'What happens if a grant sponsor cancels?',
              text: 'Sponsors cannot cancel grants while milestone deliverables are actively pending review. Once milestone deliverables are approved by reviewers, the payout is irreversible and guaranteed.',
            },
            {
              title: 'Can a team apply together?',
              text: 'Yes! Teams can designate a lead builder wallet for receiving milestone claims or use a multisig address (like Safe) on Arc to manage team funds cooperatively.',
            },
            {
              title: 'How long do claims take to arrive?',
              text: 'Because Arc provides sub-second finality, claims arrive in your wallet in less than two seconds.',
            },
          ],
        },
      ],
    },
  },

  troubleshooting: {
    id: 'troubleshooting',
    title: 'Troubleshooting Guide',
    section: 'Help & FAQ',
    description: 'Quick solutions to common issues when connecting wallets or submitting transactions.',
    readTime: '3 min read',
    keywords: ['troubleshooting', 'errors', 'wrong network', 'help', 'connection issues'],
    content: {
      lead: 'Encountering an unexpected error? Here is how to quickly resolve the most common issues.',
      sections: [
        {
          heading: 'Common Solutions',
          body: [],
          steps: [
            {
              title: '"Wrong Network" or Network Mismatch',
              text: 'If Fundora shows a banner saying you are on the wrong network, click the "Switch to Arc" button in the banner. Your wallet will prompt you to approve switching to Arc.',
            },
            {
              title: 'Transaction Rejected by User',
              text: 'If you accidentally clicked "Reject" or closed your wallet popup, no funds were moved. Simply click the action button again and approve the transaction in your wallet.',
            },
            {
              title: 'Wallet Fails to Connect',
              text: 'Ensure only one primary Web3 wallet extension is enabled at a time (e.g. MetaMask vs Rabby), refresh the browser page, and click Connect Wallet again.',
            },
            {
              title: 'Balance Showing Zero',
              text: 'Verify that your wallet is switched to Arc. On Arc, your balance is denominated natively in USDC.',
            },
          ],
          callout: {
            type: 'tip',
            title: 'Need Further Assistance?',
            text: 'Explore open events and grant submissions directly in the directory with complete transparency on Arc.',
          },
        },
      ],
    },
  },

  support: {
    id: 'support',
    title: 'Support & Help',
    section: 'Help & FAQ',
    description: 'Get direct assistance, report issues, or ask questions about Fundora.',
    readTime: '1 min read',
    badge: 'Contact',
    keywords: ['support', 'contact', 'email', 'help', 'team', 'questions', 'sytherrhere12@gmail.com'],
    content: {
      lead: 'Need help with a grant, event submission, or have a question about Fundora on Arc? We are here to support you directly.',
      sections: [
        {
          heading: 'Direct Email Support',
          body: [
            'If you encounter any issues, need assistance setting up an event, or have questions about milestone payouts and reviews, please contact us directly via email:',
            'Support Email: sytherrhere12@gmail.com',
            'We review all incoming inquiries and typically reply within 24 hours.',
          ],
          callout: {
            type: 'info',
            title: 'Support Channel',
            text: 'You can email sytherrhere12@gmail.com directly for technical support, organizer onboarding, or general inquiries.',
          },
          steps: [
            {
              title: '1. Include Relevant Details',
              text: 'If your inquiry relates to an active event or submission, please include your wallet address or the event title so we can assist promptly.',
            },
            {
              title: '2. Describe Your Question or Issue',
              text: 'Explain what you are trying to accomplish, including screenshots or details if you ran into an unexpected behavior.',
            },
            {
              title: '3. Partnerships & Feedback',
              text: 'Looking to launch a grant round, sponsor an Arc hackathon, or suggest new platform features? Send us an email anytime.',
            },
          ],
        },
      ],
    },
  },
}
