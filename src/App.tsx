import {
  Award,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Compass,
  Eye,
  EyeOff,
  Flag,
  GraduationCap,
  Layers3,
  Lock,
  LogIn,
  LogOut,
  Play,
  RefreshCcw,
  ShieldCheck,
  Target,
  Trophy,
  XCircle,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { domains, examFacts, lessons, officialSources, opportunities } from "./data/capm";
import { getQuestionStats, mockModes, practiceQuestionBank, selectMockExamQuestions } from "./data/questions";
import type { Difficulty, DomainId, MockModeId, MockResult, ProgressState, Question } from "./types";

type TabId = "dashboard" | "overview" | "learn" | "practice" | "mock" | "results" | "sources";
type ScreenId = "intro" | "login" | "app";
type PracticeDifficulty = Difficulty | "all";

type MockState = {
  active: boolean;
  questions: Question[];
  currentIndex: number;
  answers: Record<string, number>;
  completed: boolean;
  lockedFirstSection: boolean;
  breakOpen: boolean;
  secondsRemaining: number;
  modeId?: MockModeId;
  modeLabel?: string;
  startedAt?: string;
};

type PracticeSessionState = {
  lastDomain: DomainId;
  lastDifficulty: PracticeDifficulty;
  cursors: Record<string, number>;
  answers: Record<string, number>;
};

const emptyProgress: ProgressState = {
  completedLessons: [],
  answered: {},
  confidence: {},
  incorrectQueue: [],
  mockHistory: [],
};

const emptyMock: MockState = {
  active: false,
  questions: [],
  currentIndex: 0,
  answers: {},
  completed: false,
  lockedFirstSection: false,
  breakOpen: false,
  secondsRemaining: 180 * 60,
};

const tabs: Array<{ id: TabId; label: string; icon: typeof Compass }> = [
  { id: "dashboard", label: "Dashboard", icon: Compass },
  { id: "overview", label: "CAPM Guide", icon: Award },
  { id: "learn", label: "Learn", icon: BookOpen },
  { id: "practice", label: "Practice", icon: Target },
  { id: "mock", label: "Mock Exam", icon: Clock3 },
  { id: "results", label: "Results", icon: BarChart3 },
  { id: "sources", label: "Sources", icon: ShieldCheck },
];

const difficulties: Difficulty[] = ["easy", "medium", "hard"];
const PROGRESS_KEY = "capm-progress-v1";
const PRACTICE_SESSION_KEY = "capm-practice-session-v1";
const AUTH_KEY = "capm-auth-v1";
const VALID_USERNAME = "zaineb aynan";
const VALID_PASSWORD = "testpmp2026@mar.";

const domainNames = Object.fromEntries(domains.map((domain) => [domain.id, domain.shortName])) as Record<DomainId, string>;

function createEmptyPracticeSession(): PracticeSessionState {
  return {
    lastDomain: "fundamentals",
    lastDifficulty: "all",
    cursors: {},
    answers: {},
  };
}

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function pct(value: number, total: number) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function isEmptyProgressState(progress: ProgressState) {
  return (
    progress.completedLessons.length === 0 &&
    Object.keys(progress.answered).length === 0 &&
    Object.keys(progress.confidence).length === 0 &&
    progress.incorrectQueue.length === 0 &&
    progress.mockHistory.length === 0
  );
}

function practiceCursorKey(domainId: DomainId, practiceDifficulty: PracticeDifficulty) {
  return `${domainId}:${practiceDifficulty}`;
}

function isDomainId(value: unknown): value is DomainId {
  return typeof value === "string" && value in domainNames;
}

function isPracticeDifficulty(value: unknown): value is PracticeDifficulty {
  return value === "all" || difficulties.includes(value as Difficulty);
}

function clampPracticeIndex(index: number, total: number) {
  if (!total) return 0;
  return Math.min(Math.max(index, 0), total - 1);
}

function withPracticeCursor(
  session: PracticeSessionState,
  domainId: DomainId,
  practiceDifficulty: PracticeDifficulty,
  index: number,
) {
  const key = practiceCursorKey(domainId, practiceDifficulty);
  const cursors = { ...session.cursors };
  if (index <= 0) {
    delete cursors[key];
  } else {
    cursors[key] = index;
  }

  const cursorChanged = (session.cursors[key] ?? 0) !== index || (index <= 0 && key in session.cursors);
  const lastChanged = session.lastDomain !== domainId || session.lastDifficulty !== practiceDifficulty;
  if (!cursorChanged && !lastChanged) return session;

  return {
    ...session,
    lastDomain: domainId,
    lastDifficulty: practiceDifficulty,
    cursors,
  };
}

function isEmptyPracticeSession(session: PracticeSessionState) {
  return (
    session.lastDomain === "fundamentals" &&
    session.lastDifficulty === "all" &&
    Object.keys(session.cursors).length === 0 &&
    Object.keys(session.answers).length === 0
  );
}

function loadProgress(): ProgressState {
  try {
    const stored = localStorage.getItem(PROGRESS_KEY);
    if (!stored) return emptyProgress;
    return { ...emptyProgress, ...JSON.parse(stored) };
  } catch {
    return emptyProgress;
  }
}

function loadPracticeSession(): PracticeSessionState {
  try {
    const stored = localStorage.getItem(PRACTICE_SESSION_KEY);
    if (!stored) return createEmptyPracticeSession();
    const parsed = JSON.parse(stored) as Partial<PracticeSessionState>;
    const lastDomain = isDomainId(parsed.lastDomain) ? parsed.lastDomain : "fundamentals";
    const lastDifficulty = isPracticeDifficulty(parsed.lastDifficulty) ? parsed.lastDifficulty : "all";
    const cursors = parsed.cursors && typeof parsed.cursors === "object" ? parsed.cursors : {};
    const answers = parsed.answers && typeof parsed.answers === "object" ? parsed.answers : {};

    return {
      lastDomain,
      lastDifficulty,
      cursors: Object.fromEntries(
        Object.entries(cursors)
          .filter(([, value]) => Number.isInteger(value) && value >= 0)
          .map(([key, value]) => [key, value as number]),
      ),
      answers: Object.fromEntries(
        Object.entries(answers)
          .filter(([, value]) => Number.isInteger(value) && value >= 0)
          .map(([key, value]) => [key, value as number]),
      ),
    };
  } catch {
    return createEmptyPracticeSession();
  }
}

function loadAuthScreen(): ScreenId {
  try {
    return localStorage.getItem(AUTH_KEY) === "true" ? "app" : "intro";
  } catch {
    return "intro";
  }
}

function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(loadProgress);

  useEffect(() => {
    if (isEmptyProgressState(progress)) {
      localStorage.removeItem(PROGRESS_KEY);
      return;
    }
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  }, [progress]);

  return [progress, setProgress] as const;
}

function usePracticeSession() {
  const [practiceSession, setPracticeSession] = useState<PracticeSessionState>(loadPracticeSession);

  useEffect(() => {
    if (isEmptyPracticeSession(practiceSession)) {
      localStorage.removeItem(PRACTICE_SESSION_KEY);
      return;
    }
    localStorage.setItem(PRACTICE_SESSION_KEY, JSON.stringify(practiceSession));
  }, [practiceSession]);

  return [practiceSession, setPracticeSession] as const;
}

