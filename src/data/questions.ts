import type { Difficulty, DomainId, MockModeId, Question } from "../types";

type Topic = {
  topic: string;
  sourceTopic: string;
  correct: string;
  distractors: string[];
  stems: Record<Difficulty, string[]>;
  contexts: string[];
  explanation: string;
};

type QuestionStats = {
  total: number;
  bonus: number;
  byDomain: Record<DomainId, number>;
  byDifficulty: Record<Difficulty, number>;
};

const domainIds: DomainId[] = ["fundamentals", "predictive", "agile", "business"];
const difficulties: Difficulty[] = ["easy", "medium", "hard"];

export const practiceRequiredCounts: Record<DomainId, number> = {
  fundamentals: 864,
  predictive: 408,
  agile: 480,
  business: 648,
};

export const mockDomainCounts: Record<DomainId, number> = {
  fundamentals: 54,
  predictive: 26,
  agile: 30,
  business: 40,
};

export const mockModes: Array<{
  id: MockModeId;
  label: string;
  shortLabel: string;
  level: string;
  summary: string;
  warning: string;
  ratios: Record<Difficulty, number>;
}> = [
  {
    id: "real-case",
    label: "Real Case Scenario",
    shortLabel: "Real Case",
    level: "Official-style mimic",
    summary: "Balanced CAPM-style scenarios that feel close to a serious practice exam.",
    warning: "Best when you want realistic pressure without intentionally brutal traps.",
    ratios: { easy: 0.25, medium: 0.55, hard: 0.2 },
  },
  {
    id: "beyond-real",
    label: "Beyond Real Exam",
    shortLabel: "Beyond Real",
    level: "Harder than official-style",
    summary: "Harder wording, closer distractors, and more blended predictive/agile/business analysis decisions.",
    warning: "Use this when ordinary practice starts feeling comfortable.",
    ratios: { easy: 0.1, medium: 0.45, hard: 0.45 },
  },
  {
    id: "must-fail",
    label: "You Must Fail 💀",
    shortLabel: "Must Fail",
    level: "Maximum difficulty",
    summary: "Extreme multi-concept cases built to expose weak spots before the real appointment.",
    warning: "This one is intentionally harsh. Low scores are useful diagnostic data.",
    ratios: { easy: 0, medium: 0.25, hard: 0.75 },
  },
];

const mockContexts: Record<MockModeId, string[]> = {
  "real-case": [
    "weekly delivery review",
    "sponsor checkpoint",
    "customer handoff meeting",
    "implementation readiness call",
    "project team decision forum",
    "vendor coordination meeting",
  ],
  "beyond-real": [
    "hybrid governance escalation",
    "cross-functional tradeoff workshop",
    "release-risk review board",
    "benefits protection checkpoint",
    "scope and value negotiation",
    "stakeholder conflict review",
  ],
  "must-fail": [
    "high-pressure recovery room",
    "conflicting executive escalation",
    "late-stage delivery crisis",
    "multi-team failure analysis",
    "ambiguous audit challenge",
    "compressed decision window",
  ],
};

const mockPressureLines: Record<MockModeId, Record<Difficulty, string[]>> = {
  "real-case": {
    easy: [
      "The facts are mostly clear, and the team needs the most direct CAPM-aligned response.",
      "A junior project coordinator is asked to identify the best next move without overcomplicating the situation.",
    ],
    medium: [
      "There is normal project ambiguity, but enough evidence exists to choose a disciplined next step.",
      "Stakeholders want movement today, and the team needs a response that protects clarity and value.",
    ],
    hard: [
      "Several reasonable actions are available, but one better fits the role, timing, and governance need.",
      "The team is under delivery pressure, and the best answer must balance stakeholder expectations with project discipline.",
    ],
  },
  "beyond-real": {
    easy: [
      "The wording is intentionally tighter than a normal drill, and the best answer depends on the project principle behind the topic.",
      "Two choices sound useful, but only one preserves the right project-management intent.",
    ],
    medium: [
      "Predictive controls, adaptive feedback, and business-analysis evidence are pulling on the same decision.",
      "The team can act quickly, but a shallow answer would create rework or weak stakeholder alignment.",
    ],
    hard: [
      "The case blends governance, value, uncertainty, and team behavior; close distractors are partly true but incomplete.",
      "A rushed response would satisfy one stakeholder while damaging delivery evidence, learning, or control.",
    ],
  },
  "must-fail": {
    easy: [
      "Even this entry item is wrapped in noisy details, so separate the basic concept from the distraction.",
      "The case hides a simple rule inside pressure, impatience, and tempting shortcuts.",
    ],
    medium: [
      "Every option contains a familiar phrase, but only one survives the timing, ethics, and value test.",
      "The team is receiving mixed signals, and the safest answer must avoid overreacting to the loudest voice.",
    ],
    hard: [
      "This is a trap-heavy scenario: several responses are useful in another context, but wrong for this moment.",
      "The answer must cut through panic, partial evidence, lifecycle confusion, and stakeholder pressure.",
    ],
  },
};

