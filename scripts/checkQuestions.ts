import {
  getMockStats,
  getQuestionStats,
  mockModes,
  mockQuestionBank,
  practiceQuestionBank,
  selectMockExamQuestions,
} from "../src/data/questions";
import type { Difficulty, DomainId } from "../src/types";

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

const practiceStats = getQuestionStats(practiceQuestionBank);
assertEqual("practice total", practiceStats.total, expectedPractice.total);

for (const [domain, count] of Object.entries(expectedPractice.byDomain)) {
  assertEqual(`practice ${domain}`, practiceStats.byDomain[domain as DomainId], count);
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
  for (const domain of Object.keys(expectedPractice.byDomain) as DomainId[]) {
    assertNoCorrectAnswerCycle(
      `${mode.id} ${domain} mock`,
      selected.filter((question) => question.domainId === domain),
    );
  }
}

const forbidden = /free-braindumps|braindumps|real exam questions|actual exam dump/i;
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
