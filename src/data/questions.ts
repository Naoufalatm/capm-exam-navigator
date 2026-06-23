import type { Difficulty, DomainId, MockModeId, Question } from "../types";

type Blueprint = {
  topic: string;
  sourceTopic: string;
  principle: string;
  correct: string;
  distractors: [string, string, string];
  explanation: string;
};

type CaseDetails = {
  thread: string;
  setting: string;
  role: string;
  stakeholder: string;
  artifact: string;
  signal: string;
  constraint: string;
  outcome: string;
  trap: string;
};

type ChoiceDraft = {
  text: string;
  correct: boolean;
  flawType: "key" | "timing" | "role" | "evidence" | "lifecycle" | "governance";
  rationale: string;
  lureStrength: number;
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
    label: "You Must Fail \u{1F480}",
    shortLabel: "Must Fail",
    level: "Maximum difficulty",
    summary: "Extreme multi-concept cases built to expose weak spots before the real appointment.",
    warning: "This one is intentionally harsh. Low scores are useful diagnostic data.",
    ratios: { easy: 0, medium: 0.25, hard: 0.75 },
  },
];

function bp(
  topic: string,
  sourceTopic: string,
  principle: string,
  correct: string,
  distractors: [string, string, string],
  explanation: string,
): Blueprint {
  return { topic, sourceTopic, principle, correct, distractors, explanation };
}