function App() {
  const [screen, setScreen] = useState<ScreenId>(loadAuthScreen);
  const [tab, setTab] = useState<TabId>("dashboard");
  const [progress, setProgress] = useProgress();
  const [practiceSession, setPracticeSession] = usePracticeSession();
  const [selectedLearnDomain, setSelectedLearnDomain] = useState<DomainId>("fundamentals");
  const [selectedDomain, setSelectedDomain] = useState<DomainId>(() => practiceSession.lastDomain);
  const [difficulty, setDifficulty] = useState<PracticeDifficulty>(() => practiceSession.lastDifficulty);
  const [practiceIndex, setPracticeIndex] = useState(
    () => practiceSession.cursors[practiceCursorKey(practiceSession.lastDomain, practiceSession.lastDifficulty)] ?? 0,
  );
  const [mock, setMock] = useState<MockState>(emptyMock);

  useEffect(() => {
    if (!mock.active || mock.completed || mock.breakOpen) return;
    const interval = window.setInterval(() => {
      setMock((current) => ({ ...current, secondsRemaining: Math.max(0, current.secondsRemaining - 1) }));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [mock.active, mock.completed, mock.breakOpen]);

  const stats = useMemo(() => getQuestionStats(), []);
  const answeredCount = Object.keys(progress.answered).length;
  const correctCount = Object.values(progress.answered).filter(Boolean).length;
  const lessonProgress = pct(progress.completedLessons.length, lessons.length);
  const questionProgress = pct(answeredCount, practiceQuestionBank.length);
  const readiness = Math.min(100, Math.round(lessonProgress * 0.4 + questionProgress * 0.35 + pct(correctCount, Math.max(answeredCount, 1)) * 0.25));

  const practiceQuestions = useMemo(() => {
    const filtered = practiceQuestionBank.filter(
      (question) =>
        question.domainId === selectedDomain && (difficulty === "all" || question.difficulty === difficulty),
    );
    return filtered;
  }, [selectedDomain, difficulty]);

  useEffect(() => {
    setPracticeIndex((index) => clampPracticeIndex(index, practiceQuestions.length));
  }, [practiceQuestions.length]);

  useEffect(() => {
    setPracticeSession((current) => withPracticeCursor(current, selectedDomain, difficulty, practiceIndex));
  }, [difficulty, practiceIndex, selectedDomain, setPracticeSession]);

  const currentPracticeQuestion = practiceQuestions[clampPracticeIndex(practiceIndex, practiceQuestions.length)];
  const selectedPracticeAnswer = currentPracticeQuestion
    ? practiceSession.answers[currentPracticeQuestion.id] ?? null
    : null;
  const showPracticeExplanation = selectedPracticeAnswer !== null;

  function toggleLesson(lessonId: string) {
    setProgress((current) => {
      const exists = current.completedLessons.includes(lessonId);
      return {
        ...current,
        completedLessons: exists
          ? current.completedLessons.filter((id) => id !== lessonId)
          : [...current.completedLessons, lessonId],
      };
    });
  }

  function answerPractice(question: Question, answerIndex: number) {
    const correct = answerIndex === question.correctIndex;
    setPracticeSession((current) => ({
      ...current,
      answers: { ...current.answers, [question.id]: answerIndex },
    }));
    setProgress((current) => {
      const incorrectQueue = correct
        ? current.incorrectQueue.filter((id) => id !== question.id)
        : Array.from(new Set([...current.incorrectQueue, question.id]));
      return {
        ...current,
        answered: { ...current.answered, [question.id]: correct },
        incorrectQueue,
      };
    });
  }

  function nextPracticeQuestion() {
    setPracticeIndex((index) => (index + 1) % practiceQuestions.length);
  }

  function changePracticeDomain(domainId: DomainId) {
    const nextIndex = practiceSession.cursors[practiceCursorKey(domainId, difficulty)] ?? 0;
    setPracticeSession((current) => withPracticeCursor(current, selectedDomain, difficulty, practiceIndex));
    setSelectedDomain(domainId);
    setPracticeIndex(nextIndex);
  }

  function changePracticeDifficulty(nextDifficulty: PracticeDifficulty) {
    const nextIndex = practiceSession.cursors[practiceCursorKey(selectedDomain, nextDifficulty)] ?? 0;
    setPracticeSession((current) => withPracticeCursor(current, selectedDomain, difficulty, practiceIndex));
    setDifficulty(nextDifficulty);
    setPracticeIndex(nextIndex);
  }

  function openMockChooser() {
    setMock(emptyMock);
    setTab("mock");
  }

  function resetProgress() {
    localStorage.removeItem(PROGRESS_KEY);
    localStorage.removeItem(PRACTICE_SESSION_KEY);
    setProgress(emptyProgress);
    setPracticeSession(createEmptyPracticeSession());
    setMock(emptyMock);
    setSelectedDomain("fundamentals");
    setDifficulty("all");
    setPracticeIndex(0);
    setTab("dashboard");
  }

  function startMockExam(modeId: MockModeId) {
    const mode = mockModes.find((item) => item.id === modeId) ?? mockModes[0];
    setMock({
      ...emptyMock,
      modeId,
      modeLabel: mode.label,
      startedAt: new Date().toISOString(),
      active: true,
      questions: selectMockExamQuestions(modeId),
    });
    setTab("mock");
  }

  function exitMockExam() {
    setMock(emptyMock);
    setTab("mock");
  }

  function answerMock(answerIndex: number) {
    const question = mock.questions[mock.currentIndex];
    if (!question) return;
    setMock((current) => ({
      ...current,
      answers: { ...current.answers, [question.id]: answerIndex },
    }));
  }

  function moveMock(delta: number) {
    setMock((current) => {
      const nextIndex = Math.min(Math.max(current.currentIndex + delta, current.lockedFirstSection ? 75 : 0), current.questions.length - 1);
      return { ...current, currentIndex: nextIndex };
    });
  }

  function beginBreak() {
    setMock((current) => ({
      ...current,
      breakOpen: true,
      lockedFirstSection: true,
    }));
  }

  function endBreak() {
    setMock((current) => ({
      ...current,
      breakOpen: false,
      currentIndex: Math.max(current.currentIndex, 75),
    }));
  }

  function finishMock() {
    const domainScores = domains.reduce(
      (acc, domain) => {
        acc[domain.id] = { correct: 0, total: 0 };
        return acc;
      },
      {} as Record<DomainId, { correct: number; total: number }>,
    );
    const difficultyScores = {
      easy: { correct: 0, total: 0 },
      medium: { correct: 0, total: 0 },
      hard: { correct: 0, total: 0 },
    };
    const topicScores: Record<string, { correct: number; total: number }> = {};
    const missedQuestions: MockResult["missedQuestions"] = [];
    let score = 0;
    let unansweredCount = 0;
    for (const question of mock.questions) {
      const selectedAnswer = mock.answers[question.id];
      const isAnswered = selectedAnswer !== undefined;
      const isCorrect = selectedAnswer === question.correctIndex;
      domainScores[question.domainId].total += 1;
      difficultyScores[question.difficulty].total += 1;
      topicScores[question.topic] ??= { correct: 0, total: 0 };
      topicScores[question.topic].total += 1;
      if (!isAnswered) unansweredCount += 1;
      if (isCorrect) {
        score += 1;
        domainScores[question.domainId].correct += 1;
        difficultyScores[question.difficulty].correct += 1;
        topicScores[question.topic].correct += 1;
      } else {
        missedQuestions.push({
          questionId: question.id,
          prompt: question.prompt,
          chosenAnswer: isAnswered ? question.options[selectedAnswer] : "Unanswered",
          correctAnswer: question.options[question.correctIndex],
          explanation: question.explanation,
          domainId: question.domainId,
          difficulty: question.difficulty,
          topic: question.topic,
        });
      }
    }
    const completedAt = new Date().toISOString();
    const result: MockResult = {
      id: crypto.randomUUID(),
      date: completedAt,
      modeId: mock.modeId,
      modeLabel: mock.modeLabel,
      startedAt: mock.startedAt,
      completedAt,
      secondsUsed: 180 * 60 - mock.secondsRemaining,
      score,
      total: mock.questions.length,
      unansweredCount,
      domainScores,
      difficultyScores,
      topicScores,
      missedQuestions,
    };
    setProgress((current) => ({ ...current, mockHistory: [result, ...current.mockHistory].slice(0, 8) }));
    setMock(emptyMock);
    setTab("results");
  }

  function handleLogin(username: string, password: string) {
    const valid = username.trim() === VALID_USERNAME && password === VALID_PASSWORD;
    if (!valid) return false;
    localStorage.setItem(AUTH_KEY, "true");
    setScreen("app");
    setTab("dashboard");
    return true;
  }

  function handleSignOut() {
    localStorage.removeItem(AUTH_KEY);
    setScreen("intro");
    setTab("dashboard");
    setMock(emptyMock);
  }

  if (screen === "intro") {
    return <IntroPage onContinue={() => setScreen("login")} />;
  }

  if (screen === "login") {
    return <LoginPage onBack={() => setScreen("intro")} onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-ocean text-white">
              <GraduationCap size={24} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-ocean">Free CAPM Prep</p>
              <h1 className="text-xl font-black sm:text-2xl">CAPM Exam Navigator</h1>
            </div>
          </div>
          <nav className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:flex">
            {tabs.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={cx(
                    "focus-ring flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-bold transition",
                    tab === item.id
                      ? "border-ocean bg-ocean text-white shadow-panel"
                      : "border-line bg-white text-ink hover:border-ocean hover:text-ocean",
                  )}
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              );
            })}
            <button
              onClick={handleSignOut}
              className="focus-ring flex items-center justify-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm font-bold text-ink transition hover:border-coral hover:text-coral"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {tab === "dashboard" && (
          <Dashboard
            readiness={readiness}
            lessonProgress={lessonProgress}
            questionProgress={questionProgress}
            answeredCount={answeredCount}
            correctCount={correctCount}
            stats={stats}
            onStartMock={openMockChooser}
            onPractice={() => setTab("practice")}
            onResetProgress={resetProgress}
          />
        )}
        {tab === "overview" && <Overview />}
        {tab === "learn" && (
          <Learn progress={progress} selectedDomain={selectedLearnDomain} onDomain={setSelectedLearnDomain} onToggle={toggleLesson} />
        )}
        {tab === "practice" && currentPracticeQuestion && (
          <Practice
            selectedDomain={selectedDomain}
            difficulty={difficulty}
            questions={practiceQuestions}
            question={currentPracticeQuestion}
            index={practiceIndex}
            selectedAnswer={selectedPracticeAnswer}
            showExplanation={showPracticeExplanation}
            onDomain={changePracticeDomain}
            onDifficulty={changePracticeDifficulty}
            onAnswer={answerPractice}
            onNext={nextPracticeQuestion}
          />
        )}
        {tab === "mock" && (
          <MockExam
            mock={mock}
            onStart={startMockExam}
            onAnswer={answerMock}
            onMove={moveMock}
            onBeginBreak={beginBreak}
            onEndBreak={endBreak}
            onFinish={finishMock}
            onExit={exitMockExam}
          />
        )}
        {tab === "results" && <ResultsV2 progress={progress} readiness={readiness} onResetProgress={resetProgress} />}
        {tab === "sources" && <Sources />}
      </main>
    </div>
  );
}

