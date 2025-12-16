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
    question: "A project manager is lead a hybrid project. A key stakeholder is worried that the agile team's lack of a detailed project schedule will cause delays. How should the project manager respond?",
    options: ["Ask the team to create a detailed Gantt chart for 6 months", "Invite the stakeholder to the next Sprint Review to see progress", "Escalate to the sponsor", "Ignore the concern"],
    answer: 1,
    explanation: "Transparency via Sprint Reviews is the best way to address concerns about progress in agile/hybrid environments."
  },
  {
    question: "If EV = $2,000, AC = $2,500, and PV = $1,800, what is the status of the project?",
    options: ["Under budget/Ahead of schedule", "Over budget/Behind schedule", "Over budget/Ahead of schedule", "Under budget/Behind schedule"],
    answer: 2,
    explanation: "CPI = 0.8 (Over Budget). SPI = 1.11 (Ahead of Schedule)."
  }
];

const PMPPrepApp = () => {
  const [currentMode, setCurrentMode] = useState('dashboard');
  const [studyGuideSection, setStudyGuideSection] = useState('overview');
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedAns, setSelectedAns] = useState(null);
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('pmp_stats');
    return saved ? JSON.parse(saved) : { correct: 0, total: 0 };
  });

  useEffect(() => { localStorage.setItem('pmp_stats', JSON.stringify(stats)); }, [stats]);

  const handleQuizAnswer = (idx) => {
    if (selectedAns !== null) return;
    setSelectedAns(idx);
    const isCorrect = idx === QUIZ_QUESTIONS[quizIdx].answer;
    setStats(prev => ({ total: prev.total + 1, correct: isCorrect ? prev.correct + 1 : prev.correct }));
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
      <div className="min-h-screen bg-slate-50 p-6 font-sans">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm font-bold text-indigo-600">Question {quizIdx + 1}/{QUIZ_QUESTIONS.length}</span>
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

  if (currentMode === 'overview' || currentMode === 'formulas' || currentMode === 'studyguide') {
      return (
          <div className="min-h-screen bg-slate-50 p-6 font-sans">
              <div className="max-w-4xl mx-auto">
                  <div className="flex items-center gap-4 mb-8">
                      <button onClick={() => setCurrentMode('dashboard')} className="p-2 bg-white rounded-full shadow hover:shadow-md"><ArrowLeft /></button>
                      <h1 className="text-2xl font-black">{currentMode === 'formulas' ? 'Key Formulas' : currentMode === 'overview' ? 'Exam Overview' : 'Study Guide'}</h1>
                  </div>

                  {currentMode === 'formulas' && (
                      <div className="grid md:grid-cols-2 gap-6">
                          <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-indigo-500">
                              <h3 className="font-bold flex items-center gap-2 mb-4"><BarChart3 className="w-5 h-5 text-indigo-500" /> EVM</h3>
                              <div className="space-y-3">
                                  <div className="p-3 bg-indigo-50 rounded-lg flex justify-between">
                                      <span className="font-bold">CPI (Cost)</span><span>EV / AC</span>
                                  </div>
                                  <div className="p-3 bg-indigo-50 rounded-lg flex justify-between">
                                      <span className="font-bold">SPI (Schedule)</span><span>EV / PV</span>
                                  </div>
                              </div>
                          </div>
                          <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-emerald-500">
                              <h3 className="font-bold flex items-center gap-2 mb-4"><Timer className="w-5 h-5 text-emerald-500" /> Estimation</h3>
                              <div className="p-3 bg-emerald-50 rounded-lg">
                                  <div className="font-bold mb-1">PERT (Beta)</div>
                                  <div className="text-sm font-mono">(O + 4M + P) / 6</div>
                              </div>
                          </div>
                      </div>
                  )}

                  {currentMode === 'overview' && (
                      <div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-center">
                              <div className="bg-white p-4 rounded-xl shadow-sm"><div className="text-2xl font-bold text-indigo-600">180</div><div className="text-xs uppercase text-slate-500">Questions</div></div>
                              <div className="bg-white p-4 rounded-xl shadow-sm"><div className="text-2xl font-bold text-indigo-600">230</div><div className="text-xs uppercase text-slate-500">Minutes</div></div>
                              <div className="bg-white p-4 rounded-xl shadow-sm"><div className="text-2xl font-bold text-indigo-600">2</div><div className="text-xs uppercase text-slate-500">Breaks</div></div>
                              <div className="bg-white p-4 rounded-xl shadow-sm"><div className="text-2xl font-bold text-indigo-600">3</div><div className="text-xs uppercase text-slate-500">Domains</div></div>
                          </div>
                          <div className="bg-white p-8 rounded-3xl shadow-sm">
                              <h2 className="text-xl font-bold mb-6">Exam Day Strategy</h2>
                              <ul className="space-y-4 text-slate-600">
                                  <li className="flex gap-4">
                                      <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center shrink-0 text-sm font-bold">1</span>
                                      <p>Manage your time (approx. 75 sec per question).</p>
                                  </li>
                                  <li className="flex gap-4">
                                      <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center shrink-0 text-sm font-bold">2</span>
                                      <p>Take your two 10-minute breaks after Q60 and Q120.</p>
                                  </li>
                              </ul>
                          </div>
                      </div>
                  )}

                  {currentMode === 'studyguide' && (
                      <div>
                          <div className="flex gap-2 overflow-x-auto mb-6 pb-2 no-scrollbar">
                              {['overview', 'tasks', 'agile', 'traps'].map(s => (
                                  <button key={s} onClick={() => setStudyGuideSection(s)} className={`px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all ${studyGuideSection === s ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 shadow-sm'}`}>
                                      {s.toUpperCase()}
                                  </button>
                              ))}
                          </div>
                          <div className="space-y-4">
                              {studyGuideSection === 'tasks' ? (
                                  <div className="grid gap-4">
                                      <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-indigo-500">
                                          <h3 className="font-bold mb-2 text-indigo-900">Domain I: People (42%)</h3>
                                          <p className="text-sm text-slate-600">Manage conflict, lead team, mentor others, support performance.</p>
                                      </div>
                                      <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-emerald-500">
                                          <h3 className="font-bold mb-2 text-emerald-900">Domain II: Process (50%)</h3>
                                          <p className="text-sm text-slate-600">Scope, schedule, budget, risk, communications, quality, procurement.</p>
                                      </div>
                                  </div>
                              ) : studyGuideSection === 'traps' ? (
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-red-500">
                                        <h3 className="font-bold mb-1">The "DIY" Trap</h3>
                                        <p className="text-sm text-slate-600">The PM doesn't do technical work; they facilitate the team.</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-red-500">
                                        <h3 className="font-bold mb-1">Immediate Escalation</h3>
                                        <p className="text-sm text-slate-600">Analyze and try to solve with the team before telling the sponsor.</p>
                                    </div>
                                </div>
                              ) : (
                                  <div className="bg-white p-12 rounded-3xl text-center shadow-sm">
                                      <Award className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
                                      <h2 className="text-xl font-bold">Welcome to the Study Guide</h2>
                                      <p className="text-slate-500">Select a section above to begin.</p>
                                  </div>
                              )}
                          </div>
                      </div>
                  )}
              </div>
          </div>
      );
  }

  // --- DASHBOARD (HOME) ---
  const score = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white mb-8 shadow-xl">
          <h1 className="text-3xl font-black italic mb-2 tracking-tight">PMP MASTERY 2026</h1>
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

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <button onClick={() => setCurrentMode('quiz')} className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-all text-center border border-slate-100 group">
            <Zap className="w-10 h-10 text-amber-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <span className="text-xl font-black block">START QUIZ</span>
          </button>
          <button onClick={() => setCurrentMode('studyguide')} className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-all text-center border border-slate-100 group">
            <Target className="w-10 h-10 text-indigo-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <span className="text-xl font-black block">STUDY GUIDE</span>
          </button>
          <button onClick={() => setCurrentMode('overview')} className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-all text-center border border-slate-100 group">
            <Award className="w-10 h-10 text-emerald-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <span className="text-xl font-black block">EXAM OVERVIEW</span>
          </button>
        </div>

        <h2 className="text-xl font-black text-slate-800 mb-4 px-2">QUICK STUDY LINKS</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button onClick={() => setCurrentMode('formulas')} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3 hover:bg-slate-50 transition-colors">
            <BarChart3 className="text-blue-500 w-5 h-5"/> <span className="font-bold text-sm text-slate-700">Formulas</span>
          </button>
          <button onClick={() => {setCurrentMode('studyguide'); setStudyGuideSection('agile');}} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3 hover:bg-slate-50 transition-colors">
            <Zap className="text-pink-500 w-5 h-5"/> <span className="font-bold text-sm text-slate-700">Agile</span>
          </button>
          <button onClick={() => {setCurrentMode('studyguide'); setStudyGuideSection('traps');}} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3 hover:bg-slate-50 transition-colors">
            <AlertCircle className="text-amber-500 w-5 h-5"/> <span className="font-bold text-sm text-slate-700">Traps</span>
          </button>
          <button onClick={() => {setCurrentMode('studyguide'); setStudyGuideSection('tasks');}} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3 hover:bg-slate-50 transition-colors">
            <Settings className="text-indigo-500 w-5 h-5"/> <span className="font-bold text-sm text-slate-700">ECO Tasks</span>
          </button>
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(<PMPPrepApp />, document.getElementById('root'));