const blueprintCatalog = {
  fundamentals: [
    bp("Project vs operations", "ECO Domain I Task 1 - life cycles and processes", "temporary unique work is managed differently from ongoing operations", "Classify the temporary unique effort as project work and manage the defined outcome.", ["Treat the effort as routine operations because people already do similar work.", "Remove the end date so the activity can continue indefinitely.", "Measure success only by the number of recurring tickets closed."], "A project is temporary and creates a unique product, service, or result; operations are ongoing and repetitive."),
    bp("Project, program, and portfolio", "ECO Domain I Task 1 - distinguish project, program, and portfolio", "projects deliver outcomes, programs coordinate related benefits, and portfolios align investment to strategy", "Identify whether the work is a project, related program, or strategic portfolio decision before acting.", ["Call every funded idea a program even when the work is unrelated.", "Use the portfolio only as a task checklist for one team.", "Ignore strategic alignment once individual project schedules exist."], "CAPM candidates should distinguish the level of management: project output, program benefits, and portfolio strategy."),
    bp("Predictive and adaptive approaches", "ECO Domain I Task 1 - distinguish predictive and adaptive approaches", "delivery approach should match uncertainty, change rate, and need for feedback", "Select the lifecycle approach that fits the uncertainty, feedback needs, and governance context.", ["Choose predictive because it is always faster than adaptive work.", "Choose adaptive only because the team dislikes documentation.", "Use both approaches randomly without explaining the decision."], "Predictive and adaptive approaches are selected based on context, not preference alone."),
    bp("Risk, issue, assumption, and constraint", "ECO Domain I Task 1 - distinguish issues, risks, assumptions, and constraints", "uncertain events, current problems, believed conditions, and limits must be managed differently", "Classify the item correctly before choosing a response or log.", ["Escalate every uncertainty as if it has already occurred.", "Treat a fixed deadline as a future opportunity event.", "Record every assumption as a completed deliverable."], "Risks are uncertain, issues have happened, assumptions are believed true, and constraints limit choices."),
    bp("Scope critique", "ECO Domain I Task 1 - review and critique project scope", "scope should be clear, testable, and tied to intended outcomes", "Review the scope for missing boundaries, acceptance expectations, and value alignment.", ["Approve vague scope because detailed work can be guessed later.", "Add every stakeholder wish without considering boundaries.", "Treat the project title as the complete scope statement."], "Scope review checks whether work and exclusions are clear enough to plan, control, and validate."),
    bp("Ethics and professional conduct", "ECO Domain I Task 1 - apply the PMI Code of Ethics to scenarios", "truthfulness, fairness, responsibility, respect, and confidentiality guide professional choices", "Choose the transparent and fair action that protects confidential information.", ["Hide unfavorable facts until the project is impossible to correct.", "Share restricted content because it may help someone study faster.", "Favor the loudest stakeholder even when evidence points elsewhere."], "Professional conduct favors honesty, fairness, responsibility, respect, and confidentiality."),
    bp("Project as a vehicle for change", "ECO Domain I Task 1 - explain how a project can be a vehicle for change", "projects create change through outcomes, adoption, and transition", "Connect the project deliverable to the organizational change and adoption need.", ["Declare success when an output exists even if nobody can use it.", "Avoid transition planning because change belongs only to operations.", "Measure change only by meeting attendance."], "Projects often enable change, so adoption and transition matter alongside deliverables."),
    bp("Cost planning purpose", "ECO Domain I Task 2 - project management planning", "cost planning establishes the budget basis for managing spending", "Use cost planning to estimate, budget, and control project spending.", ["Use the budget only after the final invoice arrives.", "Replace cost planning with informal team optimism.", "Ignore cost impacts when scope or schedule changes."], "Cost planning gives the team a baseline for comparing planned and actual spending."),
    bp("Quality planning purpose", "ECO Domain I Task 2 - project management planning", "quality planning defines standards and how outputs will be verified", "Define quality standards and verification activities before accepting the deliverable.", ["Wait for customers to discover every defect after release.", "Measure quality only by how quickly the team worked.", "Skip acceptance standards when deadlines are tight."], "Quality planning identifies standards, checks, and acceptance expectations."),
    bp("Risk planning purpose", "ECO Domain I Task 2 - project management planning", "risk planning prepares responses before uncertain events harm or help objectives", "Identify risks, analyze exposure, and plan proportionate responses.", ["Log risks only after they become issues.", "Assume all uncertainty is outside the project team's concern.", "Close the risk register once the kickoff meeting ends."], "Risk planning helps the team act before uncertainty becomes unmanaged damage."),
    bp("Schedule planning purpose", "ECO Domain I Task 2 - project management planning", "schedule planning sequences work and supports realistic timing decisions", "Use schedule planning to sequence activities, estimate durations, and reveal dependencies.", ["Pick dates before understanding dependencies.", "Treat the milestone list as a complete schedule.", "Ignore schedule impacts of resource limits."], "Schedule planning makes timing, dependencies, and commitments visible."),
    bp("Project plan vs product plan", "ECO Domain I Task 2 - project plan and product plan deliverables", "project plans manage the work, while product plans guide the product direction", "Separate delivery-management information from product direction and feature decisions.", ["Put every product roadmap decision inside the risk register.", "Use the product plan as the only source for team assignments.", "Treat the schedule baseline as the product vision."], "A project management plan guides how work is managed; product planning guides what product value is pursued."),
    bp("Milestone vs duration", "ECO Domain I Task 2 - milestone and task duration", "milestones mark significant points, while durations estimate work time", "Use milestones for key checkpoints and durations for activity effort timing.", ["Assign a two-week duration to a milestone with no work content.", "Use only milestones when the team needs activity estimates.", "Treat every task duration as a customer acceptance event."], "Milestones are markers; durations describe how long activities are expected to take."),
    bp("Resource planning", "ECO Domain I Task 2 - determine resources", "resource planning identifies people, equipment, skills, and availability needed for work", "Determine the needed skills, capacity, and material resources before committing the plan.", ["Assume every specialist is available whenever needed.", "Plan resources after all work is complete.", "Count only headcount and ignore skills or equipment."], "Resource planning connects work packages to the people, skills, tools, and materials needed."),
    bp("Risk register use", "ECO Domain I Task 2 - use a risk register", "the risk register records uncertainty, ownership, analysis, and responses", "Update the risk register with the event, impact, owner, response, and status.", ["Put future uncertainty only in meeting chat with no owner.", "Delete risks that are uncomfortable to discuss.", "Use the issue log for every possible future event."], "A risk register keeps risk information visible and actionable."),
    bp("Stakeholder register use", "ECO Domain I Task 2 - use a stakeholder register", "stakeholder information supports communication, influence analysis, and engagement planning", "Update the stakeholder register with role, interest, influence, and communication needs.", ["Track only people who attend the kickoff meeting.", "Use the register to exclude difficult stakeholders from updates.", "Replace stakeholder analysis with one generic email list."], "A stakeholder register helps the team understand who is affected and how to engage them."),
    bp("Project closure and transition", "ECO Domain I Task 2 - closure and transitions", "closure confirms acceptance, transfers ownership, archives knowledge, and releases resources", "Confirm acceptance, transition ownership, archive records, and capture lessons learned.", ["Disband the team as soon as the last task is marked done.", "Skip transition because operations can guess support needs.", "Delete project records to avoid future questions."], "Closure is a managed transition, not simply stopping work."),
    bp("Project manager and sponsor roles", "ECO Domain I Task 3 - roles and responsibilities", "the sponsor provides authority and support while the project manager leads delivery coordination", "Clarify whether the decision needs sponsor authority or project manager coordination.", ["Ask the project manager to approve business funding alone.", "Expect the sponsor to manage every daily team task.", "Let role confusion continue until conflict grows."], "Sponsors and project managers have different but connected responsibilities."),
    bp("Project team and sponsor roles", "ECO Domain I Task 3 - team and sponsor responsibilities", "teams perform project work while sponsors champion business need and remove barriers", "Separate team delivery responsibilities from sponsor ownership of business support.", ["Make the sponsor complete every technical deliverable.", "Ask the team to replace executive business ownership.", "Ignore sponsor engagement once the team is assigned."], "The team performs the work; the sponsor supports and champions the business need."),
    bp("Project manager as facilitator", "ECO Domain I Task 3 - importance of the project manager role", "project managers facilitate, negotiate, listen, coach, and remove obstacles", "Use facilitation and negotiation to help the team reach a workable decision.", ["Use authority before understanding the disagreement.", "Stay silent because facilitation is not part of the role.", "Coach only the sponsor and ignore the delivery team."], "The project manager role includes leadership behaviors that help people make progress."),
    bp("Leadership vs management", "ECO Domain I Task 3 - leadership and management", "management coordinates work while leadership influences people toward outcomes", "Balance management controls with leadership behaviors that align and motivate people.", ["Use process tracking as a substitute for all leadership.", "Motivate the team without managing commitments or constraints.", "Treat leadership and management as identical in every situation."], "CAPM scenarios often test when to manage tasks and when to lead people."),
    bp("Emotional intelligence", "ECO Domain I Task 3 - emotional intelligence impact", "emotional intelligence helps leaders understand emotions and respond constructively", "Listen for concerns, acknowledge the emotion, and guide the discussion toward action.", ["Label every concern as resistance.", "Ignore frustration until the project closes.", "Respond defensively before understanding the source of tension."], "Emotional intelligence supports collaboration, conflict handling, and stakeholder engagement."),
    bp("Communication strategy execution", "ECO Domain I Task 4 - follow communication frameworks", "communication should follow the plan while adapting to stakeholder needs", "Use the communication strategy to send the right information to the right stakeholder at the right time.", ["Send the same technical detail to every stakeholder.", "Stop communicating when the update is uncomfortable.", "Communicate only through informal hallway comments."], "A communication plan or strategy only helps when the team follows and adapts it."),
    bp("Risk response execution", "ECO Domain I Task 4 - follow risk frameworks", "planned risk responses must be triggered, owned, and monitored", "Activate the agreed risk response and monitor whether it reduces exposure.", ["Create a response but never assign an owner.", "Wait until all risks become issues before acting.", "Use the same response for every threat and opportunity."], "Risk frameworks guide practical response, ownership, and follow-up."),
    bp("Project initiation", "ECO Domain I Task 4 - project initiation", "initiation clarifies purpose, authority, stakeholders, and initial alignment", "Confirm the project purpose, authority, key stakeholders, and initial success criteria.", ["Start detailed execution before the purpose is understood.", "Assume funding approval means all scope decisions are final.", "Skip stakeholder identification until closure."], "Initiation establishes enough alignment for planning and delivery to begin responsibly."),
    bp("Benefit planning", "ECO Domain I Task 4 - benefit planning", "benefits explain why the project matters and how value will be recognized", "Connect the work to expected benefits and how those benefits will be measured.", ["Track only activity volume and ignore outcome value.", "Assume every deliverable automatically creates benefits.", "Postpone value thinking until after funding expires."], "Benefit planning keeps decisions tied to expected value."),
    bp("Meeting effectiveness", "ECO Domain I Task 5 - evaluate meeting effectiveness", "meetings should have purpose, right participants, facilitation, outcomes, and follow-up", "Evaluate the meeting against its purpose, participation, decisions, and follow-up actions.", ["Schedule more meetings without defining the decision needed.", "Invite everyone to every meeting regardless of purpose.", "Judge effectiveness only by meeting length."], "Effective meetings produce clarity, decisions, or useful collaboration."),
    bp("Focus groups", "ECO Domain I Task 5 - focus groups", "focus groups gather guided feedback from selected participants", "Use a focus group when guided discussion among representative participants will reveal needs or reactions.", ["Use a focus group to secretly approve budget changes.", "Treat one participant opinion as universal proof.", "Use focus groups when private confidential input is required from each person."], "Focus groups are facilitated discussions that gather perceptions and feedback."),
    bp("Standup meetings", "ECO Domain I Task 5 - standup meetings", "standups synchronize short-term work and expose blockers", "Use a short standup to align near-term work, blockers, and coordination needs.", ["Turn the standup into a long design debate every day.", "Use the standup as a performance interrogation.", "Skip blockers because only completed tasks matter."], "Standups are brief coordination events, especially useful for flow and team alignment."),
    bp("Brainstorming", "ECO Domain I Task 5 - brainstorming", "brainstorming expands possible ideas before narrowing choices", "Use brainstorming to generate options before evaluating or selecting solutions.", ["Start by criticizing ideas so the group stays quiet.", "Use brainstorming to replace all analysis and decision criteria.", "Invite only people who already agree with the solution."], "Brainstorming helps groups produce many ideas before filtering them."),
    bp("Root-cause analysis", "ECO Domain I Task 5 - problem-solving techniques", "root-cause analysis looks beyond symptoms to underlying causes", "Investigate the underlying cause before choosing a corrective action.", ["Fix the most visible symptom and close the issue permanently.", "Blame one person before examining the process.", "Use the first theory as proof without evidence."], "Root-cause thinking helps avoid repeated problems caused by shallow fixes."),
    bp("Lessons learned", "ECO Domain I Task 2 - closure and knowledge transfer", "lessons learned preserve useful project knowledge for future work", "Capture what worked, what failed, and what future teams should change.", ["Record lessons only if the project failed.", "Wait years before collecting team memory.", "Hide lessons that mention process weaknesses."], "Lessons learned turn project experience into reusable knowledge."),
  ],
  predictive: [
    bp("Predictive approach suitability", "ECO Domain II Task 1 - suitability of predictive approach", "predictive work fits stable scope, known requirements, and formal control needs", "Use a predictive approach when requirements are stable and change control is important.", ["Use predictive planning to avoid talking to stakeholders.", "Choose predictive only because the team dislikes feedback.", "Reject predictive planning for every regulated project."], "Predictive approaches work best when the team can plan scope, schedule, and controls up front."),
    bp("Organizational structure fit", "ECO Domain II Task 1 - organizational structure", "structure affects authority, communication paths, and resource access", "Account for the organization's matrix, functional, virtual, or hierarchical structure when planning work.", ["Assume authority is the same in every organization.", "Ignore virtual-team communication needs.", "Plan resource decisions without knowing reporting relationships."], "Organizational structure shapes how project work is approved, staffed, and communicated."),
    bp("Process group activities", "ECO Domain II Task 1 - activities within each process", "predictive processes organize initiating, planning, executing, monitoring, controlling, and closing activities", "Place the activity in the correct process context before choosing the next step.", ["Treat closure work as if it belongs before authorization.", "Skip monitoring because planning already happened.", "Use executing activities to replace planning decisions."], "Predictive methods rely on disciplined process flow and control points."),
    bp("Project components", "ECO Domain II Task 1 - distinguish project components", "components such as scope, schedule, cost, quality, risk, and resources interact", "Identify the project component affected before changing the plan.", ["Treat every variance as only a communication problem.", "Change schedule without checking cost or scope impact.", "Assume quality is unrelated to planning components."], "Project components are connected, so decisions should consider cross-impact."),
    bp("Scope baseline", "ECO Domain II Task 2 - project management plan schedule", "scope baseline defines approved scope for planning and control", "Use the approved scope baseline to judge whether requested work belongs in the project.", ["Accept extra work because it seems helpful.", "Use informal memory as the scope baseline.", "Change scope without recording the approval path."], "The scope baseline supports control of what is included and excluded."),
    bp("Work breakdown structure", "ECO Domain II Task 2 - WBS", "a WBS decomposes deliverables into manageable work packages", "Create or review the WBS to organize approved deliverables into manageable work.", ["List only calendar dates and call it a WBS.", "Use the WBS as a list of stakeholder emotions.", "Decompose work that has not been approved or understood."], "A WBS is deliverable-oriented decomposition for planning and control."),
    bp("Work packages", "ECO Domain II Task 2 - work packages", "work packages are manageable lowest-level WBS components for estimating and assignment", "Use work packages to estimate, assign, and control manageable pieces of scope.", ["Treat the whole project as one work package.", "Make work packages so tiny that control becomes noise.", "Use work packages only for procurement contracts."], "Work packages help teams estimate, schedule, assign, and track work."),
    bp("Activity sequencing", "ECO Domain II Task 2 - schedule planning", "activity sequencing shows logical order and dependencies", "Sequence activities by dependencies before confirming the schedule.", ["Schedule activities alphabetically.", "Start every task at once to appear faster.", "Ignore mandatory dependencies because the deadline is urgent."], "Sequencing reveals what must happen before, after, or in parallel."),
    bp("Critical path", "ECO Domain II Task 2 - critical path methods", "critical path determines the earliest possible finish date", "Focus on critical path activities because delay there can delay the project finish.", ["Prioritize only the cheapest activities.", "Assume noncritical work always controls the finish date.", "Use critical path to pick the most popular feature."], "Critical path analysis identifies the sequence that drives project duration."),
    bp("Schedule variance", "ECO Domain II Task 2 - calculate schedule variance", "schedule variance compares earned value with planned value", "Use schedule variance to understand whether work progress is ahead or behind plan.", ["Use schedule variance to measure stakeholder happiness.", "Calculate schedule performance without planned or earned value.", "Treat any negative number as automatic project failure."], "Schedule variance is a monitoring signal that needs interpretation and action."),
    bp("Cost variance", "ECO Domain II Task 3 - calculate cost variances", "cost variance compares earned value with actual cost", "Use cost variance to determine whether delivered work is costing more or less than planned.", ["Use cost variance to approve scope changes alone.", "Ignore actual cost because the baseline was approved.", "Treat cost variance as a team morale metric."], "Cost variance helps monitor budget performance for completed work."),
    bp("Quality management plan", "ECO Domain II Task 2 - quality management plan", "quality plans define standards, metrics, and verification methods", "Apply the quality management plan to verify work against agreed standards.", ["Replace quality checks with personal preference.", "Inspect only after the customer complains.", "Use schedule pressure as the quality standard."], "The quality management plan explains how quality will be planned, managed, and checked."),
    bp("Integration management plan", "ECO Domain II Task 2 - integration management plan", "integration aligns project components and manages cross-functional changes", "Use integration planning to coordinate scope, schedule, cost, risk, and stakeholder impacts.", ["Let each team optimize separately with no coordination.", "Treat integration as only a final status report.", "Ignore cross-impact when one baseline changes."], "Integration management keeps project pieces working together."),
    bp("Integrated change control", "ECO Domain II Task 3 - predictive project controls", "changes should be assessed, approved, and documented before implementation", "Analyze the impact and follow the approved change-control process.", ["Implement the change quietly because the requester is senior.", "Reject all change requests without analysis.", "Update the baseline before approval."], "Change control protects baselines while still allowing justified change."),
    bp("Requirements baseline", "ECO Domain II Task 3 - predictive artifacts", "requirements baselines support formal control of agreed needs", "Compare the request to the approved requirements baseline before changing work.", ["Treat every new idea as already approved.", "Use a chat message as the only baseline.", "Ignore baseline changes if development has started."], "A requirements baseline helps determine whether work is agreed, changed, or out of scope."),
    bp("Risk register control", "ECO Domain II Task 3 - predictive artifacts", "predictive controls use risk information to monitor and respond", "Review risk status, triggers, owners, and response effectiveness.", ["Leave risk ownership blank because the register exists.", "Track only issues after damage occurs.", "Remove risks that are difficult to quantify."], "Risk registers support monitoring and control throughout the project."),
    bp("Issue log", "ECO Domain II Task 3 - predictive artifacts", "issue logs track current problems, ownership, due dates, and resolution", "Record the current problem in the issue log with an owner and target resolution.", ["Keep issues only in private notes.", "Call every issue a future risk to avoid action.", "Close the issue before assigning an owner."], "An issue log supports accountability for problems that already exist."),
    bp("Procurement artifacts", "ECO Domain II Task 3 - predictive artifacts", "procurement documents guide supplier expectations and contractual control", "Use the appropriate procurement artifact to clarify supplier scope, terms, and acceptance.", ["Let vendors infer requirements from informal conversations.", "Use procurement documents only after the contract ends.", "Change supplier scope without reviewing contract impact."], "Predictive projects often rely on formal procurement records and contract controls."),
    bp("Contract change", "ECO Domain II Task 3 - document project controls", "supplier changes must respect contract terms and approval authority", "Assess the contract impact and follow the agreed change mechanism.", ["Ask the vendor to start unpaid extra work immediately.", "Ignore contract terms because the change seems small.", "Approve supplier changes without the authorized path."], "Contracts create obligations, so changes need proper review and authorization."),
    bp("Communications plan", "ECO Domain II Task 3 - predictive artifacts", "communication plans define what, when, how, and to whom information flows", "Follow the communications plan and adjust only through appropriate governance.", ["Send sensitive reports to every contact in the company.", "Stop reporting because the schedule is late.", "Use one informal channel for all stakeholder decisions."], "Communication planning prevents gaps, noise, and missed decisions."),
    bp("Stakeholder engagement plan", "ECO Domain II Task 3 - predictive artifacts", "engagement planning guides how stakeholders are involved and managed", "Use stakeholder analysis to plan engagement actions and manage expectations.", ["Engage only stakeholders who agree with the team.", "Assume a stakeholder register is the same as engagement.", "Ignore high-influence stakeholders until acceptance testing."], "Stakeholder engagement is active planning, not just a list of names."),
    bp("Baseline comparison", "ECO Domain II Task 3 - document project controls", "baselines provide approved reference points for control", "Compare actual performance to the approved baseline before recommending action.", ["Use feelings instead of baseline data.", "Change the baseline every time performance is uncomfortable.", "Report only actuals without explaining planned comparison."], "Baselines make performance discussions objective."),
    bp("Earned value basics", "ECO Domain II Task 3 - cost and schedule variances", "earned value compares planned value, earned value, and actual cost", "Use earned value information to interpret cost and schedule performance.", ["Use earned value to replace stakeholder communication.", "Calculate performance without knowing planned or earned value.", "Treat earned value as useful only after closure."], "Earned value combines scope, schedule, and cost information for performance insight."),
    bp("Resource calendar", "ECO Domain II Task 2 - schedule planning", "resource calendars show availability constraints for people or equipment", "Check resource calendars before committing dependent work dates.", ["Assume all resources are available every day.", "Ignore equipment downtime because the schedule baseline exists.", "Use resource calendars only for holidays."], "Availability affects feasible scheduling and resource commitments."),
    bp("Dependency management", "ECO Domain II Task 2 - project schedule", "dependencies determine feasible order and coordination needs", "Identify mandatory, discretionary, and external dependencies before sequencing work.", ["Hide external dependencies until they delay the project.", "Treat all dependencies as optional preferences.", "Start successor work before required predecessor output exists."], "Dependency management keeps schedules realistic."),
    bp("Milestone schedule", "ECO Domain II Task 2 - project schedule", "milestone schedules communicate key checkpoints and decision points", "Use milestones to communicate significant checkpoints without replacing detailed activity planning.", ["Use milestones to hide missing activities.", "Turn every small task into a sponsor milestone.", "Ignore milestone movement because only tasks matter."], "Milestones are useful summary points for communication and control."),
    bp("Acceptance signoff", "ECO Domain II Task 3 - predictive controls", "formal acceptance verifies that deliverables meet agreed criteria", "Obtain acceptance against agreed criteria before closing or transitioning the deliverable.", ["Assume silence means formal acceptance.", "Skip signoff because the team believes the output is good.", "Ask for acceptance before verification evidence exists."], "Formal acceptance protects both the team and customer by confirming expectations were met."),
    bp("Document control", "ECO Domain II Task 3 - predictive artifacts", "document control keeps approved records current, accessible, and versioned", "Use document control so stakeholders work from the current approved information.", ["Let each team member maintain a private version of the plan.", "Delete older versions without traceability.", "Approve changes verbally and never update records."], "Controlled documents reduce confusion and support auditability."),
    bp("Inspection and verification", "ECO Domain II Task 2 - quality management plan", "inspection verifies deliverables against requirements and standards", "Inspect the deliverable against requirements, standards, and acceptance criteria.", ["Inspect only the team's effort level.", "Use inspection to avoid stakeholder acceptance.", "Skip verification when the deliverable looks finished."], "Verification checks whether the output meets specified requirements."),
    bp("Control thresholds", "ECO Domain II Task 3 - document project controls", "thresholds define when variance needs attention or escalation", "Use control thresholds to decide when variance requires action or escalation.", ["Escalate every tiny variance with equal urgency.", "Ignore all variance until the final deadline.", "Set thresholds after the issue is already solved."], "Thresholds help teams focus management attention on meaningful variance."),
  ],
  agile: [
    bp("Adaptive lifecycle fit", "ECO Domain III Task 1 - agile suitability", "adaptive lifecycles fit uncertainty, learning, and frequent feedback", "Use an adaptive approach when requirements are evolving and feedback should shape the product.", ["Choose adaptive only to avoid planning.", "Freeze every requirement before learning from users.", "Use adaptive ceremonies while blocking all change."], "Agile approaches help teams learn and adapt when the product direction is uncertain."),
    bp("Agile values", "ECO Domain III Task 1 - agile mindset", "agile values collaboration, working outcomes, feedback, and adaptability", "Favor collaboration, working increments, customer feedback, and response to change.", ["Value documentation so much that feedback is delayed indefinitely.", "Treat change as failure even when learning improves value.", "Avoid customer collaboration once the backlog exists."], "Agile mindset emphasizes people, collaboration, working outcomes, and adaptability."),
    bp("Scrum roles", "ECO Domain III Task 2 - agile roles", "Scrum roles separate product value, process facilitation, and delivery accountability", "Clarify whether the product owner, Scrum Master, or developers should act.", ["Ask the Scrum Master to reorder the product backlog for business value.", "Make the product owner assign daily tasks to developers.", "Let stakeholders bypass the product owner for sprint commitments."], "Scrum roles have distinct accountabilities that protect focus and value."),
    bp("Product owner prioritization", "ECO Domain III Task 2 - product owner", "the product owner orders backlog items to maximize product value", "Have the product owner order the backlog using value, risk, dependencies, and feedback.", ["Let the loudest stakeholder set priority without tradeoff discussion.", "Let developers ignore business value when ordering work.", "Freeze backlog order permanently after the first planning meeting."], "The product owner is accountable for maximizing value through backlog ordering."),
    bp("Scrum Master servant leadership", "ECO Domain III Task 2 - Scrum Master", "the Scrum Master facilitates Scrum, removes impediments, and coaches the team", "Use servant leadership to coach the team and remove impediments.", ["Command the team by assigning every task personally.", "Ignore process problems because the team is self-managing.", "Replace the product owner in all value decisions."], "The Scrum Master helps the team improve its process without taking over product decisions."),
    bp("Self-organizing team", "ECO Domain III Task 2 - agile team responsibilities", "agile teams decide how to accomplish committed work", "Let the team organize how to complete the work while keeping goals visible.", ["Have the sponsor assign each developer's hourly task.", "Remove team ownership because uncertainty exists.", "Prevent the team from raising delivery constraints."], "Self-managing teams own how work is done within agreed goals."),
    bp("Product backlog", "ECO Domain III Task 3 - product backlog", "the product backlog is an ordered list of potential product value", "Refine and order the product backlog to make value and tradeoffs visible.", ["Use the backlog as a random storage place for every idea forever.", "Treat completed invoices as product backlog items.", "Prevent backlog changes after customer learning."], "The backlog evolves as the team learns about value, risk, and needs."),
    bp("Sprint backlog", "ECO Domain III Task 3 - sprint backlog", "the sprint backlog represents selected work and the plan for the sprint goal", "Use the sprint backlog to show selected work and the team's plan for the sprint.", ["Let external stakeholders add sprint work at any time.", "Use the sprint backlog as a long-term portfolio roadmap.", "Hide sprint work so blockers stay invisible."], "The sprint backlog supports focus during the iteration."),
    bp("Backlog refinement", "ECO Domain III Task 3 - backlog refinement", "refinement improves clarity, size, order, and readiness of backlog items", "Refine backlog items so upcoming work is clearer, smaller, and better ordered.", ["Wait until sprint planning to discover every unclear requirement.", "Refine only completed work.", "Use refinement to bypass product owner decisions."], "Refinement helps teams prepare valuable work without overcommitting too early."),
    bp("Sprint planning", "ECO Domain III Task 3 - agile planning", "sprint planning selects a sprint goal and work based on capacity and priority", "Use sprint planning to agree on a sprint goal and feasible selected work.", ["Commit to all stakeholder requests regardless of capacity.", "Start the sprint without a goal.", "Let the team select work unrelated to backlog priority."], "Sprint planning creates focus for the iteration."),
    bp("Daily standup", "ECO Domain III Task 3 - agile events", "daily standups inspect progress toward the sprint goal and surface blockers", "Use the daily standup to coordinate progress and impediments against the sprint goal.", ["Turn the standup into a status report only for management.", "Ignore blockers because the meeting must be short.", "Use the standup to reprioritize the entire product roadmap daily."], "The daily standup helps the team inspect and adapt near-term work."),
    bp("Sprint review", "ECO Domain III Task 3 - agile events", "sprint reviews inspect the increment and gather stakeholder feedback", "Use the sprint review to inspect the increment and adapt future product direction.", ["Use the review only to blame developers.", "Hide unfinished assumptions from stakeholders.", "Replace stakeholder feedback with internal guesses."], "Sprint reviews create feedback on delivered product value."),
    bp("Retrospective", "ECO Domain III Task 3 - agile events", "retrospectives inspect and adapt the team's way of working", "Use the retrospective to identify process improvements for the next iteration.", ["Use the retrospective to change product priority without the product owner.", "Skip improvement discussions if the increment was accepted.", "Collect complaints without choosing an action."], "Retrospectives help teams improve collaboration, quality, and flow."),
    bp("Definition of done", "ECO Domain III Task 3 - quality in agile", "definition of done creates shared completeness and quality expectations", "Check the definition of done before calling the work complete.", ["Declare work done because coding started.", "Let every team member use a private quality standard.", "Use the definition of done to avoid customer feedback."], "A shared definition of done reduces hidden unfinished work."),
    bp("Increment", "ECO Domain III Task 3 - increments", "increments should be usable and inspectable", "Deliver a usable increment that can be inspected for feedback.", ["Wait for the entire product before showing anything usable.", "Show only slides instead of inspectable product when feedback is needed.", "Hide integration gaps until final release."], "Increments support feedback, learning, and progress visibility."),
    bp("User stories", "ECO Domain III Task 3 - agile requirements", "user stories express role, need, and value", "Clarify the user, need, and value behind the backlog item.", ["Write only a technical task with no user outcome.", "Use user stories to end all future conversations.", "Describe work only from the sponsor's title."], "User stories keep work connected to users and value."),
    bp("Acceptance criteria in agile", "ECO Domain III Task 3 - acceptance criteria", "acceptance criteria describe conditions for story acceptance", "Use acceptance criteria to confirm whether the story satisfies the intended need.", ["Accept the story because it was difficult to build.", "Define criteria after the review if stakeholders complain.", "Use criteria that cannot be observed or tested."], "Acceptance criteria make expectations testable."),
    bp("Relative estimation", "ECO Domain III Task 4 - agile estimating", "relative estimation compares effort, complexity, and uncertainty", "Estimate relatively by comparing size, complexity, and uncertainty with known work.", ["Use estimates to punish individual team members.", "Demand exact hour certainty for highly uncertain work.", "Ignore uncertainty because the story looks small."], "Relative estimation supports planning without pretending all uncertainty is knowable."),
    bp("Velocity forecasting", "ECO Domain III Task 4 - agile planning", "velocity helps forecast based on observed team throughput", "Use observed velocity carefully as a planning input, not a guarantee.", ["Promise future delivery by doubling velocity without evidence.", "Compare teams only by velocity points.", "Treat one sprint's velocity as a permanent contract."], "Velocity is useful for forecasting when interpreted with context."),
    bp("Kanban WIP limits", "ECO Domain III Task 4 - Kanban and flow", "work-in-progress limits expose bottlenecks and improve flow", "Limit work in progress to reveal bottlenecks and help work finish.", ["Start more work whenever people feel busy.", "Hide blocked items to make the board look better.", "Remove WIP limits when queues get long."], "Kanban flow improves when teams stop starting too much and focus on finishing."),
    bp("Kanban board", "ECO Domain III Task 4 - Kanban visualization", "visualizing work reveals status, queues, blockers, and flow", "Use a Kanban board to make workflow, blockers, and queues visible.", ["Use the board only after all work is finished.", "Track work privately so the team avoids difficult discussions.", "Visualize only completed work and hide bottlenecks."], "Visual management helps teams see flow and improve it."),
    bp("Cycle time", "ECO Domain III Task 4 - flow metrics", "cycle time measures how long work takes once started", "Use cycle time trends to identify flow problems and improvement opportunities.", ["Measure only how many meetings were held.", "Ignore long review queues because tasks eventually close.", "Use cycle time to blame one person without process analysis."], "Flow metrics help teams improve delivery predictability."),
    bp("Timeboxing", "ECO Domain III Task 4 - agile cadence", "timeboxes create focus, feedback rhythm, and decision boundaries", "Respect the timebox and adapt scope or learning within that cadence.", ["Extend every iteration until all possible work is complete.", "Use timeboxes only when work is already predictable.", "Ignore feedback until many timeboxes pass."], "Timeboxing supports regular inspection and adaptation."),
    bp("Stakeholder feedback", "ECO Domain III Task 5 - stakeholder engagement", "frequent feedback helps validate value and adjust direction", "Invite stakeholder feedback on working results and use it to adapt priorities.", ["Avoid feedback because it may create change.", "Ask for feedback only after funding is exhausted.", "Collect feedback but never let it influence the backlog."], "Agile delivery uses feedback to reduce the risk of building the wrong thing."),
    bp("Minimum viable product", "ECO Domain III Task 5 - incremental value", "an MVP tests value with the smallest useful learning release", "Use a minimum viable product to learn quickly about value and assumptions.", ["Build every possible feature before asking users anything.", "Call an incomplete unusable fragment an MVP.", "Use MVP thinking to avoid quality expectations."], "MVP thinking reduces waste by learning with a small useful release."),
    bp("Adaptive risk management", "ECO Domain III Task 5 - agile risk", "adaptive delivery reduces risk through short feedback cycles and visible learning", "Use short cycles and feedback to reduce uncertainty and expose risk early.", ["Wait until the final release to discover whether assumptions were wrong.", "Hide uncertainty because agile teams should be confident.", "Treat new learning as a failure of planning."], "Adaptive work manages uncertainty through frequent inspection."),
    bp("Built-in quality", "ECO Domain III Task 3 - agile quality", "quality should be built into each increment, not inspected only at the end", "Build quality practices into the team's regular work and definition of done.", ["Save all testing for after many sprints.", "Accept low quality because agile values speed.", "Use demos as the only quality control."], "Agile quality depends on regular practices that keep increments usable."),
    bp("Burndown and burnup", "ECO Domain III Task 4 - agile information radiators", "burndown and burnup charts visualize work remaining or completed", "Use the chart to discuss progress trends and possible adaptation.", ["Use the chart to shame the team.", "Treat the chart as a replacement for conversation.", "Ignore trend changes because the sprint goal exists."], "Agile charts support transparency and planning conversations."),
    bp("Team working agreements", "ECO Domain III Task 2 - agile team norms", "working agreements make collaboration expectations explicit", "Create or revisit working agreements when collaboration friction appears.", ["Let hidden assumptions define team behavior.", "Use working agreements only for vendor contracts.", "Ignore agreements once conflict starts."], "Working agreements help agile teams coordinate behavior and expectations."),
    bp("Agile change management", "ECO Domain III Task 5 - responding to change", "change is handled through product ownership, backlog ordering, and feedback", "Route new learning through backlog refinement and product ownership decisions.", ["Interrupt the sprint with every new idea automatically.", "Freeze the backlog forever after kickoff.", "Let each stakeholder add work directly to developers."], "Agile welcomes useful change through disciplined backlog and priority decisions."),
  ],
  business: [
    bp("Stakeholder identification", "ECO Domain IV Task 1 - business analysis stakeholders", "stakeholders include people with needs, influence, decisions, or impact", "Identify all relevant stakeholders before finalizing requirements or validation plans.", ["Invite only the loudest requester.", "Ignore external users because they are not on the project team.", "Document only the project manager as stakeholder."], "Stakeholder identification prevents missing needs, decisions, and impacts."),
    bp("Stakeholder analysis", "ECO Domain IV Task 1 - stakeholder analysis", "analysis clarifies interests, influence, needs, and engagement strategy", "Analyze stakeholder influence, interest, needs, and communication expectations.", ["Treat all stakeholders as identical.", "Engage only low-conflict stakeholders.", "Use job titles as the only analysis input."], "Stakeholder analysis guides elicitation, communication, and decision strategy."),
    bp("Interviews", "ECO Domain IV Task 2 - elicitation techniques", "interviews gather detailed information from individuals or small groups", "Use interviews when deep individual insight or sensitive detail is needed.", ["Use interviews to avoid documenting requirements.", "Ask only leading questions that confirm the team's idea.", "Replace every collaborative workshop with one executive interview."], "Interviews are useful for focused discovery and clarification."),
    bp("Workshops", "ECO Domain IV Task 2 - elicitation techniques", "workshops bring stakeholders together to discover, compare, and resolve needs", "Use a facilitated workshop when shared understanding or conflict resolution is needed.", ["Run a workshop with no purpose or decision topic.", "Invite only people who already agree.", "Use workshops to skip follow-up documentation."], "Workshops help groups align and surface conflicts."),
    bp("Surveys", "ECO Domain IV Task 2 - elicitation techniques", "surveys gather input from many people efficiently", "Use a survey when broad input is needed from a distributed audience.", ["Use a survey to resolve every complex conflict alone.", "Ask ambiguous questions and treat results as precise proof.", "Survey only one person and call it representative."], "Surveys help collect patterns across larger groups."),
    bp("Observation", "ECO Domain IV Task 2 - elicitation techniques", "observation reveals how work actually happens", "Observe users performing the work to discover real process needs and gaps.", ["Rely only on policy documents when actual work differs.", "Observe secretly in a way that violates trust.", "Use observation to avoid speaking with users."], "Observation can reveal hidden steps, workarounds, and pain points."),
    bp("Document analysis", "ECO Domain IV Task 2 - elicitation techniques", "document analysis extracts requirements and constraints from existing records", "Review existing documents to find rules, requirements, gaps, and assumptions.", ["Assume old documents are always complete and current.", "Ignore document conflicts because they are inconvenient.", "Use document analysis as the only stakeholder engagement."], "Document analysis is useful but should be checked against current stakeholder reality."),
    bp("Requirements documentation", "ECO Domain IV Task 3 - requirements documentation", "requirements must be clear, testable, traceable, and agreed", "Document requirements in clear, testable language with ownership and context.", ["Write requirements so vague that any result could pass.", "Keep requirements only in verbal memory.", "Document solutions before understanding the need."], "Good requirements documentation supports shared understanding and validation."),
    bp("Requirement types", "ECO Domain IV Task 3 - requirement categories", "business, stakeholder, solution, and transition requirements answer different questions", "Classify the requirement type so the team manages it appropriately.", ["Treat transition needs as optional technical tasks.", "Mix business goals and detailed solution behavior without distinction.", "Ignore stakeholder requirements once solution requirements exist."], "Requirement types help organize analysis and prevent gaps."),
    bp("Requirements traceability", "ECO Domain IV Task 3 - traceability", "traceability links requirements to source, design, tests, and delivery status", "Use traceability to connect each requirement to its source, work, and validation evidence.", ["Use traceability only after defects appear.", "Track requirements without sources or test evidence.", "Replace stakeholder communication with a traceability table."], "Traceability shows whether approved needs are built and validated."),
    bp("Acceptance criteria", "ECO Domain IV Task 3 - acceptance criteria", "acceptance criteria define observable conditions for approval", "Write acceptance criteria that make successful delivery observable and testable.", ["Accept work because effort was high.", "Use criteria that stakeholders cannot observe.", "Create criteria only after the product fails."], "Acceptance criteria make requirements testable and reduce argument at review time."),
    bp("Requirements validation", "ECO Domain IV Task 3 - validation", "validation confirms requirements satisfy stakeholder and business needs", "Validate requirements with stakeholders to confirm they describe the right need.", ["Validate only after the solution is deployed.", "Ask no stakeholders because the document looks polished.", "Validate formatting instead of business fit."], "Validation asks whether the requirement is right and valuable."),
    bp("Requirements verification", "ECO Domain IV Task 3 - verification", "verification checks that requirements are clear, complete, consistent, and testable", "Verify requirements for quality before using them for delivery work.", ["Verify only whether the font is consistent.", "Proceed with contradictory requirements because the schedule is tight.", "Assume every stated desire is complete."], "Verification asks whether requirements are written well enough to use."),
    bp("User stories", "ECO Domain IV Task 3 - user stories", "user stories connect role, need, and value", "Describe the user, desired capability, and reason the need matters.", ["Write only system components with no user value.", "Use stories to stop all future conversation.", "Hide the user role because technical work is enough."], "User stories help teams discuss value from a user's perspective."),
    bp("Personas", "ECO Domain IV Task 2 - analysis models", "personas summarize user goals, behaviors, and needs", "Use personas to reason about representative user needs and behavior patterns.", ["Create personas from stereotypes with no evidence.", "Use one persona to erase all user differences.", "Treat personas as approval signatures."], "Personas are analysis tools for understanding user groups."),
    bp("Process modeling", "ECO Domain IV Task 2 - analysis models", "process models show workflow, handoffs, decisions, and pain points", "Model the process to reveal steps, decisions, handoffs, and improvement opportunities.", ["Model only the final screen and ignore workflow.", "Use process models to avoid stakeholder review.", "Assume the current process is correct because it exists."], "Process models help teams understand how work flows today or should flow in the future."),
    bp("Data modeling", "ECO Domain IV Task 2 - analysis models", "data models clarify information, relationships, and rules", "Use data modeling to clarify key information, relationships, and business rules.", ["Treat data as a technical detail with no business meaning.", "Skip data rules until after migration fails.", "Use data models to replace acceptance criteria."], "Data modeling supports clarity about information the solution must handle."),
    bp("Interface analysis", "ECO Domain IV Task 2 - analysis models", "interface analysis identifies interactions between systems, people, and processes", "Analyze interfaces to clarify handoffs, data exchange, and integration expectations.", ["Assume every system connects automatically.", "Ignore manual handoffs because they are not code.", "Document only one side of an integration."], "Interfaces often create hidden requirements and risks."),
    bp("MoSCoW prioritization", "ECO Domain IV Task 4 - requirements prioritization", "MoSCoW separates must, should, could, and will-not needs", "Use MoSCoW or a similar technique to make priority tradeoffs explicit.", ["Label every request as must-have forever.", "Prioritize by the person who speaks last.", "Use categories without explaining tradeoff criteria."], "Prioritization helps teams make constrained release decisions."),
    bp("Value-risk-dependency prioritization", "ECO Domain IV Task 4 - prioritization", "priority should consider value, urgency, risk, dependency, and feasibility", "Prioritize by balancing value, risk, dependencies, urgency, and stakeholder impact.", ["Prioritize only by easiest implementation.", "Ignore dependencies until work is blocked.", "Rank work only by seniority of requester."], "Good prioritization uses multiple decision factors."),
    bp("Product roadmap", "ECO Domain IV Task 4 - roadmaps", "roadmaps communicate product direction, themes, and release intent", "Use the roadmap to align stakeholders on product direction and release themes.", ["Treat the roadmap as a fixed task timesheet.", "Hide roadmap changes from affected stakeholders.", "Use the roadmap instead of validating value."], "Roadmaps communicate direction while still needing ongoing learning."),
    bp("Product vision", "ECO Domain IV Task 1 - business need and product direction", "product vision explains the target outcome and who benefits", "Clarify the product vision so requirements connect to the intended outcome.", ["Start detailed features before understanding the outcome.", "Use vision statements as decoration only.", "Let every stakeholder hold a different hidden vision."], "A clear product vision helps align decisions around value."),
    bp("Business case", "ECO Domain IV Task 1 - business need", "the business case explains why the investment should be made", "Use the business case to understand expected value, costs, risks, and rationale.", ["Treat the business case as irrelevant after kickoff.", "Use the business case to avoid measuring benefits.", "Approve features that contradict the investment rationale."], "The business case anchors work in value and justification."),
    bp("Benefits measurement", "ECO Domain IV Task 5 - solution evaluation", "benefits measurement checks whether expected outcomes are being realized", "Define and review measures that show whether expected benefits are occurring.", ["Measure only the number of requirements written.", "Assume benefits appear automatically after deployment.", "Avoid benefit measures because they might challenge assumptions."], "Benefits measurement connects delivery to business outcomes."),
    bp("Solution evaluation", "ECO Domain IV Task 5 - solution performance", "solution evaluation checks whether the solution meets the business need", "Evaluate solution performance against the business need and expected outcomes.", ["Stop analysis when development begins.", "Evaluate only whether the code was difficult.", "Ignore low adoption if requirements were technically built."], "Solution evaluation asks whether the delivered solution works for the business."),
    bp("Gap analysis", "ECO Domain IV Task 1 - current and future state", "gap analysis compares current state with desired future state", "Use gap analysis to identify what must change to reach the desired state.", ["Document only the future state and ignore current constraints.", "Assume gaps are all technology problems.", "Close gaps by removing business objectives."], "Gap analysis clarifies the distance between current reality and target outcome."),
    bp("Change impact analysis", "ECO Domain IV Task 4 - change and impact", "change impact analysis identifies effects on requirements, stakeholders, processes, and value", "Analyze the impact before approving or rejecting a requirement change.", ["Approve every change because it sounds useful.", "Reject every change without understanding impact.", "Consider only technical effort and ignore users."], "Impact analysis supports informed tradeoff decisions."),
    bp("Requirements lifecycle management", "ECO Domain IV Task 3 - requirements lifecycle", "requirements need ongoing ownership, status, traceability, and change control", "Manage requirement status, ownership, traceability, and changes across the lifecycle.", ["Freeze requirement records even when approved changes occur.", "Lose ownership after elicitation is complete.", "Track only new requirements and ignore retired ones."], "Lifecycle management keeps requirements useful after initial discovery."),
    bp("Backlog management", "ECO Domain IV Task 4 - backlog and prioritization", "backlog management keeps product work ordered, clear, and value-focused", "Keep backlog items refined, ordered, and connected to stakeholder value.", ["Use the backlog as a dumping ground with no order.", "Let every requester bypass backlog decisions.", "Keep stale items forever without review."], "Backlog management supports transparent prioritization."),
    bp("Nonfunctional requirements", "ECO Domain IV Task 3 - solution requirements", "nonfunctional requirements describe quality attributes and constraints", "Elicit and document quality attributes such as performance, security, usability, and reliability.", ["Ignore nonfunctional needs until users complain.", "Treat security as outside business analysis.", "Record only visible screen features as requirements."], "Nonfunctional requirements can determine whether a solution is acceptable."),
    bp("Assumptions and constraints in BA", "ECO Domain IV Task 1 - assumptions and constraints", "assumptions and constraints shape requirements and solution options", "Document assumptions and constraints so decisions can be tested and managed.", ["Hide assumptions because they may be wrong.", "Treat constraints as optional preferences.", "Let assumptions silently become requirements."], "Business analysis should make assumptions and constraints visible."),
    bp("Readiness and transition", "ECO Domain IV Task 5 - transition and readiness", "transition readiness prepares users, operations, support, and adoption", "Check readiness for users, operations, training, support, and adoption before handoff.", ["Declare the solution ready when development stops.", "Ignore support ownership until after launch.", "Assume users will adopt without preparation."], "Transition planning helps the solution become usable in the real environment."),
  ],
} satisfies Record<DomainId, Blueprint[]>;