function IntroPage({ onContinue }: { onContinue: () => void }) {
  const [activeDomain, setActiveDomain] = useState<DomainId>("fundamentals");
  const selectedDomain = domains.find((domain) => domain.id === activeDomain) ?? domains[0];
  const scoredQuestions = 135;
  const unscoredQuestions = 15;

  const managementCards = [
    {
      icon: Clock3,
      title: "Pace the clock",
      text: "180 minutes for 150 questions means about 72 seconds per question. Move quickly on simple recognition items and save attention for scenarios.",
    },
    {
      icon: Flag,
      title: "Use flags wisely",
      text: "If an answer is unclear, choose your best option, flag it, and keep moving. Do not let one question steal time from easier points later.",
    },
    {
      icon: RefreshCcw,
      title: "Respect the break",
      text: "After question 75, review that first section before starting the 10-minute break. Once the break starts, questions 1-75 are locked.",
    },
    {
      icon: ShieldCheck,
      title: "Train ethically",
      text: "Use original practice and concept learning. Avoid leaked exam content and braindumps because PMI exam items are confidential.",
    },
  ];

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-ocean text-white">
              <GraduationCap size={24} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-ocean">Before the dashboard</p>
              <h1 className="text-xl font-black sm:text-2xl">CAPM Exam Navigator</h1>
            </div>
          </div>
          <button
            onClick={onContinue}
            className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-ocean px-4 py-3 font-black text-white"
          >
            Continue to login <ChevronRight size={18} />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
        <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-lg border border-line bg-white p-6 shadow-panel">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-mint">Understand first, practice second</p>
            <h2 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">
              CAPM is your map into project work.
            </h2>
            <p className="mt-4 max-w-3xl leading-7 text-slate-700">
              The Certified Associate in Project Management helps beginners prove they understand project language,
              predictive planning, agile delivery, and business analysis. This first page turns the exam rules into a
              clear path before you enter the study dashboard.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {examFacts.map((fact) => (
                <div key={fact.label} className="rounded-lg border border-line bg-paper p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{fact.label}</p>
                  <p className="mt-2 text-2xl font-black">{fact.value}</p>
                  <p className="mt-2 text-sm leading-5 text-slate-600">{fact.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-line bg-ink p-6 text-white shadow-panel">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-sun">Exam composition</p>
            <div className="mt-5 grid grid-cols-[1fr_1fr] gap-4">
              <div className="rounded-lg bg-white/10 p-4">
                <p className="text-4xl font-black">{scoredQuestions}</p>
                <p className="mt-1 text-sm text-slate-200">scored questions</p>
              </div>
              <div className="rounded-lg bg-white/10 p-4">
                <p className="text-4xl font-black">{unscoredQuestions}</p>
                <p className="mt-1 text-sm text-slate-200">unscored pretest questions</p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              <TimelineStep icon={BookOpen} label="Questions 1-75" text="Work steadily, flag uncertain items, then review before the break." />
              <TimelineStep icon={Clock3} label="10-minute break" text="The first section locks when the break begins." />
              <TimelineStep icon={Target} label="Questions 76-150" text="Finish the second section with the same pacing discipline." />
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-line bg-white p-5 shadow-panel">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">Interactive domain map</p>
              <h2 className="text-3xl font-black">Know where the points live</h2>
            </div>
            <p className="text-sm font-bold text-slate-600">Tap a domain to explore it.</p>
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-[0.65fr_0.35fr]">
            <div className="grid gap-3 md:grid-cols-4">
              {domains.map((domain) => (
                <button
                  key={domain.id}
                  onClick={() => setActiveDomain(domain.id)}
                  className={cx(
                    "focus-ring rounded-lg border p-4 text-left transition",
                    activeDomain === domain.id ? "border-ocean bg-blue-50 shadow-panel" : "border-line bg-white hover:border-ocean",
                  )}
                >
                  <div className={cx("h-2 rounded-full", domain.color)} />
                  <p className="mt-3 text-lg font-black">{domain.shortName}</p>
                  <p className="mt-2 text-4xl font-black">{domain.weight}%</p>
                  <ProgressBar value={domain.weight} color={domain.color} />
                </button>
              ))}
            </div>
            <div className="rounded-lg border border-line bg-paper p-5">
              <Layers3 className="text-ocean" size={34} />
              <h3 className="mt-3 text-2xl font-black">{selectedDomain.name}</h3>
              <p className="mt-3 leading-7 text-slate-700">{selectedDomain.description}</p>
              <p className="mt-4 text-sm font-bold text-ocean">
                Study signal: spend roughly {selectedDomain.weight}% of your practice attention here.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[0.35fr_0.65fr]">
          <div className="rounded-lg border border-line bg-white p-5 shadow-panel">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-mint">Future of the certificate</p>
            <h2 className="mt-2 text-3xl font-black">What CAPM can unlock</h2>
            <p className="mt-3 leading-7 text-slate-700">
              CAPM will not replace real experience, but it gives you a shared project language and a credible signal
              for entry-level project roles.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {opportunities.map((item) => (
              <div key={item} className="rounded-lg border border-line bg-white p-4 shadow-panel">
                <CheckCircle2 className="text-mint" size={22} />
                <p className="mt-3 text-sm leading-6 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-line bg-white p-5 shadow-panel">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-ocean">How to manage the exam</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {managementCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.title} className="rounded-lg border border-line p-4">
                  <Icon className="text-ocean" size={24} />
                  <h3 className="mt-3 text-lg font-black">{card.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{card.text}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-5 flex flex-col gap-3 rounded-lg bg-ink p-5 text-white sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-black">Ready to enter the training app?</p>
              <p className="mt-1 text-sm text-slate-200">Login unlocks the dashboard, lessons, drills, and full mock exam.</p>
            </div>
            <button
              onClick={onContinue}
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-sun px-4 py-3 font-black text-ink"
            >
              Continue to login <LogIn size={18} />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

function LoginPage({
  onBack,
  onLogin,
}: {
  onBack: () => void;
  onLogin: (username: string, password: string) => boolean;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const success = onLogin(username, password);
    if (!success) {
      setError("Those credentials did not match. Check the username and password, then try again.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4 py-8 text-ink">
      <section className="grid w-full max-w-5xl gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-line bg-ink p-6 text-white shadow-panel">
          <Lock className="text-sun" size={36} />
          <h1 className="mt-4 text-4xl font-black">Login to start training</h1>
          <p className="mt-4 leading-7 text-slate-200">
            The intro page is public. The dashboard, learning cards, 2400-question practice bank, and mock exam are
            behind this local training gate.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <Metric label="Practice questions" value="2400" />
            <Metric label="Mock exam" value="150" />
            <Metric label="Domains" value="4" />
          </div>
        </div>

        <form onSubmit={submit} className="rounded-lg border border-line bg-white p-6 shadow-panel">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-ocean">Secure local access</p>
          <h2 className="mt-2 text-3xl font-black">Enter your credentials</h2>
          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="text-sm font-black">Username</span>
              <input
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value);
                  setError("");
                }}
                className="focus-ring mt-2 w-full rounded-lg border border-line px-4 py-3 font-bold"
                autoComplete="username"
                placeholder="zaineb aynan"
              />
            </label>
            <label className="block">
              <span className="text-sm font-black">Password</span>
              <div className="mt-2 flex rounded-lg border border-line bg-white">
                <input
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError("");
                  }}
                  className="focus-ring min-w-0 flex-1 rounded-l-lg border-0 px-4 py-3 font-bold"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="focus-ring flex w-14 items-center justify-center rounded-r-lg text-slate-600 hover:text-ocean"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </label>
            {error && (
              <div className="flex gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-800">
                <XCircle className="shrink-0" size={18} />
                {error}
              </div>
            )}
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button type="submit" className="focus-ring inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-ocean px-4 py-3 font-black text-white">
              Unlock dashboard <LogIn size={18} />
            </button>
            <button type="button" onClick={onBack} className="focus-ring rounded-lg border border-line px-4 py-3 font-black hover:border-ocean hover:text-ocean">
              Back to intro
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function TimelineStep({ icon: Icon, label, text }: { icon: LucideIcon; label: string; text: string }) {
  return (
    <div className="flex gap-3 rounded-lg bg-white/10 p-3">
      <Icon className="mt-0.5 shrink-0 text-sun" size={20} />
      <div>
        <p className="font-black">{label}</p>
        <p className="mt-1 text-sm leading-5 text-slate-200">{text}</p>
      </div>
    </div>
  );
}

function Dashboard({
  readiness,
  lessonProgress,
  questionProgress,
  answeredCount,
  correctCount,
  stats,
  onStartMock,
  onPractice,
  onResetProgress,
}: {
  readiness: number;
  lessonProgress: number;
  questionProgress: number;
  answeredCount: number;
  correctCount: number;
  stats: ReturnType<typeof getQuestionStats>;
  onStartMock: () => void;
  onPractice: () => void;
  onResetProgress: () => void;
}) {
  return (
    <section className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-lg border border-line bg-white p-5 shadow-panel">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-mint">Exam readiness</p>
              <h2 className="mt-2 text-3xl font-black">Learn the exam, then train like it is real.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                This app explains the CAPM, maps every practice item to an official domain, and keeps all questions original.
              </p>
            </div>
            <div className="flex h-36 w-36 shrink-0 items-center justify-center rounded-full border-[12px] border-ocean bg-white">
              <div className="text-center">
                <div className="text-4xl font-black">{readiness}%</div>
                <div className="text-xs font-bold uppercase text-slate-500">ready</div>
              </div>
            </div>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <Metric label="Lessons completed" value={`${lessonProgress}%`} />
            <Metric label="Practice coverage" value={`${questionProgress}%`} />
            <Metric label="Practice accuracy" value={`${pct(correctCount, Math.max(answeredCount, 1))}%`} />
          </div>
        </div>
        <div className="rounded-lg border border-line bg-ink p-5 text-white shadow-panel">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-sun">Next action</p>
          <h3 className="mt-3 text-2xl font-black">Take a focused drill</h3>
          <p className="mt-2 text-sm leading-6 text-slate-200">
            Start with domain practice, then take the full timed mock once you feel steady.
          </p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row lg:flex-col">
            <button onClick={onPractice} className="focus-ring rounded-lg bg-white px-4 py-3 font-black text-ink">
              Practice by domain
            </button>
            <button onClick={onStartMock} className="focus-ring rounded-lg bg-sun px-4 py-3 font-black text-ink">
              Start mock exam
            </button>
          </div>
          <div className="mt-4">
            <ResetProgressButton onReset={onResetProgress} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {examFacts.map((fact) => (
          <div key={fact.label} className="rounded-lg border border-line bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{fact.label}</p>
            <p className="mt-2 text-2xl font-black">{fact.value}</p>
            <p className="mt-2 text-sm leading-5 text-slate-600">{fact.detail}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-line bg-white p-5 shadow-panel">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-ocean">Question bank</p>
            <h2 className="text-2xl font-black">2400 original CAPM practice questions</h2>
          </div>
          <p className="text-sm text-slate-600">{stats.bonus} hard bonus scenarios included</p>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-4">
          {domains.map((domain) => (
            <DomainCard key={domain.id} domainId={domain.id} value={stats.byDomain[domain.id]} total={stats.total} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Overview() {
  return (
    <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-lg border border-line bg-white p-5 shadow-panel">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-ocean">What CAPM does</p>
        <h2 className="mt-2 text-3xl font-black">A starter credential for project work</h2>
        <p className="mt-4 leading-7 text-slate-700">
          CAPM is PMI's Certified Associate in Project Management. It helps new practitioners prove they understand
          foundational project language, predictive planning, agile ways of working, and business analysis concepts.
        </p>
        <div className="mt-5 rounded-lg border border-line bg-paper p-4">
          <p className="font-black">Eligibility snapshot</p>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            A secondary degree such as a high school diploma, GED, or global equivalent, plus 23 hours of project
            management education before the exam.
          </p>
        </div>
      </div>
      <div className="rounded-lg border border-line bg-white p-5 shadow-panel">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-mint">Opportunities after CAPM</p>
        <div className="mt-4 grid gap-3">
          {opportunities.map((item) => (
            <div key={item} className="flex gap-3 rounded-lg border border-line p-3">
              <CheckCircle2 className="mt-0.5 shrink-0 text-mint" size={20} />
              <p className="text-sm leading-6 text-slate-700">{item}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-lg border border-line bg-white p-5 shadow-panel lg:col-span-2">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">Exam map</p>
        <div className="mt-5 grid gap-4 md:grid-cols-4">
          {domains.map((domain) => (
            <div key={domain.id} className="rounded-lg border border-line p-4">
              <div className={cx("h-2 rounded-full", domain.color)} />
              <p className="mt-3 text-lg font-black">{domain.shortName}</p>
              <p className="text-3xl font-black">{domain.weight}%</p>
              <p className="mt-2 text-sm leading-5 text-slate-600">{domain.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Learn({
  progress,
  selectedDomain,
  onDomain,
  onToggle,
}: {
  progress: ProgressState;
  selectedDomain: DomainId;
  onDomain: (domainId: DomainId) => void;
  onToggle: (lessonId: string) => void;
}) {
  const filteredLessons = lessons.filter((lesson) => lesson.domainId === selectedDomain);
  return (
    <section className="space-y-5">
      <DomainPicker selectedDomain={selectedDomain} onDomain={onDomain} />
      <div className="grid gap-4 lg:grid-cols-2">
        {filteredLessons.map((lesson) => {
          const done = progress.completedLessons.includes(lesson.id);
          return (
            <article key={lesson.id} className="rounded-lg border border-line bg-white p-5 shadow-panel">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-ocean">{domainNames[lesson.domainId]}</p>
                  <h2 className="mt-2 text-2xl font-black">{lesson.title}</h2>
                </div>
                <button
                  onClick={() => onToggle(lesson.id)}
                  className={cx(
                    "focus-ring rounded-lg px-3 py-2 text-sm font-black",
                    done ? "bg-mint text-white" : "border border-line bg-white text-ink",
                  )}
                >
                  {done ? "Done" : "Mark done"}
                </button>
              </div>
              <p className="mt-4 leading-7 text-slate-700">{lesson.summary}</p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <InfoList title="Examples" items={lesson.examples} />
                <InfoList title="Artifacts" items={lesson.artifacts} />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Practice({
  selectedDomain,
  difficulty,
  questions,
  question,
  index,
  selectedAnswer,
  showExplanation,
  onDomain,
  onDifficulty,
  onAnswer,
  onNext,
}: {
  selectedDomain: DomainId;
  difficulty: PracticeDifficulty;
  questions: Question[];
  question: Question;
  index: number;
  selectedAnswer: number | null;
  showExplanation: boolean;
  onDomain: (domainId: DomainId) => void;
  onDifficulty: (difficulty: PracticeDifficulty) => void;
  onAnswer: (question: Question, answerIndex: number) => void;
  onNext: () => void;
}) {
  return (
    <section className="grid gap-5 lg:grid-cols-[0.35fr_0.65fr]">
      <aside className="space-y-4">
        <div className="rounded-lg border border-line bg-white p-4 shadow-panel">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-ocean">Practice filters</p>
          <div className="mt-4 space-y-3">
            <DomainPicker selectedDomain={selectedDomain} onDomain={onDomain} compact />
            <select
              value={difficulty}
              onChange={(event) => onDifficulty(event.target.value as PracticeDifficulty)}
              className="focus-ring w-full rounded-lg border border-line bg-white px-3 py-2 font-bold"
            >
              <option value="all">All difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>
        <EthicsNotice />
      </aside>
      <article className="rounded-lg border border-line bg-white p-5 shadow-panel">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-mint">
              Question {index + 1} of {questions.length}
            </p>
            <h2 className="mt-2 text-2xl font-black">
              {showExplanation ? question.topic : `${domainNames[question.domainId]} practice case`}
            </h2>
          </div>
          <span className="w-fit rounded-lg bg-paper px-3 py-2 text-sm font-black capitalize text-ink">{question.difficulty}</span>
        </div>
        <p className="mt-5 text-lg font-bold leading-8">{question.prompt}</p>
        <div className="mt-5 grid gap-3">
          {question.options.map((option, optionIndex) => {
            const isSelected = selectedAnswer === optionIndex;
            const isCorrect = question.correctIndex === optionIndex;
            return (
              <button
                key={option}
                onClick={() => onAnswer(question, optionIndex)}
                disabled={showExplanation}
                className={cx(
                  "focus-ring rounded-lg border p-4 text-left font-bold transition",
                  showExplanation && isCorrect && "border-mint bg-emerald-50 text-emerald-900",
                  showExplanation && isSelected && !isCorrect && "border-coral bg-red-50 text-red-900",
                  !showExplanation && "border-line bg-white hover:border-ocean hover:bg-blue-50",
                )}
              >
                {option}
              </button>
            );
          })}
        </div>
        {showExplanation && (
          <div className="mt-5 rounded-lg border border-line bg-paper p-4">
            <p className="font-black">{selectedAnswer === question.correctIndex ? "Correct" : "Not quite"}</p>
            {selectedAnswer !== null && question.optionRationales?.[selectedAnswer] && (
              <p className="mt-2 leading-6 text-slate-700">
                <span className="font-black text-ink">Choice insight: </span>
                {question.optionRationales[selectedAnswer]}
              </p>
            )}
            <p className="mt-2 leading-6 text-slate-700">{question.explanation}</p>
            <p className="mt-2 text-sm font-bold text-ocean">Topic: {question.topic}</p>
            <p className="mt-2 text-sm font-bold text-ocean">Source topic: {question.sourceTopic}</p>
            <button onClick={onNext} className="focus-ring mt-4 inline-flex items-center gap-2 rounded-lg bg-ocean px-4 py-3 font-black text-white">
              Next question <ChevronRight size={18} />
            </button>
          </div>
        )}
      </article>
    </section>
  );
}

function MockExam({
  mock,
  onStart,
  onAnswer,
  onMove,
  onBeginBreak,
  onEndBreak,
  onFinish,
  onExit,
}: {
  mock: MockState;
  onStart: (modeId: MockModeId) => void;
  onAnswer: (answerIndex: number) => void;
  onMove: (delta: number) => void;
  onBeginBreak: () => void;
  onEndBreak: () => void;
  onFinish: () => void;
  onExit: () => void;
}) {
  if (!mock.active) {
    return (
      <section className="space-y-5">
        <div className="rounded-lg border border-line bg-white p-6 shadow-panel">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">Choose your mock exam</p>
          <h2 className="mt-2 text-3xl font-black">Three separate 150-question exams.</h2>
          <p className="mt-4 leading-7 text-slate-700">
            These mock exams use mock-only questions, not the practice bank. Every mode keeps the official-style rhythm:
            150 questions, 180 minutes, and a 10-minute break after question 75 that locks the first section.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {mockModes.map((mode) => (
            <article key={mode.id} className="rounded-lg border border-line bg-white p-5 shadow-panel">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-ocean">{mode.level}</p>
                  <h3 className="mt-2 text-2xl font-black">{mode.label}</h3>
                </div>
                <span className={cx("rounded-lg px-3 py-2 text-sm font-black", mode.id === "must-fail" ? "bg-ink text-white" : mode.id === "beyond-real" ? "bg-sun text-ink" : "bg-blue-50 text-ocean")}>
                  150 Q
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-700">{mode.summary}</p>
              <div className="mt-4 rounded-lg bg-paper p-3 text-sm font-bold leading-5 text-slate-700">
                {mode.warning}
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                <div className="rounded-lg border border-line p-2">Easy {Math.round(mode.ratios.easy * 100)}%</div>
                <div className="rounded-lg border border-line p-2">Med {Math.round(mode.ratios.medium * 100)}%</div>
                <div className="rounded-lg border border-line p-2">Hard {Math.round(mode.ratios.hard * 100)}%</div>
              </div>
              <button
                onClick={() => onStart(mode.id)}
                className={cx(
                  "focus-ring mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-black",
                  mode.id === "must-fail" ? "bg-ink text-white" : mode.id === "beyond-real" ? "bg-sun text-ink" : "bg-coral text-white",
                )}
              >
                <Play size={18} /> Start {mode.shortLabel}
              </button>
            </article>
          ))}
        </div>
        <EthicsNotice />
      </section>
    );
  }

  if (mock.breakOpen) {
    return (
      <section className="rounded-lg border border-line bg-white p-8 text-center shadow-panel">
        <Clock3 className="mx-auto text-ocean" size={44} />
        <h2 className="mt-3 text-3xl font-black">Break is active</h2>
        <p className="mx-auto mt-3 max-w-2xl leading-7 text-slate-700">
          Section 1 is now locked. In the real exam you cannot return to questions 1-75 after starting this break.
        </p>
        <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button onClick={onEndBreak} className="focus-ring rounded-lg bg-ocean px-5 py-3 font-black text-white">
            Continue to question 76
          </button>
          <button onClick={onExit} className="focus-ring rounded-lg border border-coral px-5 py-3 font-black text-coral">
            Exit exam
          </button>
        </div>
      </section>
    );
  }

  const question = mock.questions[mock.currentIndex];
  const answered = Object.keys(mock.answers).length;
  const selected = question ? mock.answers[question.id] : undefined;
  const atBreakPoint = mock.currentIndex === 74 && selected !== undefined && !mock.lockedFirstSection;

  return (
    <section className="space-y-4">
      <div className="rounded-lg border border-line bg-white p-4 shadow-panel">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-ocean">{mock.modeLabel ?? "Mock exam"} in progress</p>
            <h2 className="text-2xl font-black">Question {mock.currentIndex + 1} of {mock.questions.length}</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onExit}
              className="focus-ring rounded-lg border border-coral bg-white px-3 py-2 font-black text-coral transition hover:bg-red-50"
            >
              Exit exam
            </button>
            <span className="rounded-lg bg-paper px-3 py-2 font-black">{formatTime(mock.secondsRemaining)}</span>
            <span className="rounded-lg bg-paper px-3 py-2 font-black">{answered}/150 answered</span>
            {mock.lockedFirstSection && <span className="rounded-lg bg-red-50 px-3 py-2 font-black text-red-800">Section 1 locked</span>}
          </div>
        </div>
      </div>

      {question && (
        <article className="rounded-lg border border-line bg-white p-5 shadow-panel">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-mint">{domainNames[question.domainId]} · {question.difficulty}</p>
          <p className="mt-4 text-lg font-bold leading-8">{question.prompt}</p>
          <div className="mt-5 grid gap-3">
            {question.options.map((option, optionIndex) => (
              <button
                key={option}
                onClick={() => onAnswer(optionIndex)}
                className={cx(
                  "focus-ring rounded-lg border p-4 text-left font-bold transition",
                  selected === optionIndex ? "border-ocean bg-blue-50 text-ocean" : "border-line bg-white hover:border-ocean",
                )}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-between">
            <button onClick={() => onMove(-1)} disabled={mock.currentIndex === 0 || (mock.lockedFirstSection && mock.currentIndex <= 75)} className="focus-ring rounded-lg border border-line px-4 py-3 font-black disabled:opacity-40">
              Previous
            </button>
            <div className="flex flex-col gap-3 sm:flex-row">
              {atBreakPoint && (
                <button onClick={onBeginBreak} className="focus-ring rounded-lg bg-sun px-4 py-3 font-black text-ink">
                  Start 10-minute break
                </button>
              )}
              {mock.currentIndex < mock.questions.length - 1 ? (
                <button onClick={() => onMove(1)} className="focus-ring rounded-lg bg-ocean px-4 py-3 font-black text-white">
                  Next
                </button>
              ) : (
                <button onClick={onFinish} className="focus-ring rounded-lg bg-mint px-4 py-3 font-black text-white">
                  Finish exam
                </button>
              )}
            </div>
          </div>
        </article>
      )}
    </section>
  );
}

function Results({ progress, readiness }: { progress: ProgressState; readiness: number }) {
  const latest = progress.mockHistory[0];
  return (
    <section className="space-y-5">
      <div className="rounded-lg border border-line bg-white p-5 shadow-panel">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-ocean">Results</p>
        <h2 className="mt-2 text-3xl font-black">Readiness score: {readiness}%</h2>
        <p className="mt-3 text-slate-700">
          This is a practice readiness indicator, not an official PMI passing score or guarantee.
        </p>
      </div>
      {latest ? (
        <div className="rounded-lg border border-line bg-white p-5 shadow-panel">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-mint">Latest mock</p>
              <h3 className="text-2xl font-black">{latest.score}/{latest.total} correct · {pct(latest.score, latest.total)}%</h3>
            </div>
            <p className="text-sm text-slate-600">{new Date(latest.date).toLocaleString()}</p>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-4">
            {domains.map((domain) => {
              const score = latest.domainScores[domain.id];
              return (
                <div key={domain.id} className="rounded-lg border border-line p-4">
                  <p className="font-black">{domain.shortName}</p>
                  <p className="mt-2 text-2xl font-black">{pct(score.correct, score.total)}%</p>
                  <ProgressBar value={pct(score.correct, score.total)} color={domain.color} />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-line bg-white p-5 text-center shadow-panel">
          <Trophy className="mx-auto text-sun" size={40} />
          <h3 className="mt-3 text-2xl font-black">No mock exam results yet</h3>
          <p className="mt-2 text-slate-700">Take a full mock to unlock domain-level scoring.</p>
        </div>
      )}
      <div className="grid gap-3 md:grid-cols-3">
        <Metric label="Lessons completed" value={`${progress.completedLessons.length}/${lessons.length}`} />
        <Metric label="Incorrect retry queue" value={String(progress.incorrectQueue.length)} />
        <Metric label="Mock attempts saved" value={String(progress.mockHistory.length)} />
      </div>
    </section>
  );
}

function ResultsV2({
  progress,
  readiness,
  onResetProgress,
}: {
  progress: ProgressState;
  readiness: number;
  onResetProgress: () => void;
}) {
  const latest = progress.mockHistory[0];
  const difficultyScores = latest?.difficultyScores ?? {
    easy: { correct: 0, total: 0 },
    medium: { correct: 0, total: 0 },
    hard: { correct: 0, total: 0 },
  };
  const topicEntries = latest?.topicScores
    ? Object.entries(latest.topicScores)
        .filter(([, score]) => score.total > 0)
        .sort(([, a], [, b]) => pct(a.correct, a.total) - pct(b.correct, b.total) || b.total - a.total)
        .slice(0, 5)
    : [];
  const missedQuestions = latest?.missedQuestions ?? [];
  const secondsUsed = latest?.secondsUsed ?? 0;
  const averageSeconds = latest && secondsUsed > 0 ? Math.round(secondsUsed / latest.total) : 0;
  const weakestDomain = latest
    ? domains
        .map((domain) => ({ domain, score: latest.domainScores[domain.id] }))
        .sort((a, b) => pct(a.score.correct, a.score.total) - pct(b.score.correct, b.score.total))[0]
    : undefined;
  const weakestDifficulty = latest
    ? difficulties
        .map((difficulty) => ({ difficulty, score: difficultyScores[difficulty] }))
        .sort((a, b) => pct(a.score.correct, a.score.total) - pct(b.score.correct, b.score.total))[0]
    : undefined;

  return (
    <section className="space-y-5">
      <div className="rounded-lg border border-line bg-white p-5 shadow-panel">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-ocean">Results</p>
            <h2 className="mt-2 text-3xl font-black">Readiness score: {readiness}%</h2>
            <p className="mt-3 text-slate-700">
              This is a practice readiness indicator, not an official PMI passing score or guarantee.
            </p>
          </div>
          <div className="md:w-72">
            <ResetProgressButton onReset={onResetProgress} tone="light" />
          </div>
        </div>
      </div>

      {latest ? (
        <>
          <div className="rounded-lg border border-line bg-white p-5 shadow-panel">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-mint">Latest mock analysis</p>
                <h3 className="text-2xl font-black">
                  {latest.score}/{latest.total} correct - {pct(latest.score, latest.total)}%
                </h3>
                <p className="mt-2 text-sm font-bold text-ocean">{latest.modeLabel ?? "Mock Exam"}</p>
              </div>
              <p className="text-sm text-slate-600">{new Date(latest.completedAt ?? latest.date).toLocaleString()}</p>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-4">
              <Metric label="Time used" value={secondsUsed > 0 ? formatTime(secondsUsed) : "N/A"} />
              <Metric label="Pacing" value={averageSeconds > 0 ? `${averageSeconds}s / Q` : "N/A"} />
              <Metric label="Unanswered" value={String(latest.unansweredCount ?? 0)} />
              <Metric label="Missed review" value={String(missedQuestions.length)} />
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[0.65fr_0.35fr]">
            <div className="rounded-lg border border-line bg-white p-5 shadow-panel">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-ocean">Domain breakdown</p>
              <div className="mt-5 grid gap-4 md:grid-cols-4">
                {domains.map((domain) => {
                  const score = latest.domainScores[domain.id];
                  return (
                    <div key={domain.id} className="rounded-lg border border-line p-4">
                      <p className="font-black">{domain.shortName}</p>
                      <p className="mt-2 text-2xl font-black">{pct(score.correct, score.total)}%</p>
                      <p className="text-sm text-slate-600">{score.correct}/{score.total} correct</p>
                      <ProgressBar value={pct(score.correct, score.total)} color={domain.color} />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-lg border border-line bg-white p-5 shadow-panel">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">Difficulty breakdown</p>
              <div className="mt-5 space-y-3">
                {difficulties.map((difficulty) => {
                  const score = difficultyScores[difficulty];
                  return (
                    <div key={difficulty} className="rounded-lg border border-line p-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-black capitalize">{difficulty}</p>
                        <p className="text-sm font-bold text-slate-600">{score.correct}/{score.total}</p>
                      </div>
                      <ProgressBar
                        value={pct(score.correct, score.total)}
                        color={difficulty === "easy" ? "bg-mint" : difficulty === "medium" ? "bg-sun" : "bg-coral"}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-lg border border-line bg-white p-5 shadow-panel">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-sun">Weakest topics</p>
              <div className="mt-4 space-y-3">
                {topicEntries.length > 0 ? (
                  topicEntries.map(([topic, score]) => (
                    <div key={topic} className="rounded-lg border border-line p-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-black">{topic}</p>
                        <p className="text-sm font-bold text-slate-600">{pct(score.correct, score.total)}%</p>
                      </div>
                      <p className="mt-1 text-sm text-slate-600">{score.correct}/{score.total} correct</p>
                      <ProgressBar value={pct(score.correct, score.total)} color="bg-sun" />
                    </div>
                  ))
                ) : (
                  <p className="text-sm leading-6 text-slate-700">Take a new mock exam to unlock topic-level analysis.</p>
                )}
              </div>
            </div>

            <div className="rounded-lg border border-line bg-ink p-5 text-white shadow-panel">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-sun">Next study plan</p>
              <h3 className="mt-2 text-2xl font-black">What to do next</h3>
              <div className="mt-4 space-y-3 text-sm leading-6 text-slate-200">
                <p>
                  1. Drill {weakestDomain?.domain.shortName ?? "your lowest domain"} until you can explain why each wrong
                  option is wrong.
                </p>
                <p>
                  2. Rework {weakestDifficulty?.difficulty ?? "hard"} questions slowly, then retry them under time pressure.
                </p>
                <p>3. Review the missed-question list below and write one rule for each mistake pattern.</p>
                <p>4. Retake a harder mock only after your weakest topic cards rise above 70%.</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-line bg-white p-5 shadow-panel">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">Missed-question review</p>
                <h3 className="text-2xl font-black">Study the misses, not just the score.</h3>
              </div>
              <p className="text-sm text-slate-600">Showing {Math.min(missedQuestions.length, 12)} of {missedQuestions.length}</p>
            </div>
            <div className="mt-5 grid gap-4">
              {missedQuestions.length > 0 ? (
                missedQuestions.slice(0, 12).map((review) => (
                  <article key={review.questionId} className="rounded-lg border border-line p-4">
                    <div className="flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                      <span>{domainNames[review.domainId]}</span>
                      <span>{review.difficulty}</span>
                      <span>{review.topic}</span>
                    </div>
                    <p className="mt-3 font-bold leading-7">{review.prompt}</p>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      <div className="rounded-lg bg-red-50 p-3 text-sm leading-6 text-red-900">
                        <p className="font-black">Your answer</p>
                        <p>{review.chosenAnswer}</p>
                      </div>
                      <div className="rounded-lg bg-emerald-50 p-3 text-sm leading-6 text-emerald-900">
                        <p className="font-black">Correct answer</p>
                        <p>{review.correctAnswer}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-700">{review.explanation}</p>
                  </article>
                ))
              ) : (
                <div className="rounded-lg border border-line bg-paper p-4 text-sm leading-6 text-slate-700">
                  No missed questions in the latest saved mock result.
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-lg border border-line bg-white p-5 text-center shadow-panel">
          <Trophy className="mx-auto text-sun" size={40} />
          <h3 className="mt-3 text-2xl font-black">No mock exam results yet</h3>
          <p className="mt-2 text-slate-700">Take a full mock to unlock domain, difficulty, topic, and missed-question analysis.</p>
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-3">
        <Metric label="Lessons completed" value={`${progress.completedLessons.length}/${lessons.length}`} />
        <Metric label="Incorrect retry queue" value={String(progress.incorrectQueue.length)} />
        <Metric label="Mock attempts saved" value={String(progress.mockHistory.length)} />
      </div>
    </section>
  );
}

function Sources() {
  return (
    <section className="grid gap-5 lg:grid-cols-[0.7fr_0.3fr]">
      <div className="rounded-lg border border-line bg-white p-5 shadow-panel">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-ocean">Trusted sources</p>
        <h2 className="mt-2 text-3xl font-black">Official PMI references only</h2>
        <div className="mt-5 grid gap-3">
          {officialSources.map((source) => (
            <a
              key={source.url}
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="focus-ring flex items-center justify-between gap-4 rounded-lg border border-line p-4 font-bold hover:border-ocean hover:text-ocean"
            >
              {source.title}
              <ChevronRight size={18} />
            </a>
          ))}
        </div>
      </div>
      <div className="rounded-lg border border-line bg-white p-5 shadow-panel">
        <ShieldCheck className="text-mint" size={34} />
        <h3 className="mt-3 text-2xl font-black">Ethical prep</h3>
        <p className="mt-3 text-sm leading-6 text-slate-700">
          The provided practice-site links are not used as question sources. Sites that claim exam dumps or leaked content
          are excluded from the app.
        </p>
      </div>
    </section>
  );
}

function DomainPicker({
  selectedDomain,
  onDomain,
  compact,
}: {
  selectedDomain: DomainId;
  onDomain: (domainId: DomainId) => void;
  compact?: boolean;
}) {
  return (
    <div className={cx("grid gap-2", compact ? "grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-4")}>
      {domains.map((domain) => (
        <button
          key={domain.id}
          onClick={() => onDomain(domain.id)}
          className={cx(
            "focus-ring rounded-lg border p-3 text-left transition",
            selectedDomain === domain.id ? "border-ocean bg-blue-50" : "border-line bg-white hover:border-ocean",
          )}
        >
          <p className="font-black">{domain.shortName}</p>
          <p className="text-sm text-slate-600">{domain.weight}% of exam</p>
        </button>
      ))}
    </div>
  );
}

function DomainCard({ domainId, value, total }: { domainId: DomainId; value: number; total: number }) {
  const domain = domains.find((item) => item.id === domainId)!;
  return (
    <div className="rounded-lg border border-line p-4">
      <div className={cx("h-2 rounded-full", domain.color)} />
      <p className="mt-3 font-black">{domain.shortName}</p>
      <p className="mt-1 text-3xl font-black">{value}</p>
      <ProgressBar value={pct(value, total)} color={domain.color} />
    </div>
  );
}

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
      <div className={cx("h-full rounded-full", color)} style={{ width: `${value}%` }} />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-black">{value}</p>
    </div>
  );
}

function ResetProgressButton({ onReset, tone = "dark" }: { onReset: () => void; tone?: "dark" | "light" }) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="rounded-lg border border-coral bg-red-50 p-3 text-red-950">
        <p className="text-sm font-bold leading-5">
          This deletes saved lessons, practice answers, saved practice position, retry queue, and mock results. Login stays active.
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <button
            onClick={() => {
              onReset();
              setConfirming(false);
            }}
            className="focus-ring rounded-lg bg-coral px-3 py-2 text-sm font-black text-white"
          >
            Confirm reset
          </button>
          <button
            onClick={() => setConfirming(false)}
            className="focus-ring rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-black text-red-900"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className={cx(
        "focus-ring inline-flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-3 font-black transition",
        tone === "dark"
          ? "border-white/40 text-white hover:bg-white/10"
          : "border-line bg-white text-ink hover:border-coral hover:text-coral",
      )}
    >
      <RefreshCcw size={18} />
      Fresh start
    </button>
  );
}

function InfoList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg bg-paper p-4">
      <p className="font-black">{title}</p>
      <ul className="mt-2 space-y-2 text-sm leading-5 text-slate-700">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <Zap className="mt-0.5 shrink-0 text-sun" size={16} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function EthicsNotice() {
  return (
    <div className="rounded-lg border border-line bg-white p-5 shadow-panel">
      <div className="flex items-center gap-2">
        <ShieldCheck className="text-mint" size={22} />
        <p className="font-black">Ethics notice</p>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-700">
        These are original practice questions mapped to CAPM topics. They are not real PMI exam items, leaked content,
        or braindump material.
      </p>
    </div>
  );
}

export default App;