const mockDecisionFrames: Record<MockModeId, string[]> = {
  "real-case": [
    "What should the project team do next?",
    "Which response best fits a realistic CAPM exam case?",
    "What is the strongest next action?",
  ],
  "beyond-real": [
    "Which choice best protects value while respecting governance and delivery flow?",
    "What should be prioritized first to avoid rework and weak alignment?",
    "Which action handles the tradeoff most effectively?",
  ],
  "must-fail": [
    "Which answer remains correct after removing the noise and traps?",
    "What is the least fragile response under CAPM reasoning?",
    "Which option should survive this pressure test?",
  ],
};

const mockOptionTails: Record<MockModeId, string[]> = {
  "real-case": [
    "and make the decision path visible",
    "while keeping the next stakeholder touchpoint clear",
    "with the team aligned on the immediate implication",
    "and confirm how it supports the project outcome",
  ],
  "beyond-real": [
    "after checking the tradeoff across scope, value, and control",
    "while preserving evidence for the next decision",
    "before allowing speed to override the delivery objective",
    "with explicit attention to stakeholder impact and rework risk",
  ],
  "must-fail": [
    "after separating facts, assumptions, and pressure",
    "without rewarding the loudest shortcut in the room",
    "while resisting a partially true but mistimed response",
    "after testing it against value, ethics, and lifecycle fit",
  ],
};