export const questionBlueprintCount = domainIds.reduce((count, domainId) => count + blueprintCatalog[domainId].length, 0);

const settings: Record<DomainId, string[]> = {
  fundamentals: [
    "a campus registration upgrade",
    "a nonprofit reporting initiative",
    "a hospital onboarding project",
    "a regional office relocation",
    "a customer support improvement effort",
    "a finance policy rollout",
    "a municipal service redesign",
    "a product launch preparation cycle",
    "a training academy setup",
    "a data cleanup initiative",
    "a vendor transition project",
    "a compliance dashboard effort",
  ],
  predictive: [
    "a regulated payment platform rollout",
    "a warehouse automation installation",
    "a construction permit workflow project",
    "a call-center migration project",
    "a manufacturing quality upgrade",
    "a fixed-scope reporting system",
    "a government records modernization",
    "a supplier onboarding program",
    "a laboratory equipment replacement",
    "a payroll system conversion",
    "a facility security enhancement",
    "a contract-driven integration project",
  ],
  agile: [
    "a mobile app discovery team",
    "a digital claims product squad",
    "a customer portal agile team",
    "a marketing analytics Kanban team",
    "a startup product experiment",
    "a subscription platform squad",
    "a service design iteration",
    "a learning platform Scrum team",
    "a data product pilot",
    "a support automation flow team",
    "a retail checkout experiment",
    "a healthcare scheduling squad",
  ],
  business: [
    "a benefits enrollment product",
    "a field-service workflow redesign",
    "a claims intake analysis effort",
    "a university advising portal",
    "a procurement approval redesign",
    "a customer identity project",
    "a medical records access initiative",
    "a sales reporting product",
    "a warehouse returns process",
    "a grant management platform",
    "a travel booking workflow",
    "a service desk knowledge product",
  ],
};

