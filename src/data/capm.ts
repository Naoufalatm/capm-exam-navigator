import type { DomainId, Lesson } from "../types";

export const examFacts = [
  { label: "Questions", value: "150", detail: "135 scored, 15 unscored pretest items" },
  { label: "Time", value: "180 min", detail: "Optional tutorial and survey do not count" },
  { label: "Break", value: "10 min", detail: "After question 75; section 1 becomes locked" },
  { label: "Attempts", value: "3", detail: "Within the one-year eligibility period" },
];

export const domains: Array<{
  id: DomainId;
  name: string;
  shortName: string;
  weight: number;
  color: string;
  description: string;
}> = [
  {
    id: "fundamentals",
    name: "Project Management Fundamentals and Core Concepts",
    shortName: "Fundamentals",
    weight: 36,
    color: "bg-ocean",
    description:
      "Project language, value delivery, lifecycle choices, project roles, ethics, communication, and common tools.",
  },
  {
    id: "predictive",
    name: "Predictive, Plan-Based Methodologies",
    shortName: "Predictive",
    weight: 17,
    color: "bg-mint",
    description:
      "Scope, WBS, schedule, cost, quality, integration, change control, baselines, and plan-driven tracking.",
  },
  {
    id: "agile",
    name: "Agile Frameworks/Methodologies",
    shortName: "Agile",
    weight: 20,
    color: "bg-sun",
    description:
      "Adaptive delivery, Scrum/Kanban/XP/SAFe recognition, backlogs, iterations, task flow, and agile controls.",
  },
  {
    id: "business",
    name: "Business Analysis Frameworks",
    shortName: "Business Analysis",
    weight: 27,
    color: "bg-coral",
    description:
      "Stakeholders, requirements elicitation, communication, product roadmaps, acceptance criteria, and traceability.",
  },
];

export const opportunities = [
  "Qualify more confidently for project coordinator, project analyst, project administrator, and assistant project manager roles.",
  "Show employers that you understand predictive, agile, and business-analysis ways of working.",
  "Build a foundation for future PMI credentials such as PMP after gaining more project leadership experience.",
  "Speak the shared language of sponsors, product owners, business analysts, project managers, and delivery teams.",
];

export const officialSources = [
  {
    title: "PMI CAPM Certification",
    url: "https://www.pmi.org/certifications/certified-associate-capm",
  },
  {
    title: "PMI CAPM Exam Prep",
    url: "https://www.pmi.org/certifications/certified-associate-capm/exam-prep",
  },
  {
    title: "CAPM Exam Content Outline",
    url: "https://www.pmi.org/-/media/pmi/documents/public/pdf/certifications/capm-exam-content-outline-english.pdf",
  },
  {
    title: "PMI Certification Handbook",
    url: "https://www.pmi.org/-/media/pmi/documents/public/pdf/certifications/generic-certification-handbook.pdf",
  },
  {
    title: "PMI Exam Security",
    url: "https://www.pmi.org/certifications/certification-resources/exam-security",
  },
];

export const lessons: Lesson[] = [
  {
    id: "fundamentals-roles",
    domainId: "fundamentals",
    title: "CAPM and Project Roles",
    summary:
      "CAPM proves foundation-level project knowledge. It helps new practitioners understand sponsors, project managers, teams, product owners, and business analysts.",
    examples: ["A sponsor funds and champions work.", "A project manager coordinates delivery and constraints."],
    artifacts: ["Stakeholder register", "Responsibility assignment matrix", "Project charter"],
  },
  {
    id: "fundamentals-value",
    domainId: "fundamentals",
    title: "Projects, Value, and Ethics",
    summary:
      "A project creates a unique result. CAPM questions often ask how value, ethics, risk, assumptions, and closure influence decisions.",
    examples: ["A project ends when deliverables are accepted.", "Ethical action favors transparency over hiding issues."],
    artifacts: ["Benefits plan", "Assumption log", "Lessons learned register"],
  },
  {
    id: "predictive-scope",
    domainId: "predictive",
    title: "Plan-Based Scope and Schedule",
    summary:
      "Predictive work benefits from stable requirements. Scope is decomposed into a WBS, then scheduled and controlled against baselines.",
    examples: ["A WBS breaks deliverables into work packages.", "Critical path delay can delay the project finish."],
    artifacts: ["WBS", "Schedule baseline", "Change log"],
  },
  {
    id: "predictive-control",
    domainId: "predictive",
    title: "Control and Change",
    summary:
      "Predictive teams compare actual performance to the plan, analyze variance, and route changes through appropriate control.",
    examples: ["SPI below 1.0 indicates schedule underperformance.", "A baseline change needs approval."],
    artifacts: ["Cost baseline", "Quality checklist", "Issue log"],
  },
  {
    id: "agile-foundations",
    domainId: "agile",
    title: "Adaptive Mindset",
    summary:
      "Agile approaches fit changing needs. Teams deliver increments, inspect results, adapt plans, and collaborate closely with customers.",
    examples: ["A sprint review inspects the increment.", "A retrospective improves team process."],
    artifacts: ["Product backlog", "Sprint backlog", "Definition of done"],
  },
  {
    id: "agile-flow",
    domainId: "agile",
    title: "Agile Flow and Frameworks",
    summary:
      "CAPM expects recognition of Scrum, Kanban, XP, SAFe, prioritization, and adaptive tracking tools.",
    examples: ["Kanban limits work in progress.", "A burnup chart shows progress toward total scope."],
    artifacts: ["Kanban board", "Burnup chart", "Burndown chart"],
  },
  {
    id: "business-requirements",
    domainId: "business",
    title: "Business Analysis and Requirements",
    summary:
      "Business analysis connects stakeholder needs to project outcomes through elicitation, prioritization, traceability, and validation.",
    examples: ["Workshops gather requirements from groups.", "Acceptance criteria define how a requirement is validated."],
    artifacts: ["Requirements traceability matrix", "Use case", "User story"],
  },
  {
    id: "business-roadmap",
    domainId: "business",
    title: "Roadmaps and Delivery Readiness",
    summary:
      "Product roadmaps organize releases and value. Teams validate that requirements are met before delivery.",
    examples: ["A roadmap groups features by release.", "A backlog can replace a formal traceability matrix in adaptive work."],
    artifacts: ["Product roadmap", "Product backlog", "Acceptance criteria"],
  },
];
