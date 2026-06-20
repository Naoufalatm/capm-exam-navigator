export type DomainId = "fundamentals" | "predictive" | "agile" | "business";

export type Difficulty = "easy" | "medium" | "hard";

export type QuestionBank = "practice" | "mock";

export type MockModeId = "real-case" | "beyond-real" | "must-fail";

export type Question = {
  id: string;
  domainId: DomainId;
  difficulty: Difficulty;
  bank?: QuestionBank;
  mockMode?: MockModeId;
  topic: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  sourceTopic: string;
  bonus?: boolean;
};

export type Lesson = {
  id: string;
  domainId: DomainId;
  title: string;
  summary: string;
  examples: string[];
  artifacts: string[];
};

export type ScoreBreakdown = Record<string, { correct: number; total: number }>;

export type MissedQuestionReview = {
  questionId: string;
  prompt: string;
  chosenAnswer: string;
  correctAnswer: string;
  explanation: string;
  domainId: DomainId;
  difficulty: Difficulty;
  topic: string;
};

export type ProgressState = {
  completedLessons: string[];
  answered: Record<string, boolean>;
  confidence: Record<string, number>;
  incorrectQueue: string[];
  mockHistory: MockResult[];
};

export type MockResult = {
  id: string;
  date: string;
  modeId?: MockModeId;
  modeLabel?: string;
  startedAt?: string;
  completedAt?: string;
  secondsUsed?: number;
  score: number;
  total: number;
  unansweredCount?: number;
  domainScores: Record<DomainId, { correct: number; total: number }>;
  difficultyScores?: Record<Difficulty, { correct: number; total: number }>;
  topicScores?: ScoreBreakdown;
  missedQuestions?: MissedQuestionReview[];
};