const roles: Record<DomainId, string[]> = {
  fundamentals: [
    "the project coordinator",
    "the associate project manager",
    "the project lead",
    "the team facilitator",
    "the junior project manager",
    "the delivery coordinator",
  ],
  predictive: [
    "the project scheduler",
    "the control account lead",
    "the project manager",
    "the quality coordinator",
    "the planning analyst",
    "the vendor manager",
  ],
  agile: [
    "the Scrum Master",
    "the product owner",
    "a developer on the team",
    "the agile coach",
    "the Kanban service lead",
    "the iteration facilitator",
  ],
  business: [
    "the business analyst",
    "the product analyst",
    "the requirements lead",
    "the solution analyst",
    "the BA practitioner",
    "the product discovery lead",
  ],
};

const stakeholders = [
  "the sponsor",
  "an operations manager",
  "a customer representative",
  "a compliance reviewer",
  "a finance partner",
  "a support lead",
  "a vendor contact",
  "a product stakeholder",
  "an executive reviewer",
  "a user group lead",
  "a quality specialist",
  "a regional manager",
];

const artifacts: Record<DomainId, string[]> = {
  fundamentals: [
    "the charter notes",
    "the stakeholder register",
    "the risk log",
    "the communications matrix",
    "the benefits summary",
    "the closure checklist",
    "the meeting action list",
    "the lessons-learned draft",
  ],
  predictive: [
    "the approved baseline",
    "the WBS dictionary",
    "the integrated schedule",
    "the change log",
    "the quality checklist",
    "the procurement file",
    "the issue log",
    "the variance report",
  ],
  agile: [
    "the product backlog",
    "the sprint backlog",
    "the Kanban board",
    "the definition of done",
    "the review notes",
    "the retrospective actions",
    "the burnup chart",
    "the story map",
  ],
  business: [
    "the requirements traceability matrix",
    "the stakeholder map",
    "the elicitation notes",
    "the acceptance criteria",
    "the process model",
    "the product roadmap",
    "the business case",
    "the solution evaluation report",
  ],
};

