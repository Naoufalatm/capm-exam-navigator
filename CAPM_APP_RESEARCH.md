# CAPM Web App Research and Product Direction

Research date: 2026-06-19

## Certificate

The certification is PMI's Certified Associate in Project Management (CAPM). It is aimed at people starting in project management, project team members, and people who want proof of foundational project management knowledge without prior project experience.

## Official Sources Checked

- PMI CAPM certification page: https://www.pmi.org/certifications/certified-associate-capm
- PMI CAPM exam prep page: https://www.pmi.org/certifications/certified-associate-capm/exam-prep
- CAPM Exam Content Outline, current official ECO: https://www.pmi.org/-/media/pmi/documents/public/pdf/certifications/capm-exam-content-outline-english.pdf
- PMI Certification Handbook, revised March 2026: https://www.pmi.org/-/media/pmi/documents/public/pdf/certifications/generic-certification-handbook.pdf
- PMI certification maintenance page: https://www.pmi.org/certifications/certification-resources/maintain
- PMI exam security page: https://www.pmi.org/certifications/certification-resources/exam-security
- PMI official CAPM sample questions: https://www.pmi.org/-/media/pmi/documents/public/pdf/certifications/capm-practice-questions_2025.pdf

## Current Exam Facts

- Eligibility: secondary degree such as high school diploma, GED, or global equivalent, plus 23 hours of project management education before the exam.
- Exam length: 150 questions.
- Scored questions: 135.
- Unscored pretest questions: 15, randomly placed.
- Exam time: 180 minutes.
- Break: one 10-minute break after questions 1-75, after review of that section. After the break starts, the candidate cannot return to the previous section.
- Delivery: Pearson VUE test center or secure online proctored testing.
- Attempts: up to three attempts within the one-year eligibility period.
- Question styles: multiple choice, drag-and-drop/enhanced matching, hot spot/hot area, animations, and comic strips. Online proctored candidates see comic strip items instead of animation items to avoid sound issues.
- Languages listed by PMI: English, Arabic, Brazilian Portuguese, French, German, Italian, Japanese, Spanish, Korean, Chinese Simplified, and Chinese Traditional.

## Exam Domains

The app should organize learning and practice around the four official ECO domains:

1. Project Management Fundamentals and Core Concepts - 36%
2. Predictive, Plan-Based Methodologies - 17%
3. Agile Frameworks/Methodologies - 20%
4. Business Analysis Frameworks - 27%

## Core Concepts to Teach

Project management fundamentals:
- Project vs program vs portfolio.
- Project vs operations.
- Predictive vs adaptive approaches.
- Issues, risks, assumptions, and constraints.
- Project scope, closure, transitions, ethics, and benefits.
- Project roles: sponsor, project manager, team, business analyst, product owner.
- Leadership vs management and emotional intelligence.
- Meetings, brainstorming, focus groups, and other problem-solving tools.

Predictive / plan-based:
- When predictive delivery fits.
- Work breakdown structure, work packages, schedule planning, critical path, variance.
- Quality, integration, cost, schedule, and control artifacts.

Agile / adaptive:
- When adaptive delivery fits.
- Iterations, backlogs, adaptive tracking, task prioritization.
- Scrum, Kanban, XP, and SAFe at recognition level.
- Adaptive controls and artifacts.

Business analysis:
- BA roles and stakeholder types.
- Communication channels and requirements conversations.
- Requirements elicitation: interviews, workshops, surveys, user stories, use cases.
- Requirements traceability matrix, product backlog, product roadmap.
- Acceptance criteria and delivery readiness.

## Rules and Ethics the App Must Respect

- Do not use or encourage braindumps, leaked questions, or any source claiming real exam content.
- Any generated practice questions must be original and mapped to ECO domains, not copied from exam dumps.
- The platform should teach from official concepts and simulate the exam format without pretending to reproduce the real exam.
- Show a short ethics notice before mock exams: PMI exams are confidential; practice content here is original study material.

## Notes on Existing Resource Links

The current `linksRessources.txt` contains third-party practice sites. They may be useful for market research and feature comparison, but they should not be treated as source-of-truth content.

Important warning: `free-braindumps.com` should be excluded from content ingestion and from learner recommendations. PMI explicitly treats disclosed exam questions/content as confidential and warns against misconduct.

## Product Idea: CAPM Exam Navigator

Build a learning and practice platform that helps a learner understand the CAPM before drilling questions. The core promise:

> "Know what the CAPM tests, understand the project-management language, then train with realistic original practice."

Suggested first version:

- Dashboard with exam readiness score, domain progress, study streak, and next recommended lesson.
- Exam map showing the four domains with weights and task-level progress.
- Concept library with concise cards, examples, and "predictive vs agile vs BA" comparisons.
- Scenario trainer that asks short project situations and explains why an answer fits.
- Formula and artifact lab for WBS, critical path, variance, risk register, stakeholder register, backlog, roadmap, and acceptance criteria.
- Mock exam mode: 150-question timed simulation with a 10-minute break after question 75.
- Quick drills by domain and by weak concept.
- Question review with explanations, confidence rating, and retry scheduling.
- Exam rules page covering eligibility, attempts, break behavior, scheduling choices, security, and renewal.
- Renewal tracker after passing: 15 PDUs over 3 years, with at least 9 Education PDUs, no more than 6 Giving Back PDUs, and at least 2 PDUs in each Talent Triangle area.

## Suggested Data Model

- `Domain`: name, weight, official tasks, progress.
- `Concept`: title, domain, summary, examples, related artifacts, source references.
- `Question`: prompt, choices, answer, explanation, domain, task, difficulty, tags, format.
- `MockExamSession`: startedAt, timeRemaining, breakUsed, answers, score, domainScore.
- `StudyPlan`: examDate, weeklyHours, weakDomains, recommendedLessons.
- `Source`: title, url, publisher, official, checkedAt.

## MVP Screens

1. Home dashboard
2. CAPM exam overview and official rules
3. Domain map
4. Concept lesson page
5. Practice drill
6. Full mock exam simulator
7. Results and remediation plan
8. Source library

## Build Direction

Start with a static knowledge app plus local question bank. Keep content structured as JSON or Markdown so it can be reviewed, updated, and sourced cleanly. Later, add accounts, spaced repetition, analytics, generated practice variants, and admin tools for maintaining the question bank.
