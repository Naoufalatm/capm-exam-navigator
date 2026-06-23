import {
  getMockStats,
  getQuestionStats,
  mockModes,
  mockQuestionBank,
  practiceQuestionBank,
  questionBlueprintCount,
  selectMockExamQuestions,
} from "../src/data/questions";
import type { Difficulty, DomainId, Question } from "../src/types";

const expectedPractice = {
  total: 2400,
  byDomain: { fundamentals: 864, predictive: 408, agile: 480, business: 648 },
  byDifficulty: { easy: 960, medium: 960, hard: 480 },
};

function assertEqual(label: string, actual: number, expected: number) {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${expected}, received ${actual}`);
  }
}

function assertNoCorrectAnswerCycle(label: string, questions: Array<{ id: string; correctIndex: number }>) {
  const windowSize = 8;
  for (let start = 0; start <= questions.length - windowSize; start += 1) {
    const first = questions[start].correctIndex;
    const isCycle = questions
      .slice(start, start + windowSize)
      .every((question, offset) => question.correctIndex === (first + offset) % 4);

    if (isCycle) {
      throw new Error(
        `${label}: predictable correct-answer position cycle starts at ${questions[start].id}`,
      );
    }
  }
}

function normalizePrompt(prompt: string) {
  return prompt
    .toLowerCase()
    .replace(/\b(?:practice|simulation|advanced simulation|pressure-test|mock|case|item)\b/g, " ")
    .replace(/\b(?:case|question)\s+[a-z0-9-]+\b/g, " ")
    .replace(/\b\d+\b/g, "#")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function assertUniquePrompts(label: string, questions: Question[]) {
  const seen = new Map<string, string>();
  for (const question of questions) {
    const previous = seen.get(question.prompt);
    if (previous) {
      throw new Error(`${label}: exact prompt overlap between ${previous} and ${question.id}`);
    }
    seen.set(question.prompt, question.id);
  }
}

function assertUniqueNormalizedPrompts(label: string, questions: Question[]) {
  const seen = new Map<string, string>();
  for (const question of questions) {
    const normalized = normalizePrompt(question.prompt);
    const previous = seen.get(normalized);
    if (previous) {
      throw new Error(`${label}: normalized prompt overlap between ${previous} and ${question.id}: ${normalized}`);
    }
    seen.set(normalized, question.id);
  }
}

function assertMinimumBlueprintCoverage(label: string, questions: Question[], expectedMinimum: number) {
  const uniqueTopicSources = new Set(questions.map((question) => `${question.sourceTopic}::${question.topic}`));
  if (uniqueTopicSources.size < expectedMinimum) {
    throw new Error(`${label}: expected at least ${expectedMinimum} unique topic/source blueprints, found ${uniqueTopicSources.size}`);
  }
}

function assertAnswerDistribution(label: string, questions: Question[]) {
  if (questions.length < 100) return;

  const counts = [0, 0, 0, 0];
  for (const question of questions) {
    counts[question.correctIndex] += 1;
  }

  const min = Math.floor(questions.length * 0.17);
  const max = Math.ceil(questions.length * 0.33);
  counts.forEach((count, index) => {
    if (count < min || count > max) {
      throw new Error(`${label}: answer ${index} appears ${count} times; expected between ${min} and ${max}`);
    }
  });
}

const giveawayOptionTerms =
  /\b(always|never|only|every|all|randomly|silently|delete|hide|ignore|skip|loudest|guess|blame|punish|shame|forever|automatically)\b/i;
const teachingSuffix = /(^|[.!?]\s+)This\s+(is|would|sounds|skips|keeps|matches|gives|addresses|overreacts|treats|may)\b/i;
const promptLeakage = /\b(best reflects|best addresses|item is testing|tested through|which answer survives|the trap is|distractor)\b/i;
const clangStopWords = new Set([
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

function wordCount(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function significantTerms(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length >= 7 && !clangStopWords.has(word));
}

function assertOptionQuality(label: string, questions: Question[]) {
  for (const question of questions) {
    if (question.options.length !== 4) {
      throw new Error(`${label}: ${question.id} expected 4 answer options`);
    }

    if (!question.optionRationales || question.optionRationales.length !== question.options.length) {
      throw new Error(`${label}: ${question.id} must include one rationale per answer option`);
    }

    const lengths = question.options.map(wordCount);
    const maxLength = Math.max(...lengths);
    const minLength = Math.min(...lengths);
    if (maxLength - minLength > 10) {
      throw new Error(`${label}: ${question.id} option length spread is ${maxLength - minLength} words`);
    }

    const correctLength = lengths[question.correctIndex];
    const distractorAverage =
      lengths.filter((_, index) => index !== question.correctIndex).reduce((sum, length) => sum + length, 0) / 3;
    if (Math.abs(correctLength - distractorAverage) > 8) {
      throw new Error(`${label}: ${question.id} correct answer length stands out`);
    }

    question.options.forEach((option, optionIndex) => {
      if (teachingSuffix.test(option)) {
        throw new Error(`${label}: ${question.id} option ${optionIndex + 1} contains an explanatory teaching suffix`);
      }
      if (giveawayOptionTerms.test(option)) {
        throw new Error(`${label}: ${question.id} option ${optionIndex + 1} contains giveaway wording: ${option}`);
      }
    });

    const distractorCueCount = question.options.filter(
      (option, index) => index !== question.correctIndex && giveawayOptionTerms.test(option),
    ).length;
    const correctHasCue = giveawayOptionTerms.test(question.options[question.correctIndex]);
    if (distractorCueCount === 3 && !correctHasCue) {
      throw new Error(`${label}: ${question.id} has three cue-heavy distractors and a clean correct answer`);
    }

    for (const term of new Set(significantTerms(question.prompt))) {
      const matchingOptions = question.options
        .map((option, index) => ({ index, hasTerm: significantTerms(option).includes(term) }))
        .filter((item) => item.hasTerm);
      if (matchingOptions.length === 1 && matchingOptions[0].index === question.correctIndex) {
        throw new Error(`${label}: ${question.id} has clang clue "${term}" only in the correct option`);
      }
    }
  }
}

function assertNoPromptLeakage(label: string, questions: Question[]) {
  for (const question of questions) {
    const prompt = question.prompt.toLowerCase();
    const topic = question.topic.toLowerCase();
    if (promptLeakage.test(prompt)) {
      throw new Error(`${label}: ${question.id} contains prompt leakage wording`);
    }
    if (prompt.includes(topic)) {
      throw new Error(`${label}: ${question.id} prompt reveals topic "${question.topic}"`);
    }
  }
}

const practiceStats = getQuestionStats(practiceQuestionBank);
assertEqual("practice total", practiceStats.total, expectedPractice.total);
assertEqual("question blueprint count", questionBlueprintCount, 124);
assertMinimumBlueprintCoverage("practice blueprint coverage", practiceQuestionBank, 120);
assertUniquePrompts("practice prompts", practiceQuestionBank);
assertUniqueNormalizedPrompts("practice normalized prompts", practiceQuestionBank);
assertAnswerDistribution("practice answer distribution", practiceQuestionBank);
assertOptionQuality("practice answer quality", practiceQuestionBank);
assertNoPromptLeakage("practice prompt leakage", practiceQuestionBank);

for (const [domain, count] of Object.entries(expectedPractice.byDomain)) {
  assertEqual(`practice ${domain}`, practiceStats.byDomain[domain as DomainId], count);
  assertAnswerDistribution(
    `practice ${domain} answer distribution`,
    practiceQuestionBank.filter((question) => question.domainId === domain),
  );
}

for (const [difficulty, count] of Object.entries(expectedPractice.byDifficulty)) {
  assertEqual(`practice ${difficulty}`, practiceStats.byDifficulty[difficulty as Difficulty], count);
}

assertNoCorrectAnswerCycle("practice all questions", practiceQuestionBank);
for (const domain of Object.keys(expectedPractice.byDomain) as DomainId[]) {
  assertNoCorrectAnswerCycle(
    `practice ${domain} all difficulties`,
    practiceQuestionBank.filter((question) => question.domainId === domain),
  );
  for (const difficulty of Object.keys(expectedPractice.byDifficulty) as Difficulty[]) {
    assertNoCorrectAnswerCycle(
      `practice ${domain} ${difficulty}`,
      practiceQuestionBank.filter((question) => question.domainId === domain && question.difficulty === difficulty),
    );
  }
}

const practiceIds = new Set(practiceQuestionBank.map((question) => question.id));
const mockIds = new Set(mockQuestionBank.map((question) => question.id));
const overlappingId = [...mockIds].find((id) => practiceIds.has(id));
if (overlappingId) {
  throw new Error(`Mock question overlaps with practice question id: ${overlappingId}`);
}

const practicePrompts = new Set(practiceQuestionBank.map((question) => question.prompt));
const overlappingPrompt = mockQuestionBank.find((question) => practicePrompts.has(question.prompt));
if (overlappingPrompt) {
  throw new Error(`Mock question prompt overlaps with practice prompt: ${overlappingPrompt.id}`);
}

const practiceNormalizedPrompts = new Set(practiceQuestionBank.map((question) => normalizePrompt(question.prompt)));
const overlappingNormalizedPrompt = mockQuestionBank.find((question) => practiceNormalizedPrompts.has(normalizePrompt(question.prompt)));
if (overlappingNormalizedPrompt) {
  throw new Error(`Mock question normalized prompt overlaps with practice prompt: ${overlappingNormalizedPrompt.id}`);
}

assertUniquePrompts("mock prompts", mockQuestionBank);
assertUniqueNormalizedPrompts("mock normalized prompts", mockQuestionBank);
assertAnswerDistribution("mock answer distribution", mockQuestionBank);
assertOptionQuality("mock answer quality", mockQuestionBank);
assertNoPromptLeakage("mock prompt leakage", mockQuestionBank);

const mockStats = getMockStats();
for (const mode of mockModes) {
  const selected = selectMockExamQuestions(mode.id);
  assertEqual(`${mode.id} selected mock total`, selected.length, 150);
  assertEqual(`${mode.id} mock stats total`, mockStats[mode.id].total, 150);
  assertEqual(`${mode.id} fundamentals`, mockStats[mode.id].byDomain.fundamentals, 54);
  assertEqual(`${mode.id} predictive`, mockStats[mode.id].byDomain.predictive, 26);
  assertEqual(`${mode.id} agile`, mockStats[mode.id].byDomain.agile, 30);
  assertEqual(`${mode.id} business`, mockStats[mode.id].byDomain.business, 40);
  assertNoCorrectAnswerCycle(`${mode.id} mock`, selected);
  assertUniquePrompts(`${mode.id} mock prompts`, selected);
  assertUniqueNormalizedPrompts(`${mode.id} mock normalized prompts`, selected);
  assertAnswerDistribution(`${mode.id} mock answer distribution`, selected);
  for (const domain of Object.keys(expectedPractice.byDomain) as DomainId[]) {
    assertNoCorrectAnswerCycle(
      `${mode.id} ${domain} mock`,
      selected.filter((question) => question.domainId === domain),
    );
  }
}

const forbidden = /free-braindumps|braindumps|real exam questions|actual exam dump|leaked content|copied content|confidential questions/i;
const copied = [...practiceQuestionBank, ...mockQuestionBank].find((question) =>
  forbidden.test(`${question.prompt} ${question.explanation}`),
);
if (copied) {
  throw new Error(`Forbidden content marker found in ${copied.id}`);
}

console.log(
  JSON.stringify(
    {
      practice: practiceStats,
      mocks: mockStats,
    },
    null,
    2,
  ),
);