const signals: Record<DomainId, string[]> = {
  fundamentals: [
    "a decision owner is unclear",
    "a risk is being discussed as if it already happened",
    "stakeholders disagree about the expected benefit",
    "a meeting ends without actions",
    "the team is mixing ongoing support with temporary work",
    "a sensitive update is being softened for leadership",
    "a transition owner has not been named",
    "resource availability is based on an assumption",
  ],
  predictive: [
    "a requested change touches scope, schedule, and cost",
    "a predecessor activity is slipping",
    "actual spending is diverging from planned value",
    "inspection results do not match acceptance criteria",
    "a supplier asks to alter contracted work",
    "multiple teams are using different plan versions",
    "a milestone moved without impact analysis",
    "quality defects are rising near handoff",
  ],
  agile: [
    "stakeholders want to add work during the sprint",
    "review feedback changes the product direction",
    "work piles up in the review column",
    "the team disagrees about whether a story is done",
    "velocity is being treated as a promise",
    "users reject an assumption after seeing an increment",
    "the backlog contains several vague high-priority items",
    "the retrospective keeps producing no action",
  ],
  business: [
    "a user group was missed during elicitation",
    "requirements conflict across departments",
    "acceptance evidence is missing for a feature",
    "a solution works technically but adoption is low",
    "a roadmap promise no longer matches business value",
    "several requirements lack a clear source",
    "nonfunctional needs appear late in testing",
    "a process workaround reveals an unstated need",
  ],
};

