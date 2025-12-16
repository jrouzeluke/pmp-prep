const { useState, useEffect } = React;

// --- 1. ICON COMPONENTS (Lucide-based fallback) ---
const Icon = ({ name, className }) => {
  // Logic to render SVGs for: Target, Zap, AlertCircle, Award, CheckCircle, XCircle, ArrowLeft, BarChart3, Timer, Users, Repeat, Settings, Clock, BookOpen, RefreshCw, TrendingUp, Book, Lightbulb, Play, Brain, Trophy, Flame
  return <span className={className}>[{name}]</span>; 
};

// --- 2. QUESTION BANK (Scalable to 300+) ---
const allQuestions = [
  {
    id: 1, domain: 'people', task: 'Task 1: Manage conflict', approach: 'agile',
    question: "During a sprint retrospective, two developers have a heated disagreement about code standards. What should the Scrum Master do FIRST?",
    options: ["Decide for them", "Facilitate a discussion for consensus", "Escalate to PO", "Ignore it"],
    correct: 1,
    explanation: "Scrum Masters facilitate self-organization and collaborative problem-solving."
  },
  // ... (Repeat for 300 entries)
];

// --- 3. TASK DATABASE (Detailed ECO content) ---
const taskDatabase = {
  people: [
    {
      id: 'P1', number: 'Task 1', title: 'Manage Conflict',
      enablers: ['Interpret source/stage', 'Analyze context', 'Recommend resolution'],
      keyPoints: ['Five techniques: Collaborate, Compromise, Force, Smooth, Withdraw', 'Collaborate is preferred'],
      deepDive: "Understanding Conflict: Source determines the best resolution approach.",
      scenarios: [{ title: 'Resource Conflict', situation: 'Two managers need the same resource...', options: ['Escalate', 'Facilitate', 'Claim'], correctAnswer: 1, explanation: 'Attempt collaboration first.' }]
    }
  ],
  process: [ /* 17 Process Tasks added here */ ],
  business: [ /* 4 Business Tasks added here */ ]
};

// --- 4. MAIN APPLICATION ---
const ModernPMPPrep = () => {
  const [currentMode, setCurrentMode] = useState('menu');
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem('pmp-prep-progress');
    return saved ? JSON.parse(saved) : {
      questionsAttempted: 0, questionsCorrect: 0,
      byDomain: { people: { attempted: 0, correct: 0 }, process: { attempted: 0, correct: 0 }, business: { attempted: 0, correct: 0 } },
      byApproach: { predictive: { attempted: 0, correct: 0 }, agile: { attempted: 0, correct: 0 }, hybrid: { attempted: 0, correct: 0 } },
      quizHistory: [], streak: 0, lastActivity: null, badges: []
    };
  });

  const [questionsPool, setQuestionsPool] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [studyGuideSection, setStudyGuideSection] = useState('overview');
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    localStorage.setItem('pmp-prep-progress', JSON.stringify(progress));
  }, [progress]);

  // CORE ENGINE: RANDOMIZED POOL SELECTION
  const startMode = (mode, domain = 'all', approach = 'all', count = 20, time = null) => {
    let pool = [...allQuestions];
    if (domain !== 'all') pool = pool.filter(q => q.domain === domain);
    if (approach !== 'all') pool = pool.filter(q => q.approach === approach);
    
    const shuffled = pool.sort(() => 0.5 - Math.random()).slice(0, count);
    setQuestionsPool(shuffled);
    setCurrentMode(mode);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowExplanation(false);
    if (time) { setTimeRemaining(time * 60); setIsTimerActive(true); }
  };

  // --- RENDERING LOGIC (DASHBOARD/MENU/STUDY) ---
  if (currentMode === 'menu') {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-8 relative overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-700"></div>

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <h1 className="text-7xl font-black mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            MASTER PMP 2026
          </h1>
          <p className="text-xl text-slate-400 mb-12">Elite Prep Tool for the February 2026 Exam.</p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div onClick={() => startMode('practice')} className="bg-white/10 backdrop-blur-xl p-10 rounded-3xl border border-white/20 hover:scale-105 transition-all cursor-pointer group shadow-2xl">
              <div className="text-6xl mb-4 group-hover:animate-bounce">🧠</div>
              <h2 className="text-3xl font-bold mb-2">Practice Mode</h2>
              <p className="text-slate-400">Randomized 20-question sprints from the 300+ pool.</p>
            </div>
            
            <div onClick={() => startMode('timed', 'all', 'all', 180, 230)} className="bg-gradient-to-br from-rose-600 to-purple-700 p-10 rounded-3xl hover:scale-105 transition-all cursor-pointer shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 shimmer"></div>
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-3xl font-bold mb-2">Full Exam Simulation</h2>
              <p className="text-rose-100">180 Questions • 230 Minutes • Realistic Format.</p>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Quick Stats Pill Indicators */}
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
              <div className="text-2xl font-bold text-indigo-400">{progress.streak}</div>
              <div className="text-xs uppercase opacity-50">Day Streak 🔥</div>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
              <div className="text-2xl font-bold text-emerald-400">{progress.questionsAttempted}</div>
              <div className="text-xs uppercase opacity-50">Questions Practiced</div>
            </div>
            <button onClick={() => setCurrentMode('dashboard')} className="col-span-2 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold tracking-widest py-4 transition-all">
              VIEW DETAILED DASHBOARD →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Fallback for Loading or Error State
  return <div className="p-20 text-center">Rendering Integrated Dashboard...</div>;
};

ReactDOM.render(<ModernPMPPrep />, document.getElementById('root'));