const topics: Record<DomainId, Topic[]> = {
  fundamentals: [
    {
      topic: "Project vs operations",
      sourceTopic: "Project management fundamentals",
      correct: "A temporary effort that creates a unique product, service, or result",
      distractors: ["A repeating operational process", "A permanent department structure", "A routine support checklist"],
      stems: {
        easy: ["Which statement best defines a project?", "What makes work a project rather than operations?"],
        medium: ["A team is asked to launch a one-time customer portal with a defined end date. What is this work best called?"],
        hard: ["A service desk handles daily tickets while also replacing its ticketing tool through a temporary initiative. Which part is the project?"],
      },
      contexts: ["software rollout", "office relocation", "training launch", "new product pilot"],
      explanation: "A project is temporary and creates a unique outcome; ongoing repetitive work is operations.",
    },
    {
      topic: "Program and portfolio alignment",
      sourceTopic: "Project, program, and portfolio concepts",
      correct: "A portfolio groups work to meet strategic objectives",
      distractors: ["A portfolio is only a task checklist", "A portfolio is always one sprint", "A portfolio replaces all project governance"],
      stems: {
        easy: ["What is the purpose of a project portfolio?"],
        medium: ["Leadership wants to compare projects by strategic value and funding fit. Which structure supports that?"],
        hard: ["Several unrelated initiatives compete for budget across the organization. What viewpoint helps leaders balance investment and strategy?"],
      },
      contexts: ["enterprise funding cycle", "public sector modernization", "healthcare transformation", "regional expansion"],
      explanation: "Portfolio management organizes projects and programs around strategic goals and investment decisions.",
    },
    {
      topic: "Value and benefits",
      sourceTopic: "Business value and benefits",
      correct: "The expected business benefit or value the work should create",
      distractors: ["The number of meetings held", "The color of the status report", "The project manager's job title"],
      stems: {
        easy: ["What should project deliverables be connected to?"],
        medium: ["A sponsor asks why a feature still matters after market conditions change. What should be reviewed?"],
        hard: ["A team can deliver all planned outputs, but the expected customer outcome no longer appears valuable. What should guide the next discussion?"],
      },
      contexts: ["customer retention initiative", "automation effort", "compliance dashboard", "mobile service launch"],
      explanation: "Projects should create value, not just outputs. Benefits and outcomes help guide decisions.",
    },
    {
      topic: "Roles and responsibilities",
      sourceTopic: "Stakeholder and team responsibilities",
      correct: "Clarify responsibilities with a role assignment tool such as a RACI matrix",
      distractors: ["Let every stakeholder approve every task", "Wait until conflict appears", "Remove all shared accountability"],
      stems: {
        easy: ["Which action helps clarify who is responsible, accountable, consulted, and informed?"],
        medium: ["Two team members believe they own the same approval step. What should the project manager use?"],
        hard: ["A cross-functional team misses decisions because ownership is unclear across sponsor, BA, and team lead roles. What is the best first correction?"],
      },
      contexts: ["cross-functional rollout", "vendor integration", "data migration", "process improvement project"],
      explanation: "A responsibility assignment matrix makes ownership and communication expectations visible.",
    },
    {
      topic: "Risk and issue thinking",
      sourceTopic: "Risk, issue, assumption, and constraint",
      correct: "A risk is uncertain; an issue has already happened",
      distractors: ["A risk always has no impact", "An issue is only a positive event", "A constraint is the same as a benefit"],
      stems: {
        easy: ["Which distinction between a risk and an issue is correct?"],
        medium: ["A supplier might miss a future delivery date. How should this be logged today?"],
        hard: ["A possible regulation change becomes law during delivery. How should the team update its thinking?"],
      },
      contexts: ["supplier delay", "policy change", "technical dependency", "resource availability"],
      explanation: "Risks are uncertain future events; issues are current problems that need action.",
    },
    {
      topic: "Stakeholder communication",
      sourceTopic: "Communication and stakeholder engagement",
      correct: "Tailor communication to stakeholder needs, influence, and information preferences",
      distractors: ["Send the same detailed report to everyone", "Avoid difficult stakeholders", "Communicate only at project closure"],
      stems: {
        easy: ["What is a good principle for stakeholder communication?"],
        medium: ["A sponsor needs concise decision points while the team needs task detail. What should the project manager do?"],
        hard: ["A stakeholder with high influence is disengaged and receives irrelevant updates. What communication adjustment is most appropriate?"],
      },
      contexts: ["executive steering meeting", "team standup", "client status review", "community rollout"],
      explanation: "Communication should match stakeholder needs, influence, expectations, and decision responsibilities.",
    },
    {
      topic: "Leadership and emotional intelligence",
      sourceTopic: "Leadership, management, and team behavior",
      correct: "Use emotional intelligence to understand concerns and guide constructive action",
      distractors: ["Ignore conflict until the project closes", "Use authority before listening", "Treat every concern as resistance"],
      stems: {
        easy: ["What does emotional intelligence help a project leader do?"],
        medium: ["A team member is frustrated after repeated scope changes. What leadership response fits best?"],
        hard: ["Conflict between two specialists is slowing delivery and each has valid concerns. What should the project manager do first?"],
      },
      contexts: ["team conflict", "stakeholder tension", "change fatigue", "quality pressure"],
      explanation: "Emotional intelligence helps leaders listen, understand motivations, and guide collaboration.",
    },
    {
      topic: "Ethics and confidentiality",
      sourceTopic: "Professional conduct and exam security",
      correct: "Be truthful, transparent, fair, and protect confidential information",
      distractors: ["Hide unfavorable facts until closure", "Share confidential exam content with friends", "Report only positive project information"],
      stems: {
        easy: ["Which behavior aligns with professional conduct?"],
        medium: ["A learner finds a site claiming to sell confidential CAPM items. What is the ethical response?"],
        hard: ["A status report contains serious delay data that may upset leadership. What should the project manager do?"],
      },
      contexts: ["status reporting", "exam preparation", "vendor selection", "procurement decision"],
      explanation: "CAPM-aligned conduct emphasizes honesty, responsibility, respect, fairness, and confidentiality.",
    },
    {
      topic: "Project closure",
      sourceTopic: "Closure and transition",
      correct: "Confirm acceptance, transition deliverables, and capture lessons learned",
      distractors: ["Stop documenting once the last task is coded", "Skip acceptance if the schedule is tight", "Delete all project records immediately"],
      stems: {
        easy: ["Which activity belongs in project closure?"],
        medium: ["A deliverable is complete and ready for handoff. What should happen before the team disbands?"],
        hard: ["Operations accepts a new process but support ownership and lessons learned are not documented. What closure gap remains?"],
      },
      contexts: ["system handoff", "new process launch", "facility opening", "training program completion"],
      explanation: "Closure confirms acceptance, transitions ownership, archives information, and captures learning.",
    },
    {
      topic: "Problem-solving tools",
      sourceTopic: "Meetings, brainstorming, and facilitation",
      correct: "Use a structured facilitation technique that fits the decision or discovery need",
      distractors: ["Choose tools randomly", "Avoid group discussion for all problems", "Use only one technique for every situation"],
      stems: {
        easy: ["What is the purpose of project facilitation tools?"],
        medium: ["A team needs many possible causes before narrowing a defect problem. Which approach fits?"],
        hard: ["Stakeholders disagree about root causes and solutions. What should the facilitator do first?"],
      },
      contexts: ["defect analysis", "scope workshop", "risk planning", "lessons learned session"],
      explanation: "Facilitation tools such as brainstorming, workshops, and root-cause analysis help teams think clearly.",
    },
  ],
  predictive: [
    {
      topic: "Work breakdown structure",
      sourceTopic: "WBS and scope decomposition",
      correct: "A hierarchical decomposition of project deliverables into manageable work",
      distractors: ["A team mood chart", "A procurement contract type", "A list of only project risks"],
      stems: {
        easy: ["What is a work breakdown structure?"],
        medium: ["A team needs to organize approved scope into deliverable-based pieces. What artifact fits best?"],
        hard: ["A sponsor wants clearer scope control before schedule estimation. What should the team create first?"],
      },
      contexts: ["construction plan", "training rollout", "platform migration", "event launch"],
      explanation: "The WBS decomposes scope into deliverables and work packages for planning and control.",
    },
    {
      topic: "Critical path",
      sourceTopic: "Critical path and schedule baseline",
      correct: "The sequence of activities that determines the earliest possible finish date",
      distractors: ["The cheapest set of tasks", "Only tasks owned by the sponsor", "A list of optional features"],
      stems: {
        easy: ["What does the critical path represent?"],
        medium: ["A task with no float is delayed. What is most likely affected?"],
        hard: ["Two noncritical tasks finish late with float remaining, while one critical task slips. What deserves priority?"],
      },
      contexts: ["facility renovation", "software release", "market launch", "equipment installation"],
      explanation: "Critical path activities drive project duration; delays on that path can delay completion.",
    },
    {
      topic: "Integrated change control",
      sourceTopic: "Baselines and approved change",
      correct: "Assess the impact and follow the approved change control process",
      distractors: ["Make the change silently", "Reject all requested changes automatically", "Restart the project charter every time"],
      stems: {
        easy: ["What should happen when a predictive project receives a scope change request?"],
        medium: ["A customer asks for an extra feature after baseline approval. What is the best next step?"],
        hard: ["A requested change affects schedule, cost, and quality. What should happen before implementation?"],
      },
      contexts: ["regulated system", "vendor contract", "manufacturing upgrade", "data warehouse"],
      explanation: "Plan-based work controls changes by analyzing impact and using the agreed approval path.",
    },
    {
      topic: "Quality planning and control",
      sourceTopic: "Quality standards and verification",
      correct: "Define acceptance criteria and inspect results against them",
      distractors: ["Wait for the customer to find every defect", "Skip testing to protect schedule", "Measure only team attendance"],
      stems: {
        easy: ["Which action supports project quality?"],
        medium: ["A deliverable is complete but has not been checked against requirements. What should happen?"],
        hard: ["A team is moving quickly but defect trends are rising. Which response supports quality control?"],
      },
      contexts: ["prototype approval", "training material review", "system testing", "supplier inspection"],
      explanation: "Quality work defines standards and verifies that outputs meet them.",
    },
    {
      topic: "Cost baseline",
      sourceTopic: "Cost estimating and baseline control",
      correct: "Use the approved cost baseline to compare planned and actual spending",
      distractors: ["Ignore costs until closure", "Track only team sentiment", "Replace budget tracking with meeting notes"],
      stems: {
        easy: ["What is the cost baseline used for?"],
        medium: ["Actual spending is higher than planned for completed work. What should the project manager compare against?"],
        hard: ["A project is under schedule pressure and overtime costs rise unexpectedly. What baseline helps evaluate the variance?"],
      },
      contexts: ["contract delivery", "internal product build", "infrastructure upgrade", "service transition"],
      explanation: "The cost baseline is the approved budget used to monitor and control cost performance.",
    },
    {
      topic: "Schedule variance",
      sourceTopic: "Schedule performance monitoring",
      correct: "Compare actual progress with the approved schedule baseline",
      distractors: ["Measure only how many meetings occurred", "Ignore approved dates after kickoff", "Use customer mood as the only schedule measure"],
      stems: {
        easy: ["How does a predictive team check schedule performance?"],
        medium: ["A work package is late against the approved plan. What should be reviewed?"],
        hard: ["Several deliverables appear complete but milestone acceptance is delayed. What should the team compare against?"],
      },
      contexts: ["milestone review", "monthly reporting", "release readiness", "site preparation"],
      explanation: "Schedule control compares actual progress to the approved baseline and manages variance.",
    },
    {
      topic: "Procurement planning",
      sourceTopic: "Vendor and contract planning",
      correct: "Define what to buy, selection criteria, and vendor responsibilities",
      distractors: ["Let vendors define all project scope", "Skip contract responsibilities", "Select suppliers without criteria"],
      stems: {
        easy: ["What should procurement planning clarify?"],
        medium: ["A team needs an external supplier for specialized testing. What should be defined before selection?"],
        hard: ["A supplier deliverable is late because responsibilities were vague. What planning gap likely contributed?"],
      },
      contexts: ["testing supplier", "hardware purchase", "consulting service", "cloud migration vendor"],
      explanation: "Procurement planning clarifies acquisition needs, criteria, responsibilities, and contract expectations.",
    },
    {
      topic: "Requirements baseline",
      sourceTopic: "Plan-based requirements control",
      correct: "Use approved requirements as the basis for scope, schedule, and acceptance",
      distractors: ["Treat every new idea as automatically approved", "Avoid documenting requirements", "Replace requirements with informal chats only"],
      stems: {
        easy: ["What does a requirements baseline support?"],
        medium: ["A stakeholder requests work that is not in the approved requirements. What should the team do?"],
        hard: ["A project is nearly complete but acceptance disputes emerge because requirements changed informally. What control was weak?"],
      },
      contexts: ["system requirements", "facility specification", "training curriculum", "reporting dashboard"],
      explanation: "Approved requirements give predictive teams a controlled foundation for delivery and acceptance.",
    },
  ],
  agile: [
    {
      topic: "Adaptive lifecycle selection",
      sourceTopic: "Adaptive approach fit",
      correct: "Use an adaptive approach when requirements are expected to evolve",
      distractors: ["Use adaptive only when no feedback is allowed", "Use adaptive only for fixed compliance outputs", "Use adaptive to avoid prioritization"],
      stems: {
        easy: ["When is an adaptive approach usually helpful?"],
        medium: ["A product team expects frequent customer learning and changing priorities. Which approach fits best?"],
        hard: ["A project has stable compliance outputs but an uncertain user interface. What delivery choice is most reasonable?"],
      },
      contexts: ["digital product", "customer portal", "analytics dashboard", "mobile workflow"],
      explanation: "Adaptive methods help teams learn through increments when needs are uncertain or changing.",
    },
    {
      topic: "Retrospectives",
      sourceTopic: "Agile inspect and adapt events",
      correct: "A retrospective improves the team's way of working",
      distractors: ["A retrospective approves the annual budget", "A retrospective replaces all testing", "A retrospective assigns legal ownership"],
      stems: {
        easy: ["What is the purpose of a retrospective?"],
        medium: ["After a sprint, the team wants to improve collaboration and reduce rework. Which event helps?"],
        hard: ["A team delivered an increment but quality friction keeps recurring. Which agile practice supports process improvement?"],
      },
      contexts: ["sprint close", "iteration review cycle", "team improvement session", "delivery reset"],
      explanation: "Retrospectives help teams inspect and adapt their process.",
    },
    {
      topic: "Product backlog",
      sourceTopic: "Backlog and prioritization",
      correct: "A prioritized list of work that may deliver product value",
      distractors: ["A fixed payroll register", "A list of only completed invoices", "A confidential HR file"],
      stems: {
        easy: ["What is a product backlog?"],
        medium: ["A product owner wants to order features by value and urgency. What artifact should be refined?"],
        hard: ["Stakeholders call everything a must-have. What should the team use to make tradeoffs visible?"],
      },
      contexts: ["feature planning", "release planning", "customer feedback review", "product discovery"],
      explanation: "The backlog captures and orders product work so teams can deliver valuable items first.",
    },
    {
      topic: "Kanban flow",
      sourceTopic: "Kanban and work in progress",
      correct: "Limit work in progress to expose bottlenecks and improve flow",
      distractors: ["Start every task at once", "Hide blocked work", "Measure only final invoices"],
      stems: {
        easy: ["What is a common Kanban control?"],
        medium: ["A team starts too much work and finishes too little. What Kanban practice helps?"],
        hard: ["Cycle time is rising because review work piles up. Which action best supports flow?"],
      },
      contexts: ["support workflow", "content production", "defect triage", "operations enhancement"],
      explanation: "Kanban uses visible workflow and WIP limits to improve flow and reveal bottlenecks.",
    },
    {
      topic: "Definition of done",
      sourceTopic: "Quality in agile delivery",
      correct: "A shared checklist for when work is complete and releasable",
      distractors: ["A list of future wishes", "A private developer note", "A replacement for customer feedback"],
      stems: {
        easy: ["What is a definition of done?"],
        medium: ["A team disagrees whether a story is complete. What shared agreement helps?"],
        hard: ["An increment demos well but lacks testing and documentation expected by the team. What standard should be checked?"],
      },
      contexts: ["sprint delivery", "release readiness", "quality alignment", "team working agreement"],
      explanation: "The definition of done creates a shared quality and completeness standard.",
    },
    {
      topic: "Product owner decisions",
      sourceTopic: "Agile roles and responsibilities",
      correct: "The product owner orders backlog items to maximize value",
      distractors: ["The product owner manages every team member's schedule", "The product owner eliminates all stakeholder input", "The product owner replaces the whole team"],
      stems: {
        easy: ["What is a key product owner responsibility?"],
        medium: ["Stakeholders want competing features in the next sprint. Who should order the backlog by value?"],
        hard: ["A team is busy but low-value work keeps entering the sprint. Which role should strengthen prioritization?"],
      },
      contexts: ["sprint planning", "release tradeoff", "stakeholder negotiation", "feature discovery"],
      explanation: "The product owner maximizes product value by ordering backlog items and clarifying priorities.",
    },
    {
      topic: "Agile estimation",
      sourceTopic: "Relative estimation and planning",
      correct: "Use relative estimates to compare effort, complexity, and uncertainty",
      distractors: ["Use estimates to punish team members", "Require exact dates for every unknown", "Avoid discussing uncertainty"],
      stems: {
        easy: ["Why do agile teams use relative estimation?"],
        medium: ["A team compares stories by complexity rather than exact hours. What technique idea is being used?"],
        hard: ["A story is small in effort but high in uncertainty. What should the team consider during estimation?"],
      },
      contexts: ["backlog refinement", "iteration planning", "release forecasting", "story sizing"],
      explanation: "Relative estimation helps teams reason about effort, complexity, and uncertainty collaboratively.",
    },
    {
      topic: "Incremental delivery",
      sourceTopic: "Increments and feedback",
      correct: "Deliver small usable increments and inspect feedback frequently",
      distractors: ["Wait until all features are complete before learning", "Avoid customer feedback", "Hide unfinished assumptions from the team"],
      stems: {
        easy: ["What is a benefit of incremental delivery?"],
        medium: ["A team wants feedback before building the full product. What agile idea supports this?"],
        hard: ["A product direction is uncertain and funding is limited. What delivery strategy reduces wasted work?"],
      },
      contexts: ["minimum viable release", "customer pilot", "prototype cycle", "service experiment"],
      explanation: "Incremental delivery creates learning opportunities and reduces risk when needs are uncertain.",
    },
  ],
  business: [
    {
      topic: "Stakeholder identification",
      sourceTopic: "Business analysis roles and stakeholders",
      correct: "Identify who has needs, influence, decisions, or impact related to the product",
      distractors: ["Invite only the loudest person", "Ignore external users", "Document only the project manager"],
      stems: {
        easy: ["Why does a business analyst identify stakeholders?"],
        medium: ["A requirement keeps changing because a key operations group was missed. What should be corrected?"],
        hard: ["Internal and external users disagree about release priorities. What should the BA clarify first?"],
      },
      contexts: ["new workflow", "customer portal", "policy rollout", "reporting product"],
      explanation: "Stakeholder identification helps the team understand needs, influence, communication, and validation.",
    },
    {
      topic: "Elicitation techniques",
      sourceTopic: "Requirements gathering approaches",
      correct: "Select an elicitation technique such as interviews, workshops, surveys, or observation",
      distractors: ["Guess requirements from the schedule", "Use only a cost baseline", "Close the project before asking users"],
      stems: {
        easy: ["How are requirements commonly gathered?"],
        medium: ["A BA needs input from many users in different regions. Which technique may help?"],
        hard: ["Requirements conflict across departments and need group discussion. Which elicitation choice is strongest?"],
      },
      contexts: ["distributed users", "process workshop", "executive interview", "field observation"],
      explanation: "Elicitation uses structured techniques to discover needs and requirements.",
    },
    {
      topic: "Requirements traceability",
      sourceTopic: "Requirements traceability matrix",
      correct: "Link requirements to their source, delivery work, and validation status",
      distractors: ["Replace stakeholder communication", "Calculate only CPI", "List team vacation days"],
      stems: {
        easy: ["What does a requirements traceability matrix help do?"],
        medium: ["A team must prove each approved requirement was tested. What artifact helps?"],
        hard: ["A release is almost ready, but several requirements have unclear test evidence. What should be reviewed?"],
      },
      contexts: ["audit preparation", "release validation", "acceptance testing", "change impact review"],
      explanation: "Traceability connects requirements through delivery and validation so gaps are visible.",
    },
    {
      topic: "Acceptance criteria",
      sourceTopic: "Acceptance criteria and readiness",
      correct: "Use acceptance criteria to decide whether the delivered result satisfies the requirement",
      distractors: ["Accept all work once code exists", "Use team popularity as the only measure", "Avoid validation until after benefits expire"],
      stems: {
        easy: ["What are acceptance criteria used for?"],
        medium: ["A user story is complete only if it meets agreed conditions. What are those conditions called?"],
        hard: ["A product increment works technically but does not meet user-defined outcomes. What should guide the decision?"],
      },
      contexts: ["user story validation", "release demo", "customer acceptance", "quality review"],
      explanation: "Acceptance criteria define how stakeholders and teams know a requirement has been met.",
    },
    {
      topic: "User stories",
      sourceTopic: "User story structure",
      correct: "Describe who needs something, what they need, and why it matters",
      distractors: ["List only technical tasks", "Hide user value", "Replace all conversations forever"],
      stems: {
        easy: ["What does a good user story communicate?"],
        medium: ["A team writes work from the perspective of the user and desired value. What format is being used?"],
        hard: ["A backlog item describes a database task but not the user outcome. What is missing from a business-analysis view?"],
      },
      contexts: ["backlog refinement", "feature discovery", "persona analysis", "product planning"],
      explanation: "User stories connect work to user roles, needs, and value.",
    },
    {
      topic: "Product roadmap",
      sourceTopic: "Roadmaps and release planning",
      correct: "A roadmap communicates planned product direction, releases, and value themes",
      distractors: ["A roadmap is a private defect log", "A roadmap is always a fixed task timesheet", "A roadmap replaces all stakeholder feedback"],
      stems: {
        easy: ["What does a product roadmap communicate?"],
        medium: ["Stakeholders need a view of upcoming feature themes and releases. What artifact helps?"],
        hard: ["A product has many possible improvements but no shared release direction. What BA artifact can align expectations?"],
      },
      contexts: ["release planning", "portfolio review", "feature sequencing", "stakeholder alignment"],
      explanation: "Roadmaps help communicate direction, release themes, and planned value over time.",
    },
    {
      topic: "Solution evaluation",
      sourceTopic: "Validation and solution performance",
      correct: "Evaluate whether the delivered solution meets the business need",
      distractors: ["Stop analysis once development starts", "Measure only how many documents exist", "Ignore stakeholder outcomes"],
      stems: {
        easy: ["What is solution evaluation concerned with?"],
        medium: ["A delivered feature is used rarely despite being built correctly. What should be evaluated?"],
        hard: ["The product meets technical requirements but does not improve the business process. What analysis is needed?"],
      },
      contexts: ["post-release review", "benefits check", "adoption analysis", "process measurement"],
      explanation: "Solution evaluation checks whether outputs actually satisfy business needs and expected outcomes.",
    },
    {
      topic: "Requirements prioritization",
      sourceTopic: "Prioritization and tradeoffs",
      correct: "Rank requirements by value, urgency, risk, dependency, and stakeholder need",
      distractors: ["Treat every requirement as equal forever", "Prioritize only by who shouts loudest", "Ignore dependencies"],
      stems: {
        easy: ["Why are requirements prioritized?"],
        medium: ["A release cannot include every requested feature. What should the BA support?"],
        hard: ["Two high-value features conflict with risk and dependency constraints. What prioritization view is needed?"],
      },
      contexts: ["release scope", "stakeholder workshop", "budget constraint", "dependency planning"],
      explanation: "Prioritization helps teams choose the most valuable and feasible work under constraints.",
    },
  ],
};