const constraints = [
  "the review window is short",
  "funding cannot increase this quarter",
  "the launch date is visible to customers",
  "audit evidence must be preserved",
  "the team is distributed across time zones",
  "a vendor contract limits informal changes",
  "leadership wants a decision today",
  "support teams need a clear handoff",
  "regulatory expectations are strict",
  "the team has limited specialist availability",
  "stakeholders are pushing for faster delivery",
  "the baseline has already been approved",
];

const outcomes = [
  "customer value",
  "regulatory confidence",
  "team focus",
  "benefit realization",
  "delivery transparency",
  "stakeholder trust",
  "controlled change",
  "usable increments",
  "operational readiness",
  "scope clarity",
  "learning speed",
  "quality evidence",
];

const pressureActions = [
  "move forward using the available information",
  "make the decision during the current checkpoint",
  "keep the current delivery path moving",
  "treat the stakeholder concern as the next priority",
  "record a provisional direction for the team",
  "defer the broader tradeoff to the next review",
  "let the sponsor settle the immediate disagreement",
  "update the working plan after the meeting",
  "use the latest feedback as the main decision input",
  "protect the committed date while the details are clarified",
  "turn the discussion into a short action plan",
  "continue with the planned handoff and monitor the concern",
];

const threadWords = [
  "amber",
  "blue",
  "copper",
  "drift",
  "ember",
  "focal",
  "granite",
  "harbor",
  "ivory",
  "jade",
  "keystone",
  "lumen",
  "metro",
  "north",
  "onyx",
  "prime",
  "quartz",
  "river",
  "silver",
  "timber",
  "urban",
  "vector",
  "willow",
  "xenon",
  "yellow",
  "zenith",
];

