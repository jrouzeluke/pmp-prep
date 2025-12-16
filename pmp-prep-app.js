const { useState, useEffect } = React;

// --- 1. ICON COMPONENTS ---
const Target = ({ className }) => (<svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>);
const Zap = ({ className }) => (<svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>);
const AlertCircle = ({ className }) => (<svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>);
const Award = ({ className }) => (<svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 18 17 23 15.79 13.88"/></svg>);
const CheckCircle = ({ className }) => (<svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-8.58"/><path d="M22 4L12 14.01l-3-3"/></svg>);
const XCircle = ({ className }) => (<svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>);
const ArrowLeft = ({ className }) => (<svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>);
const BarChart3 = ({ className }) => (<svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>);
const Timer = ({ className }) => (<svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="10" y1="2" x2="14" y2="2"/><line x1="12" y1="18" x2="12" y2="22"/><path d="M12 12V6"/><circle cx="12" cy="13" r="8"/></svg>);
const Users = ({ className }) => (<svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);
const Repeat = ({ className }) => (<svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m17 2 4 4-4 4"/><path d="M21 6H3"/><path d="m7 22-4-4 4-4"/><path d="M3 18h18"/></svg>);
const Settings = ({ className }) => (<svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.22a2 2 0 0 0-1.28 1.48l-.22 1.5a2 2 0 0 0-1.8 1.13l-1.55 1.46a2 2 0 0 0-.15 2.58l.94 1.18a2 2 0 0 0 .8 1.83v1.17a2 2 0 0 0 1.28 1.48l.22 1.5a2 2 0 0 0 1.8 1.13l1.55 1.46a2 2 0 0 0 2.58-.15l1.18-.94a2 2 0 0 0 1.83-.8v1.17a2 2 0 0 0 1.48 1.28l1.5.22a2 2 0 0 0 2-2v-.44a2 2 0 0 0-2-2h-.22a2 2 0 0 0-1.48-1.28l-1.5-.22a2 2 0 0 0-1.13-1.8l-1.46-1.55a2 2 0 0 0 .15-2.58l.94-1.18a2 2 0 0 0 .8-1.83v-1.17a2 2 0 0 0 1.28-1.48l.22-1.5a2 2 0 0 0-2-2h-.44a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>);

// --- 2. QUIZ DATA ---
const QUIZ_QUESTIONS = [
  {
    question: "A project is behind schedule because a functional manager reassigned a key resource. What should the PM do first?",
    options: ["Escalate to the sponsor", "Meet with the functional manager to discuss the impact", "Hire a contractor", "Update the schedule"],
    answer: 1,
    explanation: "PMI Mindset: Always analyze and communicate before escalating. Negotiation with functional managers is a key People domain task."
  },
  {
    question: "A project team is struggling with a technical impediment in a Sprint. What is the Scrum Master's role?",
    options: ["Solve the technical problem", "Assign the task to a senior developer", "Facilitate the removal of the impediment", "Log a risk in the register"],
    answer: 2,
    explanation: "Scrum Masters are servant leaders who facilitate impediment removal rather than solving technical issues themselves."
  }
];

// --- 3. MAIN COMPONENT ---
const PMPPrepApp = () => {
  const [currentMode, setCurrentMode] = useState('dashboard');
  const [studyGuideSection, setStudyGuideSection] = useState('overview');
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedAns, setSelectedAns] = useState(null);
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('pmp_stats');
    return saved ? JSON.parse(saved) : { correct: 0, total: 0 };
  });

  useEffect(() => {
    localStorage.setItem('pmp_stats', JSON.stringify(stats));
  }, [stats]);

  const handleQuizAnswer = (idx) => {
    if (selectedAns !== null) return;
    setSelectedAns(idx);
    const isCorrect = idx === QUIZ_QUESTIONS[quizIdx].answer;
    setStats(prev => ({
      total: prev.total + 1,
      correct: isCorrect ? prev.correct + 1 : prev.correct
    }));
  };

  const nextQuestion = () => {
    setSelectedAns(null);
    if (quizIdx < QUIZ_QUESTIONS.length - 1) setQuizIdx(quizIdx + 1);
    else { setQuizIdx(0); setCurrentMode('dashboard'); }
  };

  // --- RENDERING MODES ---
  if (currentMode === 'quiz') {
    const q = QUIZ_QUESTIONS[quizIdx];
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm font-bold text-indigo-600 uppercase">Question {quizIdx + 1}/{QUIZ_QUESTIONS.length}</span>
            <button onClick={() => setCurrentMode('dashboard')}><XCircle className="text-slate-400" /></button>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-8">{q.question}</h2>
          <div className="space-y-4">
            {q.options.map((opt, i) => (
              <button key={i} onClick={() => handleQuizAnswer(i)} 
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selectedAns === null ? 'border-slate-100 hover:border-indigo-500' : i === q.answer ? 'border-green-500 bg-green-50' : selectedAns === i ? 'border-red-500 bg-red-50' : 'border-slate-50'}`}>
                {opt}
              </button>
            ))}
          </div>
          {selectedAns !== null && (
            <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-sm text-slate-600 mb-4">{q.explanation}</p>
              <button onClick={nextQuestion} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold">
                {quizIdx === QUIZ_QUESTIONS.length - 1 ? "Finish" : "Next Question"}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (currentMode === 'studyguide') {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => setCurrentMode('dashboard')} className="p-2 bg-white rounded-full shadow"><ArrowLeft /></button>
            <h1 className="text-2xl font-black">Study Guide</h1>
          </div>
          <div className="flex gap-2 overflow-x-auto mb-6 pb-2">
            {['overview', 'tasks', 'agile', 'formulas'].map(s => (
              <button key={s} onClick={() => setStudyGuideSection(s)} className={`px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all ${studyGuideSection === s ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500'}`}>
                {s.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="space-y-4">
            {studyGuideSection === 'tasks' ? (
              <div className="grid gap-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-indigo-500">
                  <h3 className="font-bold mb-2">Domain I: People (42%)</h3>
                  <p className="text-sm text-slate-600">Task 1: Manage Conflict. Task 2: Lead a Team. Task 3: Support Team Performance.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-emerald-500">
                  <h3 className="font-bold mb-2">Domain II: Process (50%)</h3>
                  <p className="text-sm text-slate-600">Task 1: Execute with Urgency. Task 2: Manage Communications. Task 3: Manage Risks.</p>
                </div>
              </div>
            ) : (
              <div className="bg-white p-12 rounded-3xl text-center shadow-sm">
                <Award className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold">Deep Dive into {studyGuideSection}</h2>
                <p className="text-slate-500">Full detailed content curated for the 2026 PMP Exam.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Fallback
  const score = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white mb-8 shadow-xl">
          <h1 className="text-3xl font-black italic mb-2">PMP MASTERY 2026</h1>
          <p className="opacity-80 text-sm">Your roadmap to Above Target performance.</p>
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md">
              <div className="text-2xl font-black">{score}%</div>
              <div className="text-xs uppercase font-bold opacity-60">Success Rate</div>
            </div>
            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md">
              <div className="text-2xl font-black">{stats.total}</div>
              <div className="text-xs uppercase font-bold opacity-60">Questions Done</div>
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <button onClick={() => setCurrentMode('quiz')} className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-all text-center border border-slate-100">
            <Zap className="w-10 h-10 text-amber-500 mx-auto mb-4" />
            <span className="text-xl font-black block">START QUIZ</span>
          </button>
          <button onClick={() => setCurrentMode('studyguide')} className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-all text-center border border-slate-100">
            <Target className="w-10 h-10 text-indigo-500 mx-auto mb-4" />
            <span className="text-xl font-black block">STUDY GUIDE</span>
          </button>
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(<PMPPrepApp />, document.getElementById('root'));