function emptyStats(): QuestionStats {
  return {
    total: 0,
    bonus: 0,
    byDomain: { fundamentals: 0, predictive: 0, agile: 0, business: 0 },
    byDifficulty: { easy: 0, medium: 0, hard: 0 },
  };
}

function hashSeed(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function nextSeed(seed: number) {
  return (Math.imul(seed, 1664525) + 1013904223) >>> 0;
}

function shuffleOptions(items: Array<{ text: string; correct: boolean }>, seedInput: string) {
  const shuffled = [...items];
  let seed = hashSeed(seedInput);

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    seed = nextSeed(seed);
    const swapIndex = seed % (index + 1);
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return {
    options: shuffled.map((item) => item.text),
    correctIndex: shuffled.findIndex((item) => item.correct),
  };
}

function buildOptions(topic: Topic, index: number, bank: "practice" | "mock", mode?: MockModeId) {
  if (bank === "practice") {
    const options = [
      { text: topic.correct, correct: true },
      ...topic.distractors.map((_, offset) => ({
        text: topic.distractors[(offset + index) % topic.distractors.length],
        correct: false,
      })),
    ];

    return shuffleOptions(options, `practice:${index}:${topic.topic}:${topic.sourceTopic}`);
  }

  const mockMode = mode ?? "real-case";
  const tails = mockOptionTails[mockMode];
  const options = [
    { text: `${topic.correct}, ${tails[index % tails.length]}`, correct: true },
    ...topic.distractors.map((_, offset) => {
      const distractor = topic.distractors[(offset + index) % topic.distractors.length];
      return {
        text: `${distractor}, ${tails[(offset + index) % tails.length]}`,
        correct: false,
      };
    }),
  ];

  return shuffleOptions(options, `${mockMode}:${index}:${topic.topic}:${topic.sourceTopic}`);
}

function countsFor(total: number, ratios: Record<Difficulty, number>) {
  const easy = Math.round(total * ratios.easy);
  const medium = Math.round(total * ratios.medium);
  return { easy, medium, hard: total - easy - medium };
}

function practiceCountsFor(domainId: DomainId) {
  return countsFor(practiceRequiredCounts[domainId], { easy: 0.4, medium: 0.4, hard: 0.2 });
}

function pickDifficulty(index: number, counts: Record<Difficulty, number>) {
  if (index < counts.easy) return "easy";
  if (index < counts.easy + counts.medium) return "medium";
  return "hard";
}

function buildPrompt({
  topic,
  difficulty,
  index,
  bank,
  mode,
}: {
  topic: Topic;
  difficulty: Difficulty;
  index: number;
  bank: "practice" | "mock";
  mode?: MockModeId;
}) {
  const context = topic.contexts[index % topic.contexts.length];
  const stem = topic.stems[difficulty][index % topic.stems[difficulty].length];
  if (bank === "practice") {
    const prefix = difficulty === "easy" ? "Concept check" : difficulty === "medium" ? "Practice scenario" : "Advanced practice scenario";
    return `${prefix} ${index + 1} (${context}): ${stem}`;
  }

  const mockMode = mode ?? "real-case";
  const mockContext = mockContexts[mockMode][index % mockContexts[mockMode].length];
  const pressure = mockPressureLines[mockMode][difficulty][index % mockPressureLines[mockMode][difficulty].length];
  const decision = mockDecisionFrames[mockMode][index % mockDecisionFrames[mockMode].length];

  if (mockMode === "real-case") {
    return `Mock case ${index + 1} - ${mockContext}: ${pressure} The decision centers on ${topic.topic.toLowerCase()} within ${topic.sourceTopic.toLowerCase()}. ${decision}`;
  }

  if (mockMode === "beyond-real") {
    return `Beyond-real case ${index + 1} - ${mockContext}: ${pressure} The team must handle ${topic.topic.toLowerCase()} without losing sight of ${topic.sourceTopic.toLowerCase()}. ${decision}`;
  }

  return `Must-fail case ${index + 1} - ${mockContext}: ${pressure} The scenario is testing ${topic.topic.toLowerCase()} and the deeper rule behind ${topic.sourceTopic.toLowerCase()}. ${decision}`;
}

function createQuestion({
  domainId,
  difficulty,
  index,
  globalIndex,
  bank,
  mode,
}: {
  domainId: DomainId;
  difficulty: Difficulty;
  index: number;
  globalIndex: number;
  bank: "practice" | "mock";
  mode?: MockModeId;
}): Question {
  const domainTopics = topics[domainId];
  const topic = domainTopics[(index + globalIndex) % domainTopics.length];
  const { options, correctIndex } = buildOptions(topic, globalIndex, bank, mode);
  const modeLabel = mode ? mockModes.find((item) => item.id === mode)?.label : undefined;

  return {
    id:
      bank === "practice"
        ? `practice-${domainId}-${difficulty}-${String(index + 1).padStart(4, "0")}`
        : `mock-${mode}-${domainId}-${String(index + 1).padStart(3, "0")}`,
    bank,
    mockMode: mode,
    domainId,
    difficulty,
    topic: topic.topic,
    prompt: buildPrompt({ topic, difficulty, index, bank, mode }),
    options,
    correctIndex,
    explanation:
      bank === "mock" && modeLabel
        ? `${topic.explanation} In ${modeLabel}, look for the answer that best protects value, governance, and stakeholder clarity.`
        : topic.explanation,
    sourceTopic: topic.sourceTopic,
    bonus: bank === "practice" && difficulty === "hard" && index % 11 === 0,
  };
}

function buildPracticeQuestionBank() {
  const questions: Question[] = [];
  let globalIndex = 0;

  for (const domainId of domainIds) {
    const counts = practiceCountsFor(domainId);
    for (const difficulty of difficulties) {
      for (let index = 0; index < counts[difficulty]; index += 1) {
        questions.push(createQuestion({ domainId, difficulty, index, globalIndex, bank: "practice" }));
        globalIndex += 1;
      }
    }
  }

  return questions;
}

function buildMockQuestionBank() {
  const questions: Question[] = [];
  let globalIndex = 10000;

  for (const mode of mockModes) {
    for (const domainId of domainIds) {
      const counts = countsFor(mockDomainCounts[domainId], mode.ratios);
      for (let index = 0; index < mockDomainCounts[domainId]; index += 1) {
        const difficulty = pickDifficulty(index, counts);
        questions.push(createQuestion({ domainId, difficulty, index, globalIndex, bank: "mock", mode: mode.id }));
        globalIndex += 1;
      }
    }
  }

  return questions;
}

export const practiceQuestionBank = buildPracticeQuestionBank();
export const mockQuestionBank = buildMockQuestionBank();
export const questionBank = practiceQuestionBank;

export function getQuestionStats(questions: Question[] = practiceQuestionBank) {
  return questions.reduce((stats, question) => {
    stats.total += 1;
    stats.byDomain[question.domainId] += 1;
    stats.byDifficulty[question.difficulty] += 1;
    if (question.bonus) stats.bonus += 1;
    return stats;
  }, emptyStats());
}

export function getMockStats() {
  return Object.fromEntries(
    mockModes.map((mode) => [mode.id, getQuestionStats(mockQuestionBank.filter((question) => question.mockMode === mode.id))]),
  ) as Record<MockModeId, QuestionStats>;
}

export function selectMockExamQuestions(modeId: MockModeId) {
  return mockQuestionBank.filter((question) => question.mockMode === modeId);
}