const mockPromptFrames: Record<MockModeId, Record<Difficulty, string[]>> = {
  "real-case": {
    easy: [
      "The facts are mostly direct, but the team still needs a disciplined project response.",
      "The team has enough information to choose a practical next step.",
    ],
    medium: [
      "Several normal project concerns are present, and the team needs a response that fits the evidence.",
      "The team needs a practical next step that fits the role, artifact, and stakeholder need.",
    ],
    hard: [
      "Multiple actions could move the work forward, but the timing and ownership matter.",
      "Delivery pressure is rising, and the response needs to preserve value and disciplined execution.",
    ],
  },
  "beyond-real": {
    easy: [
      "The case is compact, and the team must choose from several reasonable actions.",
      "The situation looks simple, but the lifecycle context changes the better response.",
    ],
    medium: [
      "Predictive control, adaptive feedback, and stakeholder value are pulling on the same decision.",
      "A fast decision would help momentum, but the next step still needs enough evidence.",
    ],
    hard: [
      "Several reasonable actions compete, and the best response depends on timing and evidence.",
      "The team is balancing momentum, uncertainty, expectations, and delivery flow.",
    ],
  },
  "must-fail": {
    easy: [
      "The situation includes pressure, but the team still has enough facts to act.",
      "Several stakeholders want movement, and the team needs to choose a grounded response.",
    ],
    medium: [
      "The team is receiving conflicting signals from stakeholders, delivery evidence, and timing pressure.",
      "The best option must survive timing, ethics, lifecycle, and value checks.",
    ],
    hard: [
      "The scenario mixes useful actions with difficult timing and ownership constraints.",
      "The scenario mixes partial evidence, role confusion, external pressure, and timing ambiguity.",
    ],
  },
};

const mockSettings: Record<MockModeId, string[]> = {
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

function pick<T>(items: T[], seed: number) {
  return items[seed % items.length];
}

function lowerFirst(value: string) {
  return value.charAt(0).toLowerCase() + value.slice(1).replace(/\.$/, "");
}

function upperFirst(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function normalizeConcept(value: string) {
  return value
    .toLowerCase()
    .replace(/^the\s+/, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const clueStopWords = new Set([
  "project",
  "review",
  "decision",
  "response",
  "stakeholder",
  "checkpoint",
  "delivery",
  "evidence",
  "working",
  "current",
  "planned",
  "question",
  "document",
  "manager",
  "customer",
  "information",
  "because",
  "during",
  "should",
  "available",
  "scenario",
  "simulation",
]);

function significantTerms(value: string) {
  return normalizeConcept(value)
    .split(" ")
    .filter((word) => word.length >= 7 && !clueStopWords.has(word));
}

function leaksTopic(value: string, topic: string) {
  const normalizedValue = normalizeConcept(value);
  const normalizedTopic = normalizeConcept(topic);
  return normalizedValue.includes(normalizedTopic) || normalizedTopic.includes(normalizedValue);
}

function leaksAnswerTerm(value: string, answer: string) {
  const answerTerms = new Set(significantTerms(answer));
  return significantTerms(value).some((word) => answerTerms.has(word));
}

function pickWithoutTopicLeak(items: string[], seed: number, topic: string, answer = "") {
  let index = seed % items.length;
  let choice = items[index];
  let guard = 0;

  while ((leaksTopic(choice, topic) || (answer && leaksAnswerTerm(choice, answer))) && guard < items.length) {
    index = (index + 1) % items.length;
    choice = items[index];
    guard += 1;
  }

  return choice;
}

function caseThread(index: number) {
  const totalThreads = threadWords.length * threadWords.length * threadWords.length;
  const scrambledIndex = (index * 7919 + 104729) % totalThreads;
  const first = threadWords[scrambledIndex % threadWords.length];
  const second = threadWords[Math.floor(scrambledIndex / threadWords.length) % threadWords.length];
  const third = threadWords[Math.floor(scrambledIndex / (threadWords.length * threadWords.length)) % threadWords.length];
  return `${first}-${second}-${third}`;
}

const answerPositionPermutations = [
  [0, 2, 3, 1],
  [1, 3, 0, 2],
  [2, 0, 1, 3],
  [3, 1, 2, 0],
  [0, 3, 1, 2],
  [2, 1, 3, 0],
  [1, 0, 2, 3],
  [3, 2, 0, 1],
];

function balancedCorrectIndex(sequenceIndex: number, seedInput: string) {
  const permutation = pick(answerPositionPermutations, hashSeed(`${seedInput}:${Math.floor(sequenceIndex / 4)}`));
  return permutation[sequenceIndex % 4];
}

function shuffledDistractors(items: ChoiceDraft[], seedInput: string) {
  const shuffled = items.filter((item) => !item.correct);
  let seed = hashSeed(seedInput);

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    seed = nextSeed(seed);
    const swapIndex = seed % (index + 1);
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

function shuffleOptions(items: ChoiceDraft[], seedInput: string, sequenceIndex: number) {
  const correct = items.find((item) => item.correct);
  if (!correct) {
    throw new Error("Question options must include one correct answer.");
  }

  const correctIndex = balancedCorrectIndex(sequenceIndex, seedInput);
  const distractors = shuffledDistractors(items, seedInput);
  const options: string[] = [];
  const optionRationales: string[] = [];

  for (let index = 0; index < items.length; index += 1) {
    if (index === correctIndex) {
      options.push(correct.text);
      optionRationales.push(correct.rationale);
    } else {
      const distractor = distractors.shift();
      if (!distractor) {
        throw new Error("Question options must include three distractors.");
      }
      options.push(distractor.text);
      optionRationales.push(distractor.rationale);
    }
  }

  return {
    options,
    correctIndex,
    optionRationales,
  };
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

function buildCaseDetails({
  domainId,
  difficulty,
  blueprint,
  globalIndex,
  bank,
  mode,
}: {
  domainId: DomainId;
  difficulty: Difficulty;
  blueprint: Blueprint;
  globalIndex: number;
  bank: "practice" | "mock";
  mode?: MockModeId;
}): CaseDetails {
  let seed = hashSeed(`${bank}:${mode ?? "practice"}:${domainId}:${difficulty}:${globalIndex}:${blueprint.topic}`);
  const next = () => {
    seed = nextSeed(seed);
    return seed;
  };
  const topic = blueprint.topic;
  const answerText = blueprint.correct;
  const setting = pickWithoutTopicLeak(bank === "mock" && mode ? mockSettings[mode] : settings[domainId], next(), topic, answerText);
  const artifact = pickWithoutTopicLeak(artifacts[domainId], next(), topic, answerText);
  const signal = pickWithoutTopicLeak(signals[domainId], next(), topic, answerText);
  const constraint = pickWithoutTopicLeak(constraints, next(), topic, answerText);

  return {
    thread: caseThread(globalIndex),
    setting,
    role: pickWithoutTopicLeak(roles[domainId], next(), topic, answerText),
    stakeholder: pickWithoutTopicLeak(stakeholders, next(), topic, answerText),
    artifact,
    signal,
    constraint,
    outcome: pickWithoutTopicLeak(outcomes, next(), topic, answerText),
    trap: pickWithoutTopicLeak(pressureActions, next(), topic, answerText),
  };
}

function sanitizeOptionText(value: string) {
  return lowerFirst(value)
    .replace(/\.$/, "")
    .replace(/\balways\b/gi, "consistently")
    .replace(/\bnever\b/gi, "not")
    .replace(/\bonly\b/gi, "primarily")
    .replace(/\bevery\b/gi, "each relevant")
    .replace(/\ball relevant\b/gi, "relevant")
    .replace(/\ball\b/gi, "the relevant")
    .replace(/\bignore\b/gi, "set aside")
    .replace(/\bskip\b/gi, "defer")
    .replace(/\bdelete\b/gi, "retire")
    .replace(/\bhide\b/gi, "withhold")
    .replace(/\brandomly\b/gi, "without a stated basis")
    .replace(/\bsilently\b/gi, "without visibility")
    .replace(/\bloudest\b/gi, "most vocal")
    .replace(/\s+/g, " ")
    .trim();
}

function selectPeerBlueprints(domainId: DomainId, blueprint: Blueprint, globalIndex: number, difficulty: Difficulty) {
  const candidates = blueprintCatalog[domainId].filter((candidate) => candidate.topic !== blueprint.topic);
  const offsets = difficulty === "easy" ? [3, 8, 14] : difficulty === "medium" ? [5, 11, 17] : [7, 13, 23];
  const selected: Blueprint[] = [];

  for (const offset of offsets) {
    let candidate = candidates[(globalIndex + offset) % candidates.length];
    let guard = 0;
    while (selected.includes(candidate) && guard < candidates.length) {
      candidate = candidates[(globalIndex + offset + guard + 1) % candidates.length];
      guard += 1;
    }
    selected.push(candidate);
  }

  return selected.slice(0, 3);
}

function buildOptions({
  domainId,
  blueprint,
  details,
  difficulty,
  globalIndex,
  bank,
  mode,
}: {
  domainId: DomainId;
  blueprint: Blueprint;
  details: CaseDetails;
  difficulty: Difficulty;
  globalIndex: number;
  bank: "practice" | "mock";
  mode?: MockModeId;
}) {
  const cleanAction = sanitizeOptionText(blueprint.correct);
  const checkpoint = pick(
    [
      "the next checkpoint",
      "the decision record",
      "the team follow-up",
      "the stakeholder review",
      "the working plan",
      "the delivery discussion",
    ],
    globalIndex + details.thread.length,
  );
  const peerBlueprints = selectPeerBlueprints(domainId, blueprint, globalIndex, difficulty);
  const toChoiceText = (action: string) =>
    `Review ${details.artifact}; ${upperFirst(sanitizeOptionText(action))}. Document the decision, owner, and next step in ${checkpoint}.`;
  const choices: ChoiceDraft[] = [
    {
      text: toChoiceText(cleanAction),
      correct: true,
      flawType: "key",
      rationale: `This is the strongest choice because it applies ${blueprint.principle} to the evidence in ${details.artifact}.`,
      lureStrength: 1,
    },
    ...peerBlueprints.map((peer, offset) => ({
      text: toChoiceText(peer.correct),
      correct: false,
      flawType: (["timing", "role", "evidence", "lifecycle", "governance"] as ChoiceDraft["flawType"][])[offset],
      rationale: `This can be a valid action for ${peer.topic.toLowerCase()}, but the case evidence is pointing to ${blueprint.principle}.`,
      lureStrength: difficulty === "hard" ? 5 - offset : 3 - Math.min(offset, 1),
    })),
  ];

  return shuffleOptions(
    choices,
    `${bank}:${mode ?? "practice"}:${globalIndex}:${blueprint.topic}:${details.setting}:${details.signal}`,
    globalIndex,
  );
}

function buildPracticePrompt(blueprint: Blueprint, difficulty: Difficulty, details: CaseDetails) {
  if (difficulty === "easy") {
    return `In ${details.setting}, ${details.role} reviews ${details.artifact} after ${details.signal} in the ${details.thread} workstream. Which response is the best next step?`;
  }

  if (difficulty === "medium") {
    return `During ${details.setting}, ${details.stakeholder} asks ${details.role} for a decision in the ${details.thread} checkpoint because ${details.signal}. With ${details.constraint}, what should happen next?`;
  }

  return `The team in ${details.setting} faces the ${details.thread} case while under pressure from ${details.outcome}, ${details.constraint}, and ${details.signal}. ${details.stakeholder} suggests to ${details.trap}. Which response handles the situation most effectively?`;
}

function buildMockPrompt(
  blueprint: Blueprint,
  difficulty: Difficulty,
  details: CaseDetails,
  mode: MockModeId,
  globalIndex: number,
) {
  const frame = pickWithoutTopicLeak(
    mockPromptFrames[mode][difficulty],
    globalIndex + details.signal.length,
    blueprint.topic,
    blueprint.correct,
  );

  if (mode === "real-case") {
    return `Simulation case during the ${details.setting}, ${details.thread} checkpoint: ${frame} ${upperFirst(details.stakeholder)} asks ${details.role} to choose a next step. Evidence from ${details.artifact} shows ${details.signal}, and ${details.constraint}. Which response fits the case best?`;
  }

  if (mode === "beyond-real") {
    return `Advanced simulation during the ${details.setting}, ${details.thread} checkpoint: ${frame} ${upperFirst(details.role)} sees ${details.signal} while ${details.stakeholder} pushes to ${details.trap}. The available evidence is ${details.artifact}, and ${details.constraint}. What is the best CAPM-aligned response?`;
  }

  return `Pressure-test case during the ${details.setting}, ${details.thread} checkpoint: ${frame} ${details.outcome} conflicts with ${details.signal}, ${details.constraint}, and a request to ${details.trap}. Which answer is most defensible?`;
}

function buildExplanation(blueprint: Blueprint, details: CaseDetails, bank: "practice" | "mock", mode?: MockModeId) {
  const modeLabel = mode ? mockModes.find((item) => item.id === mode)?.label : undefined;
  const caseReason = `Here, ${details.artifact} and the signal that ${details.signal} point back to ${blueprint.principle}.`;

  if (bank === "mock" && modeLabel) {
    return `${blueprint.explanation} ${caseReason} In ${modeLabel}, reject choices that sound useful but skip timing, evidence, role clarity, or value.`;
  }

  return `${blueprint.explanation} ${caseReason}`;
}

function selectBlueprint(domainId: DomainId, difficulty: Difficulty, index: number, globalIndex: number) {
  const domainBlueprints = blueprintCatalog[domainId];
  const offset = difficulty === "easy" ? 0 : difficulty === "medium" ? 5 : 11;
  return domainBlueprints[(index + globalIndex + offset) % domainBlueprints.length];
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
  const blueprint = selectBlueprint(domainId, difficulty, index, globalIndex);
  const details = buildCaseDetails({ domainId, difficulty, blueprint, globalIndex, bank, mode });
  const { options, correctIndex, optionRationales } = buildOptions({
    domainId,
    blueprint,
    details,
    difficulty,
    globalIndex,
    bank,
    mode,
  });
  const id =
    bank === "practice"
      ? `practice-${domainId}-${difficulty}-${String(index + 1).padStart(4, "0")}`
      : `mock-${mode}-${domainId}-${String(index + 1).padStart(3, "0")}`;

  return {
    id,
    bank,
    mockMode: mode,
    domainId,
    difficulty,
    topic: blueprint.topic,
    prompt:
      bank === "mock" && mode
        ? buildMockPrompt(blueprint, difficulty, details, mode, globalIndex)
        : buildPracticePrompt(blueprint, difficulty, details),
    options,
    correctIndex,
    optionRationales,
    explanation: buildExplanation(blueprint, details, bank, mode),
    sourceTopic: blueprint.sourceTopic,
    bonus: bank === "practice" && difficulty === "hard" && index % 9 === 0,
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
