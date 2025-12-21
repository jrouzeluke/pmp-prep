const { useState, useEffect, useRef } = React;

const PMPApp = () => {
  const domainMap = {
    "People Domain": ["Manage Conflict", "Lead a Team", "Support Performance", "Empower Team", "Train Team", "Build Team", "Address Obstacles", "Negotiate Agreements", "Collaborate Stakeholders", "Build Understanding", "Support Virtual Teams", "Define Team Ground Rules", "Mentor Stakeholders", "Promote Performance"],
    "Process Domain": ["Execute Urgency", "Manage Communications", "Assess Risk", "Engage Stakeholders", "Plan Budget", "Plan Schedule", "Plan Quality", "Plan Scope", "Integrate Planning", "Manage Changes", "Plan Procurement", "Manage Artifacts", "Determine Methodology", "Establish Governance", "Manage Issues", "Transfer Knowledge", "Plan Closure"],
    "Business Domain": ["Plan Compliance", "Evaluate Benefits", "Support Change", "Employ Continuous Improvement"]
  };

  const [view, setView] = useState('executive-hud');
  const [selectedTask, setSelectedTask] = useState('Manage Conflict');
  const [taskDatabase, setTaskDatabase] = useState(null);
  const [subView, setSubView] = useState('overview');
  const [error, setError] = useState(null);
  // State for collapsible deep dive sections
  const [expandedStages, setExpandedStages] = useState({});
  const [expandedStyles, setExpandedStyles] = useState({});
  const [simulatorState, setSimulatorState] = useState({
    currentScene: 0,
    morale: 75,
    projectHealth: 75,
    trust: 75,
    choices: [],
    showingFeedback: false,
    showEndScreen: false
  });
  const [lightningRoundState, setLightningRoundState] = useState({
    currentQuestion: 0,
    score: 0,
    streak: 0,
    timeRemaining: 30,
    userAnswers: [],
    showingFeedback: false,
    lastAnswerCorrect: false,
    lastAnswerTime: 0,
    showEndScreen: false,
    quizStarted: false
  });
  const [documentDetectiveState, setDocumentDetectiveState] = useState({
    currentCase: 0,
    selectedDocs: [],
    showingFeedback: false,
    score: 0,
    currentQuestion: 0,
    showingAnswer: false,
    userAnswers: {}
  });
  const [conflictMatcherState, setConflictMatcherState] = useState({
    matches: {}, // { scenarioId: mode }
    showingFeedback: false,
    score: 0,
    draggedScenario: null
  });
  const [timelineReconstructorState, setTimelineReconstructorState] = useState({
    steps: [], // Array of step objects in current order
    showingFeedback: false,
    score: 0,
    draggedStep: null,
    dragOverIndex: null,
    expandedCards: {} // Track which cards are expanded: { eventId: true/false }
  });
  const [empathyExerciseState, setEmpathyExerciseState] = useState({
    currentScenario: 0,
    currentPerspective: 'personA',
    viewedPerspectives: {},
    showingInsight: false,
    reflections: {}
  });
  const [teamMemberPerspectivesState, setTeamMemberPerspectivesState] = useState({
    currentPart: 1, // 1 = Alex's Journey, 2 = Crisis Perspectives, 3 = Sarah's Perspective
    currentScenario: '1A', // 1A-1E for Part 1, 2A-2D for Part 2, 3 for Part 3
    viewedScenarios: {},
    showingAnalysis: {},
    reflections: {}
  });
  
  // View Transition and Animation States
  const [viewTransition, setViewTransition] = useState({ isTransitioning: false, nextView: null });
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Collapsible learning tabs state - tracks which content sections are expanded for each tab
  // Format: { 'overview': { 'definition': true, 'module_introduction': false }, ... }
  const [expandedLearningSections, setExpandedLearningSections] = useState({
    'overview': {},
    'pmp-application': {},
    'deep-dive': {}
  });
  
  // Progress Tracking State
  const [progressData, setProgressData] = useState({
    completedActivities: {}, // { 'taskName': { 'activityName': { completed: true, completedAt: 'date', attempts: 1, bestScore: 0 } } }
    activityScores: {} // { 'taskName': { 'activityName': [{ attempt: 1, score: 0, date: 'date', ... }] } }
  });
  
  // Task Progress Modal State
  const [showTaskProgressModal, setShowTaskProgressModal] = useState(false);

  // Comprehensive Score Persistence Utilities
  const getOrCreateUserId = () => {
    const stored = localStorage.getItem('pmp-hub-scores-v1');
    if (stored) {
      const data = JSON.parse(stored);
      if (data.userId) return data.userId;
    }
    // Generate anonymous UUID
    const userId = 'user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    const initialData = {
      userId,
      scores: {},
      totalActivitiesCompleted: 0,
      totalTimeSpent: 0,
      lastActive: new Date().toISOString()
    };
    localStorage.setItem('pmp-hub-scores-v1', JSON.stringify(initialData));
    return userId;
  };

  const getScoreData = () => {
    try {
      const stored = localStorage.getItem('pmp-hub-scores-v1');
      if (!stored) {
        const userId = getOrCreateUserId();
        return {
          userId,
          scores: {},
          totalActivitiesCompleted: 0,
          totalTimeSpent: 0,
          lastActive: new Date().toISOString()
        };
      }
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error reading score data:', e);
      const userId = getOrCreateUserId();
      return {
        userId,
        scores: {},
        totalActivitiesCompleted: 0,
        totalTimeSpent: 0,
        lastActive: new Date().toISOString()
      };
    }
  };

  const saveScoreData = (data) => {
    try {
      data.lastActive = new Date().toISOString();
      localStorage.setItem('pmp-hub-scores-v1', JSON.stringify(data));
    } catch (e) {
      console.error('Error saving score data:', e);
    }
  };

  const recordComprehensiveScore = (taskName, activityName, attemptData) => {
    const scoreData = getScoreData();
    
    // Initialize structure if needed
    if (!scoreData.scores[taskName]) scoreData.scores[taskName] = {};
    if (!scoreData.scores[taskName][activityName]) {
      scoreData.scores[taskName][activityName] = {
        attempts: [],
        bestScore: 0,
        bestAccuracy: 0
      };
    }

    const activity = scoreData.scores[taskName][activityName];
    const attemptNumber = activity.attempts.length + 1;
    
    // Add attempt
    const attempt = {
      attemptNumber,
      ...attemptData,
      date: new Date().toISOString()
    };
    activity.attempts.push(attempt);

    // Update best scores
    if (attemptData.score && attemptData.score > activity.bestScore) {
      activity.bestScore = attemptData.score;
    }
    if (attemptData.accuracy && attemptData.accuracy > activity.bestAccuracy) {
      activity.bestAccuracy = attemptData.accuracy;
    }

    // Update totals
    scoreData.totalActivitiesCompleted = Object.values(scoreData.scores)
      .reduce((sum, task) => sum + Object.values(task).reduce((s, act) => s + act.attempts.length, 0), 0);
    
    if (attemptData.timeSpent) {
      scoreData.totalTimeSpent = (scoreData.totalTimeSpent || 0) + attemptData.timeSpent;
    }

    saveScoreData(scoreData);
    return attempt;
  };

  const getBestScore = (taskName, activityName) => {
    const scoreData = getScoreData();
    return scoreData.scores[taskName]?.[activityName]?.bestScore || 0;
  };

  const getActivityStats = (taskName, activityName) => {
    const scoreData = getScoreData();
    return scoreData.scores[taskName]?.[activityName] || null;
  };


  useEffect(() => {
    // Load taskData.json with timeout to prevent hanging
    let timeoutId;
    const controller = new AbortController();
    
    const fetchData = async () => {
      timeoutId = setTimeout(() => {
        console.warn("taskData.json fetch timed out after 10 seconds");
        controller.abort();
        setTaskDatabase({}); // Set empty object so app can continue
      }, 10000); // 10 second timeout
      
      try {
        const response = await fetch('./data/taskData.json', { signal: controller.signal });
        if (timeoutId) clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Task data loaded successfully", Object.keys(data));
        setTaskDatabase(data);
      } catch (err) {
        if (timeoutId) clearTimeout(timeoutId);
        if (err.name !== 'AbortError') {
          console.error("Data Load Failure", err);
          // Set user-friendly error message
          const errorMessage = err.message || 'Failed to load task data';
          setError({
            type: 'data_load_error',
            message: errorMessage,
            details: `Unable to load task data from './data/taskData.json'. Please ensure the file exists and is accessible.`,
            timestamp: new Date().toISOString()
          });
        }
        // Don't block the app - set empty database so app can still render
        console.log("Setting empty database due to error");
        setTaskDatabase({});
      }
    };
    
    fetchData();
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (!controller.signal.aborted) {
        controller.abort();
      }
    };
  }, []);

  // Track learn tab views
  useEffect(() => {
    if (view === 'learn-hub' && selectedTask) {
      const key = `learn-viewed-${selectedTask}-${subView}`;
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, new Date().toISOString());
      }
    }
  }, [view, selectedTask, subView]);
  
  // Track activity access
  useEffect(() => {
    const activityViews = ['pm-simulator', 'lightning-round', 'document-detective', 'conflict-matcher', 'timeline-reconstructor', 'empathy-exercise', 'team-member-perspectives'];
    if (activityViews.includes(view) && selectedTask) {
      const activityKey = `activity-accessed-${selectedTask}-${view}`;
      if (!localStorage.getItem(activityKey)) {
        localStorage.setItem(activityKey, new Date().toISOString());
      }
    }
  }, [view, selectedTask]);

  // Lightning Round Timer Effect
  useEffect(() => {
    if (view !== 'lightning-round') return;
    if (!lightningRoundState.quizStarted || lightningRoundState.showingFeedback || lightningRoundState.showEndScreen) return;
    
    if (lightningRoundState.timeRemaining > 0) {
      const timer = setTimeout(() => {
        setLightningRoundState(prev => ({ ...prev, timeRemaining: prev.timeRemaining - 1 }));
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Time ran out - mark as incorrect
      setLightningRoundState(prev => {
        const timeUsed = 30;
        return {
          ...prev,
          showingFeedback: true,
          lastAnswerCorrect: false,
          lastAnswerTime: timeUsed,
          streak: 0,
          userAnswers: [...prev.userAnswers, {
            question: prev.currentQuestion,
            correct: false,
            timeUsed,
            points: 0
          }]
        };
      });

      // Auto-advance after timeout feedback
      setTimeout(() => {
        setLightningRoundState(prev => {
          const reflexPrompts = taskDatabase?.[selectedTask]?.practice?.reflex_prompts || [];
          const totalQuestions = Math.min(10, reflexPrompts.length);
          const bestScore = parseInt(localStorage.getItem(`lightning-round-best-${selectedTask}`) || '0');
          
          if (prev.currentQuestion < totalQuestions - 1) {
            return {
              ...prev,
              currentQuestion: prev.currentQuestion + 1,
              timeRemaining: 30,
              showingFeedback: false
            };
          } else {
            const finalScore = prev.score;
            if (finalScore > bestScore) {
              localStorage.setItem(`lightning-round-best-${selectedTask}`, finalScore.toString());
            }
            return {
              ...prev,
              showEndScreen: true,
              showingFeedback: false
            };
          }
        });
      }, 3000);
    }
  }, [view, lightningRoundState.timeRemaining, lightningRoundState.quizStarted, lightningRoundState.showingFeedback, lightningRoundState.showEndScreen, selectedTask, taskDatabase]);

  // View Transition Handler - wraps setView with animation
  const handleViewChange = (newView, e = null) => {
    if (view === newView) return;
    if (e) createRipple(e);
    
    setViewTransition({ isTransitioning: true, nextView: newView });
    
    setTimeout(() => {
      setView(newView);
      setTimeout(() => {
        setViewTransition({ isTransitioning: false, nextView: null });
      }, 50);
    }, 200);
  };

  // Wrapper for setView that maintains backward compatibility
  const setViewWithTransition = (newView, useTransition = true) => {
    if (useTransition) {
      handleViewChange(newView);
    } else {
      setView(newView);
    }
  };

  // Ripple Effect Handler
  const createRipple = (event) => {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add('ripple');

    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
      ripple.remove();
    }

    button.appendChild(circle);
    
    setTimeout(() => {
      circle.remove();
    }, 600);
  };

  // Confetti Effect
  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  };

  // Confetti Component - defined early so it can be used throughout
  const Confetti = () => {
    if (!showConfetti) return null;
    
    const confettiPieces = Array.from({ length: 50 }, (_, i) => {
      const colors = ['#fbbf24', '#3b82f6', '#10b981', '#f43f5e', '#a855f7'];
      return (
        <div
          key={i}
          className="confetti"
          style={{
            left: `${Math.random() * 100}%`,
            background: colors[i % colors.length],
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`
          }}
        />
      );
    });

    return <div className="confetti-container">{confettiPieces}</div>;
  };

  // Define GlobalNavFooter early so it can be used in early returns
  const GlobalNavFooter = () => (
    <div className="flex justify-center gap-8 mt-12 border-t border-white/10 pt-8">
        <button onClick={(e) => { createRipple(e); handleViewChange('strategy-suite'); }} className="text-xs text-slate-400 uppercase font-semibold hover:text-blue-400 transition-colors executive-font btn-ripple">Learn</button>
        <button onClick={(e) => { createRipple(e); handleViewChange('practice-hub'); }} className="text-xs text-slate-400 uppercase font-semibold hover:text-purple-400 transition-colors executive-font btn-ripple">Practice</button>
        <button onClick={(e) => { createRipple(e); handleViewChange('practice-quizzes'); }} className="text-xs text-slate-400 uppercase font-semibold hover:text-emerald-400 transition-colors executive-font btn-ripple">Quizzes</button>
        <button onClick={(e) => { createRipple(e); handleViewChange('strategy-suite'); }} className="text-xs text-slate-400 uppercase font-semibold hover:text-cyan-400 transition-colors executive-font btn-ripple">Task Areas</button>
        <button onClick={(e) => { createRipple(e); handleViewChange('progress-stats'); }} className="text-xs text-slate-400 uppercase font-semibold hover:text-amber-400 transition-colors executive-font btn-ripple">My Progress</button>
        <button onClick={(e) => { createRipple(e); handleViewChange('personal-stats'); }} className="text-xs text-slate-400 uppercase font-semibold hover:text-rose-400 transition-colors executive-font btn-ripple">Personal Stats</button>
        {view !== 'executive-hud' && (
          <button onClick={(e) => { createRipple(e); handleViewChange('executive-hud'); }} className="text-xs text-slate-400 uppercase font-semibold hover:text-blue-400 transition-colors executive-font btn-ripple">Home</button>
        )}
    </div>
  );

  // Show loading only if taskDatabase hasn't been initialized yet (null, not empty object)
  if (taskDatabase === null) {
    return (
    <div className="text-center p-20 animate-pulse">
        <h1 className="executive-font text-4xl text-white font-semibold tracking-tight">Initializing PMP Prep Center...</h1>
        <GlobalNavFooter />
    </div>
  );
  }

  // Error Display Component
  const ErrorBanner = () => {
    if (!error) return null;
    
    return (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-2xl w-full mx-4">
        <div className="glass-card p-4 border-l-4 border-red-500 bg-red-500/10">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-red-400 text-xl">⚠️</span>
                <h3 className="executive-font text-lg font-semibold text-red-400">Error</h3>
              </div>
              <p className="text-white mb-1">{error.message}</p>
              {error.details && (
                <p className="text-slate-400 text-sm">{error.details}</p>
              )}
              {error.timestamp && (
                <p className="text-slate-500 text-xs mt-2">
                  {new Date(error.timestamp).toLocaleString()}
                </p>
              )}
            </div>
            <button
              onClick={() => setError(null)}
              className="text-slate-400 hover:text-white transition-colors px-2 py-1"
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    );
  };

  const currentTask = (taskDatabase && taskDatabase[selectedTask]) || { learn: {}, practice: { checklist: [], reflex_prompts: [], stress_test: [] } };

  // Progress tracking helper functions
  const recordActivityCompletion = (taskName, activityName, score = null, metadata = {}) => {
    const date = new Date().toISOString().split('T')[0];
    
    setProgressData(prev => {
      const newCompleted = { ...prev.completedActivities };
      const newScores = { ...prev.activityScores };
      
      // Initialize task if needed
      if (!newCompleted[taskName]) newCompleted[taskName] = {};
      if (!newScores[taskName]) newScores[taskName] = {};
      
      // Update completion data
      const existingCompletion = newCompleted[taskName][activityName] || { attempts: 0, bestScore: 0 };
      newCompleted[taskName][activityName] = {
        completed: true,
        completedAt: existingCompletion.completedAt || date,
        attempts: existingCompletion.attempts + 1,
        bestScore: score !== null ? Math.max(existingCompletion.bestScore || 0, score) : existingCompletion.bestScore,
        lastAttempted: date,
        ...metadata
      };
      
      // Update scores array
      if (score !== null) {
        if (!newScores[taskName][activityName]) newScores[taskName][activityName] = [];
        newScores[taskName][activityName].push({
          attempt: existingCompletion.attempts + 1,
          score,
          date,
          ...metadata
        });
      }
      
      return {
        completedActivities: newCompleted,
        activityScores: newScores
      };
    });
  };

  const getActivityProgress = (taskName, activityName) => {
    return progressData.completedActivities[taskName]?.[activityName] || null;
  };

  const getTaskMastery = (taskName) => {
    const activities = ['pm-simulator', 'lightning-round', 'document-detective', 'conflict-matcher', 'timeline-reconstructor', 'empathy-exercise'];
    const completed = activities.filter(activity => 
      progressData.completedActivities[taskName]?.[activity]?.completed
    ).length;
    
    if (completed === 0) return { level: 'not-started', completed, total: 6, label: 'Not Started', color: 'slate' };
    if (completed <= 3) return { level: 'in-progress', completed, total: 6, label: 'In Progress', color: 'yellow' };
    if (completed <= 5) return { level: 'advanced', completed, total: 6, label: 'Advanced', color: 'orange' };
    return { level: 'mastered', completed, total: 6, label: 'Mastered', color: 'emerald' };
  };

  // Keep old GlobalFooter for backward compatibility if needed
  const GlobalFooter = GlobalNavFooter;

  // Practice Quizzes View
  if (view === 'practice-quizzes') return (
    <div className="max-w-7xl w-full p-10 animate-fadeIn">
      <div className="executive-header mb-8">
        <h1 className="executive-font text-5xl font-bold text-white mb-2 tracking-tight">Practice Quizzes</h1>
        <p className="text-slate-400 text-lg">Test your knowledge with targeted practice sessions</p>
      </div>
      
      <div className="grid grid-cols-3 gap-6 mb-8">
        <button 
          onClick={() => {/* Add quiz navigation */}}
          className="glass-card p-8 text-left hover:bg-blue-500/10 transition-all border-l-4 border-blue-500"
        >
          <h3 className="executive-font text-xl font-semibold text-white mb-3">Quick Practice</h3>
          <p className="text-slate-400 text-sm mb-4">10-20 questions on any topic</p>
          <div className="text-xs text-blue-400 uppercase font-semibold">Start Quiz →</div>
        </button>
        
        <button 
          onClick={() => {/* Add domain quiz navigation */}}
          className="glass-card p-8 text-left hover:bg-purple-500/10 transition-all border-l-4 border-purple-500"
        >
          <h3 className="executive-font text-xl font-semibold text-white mb-3">Domain Focus</h3>
          <p className="text-slate-400 text-sm mb-4">Practice specific domains (People/Process/Business)</p>
          <div className="text-xs text-purple-400 uppercase font-semibold">Start Quiz →</div>
        </button>
        
        <button 
          onClick={() => {/* Add approach quiz navigation */}}
          className="glass-card p-8 text-left hover:bg-emerald-500/10 transition-all border-l-4 border-emerald-500"
        >
          <h3 className="executive-font text-xl font-semibold text-white mb-3">Approach Focus</h3>
          <p className="text-slate-400 text-sm mb-4">Practice methodologies (Agile/Predictive/Hybrid)</p>
          <div className="text-xs text-emerald-400 uppercase font-semibold">Start Quiz →</div>
        </button>
      </div>

      <button 
        onClick={() => setView('executive-hud')} 
        className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors executive-font"
      >
        ← Back to Dashboard
      </button>
      <GlobalNavFooter />
    </div>
  );

  // PM Simulator Activity View
  if (view === 'pm-simulator') {
    const stressTests = currentTask.practice?.stress_test || [];
    const currentScenario = stressTests[simulatorState.currentScene];
    const totalScenes = stressTests.length;
    
    const handleChoice = (choiceIndex) => {
      if (!currentScenario?.options) return;
      const choice = currentScenario.options[choiceIndex];
      
      // Infer meter changes based on outcome - SUCCESS outcomes increase, others decrease
      const isSuccess = choice.outcome?.toUpperCase().includes('SUCCESS') || choice.outcome?.toUpperCase().includes('BEST OUTCOME');
      const isBad = choice.outcome?.toLowerCase().includes('loses') || choice.outcome?.toLowerCase().includes('collapses') || choice.outcome?.toLowerCase().includes('fails');
      
      let moraleChange = 0;
      let projectHealthChange = 0;
      let trustChange = 0;
      
      if (isSuccess) {
        moraleChange = 15;
        projectHealthChange = 15;
        trustChange = 15;
      } else if (isBad) {
        moraleChange = -20;
        projectHealthChange = -20;
        trustChange = -25;
      } else {
        // Neutral outcomes - small changes
        moraleChange = -5;
        projectHealthChange = -5;
        trustChange = -5;
      }
      
      const newMorale = Math.max(0, Math.min(100, simulatorState.morale + moraleChange));
      const newProjectHealth = Math.max(0, Math.min(100, simulatorState.projectHealth + projectHealthChange));
      const newTrust = Math.max(0, Math.min(100, simulatorState.trust + trustChange));
      
      setSimulatorState({
        ...simulatorState,
        choices: [...simulatorState.choices, { scene: simulatorState.currentScene, choiceIndex, choice }],
        showingFeedback: true,
        lastChoice: choiceIndex,
        moraleChange,
        projectHealthChange,
        trustChange,
        morale: newMorale,
        projectHealth: newProjectHealth,
        trust: newTrust
      });
    };

    const continueToNextScene = () => {
      if (simulatorState.currentScene < totalScenes - 1) {
        setSimulatorState({
          ...simulatorState,
          currentScene: simulatorState.currentScene + 1,
          showingFeedback: false
        });
      } else {
        // Scenario complete - record comprehensive score
        const finalScore = Math.round((simulatorState.morale + simulatorState.projectHealth + simulatorState.trust) / 3);
        const choicesMade = simulatorState.choices.map(c => String.fromCharCode(65 + c.choiceIndex));
        
        recordComprehensiveScore(selectedTask, 'pm-simulator', {
          score: finalScore,
          finalMetrics: {
            morale: simulatorState.morale,
            projectHealth: simulatorState.projectHealth,
            trust: simulatorState.trust
          },
          choicesMade,
          outcome: finalScore >= 70 ? 'success' : 'needs_improvement',
          timeSpent: simulatorState.choices.length * 60 // Estimate: 1 minute per choice
        });

        setSimulatorState({
          ...simulatorState,
          showingFeedback: false,
          showEndScreen: true
        });
      }
    };

    const getBarColor = (value) => {
      if (value >= 70) return 'bg-emerald-500';
      if (value >= 40) return 'bg-yellow-500';
      return 'bg-red-500';
    };

    if (!stressTests || stressTests.length === 0) {
      return (
        <div className={`max-w-6xl w-full p-10 animate-fadeIn text-left view-transition-wrapper ${viewTransition.isTransitioning && viewTransition.nextView !== 'pm-simulator' ? 'view-transition-exit' : 'view-transition-enter'}`}>
          <div className="glass-card p-10 text-center">
            <h1 className="executive-font text-3xl font-bold text-white mb-4">PM Simulator</h1>
            <p className="text-slate-400">No scenarios available for this task.</p>
            <button 
              onClick={(e) => { createRipple(e); handleViewChange('practice-hub'); }}
              className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors executive-font btn-ripple"
            >
              ← Back to Practice Hub
            </button>
            <GlobalNavFooter />
          </div>
        </div>
      );
    }

    // End Screen
    if (simulatorState.showEndScreen) {
      const finalScore = Math.round((simulatorState.morale + simulatorState.projectHealth + simulatorState.trust) / 3);
      const missionStatus = finalScore >= 70 ? "Mission Complete" : "Mission Failed";
      const bestScore = getBestScore(selectedTask, 'pm-simulator');
      const isNewBest = finalScore > bestScore;
      
      // Trigger confetti on success
      if (finalScore >= 70 && !showConfetti) {
        setTimeout(() => triggerConfetti(), 300);
      }
      
      return (
        <>
          <Confetti />
          <div className="max-w-6xl w-full p-10 animate-fadeIn text-left success-modal">
            <header className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <button 
                onClick={() => {
                  setSimulatorState({ currentScene: 0, morale: 75, projectHealth: 75, trust: 75, choices: [], showingFeedback: false, showEndScreen: false });
                  setView('practice-hub');
                }}
                className="px-4 py-2 executive-font text-xs text-slate-400 hover:text-white uppercase font-semibold transition-colors flex items-center gap-2"
              >
                ← Back
              </button>
            </div>
            <h1 className="executive-font text-5xl font-bold text-white tracking-tight">{missionStatus}</h1>
          </header>

          <div className="glass-card p-8 mb-6">
            <div className="text-center mb-6">
              <h2 className="executive-font text-3xl font-bold text-white mb-2">Final Score: {finalScore}%</h2>
              {isNewBest && (
                <p className="text-emerald-400 text-xl font-bold animate-pulse mt-2">🏆 NEW HIGH SCORE! 🏆</p>
              )}
              <div className="flex justify-center items-center gap-4 mt-3 text-lg">
                <span className="text-slate-400">Previous best: <span className="text-white font-semibold">{bestScore}%</span></span>
                <span className="text-slate-500">|</span>
                <span className="text-emerald-400 font-semibold">Today: {finalScore}%</span>
                {isNewBest && <span className="text-emerald-400">🎉</span>}
              </div>
            </div>
            <h2 className="executive-font text-2xl font-bold text-white mb-6">Final Status</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-white font-semibold">Team Morale</span>
                  <span className="text-white font-bold">{simulatorState.morale}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-4">
                  <div className={`${getBarColor(simulatorState.morale)} h-4 rounded-full status-meter`} style={{width: `${simulatorState.morale}%`}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-white font-semibold">Project Health</span>
                  <span className="text-white font-bold">{simulatorState.projectHealth}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-4">
                  <div className={`${getBarColor(simulatorState.projectHealth)} h-4 rounded-full status-meter`} style={{width: `${simulatorState.projectHealth}%`}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-white font-semibold">Trust</span>
                  <span className="text-white font-bold">{simulatorState.trust}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-4">
                  <div className={`${getBarColor(simulatorState.trust)} h-4 rounded-full status-meter`} style={{width: `${simulatorState.trust}%`}}></div>
                </div>
              </div>
            </div>
          </div>

          {simulatorState.choices.length > 0 && (
            <div className="glass-card p-8 mb-6">
              <h2 className="executive-font text-2xl font-bold text-white mb-4">Your Choices</h2>
              <div className="space-y-4">
                {simulatorState.choices.map((choiceRecord, idx) => {
                  const choice = choiceRecord.choice;
                  return (
                    <div key={idx} className="border-l-4 border-blue-500 pl-4">
                      <h3 className="text-white font-semibold mb-2">Scene {choiceRecord.scene + 1}</h3>
                      <p className="text-slate-300 text-sm mb-2">{choice.text}</p>
                      {choice.analysis && <p className="text-xs text-slate-400 mb-1">{choice.analysis}</p>}
                      {choice.outcome && <p className="text-xs text-slate-400">{choice.outcome}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button 
              onClick={() => setSimulatorState({ currentScene: 0, morale: 75, projectHealth: 75, trust: 75, choices: [], showingFeedback: false, showEndScreen: false })}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors executive-font"
            >
              Try Again
            </button>
            <button 
              onClick={() => {
                setSimulatorState({ currentScene: 0, morale: 75, projectHealth: 75, trust: 75, choices: [], showingFeedback: false, showEndScreen: false });
                setView('practice-hub');
              }}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors executive-font"
            >
              Back to Practice Hub
            </button>
          </div>
          <GlobalNavFooter />
        </div>
        </>
      );
    }

    // Feedback Screen
    if (simulatorState.showingFeedback && simulatorState.lastChoice !== undefined && currentScenario?.options) {
      const choice = currentScenario.options[simulatorState.lastChoice];
      const isGoodChoice = (simulatorState.moraleChange || 0) + (simulatorState.projectHealthChange || 0) + (simulatorState.trustChange || 0) > 0;
      
      return (
        <div className="max-w-6xl w-full p-10 animate-fadeIn text-left view-transition-wrapper">
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <button 
                onClick={() => {
                  setSimulatorState({ currentScene: 0, morale: 75, projectHealth: 75, trust: 75, choices: [], showingFeedback: false, showEndScreen: false });
                  setView('practice-hub');
                }}
                className="px-4 py-2 executive-font text-xs text-slate-400 hover:text-white uppercase font-semibold transition-colors flex items-center gap-2"
              >
                ← Back
              </button>
            </div>
            <h1 className="executive-font text-5xl font-bold text-white tracking-tight">PM Simulator: {currentScenario?.title || 'Scenario'}</h1>
          </header>

          {/* Status Meters */}
          <div className="glass-card p-6 mb-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-white font-semibold">Team Morale</span>
                  <span className="text-white font-bold">{simulatorState.morale}% {simulatorState.moraleChange > 0 ? '↗️' : simulatorState.moraleChange < 0 ? '↘️' : ''} {simulatorState.moraleChange !== 0 && `${simulatorState.moraleChange > 0 ? '+' : ''}${simulatorState.moraleChange}%`}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-4">
                  <div className={`${getBarColor(simulatorState.morale)} h-4 rounded-full status-meter`} style={{width: `${simulatorState.morale}%`}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-white font-semibold">Project Health</span>
                  <span className="text-white font-bold">{simulatorState.projectHealth}% {simulatorState.projectHealthChange > 0 ? '↗️' : simulatorState.projectHealthChange < 0 ? '↘️' : ''} {simulatorState.projectHealthChange !== 0 && `${simulatorState.projectHealthChange > 0 ? '+' : ''}${simulatorState.projectHealthChange}%`}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-4">
                  <div className={`${getBarColor(simulatorState.projectHealth)} h-4 rounded-full status-meter`} style={{width: `${simulatorState.projectHealth}%`}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-white font-semibold">Trust</span>
                  <span className="text-white font-bold">{simulatorState.trust}% {simulatorState.trustChange > 0 ? '↗️' : simulatorState.trustChange < 0 ? '↘️' : ''} {simulatorState.trustChange !== 0 && `${simulatorState.trustChange > 0 ? '+' : ''}${simulatorState.trustChange}%`}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-4">
                  <div className={`${getBarColor(simulatorState.trust)} h-4 rounded-full status-meter`} style={{width: `${simulatorState.trust}%`}}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Card */}
          <div className="glass-card p-8 mb-6 feedback-card">
            <div className={`text-4xl mb-4 ${isGoodChoice ? 'text-emerald-400' : 'text-yellow-400'}`}>
              {isGoodChoice ? '✅ EXCELLENT CHOICE!' : '⚠️ NOT IDEAL'}
            </div>
            <h2 className="executive-font text-2xl font-bold text-white mb-4">What Happened</h2>
            {choice.outcome && <p className="text-slate-300 mb-4">{choice.outcome}</p>}
            {choice.analysis && (
              <>
                <h3 className="executive-font text-lg font-semibold text-white mb-2">Analysis</h3>
                <p className="text-slate-300 mb-4">{choice.analysis}</p>
              </>
            )}
          </div>

          <button 
            onClick={(e) => { createRipple(e); continueToNextScene(); }}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors executive-font btn-ripple"
          >
            {simulatorState.currentScene < totalScenes - 1 ? `Continue to Scene ${simulatorState.currentScene + 2}` : 'View Results'}
          </button>
          <GlobalNavFooter />
        </div>
      );
    }

    // Main Scene Display
    if (!currentScenario) {
      return (
        <div className="max-w-6xl w-full p-10 animate-fadeIn text-left">
          <div className="glass-card p-10 text-center">
            <h1 className="executive-font text-3xl font-bold text-white mb-4">PM Simulator</h1>
            <p className="text-slate-400">Loading scenario...</p>
            <GlobalNavFooter />
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-6xl w-full p-10 animate-fadeIn text-left">
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => {
                setSimulatorState({ currentScene: 0, morale: 75, projectHealth: 75, trust: 75, choices: [], showingFeedback: false, showEndScreen: false });
                setView('practice-hub');
              }}
              className="px-4 py-2 executive-font text-xs text-slate-400 hover:text-white uppercase font-semibold transition-colors flex items-center gap-2"
            >
              ← Back
            </button>
          </div>
          <h1 className="executive-font text-5xl font-bold text-white tracking-tight">PM Simulator: {currentScenario?.title || 'Scenario'}</h1>
        </header>

        {/* Status Meters */}
        <div className="glass-card p-6 mb-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-white font-semibold">Team Morale</span>
                <span className="text-white font-bold">{simulatorState.morale}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-4">
                <div className={`${getBarColor(simulatorState.morale)} h-4 rounded-full status-meter`} style={{width: `${simulatorState.morale}%`}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-white font-semibold">Project Health</span>
                <span className="text-white font-bold">{simulatorState.projectHealth}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-4">
                <div className={`${getBarColor(simulatorState.projectHealth)} h-4 rounded-full status-meter`} style={{width: `${simulatorState.projectHealth}%`}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-white font-semibold">Trust</span>
                <span className="text-white font-bold">{simulatorState.trust}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-4">
                <div className={`${getBarColor(simulatorState.trust)} h-4 rounded-full status-meter`} style={{width: `${simulatorState.trust}%`}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Scene Display */}
        <div className="glass-card p-8 mb-6">
          <div className="text-slate-400 text-sm mb-4 uppercase tracking-wide">Scene {simulatorState.currentScene + 1} of {totalScenes}</div>
          <h2 className="executive-font text-2xl font-bold text-white mb-4">{currentScenario?.scenario || 'No scenario description available'}</h2>
          
          {currentScenario.options && currentScenario.options.length > 0 && (
            <div className="space-y-3 mt-6">
              {currentScenario.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={(e) => { createRipple(e); handleChoice(idx); }}
                  className={`w-full glass-card p-4 text-left hover:bg-blue-500/10 transition-all border-l-4 border-blue-500/50 hover:border-blue-500 choice-button btn-ripple`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <span className="font-bold text-blue-400 text-xl">{String.fromCharCode(65 + idx)}.</span>
                    <span className="text-white flex-1">{option.text}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        <GlobalNavFooter />
    </div>
  );
  }

  // Lightning Round Activity View
  if (view === 'lightning-round') {
    const reflexPrompts = currentTask.practice?.reflex_prompts || [];
    const totalQuestions = Math.min(10, reflexPrompts.length);
    const currentPrompt = reflexPrompts[lightningRoundState.currentQuestion];
    const bestScore = parseInt(localStorage.getItem(`lightning-round-best-${selectedTask}`) || '0');

    const handleAnswer = (answerIndex) => {
      if (!currentPrompt) return;
      const isCorrect = answerIndex === (currentPrompt.correct - 1); // Convert to 0-based index
      const timeUsed = 30 - lightningRoundState.timeRemaining;
      const newStreak = isCorrect ? lightningRoundState.streak + 1 : 0;
      
      // Calculate score
      let points = 0;
      if (isCorrect) {
        points = 500; // Base points
        points += (lightningRoundState.timeRemaining * 10); // Time bonus
        if (newStreak >= 3) {
          points = Math.floor(points * 1.5); // Streak bonus
        }
      }

      setLightningRoundState(prev => ({
        ...prev,
        score: prev.score + points,
        streak: newStreak,
        showingFeedback: true,
        lastAnswerCorrect: isCorrect,
        lastAnswerTime: timeUsed,
        userAnswers: [...prev.userAnswers, {
          question: prev.currentQuestion,
          correct: isCorrect,
          timeUsed,
          points
        }]
      }));

      // Auto-advance after 3 seconds
      setTimeout(() => {
        advanceToNextQuestion();
      }, 3000);
    };

    const advanceToNextQuestion = () => {
      if (lightningRoundState.currentQuestion < totalQuestions - 1) {
        setLightningRoundState(prev => ({
          ...prev,
          currentQuestion: prev.currentQuestion + 1,
          timeRemaining: 30,
          showingFeedback: false
        }));
      } else {
        // Quiz complete - record comprehensive score
        const finalScore = lightningRoundState.score;
        const correctCount = lightningRoundState.userAnswers.filter(a => a.correct).length;
        const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
        const avgTime = lightningRoundState.userAnswers.length > 0 
          ? lightningRoundState.userAnswers.reduce((sum, a) => sum + a.timeUsed, 0) / lightningRoundState.userAnswers.length 
          : 0;
        
        // Calculate longest streak
        let longestStreak = 0;
        let currentStreak = 0;
        lightningRoundState.userAnswers.forEach(a => {
          if (a.correct) {
            currentStreak++;
            longestStreak = Math.max(longestStreak, currentStreak);
          } else {
            currentStreak = 0;
          }
        });

        const questionsCorrect = lightningRoundState.userAnswers
          .map((a, idx) => a.correct ? idx + 1 : null)
          .filter(q => q !== null);

        // Record comprehensive score
        recordComprehensiveScore(selectedTask, 'lightning-round', {
          score: finalScore,
          accuracy,
          averageTime: Math.round(avgTime),
          longestStreak,
          questionsCorrect,
          timeSpent: 30 * totalQuestions - lightningRoundState.userAnswers.reduce((sum, a) => sum + a.timeUsed, 0)
        });

        if (finalScore > bestScore) {
          localStorage.setItem(`lightning-round-best-${selectedTask}`, finalScore.toString());
          // Trigger confetti for new high score
          setTimeout(() => triggerConfetti(), 300);
        }
        setLightningRoundState(prev => ({
          ...prev,
          showEndScreen: true,
          showingFeedback: false
        }));
      }
    };

    const startQuiz = () => {
      setLightningRoundState({
        currentQuestion: 0,
        score: 0,
        streak: 0,
        timeRemaining: 30,
        userAnswers: [],
        showingFeedback: false,
        lastAnswerCorrect: false,
        lastAnswerTime: 0,
        showEndScreen: false,
        quizStarted: true
      });
    };

    const resetQuiz = () => {
      setLightningRoundState({
        currentQuestion: 0,
        score: 0,
        streak: 0,
        timeRemaining: 30,
        userAnswers: [],
        showingFeedback: false,
        lastAnswerCorrect: false,
        lastAnswerTime: 0,
        showEndScreen: false,
        quizStarted: false
      });
    };

    // Start screen
    if (!lightningRoundState.quizStarted) {
      return (
        <div className="max-w-6xl w-full p-10 animate-fadeIn text-left">
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <button 
                onClick={() => {
                  resetQuiz();
                  setView('practice-hub');
                }}
                className="px-4 py-2 executive-font text-xs text-slate-400 hover:text-white uppercase font-semibold transition-colors flex items-center gap-2"
              >
                ← Back
              </button>
            </div>
            <h1 className="executive-font text-5xl font-bold text-white tracking-tight">⚡ Lightning Round</h1>
          </header>
          <div className="glass-card p-10 text-center">
            <h2 className="executive-font text-2xl font-bold text-white mb-4">{selectedTask}</h2>
            <p className="text-slate-400 mb-6">Test your reflexes with 10 rapid-fire questions. 30 seconds per question!</p>
            <p className="text-slate-300 mb-8">Best Score: <span className="text-emerald-400 font-bold">{bestScore.toLocaleString()}</span> points</p>
            <button 
              onClick={(e) => { createRipple(e); startQuiz(); }}
              className="px-8 py-4 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg transition-colors executive-font text-lg btn-ripple"
            >
              Start Quiz ⚡
            </button>
          </div>
          <GlobalNavFooter />
        </div>
      );
    }

    // End Screen
    if (lightningRoundState.showEndScreen) {
      const correctCount = lightningRoundState.userAnswers.filter(a => a.correct).length;
      const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
      const avgTime = lightningRoundState.userAnswers.length > 0 ? lightningRoundState.userAnswers.reduce((sum, a) => sum + a.timeUsed, 0) / lightningRoundState.userAnswers.length : 0;
      
      // Calculate longest streak
      let longestStreak = 0;
      let currentStreak = 0;
      lightningRoundState.userAnswers.forEach(a => {
        if (a.correct) {
          currentStreak++;
          longestStreak = Math.max(longestStreak, currentStreak);
        } else {
          currentStreak = 0;
        }
      });
      
      const fastestAnswer = lightningRoundState.userAnswers.length > 0 ? Math.min(...lightningRoundState.userAnswers.map(a => a.timeUsed)) : 0;
      const isNewBest = lightningRoundState.score > bestScore;
      
      return (
        <>
          <Confetti />
          <div className={`max-w-6xl w-full p-10 animate-fadeIn text-left view-transition-wrapper success-modal ${viewTransition.isTransitioning && viewTransition.nextView !== 'lightning-round' ? 'view-transition-exit' : 'view-transition-enter'}`}>
            <header className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <button 
                  onClick={(e) => { createRipple(e); resetQuiz(); handleViewChange('practice-hub'); }}
                  className="px-4 py-2 executive-font text-xs text-slate-400 hover:text-white uppercase font-semibold transition-colors flex items-center gap-2 btn-ripple"
                >
                  ← Back
                </button>
              </div>
              <h1 className="executive-font text-5xl font-bold text-white tracking-tight">🎉 Lightning Round Complete!</h1>
            </header>

          <div className="glass-card p-8 mb-6">
            <div className="text-center mb-6">
              <h2 className="executive-font text-4xl font-bold text-white mb-2">Final Score: {lightningRoundState.score.toLocaleString()}</h2>
              {isNewBest && (
                <p className="text-emerald-400 text-xl font-bold animate-pulse">🏆 NEW HIGH SCORE! 🏆</p>
              )}
              <div className="flex justify-center items-center gap-4 mt-3 text-lg">
                <span className="text-slate-400">Previous best: <span className="text-white font-semibold">{bestScore.toLocaleString()}</span></span>
                <span className="text-slate-500">|</span>
                <span className="text-emerald-400 font-semibold">Today: {lightningRoundState.score.toLocaleString()}</span>
                {isNewBest && <span className="text-emerald-400">🎉</span>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="glass-card p-4 border-l-4 border-blue-500">
                <div className="text-sm text-slate-400 uppercase mb-1">Accuracy</div>
                <div className="text-3xl font-bold text-white">{accuracy}%</div>
                <div className="text-xs text-slate-500">({correctCount}/{totalQuestions} correct)</div>
              </div>
              <div className="glass-card p-4 border-l-4 border-purple-500">
                <div className="text-sm text-slate-400 uppercase mb-1">Average Time</div>
                <div className="text-3xl font-bold text-white">{avgTime.toFixed(1)}s</div>
              </div>
              <div className="glass-card p-4 border-l-4 border-emerald-500">
                <div className="text-sm text-slate-400 uppercase mb-1">Longest Streak</div>
                <div className={`text-3xl font-bold text-white streak-counter ${longestStreak > 0 ? 'pulse' : ''}`}>{'🔥'.repeat(Math.min(longestStreak, 5))} {longestStreak}x</div>
              </div>
              <div className="glass-card p-4 border-l-4 border-yellow-500">
                <div className="text-sm text-slate-400 uppercase mb-1">Fastest Answer</div>
                <div className="text-3xl font-bold text-white">{fastestAnswer.toFixed(1)}s</div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <button 
              onClick={() => {
                startQuiz();
              }}
              className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition-colors executive-font"
            >
              Play Again ⚡
            </button>
            <button 
              onClick={() => {
                resetQuiz();
                setView('practice-hub');
              }}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors executive-font"
            >
              Back to Practice Hub
            </button>
          </div>
          <GlobalNavFooter />
        </div>
        </>
      );
    }

    if (!currentPrompt) {
      return (
        <div className="max-w-6xl w-full p-10 animate-fadeIn text-left">
          <div className="glass-card p-10 text-center">
            <h1 className="executive-font text-3xl font-bold text-white mb-4">⚡ Lightning Round</h1>
            <p className="text-slate-400">No questions available for this task.</p>
            <button 
              onClick={() => {
                resetQuiz();
                setView('practice-hub');
              }}
              className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors executive-font"
            >
              ← Back to Practice Hub
            </button>
            <GlobalNavFooter />
          </div>
        </div>
      );
    }

    // Feedback Screen
    if (lightningRoundState.showingFeedback) {
      const lastAnswer = lightningRoundState.userAnswers[lightningRoundState.userAnswers.length - 1];
      const isCorrect = lightningRoundState.lastAnswerCorrect;
      
      return (
        <div className="max-w-6xl w-full p-10 animate-fadeIn text-left">
          <header className="mb-6">
            <h1 className="executive-font text-4xl font-bold text-white tracking-tight">⚡ Lightning Round</h1>
          </header>

          <div className={`glass-card p-8 text-center mb-6 ${isCorrect ? 'correct-flash' : 'incorrect-flash'}`}>
            <div className={`text-6xl mb-4 ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
              {isCorrect ? '✅' : '❌'}
            </div>
            {isCorrect && (
              <div className="text-2xl font-bold text-emerald-400 mb-2 score-counter animate">
                +{lastAnswer.points.toLocaleString()} points
              </div>
            )}
            {currentPrompt.explanation && (
              <p className="text-slate-300 mb-4">{currentPrompt.explanation}</p>
            )}
            {currentPrompt.mode_used && (
              <div className="text-emerald-400 font-semibold mb-2">Conflict Mode: {currentPrompt.mode_used}</div>
            )}
          </div>

          <div className="text-center text-slate-400">Moving to next question...</div>
          <GlobalNavFooter />
        </div>
      );
    }

    // Question Display
    const timeProgress = (lightningRoundState.timeRemaining / 30) * 100;
    const streakFires = '🔥'.repeat(Math.min(lightningRoundState.streak, 5));

    return (
      <div className="max-w-6xl w-full p-10 animate-fadeIn text-left">
        <header className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <button 
              onClick={() => {
                resetQuiz();
                setView('practice-hub');
              }}
              className="px-4 py-2 executive-font text-xs text-slate-400 hover:text-white uppercase font-semibold transition-colors flex items-center gap-2"
            >
              ← Back
            </button>
          </div>
          <h1 className="executive-font text-4xl font-bold text-white tracking-tight">⚡ Lightning Round</h1>
        </header>

        {/* Timer Progress Bar */}
        <div className="glass-card p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="text-slate-400 text-sm">⏱️ {lightningRoundState.timeRemaining}s</div>
            <div className={`text-slate-400 text-sm streak-counter ${lightningRoundState.streak > 0 ? 'pulse' : ''}`}>
              Streak: {streakFires} {lightningRoundState.streak}x
            </div>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-3">
            <div 
              className={`${lightningRoundState.timeRemaining > 10 ? 'bg-yellow-500' : 'bg-red-500'} h-3 rounded-full timer-bar`}
              style={{width: `${timeProgress}%`}}
            ></div>
          </div>
        </div>

        {/* Question Counter and Score */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-slate-400 text-sm uppercase tracking-wide">Question {lightningRoundState.currentQuestion + 1}/10</div>
          <div className="flex gap-4 text-sm">
            <div className="text-white">Score: <span className="text-yellow-400 font-bold score-counter">{lightningRoundState.score.toLocaleString()}</span></div>
            <div className="text-slate-400">Best: <span className="text-emerald-400">{bestScore.toLocaleString()}</span></div>
          </div>
        </div>

        {/* Question */}
        <div className="glass-card p-8 mb-6">
          <h2 className="executive-font text-2xl font-bold text-white mb-6">{currentPrompt.question}</h2>
          
          <div className="space-y-3">
            {currentPrompt.options?.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className="w-full glass-card p-4 text-left hover:bg-blue-500/10 transition-all border-l-4 border-blue-500/50 hover:border-blue-500"
              >
                <div className="flex items-start gap-3">
                  <span className="font-bold text-blue-400 text-xl">{String.fromCharCode(65 + idx)}.</span>
                  <span className="text-white flex-1">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
        <GlobalNavFooter />
      </div>
    );
  }

  // Document Detective Activity View
  if (view === 'document-detective') {
    if (!currentTask) {
      return (
        <div className="max-w-6xl w-full p-10 animate-fadeIn text-left">
          <div className="glass-card p-10 text-center">
            <h1 className="executive-font text-3xl font-bold text-white mb-4">Loading...</h1>
            <GlobalNavFooter />
          </div>
        </div>
      );
    }
    // Handle different data structures: array directly OR object with cases array
    let documentDetectiveCases = currentTask.practice?.document_detective;
    
    // If it's an object with a cases array (Lead a Team format), extract the cases
    if (documentDetectiveCases && documentDetectiveCases.cases && Array.isArray(documentDetectiveCases.cases)) {
      documentDetectiveCases = documentDetectiveCases.cases;
    }
    
    // If still not an array or empty, use sample data
    if (!Array.isArray(documentDetectiveCases) || documentDetectiveCases.length === 0) {
      documentDetectiveCases = [
      {
        title: "The Resource Conflict",
        scenario: "Two departments are requesting the same senior developer for overlapping project timelines. Marketing needs the developer for a critical customer-facing feature launch in 3 weeks. Engineering needs them for a technical debt refactoring that's blocking 5 other features. Both projects are high priority. Team meetings have become tense, with each department presenting their case more aggressively. You need to resolve this conflict and ensure both projects can proceed.",
        correctDocs: ["Resource Management Plan", "Stakeholder Engagement Plan", "Communication Plan"],
        allDocs: [
          "Team Charter",
          "Stakeholder Engagement Plan",
          "Resource Management Plan",
          "Risk Register",
          "Communication Plan",
          "Budget Report",
          "Project Schedule",
          "Issue Log",
          "Scope Statement",
          "RACI Matrix"
        ],
        explanations: {
          "Resource Management Plan": {
            howToUse: "Check the resource allocation matrix and availability windows. Look for alternative resources or capacity adjustments.",
            purpose: "Determine actual resource availability and identify if the conflict can be resolved through scheduling or alternative assignments.",
            example: "Review the Resource Management Plan to see if another developer has similar skills, or if the timelines can be adjusted by a few days to allow sequential allocation."
          },
          "Stakeholder Engagement Plan": {
            howToUse: "Identify the key stakeholders from each department. Understand their influence, interest, and communication preferences.",
            purpose: "Plan how to engage both departments in a collaborative discussion, ensuring their concerns are heard and addressed.",
            example: "Use the Stakeholder Engagement Plan to schedule a joint meeting with both department heads, using their preferred communication channels and presenting the situation in terms that matter to each group."
          },
          "Communication Plan": {
            howToUse: "Follow the established escalation path and communication protocols. Ensure transparent communication with both parties.",
            purpose: "Maintain open dialogue, prevent information asymmetry, and ensure both departments understand the full context and constraints.",
            example: "Follow the Communication Plan to send a structured update to both departments, schedule a facilitated discussion, and document the resolution process."
          }
        },
        missedDocs: {
          "Issue Log": {
            why: "This resource conflict should be documented in the Issue Log to track it as an active impediment and ensure it's addressed systematically."
          }
        }
      }
    ];
    }

    const currentCaseData = documentDetectiveCases[documentDetectiveState.currentCase];

    const toggleDocument = (docName) => {
      setDocumentDetectiveState(prev => {
        if (prev.selectedDocs.includes(docName)) {
          // Deselect
          return { ...prev, selectedDocs: prev.selectedDocs.filter(d => d !== docName) };
        } else if (prev.selectedDocs.length < 3) {
          // Select (if less than 3)
          return { ...prev, selectedDocs: [...prev.selectedDocs, docName] };
        }
        return prev; // Can't select more than 3
      });
    };

    const submitSelections = () => {
      if (documentDetectiveState.selectedDocs.length !== 3) return;
      
      const correctCount = documentDetectiveState.selectedDocs.filter(doc => 
        currentCaseData.correctDocs.includes(doc)
      ).length;
      const completionRate = Math.round((correctCount / 3) * 100);
      
      // Record comprehensive score
      recordComprehensiveScore(selectedTask, 'document-detective', {
        score: correctCount,
        completionRate,
        caseTitle: currentCaseData.title,
        selectedDocs: documentDetectiveState.selectedDocs,
        correctDocs: currentCaseData.correctDocs
      });
      
      setDocumentDetectiveState(prev => ({
        ...prev,
        showingFeedback: true,
        score: correctCount
      }));
    };

    const resetCase = () => {
      setDocumentDetectiveState(prev => ({
        ...prev,
        selectedDocs: [],
        showingFeedback: false,
        score: 0,
        currentQuestion: 0,
        showingAnswer: false,
        userAnswers: {}
      }));
    };

    const nextCase = () => {
      if (documentDetectiveState.currentCase < documentDetectiveCases.length - 1) {
        setDocumentDetectiveState({
          currentCase: documentDetectiveState.currentCase + 1,
          selectedDocs: [],
          showingFeedback: false,
          score: 0,
          currentQuestion: 0,
          showingAnswer: false,
          userAnswers: {}
        });
      } else {
        // All cases complete - loop back to first
        setDocumentDetectiveState({
          currentCase: 0,
          selectedDocs: [],
          showingFeedback: false,
          score: 0,
          currentQuestion: 0,
          showingAnswer: false,
          userAnswers: {}
        });
      }
    };

    const goToPracticeHub = () => {
      setDocumentDetectiveState({
        currentCase: 0,
        selectedDocs: [],
        showingFeedback: false,
        score: 0,
        currentQuestion: 0,
        showingAnswer: false,
        userAnswers: {}
      });
      setView('practice-hub');
    };

    if (!currentCaseData) {
      return (
        <div className="max-w-6xl w-full p-10 animate-fadeIn text-left">
          <div className="glass-card p-10 text-center">
            <h1 className="executive-font text-3xl font-bold text-white mb-4">🕵️ Document Detective</h1>
            <p className="text-slate-400">No cases available for this task.</p>
            <button 
              onClick={goToPracticeHub}
              className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors executive-font"
            >
              ← Back to Practice Hub
            </button>
            <GlobalNavFooter />
          </div>
        </div>
      );
    }

    // Feedback Screen
    if (documentDetectiveState.showingFeedback) {
      const selectedCorrect = documentDetectiveState.selectedDocs.filter(doc => 
        currentCaseData.correctDocs.includes(doc)
      );
      const selectedIncorrect = documentDetectiveState.selectedDocs.filter(doc => 
        !currentCaseData.correctDocs.includes(doc)
      );
      const missedImportant = currentCaseData.correctDocs.filter(doc => 
        !documentDetectiveState.selectedDocs.includes(doc)
      );

      return (
        <div className="max-w-6xl w-full p-10 animate-fadeIn text-left">
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <button 
                onClick={goToPracticeHub}
                className="px-4 py-2 executive-font text-xs text-slate-400 hover:text-white uppercase font-semibold transition-colors flex items-center gap-2"
              >
                ← Back
              </button>
            </div>
            <h1 className="executive-font text-5xl font-bold text-white tracking-tight">🕵️ Document Detective: {currentCaseData.title}</h1>
          </header>

          {/* Score Display */}
          <div className="glass-card p-6 mb-6 text-center">
            <h2 className="executive-font text-3xl font-bold text-white mb-2">
              Score: {documentDetectiveState.score}/3
            </h2>
            <p className="text-slate-400 mb-2">You selected {documentDetectiveState.score} out of 3 correct documents</p>
            {(() => {
              const stats = getActivityStats(selectedTask, 'document-detective');
              const bestCompletion = stats?.bestCompletion || 0;
              const currentCompletion = Math.round((documentDetectiveState.score / 3) * 100);
              const isNewBest = currentCompletion > bestCompletion;
              return (
                <div className="flex justify-center items-center gap-4 mt-3 text-sm">
                  <span className="text-slate-400">Previous best: <span className="text-white font-semibold">{bestCompletion}%</span></span>
                  <span className="text-slate-500">|</span>
                  <span className="text-emerald-400 font-semibold">Today: {currentCompletion}%</span>
                  {isNewBest && <span className="text-emerald-400">🎉 NEW HIGH SCORE!</span>}
                </div>
              );
            })()}
          </div>

          {/* Correct Selections */}
          {selectedCorrect.length > 0 && (
            <div className="mb-6">
              <h3 className="executive-font text-xl font-semibold text-white mb-4">✅ Correct Selections</h3>
              <div className="space-y-4">
                {selectedCorrect.map((doc, idx) => {
                  const explanation = currentCaseData.explanations[doc];
                  return (
                    <div key={idx} className="glass-card p-6 border-l-4 border-emerald-500">
                      <h4 className="executive-font text-lg font-semibold text-white mb-3">{doc}</h4>
                      {explanation && (
                        <>
                          <div className="mb-3">
                            <span className="text-sm font-semibold text-emerald-400">Look for: </span>
                            <span className="text-slate-300">{explanation.howToUse}</span>
                          </div>
                          <div className="mb-3">
                            <span className="text-sm font-semibold text-emerald-400">Use it to: </span>
                            <span className="text-slate-300">{explanation.purpose}</span>
                          </div>
                          {explanation.example && (
                            <div className="bg-slate-800/50 p-3 rounded border-l-2 border-emerald-400/50">
                              <p className="text-sm text-slate-300 italic">{explanation.example}</p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Missed Important Documents */}
          {missedImportant.length > 0 && (
            <div className="mb-6">
              <h3 className="executive-font text-xl font-semibold text-white mb-4">❌ Important Documents You Missed</h3>
              <div className="space-y-4">
                {missedImportant.map((doc, idx) => {
                  const explanation = currentCaseData.explanations[doc];
                  return (
                    <div key={idx} className="glass-card p-6 border-l-4 border-orange-500 explanation-card" style={{ animationDelay: `${(selectedCorrect.length + idx) * 100}ms` }}>
                      <h4 className="executive-font text-lg font-semibold text-white mb-3">You didn't pick {doc}</h4>
                      {explanation && (
                        <>
                          <div className="mb-3">
                            <span className="text-sm font-semibold text-orange-400">Why it matters: </span>
                            <span className="text-slate-300">{explanation.purpose}</span>
                          </div>
                          <div className="mb-3">
                            <span className="text-sm font-semibold text-orange-400">How to use it: </span>
                            <span className="text-slate-300">{explanation.howToUse}</span>
                          </div>
                          {explanation.example && (
                            <div className="bg-slate-800/50 p-3 rounded border-l-2 border-orange-400/50">
                              <p className="text-sm text-slate-300 italic">{explanation.example}</p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Incorrect Selections (if any) */}
          {selectedIncorrect.length > 0 && (
            <div className="mb-6">
              <h3 className="executive-font text-xl font-semibold text-white mb-4">Incorrect Selections</h3>
              <div className="space-y-2">
                {selectedIncorrect.map((doc, idx) => (
                  <div key={idx} className="glass-card p-4 border-l-4 border-slate-600">
                    <p className="text-slate-400">{doc} - Not the most relevant for this scenario</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button 
              onClick={resetCase}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors executive-font"
            >
              Try Again
            </button>
            {documentDetectiveCases.length > 1 && (
              <button 
                onClick={nextCase}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors executive-font"
              >
                Next Case →
              </button>
            )}
            <button 
              onClick={goToPracticeHub}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors executive-font"
            >
              Back to Practice Hub
            </button>
          </div>
          <GlobalNavFooter />
        </div>
      );
    }

    // Case Display - Check format type
    const isQAFormat = currentCaseData && (currentCaseData.questions || currentCaseData.document);
    
    // Q&A Format (Lead a Team)
    if (isQAFormat) {
      return (
        <div className="max-w-6xl w-full p-10 animate-fadeIn text-left">
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <button 
                onClick={goToPracticeHub}
                className="px-4 py-2 executive-font text-xs text-slate-400 hover:text-white uppercase font-semibold transition-colors flex items-center gap-2"
              >
                ← Back
              </button>
            </div>
            <h1 className="executive-font text-5xl font-bold text-white tracking-tight">🕵️ Document Detective</h1>
            <p className="text-slate-400 mt-2">Case {documentDetectiveState.currentCase + 1} of {documentDetectiveCases.length}: {currentCaseData.title}</p>
          </header>

          {/* Document Display */}
          {currentCaseData.document && (
            <div className="glass-card p-8 mb-6 border-l-4 border-purple-500">
              <h2 className="executive-font text-2xl font-bold text-white mb-4">{currentCaseData.title}</h2>
              <div className="bg-slate-900/50 p-6 rounded border border-slate-700">
                <pre className="text-slate-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">{currentCaseData.document}</pre>
              </div>
            </div>
          )}

          {/* Questions */}
          {currentCaseData.questions && (
            <div className="space-y-6">
              {currentCaseData.questions.map((q, qIdx) => {
                const isShowingAnswer = documentDetectiveState.showingAnswer === qIdx;
                return (
                  <div key={qIdx} className="glass-card p-6 border-l-4 border-cyan-500">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="executive-font text-xl font-semibold text-white">
                        Question {qIdx + 1} of {currentCaseData.questions.length}
                      </h3>
                      <button
                        onClick={() => setDocumentDetectiveState(prev => ({
                          ...prev,
                          showingAnswer: isShowingAnswer ? false : qIdx
                        }))}
                        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold rounded transition-colors"
                      >
                        {isShowingAnswer ? 'Hide Answer' : 'Show Answer'}
                      </button>
                    </div>
                    
                    <p className="text-white text-lg mb-4">{q.question}</p>
                    
                    {isShowingAnswer && (
                      <div className="mt-4 p-4 bg-emerald-900/30 border-l-4 border-emerald-500 rounded">
                        <div className="mb-3">
                          <span className="text-emerald-400 font-semibold">Correct Answer: </span>
                          <span className="text-white">{q.correct}</span>
                        </div>
                        <div className="mt-3">
                          <span className="text-cyan-400 font-semibold">Explanation: </span>
                          <p className="text-slate-300 mt-2">{q.explanation}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Key Insights */}
          {currentCaseData.key_insights && (
            <div className="glass-card p-6 mt-6 border-l-4 border-yellow-500">
              <h3 className="executive-font text-xl font-semibold text-white mb-4">💡 Key Insights</h3>
              <ul className="list-disc list-inside text-slate-300 space-y-2">
                {currentCaseData.key_insights.map((insight, idx) => (
                  <li key={idx}>{insight}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-4 mt-8">
            {documentDetectiveCases.length > 1 && (
              <>
                <button 
                  onClick={() => {
                    if (documentDetectiveState.currentCase > 0) {
                      setDocumentDetectiveState(prev => ({
                        ...prev,
                        currentCase: prev.currentCase - 1,
                        showingAnswer: false,
                        currentQuestion: 0
                      }));
                    }
                  }}
                  disabled={documentDetectiveState.currentCase === 0}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors executive-font"
                >
                  ← Previous Case
                </button>
                <button 
                  onClick={() => {
                    if (documentDetectiveState.currentCase < documentDetectiveCases.length - 1) {
                      setDocumentDetectiveState(prev => ({
                        ...prev,
                        currentCase: prev.currentCase + 1,
                        showingAnswer: false,
                        currentQuestion: 0
                      }));
                    }
                  }}
                  disabled={documentDetectiveState.currentCase >= documentDetectiveCases.length - 1}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors executive-font"
                >
                  Next Case →
                </button>
              </>
            )}
            <button 
              onClick={goToPracticeHub}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors executive-font ml-auto"
            >
              Back to Practice Hub
            </button>
          </div>
          <GlobalNavFooter />
        </div>
      );
    }
    
    // Document Selection Format (Manage Conflict)
    return (
      <div className="max-w-6xl w-full p-10 animate-fadeIn text-left">
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={goToPracticeHub}
              className="px-4 py-2 executive-font text-xs text-slate-400 hover:text-white uppercase font-semibold transition-colors flex items-center gap-2"
            >
              ← Back
            </button>
          </div>
          <h1 className="executive-font text-5xl font-bold text-white tracking-tight">🕵️ Document Detective: {currentCaseData.title}</h1>
        </header>

        {/* Case Display */}
        <div className="glass-card p-8 mb-6">
          <h2 className="executive-font text-2xl font-bold text-white mb-4">{currentCaseData.title}</h2>
          <div className="text-slate-300 mb-6 whitespace-pre-line leading-relaxed">
            {currentCaseData.scenario}
          </div>
          <div className="glass-card p-4 bg-blue-500/10 border-l-4 border-blue-500">
            <p className="text-blue-400 font-semibold">📋 Your Mission: Select the 3 most relevant documents</p>
          </div>
        </div>

        {/* Document Selection */}
        {currentCaseData.allDocs && (
          <div className="glass-card p-6 mb-6">
            <h3 className="executive-font text-xl font-semibold text-white mb-4">
              Available Documents ({documentDetectiveState.selectedDocs.length}/3 selected)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentCaseData.allDocs.map((doc, idx) => {
                const isSelected = documentDetectiveState.selectedDocs.includes(doc);
                return (
                  <button
                    key={idx}
                    onClick={(e) => { createRipple(e); toggleDocument(doc); }}
                    disabled={!isSelected && documentDetectiveState.selectedDocs.length >= 3}
                    className={`glass-card p-4 text-left transition-all border-l-4 document-card btn-ripple ${
                      isSelected 
                        ? 'border-cyan-500 bg-cyan-500/10 flip' 
                        : documentDetectiveState.selectedDocs.length >= 3
                          ? 'border-slate-600 opacity-50 cursor-not-allowed'
                          : 'border-slate-600 hover:border-cyan-500/50 hover:bg-cyan-500/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        isSelected ? 'bg-cyan-500 border-cyan-500' : 'border-slate-400'
                      }`}>
                        {isSelected && <span className="text-white text-xs">✓</span>}
                      </div>
                      <span className={`font-semibold ${isSelected ? 'text-cyan-400' : 'text-white'}`}>{doc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            onClick={(e) => { if (currentCaseData.allDocs && documentDetectiveState.selectedDocs.length === 3) { createRipple(e); submitSelections(); } }}
            disabled={!currentCaseData.allDocs || documentDetectiveState.selectedDocs.length !== 3}
            className={`px-8 py-4 font-semibold rounded-lg transition-colors executive-font text-lg btn-ripple ${
              currentCaseData.allDocs && documentDetectiveState.selectedDocs.length === 3
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-slate-700 text-slate-400 cursor-not-allowed'
            }`}
          >
            Submit Selections
          </button>
        </div>
        <GlobalNavFooter />
      </div>
    );
  }

  // Conflict Mode Matcher / Leadership Style Matcher Activity View
  // Support both route names for Lead a Team
  if (view === 'conflict-matcher' || view === 'leadership-style-matcher') {
    // For Lead a Team, use leadership_style_matcher, otherwise conflict_matcher
    const dataKey = selectedTask === 'Lead a Team' ? 'leadership_style_matcher' : 'conflict_matcher';
    const activityTitle = selectedTask === 'Lead a Team' ? 'Leadership Style Matcher' : 'Conflict Mode Matcher';
    
    // Extract scenarios - handle both object with scenarios property and direct array
    const rawData = currentTask.practice?.[dataKey] || currentTask.practice?.conflict_matcher;
    const conflictMatcherScenarios = (rawData?.scenarios || (Array.isArray(rawData) ? rawData : null)) || [
      {
        id: 1,
        scenario: "Two developers disagree on API design during Sprint Planning. Both have valid technical arguments.",
        correctMode: "COLLABORATE",
        explanation: "Technical decisions benefit from collaborative discussion to find the best solution that leverages both perspectives.",
        examTip: "For technical disagreements between team members, collaboration is almost always the best answer."
      },
      {
        id: 2,
        scenario: "Team member consistently misses daily standup. When asked, they say it's not important.",
        correctMode: "CONFRONT",
        explanation: "Address issues directly with facts and empathy. This is a behavior that needs correction.",
        examTip: "When someone isn't following agreed processes, confront (direct but respectful) is the right first step."
      },
      {
        id: 3,
        scenario: "Emergency: Production system down. Two experts suggest different fixes. Decision needed NOW.",
        correctMode: "FORCE",
        explanation: "In emergency situations, use expertise and authority to make fast decision. Document rationale afterwards.",
        examTip: "Force mode is only correct for emergencies, safety issues, or legal/ethical violations."
      },
      {
        id: 4,
        scenario: "Designer prefers blue interface, you prefer green. Both work. Issue is minor.",
        correctMode: "ACCOMMODATE",
        explanation: "When the issue is minor and the other party is the expert (designer), accommodating preserves relationship and leverages their expertise.",
        examTip: "Accommodate when issue is minor and relationship/expertise matters more than the specific choice."
      },
      {
        id: 5,
        scenario: "Two departments want same resource for overlapping timeframes. Both projects critical. Budget is fixed.",
        correctMode: "COMPROMISE",
        explanation: "When both parties have equal legitimate needs and time/budget constraints prevent full satisfaction, compromise finds middle ground.",
        examTip: "Compromise is acceptable when time is limited and both parties can give ground."
      },
      {
        id: 6,
        scenario: "Two team members have minor disagreement about meeting time. One prefers morning, one prefers afternoon.",
        correctMode: "COLLABORATE",
        explanation: "Even for minor issues, collaboration builds team ownership and may reveal creative solutions (e.g., alternating times).",
        examTip: "PMI prefers collaboration whenever possible, even for minor issues."
      }
    ];

    // Define modes/styles based on task
    const conflictModes = selectedTask === 'Lead a Team' ? [
      { name: "Commanding", emoji: "⚡", color: "red" },
      { name: "Authoritative", emoji: "🎯", color: "blue" },
      { name: "Affiliative", emoji: "🤝", color: "emerald" },
      { name: "Democratic", emoji: "🗳️", color: "yellow" },
      { name: "Pacesetting", emoji: "⚡", color: "orange" },
      { name: "Coaching", emoji: "📚", color: "purple" }
    ] : [
      { name: "COLLABORATE", emoji: "🤝", color: "emerald" },
      { name: "CONFRONT", emoji: "🎯", color: "blue" },
      { name: "COMPROMISE", emoji: "⚖️", color: "yellow" },
      { name: "ACCOMMODATE", emoji: "🤝", color: "orange" },
      { name: "FORCE", emoji: "⚠️", color: "red" },
      { name: "AVOID", emoji: "❌", color: "slate" }
    ];

    const handleDragStart = (scenarioId) => {
      setConflictMatcherState(prev => ({ ...prev, draggedScenario: scenarioId }));
    };

    const handleDragOver = (e) => {
      e.preventDefault();
      e.currentTarget.classList.add('drop-zone');
    };

    const handleDragLeave = (e) => {
      e.currentTarget.classList.remove('drop-zone');
    };

    const handleDrop = (modeName, e) => {
      if (e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drop-zone');
      }
      if (!conflictMatcherState.draggedScenario) return;
      
      const scenarioId = conflictMatcherState.draggedScenario;
      const correctAnswer = conflictMatcherScenarios.find(s => s.id === scenarioId)?.correctStyle || 
                            conflictMatcherScenarios.find(s => s.id === scenarioId)?.correctMode;
      const isCorrect = correctAnswer && (correctAnswer.includes('/') 
        ? correctAnswer.split('/').some(style => style.trim() === modeName)
        : modeName === correctAnswer);
      
      setConflictMatcherState(prev => ({
        ...prev,
        matches: { ...prev.matches, [scenarioId]: modeName },
        draggedScenario: null
      }));
      
      // Add animation class to the dropped card
      setTimeout(() => {
        const card = document.querySelector(`[data-scenario-id="${scenarioId}"]`);
        if (card) {
          card.classList.add(isCorrect ? 'correct-match' : 'incorrect-match');
          card.classList.add('drop-settle');
          setTimeout(() => {
            card.classList.remove('drop-settle');
          }, 400);
        }
      }, 0);
    };

    const handleClickSelect = (scenarioId, modeName) => {
      setConflictMatcherState(prev => ({
        ...prev,
        matches: { ...prev.matches, [scenarioId]: modeName },
        draggedScenario: null
      }));
    };

    const checkAnswers = () => {
      let correctCount = 0;
      const startTime = Date.now();
      conflictMatcherScenarios.forEach(scenario => {
        const correctAnswer = scenario.correctStyle || scenario.correctMode;
        const userAnswer = conflictMatcherState.matches[scenario.id];
        // Handle combined answers like "Authoritative/Commanding" - check if user answer is in the combined string
        const isCorrect = correctAnswer.includes('/') 
          ? correctAnswer.split('/').some(style => style.trim() === userAnswer)
          : userAnswer === correctAnswer;
        if (isCorrect) {
          correctCount++;
        }
      });

      const isPerfect = correctCount === conflictMatcherScenarios.length;
      
      // Trigger confetti on perfect score
      if (isPerfect) {
        setTimeout(() => triggerConfetti(), 300);
      }
      
      // Record comprehensive score
      let activityName;
      if (selectedTask === 'Lead a Team') {
        activityName = 'leadership-style-matcher';
      } else if (selectedTask === 'Support Performance') {
        activityName = 'feedback-type-matcher';
      } else {
        activityName = 'conflict-matcher';
      }
      recordComprehensiveScore(selectedTask, activityName, {
        score: correctCount,
        totalScenarios: conflictMatcherScenarios.length,
        isPerfect,
        matches: conflictMatcherState.matches
      });

      setConflictMatcherState(prev => ({
        ...prev,
        showingFeedback: true,
        score: correctCount
      }));
    };

    const resetGame = () => {
      setConflictMatcherState({
        matches: {},
        showingFeedback: false,
        score: 0,
        draggedScenario: null
      });
    };

    const goToPracticeHub = () => {
      resetGame();
      setView('practice-hub');
    };

    const allMatched = Object.keys(conflictMatcherState.matches).length === conflictMatcherScenarios.length;

    // Feedback Screen
    if (conflictMatcherState.showingFeedback) {
      return (
        <div className="max-w-7xl w-full p-10 animate-fadeIn text-left">
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <button 
                onClick={goToPracticeHub}
                className="px-4 py-2 executive-font text-xs text-slate-400 hover:text-white uppercase font-semibold transition-colors flex items-center gap-2"
              >
                ← Back
              </button>
            </div>
            <h1 className="executive-font text-5xl font-bold text-white tracking-tight">🧩 {activityTitle}</h1>
          </header>

          {/* Score Display */}
          <div className="glass-card p-6 mb-6 text-center">
            <h2 className="executive-font text-3xl font-bold text-white mb-2">
              Score: {conflictMatcherState.score}/{conflictMatcherScenarios.length}
            </h2>
            {conflictMatcherState.score === conflictMatcherScenarios.length && (
              <p className="text-emerald-400 text-xl font-bold animate-pulse">🎉 Perfect! All matches correct! 🎉</p>
            )}
            {(() => {
              const activityKey = selectedTask === 'Lead a Team' ? 'leadership-style-matcher' : 'conflict-matcher';
              const stats = getActivityStats(selectedTask, activityKey);
              const bestScore = stats?.bestScore || 0;
              const isNewBest = conflictMatcherState.score > bestScore;
              return (
                <div className="flex justify-center items-center gap-4 mt-3 text-sm">
                  <span className="text-slate-400">Previous best: <span className="text-white font-semibold">{bestScore}/{conflictMatcherScenarios.length}</span></span>
                  <span className="text-slate-500">|</span>
                  <span className="text-emerald-400 font-semibold">Today: {conflictMatcherState.score}/{conflictMatcherScenarios.length}</span>
                  {isNewBest && <span className="text-emerald-400">🎉 NEW HIGH SCORE!</span>}
                </div>
              );
            })()}
          </div>

          {/* Feedback for each scenario */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {conflictMatcherScenarios.map(scenario => {
              const userMatch = conflictMatcherState.matches[scenario.id];
              const correctAnswer = scenario.correctStyle || scenario.correctMode;
              // Handle combined answers like "Authoritative/Commanding" - check if user answer is in the combined string
              const isCorrect = correctAnswer.includes('/') 
                ? correctAnswer.split('/').some(style => style.trim() === userMatch)
                : userMatch === correctAnswer;

              return (
                <div 
                  key={scenario.id} 
                  className={`glass-card p-6 border-l-4 ${
                    isCorrect ? 'border-emerald-500 correct-match' : 'border-red-500 incorrect-match'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <span className="text-3xl">{isCorrect ? '✅' : '❌'}</span>
                    <div className="flex-1">
                      <p className="text-white mb-2">{scenario.scenario}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-slate-400">Your match:</span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {userMatch || 'No match'}
                        </span>
                      </div>
                      {!isCorrect && (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-slate-400">Correct:</span>
                          <span className="px-2 py-1 rounded text-xs font-semibold bg-emerald-500/20 text-emerald-400">
                            {scenario.correctStyle || scenario.correctMode}
                          </span>
                        </div>
                      )}
                      {isCorrect && (
                        <span className="text-emerald-400 font-bold text-sm">+100 points</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div>
                      <span className="text-sm font-semibold text-white">Why {scenario.correctStyle || scenario.correctMode}:</span>
                      <p className="text-sm text-slate-300 mt-1">{scenario.explanation}</p>
                    </div>
                    {scenario.examTip && (
                      <div className="bg-blue-500/10 p-3 rounded border-l-2 border-blue-500">
                        <p className="text-xs text-blue-400 italic">{scenario.examTip}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button 
              onClick={(e) => { createRipple(e); resetGame(); }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors executive-font btn-ripple"
            >
              Try Again
            </button>
            <button 
              onClick={(e) => { createRipple(e); goToPracticeHub(); }}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors executive-font btn-ripple"
            >
              Back to Practice Hub
            </button>
          </div>
          <GlobalNavFooter />
        </div>
      );
    }

    // Game Display
    return (
      <div className="max-w-7xl w-full p-10 animate-fadeIn text-left">
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={goToPracticeHub}
              className="px-4 py-2 executive-font text-xs text-slate-400 hover:text-white uppercase font-semibold transition-colors flex items-center gap-2"
            >
              ← Back
            </button>
          </div>
          <h1 className="executive-font text-5xl font-bold text-white tracking-tight">🧩 {activityTitle}</h1>
          <p className="text-slate-400 mt-2">
            {selectedTask === 'Lead a Team' 
              ? 'Drag each scenario to the correct leadership style, or click scenario then select style'
              : selectedTask === 'Support Performance'
              ? 'Drag each situation to the correct feedback type, or click situation then select type'
              : 'Drag each scenario to the correct conflict mode, or click scenario then select mode'}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
          {/* Left Column - Scenarios */}
          <div>
            <h2 className="executive-font text-2xl font-bold text-white mb-4">Scenarios</h2>
            <div className="space-y-4">
              {conflictMatcherScenarios.map(scenario => {
                const isMatched = conflictMatcherState.matches[scenario.id];
                const isDragging = conflictMatcherState.draggedScenario === scenario.id;

                if (isMatched) return null; // Don't show matched scenarios

                return (
                  <div
                    key={scenario.id}
                    data-scenario-id={scenario.id}
                    draggable
                    onDragStart={() => handleDragStart(scenario.id)}
                    onClick={() => setConflictMatcherState(prev => ({ ...prev, draggedScenario: scenario.id }))}
                    className={`glass-card p-4 cursor-move draggable-card ${
                      isDragging ? 'dragging' : ''
                    } ${!isMatched ? 'animate-pulse' : ''}`}
                  >
                    <p className="text-white text-sm">{scenario.scenario}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column - Conflict Modes / Leadership Styles */}
          <div>
            <h2 className="executive-font text-2xl font-bold text-white mb-4">{selectedTask === 'Lead a Team' ? 'Leadership Styles' : 'Conflict Modes'}</h2>
            <div className="space-y-4">
              {conflictModes.map(mode => {
                const matchedScenarioId = Object.keys(conflictMatcherState.matches).find(
                  id => conflictMatcherState.matches[id] === mode.name
                );
                const matchedScenario = matchedScenarioId ? 
                  conflictMatcherScenarios.find(s => s.id === parseInt(matchedScenarioId)) : null;
                const isEmpty = !matchedScenario;
                const borderColor = isEmpty ? 'border-slate-600' : mode.color === 'emerald' ? 'border-emerald-500' : mode.color === 'blue' ? 'border-blue-500' : mode.color === 'yellow' ? 'border-yellow-500' : mode.color === 'orange' ? 'border-orange-500' : mode.color === 'red' ? 'border-red-500' : 'border-slate-500';

                return (
                  <div
                    key={mode.name}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(mode.name)}
                    onClick={() => conflictMatcherState.draggedScenario && handleClickSelect(conflictMatcherState.draggedScenario, mode.name)}
                    className={`glass-card p-4 border-2 transition-all cursor-pointer ${
                      isEmpty 
                        ? 'border-dashed border-slate-600 hover:border-cyan-500' 
                        : `border-solid ${borderColor}`
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{mode.emoji}</span>
                      <span className="executive-font text-lg font-semibold text-white">{mode.name}</span>
                    </div>
                    {matchedScenario ? (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <p className="text-slate-300 text-sm">{matchedScenario.scenario}</p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setConflictMatcherState(prev => {
                              const newMatches = { ...prev.matches };
                              delete newMatches[matchedScenario.id];
                              return { ...prev, matches: newMatches };
                            });
                          }}
                          className="text-xs text-red-400 hover:text-red-300 mt-2"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <p className="text-slate-500 text-xs mt-2">Drop scenario here or click to select</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Click-to-Select Alternative (for accessibility) */}
        {conflictMatcherState.draggedScenario && (
          <div className="glass-card p-4 mb-6">
            <p className="text-slate-400 text-sm mb-3">Select conflict mode for this scenario:</p>
            <div className="flex flex-wrap gap-2">
              {conflictModes.map(mode => (
                <button
                  key={mode.name}
                  onClick={() => handleClickSelect(conflictMatcherState.draggedScenario, mode.name)}
                  className="px-4 py-2 glass-card hover:bg-blue-500/10 text-white text-sm transition-colors"
                >
                  {mode.emoji} {mode.name}
                </button>
              ))}
              <button
                onClick={() => setConflictMatcherState(prev => ({ ...prev, draggedScenario: null }))}
                className="px-4 py-2 glass-card hover:bg-red-500/10 text-red-400 text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Check Answers Button */}
        <div className="flex justify-center">
          <button
            onClick={checkAnswers}
            disabled={!allMatched}
            className={`px-8 py-4 font-semibold rounded-lg transition-colors executive-font text-lg ${
              allMatched
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-slate-700 text-slate-400 cursor-not-allowed'
            }`}
          >
            Check Answers ({Object.keys(conflictMatcherState.matches).length}/6)
          </button>
        </div>
        <GlobalNavFooter />
      </div>
    );
  }

  // Timeline Reconstructor Activity View
  // Content adapted for Lead a Team (uses comprehensive timeline_reconstructor data)
  if (view === 'timeline-reconstructor' || view === 'stage-detective') {
    if (!currentTask) {
      return (
        <div className="max-w-6xl w-full p-10 animate-fadeIn text-left">
          <div className="glass-card p-10 text-center">
            <h1 className="executive-font text-3xl font-bold text-white mb-4">Loading...</h1>
            <GlobalNavFooter />
          </div>
        </div>
      );
    }
    // Use timeline_reconstructor for all tasks (Lead a Team now uses comprehensive structure)
    const dataKey = 'timeline_reconstructor';
    const activityTitle = 'Timeline Reconstructor'; // Keep name consistent for all tasks
    const timelineData = currentTask.practice?.[dataKey];
    
    // Detect if this is the new comprehensive format (has events array) or old format (has steps)
    const isComprehensiveFormat = timelineData?.events && Array.isArray(timelineData.events);
    const isOldFormat = timelineData?.steps && Array.isArray(timelineData.steps);
    const isLegacyFormat = timelineData?.scenarios?.[0]?.events && Array.isArray(timelineData.scenarios[0].events);
    
    // Initialize steps in random order if not already initialized
    const initializeSteps = () => {
      let dataSource = null;
      if (isComprehensiveFormat) {
        dataSource = timelineData.events;
      } else if (isLegacyFormat) {
        dataSource = timelineData.scenarios[0].events;
      } else if (isOldFormat) {
        dataSource = timelineData.steps;
      }
      if (!dataSource) return [];
      const steps = [...dataSource];
      // Shuffle array using Fisher-Yates
      for (let i = steps.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [steps[i], steps[j]] = [steps[j], steps[i]];
      }
      return steps;
    };

    // Initialize steps on first render if needed
    let stepsData = null;
    if (isComprehensiveFormat) {
      stepsData = timelineData.events;
    } else if (isLegacyFormat) {
      stepsData = timelineData.scenarios[0].events;
    } else if (isOldFormat) {
      stepsData = timelineData.steps;
    }
    if (timelineReconstructorState.steps.length === 0 && stepsData && stepsData.length > 0) {
      // Initialize with shuffled steps - this will run on component mount
      const shuffledSteps = initializeSteps();
      if (shuffledSteps.length > 0) {
        // Use setTimeout to avoid state update during render
        setTimeout(() => {
          setTimelineReconstructorState(prev => ({ ...prev, steps: shuffledSteps }));
        }, 0);
      }
    }
    
    // Use the correct data structure for display
    const displaySteps = timelineReconstructorState.steps.length > 0 
      ? timelineReconstructorState.steps 
      : (stepsData || []);

    const handleDragStart = (stepId) => {
      setTimelineReconstructorState(prev => ({ ...prev, draggedStep: stepId }));
    };

    const handleDragOver = (e, index) => {
      e.preventDefault();
      setTimelineReconstructorState(prev => ({ ...prev, dragOverIndex: index }));
    };

    const handleDrop = (e, dropIndex) => {
      e.preventDefault();
      if (timelineReconstructorState.draggedStep === null) return;

      const draggedStepId = timelineReconstructorState.draggedStep;
      const steps = [...timelineReconstructorState.steps];
      const draggedIndex = steps.findIndex(s => s.id === draggedStepId);

      if (draggedIndex === -1 || draggedIndex === dropIndex) {
        setTimelineReconstructorState(prev => ({ ...prev, draggedStep: null, dragOverIndex: null }));
        return;
      }

      // Remove dragged step and insert at new position
      const [draggedStep] = steps.splice(draggedIndex, 1);
      steps.splice(dropIndex, 0, draggedStep);

      setTimelineReconstructorState(prev => ({
        ...prev,
        steps,
        draggedStep: null,
        dragOverIndex: null
      }));
    };

    const moveStep = (stepId, direction) => {
      const steps = [...timelineReconstructorState.steps];
      const index = steps.findIndex(s => s.id === stepId);
      if (index === -1) return;

      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= steps.length) return;

      [steps[index], steps[newIndex]] = [steps[newIndex], steps[index]];

      setTimelineReconstructorState(prev => ({ ...prev, steps }));
    };

    const checkOrder = () => {
      if (!stepsData) return;
      
      let correctCount = 0;
      timelineReconstructorState.steps.forEach((step, index) => {
        if (step.correctOrder === index + 1) {
          correctCount++;
        }
      });

      const isPerfect = correctCount === displaySteps.length;
      
      // Record comprehensive score
      recordComprehensiveScore(selectedTask, 'timeline-reconstructor', {
        score: correctCount,
        totalSteps: displaySteps.length,
        isPerfect,
        attemptsToPerfect: isPerfect ? 1 : 0 // Could track this better with state
      });

      setTimelineReconstructorState(prev => ({
        ...prev,
        showingFeedback: true,
        score: correctCount
      }));
    };

    const resetGame = () => {
      const newSteps = stepsData ? initializeSteps() : [];
      setTimelineReconstructorState({
        steps: newSteps,
        showingFeedback: false,
        score: 0,
        draggedStep: null,
        dragOverIndex: null
      });
    };

    const goToPracticeHub = () => {
      setTimelineReconstructorState({
        steps: [],
        showingFeedback: false,
        score: 0,
        draggedStep: null,
        dragOverIndex: null,
        expandedCards: {}
      });
      setView('practice-hub');
    };

    if (!timelineData || !stepsData || stepsData.length === 0) {
      return (
        <div className="max-w-6xl w-full p-10 animate-fadeIn text-left">
          <div className="glass-card p-10 text-center">
            <h1 className="executive-font text-3xl font-bold text-white mb-4">📋 {activityTitle}</h1>
            <p className="text-slate-400">No timeline data available for this task.</p>
            <button 
              onClick={goToPracticeHub}
              className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors executive-font"
            >
              ← Back to Practice Hub
            </button>
            <GlobalNavFooter />
          </div>
        </div>
      );
    }
    
    // For comprehensive format, we'll render differently - check if we should use new renderer
    const useComprehensiveRenderer = isComprehensiveFormat && selectedTask === 'Lead a Team';

    // Comprehensive Format Renderer (for Lead a Team with new structure)
    if (useComprehensiveRenderer && !timelineReconstructorState.showingFeedback) {
      // This is a very comprehensive format - we'll need to build this out completely
      // For now, let's handle the basic structure and note that full implementation is needed
      // The comprehensive format requires rendering all the sections from the instructions
    }
    
    // Feedback Screen
    if (timelineReconstructorState.showingFeedback) {
      const stepsForFeedback = displaySteps;
      
      return (
        <div className="max-w-6xl w-full p-10 animate-fadeIn text-left">
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <button 
                onClick={goToPracticeHub}
                className="px-4 py-2 executive-font text-xs text-slate-400 hover:text-white uppercase font-semibold transition-colors flex items-center gap-2"
              >
                ← Back
              </button>
            </div>
            <h1 className="executive-font text-5xl font-bold text-white tracking-tight">📋 {activityTitle}: {timelineData.title || timelineData.subtitle || 'Timeline Reconstructor'}</h1>
          </header>

          {/* Score Display */}
          <div className="glass-card p-6 mb-6 text-center">
            <h2 className="executive-font text-3xl font-bold text-white mb-2">
              Score: {timelineReconstructorState.score}/{displaySteps.length}
            </h2>
            <p className="text-slate-400 mb-2">You got {timelineReconstructorState.score} steps in the correct order</p>
            {(() => {
              const stats = getActivityStats(selectedTask, 'timeline-reconstructor');
              const bestScore = stats?.bestScore || 0;
              const isNewBest = timelineReconstructorState.score > bestScore;
              return (
                <div className="flex justify-center items-center gap-4 mt-3 text-sm">
                  <span className="text-slate-400">Previous best: <span className="text-white font-semibold">{bestScore}/{displaySteps.length}</span></span>
                  <span className="text-slate-500">|</span>
                  <span className="text-emerald-400 font-semibold">Today: {timelineReconstructorState.score}/{displaySteps.length}</span>
                  {isNewBest && <span className="text-emerald-400">🎉 NEW HIGH SCORE!</span>}
                </div>
              );
            })()}
          </div>

          {/* Feedback for each step */}
          <div className="space-y-4 mb-6">
            {stepsForFeedback.map((step, index) => {
              const isCorrect = step.correctOrder === index + 1;
              const correctStep = stepsData.find(s => s.correctOrder === index + 1);

              return (
                <div 
                  key={step.id} 
                  className={`glass-card p-6 border-l-4 ${
                    isCorrect ? 'border-emerald-500' : 'border-red-500'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-2xl`}>
                        {isCorrect ? '✅' : '❌'}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg font-bold text-white">Step {index + 1}:</span>
                        <span className="text-white font-semibold">{step.text || step.title || `Event ${step.id}`}</span>
                        {isCorrect && <span className="text-emerald-400 font-bold text-sm">+50 points</span>}
                      </div>
                      {!isCorrect && (
                        <div className="mb-3">
                          <span className="text-sm text-slate-400">Correct position: Step {step.correctOrder}</span>
                          {correctStep && (
                            <span className="text-sm text-emerald-400 ml-2">({correctStep.text || correctStep.title || `Event ${correctStep.id}`})</span>
                          )}
                        </div>
                      )}
                      {(step.whyThisOrder || step.indicators) && (
                        <div className="mt-3">
                          <span className="text-sm font-semibold text-white">Why this order:</span>
                          <p className="text-sm text-slate-300 mt-1">{step.whyThisOrder || step.indicators}</p>
                        </div>
                      )}
                      {step.commonMistake && (
                        <div className="mt-2 bg-slate-800/50 p-3 rounded border-l-2 border-orange-500/50">
                          <p className="text-xs text-orange-400 italic">Common mistake: {step.commonMistake}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Correct Sequence Display */}
          <div className="glass-card p-6 mb-6">
            <h3 className="executive-font text-xl font-semibold text-white mb-4">Correct Sequence</h3>
            <div className="space-y-3">
              {[...stepsData].sort((a, b) => a.correctOrder - b.correctOrder).map((step) => (
                <div key={step.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center flex-shrink-0">
                    {step.correctOrder}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold">{step.text || step.title || `Event ${step.id}`}</p>
                    {(step.details || step.content) && (
                      <p className="text-sm text-slate-400 mt-1">{step.details || step.content.substring(0, 100) + '...'}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button 
              onClick={(e) => { createRipple(e); resetGame(); }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors executive-font btn-ripple"
            >
              Try Again
            </button>
            <button 
              onClick={(e) => { createRipple(e); resetGame(); }}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors executive-font btn-ripple"
            >
              New Challenge
            </button>
            <button 
              onClick={(e) => { createRipple(e); goToPracticeHub(); }}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors executive-font btn-ripple"
            >
              Back to Practice Hub
            </button>
          </div>
          <GlobalNavFooter />
        </div>
      );
    }

    // Comprehensive Format Renderer (for Lead a Team with new structure)
    if (useComprehensiveRenderer) {
      return (
        <div className="max-w-6xl w-full p-10 animate-fadeIn text-left">
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <button 
                onClick={goToPracticeHub}
                className="px-4 py-2 executive-font text-xs text-slate-400 hover:text-white uppercase font-semibold transition-colors flex items-center gap-2"
              >
                ← Back
              </button>
            </div>
            <h1 className="executive-font text-5xl font-bold text-white tracking-tight mb-2">
              {activityTitle}
            </h1>
            {timelineData.subtitle && (
              <p className="text-xl text-slate-400">{timelineData.subtitle}</p>
            )}
          </header>

          {/* Introduction Section */}
          {timelineData.introduction && (
            <div className="glass-card p-6 mb-6">
              <div className="prose prose-invert max-w-none">
                <p className="text-white whitespace-pre-line mb-4">{timelineData.introduction.content}</p>
                {timelineData.introduction.timeEstimate && (
                  <p className="text-slate-400 text-sm mb-2">⏱️ <strong>Time Estimate:</strong> {timelineData.introduction.timeEstimate}</p>
                )}
                {timelineData.introduction.ecoAlignment && (
                  <p className="text-slate-400 text-sm">{timelineData.introduction.ecoAlignment}</p>
                )}
              </div>
            </div>
          )}

          {/* How to Use Section */}
          {timelineData.howToUse && Array.isArray(timelineData.howToUse) && (
            <div className="glass-card p-6 mb-6">
              <h2 className="executive-font text-2xl font-bold text-white mb-4">How to Use This Activity</h2>
              <ol className="list-decimal list-inside space-y-2 text-white">
                {timelineData.howToUse.map((item, idx) => (
                  <li key={idx} className="text-slate-300">{item}</li>
                ))}
              </ol>
            </div>
          )}

          {/* Scenario Section */}
          {timelineData.scenario && (
            <div className="glass-card p-6 mb-6 bg-blue-500/10 border-l-4 border-blue-500">
              <h2 className="executive-font text-2xl font-bold text-white mb-4">{timelineData.scenario.title}</h2>
              {timelineData.scenario.projectOverview && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Project Overview:</h3>
                  <ul className="list-disc list-inside space-y-1 text-slate-300 ml-4">
                    <li><strong>Project:</strong> {timelineData.scenario.projectOverview.project}</li>
                    <li><strong>Duration:</strong> {timelineData.scenario.projectOverview.duration}</li>
                    <li><strong>Team Size:</strong> {timelineData.scenario.projectOverview.teamSize}</li>
                    <li><strong>PM:</strong> {timelineData.scenario.projectOverview.pm}</li>
                  </ul>
                </div>
              )}
              {timelineData.scenario.teamMembers && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Team Members:</h3>
                  <ul className="list-disc list-inside space-y-1 text-slate-300 ml-4">
                    {timelineData.scenario.teamMembers.map((member, idx) => (
                      <li key={idx}>{member}</li>
                    ))}
                  </ul>
                </div>
              )}
              {timelineData.scenario.taskDescription && (
                <div className="mt-4 p-4 bg-slate-800/50 rounded">
                  <p className="text-white whitespace-pre-line">{timelineData.scenario.taskDescription}</p>
                </div>
              )}
            </div>
          )}

          {/* Tuckman's Model Reference Section */}
          <div className="glass-card p-6 mb-6 bg-purple-500/10 border-l-4 border-purple-500">
            <h2 className="executive-font text-2xl font-bold text-white mb-4">📚 Tuckman's Model Reference</h2>
            <p className="text-slate-300 mb-4">Use this quick reference to identify which Tuckman stage each event represents:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-slate-800/50 p-4 rounded border-l-2 border-green-500">
                <h3 className="text-green-400 font-bold text-lg mb-2">🌱 Forming</h3>
                <p className="text-slate-300 text-sm">New team, polite, uncertain, dependent on PM, many questions about roles/process</p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded border-l-2 border-red-500">
                <h3 className="text-red-400 font-bold text-lg mb-2">⚡ Storming</h3>
                <p className="text-slate-300 text-sm">Conflict, power struggles, challenging authority, competition, energy to disagreement</p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded border-l-2 border-blue-500">
                <h3 className="text-blue-400 font-bold text-lg mb-2">🤝 Norming</h3>
                <p className="text-slate-300 text-sm">Cooperation, "we" language, processes working, team identity forming, mutual support</p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded border-l-2 border-cyan-500">
                <h3 className="text-cyan-400 font-bold text-lg mb-2">🚀 Performing</h3>
                <p className="text-slate-300 text-sm">High autonomy, self-organizing, consistent excellence, minimal PM intervention</p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded border-l-2 border-yellow-500">
                <h3 className="text-yellow-400 font-bold text-lg mb-2">👋 Adjourning</h3>
                <p className="text-slate-300 text-sm">Project ending, reflective, emotional about closure, transition planning</p>
              </div>
            </div>
          </div>

          {/* Events Section */}
          <div className="glass-card p-6 mb-6">
            <h2 className="executive-font text-2xl font-bold text-white mb-4">The Scrambled Events</h2>
            <p className="text-slate-400 mb-4">Arrange these events in chronological order by dragging them. Click to expand/collapse each card:</p>
            
            <div className="space-y-2">
              {displaySteps.map((event, index) => {
                const isDragging = timelineReconstructorState.draggedStep === event.id;
                const isDragOver = timelineReconstructorState.dragOverIndex === index;
                const isExpanded = timelineReconstructorState.expandedCards[event.id] || false;

                const toggleCard = (e) => {
                  e.stopPropagation();
                  setTimelineReconstructorState(prev => ({
                    ...prev,
                    expandedCards: {
                      ...prev.expandedCards,
                      [event.id]: !prev.expandedCards[event.id]
                    }
                  }));
                };

                return (
                  <div
                    key={event.id}
                    draggable
                    onDragStart={() => handleDragStart(event.id)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    className={`glass-card border-l-4 border-cyan-500 cursor-move transition-all ${
                      isDragging ? 'opacity-50 scale-95 shadow-lg' : 'hover:border-cyan-400 hover:shadow-md'
                    } ${isDragOver ? 'border-l-8 border-emerald-500 bg-emerald-500/10' : ''}`}
                  >
                    {/* Card Header - Always Visible */}
                    <div className="p-2.5 flex items-center gap-3">
                      {/* Drag Handle - More Prominent */}
                      <div 
                        className="flex items-center justify-center w-8 h-8 rounded bg-cyan-500/20 hover:bg-cyan-500/40 cursor-grab active:cursor-grabbing transition-colors flex-shrink-0"
                        title="Drag to reorder"
                      >
                        <div className="text-cyan-400 text-lg font-bold">☰</div>
                      </div>
                      
                      {/* Position Number - Smaller */}
                      <div className="w-7 h-7 rounded-full bg-cyan-500 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                        {index + 1}
                      </div>

                      {/* Event Header Content - Compact */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-semibold text-cyan-400">Event {event.id}</span>
                          {event.type && (
                            <span className="text-xs text-slate-400 bg-slate-700 px-1.5 py-0.5 rounded">{event.type}</span>
                          )}
                        </div>
                        {event.title && (
                          <h3 className="text-sm font-semibold text-white line-clamp-1">{event.title}</h3>
                        )}
                        {!isExpanded && event.content && (
                          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{event.content.substring(0, 80)}...</p>
                        )}
                      </div>

                      {/* Expand/Collapse Button - Smaller */}
                      <button
                        onClick={toggleCard}
                        className="flex-shrink-0 px-2 py-1 text-slate-400 hover:text-white transition-colors text-sm"
                        title={isExpanded ? "Collapse" : "Expand"}
                      >
                        {isExpanded ? '▼' : '▶'}
                      </button>
                    </div>

                    {/* Collapsible Content */}
                    {isExpanded && (
                      <div className="px-2.5 pb-2.5 border-t border-slate-700/50 pt-2.5">
                        {event.content && (
                          <div className="bg-slate-900/50 p-2.5 rounded border border-slate-700 mb-2">
                            <pre className="text-slate-300 whitespace-pre-wrap font-mono text-xs">{event.content}</pre>
                          </div>
                        )}
                        <div className="mt-2 flex gap-2 text-xs">
                          <div className="flex-1">
                            <label className="text-slate-400 block mb-0.5 text-xs">Sequence:</label>
                            <input type="number" className="w-full px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-xs" placeholder="___" disabled />
                          </div>
                          <div className="flex-1">
                            <label className="text-slate-400 block mb-0.5 text-xs">Stage:</label>
                            <input type="text" className="w-full px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-xs" placeholder="___" disabled />
                          </div>
                          <div className="flex-1">
                            <label className="text-slate-400 block mb-0.5 text-xs">Style:</label>
                            <input type="text" className="w-full px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-xs" placeholder="___" disabled />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Check Order Button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={(e) => { createRipple(e); checkOrder(); }}
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors executive-font text-lg btn-ripple"
            >
              Check Sequence
            </button>
          </div>

          {/* Reflection Questions Section */}
          {timelineData.reflectionQuestions && Array.isArray(timelineData.reflectionQuestions) && (
            <div className="glass-card p-6 mb-6">
              <h2 className="executive-font text-2xl font-bold text-white mb-4">Part 4: Reflection Questions</h2>
              <div className="space-y-6">
                {timelineData.reflectionQuestions.map((q, idx) => (
                  <div key={q.id || idx} className="bg-slate-800/50 p-4 rounded">
                    <h3 className="text-lg font-semibold text-white mb-2">{q.id || idx + 1}. {q.question}</h3>
                    {q.subQuestions && Array.isArray(q.subQuestions) && (
                      <ul className="list-disc list-inside ml-4 space-y-1 text-slate-300">
                        {q.subQuestions.map((subQ, subIdx) => (
                          <li key={subIdx}>{subQ}</li>
                        ))}
                      </ul>
                    )}
                    <textarea 
                      className="w-full mt-3 px-4 py-2 bg-slate-900 border border-slate-600 rounded text-white" 
                      rows="3" 
                      placeholder="Your answer..."
                      disabled
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Answers and Analysis Section (Collapsible) */}
          {timelineData.answers && (
            <details className="glass-card p-6 mb-6">
              <summary className="executive-font text-2xl font-bold text-white cursor-pointer hover:text-cyan-400 transition-colors">
                Answers and Analysis (Click to expand)
              </summary>
              
              <div className="mt-6 space-y-6">
                {/* Correct Sequence Table */}
                {timelineData.answers.correctSequence && (
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Correct Chronological Sequence</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-slate-800">
                            <th className="border border-slate-600 px-4 py-2 text-left text-white font-semibold">Position</th>
                            <th className="border border-slate-600 px-4 py-2 text-left text-white font-semibold">Event</th>
                            <th className="border border-slate-600 px-4 py-2 text-left text-white font-semibold">Description</th>
                            <th className="border border-slate-600 px-4 py-2 text-left text-white font-semibold">Month</th>
                            <th className="border border-slate-600 px-4 py-2 text-left text-white font-semibold">Stage</th>
                          </tr>
                        </thead>
                        <tbody>
                          {timelineData.answers.correctSequence.map((seq, idx) => (
                            <tr key={idx} className="hover:bg-slate-800/50">
                              <td className="border border-slate-600 px-4 py-2 text-white font-bold">{seq.position}</td>
                              <td className="border border-slate-600 px-4 py-2 text-cyan-400 font-semibold">{seq.event}</td>
                              <td className="border border-slate-600 px-4 py-2 text-slate-300">{seq.description}</td>
                              <td className="border border-slate-600 px-4 py-2 text-slate-400">{seq.month}</td>
                              <td className="border border-slate-600 px-4 py-2 text-slate-300">{seq.stage}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Stage Analysis */}
                {timelineData.answers.stageAnalysis && (
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Stage Analysis</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-slate-800">
                            <th className="border border-slate-600 px-4 py-2 text-left text-white font-semibold">Event</th>
                            <th className="border border-slate-600 px-4 py-2 text-left text-white font-semibold">Stage</th>
                            <th className="border border-slate-600 px-4 py-2 text-left text-white font-semibold">Key Indicators</th>
                          </tr>
                        </thead>
                        <tbody>
                          {timelineData.answers.stageAnalysis.map((analysis, idx) => (
                            <tr key={idx} className="hover:bg-slate-800/50">
                              <td className="border border-slate-600 px-4 py-2 text-cyan-400 font-semibold">{analysis.event}</td>
                              <td className="border border-slate-600 px-4 py-2 text-white">{analysis.stage}</td>
                              <td className="border border-slate-600 px-4 py-2 text-slate-300">{analysis.indicators}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Leadership Style Analysis */}
                {timelineData.answers.leadershipStyleAnalysis && (
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Leadership Style Analysis</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-slate-800">
                            <th className="border border-slate-600 px-4 py-2 text-left text-white font-semibold">Event</th>
                            <th className="border border-slate-600 px-4 py-2 text-left text-white font-semibold">Style</th>
                            <th className="border border-slate-600 px-4 py-2 text-left text-white font-semibold">Rationale</th>
                          </tr>
                        </thead>
                        <tbody>
                          {timelineData.answers.leadershipStyleAnalysis.map((analysis, idx) => (
                            <tr key={idx} className="hover:bg-slate-800/50">
                              <td className="border border-slate-600 px-4 py-2 text-cyan-400 font-semibold">{analysis.event}</td>
                              <td className="border border-slate-600 px-4 py-2 text-white">{analysis.style}</td>
                              <td className="border border-slate-600 px-4 py-2 text-slate-300">{analysis.rationale}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Stage Transitions */}
                {timelineData.answers.stageTransitions && (
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Stage Transitions Analysis</h3>
                    <div className="space-y-4 text-slate-300">
                      {timelineData.answers.stageTransitions.formingToStorming && (
                        <div className="bg-slate-800/50 p-4 rounded">
                          <h4 className="text-white font-semibold mb-2">Forming → Storming</h4>
                          <p><strong>Between:</strong> {timelineData.answers.stageTransitions.formingToStorming.betweenEvents}</p>
                          <p><strong>Trigger:</strong> {timelineData.answers.stageTransitions.formingToStorming.trigger}</p>
                          <p><strong>Evidence:</strong> {timelineData.answers.stageTransitions.formingToStorming.evidence}</p>
                          <p><strong>Timeline:</strong> {timelineData.answers.stageTransitions.formingToStorming.timeline}</p>
                        </div>
                      )}
                      {timelineData.answers.stageTransitions.stormingToNorming && (
                        <div className="bg-slate-800/50 p-4 rounded">
                          <h4 className="text-white font-semibold mb-2">Storming → Norming</h4>
                          <p><strong>Between:</strong> {timelineData.answers.stageTransitions.stormingToNorming.betweenEvents}</p>
                          <p><strong>Trigger:</strong> {timelineData.answers.stageTransitions.stormingToNorming.trigger}</p>
                          <p><strong>Evidence:</strong> {timelineData.answers.stageTransitions.stormingToNorming.evidence}</p>
                          <p><strong>Timeline:</strong> {timelineData.answers.stageTransitions.stormingToNorming.timeline}</p>
                        </div>
                      )}
                      {timelineData.answers.stageTransitions.normingToPerforming && (
                        <div className="bg-slate-800/50 p-4 rounded">
                          <h4 className="text-white font-semibold mb-2">Norming → Performing</h4>
                          <p><strong>Between:</strong> {timelineData.answers.stageTransitions.normingToPerforming.betweenEvents}</p>
                          <p><strong>Trigger:</strong> {timelineData.answers.stageTransitions.normingToPerforming.trigger}</p>
                          <p><strong>Evidence:</strong> {timelineData.answers.stageTransitions.normingToPerforming.evidence}</p>
                          <p><strong>Timeline:</strong> {timelineData.answers.stageTransitions.normingToPerforming.timeline}</p>
                        </div>
                      )}
                      {timelineData.answers.stageTransitions.regression && (
                        <div className="bg-slate-800/50 p-4 rounded border-l-4 border-orange-500">
                          <h4 className="text-white font-semibold mb-2">Regression Analysis</h4>
                          <p><strong>Event:</strong> {timelineData.answers.stageTransitions.regression.event}</p>
                          <p><strong>Trigger:</strong> {timelineData.answers.stageTransitions.regression.trigger}</p>
                          <p><strong>Severity:</strong> {timelineData.answers.stageTransitions.regression.severity}</p>
                          <p><strong>Duration:</strong> {timelineData.answers.stageTransitions.regression.duration}</p>
                          <p><strong>Resolution:</strong> {timelineData.answers.stageTransitions.regression.resolution}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ECO Enabler Coverage */}
                {timelineData.answers.ecoEnablerCoverage && (
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">ECO Enabler Coverage</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-slate-800">
                            <th className="border border-slate-600 px-4 py-2 text-left text-white font-semibold">ECO Enabler</th>
                            <th className="border border-slate-600 px-4 py-2 text-left text-white font-semibold">Evidence</th>
                          </tr>
                        </thead>
                        <tbody>
                          {timelineData.answers.ecoEnablerCoverage.map((eco, idx) => (
                            <tr key={idx} className="hover:bg-slate-800/50">
                              <td className="border border-slate-600 px-4 py-2 text-white font-semibold">{eco.enabler}</td>
                              <td className="border border-slate-600 px-4 py-2 text-slate-300">{eco.evidence}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* What If Analysis */}
                {timelineData.answers.whatIfAnalysis && (
                  <div className="bg-slate-800/50 p-4 rounded border-l-4 border-yellow-500">
                    <h3 className="text-xl font-semibold text-white mb-4">What If Analysis</h3>
                    <p className="text-white font-semibold mb-2">{timelineData.answers.whatIfAnalysis.question}</p>
                    <ul className="list-disc list-inside space-y-1 text-slate-300 ml-4">
                      {timelineData.answers.whatIfAnalysis.impact.map((impact, idx) => (
                        <li key={idx}>{impact}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </details>
          )}

          {/* Scoring Guide */}
          {timelineData.scoringGuide && (
            <div className="glass-card p-6 mb-6">
              <h2 className="executive-font text-2xl font-bold text-white mb-4">Scoring Guide</h2>
              <div className="space-y-4">
                {timelineData.scoringGuide.part1 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{timelineData.scoringGuide.part1.title}</h3>
                    <ul className="list-disc list-inside space-y-1 text-slate-300 ml-4">
                      {timelineData.scoringGuide.part1.scoring.map((item, idx) => (
                        <li key={idx}>{item.condition}: {item.points} points</li>
                      ))}
                    </ul>
                  </div>
                )}
                {timelineData.scoringGuide.part2 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{timelineData.scoringGuide.part2.title}</h3>
                    <p className="text-slate-300 whitespace-pre-line">{timelineData.scoringGuide.part2.scoring}</p>
                  </div>
                )}
                {timelineData.scoringGuide.part3 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{timelineData.scoringGuide.part3.title}</h3>
                    <p className="text-slate-300 whitespace-pre-line">{timelineData.scoringGuide.part3.scoring}</p>
                  </div>
                )}
                {timelineData.scoringGuide.part4 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{timelineData.scoringGuide.part4.title}</h3>
                    <ul className="list-disc list-inside space-y-1 text-slate-300 ml-4">
                      {Array.isArray(timelineData.scoringGuide.part4.scoring) ? (
                        timelineData.scoringGuide.part4.scoring.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))
                      ) : (
                        <li>{timelineData.scoringGuide.part4.scoring}</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Performance Levels */}
          {timelineData.performanceLevels && (
            <div className="glass-card p-6 mb-6">
              <h2 className="executive-font text-2xl font-bold text-white mb-4">Performance Levels</h2>
              <div className="space-y-3">
                {timelineData.performanceLevels.map((level, idx) => (
                  <div key={idx} className="bg-slate-800/50 p-4 rounded border-l-4 border-cyan-500">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-white font-bold text-lg">{level.range}</span>
                      <span className="text-cyan-400 font-semibold">{level.level}</span>
                    </div>
                    <p className="text-slate-300">{level.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Takeaways */}
          {timelineData.keyTakeaways && (
            <div className="glass-card p-6 mb-6">
              <h2 className="executive-font text-2xl font-bold text-white mb-4">Key Takeaways</h2>
              
              {timelineData.keyTakeaways.timelinePatterns && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Timeline Patterns to Remember</h3>
                  <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
                    {timelineData.keyTakeaways.timelinePatterns.map((pattern, idx) => (
                      <li key={idx}>
                        <strong>{pattern.stage}:</strong> {pattern.detail}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {timelineData.keyTakeaways.leadershipEvolution && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Leadership Evolution Pattern</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-slate-800">
                          <th className="border border-slate-600 px-4 py-2 text-left text-white font-semibold">Project Phase</th>
                          <th className="border border-slate-600 px-4 py-2 text-left text-white font-semibold">Primary Style</th>
                          <th className="border border-slate-600 px-4 py-2 text-left text-white font-semibold">PM Focus</th>
                        </tr>
                      </thead>
                      <tbody>
                        {timelineData.keyTakeaways.leadershipEvolution.map((phase, idx) => (
                          <tr key={idx} className="hover:bg-slate-800/50">
                            <td className="border border-slate-600 px-4 py-2 text-white">{phase.phase}</td>
                            <td className="border border-slate-600 px-4 py-2 text-cyan-400">{phase.style}</td>
                            <td className="border border-slate-600 px-4 py-2 text-slate-300">{phase.pmFocus}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {timelineData.keyTakeaways.closingStatement && (
                <div className="bg-blue-500/10 p-4 rounded border-l-4 border-blue-500">
                  <p className="text-white italic">{timelineData.keyTakeaways.closingStatement}</p>
                </div>
              )}
            </div>
          )}

          <GlobalNavFooter />
        </div>
      );
    }

    // Game Display - displaySteps already defined above (for old format)
    
    return (
      <div className="max-w-6xl w-full p-10 animate-fadeIn text-left">
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={goToPracticeHub}
              className="px-4 py-2 executive-font text-xs text-slate-400 hover:text-white uppercase font-semibold transition-colors flex items-center gap-2"
            >
              ← Back
            </button>
          </div>
            <h1 className="executive-font text-5xl font-bold text-white tracking-tight">📋 {activityTitle}: {timelineData.title || timelineData.subtitle || 'Timeline Reconstructor'}</h1>
        </header>

        {/* Instructions Card */}
        <div className="glass-card p-6 mb-6 bg-blue-500/10 border-l-4 border-blue-500">
          <p className="text-blue-400 font-semibold text-lg">{timelineData.description || "A conflict just occurred. Arrange these conflict resolution steps in the CORRECT order (drag to reorder)."}</p>
        </div>

        {/* Tuckman's Model Reference Section */}
        <div className="glass-card p-6 mb-6 bg-purple-500/10 border-l-4 border-purple-500">
          <h2 className="executive-font text-2xl font-bold text-white mb-4">📚 Tuckman's Model Reference</h2>
          <p className="text-slate-300 mb-4">Use this quick reference to identify which Tuckman stage each event represents:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-slate-800/50 p-4 rounded border-l-2 border-green-500">
              <h3 className="text-green-400 font-bold text-lg mb-2">🌱 Forming</h3>
              <p className="text-slate-300 text-sm">New team, polite, uncertain, dependent on PM, many questions about roles/process</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded border-l-2 border-red-500">
              <h3 className="text-red-400 font-bold text-lg mb-2">⚡ Storming</h3>
              <p className="text-slate-300 text-sm">Conflict, power struggles, challenging authority, competition, energy to disagreement</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded border-l-2 border-blue-500">
              <h3 className="text-blue-400 font-bold text-lg mb-2">🤝 Norming</h3>
              <p className="text-slate-300 text-sm">Cooperation, "we" language, processes working, team identity forming, mutual support</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded border-l-2 border-cyan-500">
              <h3 className="text-cyan-400 font-bold text-lg mb-2">🚀 Performing</h3>
              <p className="text-slate-300 text-sm">High autonomy, self-organizing, consistent excellence, minimal PM intervention</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded border-l-2 border-yellow-500">
              <h3 className="text-yellow-400 font-bold text-lg mb-2">👋 Adjourning</h3>
              <p className="text-slate-300 text-sm">Project ending, reflective, emotional about closure, transition planning</p>
            </div>
          </div>
        </div>

        {/* Steps Display */}
        <div className="glass-card p-6 mb-6">
          <h2 className="executive-font text-xl font-bold text-white mb-4">Arrange Steps in Order</h2>
          <p className="text-slate-400 mb-4 text-sm">Click to expand/collapse each card for details:</p>
          <div className="space-y-2">
            {displaySteps.map((step, index) => {
              const isDragging = timelineReconstructorState.draggedStep === step.id;
              const isDragOver = timelineReconstructorState.dragOverIndex === index;
              const isExpanded = timelineReconstructorState.expandedCards[step.id] || false;

              const toggleCard = (e) => {
                e.stopPropagation();
                setTimelineReconstructorState(prev => ({
                  ...prev,
                  expandedCards: {
                    ...prev.expandedCards,
                    [step.id]: !prev.expandedCards[step.id]
                  }
                }));
              };

              return (
                <div
                  key={step.id}
                  draggable
                  onDragStart={() => handleDragStart(step.id)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`glass-card cursor-move timeline-card border-l-4 border-cyan-500 ${
                    isDragging ? 'opacity-50 scale-95 shadow-lg' : 'hover:border-cyan-400 hover:shadow-md'
                  } ${isDragOver ? 'drag-over' : ''}`}
                >
                  {/* Card Header - Always Visible */}
                  <div className="p-2.5 flex items-center gap-3">
                    {/* Drag Handle - More Prominent */}
                    <div 
                      className="flex items-center justify-center w-8 h-8 rounded bg-cyan-500/20 hover:bg-cyan-500/40 cursor-grab active:cursor-grabbing transition-colors flex-shrink-0"
                      title="Drag to reorder"
                    >
                      <div className="text-cyan-400 text-lg font-bold">☰</div>
                    </div>
                    
                    {/* Step Number - Smaller */}
                    <div className="w-7 h-7 rounded-full bg-slate-700 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </div>

                    {/* Step Text - Compact */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white line-clamp-1">{step.text || step.title || `Event ${step.id}`}</p>
                      {step.type && (
                        <p className="text-xs text-slate-400 mt-0.5">{step.type}</p>
                      )}
                      {!isExpanded && (step.details || step.content) && (
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                          {(step.details || step.content || '').substring(0, 80)}...
                        </p>
                      )}
                    </div>

                    {/* Expand/Collapse Button - Smaller */}
                    <button
                      onClick={toggleCard}
                      className="flex-shrink-0 px-2 py-1 text-slate-400 hover:text-white transition-colors text-sm"
                      title={isExpanded ? "Collapse" : "Expand"}
                    >
                      {isExpanded ? '▼' : '▶'}
                    </button>

                    {/* Up/Down Arrow Buttons (Accessibility) - Smaller */}
                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveStep(step.id, 'up');
                        }}
                        disabled={index === 0}
                        className="px-1.5 py-0.5 text-xs glass-card hover:bg-blue-500/10 text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move up"
                      >
                        ↑
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveStep(step.id, 'down');
                        }}
                        disabled={index === displaySteps.length - 1}
                        className="px-1.5 py-0.5 text-xs glass-card hover:bg-blue-500/10 text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move down"
                      >
                        ↓
                      </button>
                    </div>
                  </div>

                  {/* Collapsible Content */}
                  {isExpanded && (step.details || step.content || step.whyThisOrder) && (
                    <div className="px-2.5 pb-2.5 border-t border-slate-700/50 pt-2.5">
                      {step.details && (
                        <p className="text-slate-300 text-xs mb-2">{step.details}</p>
                      )}
                      {step.content && (
                        <div className="bg-slate-900/50 p-2 rounded border border-slate-700 mb-2">
                          <pre className="text-slate-300 whitespace-pre-wrap text-xs">{step.content}</pre>
                        </div>
                      )}
                      {step.whyThisOrder && (
                        <div className="bg-blue-500/10 p-2 rounded border-l-2 border-blue-500">
                          <p className="text-blue-400 text-xs font-semibold mb-0.5">Why this order:</p>
                          <p className="text-slate-300 text-xs">{step.whyThisOrder}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Check Order Button */}
        <div className="flex justify-center">
          <button
            onClick={checkOrder}
            className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors executive-font text-lg"
          >
            Check Order
          </button>
        </div>
        <GlobalNavFooter />
      </div>
    );
  }

  // Empathy Exercise / Team Member Perspectives Activity View
  // Support both route names for Lead a Team and Support Performance
  // Team Member Perspectives - Special implementation for Lead a Team and Support Performance
  if (view === 'team-member-perspectives' && (selectedTask === 'Lead a Team' || selectedTask === 'Support Performance')) {
    return (
      <div className="max-w-6xl w-full p-10 animate-fadeIn text-left">
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => setView('practice-hub')}
              className="px-4 py-2 executive-font text-xs text-slate-400 hover:text-white uppercase font-semibold transition-colors flex items-center gap-2"
            >
              ← Back
            </button>
          </div>
          <h1 className="executive-font text-5xl font-bold text-white tracking-tight mb-2">Team Member Perspectives</h1>
          <p className="text-slate-400 text-xl">Experience Team Leadership from Your Team Members' Point of View</p>
        </header>

        {/* Introduction Section */}
        <div className="glass-card p-6 mb-6">
          <p className="text-white text-lg leading-relaxed mb-4">
            Step into the shoes of different team members and experience team development stages from their viewpoint. 
            Understand how leadership styles impact different people and build the empathy essential for servant leadership.
          </p>
          <div className="bg-blue-500/10 p-4 rounded border-l-4 border-blue-500">
            <p className="text-blue-400 text-sm">
              <strong>ECO Alignment:</strong> This activity directly supports these Lead a Team ECO enablers: 
              Value servant leadership, Inspire/motivate/influence team members, Analyze team members' influence, 
              Distinguish options to lead various team members.
            </p>
          </div>
        </div>

        {/* Why This Matters */}
        <div className="glass-card p-6 mb-6">
          <h2 className="executive-font text-2xl font-bold text-white mb-4">Why This Matters</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">The Leadership Challenge</h3>
              <p className="text-slate-300">
                Most PM training shows leadership from the PM's perspective, but effective leadership requires 
                understanding the <strong>IMPACT</strong> on team members.
              </p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded">
              <p className="text-white font-semibold mb-2">Great leaders ask:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-300 ml-4">
                <li>What does my team member experience when I lead this way?</li>
                <li>What do they need that they're not telling me?</li>
                <li>How does my leadership style affect different people differently?</li>
                <li>What would help them perform their best?</li>
              </ul>
            </div>
          </div>
        </div>

        {/* How to Use */}
        <div className="glass-card p-6 mb-6">
          <h2 className="executive-font text-2xl font-bold text-white mb-4">How to Use This Activity</h2>
          <ol className="list-decimal list-inside space-y-2 text-slate-300 ml-4">
            <li><strong>Read each scenario completely</strong> - Immerse yourself in the character</li>
            <li><strong>Experience their perspective</strong> - What would YOU feel in this situation?</li>
            <li><strong>Answer reflection questions</strong> - Think deeply about their needs</li>
            <li><strong>Review the analysis</strong> - Understand the leadership implications</li>
            <li><strong>Apply to your work</strong> - Remember these perspectives with your real teams</li>
          </ol>
          <p className="text-slate-400 mt-4">⏱️ <strong>Time Estimate:</strong> 45-60 minutes</p>
        </div>

        {/* Part Navigation */}
        <div className="glass-card p-6 mb-6">
          <h2 className="executive-font text-2xl font-bold text-white mb-4">Activity Parts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setTeamMemberPerspectivesState(prev => ({ ...prev, currentPart: 1, currentScenario: '1A' }))}
              className={`glass-card p-6 text-left transition-all border-l-4 ${
                teamMemberPerspectivesState.currentPart === 1 
                  ? 'border-cyan-500 bg-cyan-500/10' 
                  : 'border-slate-600 hover:border-cyan-500/50'
              }`}
            >
              <h3 className="text-xl font-bold text-white mb-2">Part 1: Journey Through Stages</h3>
              <p className="text-slate-400 text-sm">Follow Alex through all five Tuckman stages</p>
            </button>
            <button
              onClick={() => setTeamMemberPerspectivesState(prev => ({ ...prev, currentPart: 2, currentScenario: '2A' }))}
              className={`glass-card p-6 text-left transition-all border-l-4 ${
                teamMemberPerspectivesState.currentPart === 2 
                  ? 'border-purple-500 bg-purple-500/10' 
                  : 'border-slate-600 hover:border-purple-500/50'
              }`}
            >
              <h3 className="text-xl font-bold text-white mb-2">Part 2: Same Situation, Different People</h3>
              <p className="text-slate-400 text-sm">See how the same leadership affects four different people</p>
            </button>
            <button
              onClick={() => setTeamMemberPerspectivesState(prev => ({ ...prev, currentPart: 3, currentScenario: '3' }))}
              className={`glass-card p-6 text-left transition-all border-l-4 ${
                teamMemberPerspectivesState.currentPart === 3 
                  ? 'border-rose-500 bg-rose-500/10' 
                  : 'border-slate-600 hover:border-rose-500/50'
              }`}
            >
              <h3 className="text-xl font-bold text-white mb-2">Part 3: The Leader's Perspective</h3>
              <p className="text-slate-400 text-sm">Step into Sarah's shoes during conflict</p>
            </button>
          </div>
        </div>

        {/* Part 1: Alex's Journey Through Stages */}
        {teamMemberPerspectivesState.currentPart === 1 && (
          <div className="space-y-6">
            <div className="glass-card p-6 mb-6">
              <h2 className="executive-font text-2xl font-bold text-white mb-4">Part 1: Journey Through the Stages</h2>
              <p className="text-slate-300 mb-4">
                Follow one team member (Alex) through all five Tuckman stages, experiencing the emotional journey of team development.
              </p>
              
              {/* Scenario Navigation */}
              <div className="flex gap-2 mb-6 flex-wrap">
                {['1A', '1B', '1C', '1D', '1E'].map(scenario => (
                  <button
                    key={scenario}
                    onClick={() => setTeamMemberPerspectivesState(prev => ({ ...prev, currentScenario: scenario }))}
                    className={`px-4 py-2 rounded transition-all ${
                      teamMemberPerspectivesState.currentScenario === scenario
                        ? 'bg-cyan-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {scenario === '1A' && 'Forming'}
                    {scenario === '1B' && 'Storming'}
                    {scenario === '1C' && 'Norming'}
                    {scenario === '1D' && 'Performing'}
                    {scenario === '1E' && 'Adjourning'}
                  </button>
                ))}
              </div>

              {/* Scenario Content */}
              {teamMemberPerspectivesState.currentScenario === '1A' && (
                <div className="space-y-6">
                  <div className="glass-card p-6 border-l-4 border-green-500">
                    <h3 className="executive-font text-xl font-bold text-white mb-4">Scenario 1A: Alex's First Day (Forming)</h3>
                    <div className="bg-slate-800/50 p-4 rounded mb-4">
                      <p className="text-white font-semibold mb-2">YOU ARE: Alex, UX Designer</p>
                      <p className="text-slate-300 text-sm">
                        <strong>Your Background:</strong> 5 years of UX design experience, new to this company (started 2 weeks ago), 
                        this is your first project assignment here. You're confident in your skills but unfamiliar with company culture. 
                        You tend to be thoughtful and observant before speaking up.
                      </p>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-white font-semibold mb-2">THE SITUATION</h4>
                      <p className="text-slate-300 leading-relaxed">
                        You're observing your team's Monday morning standup, 7 weeks into the project. You arrive 5 minutes early, 
                        taking a seat near the middle. Six other people filter in - you only recognize Jordan from orientation. 
                        Sarah (PM) starts the meeting, everyone introduces themselves. Everyone is polite and professional.
                      </p>
                      <p className="text-slate-300 leading-relaxed mt-2">
                        Sarah presents the project charter - 8-month timeline, ambitious scope. You have questions: When do I present 
                        designs to the team? Who has final approval on UX decisions? What design system does this company use? Is there 
                        a researcher I'll work with?
                      </p>
                      <p className="text-slate-300 leading-relaxed mt-2">
                        Jordan raises their hand, asks about the code review process. Sarah says she'll send documentation this afternoon. 
                        You consider asking your question but hesitate - Jordan's question was about development. Maybe design questions should wait? 
                        You don't want to derail the meeting or seem uninformed. You stay quiet, decide to figure it out.
                      </p>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-white font-semibold mb-2">YOUR INTERNAL EXPERIENCE</h4>
                      <div className="bg-slate-800/50 p-4 rounded italic text-slate-300">
                        <p className="mb-2">"That was... fine? Everyone seems nice."</p>
                        <p className="mb-2">You have many questions but aren't sure who to ask or if you should ask.</p>
                        <p className="mb-2">You'll wait for the documentation Sarah promised.</p>
                        <p className="mb-2">You don't want to be "that annoying new person."</p>
                        <p className="mb-2">You wish you knew who you'll work with closely.</p>
                        <p>"I'm sure it'll get clearer."</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-white font-semibold mb-2">Reflection Questions (1A)</h4>
                      <ol className="list-decimal list-inside space-y-2 text-slate-300 ml-4">
                        <li>What emotions is Alex experiencing? List at least 5 specific feelings.</li>
                        <li>What does Alex need from Sarah right now? What would make Alex feel more confident?</li>
                        <li>What assumptions is Alex making? Are these assumptions accurate?</li>
                        <li>Why didn't Alex ask their question in the meeting? What does this tell you about Forming stage dynamics?</li>
                        <li>If you were Sarah, what would you do in the next 24 hours?</li>
                      </ol>
                    </div>

                    <details className="glass-card p-4 bg-slate-800/30">
                      <summary className="text-white font-semibold cursor-pointer hover:text-cyan-400">
                        Click for Analysis
                      </summary>
                      <div className="mt-4 space-y-4 text-slate-300 text-sm">
                        <div>
                          <h5 className="text-white font-semibold mb-2">Alex's Emotional State (Forming):</h5>
                          <ul className="list-disc list-inside space-y-1 ml-4">
                            <li><strong>Uncertain</strong> - Doesn't know processes, expectations, norms</li>
                            <li><strong>Hesitant</strong> - Reluctant to speak up or ask questions</li>
                            <li><strong>Self-conscious</strong> - Worried about appearing incompetent</li>
                            <li><strong>Isolated</strong> - Doesn't know anyone well yet</li>
                            <li><strong>Patient but anxious</strong> - Waiting for information while uncertainty builds</li>
                          </ul>
                          <p className="mt-2 italic">This is classic Forming stage experience.</p>
                        </div>
                        <div>
                          <h5 className="text-white font-semibold mb-2">What Alex Needs:</h5>
                          <p className="mb-2"><strong>Immediate Needs (within 24 hours):</strong></p>
                          <ul className="list-disc list-inside space-y-1 ml-4">
                            <li>Clear role definition - Who approves UX decisions? Who does Alex work with?</li>
                            <li>Process clarity - Design review process, approval workflow, design system/tools</li>
                            <li>Permission to ask questions - Explicit invitation, multiple channels, reassurance</li>
                            <li>First task assignment - Concrete, achievable, clear success criteria</li>
                            <li>Relationship building opportunity - Who to connect with first</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="text-white font-semibold mb-2">What Sarah Should Do:</h5>
                          <p className="mb-2"><strong>Within 24 hours:</strong></p>
                          <ul className="list-disc list-inside space-y-1 ml-4">
                            <li>Send comprehensive documentation (as promised) with RACI matrix and design approval process</li>
                            <li>Schedule 1-on-1 with Alex - ask questions, learn about background and style</li>
                            <li>Send first task assignment with clear deadline and success criteria</li>
                            <li>Explicit invitation for questions - "Please ask me anything - no question is too basic"</li>
                            <li>Connect Alex with key collaborators</li>
                          </ul>
                          <p className="mt-2"><strong>Leadership Style:</strong> Authoritative/Commanding - Provide direction confidently</p>
                        </div>
                      </div>
                    </details>
                  </div>
                </div>
              )}

              {/* Placeholder for other scenarios - structure is ready for expansion */}
              {teamMemberPerspectivesState.currentScenario !== '1A' && (
                <div className="glass-card p-8 text-center">
                  <p className="text-slate-400 mb-4">
                    Scenario {teamMemberPerspectivesState.currentScenario} content coming soon.
                  </p>
                  <p className="text-slate-500 text-sm">
                    The full content for all 5 scenarios (1A-1E) will follow the same structure as Scenario 1A above.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Part 2: Same Situation, Different People */}
        {teamMemberPerspectivesState.currentPart === 2 && (
          <div className="space-y-6">
            <div className="glass-card p-6 mb-6">
              <h2 className="executive-font text-2xl font-bold text-white mb-4">Part 2: Same Situation, Different People</h2>
              <p className="text-slate-300 mb-4">
                Experience how the SAME leadership moment affects different team members differently.
              </p>
              
              <div className="bg-red-500/10 p-4 rounded border-l-4 border-red-500 mb-6">
                <h3 className="text-white font-semibold mb-2">THE SITUATION:</h3>
                <p className="text-slate-300">
                  Production system is down. Customers cannot log in. The PM (Chris) responds with a Commanding leadership style:
                </p>
                <p className="text-white font-mono mt-2 p-3 bg-slate-900/50 rounded">
                  "Everyone stop what you're doing. Here's what we're doing. Casey - database logs. Jordan - API connections. 
                  Morgan - customer communication. Taylor - monitoring. Robin - stand by for deployment. Go now."
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {[
                  { id: '2A', name: 'Casey', role: 'Junior Developer', emoji: '👨‍💻', color: 'green' },
                  { id: '2B', name: 'Jordan', role: 'Senior Developer', emoji: '👩‍💻', color: 'blue' },
                  { id: '2C', name: 'Morgan', role: 'Developer with Anxiety', emoji: '🧑‍💻', color: 'yellow' },
                  { id: '2D', name: 'Taylor', role: 'Context-Seeking Developer', emoji: '👨‍💼', color: 'purple' }
                ].map(perspective => (
                  <button
                    key={perspective.id}
                    onClick={() => setTeamMemberPerspectivesState(prev => ({ ...prev, currentScenario: perspective.id }))}
                    className={`glass-card p-4 text-left transition-all border-l-4 ${
                      teamMemberPerspectivesState.currentScenario === perspective.id
                        ? `border-${perspective.color}-500 bg-${perspective.color}-500/10`
                        : 'border-slate-600 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{perspective.emoji}</span>
                      <div>
                        <p className="text-white font-semibold">{perspective.name}</p>
                        <p className="text-slate-400 text-sm">{perspective.role}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Perspective Content */}
              {teamMemberPerspectivesState.currentScenario.startsWith('2') && (
                <div className="glass-card p-6">
                  <p className="text-slate-400 text-center">
                    Full perspective content for {teamMemberPerspectivesState.currentScenario} will be displayed here, 
                    following the same structure as Part 1 scenarios with character background, situation, internal experience, 
                    reflection questions, and collapsible analysis.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Part 3: The Leader's Perspective */}
        {teamMemberPerspectivesState.currentPart === 3 && (
          <div className="space-y-6">
            <div className="glass-card p-6 mb-6">
              <h2 className="executive-font text-2xl font-bold text-white mb-4">Part 3: The Leader's Perspective</h2>
              <p className="text-slate-300 mb-4">
                Now step into Sarah's shoes during the Month 2 conflict between Alex and Jordan.
              </p>

              <div className="glass-card p-6 border-l-4 border-rose-500">
                <div className="bg-slate-800/50 p-4 rounded mb-4">
                  <p className="text-white font-semibold mb-2">YOU ARE: Sarah, PM of Project Phoenix</p>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-white font-semibold mb-2">THE SITUATION</h4>
                  <p className="text-slate-300 leading-relaxed">
                    You just watched Jordan publicly criticize Alex in the design review meeting. "Do you even understand 
                    how our tech stack works?" The room went tense, Alex looked humiliated, others uncomfortable. 
                    You said "Let's table this and move on." Now walking back to your desk, replaying what happened.
                  </p>
                </div>

                <div className="mb-4">
                  <h4 className="text-white font-semibold mb-2">YOUR INTERNAL EXPERIENCE</h4>
                  <div className="bg-slate-800/50 p-4 rounded italic text-slate-300">
                    <p className="mb-2">"That was bad. That was really bad."</p>
                    <p className="mb-2">Jordan was out of line, but also had a valid point about the framework constraint.</p>
                    <p className="mb-2">Why didn't I intervene? Should have said something. Instead just moved on.</p>
                    <p className="mb-2">Froze. Didn't know what to say. If I defended Alex, would Jordan feel unsupported?</p>
                    <p>"How do I know what's right?"</p>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-white font-semibold mb-2">Reflection Questions</h4>
                  <ol className="list-decimal list-inside space-y-2 text-slate-300 ml-4">
                    <li>What's Sarah feeling? Are these feelings justified?</li>
                    <li>What did Sarah do wrong? In the meeting? After the meeting?</li>
                    <li>What does Sarah do RIGHT in her thinking?</li>
                    <li>What should Sarah do in the next 2 hours? With Alex? With Jordan?</li>
                    <li>What leadership style(s) does Sarah need now?</li>
                  </ol>
                </div>

                <details className="glass-card p-4 bg-slate-800/30">
                  <summary className="text-white font-semibold cursor-pointer hover:text-rose-400">
                    Click for Analysis
                  </summary>
                  <div className="mt-4 space-y-4 text-slate-300 text-sm">
                    <div>
                      <h5 className="text-white font-semibold mb-2">What Sarah Did Wrong:</h5>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li><strong>In the Meeting:</strong> "Let's table this and move on" = avoidance. Didn't address Jordan's inappropriate comment.</li>
                        <li><strong>After the Meeting:</strong> Walking to desk instead of finding Alex. Overthinking instead of acting.</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-white font-semibold mb-2">What Sarah Should Do NOW (within 30 minutes):</h5>
                      <p className="mb-2"><strong>Step 1: Find Alex</strong></p>
                      <p className="mb-2 ml-4">"I want to acknowledge what happened. Jordan's comment was inappropriate and I should have said so. 
                      The framework constraint should have been communicated to you weeks ago. That's on me, not you."</p>
                      <p className="mb-2"><strong>Step 2: Find Jordan</strong></p>
                      <p className="mb-2 ml-4">"Your concern is legitimate, but the way you raised it wasn't okay. I need you to treat teammates with respect."</p>
                      <p className="mb-2"><strong>Step 3: Schedule facilitated discussion</strong></p>
                      <p className="ml-4">Book 90 minutes tomorrow with Alex, Jordan, and Sarah to find a solution.</p>
                    </div>
                    <div>
                      <h5 className="text-white font-semibold mb-2">Leadership Style Needed:</h5>
                      <p><strong>Coaching</strong> - Facilitate conflict resolution, help them understand each other, don't take sides.</p>
                      <p><strong>Affiliative</strong> - Repair relationship with Alex, acknowledge emotions, rebuild trust.</p>
                    </div>
                  </div>
                </details>
              </div>
            </div>
          </div>
        )}

        <GlobalNavFooter />
      </div>
    );
  }

  if (view === 'empathy-exercise' || view === 'team-member-perspectives') {
    if (!currentTask) {
      return (
        <div className="max-w-6xl w-full p-10 animate-fadeIn text-left">
          <div className="glass-card p-10 text-center">
            <h1 className="executive-font text-3xl font-bold text-white mb-4">Loading...</h1>
            <GlobalNavFooter />
          </div>
        </div>
      );
    }
    // For Lead a Team, use team_member_perspectives, otherwise empathy_exercise
    let dataKey, activityTitle;
    if (selectedTask === 'Lead a Team' || selectedTask === 'Support Performance') {
      dataKey = 'team_member_perspectives';
      activityTitle = 'Team Member Perspectives';
    } else {
      dataKey = 'empathy_exercise';
      activityTitle = 'Empathy Exercise';
    }
    const empathyScenarios = currentTask.practice?.[dataKey] || currentTask.practice?.empathy_exercise || [];
    const currentScenarioData = empathyScenarios[empathyExerciseState.currentScenario];

    const handlePerspectiveView = (perspective) => {
      const scenarioId = currentScenarioData?.id;
      if (!scenarioId) return;

      setEmpathyExerciseState(prev => ({
        ...prev,
        currentPerspective: perspective,
        viewedPerspectives: {
          ...prev.viewedPerspectives,
          [scenarioId]: {
            ...(prev.viewedPerspectives[scenarioId] || {}),
            [perspective]: true
          }
        }
      }));

      // Check if all perspectives viewed
      const viewedForScenario = empathyExerciseState.viewedPerspectives[scenarioId] || {};
      const allViewed = viewedForScenario.personA && viewedForScenario.personB && viewedForScenario.pm;
      if (allViewed || (perspective === 'pm' && viewedForScenario.personA && viewedForScenario.personB)) {
        setTimeout(() => {
          setEmpathyExerciseState(prev => {
            const newState = { ...prev, showingInsight: true };
            // Record completion when all perspectives viewed for first time
            if (!prev.progressRecorded || prev.lastRecordedScenario !== scenarioId) {
              recordActivityCompletion(selectedTask, 'empathy-exercise', 100, {
                scenarioCompleted: scenarioId
              });
              // Also record comprehensive score
              recordComprehensiveScore(selectedTask, selectedTask === 'Lead a Team' ? 'team-member-perspectives' : 'empathy-exercise', {
                score: 100,
                scenarioCompleted: scenarioId,
                scenariosCompleted: 1
              });
              newState.progressRecorded = true;
              newState.lastRecordedScenario = scenarioId;
            }
            return newState;
          });
        }, 500);
      }
    };

    const handleReflectionChange = (questionIndex, value) => {
      const scenarioId = currentScenarioData?.id;
      if (!scenarioId) return;

      setEmpathyExerciseState(prev => ({
        ...prev,
        reflections: {
          ...prev.reflections,
          [scenarioId]: {
            ...(prev.reflections[scenarioId] || {}),
            [questionIndex]: value
          }
        }
      }));
    };

    const nextScenario = () => {
      if (empathyExerciseState.currentScenario < empathyScenarios.length - 1) {
        setEmpathyExerciseState({
          currentScenario: empathyExerciseState.currentScenario + 1,
          currentPerspective: 'personA',
          viewedPerspectives: empathyExerciseState.viewedPerspectives,
          showingInsight: false,
          reflections: empathyExerciseState.reflections,
          progressRecorded: false,
          lastRecordedScenario: -1
        });
      } else {
        // Loop back to first
        setEmpathyExerciseState({
          currentScenario: 0,
          currentPerspective: 'personA',
          viewedPerspectives: empathyExerciseState.viewedPerspectives,
          showingInsight: false,
          reflections: empathyExerciseState.reflections,
          progressRecorded: false,
          lastRecordedScenario: -1
        });
      }
    };

    const goToPracticeHub = () => {
      setEmpathyExerciseState({
        currentScenario: 0,
        currentPerspective: 'personA',
        viewedPerspectives: {},
        showingInsight: false,
        reflections: {},
        progressRecorded: false,
        lastRecordedScenario: -1
      });
      setView('practice-hub');
    };

    if (!currentScenarioData) {
      return (
        <div className="max-w-6xl w-full p-10 animate-fadeIn text-left">
          <div className="glass-card p-10 text-center">
            <h1 className="executive-font text-3xl font-bold text-white mb-4">👥 {activityTitle}</h1>
            <p className="text-slate-400">No scenarios available for this task.</p>
            <button 
              onClick={goToPracticeHub}
              className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors executive-font"
            >
              ← Back to Practice Hub
            </button>
            <GlobalNavFooter />
          </div>
        </div>
      );
    }

    const scenarioId = currentScenarioData.id;
    const viewedForScenario = empathyExerciseState.viewedPerspectives[scenarioId] || {};
    const allPerspectivesViewed = viewedForScenario.personA && viewedForScenario.personB && viewedForScenario.pm;

    return (
      <div className="max-w-6xl w-full p-10 animate-fadeIn text-left">
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={goToPracticeHub}
              className="px-4 py-2 executive-font text-xs text-slate-400 hover:text-white uppercase font-semibold transition-colors flex items-center gap-2"
            >
              ← Back
            </button>
          </div>
          <div className="flex items-center justify-between mb-4">
            <h1 className="executive-font text-5xl font-bold text-white tracking-tight">👥 {activityTitle}: See Both Sides</h1>
            <div className="text-slate-400 text-sm uppercase tracking-wide">
              Scenario {empathyExerciseState.currentScenario + 1} of {empathyScenarios.length}
            </div>
          </div>
          <p className="text-slate-400 text-lg">Read the conflict, then VIEW from each person's perspective.</p>
        </header>

        {/* Scenario Card */}
        <div className="glass-card p-6 mb-6 border-l-4 border-blue-500">
          <h2 className="executive-font text-2xl font-bold text-white mb-4">{currentScenarioData.title}</h2>
          <p className="text-slate-300 text-lg leading-relaxed">{currentScenarioData.situation}</p>
        </div>

        {/* Perspective Tabs */}
        <div className="mb-6">
          <div className="flex gap-4 border-b border-white/10 mb-4">
            <button
              onClick={() => handlePerspectiveView('personA')}
              className={`px-6 py-3 executive-font text-xs font-semibold uppercase transition-all relative ${
                empathyExerciseState.currentPerspective === 'personA'
                  ? 'text-white border-b-2 border-blue-400'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              View as {currentScenarioData.perspectives.personA.name} {currentScenarioData.perspectives.personA.emoji}
              {viewedForScenario.personA && <span className="ml-2 text-emerald-400">✓</span>}
            </button>
            <button
              onClick={() => handlePerspectiveView('personB')}
              className={`px-6 py-3 executive-font text-xs font-semibold uppercase transition-all relative ${
                empathyExerciseState.currentPerspective === 'personB'
                  ? 'text-white border-b-2 border-orange-400'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              View as {currentScenarioData.perspectives.personB.name} {currentScenarioData.perspectives.personB.emoji}
              {viewedForScenario.personB && <span className="ml-2 text-emerald-400">✓</span>}
            </button>
            <button
              onClick={() => handlePerspectiveView('pm')}
              className={`px-6 py-3 executive-font text-xs font-semibold uppercase transition-all relative ${
                empathyExerciseState.currentPerspective === 'pm'
                  ? 'text-white border-b-2 border-purple-400'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              View as PM {currentScenarioData.perspectives.pm.emoji}
              {viewedForScenario.pm && <span className="ml-2 text-emerald-400">✓</span>}
            </button>
          </div>

          {/* Person A Perspective */}
          {empathyExerciseState.currentPerspective === 'personA' && (
            <div className="glass-card p-8 border-l-4 border-blue-500 bg-blue-500/5 perspective-content">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl">{currentScenarioData.perspectives.personA.emoji}</span>
                <div>
                  <h3 className="executive-font text-2xl font-bold text-white">{currentScenarioData.perspectives.personA.name}</h3>
                  <p className="text-slate-400">{currentScenarioData.perspectives.personA.role}</p>
                </div>
              </div>
              <div className="bg-slate-800/50 p-6 rounded border-l-4 border-blue-400 mb-6">
                <p className="text-white text-lg italic leading-relaxed">"{currentScenarioData.perspectives.personA.thoughts}"</p>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-white font-semibold mb-2">Concerns:</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    {currentScenarioData.perspectives.personA.concerns.map((concern, idx) => (
                      <li key={idx}>{concern}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Fears:</h4>
                  <p className="text-slate-300">{currentScenarioData.perspectives.personA.fears}</p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">What they wish others knew:</h4>
                  <p className="text-slate-300 italic">{currentScenarioData.perspectives.personA.wishesOthersKnew}</p>
                </div>
              </div>
            </div>
          )}

          {/* Person B Perspective */}
          {empathyExerciseState.currentPerspective === 'personB' && (
            <div className="glass-card p-8 border-l-4 border-orange-500 bg-orange-500/5 animate-fadeIn">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl">{currentScenarioData.perspectives.personB.emoji}</span>
                <div>
                  <h3 className="executive-font text-2xl font-bold text-white">{currentScenarioData.perspectives.personB.name}</h3>
                  <p className="text-slate-400">{currentScenarioData.perspectives.personB.role}</p>
                </div>
              </div>
              <div className="bg-slate-800/50 p-6 rounded border-l-4 border-orange-400 mb-6">
                <p className="text-white text-lg italic leading-relaxed">"{currentScenarioData.perspectives.personB.thoughts}"</p>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-white font-semibold mb-2">Concerns:</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    {currentScenarioData.perspectives.personB.concerns.map((concern, idx) => (
                      <li key={idx}>{concern}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Fears:</h4>
                  <p className="text-slate-300">{currentScenarioData.perspectives.personB.fears}</p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">What they wish others knew:</h4>
                  <p className="text-slate-300 italic">{currentScenarioData.perspectives.personB.wishesOthersKnew}</p>
                </div>
              </div>
            </div>
          )}

          {/* PM Perspective */}
          {empathyExerciseState.currentPerspective === 'pm' && (
            <div className="glass-card p-8 border-l-4 border-purple-500 bg-purple-500/5 perspective-content">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl">{currentScenarioData.perspectives.pm.emoji}</span>
                <h3 className="executive-font text-2xl font-bold text-white">Project Manager's View</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="text-white font-semibold mb-3">Observations:</h4>
                  <ul className="list-disc list-inside space-y-2 text-slate-300">
                    {currentScenarioData.perspectives.pm.observations.map((obs, idx) => (
                      <li key={idx}>{obs}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-3">Valid Points:</h4>
                  <div className="space-y-2">
                    <div className="bg-blue-500/10 p-3 rounded border-l-2 border-blue-400">
                      <p className="text-slate-300"><span className="font-semibold text-blue-400">{currentScenarioData.perspectives.personA.name}:</span> {currentScenarioData.perspectives.pm.validPoints.architect || currentScenarioData.perspectives.pm.validPoints.personA}</p>
                    </div>
                    <div className="bg-orange-500/10 p-3 rounded border-l-2 border-orange-400">
                      <p className="text-slate-300"><span className="font-semibold text-orange-400">{currentScenarioData.perspectives.personB.name}:</span> {currentScenarioData.perspectives.pm.validPoints.engineer || currentScenarioData.perspectives.pm.validPoints.personB || currentScenarioData.perspectives.pm.validPoints.marketing}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">The Real Issue:</h4>
                  <p className="text-slate-300">{currentScenarioData.perspectives.pm.realIssue}</p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Solution:</h4>
                  <p className="text-slate-300">{currentScenarioData.perspectives.pm.solution}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Insight Reveal */}
        {empathyExerciseState.showingInsight && (
          <div className="glass-card p-8 mb-6 border-l-4 border-yellow-500 bg-yellow-500/10 animate-fadeIn">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">💡</span>
              <h2 className="executive-font text-3xl font-bold text-white">KEY INSIGHT</h2>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-yellow-400 font-bold text-xl mb-3">{currentScenarioData.insight.title}</h3>
                <p className="text-white text-lg leading-relaxed">{currentScenarioData.insight.revelation}</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Best Approach:</h4>
                <p className="text-slate-300 leading-relaxed">{currentScenarioData.insight.bestApproach}</p>
              </div>
              <div className="bg-blue-500/10 p-4 rounded border-l-2 border-blue-400">
                <h4 className="text-blue-400 font-semibold mb-2">Emotional Intelligence Connection:</h4>
                <p className="text-slate-300">{currentScenarioData.insight.eiConnection}</p>
              </div>
              {currentScenarioData.insight.examTip && (
                <div className="bg-emerald-500/10 p-4 rounded border-l-2 border-emerald-400">
                  <h4 className="text-emerald-400 font-semibold mb-2">Exam Tip:</h4>
                  <p className="text-slate-300">{currentScenarioData.insight.examTip}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reflection Questions */}
        {empathyExerciseState.showingInsight && currentScenarioData.reflectionQuestions && (
          <div className="glass-card p-8 mb-6">
            <h3 className="executive-font text-2xl font-bold text-white mb-6">Reflection Questions</h3>
            <div className="space-y-6">
              {currentScenarioData.reflectionQuestions.map((question, idx) => (
                <div key={idx}>
                  <label className="block text-white font-semibold mb-2">{question}</label>
                  <textarea
                    value={empathyExerciseState.reflections[scenarioId]?.[idx] || ''}
                    onChange={(e) => handleReflectionChange(idx, e.target.value)}
                    placeholder="Type your thoughts here (optional)..."
                    className="w-full glass-card p-4 text-slate-300 bg-slate-800/30 border border-white/10 rounded focus:outline-none focus:border-blue-500 resize-none"
                    rows="3"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          {empathyExerciseState.showingInsight && (
            <button 
              onClick={nextScenario}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors executive-font"
            >
              Next Scenario →
            </button>
          )}
          <button 
            onClick={goToPracticeHub}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors executive-font"
          >
            Back to Practice Hub
          </button>
        </div>
        <GlobalNavFooter />
      </div>
    );
  }

  // Deep Dive Analysis View
  if (view === 'deep-dive') return (
    <div className="max-w-6xl w-full p-10 glass-card animate-fadeIn shadow-2xl text-left">
      <div className="executive-header mb-8">
        <h1 className="executive-font text-5xl font-bold text-white mb-2 tracking-tight">Deep Dive Analysis</h1>
        <p className="text-slate-400 text-lg">{selectedTask}</p>
      </div>
      
      <div className="space-y-6">
        {currentTask.learn?.deep_dive?.foundational_concept && (
          <div className="glass-card p-6 border-l-4 border-blue-500">
            <h3 className="executive-font text-xl font-semibold text-white mb-4 uppercase tracking-wide">Foundational Concept</h3>
            <div className="text-slate-300 space-y-3">
              <p>{currentTask.learn.deep_dive.foundational_concept}</p>
            </div>
          </div>
        )}

        {currentTask.learn?.deep_dive?.thomas_kilmann_model && (
          <div className="glass-card p-6 border-l-4 border-purple-500">
            <h3 className="executive-font text-xl font-semibold text-white mb-4 uppercase tracking-wide">Thomas-Kilmann Conflict Model</h3>
            <div className="text-slate-300 space-y-4">
              <p className="mb-4">{currentTask.learn.deep_dive.thomas_kilmann_model.description}</p>
              {currentTask.learn.deep_dive.thomas_kilmann_model.five_modes && (
                <div className="space-y-4">
                  {currentTask.learn.deep_dive.thomas_kilmann_model.five_modes.map((mode, idx) => (
                    <div key={idx} className="border-l-2 border-purple-500/50 pl-4">
                      <h4 className="font-semibold text-white mb-2">{mode.mode}</h4>
                      <p className="text-sm mb-2">{mode.description}</p>
                      <div className="text-xs text-slate-400">
                        <div className="mb-1"><span className="font-semibold">Assertiveness:</span> {mode.assertiveness}</div>
                        <div className="mb-1"><span className="font-semibold">Cooperativeness:</span> {mode.cooperativeness}</div>
                        <div className="mb-1"><span className="font-semibold">Outcome:</span> {mode.outcome}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {currentTask.learn?.deep_dive?.step_by_step_process && (
          <div className="glass-card p-6 border-l-4 border-emerald-500">
            <h3 className="executive-font text-xl font-semibold text-white mb-4 uppercase tracking-wide">Step-by-Step Process</h3>
            <div className="text-slate-300 space-y-4">
              {currentTask.learn.deep_dive.step_by_step_process.map((step, idx) => (
                <div key={idx} className="border-l-2 border-emerald-500/50 pl-4">
                  <h4 className="font-semibold text-white mb-2">Step {step.step}: {step.title}</h4>
                  {step.actions && (
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {step.actions.map((action, actionIdx) => (
                        <li key={actionIdx}>{action}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {currentTask.learn?.deep_dive?.common_mistakes && (
          <div className="glass-card p-6 border-l-4 border-rose-500">
            <h3 className="executive-font text-xl font-semibold text-white mb-4 uppercase tracking-wide">Common Mistakes</h3>
            <div className="text-slate-300 space-y-3">
              {currentTask.learn.deep_dive.common_mistakes.map((mistake, idx) => (
                <div key={idx} className="border-l-2 border-rose-500/50 pl-4">
                  <h4 className="font-semibold text-white mb-1">{mistake.mistake}</h4>
                  <p className="text-sm text-slate-400 mb-1"><span className="font-semibold">Consequence:</span> {mistake.consequence}</p>
                  <p className="text-sm text-emerald-400"><span className="font-semibold">Correction:</span> {mistake.correction}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentTask.learn?.deep_dive?.emotional_intelligence_connection && (
          <div className="glass-card p-6 border-l-4 border-cyan-500">
            <h3 className="executive-font text-xl font-semibold text-white mb-4 uppercase tracking-wide">Emotional Intelligence Connection</h3>
            <div className="text-slate-300 space-y-3 text-sm">
              <div><span className="font-semibold text-white">Self-Awareness:</span> {currentTask.learn.deep_dive.emotional_intelligence_connection.self_awareness}</div>
              <div><span className="font-semibold text-white">Self-Management:</span> {currentTask.learn.deep_dive.emotional_intelligence_connection.self_management}</div>
              <div><span className="font-semibold text-white">Social Awareness:</span> {currentTask.learn.deep_dive.emotional_intelligence_connection.social_awareness}</div>
              <div><span className="font-semibold text-white">Relationship Management:</span> {currentTask.learn.deep_dive.emotional_intelligence_connection.relationship_management}</div>
            </div>
          </div>
        )}

        {!currentTask.learn?.deep_dive && (
          <div className="glass-card p-6 border-l-4 border-blue-500">
            <h3 className="executive-font text-xl font-semibold text-white mb-4 uppercase tracking-wide">Detailed Breakdown</h3>
            <div className="text-slate-300 space-y-3">
              <p className="italic text-slate-500">Detailed analysis coming soon...</p>
            </div>
          </div>
        )}
      </div>

      <button 
        onClick={() => setView('learn-hub')} 
        className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors executive-font"
      >
        ← Back to Learning
      </button>
      <GlobalNavFooter />
    </div>
  );

  // Activity Picker View (Practice Hub)
  if (view === 'activity-picker') return (
    <div className="max-w-6xl w-full p-10 animate-fadeIn text-left">
      <div className="executive-header mb-8">
        <h1 className="executive-font text-5xl font-bold text-white mb-2 tracking-tight">Practice Hub</h1>
        <p className="text-slate-400 text-lg">Choose your practice activity for {selectedTask}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-6 mb-8">
        <button 
          onClick={() => {/* Add checklist practice */}}
          className="glass-card p-8 text-left hover:bg-purple-500/10 transition-all border-l-4 border-purple-500"
        >
          <h3 className="executive-font text-2xl font-semibold text-white mb-3">Checklist Practice</h3>
          <p className="text-slate-400 text-sm">Review and practice key checklists for this task</p>
        </button>
        
        <button 
          onClick={() => {/* Add reflex prompts */}}
          className="glass-card p-8 text-left hover:bg-blue-500/10 transition-all border-l-4 border-blue-500"
        >
          <h3 className="executive-font text-2xl font-semibold text-white mb-3">Reflex Prompts</h3>
          <p className="text-slate-400 text-sm">Practice quick decision-making scenarios</p>
        </button>
        
        <button 
          onClick={() => {/* Add stress test */}}
          className="glass-card p-8 text-left hover:bg-rose-500/10 transition-all border-l-4 border-rose-500"
        >
          <h3 className="executive-font text-2xl font-semibold text-white mb-3">Stress Test</h3>
          <p className="text-slate-400 text-sm">Challenge yourself with advanced scenarios</p>
        </button>
        
        <button 
          onClick={() => setView('practice-quizzes')}
          className="glass-card p-8 text-left hover:bg-emerald-500/10 transition-all border-l-4 border-emerald-500"
        >
          <h3 className="executive-font text-2xl font-semibold text-white mb-3">Quick Quiz</h3>
          <p className="text-slate-400 text-sm">Test your knowledge with practice questions</p>
        </button>
      </div>

      <button 
        onClick={() => setView('task-interstitial')} 
        className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors executive-font"
      >
        ← Back to Task
      </button>
      <GlobalNavFooter />
    </div>
  );

  // Statistics View Component
  if (view === 'statistics') return (
    <div className="max-w-7xl w-full p-10 animate-fadeIn">
      <div className="executive-header mb-8">
        <h1 className="executive-font text-5xl font-bold text-white mb-2 tracking-tight">The Statistics</h1>
        <p className="text-slate-400 text-lg">Comprehensive performance metrics and analytics</p>
      </div>
      
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="stat-card">
          <div className="text-sm text-slate-400 uppercase font-semibold mb-2 tracking-wide">Total Questions</div>
          <div className="text-4xl font-bold text-white mb-1">0</div>
          <div className="text-xs text-slate-500">Practice sessions completed</div>
        </div>
        <div className="stat-card">
          <div className="text-sm text-slate-400 uppercase font-semibold mb-2 tracking-wide">Accuracy Rate</div>
          <div className="text-4xl font-bold text-white mb-1">0%</div>
          <div className="text-xs text-slate-500">Overall performance</div>
        </div>
        <div className="stat-card">
          <div className="text-sm text-slate-400 uppercase font-semibold mb-2 tracking-wide">Study Hours</div>
          <div className="text-4xl font-bold text-white mb-1">0</div>
          <div className="text-xs text-slate-500">Time invested</div>
        </div>
        <div className="stat-card">
          <div className="text-sm text-slate-400 uppercase font-semibold mb-2 tracking-wide">Current Streak</div>
          <div className="text-4xl font-bold text-white mb-1">0</div>
          <div className="text-xs text-slate-500">Days in a row</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6">
          <h3 className="executive-font text-xl font-semibold text-white mb-4 uppercase tracking-wide">Domain Performance</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-300">People Domain</span>
                <span className="text-sm font-semibold text-white">0%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{width: '0%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-300">Process Domain</span>
                <span className="text-sm font-semibold text-white">0%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{width: '0%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-300">Business Domain</span>
                <span className="text-sm font-semibold text-white">0%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{width: '0%'}}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="executive-font text-xl font-semibold text-white mb-4 uppercase tracking-wide">Recent Activity</h3>
          <div className="space-y-3">
            <div className="text-sm text-slate-400 italic">No recent activity</div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="executive-font text-xl font-semibold text-white mb-4 uppercase tracking-wide">Achievements</h3>
          <div className="text-sm text-slate-400 italic">No achievements unlocked yet</div>
        </div>
      </div>

      <button 
        onClick={() => setView('executive-hud')} 
        className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors executive-font"
      >
        ← Back to Dashboard
      </button>
      <GlobalNavFooter />
    </div>
  );

  if (view === 'executive-hud') {
    return (
      <>
        <Confetti />
        <div className={`max-w-7xl w-full p-10 view-transition-wrapper ${viewTransition.isTransitioning && viewTransition.nextView !== 'executive-hud' ? 'view-transition-exit' : 'view-transition-enter'}`}>
          <ErrorBanner />
      {/* Privacy Disclaimer */}
      <div className="glass-card p-4 mb-6 border-l-4 border-blue-500 bg-blue-500/10">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🔒</span>
          <div className="flex-1">
            <p className="text-sm text-slate-300">
              <span className="font-semibold text-white">Privacy First:</span> All your progress and scores are stored locally on your device. Nothing is shared or transmitted. Your data stays private and secure.
            </p>
          </div>
        </div>
      </div>

      <div className="executive-header mb-12 animate-fadeIn">
        <h1 className="executive-font text-6xl font-bold text-white mb-3 tracking-tight animate-slideDown bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent">
          PMP Prep Center
        </h1>
        <p className="text-slate-400 text-xl animate-slideUp">Executive Learning Platform • Master the PMP Exam</p>
      </div>

      {/* Main Navigation Buttons - 3D Portfolio Style */}
      <div className="mb-12 animate-fadeIn">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <button 
            onClick={(e) => { createRipple(e); handleViewChange('strategy-suite'); }} 
            className="group relative glass-card p-8 text-center hover:scale-105 hover:-translate-y-2 transition-all duration-300 border-l-4 border-blue-500 hover:border-blue-400 hover:bg-blue-500/10 hover:shadow-[0_20px_50px_rgba(59,130,246,0.4)] hover:shadow-blue-500/30 btn-ripple overflow-hidden transform perspective-1000 preserve-3d"
            style={{transformStyle: 'preserve-3d'}}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-blue-600/0 group-hover:from-blue-600/10 group-hover:to-blue-600/5 transition-all duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 transform group-hover:translate-z-10 transition-transform duration-300">
              <div className="text-4xl mb-3 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300" style={{transformStyle: 'preserve-3d'}}>📚</div>
              <div className="executive-font text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors drop-shadow-lg">Learn</div>
              <div className="text-xs text-slate-400 group-hover:text-slate-300 uppercase tracking-widest">35 PMP Tasks</div>
            </div>
          </button>
          
          <button 
            onClick={(e) => { createRipple(e); handleViewChange('practice-hub'); }} 
            className="group relative glass-card p-8 text-center hover:scale-105 hover:-translate-y-2 transition-all duration-300 border-l-4 border-purple-500 hover:border-purple-400 hover:bg-purple-500/10 hover:shadow-[0_20px_50px_rgba(168,85,247,0.4)] hover:shadow-purple-500/30 btn-ripple overflow-hidden transform perspective-1000 preserve-3d"
            style={{transformStyle: 'preserve-3d'}}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-purple-600/0 group-hover:from-purple-600/10 group-hover:to-purple-600/5 transition-all duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 transform group-hover:translate-z-10 transition-transform duration-300">
              <div className="text-4xl mb-3 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300" style={{transformStyle: 'preserve-3d'}}>⚡</div>
              <div className="executive-font text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors drop-shadow-lg">Practice</div>
              <div className="text-xs text-slate-400 group-hover:text-slate-300 uppercase tracking-widest">Skill Building</div>
            </div>
          </button>
          
          <button 
            onClick={(e) => { createRipple(e); handleViewChange('practice-quizzes'); }} 
            className="group relative glass-card p-8 text-center hover:scale-105 hover:-translate-y-2 transition-all duration-300 border-l-4 border-emerald-500 hover:border-emerald-400 hover:bg-emerald-500/10 hover:shadow-[0_20px_50px_rgba(16,185,129,0.4)] hover:shadow-emerald-500/30 btn-ripple overflow-hidden transform perspective-1000 preserve-3d"
            style={{transformStyle: 'preserve-3d'}}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/0 to-emerald-600/0 group-hover:from-emerald-600/10 group-hover:to-emerald-600/5 transition-all duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 transform group-hover:translate-z-10 transition-transform duration-300">
              <div className="text-4xl mb-3 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300" style={{transformStyle: 'preserve-3d'}}>🎯</div>
              <div className="executive-font text-lg font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors drop-shadow-lg">Quizzes</div>
              <div className="text-xs text-slate-400 group-hover:text-slate-300 uppercase tracking-widest">Test Knowledge</div>
            </div>
          </button>
          
          <button 
            onClick={(e) => { createRipple(e); handleViewChange('practice-quizzes'); }} 
            className="group relative glass-card p-8 text-center hover:scale-105 hover:-translate-y-2 transition-all duration-300 border-l-4 border-rose-500 hover:border-rose-400 hover:bg-rose-500/10 hover:shadow-[0_20px_50px_rgba(244,63,94,0.4)] hover:shadow-rose-500/30 btn-ripple overflow-hidden transform perspective-1000 preserve-3d"
            style={{transformStyle: 'preserve-3d'}}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-rose-600/0 to-rose-600/0 group-hover:from-rose-600/10 group-hover:to-rose-600/5 transition-all duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 transform group-hover:translate-z-10 transition-transform duration-300">
              <div className="text-4xl mb-3 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300" style={{transformStyle: 'preserve-3d'}}>🎓</div>
              <div className="executive-font text-lg font-bold text-white mb-2 group-hover:text-rose-300 transition-colors drop-shadow-lg">Full Exam</div>
              <div className="text-xs text-slate-400 group-hover:text-slate-300 uppercase tracking-widest">180 Questions</div>
            </div>
          </button>
        </div>
      </div>

      {/* Progress Meters Section - Enhanced Portfolio Style */}
      <div className="mb-10 animate-fadeIn">
        <div className="flex items-center justify-between mb-6">
          <h2 className="executive-font text-3xl font-semibold text-white tracking-wide">Performance Dashboard</h2>
          <div className="text-xs text-slate-500 uppercase tracking-widest">Real-time Analytics</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="stat-card group hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-slate-400 uppercase font-semibold tracking-wide">Total Questions</div>
              <div className="text-2xl">📊</div>
            </div>
            <div className="text-5xl font-bold text-white mb-2 bg-gradient-to-br from-blue-400 to-cyan-400 bg-clip-text text-transparent">0</div>
            <div className="text-xs text-slate-500">Practice sessions completed</div>
            <div className="mt-3 h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-1000" style={{width: '0%'}}></div>
            </div>
          </div>
          <div className="stat-card group hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-slate-400 uppercase font-semibold tracking-wide">Accuracy Rate</div>
              <div className="text-2xl">🎯</div>
            </div>
            <div className="text-5xl font-bold text-white mb-2 bg-gradient-to-br from-purple-400 to-pink-400 bg-clip-text text-transparent">0%</div>
            <div className="text-xs text-slate-500">Overall performance</div>
            <div className="mt-3 h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000" style={{width: '0%'}}></div>
            </div>
          </div>
          <div className="stat-card group hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/20 border-l-4 border-emerald-500">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-slate-400 uppercase font-semibold tracking-wide">Study Hours</div>
              <div className="text-2xl">⏱️</div>
            </div>
            <div className="text-5xl font-bold text-white mb-2 bg-gradient-to-br from-emerald-400 to-teal-400 bg-clip-text text-transparent">0</div>
            <div className="text-xs text-slate-500">Time invested</div>
            <div className="mt-3 h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-1000" style={{width: '0%'}}></div>
            </div>
          </div>
          <div className="stat-card group hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/20 border-l-4 border-amber-500">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-slate-400 uppercase font-semibold tracking-wide">Current Streak</div>
              <div className="text-2xl">🔥</div>
            </div>
            <div className="text-5xl font-bold text-white mb-2 bg-gradient-to-br from-amber-400 to-orange-400 bg-clip-text text-transparent">0</div>
            <div className="text-xs text-slate-500">Days in a row</div>
            <div className="mt-3 h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-1000" style={{width: '0%'}}></div>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-6">
          <h3 className="executive-font text-lg font-semibold text-white mb-4 uppercase tracking-wide">Domain Performance</h3>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-300">People Domain</span>
                <span className="text-sm font-semibold text-white">0%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5">
                <div className="bg-blue-500 h-2.5 rounded-full transition-all" style={{width: '0%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-300">Process Domain</span>
                <span className="text-sm font-semibold text-white">0%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5">
                <div className="bg-purple-500 h-2.5 rounded-full transition-all" style={{width: '0%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-300">Business Domain</span>
                <span className="text-sm font-semibold text-white">0%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5">
                <div className="bg-emerald-500 h-2.5 rounded-full transition-all" style={{width: '0%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Task Progress Modal */}
      {showTaskProgressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6 animate-fadeIn">
          <div className="glass-card max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col border-2 border-cyan-500/30 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h2 className="executive-font text-3xl font-bold text-white mb-2">Learning Progress Tracker</h2>
                <p className="text-slate-400 text-sm">Track your progress across all 35 PMP tasks</p>
              </div>
              <button
                onClick={() => setShowTaskProgressModal(false)}
                className="text-slate-400 hover:text-white text-3xl font-bold w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              >
                ×
              </button>
            </div>
            
            {/* Modal Content - Two Column Layout */}
            <div className="flex-1 overflow-hidden flex">
              {/* Left Column - Task List */}
              <div className="w-1/3 border-r border-white/10 overflow-y-auto custom-scrollbar bg-slate-900/30">
                <div className="p-4">
                  <h3 className="executive-font text-lg font-semibold text-white mb-4 uppercase tracking-wide">All Tasks</h3>
                  <div className="space-y-2">
                    {Object.entries(domainMap).map(([domain, tasks]) => (
                      <div key={domain} className="mb-4">
                        <div className="text-xs text-slate-500 uppercase font-semibold mb-2 tracking-widest">{domain}</div>
                        {tasks.map(task => {
                          const allTasks = domainMap ? Object.values(domainMap).flat().filter(Boolean) : [];
                          const totalItems = 9; // 3 learn tabs + 6 activities
                          let completedItems = 0;
                          const items = [];
                          
                          // Check learn tabs
                          const learnTabs = ['overview', 'pmp-application', 'deep-dive'];
                          learnTabs.forEach(tab => {
                            const viewed = localStorage.getItem(`learn-viewed-${task}-${tab}`);
                            items.push({ type: 'learn', name: tab, completed: !!viewed });
                            if (viewed) completedItems++;
                          });
                          
                          // Check activities
                          const activities = [
                            { key: 'pm-simulator', name: 'PM Simulator' },
                            { key: 'lightning-round', name: 'Lightning Round' },
                            { key: 'document-detective', name: 'Document Detective' },
                            { key: 'conflict-matcher', name: 'Conflict Matcher' },
                            { key: 'timeline-reconstructor', name: 'Timeline Reconstructor' },
                            { key: 'empathy-exercise', name: 'Empathy Exercise' }
                          ];
                          activities.forEach(activity => {
                            const activityKey = `${task}-${activity.key}`;
                            const accessed = localStorage.getItem(`activity-accessed-${activityKey}`) || 
                                           localStorage.getItem(`lightning-round-best-${task}`) ||
                                           getActivityStats(task, activity.key);
                            items.push({ type: 'activity', name: activity.name, key: activity.key, completed: !!accessed });
                            if (accessed) completedItems++;
                          });
                          
                          const percentage = Math.round((completedItems / totalItems) * 100);
                          
                          return (
                            <button
                              key={task}
                              onClick={() => {
                                setSelectedTask(task);
                                setShowTaskProgressModal(false);
                                handleViewChange('task-interstitial');
                              }}
                              className="w-full text-left p-3 rounded-lg hover:bg-white/5 transition-colors mb-1 border-l-2 border-transparent hover:border-blue-500"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm text-white font-medium">{task}</span>
                                <span className="text-xs font-bold text-blue-400">{percentage}%</span>
                              </div>
                              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500" 
                                  style={{width: `${percentage}%`}}
                                ></div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Right Column - Progress Grid */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                <h3 className="executive-font text-lg font-semibold text-white mb-4 uppercase tracking-wide">Progress Details</h3>
                <div className="grid grid-cols-1 gap-4">
                  {domainMap && Object.entries(domainMap).map(([domain, tasks]) => (
                    <div key={domain} className="mb-6">
                      <div className="text-sm text-slate-400 uppercase font-semibold mb-3 tracking-widest">{domain}</div>
                      <div className="space-y-3">
                        {tasks && Array.isArray(tasks) && tasks.map(task => {
                          const learnTabs = [
                            { key: 'overview', name: 'Overview' },
                            { key: 'pmp-application', name: 'PMP Application' },
                            { key: 'deep-dive', name: 'Deep Dive' }
                          ];
                          const activities = [
                            { key: 'pm-simulator', name: 'PM Simulator' },
                            { key: 'lightning-round', name: 'Lightning Round' },
                            { key: 'document-detective', name: 'Document Detective' },
                            { key: 'conflict-matcher', name: 'Conflict Matcher' },
                            { key: 'timeline-reconstructor', name: 'Timeline Reconstructor' },
                            { key: 'empathy-exercise', name: 'Empathy Exercise' }
                          ];
                          
                          return (
                            <div key={task} className="glass-card p-4 border-l-4 border-blue-500/50">
                              <h4 className="executive-font text-base font-semibold text-white mb-3">{task}</h4>
                              <div className="grid grid-cols-3 gap-3 mb-3">
                                {learnTabs.map(tab => {
                                  const viewed = localStorage.getItem(`learn-viewed-${task}-${tab.key}`);
                                  return (
                                    <div key={tab.key} className="flex items-center gap-2">
                                      <input 
                                        type="checkbox" 
                                        checked={!!viewed} 
                                        readOnly
                                        className="w-4 h-4 rounded border-2 border-slate-600 bg-slate-800 checked:bg-blue-500 checked:border-blue-500"
                                      />
                                      <span className="text-xs text-slate-300">{tab.name}</span>
                                    </div>
                                  );
                                })}
                              </div>
                              <div className="grid grid-cols-3 gap-3">
                                {activities.map(activity => {
                                  const activityKey = `${task}-${activity.key}`;
                                  const accessed = localStorage.getItem(`activity-accessed-${activityKey}`) || 
                                                 localStorage.getItem(`lightning-round-best-${task}`) ||
                                                 getActivityStats(task, activity.key);
                                  return (
                                    <div key={activity.key} className="flex items-center gap-2">
                                      <input 
                                        type="checkbox" 
                                        checked={!!accessed} 
                                        readOnly
                                        className="w-4 h-4 rounded border-2 border-slate-600 bg-slate-800 checked:bg-purple-500 checked:border-purple-500"
                                      />
                                      <span className="text-xs text-slate-300">{activity.name}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
        </div>
      </>
    );
  }

  if (view === 'strategy-suite') return (
    <div className="max-w-[95%] w-full p-12 animate-fadeIn text-left">
      <div className="executive-header mb-10">
        <h2 className="executive-font text-4xl font-bold text-white mb-2 tracking-tight">Learning Lab</h2>
        <p className="text-slate-400 text-lg">Explore PMP knowledge domains and tasks</p>
      </div>
      <div className="grid grid-cols-3 gap-8">
        {Object.entries(domainMap).map(([d, tasks]) => (
          <div key={d} className="glass-card p-6 border-t-4 border-blue-500/50">
            <h3 className="executive-font text-blue-400 mb-6 uppercase text-sm font-bold tracking-widest">{d}</h3>
            <div className="space-y-1 h-[450px] overflow-y-auto pr-2 custom-scrollbar">
              {tasks.map(t => {
                const mastery = getTaskMastery(t);
                const progressBars = '■'.repeat(mastery.completed) + '□'.repeat(mastery.total - mastery.completed);
                const colorClass = mastery.color === 'slate' ? 'text-slate-500' : mastery.color === 'yellow' ? 'text-yellow-500' : mastery.color === 'orange' ? 'text-orange-500' : 'text-emerald-500';
                
                return (
                  <button 
                    key={t} 
                    onClick={() => { setSelectedTask(t); setView('task-interstitial'); }} 
                    className="task-btn relative"
                  >
                    <div className="flex items-center justify-between">
                      <span>{t}</span>
                      {mastery.completed > 0 && (
                        <span className={`text-xs font-mono ${colorClass}`} title={mastery.label}>
                          {progressBars}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <GlobalNavFooter />
    </div>
  );

  if (view === 'task-interstitial') return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-12 animate-fadeIn text-left">
      <div className="max-w-5xl w-full p-16 glass-card border-white/10 shadow-2xl">
          <h1 className="executive-font text-5xl font-bold text-white mb-16 tracking-tight text-center">{selectedTask}</h1>
          <div className="grid grid-cols-2 gap-8 text-center">
              <button onClick={() => setView('learn-hub')} className="executive-btn p-16 border-blue-500/30 hover:bg-blue-500/10 transition-all">
                <h3 className="executive-font text-4xl text-blue-400 font-bold mb-3">Learn</h3>
                <p className="text-slate-400 text-sm">Explore concepts and strategies</p>
              </button>
              <button onClick={() => setView('practice-hub')} className="executive-btn p-16 border-purple-500/30 hover:bg-purple-500/10 transition-all">
                <h3 className="executive-font text-4xl text-purple-400 font-bold mb-3">Practice Hub</h3>
                <p className="text-slate-400 text-sm">Practice with exercises and quizzes</p>
              </button>
          </div>
          <GlobalNavFooter />
      </div>
    </div>
  );

  // Practice Hub View
  if (view === 'practice-hub') return (
    <div className="max-w-7xl w-full p-10 animate-fadeIn text-left">
      {/* Header with Back Button */}
      <header className="mb-10">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => setView('task-interstitial')}
            className="px-4 py-2 executive-font text-xs text-slate-400 hover:text-white uppercase font-semibold transition-colors flex items-center gap-2"
          >
            ← Back
          </button>
          </div>
        <h1 className="executive-font text-5xl font-bold text-white mb-2 tracking-tight">Practice Hub: {selectedTask}</h1>
      </header>
      
      {/* Activity Cards Grid - 3x2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {(() => {
          // Base activity configuration
          const baseActivities = [
            { name: 'pm-simulator', emoji: '🎯', title: 'PM Simulator', desc: 'Branching scenarios with consequences', color: 'blue', borderColor: 'border-blue-500', hoverColor: 'hover:bg-blue-500/10', shadowColor: 'hover:shadow-blue-500/20' },
            { name: 'lightning-round', emoji: '⚡', title: 'Lightning Round', desc: 'Fast-paced quiz - 10 questions', color: 'yellow', borderColor: 'border-yellow-500', hoverColor: 'hover:bg-yellow-500/10', shadowColor: 'hover:shadow-yellow-500/20' },
            { name: 'document-detective', emoji: '🕵️', title: 'Document Detective', desc: 'Match documents to scenarios', color: 'purple', borderColor: 'border-purple-500', hoverColor: 'hover:bg-purple-500/10', shadowColor: 'hover:shadow-purple-500/20' },
            { name: 'conflict-matcher', emoji: '🧩', title: 'Conflict Mode Matcher', desc: 'Drag-drop conflict modes', color: 'emerald', borderColor: 'border-emerald-500', hoverColor: 'hover:bg-emerald-500/10', shadowColor: 'hover:shadow-emerald-500/20' },
            { name: 'timeline-reconstructor', emoji: '📋', title: 'Timeline Reconstructor', desc: 'Order resolution steps', color: 'cyan', borderColor: 'border-cyan-500', hoverColor: 'hover:bg-cyan-500/10', shadowColor: 'hover:shadow-cyan-500/20' },
            { name: 'empathy-exercise', emoji: '👥', title: (selectedTask === 'Lead a Team' || selectedTask === 'Support Performance') ? 'Team Member Perspectives' : 'Empathy Exercise', desc: 'See all perspectives', color: 'rose', borderColor: 'border-rose-500', hoverColor: 'hover:bg-rose-500/10', shadowColor: 'hover:shadow-rose-500/20' }
          ];
          
          // For Lead a Team, rename specific activities
          if (selectedTask === 'Lead a Team') {
            return baseActivities.map(activity => {
              if (activity.name === 'conflict-matcher') {
                return { ...activity, title: 'Leadership Style Matcher', desc: 'Match scenarios to leadership styles' };
              } else if (activity.name === 'timeline-reconstructor') {
                // Keep name as Timeline Reconstructor (content is adapted, but name stays consistent)
                return { ...activity, title: 'Timeline Reconstructor', desc: 'Order team development events' };
              } else if (activity.name === 'empathy-exercise') {
                return { ...activity, title: 'Team Member Perspectives', desc: 'See team member viewpoints' };
              }
              return activity;
            });
          }
          
          // For Support Performance, rename specific activities
          if (selectedTask === 'Support Performance') {
            return baseActivities.map(activity => {
              if (activity.name === 'conflict-matcher') {
                return { ...activity, title: 'Feedback Type Matcher', desc: 'Match situations to feedback approaches' };
              } else if (activity.name === 'empathy-exercise') {
                return { ...activity, title: 'Team Member Perspectives', desc: 'Experience feedback from receiving end' };
              }
              return activity;
            });
          }
          
          return baseActivities;
        })().map(activity => {
          const progress = getActivityProgress(selectedTask, activity.name);
          const isCompleted = progress?.completed;
          const isInProgress = progress?.attempts > 0 && !isCompleted;
          const bestScore = progress?.bestScore;
          const lastAttempted = progress?.lastAttempted;
          const completedDate = progress?.completedAt;
          
          // Determine status indicator
          let statusIndicator = null;
          let statusTooltip = '';
          if (isCompleted) {
            statusTooltip = `✓ Completed on ${completedDate ? new Date(completedDate).toLocaleDateString() : 'recently'}`;
          } else if (isInProgress) {
            statusTooltip = '– In progress';
          } else {
            statusTooltip = '○ Not started yet';
          }
          
          return (
            <button
              key={activity.name}
              onClick={() => setView(activity.name)}
              className={`glass-card p-8 text-left ${activity.hoverColor} transition-all ${isCompleted ? 'border-l-4 border-emerald-500' : activity.borderColor} min-h-[200px] transform hover:scale-105 hover:shadow-2xl ${activity.shadowColor} relative group`}
            >
              {/* Status Indicator */}
              <div 
                className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  isCompleted 
                    ? 'bg-emerald-500 text-white' 
                    : isInProgress 
                    ? 'bg-yellow-500 text-white' 
                    : 'border-2 border-slate-500 bg-transparent'
                }`}
                title={statusTooltip}
              >
                {isCompleted ? (
                  <span className="text-lg font-bold">✓</span>
                ) : isInProgress ? (
                  <span className="text-lg font-bold">–</span>
                ) : (
                  <span className="w-3 h-3 rounded-full border-2 border-slate-400"></span>
                )}
            </div>
              
              {/* Tooltip */}
              <div className="absolute top-12 right-4 bg-slate-900 text-white text-xs px-3 py-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                {statusTooltip}
              </div>
              
              <div className="text-6xl mb-4">{activity.emoji}</div>
              <h3 className="executive-font text-2xl font-semibold text-white mb-3">{activity.title}</h3>
              <p className="text-slate-400 text-sm mb-2">{activity.desc}</p>
              {isCompleted && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  {bestScore > 0 && (
                    <p className="text-emerald-400 text-xs font-semibold mb-1">Best: {bestScore.toLocaleString()} pts</p>
                  )}
                  {lastAttempted && (
                    <p className="text-slate-500 text-xs">Last: {new Date(lastAttempted).toLocaleDateString()}</p>
          )}
      </div>
              )}
            </button>
          );
        })}
      </div>

      <GlobalNavFooter />
    </div>
  );

  // Progress Stats View
  if (view === 'progress-stats') {
    const allTasks = domainMap ? Object.values(domainMap).flat().filter(Boolean) : [];
    const totalTasks = allTasks.length;
    const totalActivities = totalTasks * 6;
    
    // Intersection Observer for fade-in animation
    const [masteryCardsVisible, setMasteryCardsVisible] = useState(false);
    const masterySectionRef = useRef(null);
    
    useEffect(() => {
      if (!masterySectionRef.current || masteryCardsVisible) return;
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setMasteryCardsVisible(true);
            }
          });
        },
        { threshold: 0.1 }
      );
      
      observer.observe(masterySectionRef.current);
      
      return () => {
        if (masterySectionRef.current) {
          observer.unobserve(masterySectionRef.current);
        }
      };
    }, [masteryCardsVisible]);
    
    // Calculate overall stats
    let tasksStarted = 0;
    let activitiesCompleted = 0;
    const activityTypeScores = {
      'pm-simulator': [],
      'lightning-round': [],
      'document-detective': [],
      'conflict-matcher': [],
      'timeline-reconstructor': [],
      'empathy-exercise': []
    };
    
    allTasks.forEach(taskName => {
      const taskActivities = progressData.completedActivities[taskName] || {};
      const taskScores = progressData.activityScores[taskName] || {};
      
      if (Object.keys(taskActivities).length > 0) {
        tasksStarted++;
      }
      
      Object.keys(taskActivities).forEach(activityName => {
        if (taskActivities[activityName].completed) {
          activitiesCompleted++;
          if (taskScores[activityName] && activityTypeScores[activityName]) {
            activityTypeScores[activityName].push(...taskScores[activityName].map(s => s.score));
          }
        }
      });
    });
    
    // Calculate average scores
    const avgScores = Object.keys(activityTypeScores).map(activityName => {
      const scores = activityTypeScores[activityName];
      const avg = scores.length > 0 ? scores.reduce((sum, s) => sum + s, 0) / scores.length : 0;
      return { activityName, avg, attempts: scores.length };
    });
    
    // Find tasks that need more activities
    const recommendations = allTasks.filter(taskName => {
      const taskActivities = progressData.completedActivities[taskName] || {};
      const completedCount = Object.keys(taskActivities).filter(a => taskActivities[a].completed).length;
      return completedCount > 0 && completedCount < 6;
    }).slice(0, 5);
    
    return (
      <div className="max-w-7xl w-full p-10 animate-fadeIn text-left">
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => setView('practice-hub')}
              className="px-4 py-2 executive-font text-xs text-slate-400 hover:text-white uppercase font-semibold transition-colors flex items-center gap-2"
            >
              ← Back
            </button>
          </div>
          <h1 className="executive-font text-5xl font-bold text-white tracking-tight">📊 Progress Statistics</h1>
          <p className="text-slate-400 text-lg mt-2">Basic completion tracking and task mastery overview</p>
          <div className="mt-4 glass-card p-4 bg-purple-500/10 border-l-4 border-purple-500">
            <p className="text-sm text-slate-300">
              <span className="font-semibold text-white">Note:</span> This view shows basic completion status. 
              For detailed analytics with scores, times, and trends, see <button onClick={() => setView('personal-stats')} className="text-purple-400 hover:text-purple-300 underline ml-1">Personal Statistics</button>.
            </p>
          </div>
        </header>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card p-6 border-l-4 border-blue-500">
            <div className="text-sm text-slate-400 uppercase mb-2">Tasks Started</div>
            <div className="text-4xl font-bold text-white">{tasksStarted}/{totalTasks}</div>
            <div className="text-xs text-slate-500 mt-2">{Math.round((tasksStarted / totalTasks) * 100)}%</div>
          </div>
          <div className="glass-card p-6 border-l-4 border-purple-500">
            <div className="text-sm text-slate-400 uppercase mb-2">Activities Completed</div>
            <div className="text-4xl font-bold text-white">{activitiesCompleted}/{totalActivities}</div>
            <div className="text-xs text-slate-500 mt-2">{Math.round((activitiesCompleted / totalActivities) * 100)}%</div>
          </div>
          <div className="glass-card p-6 border-l-4 border-emerald-500">
            <div className="text-sm text-slate-400 uppercase mb-2">Tasks Mastered</div>
            <div className="text-4xl font-bold text-white">
              {allTasks.filter(t => getTaskMastery(t).level === 'mastered').length}
            </div>
            <div className="text-xs text-slate-500 mt-2">All 6 activities completed</div>
          </div>
        </div>

        {/* Average Scores */}
        <div className="glass-card p-6 mb-6">
          <h2 className="executive-font text-2xl font-bold text-white mb-4">Average Scores by Activity Type</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {avgScores.map(({ activityName, avg, attempts }) => {
              const activityLabels = {
                'pm-simulator': 'PM Simulator',
                'lightning-round': 'Lightning Round',
                'document-detective': 'Document Detective',
                'conflict-matcher': 'Conflict Matcher',
                'timeline-reconstructor': 'Timeline Reconstructor',
                'empathy-exercise': (selectedTask === 'Lead a Team' || selectedTask === 'Support Performance') ? 'Team Member Perspectives' : 'Empathy Exercise'
              };
              
              return (
                <div key={activityName} className="glass-card p-4 bg-slate-800/30">
                  <div className="text-sm text-slate-400 mb-1">{activityLabels[activityName]}</div>
                  <div className="text-2xl font-bold text-white">{Math.round(avg).toLocaleString()}</div>
                  <div className="text-xs text-slate-500">{attempts} attempts</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="glass-card p-6 mb-6 border-l-4 border-orange-500">
            <h2 className="executive-font text-2xl font-bold text-white mb-4">📋 Recommendations</h2>
            <p className="text-slate-300 mb-4">Tasks where you've started but haven't completed all activities:</p>
            <div className="space-y-2">
              {recommendations.map(taskName => {
                const mastery = getTaskMastery(taskName);
                return (
                  <div key={taskName} className="flex items-center justify-between p-3 bg-slate-800/30 rounded">
                    <span className="text-white font-semibold">{taskName}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-400">{mastery.completed}/6 activities</span>
                      <button
                        onClick={() => {
                          setSelectedTask(taskName);
                          setView('practice-hub');
                        }}
                        className="text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                      >
                        Practice →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Task Mastery Overview */}
        <div className="glass-card p-6" ref={masterySectionRef}>
          <h2 className="executive-font text-2xl font-bold text-white mb-4">Task Mastery Overview</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
            {allTasks.map((taskName, index) => {
              const mastery = getTaskMastery(taskName);
              const progressBars = '■'.repeat(mastery.completed) + '□'.repeat(mastery.total - mastery.completed);
              const colorClass = mastery.color === 'slate' ? 'text-slate-500' : mastery.color === 'yellow' ? 'text-yellow-500' : mastery.color === 'orange' ? 'text-orange-500' : 'text-emerald-500';
              
              // Get first activity name
              const activities = ['pm-simulator', 'lightning-round', 'document-detective', 'conflict-matcher', 'timeline-reconstructor', 'empathy-exercise'];
              const activityLabels = {
                'pm-simulator': 'PM Simulator',
                'lightning-round': 'Lightning Round',
                'document-detective': 'Document Detective',
                'conflict-matcher': taskName === 'Lead a Team' ? 'Leadership Style Matcher' : 'Conflict Mode Matcher',
                'timeline-reconstructor': 'Timeline Reconstructor',
                'empathy-exercise': taskName === 'Lead a Team' ? 'Team Member Perspectives' : 'Empathy Exercise'
              };
              const firstActivity = activityLabels[activities[0]] || 'PM Simulator';
              
              // Generate badge name
              const badgeNames = {
                'Manage Conflict': 'Conflict Navigator',
                'Lead a Team': 'Team Leader',
                'Support Performance': 'Performance Champion',
                'Empower Team': 'Empowerment Expert',
                'Train Team': 'Training Master',
                'Build Team': 'Team Builder',
                'Address Obstacles': 'Obstacle Remover',
                'Negotiate Agreements': 'Negotiation Pro',
                'Collaborate Stakeholders': 'Stakeholder Connector',
                'Build Understanding': 'Understanding Builder',
                'Support Virtual Teams': 'Virtual Team Expert',
                'Define Team Ground Rules': 'Rules Architect',
                'Mentor Stakeholders': 'Mentor Master',
                'Promote Performance': 'Performance Promoter'
              };
              const badgeName = badgeNames[taskName] || taskName.split(' ')[0] + ' Master';
              
              return (
                <div 
                  key={taskName} 
                  className={`task-mastery-card task-mastery-card-fade-in flex flex-col items-start justify-between p-3 bg-slate-800/30 rounded relative ${masteryCardsVisible ? 'visible' : ''}`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-white relative z-10">{taskName}</span>
                    <div className="flex items-center gap-3 relative z-10">
                      <span className={`text-sm font-mono ${colorClass}`}>{progressBars}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        mastery.color === 'slate' ? 'bg-slate-700 text-slate-300' :
                        mastery.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400' :
                        mastery.color === 'orange' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {mastery.label}
                      </span>
                    </div>
                  </div>
                  
                  {/* Hover Reveal Preview */}
                  <div className="task-mastery-preview w-full">
                    <div className="text-xs text-slate-400 mb-1">
                      Start with: <span className="text-white font-semibold">{firstActivity}</span>
                    </div>
                    <div className="text-xs text-slate-400">
                      🏆 Earn: <span className="text-amber-400 font-semibold">{badgeName} Badge</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <GlobalNavFooter />
      </div>
    );
  }

  // Personal Stats View with Comprehensive Analytics
  if (view === 'personal-stats') {
    let scoreData;
    try {
      scoreData = getScoreData();
      // Ensure scoreData has required structure
      if (!scoreData || typeof scoreData !== 'object') {
        scoreData = {
          scores: {},
          totalActivitiesCompleted: 0,
          totalTimeSpent: 0,
          lastActive: new Date().toISOString()
        };
      }
      if (!scoreData.scores || typeof scoreData.scores !== 'object') {
        scoreData.scores = {};
      }
    } catch (e) {
      console.error('Error initializing score data:', e);
      scoreData = {
        scores: {},
        totalActivitiesCompleted: 0,
        totalTimeSpent: 0,
        lastActive: new Date().toISOString()
      };
    }
    
    const allTasks = domainMap ? Object.values(domainMap).flat().filter(Boolean) : [];
    
    // Calculate study streak
    const calculateStreak = () => {
      if (!scoreData.lastActive) return 0;
      const lastActive = new Date(scoreData.lastActive);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      lastActive.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));
      return diffDays === 0 ? 1 : 0; // Simple: 1 if active today, 0 otherwise
    };

    const studyStreak = calculateStreak();
    const totalTimeHours = Math.floor((scoreData.totalTimeSpent || 0) / 3600);
    const totalTimeMinutes = Math.floor(((scoreData.totalTimeSpent || 0) % 3600) / 60);

    // Activity type statistics
    const activityStats = {
      'lightning-round': { attempts: [], bestScore: 0, bestAccuracy: 0, avgTime: 0 },
      'pm-simulator': { attempts: [], bestScore: 0, successRate: 0 },
      'document-detective': { attempts: [], bestCompletion: 0 },
      'conflict-matcher': { attempts: [], avgScore: 0, perfectMatches: 0 },
      'leadership-style-matcher': { attempts: [], avgScore: 0, perfectMatches: 0 },
      'timeline-reconstructor': { attempts: [], bestScore: 0, avgAttempts: 0 },
      'empathy-exercise': { attempts: [], scenariosCompleted: 0 },
      'team-member-perspectives': { attempts: [], scenariosCompleted: 0 }
    };

    // Collect stats from all tasks
    try {
      Object.keys(scoreData.scores || {}).forEach(taskName => {
        const taskScores = scoreData.scores[taskName];
        if (!taskScores || typeof taskScores !== 'object') return;
        
        Object.keys(taskScores).forEach(activityName => {
          const activity = taskScores[activityName];
          if (!activity || typeof activity !== 'object') return;
          
          // Map activity names for stats aggregation
          let statsKey = activityName;
          if (activityName === 'leadership-style-matcher') {
            statsKey = 'leadership-style-matcher';
          } else if (activityName === 'team-member-perspectives') {
            statsKey = 'team-member-perspectives';
          }
          
          if (activityStats[statsKey] || activityStats[activityName]) {
            const targetKey = activityStats[statsKey] ? statsKey : activityName;
            if (activityStats[targetKey]) {
              // Safely add attempts
              if (Array.isArray(activity.attempts)) {
                activityStats[targetKey].attempts.push(...activity.attempts);
              }
              if (activity.bestScore && activity.bestScore > activityStats[targetKey].bestScore) {
                activityStats[targetKey].bestScore = activity.bestScore;
              }
              if (activity.bestAccuracy && activity.bestAccuracy > activityStats[targetKey].bestAccuracy) {
                activityStats[targetKey].bestAccuracy = activity.bestAccuracy;
              }
              if (activity.bestCompletion && activity.bestCompletion > activityStats[targetKey].bestCompletion) {
                activityStats[targetKey].bestCompletion = activity.bestCompletion;
              }
            }
          }
        });
      });
    } catch (e) {
      console.error('Error collecting activity stats:', e);
      // Continue with empty stats
    }

    // Calculate Lightning Round stats
    const lrAttempts = activityStats['lightning-round'].attempts;
    if (lrAttempts.length > 0) {
      const accuracies = lrAttempts.filter(a => a.accuracy).map(a => a.accuracy);
      if (accuracies.length > 0) {
        activityStats['lightning-round'].bestAccuracy = Math.max(...accuracies, activityStats['lightning-round'].bestAccuracy);
      }
      const times = lrAttempts.filter(a => a.averageTime).map(a => a.averageTime);
      activityStats['lightning-round'].avgTime = times.length > 0 
        ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) 
        : 0;
    }

    // Calculate PM Simulator stats
    const pmAttempts = activityStats['pm-simulator'].attempts;
    if (pmAttempts.length > 0) {
      const successes = pmAttempts.filter(a => a.outcome === 'success' || a.outcome === 'Mission Complete').length;
      activityStats['pm-simulator'].successRate = Math.round((successes / pmAttempts.length) * 100);
    }

    // Calculate Document Detective stats
    const ddAttempts = activityStats['document-detective'].attempts;
    if (ddAttempts.length > 0) {
      const completions = ddAttempts.filter(a => a.completionRate).map(a => a.completionRate);
      if (completions.length > 0) {
        activityStats['document-detective'].bestCompletion = Math.max(...completions, activityStats['document-detective'].bestCompletion);
      }
    }

    // Calculate Conflict Matcher / Leadership Style Matcher stats
    const cmAttempts = [...activityStats['conflict-matcher'].attempts, ...activityStats['leadership-style-matcher'].attempts];
    if (cmAttempts.length > 0) {
      const avgScore = cmAttempts.reduce((sum, a) => sum + (a.score || 0), 0) / cmAttempts.length;
      const perfectMatches = cmAttempts.filter(a => a.isPerfect).length;
      activityStats['conflict-matcher'].avgScore = Math.round(avgScore);
      activityStats['conflict-matcher'].perfectMatches = perfectMatches;
      activityStats['leadership-style-matcher'].avgScore = Math.round(avgScore);
      activityStats['leadership-style-matcher'].perfectMatches = perfectMatches;
    }

    // Calculate Timeline Reconstructor stats
    const trAttempts = activityStats['timeline-reconstructor'].attempts;
    if (trAttempts.length > 0) {
      const avgAttempts = trAttempts.filter(a => a.attemptsToPerfect).map(a => a.attemptsToPerfect);
      if (avgAttempts.length > 0) {
        activityStats['timeline-reconstructor'].avgAttempts = avgAttempts.reduce((a, b) => a + b, 0) / avgAttempts.length;
      }
    }

    // Calculate Empathy Exercise / Team Member Perspectives stats
    const eeAttempts = [
      ...(activityStats['empathy-exercise']?.attempts || []), 
      ...(activityStats['team-member-perspectives']?.attempts || [])
    ];
    if (eeAttempts.length > 0) {
      const scenariosCompleted = eeAttempts.filter(a => a.scenarioCompleted).length;
      activityStats['empathy-exercise'].scenariosCompleted = scenariosCompleted;
      activityStats['team-member-perspectives'].scenariosCompleted = scenariosCompleted;
    }

    // Task-level statistics - optimized to only process tasks with data
    const taskStats = [];
    
    // Only process tasks that have score data
    try {
      Object.keys(scoreData.scores || {}).forEach(taskName => {
        const taskData = scoreData.scores[taskName];
        if (!taskData || typeof taskData !== 'object') return;
        
        const activities = Object.keys(taskData);
        const totalAttempts = activities.reduce((sum, act) => {
          const actData = taskData[act];
          if (actData && Array.isArray(actData.attempts)) {
            return sum + actData.attempts.length;
          }
          return sum;
        }, 0);
        
        if (totalAttempts === 0) return; // Skip tasks with no attempts
      
        // Calculate mastery from scoreData instead of progressData
        const completedActivities = activities.filter(actName => {
          const act = taskData[actName];
          return act && Array.isArray(act.attempts) && act.attempts.length > 0;
        }).length;
        
        let mastery;
        if (completedActivities === 0) {
          mastery = { level: 'not-started', completed: 0, total: 6, label: 'Not Started', color: 'slate' };
        } else if (completedActivities <= 3) {
          mastery = { level: 'in-progress', completed: completedActivities, total: 6, label: 'In Progress', color: 'yellow' };
        } else if (completedActivities <= 5) {
          mastery = { level: 'advanced', completed: completedActivities, total: 6, label: 'Advanced', color: 'orange' };
        } else {
          mastery = { level: 'mastered', completed: completedActivities, total: 6, label: 'Mastered', color: 'emerald' };
        }
        
        // Find strongest/weakest activity
        let strongest = null, weakest = null;
        activities.forEach(actName => {
          const act = taskData[actName];
          if (act && Array.isArray(act.attempts) && act.attempts.length > 0) {
            const avgScore = act.attempts.reduce((s, a) => s + (a.score || 0), 0) / act.attempts.length;
            if (!strongest || avgScore > strongest.avg) {
              strongest = { name: actName, avg: avgScore };
            }
            if (!weakest || avgScore < weakest.avg) {
              weakest = { name: actName, avg: avgScore };
            }
          }
        });

        // Last practiced date
        let lastPracticed = null;
        activities.forEach(actName => {
          const act = taskData[actName];
          if (act && Array.isArray(act.attempts) && act.attempts.length > 0) {
            const lastAttempt = act.attempts[act.attempts.length - 1];
            if (lastAttempt && lastAttempt.date) {
              try {
                const attemptDate = new Date(lastAttempt.date);
                if (!isNaN(attemptDate.getTime()) && (!lastPracticed || attemptDate > lastPracticed)) {
                  lastPracticed = attemptDate;
                }
              } catch (e) {
                // Invalid date, skip
              }
            }
          }
        });

        taskStats.push({
          taskName,
          totalAttempts,
          mastery,
          strongest,
          weakest,
          lastPracticed
        });
      });
    } catch (e) {
      console.error('Error processing task stats:', e);
      // Continue with empty taskStats
    }

    // Recommendations
    const recommendations = [];
    const now = new Date();
    taskStats.forEach(task => {
      if (task.lastPracticed) {
        const daysSince = Math.floor((now - task.lastPracticed) / (1000 * 60 * 60 * 24));
        if (daysSince >= 5) {
          recommendations.push(`You haven't practiced ${task.taskName} in ${daysSince} days`);
        }
      }
    });

    // Export function
    const exportProgress = () => {
      const dataStr = JSON.stringify(scoreData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pmp-prep-progress-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };

    return (
      <div className="max-w-7xl w-full p-10 animate-fadeIn text-left">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={() => setView('practice-hub')}
              className="px-4 py-2 executive-font text-xs text-slate-400 hover:text-white uppercase font-semibold transition-colors flex items-center gap-2"
            >
              ← Back
            </button>
            <button
              onClick={exportProgress}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors executive-font text-sm"
            >
              📥 Export Progress
            </button>
          </div>
          <h1 className="executive-font text-5xl font-bold text-white tracking-tight mb-2">📊 Personal Statistics</h1>
          <p className="text-slate-400 text-lg">Comprehensive performance analytics and insights</p>
          <div className="mt-4 glass-card p-4 bg-blue-500/10 border-l-4 border-blue-500">
            <p className="text-sm text-slate-300">
              <span className="font-semibold text-white">Note:</span> This view shows detailed analytics from comprehensive score tracking (scores, times, accuracy, trends). 
              For basic completion tracking, see <button onClick={() => setView('progress-stats')} className="text-blue-400 hover:text-blue-300 underline ml-1">Progress Statistics</button>.
            </p>
          </div>
        </header>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-card p-6 border-l-4 border-blue-500">
            <div className="text-sm text-slate-400 uppercase mb-2">Total Time</div>
            <div className="text-3xl font-bold text-white">
              {totalTimeHours}h {totalTimeMinutes}m
            </div>
            <div className="text-xs text-slate-500 mt-2">Time invested</div>
          </div>
          <div className="glass-card p-6 border-l-4 border-purple-500">
            <div className="text-sm text-slate-400 uppercase mb-2">Activities Completed</div>
            <div className="text-3xl font-bold text-white">{scoreData.totalActivitiesCompleted || 0}</div>
            <div className="text-xs text-slate-500 mt-2">Total attempts</div>
          </div>
          <div className="glass-card p-6 border-l-4 border-emerald-500">
            <div className="text-sm text-slate-400 uppercase mb-2">Tasks Mastered</div>
            <div className="text-3xl font-bold text-white">
              {taskStats.filter(t => t.mastery.level === 'mastered').length}
            </div>
            <div className="text-xs text-slate-500 mt-2">All activities complete</div>
          </div>
          <div className="glass-card p-6 border-l-4 border-yellow-500">
            <div className="text-sm text-slate-400 uppercase mb-2">Study Streak</div>
            <div className="text-3xl font-bold text-white">{studyStreak}</div>
            <div className="text-xs text-slate-500 mt-2">Days in a row</div>
          </div>
        </div>

        {/* Per Activity Type Stats */}
        <div className="glass-card p-6 mb-6">
          <h2 className="executive-font text-2xl font-bold text-white mb-4">Activity Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Lightning Round */}
            {activityStats['lightning-round'].attempts.length > 0 && (
              <div className="glass-card p-4 bg-slate-800/30 border-l-4 border-yellow-500">
                <h3 className="text-white font-semibold mb-3">⚡ Lightning Round</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Best Score:</span>
                    <span className="text-white font-semibold">{activityStats['lightning-round'].bestScore.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Best Accuracy:</span>
                    <span className="text-emerald-400 font-semibold">{activityStats['lightning-round'].bestAccuracy}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Avg Time:</span>
                    <span className="text-white">{activityStats['lightning-round'].avgTime}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Attempts:</span>
                    <span className="text-slate-300">{activityStats['lightning-round'].attempts.length}</span>
                  </div>
                </div>
              </div>
            )}

            {/* PM Simulator */}
            {activityStats['pm-simulator'].attempts.length > 0 && (
              <div className="glass-card p-4 bg-slate-800/30 border-l-4 border-blue-500">
                <h3 className="text-white font-semibold mb-3">🎯 PM Simulator</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Best Score:</span>
                    <span className="text-white font-semibold">{activityStats['pm-simulator'].bestScore}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Success Rate:</span>
                    <span className="text-emerald-400 font-semibold">{activityStats['pm-simulator'].successRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Attempts:</span>
                    <span className="text-slate-300">{activityStats['pm-simulator'].attempts.length}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Document Detective */}
            {activityStats['document-detective'].attempts.length > 0 && (
              <div className="glass-card p-4 bg-slate-800/30 border-l-4 border-purple-500">
                <h3 className="text-white font-semibold mb-3">🕵️ Document Detective</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Best Completion:</span>
                    <span className="text-white font-semibold">{activityStats['document-detective'].bestCompletion}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Attempts:</span>
                    <span className="text-slate-300">{activityStats['document-detective'].attempts.length}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Conflict Matcher */}
            {activityStats['conflict-matcher'].attempts.length > 0 && (
              <div className="glass-card p-4 bg-slate-800/30 border-l-4 border-emerald-500">
                <h3 className="text-white font-semibold mb-3">🧩 Conflict Matcher</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Avg Score:</span>
                    <span className="text-white font-semibold">{Math.round(activityStats['conflict-matcher'].avgScore)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Perfect Matches:</span>
                    <span className="text-emerald-400 font-semibold">{activityStats['conflict-matcher'].perfectMatches}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Attempts:</span>
                    <span className="text-slate-300">{activityStats['conflict-matcher'].attempts.length}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Timeline Reconstructor */}
            {activityStats['timeline-reconstructor'].attempts.length > 0 && (
              <div className="glass-card p-4 bg-slate-800/30 border-l-4 border-cyan-500">
                <h3 className="text-white font-semibold mb-3">📋 Timeline Reconstructor</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Best Score:</span>
                    <span className="text-white font-semibold">{activityStats['timeline-reconstructor'].bestScore}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Avg Attempts:</span>
                    <span className="text-white">{activityStats['timeline-reconstructor'].avgAttempts.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Attempts:</span>
                    <span className="text-slate-300">{activityStats['timeline-reconstructor'].attempts.length}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Empathy Exercise / Team Member Perspectives */}
            {(activityStats['empathy-exercise'].scenariosCompleted > 0 || activityStats['team-member-perspectives'].scenariosCompleted > 0) && (
              <div className="glass-card p-4 bg-slate-800/30 border-l-4 border-rose-500">
                <h3 className="text-white font-semibold mb-3">👥 Empathy/Team Perspectives</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Scenarios:</span>
                    <span className="text-white font-semibold">{activityStats['empathy-exercise'].scenariosCompleted + activityStats['team-member-perspectives'].scenariosCompleted}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Task-Level Statistics */}
        {taskStats.length > 0 && (
          <div className="glass-card p-6 mb-6">
            <h2 className="executive-font text-2xl font-bold text-white mb-4">Task Performance</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
              {taskStats.map(task => (
                <div key={task.taskName} className="glass-card p-4 bg-slate-800/30 border-l-4 border-blue-500">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-white font-semibold text-lg mb-1">{task.taskName}</h3>
                      <div className="flex items-center gap-3 text-sm">
                        <span className={`px-2 py-1 rounded text-xs ${
                          task.mastery.color === 'slate' ? 'bg-slate-700 text-slate-300' :
                          task.mastery.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400' :
                          task.mastery.color === 'orange' ? 'bg-orange-500/20 text-orange-400' :
                          'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {task.mastery.label}
                        </span>
                        <span className="text-slate-400">{task.totalAttempts} attempts</span>
                      </div>
                    </div>
                    {task.lastPracticed && (
                      <span className="text-xs text-slate-500">
                        Last: {task.lastPracticed.toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                    {task.strongest && (
                      <div>
                        <span className="text-slate-400">Strongest: </span>
                        <span className="text-emerald-400 font-semibold">{task.strongest.name.replace(/-/g, ' ')}</span>
                      </div>
                    )}
                    {task.weakest && (
                      <div>
                        <span className="text-slate-400">Needs Practice: </span>
                        <span className="text-yellow-400 font-semibold">{task.weakest.name.replace(/-/g, ' ')}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="glass-card p-6 mb-6 border-l-4 border-orange-500">
            <h2 className="executive-font text-2xl font-bold text-white mb-4">💡 Recommendations</h2>
            <div className="space-y-2">
              {recommendations.map((rec, idx) => (
                <div key={idx} className="text-slate-300 p-3 bg-slate-800/30 rounded">
                  {rec}
                </div>
              ))}
            </div>
          </div>
        )}

        <GlobalNavFooter />
      </div>
    );
  }

  // Helper function to render markdown content as HTML
  const renderMarkdown = (markdown) => {
    if (!markdown) return <div className="text-slate-400">Loading content...</div>;
    
    // Simple markdown to HTML conversion (basic support)
    let html = markdown
      // Headers
      .replace(/^# (.+)$/gm, '<h1 class="executive-font text-3xl font-bold text-white mb-4 mt-8">$1</h1>')
      .replace(/^## (.+)$/gm, '<h2 class="executive-font text-2xl font-semibold text-white mb-3 mt-6">$1</h2>')
      .replace(/^### (.+)$/gm, '<h3 class="executive-font text-xl font-semibold text-white mb-2 mt-4">$1</h3>')
      .replace(/^#### (.+)$/gm, '<h4 class="executive-font text-lg font-semibold text-white mb-2 mt-3">$1</h4>')
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
      // Lists
      .replace(/^\- (.+)$/gm, '<li class="text-slate-300 mb-2 ml-4">• $1</li>')
      .replace(/^\d+\. (.+)$/gm, '<li class="text-slate-300 mb-2 ml-4">$1</li>')
      // Code blocks
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-slate-900 p-4 rounded my-4 overflow-x-auto"><code class="text-slate-300 text-sm">$1</code></pre>')
      // Inline code
      .replace(/`(.+?)`/g, '<code class="bg-slate-800 px-1 py-0.5 rounded text-cyan-400 text-sm">$1</code>')
      // Links
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-cyan-400 hover:text-cyan-300 underline">$1</a>')
      // Horizontal rules
      .replace(/^---$/gm, '<hr class="border-white/10 my-6" />')
      // Paragraphs
      .split('\n\n')
      .map(para => {
        if (para.trim().startsWith('<') || para.trim() === '') return para;
        return `<p class="text-slate-300 leading-relaxed mb-4">${para.trim()}</p>`;
      })
      .join('\n');
    
    return <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />;
  };

  // Helper function to get all 35 tasks
  const getAllTasks = () => {
    return [
      ...domainMap["People Domain"],
      ...domainMap["Process Domain"],
      ...domainMap["Business Domain"]
    ];
  };

  // Helper function to toggle section expansion
  const toggleSectionExpansion = (sectionKey) => {
    setExpandedLearningSections(prev => {
      const currentSubView = prev[subView] || {};
      const currentValue = currentSubView[sectionKey] || false;
      return {
        ...prev,
        [subView]: {
          ...currentSubView,
          [sectionKey]: !currentValue
        }
      };
    });
  };

  // Helper function to get all content sections for current task and subView
  const getContentSections = () => {
    if (!currentTask || !currentTask.learn) return [];
    
    const sections = [];
    
    if (subView === 'overview' && currentTask.learn.overview) {
      const overview = currentTask.learn.overview;
      if (overview.definition) sections.push({ key: 'definition', title: 'Definition', content: overview.definition, type: 'definition' });
      if (overview.eco_enablers && overview.eco_enablers.length > 0) sections.push({ key: 'eco_enablers', title: 'ECO Enablers', content: overview.eco_enablers, type: 'list' });
      if (overview.core_principle) sections.push({ key: 'core_principle', title: 'Core Principle', content: overview.core_principle, type: 'text' });
      if (overview.module_introduction) sections.push({ key: 'module_introduction', title: 'Module Introduction', content: overview.module_introduction, type: 'text' });
      if (overview.key_frameworks) sections.push({ key: 'key_frameworks', title: 'Key Frameworks', content: overview.key_frameworks, type: 'key-frameworks' });
      if (overview.what_youll_learn && overview.what_youll_learn.length > 0) sections.push({ key: 'what_youll_learn', title: "What You'll Learn", content: overview.what_youll_learn, type: 'list' });
      if (overview.key_learning_objectives && overview.key_learning_objectives.length > 0) sections.push({ key: 'key_learning_objectives', title: 'Key Learning Objectives', content: overview.key_learning_objectives, type: 'numbered-list' });
      if (overview.why_this_matters) sections.push({ key: 'why_this_matters', title: 'Why This Matters', content: overview.why_this_matters, type: 'text' });
      if (overview.exam_triggers && overview.exam_triggers.length > 0) sections.push({ key: 'exam_triggers', title: 'Exam Triggers', content: overview.exam_triggers, type: 'list' });
      if (overview.performance_management_framework) sections.push({ key: 'performance_management_framework', title: 'Performance Management Framework', content: overview.performance_management_framework, type: 'performance-framework' });
      if (overview.sbi_examples) sections.push({ key: 'sbi_examples', title: 'SBI Feedback Examples', content: overview.sbi_examples, type: 'sbi-examples' });
      if (overview.recognition_best_practices) sections.push({ key: 'recognition_best_practices', title: 'Recognition Best Practices', content: overview.recognition_best_practices, type: 'recognition-practices' });
      if (overview.quick_scenarios && overview.quick_scenarios.length > 0) sections.push({ key: 'quick_scenarios', title: 'Quick Scenarios', content: overview.quick_scenarios, type: 'scenarios' });
      if (overview.key_exam_principles) sections.push({ key: 'key_exam_principles', title: 'Key Exam Principles', content: overview.key_exam_principles, type: 'exam-principles' });
      if (overview.common_wrong_answers && overview.common_wrong_answers.length > 0) sections.push({ key: 'common_wrong_answers', title: 'Common Wrong Answers', content: overview.common_wrong_answers, type: 'list' });
      if (overview.pmi_hierarchy && overview.pmi_hierarchy.length > 0) sections.push({ key: 'pmi_hierarchy', title: 'PMI Hierarchy', content: overview.pmi_hierarchy, type: 'hierarchy' });
    } else if (subView === 'pmp-application' && currentTask.learn.pmp_application) {
      const pmp = currentTask.learn.pmp_application;
      if (pmp.connection_to_pmp) sections.push({ key: 'connection_to_pmp', title: 'Connection to PMP Certification', content: pmp.connection_to_pmp, domain: pmp.domain, type: 'text' });
      if (pmp.related_tasks && pmp.related_tasks.length > 0) sections.push({ key: 'related_tasks', title: 'Related PMP Tasks', content: pmp.related_tasks, type: 'related-tasks' });
      if (pmp.exam_strategy) sections.push({ key: 'exam_strategy', title: 'Exam Strategy', content: pmp.exam_strategy, type: 'text' });
      if (pmp.how_module_supports_pmp_application && pmp.how_module_supports_pmp_application.length > 0) sections.push({ key: 'how_module_supports_pmp_application', title: 'How This Module Supports Your PMP Application', content: pmp.how_module_supports_pmp_application, type: 'numbered-list' });
      if (pmp.application_tips && pmp.application_tips.length > 0) sections.push({ key: 'application_tips', title: 'Application Tips', content: pmp.application_tips, type: 'list' });
      if (pmp.question_patterns && pmp.question_patterns.length > 0) sections.push({ key: 'question_patterns', title: 'Question Patterns', content: pmp.question_patterns, type: 'question-patterns' });
      if (pmp.agile_vs_traditional) sections.push({ key: 'agile_vs_traditional', title: 'Agile vs Traditional', content: pmp.agile_vs_traditional, type: 'agile-vs-traditional' });
      if (pmp.decision_tree_visual) sections.push({ key: 'decision_tree_visual', title: 'Decision Tree', content: pmp.decision_tree_visual, type: 'text' });
    } else if (subView === 'deep-dive' && currentTask.learn.deep_dive) {
      const deep = currentTask.learn.deep_dive;
      if (deep.introduction) sections.push({ key: 'introduction', title: 'Introduction', content: deep.introduction, type: 'text' });
      if (deep.foundational_concept) sections.push({ key: 'foundational_concept', title: 'Foundational Concept', content: deep.foundational_concept, type: 'text' });
      if (deep.performance_support_framework) sections.push({ key: 'performance_support_framework', title: 'The Performance Support Framework', content: deep.performance_support_framework, type: 'performance-support-framework' });
      if (deep.sbi_feedback_model) sections.push({ key: 'sbi_feedback_model', title: 'The SBI Feedback Model', content: deep.sbi_feedback_model, type: 'sbi-feedback-model' });
      if (deep.recognition_strategies) sections.push({ key: 'recognition_strategies', title: 'Recognition Strategies', content: deep.recognition_strategies, type: 'recognition-strategies' });
      if (deep.addressing_underperformance) sections.push({ key: 'addressing_underperformance', title: 'Addressing Underperformance', content: deep.addressing_underperformance, type: 'addressing-underperformance' });
      if (deep.development_and_growth) sections.push({ key: 'development_and_growth', title: 'Development and Growth', content: deep.development_and_growth, type: 'development-growth' });
      if (deep.performance_metrics) sections.push({ key: 'performance_metrics', title: 'Performance Metrics', content: deep.performance_metrics, type: 'performance-metrics' });
      if (deep.integration_with_other_tasks) sections.push({ key: 'integration_with_other_tasks', title: 'Integration with Other Tasks', content: deep.integration_with_other_tasks, type: 'integration-tasks' });
      if (deep.key_principles && deep.key_principles.length > 0) sections.push({ key: 'key_principles', title: 'Summary: Key Principles', content: deep.key_principles, type: 'numbered-list' });
      if (deep.tuckmans_model) sections.push({ key: 'tuckmans_model', title: "Tuckman's Model", content: deep.tuckmans_model, type: 'tuckman' });
      if (deep.leadership_styles) sections.push({ key: 'leadership_styles', title: 'Leadership Styles', content: deep.leadership_styles, type: 'leadership-styles' });
      if (deep.situational_leadership) sections.push({ key: 'situational_leadership', title: 'Situational Leadership', content: deep.situational_leadership, type: 'situational-leadership' });
      if (deep.practical_application) sections.push({ key: 'practical_application', title: 'Practical Application', content: deep.practical_application, type: 'practical-application' });
      if (deep.summary_and_key_takeaways) sections.push({ key: 'summary_and_key_takeaways', title: 'Summary and Key Takeaways', content: deep.summary_and_key_takeaways, type: 'summary' });
      if (deep.additional_resources) sections.push({ key: 'additional_resources', title: 'Additional Resources', content: deep.additional_resources, type: 'resources' });
      if (deep.thomas_kilmann_model) sections.push({ key: 'thomas_kilmann_model', title: 'Thomas-Kilmann Conflict Model', content: deep.thomas_kilmann_model, type: 'thomas-kilmann' });
      if (deep.step_by_step_process && deep.step_by_step_process.length > 0) sections.push({ key: 'step_by_step_process', title: 'Step-by-Step Process', content: deep.step_by_step_process, type: 'step-by-step' });
      if (deep.common_mistakes && deep.common_mistakes.length > 0) sections.push({ key: 'common_mistakes', title: 'Common Mistakes', content: deep.common_mistakes, type: 'common-mistakes' });
      if (deep.emotional_intelligence_connection) sections.push({ key: 'emotional_intelligence_connection', title: 'Emotional Intelligence Connection', content: deep.emotional_intelligence_connection, type: 'emotional-intelligence' });
    }
    
    return sections;
  };

  // Helper function to render section content
  const renderSectionContent = (section) => {
    const { type, content, domain } = section;
    
    switch (type) {
      case 'definition':
        return <p className="text-xl text-white font-light italic leading-tight">"{content}"</p>;
      
      case 'text':
        return <p className="text-slate-300 leading-relaxed">{content}</p>;
      
      case 'list':
        return (
          <ul className="space-y-2">
            {content.map((item, idx) => (
              <li key={idx} className="text-slate-300 flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        );
      
      case 'numbered-list':
        return (
          <ol className="space-y-2 list-decimal list-inside">
            {content.map((item, idx) => (
              <li key={idx} className="text-slate-300">{item}</li>
            ))}
          </ol>
        );
      
      case 'scenarios':
        return (
          <div className="space-y-4">
            {content.map((scenario, idx) => (
              <div key={idx} className="border-l-2 border-cyan-500/50 pl-4">
                <p className="text-white font-semibold mb-2">{scenario.scenario}</p>
                <p className="text-sm text-red-400 mb-1"><span className="font-semibold">Wrong:</span> {scenario.wrong_answer}</p>
                <p className="text-sm text-emerald-400 mb-1"><span className="font-semibold">Right:</span> {scenario.right_answer}</p>
                <p className="text-sm text-slate-400 italic">{scenario.why}</p>
              </div>
            ))}
          </div>
        );
      
      case 'hierarchy':
        return (
          <div className="space-y-3">
            {content.map((item, idx) => (
              <div key={idx} className="border-l-2 border-emerald-500/50 pl-4">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="font-semibold text-white">{item.rank}. {item.mode}</span>
                </div>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">When:</span> {item.when}</p>
                <p className="text-sm text-emerald-400 italic">{item.exam_tip}</p>
              </div>
            ))}
          </div>
        );
      
      case 'related-tasks':
        return (
          <div className="space-y-6">
            {content.map((task, idx) => (
              <div key={idx} className="border-l-2 border-blue-500/50 pl-4">
                <h4 className="font-semibold text-white text-lg mb-2">{task.task}</h4>
                <p className="text-sm text-slate-300 mb-3">{task.description}</p>
                {task.knowledge_and_skills && task.knowledge_and_skills.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-slate-400 uppercase mb-2">Knowledge and Skills:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-slate-300">
                      {task.knowledge_and_skills.map((skill, skillIdx) => (
                        <li key={skillIdx}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {task.what_youll_learn && task.what_youll_learn.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-400 uppercase mb-2">What You'll Learn:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-slate-300">
                      {task.what_youll_learn.map((item, itemIdx) => (
                        <li key={itemIdx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      
      case 'question-patterns':
        return (
          <div className="space-y-4">
            {content.map((pattern, idx) => (
              <div key={idx} className="border-l-2 border-blue-500/50 pl-4">
                <h4 className="font-semibold text-white mb-2">{pattern.pattern}</h4>
                <p className="text-sm text-slate-300 mb-2">{pattern.setup}</p>
                <div className="text-sm space-y-1 mb-2">
                  <p className="text-red-400"><span className="font-semibold">Distractor 1:</span> {pattern.distractor_1} - {pattern.why_wrong_1}</p>
                  <p className="text-red-400"><span className="font-semibold">Distractor 2:</span> {pattern.distractor_2} - {pattern.why_wrong_2}</p>
                  <p className="text-red-400"><span className="font-semibold">Distractor 3:</span> {pattern.distractor_3} - {pattern.why_wrong_3}</p>
                </div>
                <p className="text-emerald-400 font-semibold"><span className="font-bold">Correct:</span> {pattern.correct}</p>
                <p className="text-sm text-emerald-300 italic">{pattern.why_correct}</p>
              </div>
            ))}
          </div>
        );
      
      case 'agile-vs-traditional':
        return (
          <div className="grid grid-cols-2 gap-6">
            <div className="border-l-4 border-orange-500 pl-4">
              <h4 className="executive-font text-lg font-semibold text-white mb-3">Traditional Context</h4>
              <div className="text-sm text-slate-300 space-y-2">
                <p><span className="font-semibold">PM Role:</span> {content.traditional_context.pm_role}</p>
                <p><span className="font-semibold">Approach:</span> {content.traditional_context.approach}</p>
                <p><span className="font-semibold">Escalation:</span> {content.traditional_context.escalation}</p>
              </div>
            </div>
            <div className="border-l-4 border-emerald-500 pl-4">
              <h4 className="executive-font text-lg font-semibold text-white mb-3">Agile Context</h4>
              <div className="text-sm text-slate-300 space-y-2">
                <p><span className="font-semibold">PM Role:</span> {content.agile_context.pm_role}</p>
                <p><span className="font-semibold">Approach:</span> {content.agile_context.approach}</p>
                <p><span className="font-semibold">Escalation:</span> {content.agile_context.escalation}</p>
              </div>
            </div>
          </div>
        );
      
      case 'tuckman':
        return (
          <div className="space-y-4">
            {content.title && <h4 className="executive-font text-xl font-bold text-white mb-4">{content.title}</h4>}
            {content.stages && content.stages.map((stage, idx) => (
              <div key={idx} className="border-l-4 border-purple-400/50 bg-white/[0.02] rounded p-4">
                <h5 className="executive-font text-lg font-semibold text-white mb-2">Stage {idx + 1}: {stage.stage}</h5>
                {stage.overview && <p className="text-slate-300 italic mb-2">{stage.overview}</p>}
                {stage.detailed_characteristics && (
                  <div className="mt-3">
                    <h6 className="text-white font-semibold mb-2">Characteristics:</h6>
                    {stage.detailed_characteristics.team_member_behaviors && (
                      <div className="mb-2">
                        <p className="text-cyan-400 text-sm font-semibold mb-1">Team Member Behaviors:</p>
                        <ul className="list-disc list-inside text-slate-300 text-sm space-y-1 ml-4">
                          {stage.detailed_characteristics.team_member_behaviors.map((behavior, bIdx) => (
                            <li key={bIdx}>{behavior}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      
      case 'leadership-styles':
        return (
          <div className="space-y-4">
            {content.title && <h4 className="executive-font text-xl font-bold text-white mb-4">{content.title}</h4>}
            {content.background_and_research && <p className="text-slate-300 mb-4">{content.background_and_research}</p>}
            {content.styles && content.styles.map((style, idx) => (
              <div key={idx} className="border-l-4 border-emerald-400/50 bg-white/[0.02] rounded p-4">
                <h5 className="executive-font text-lg font-semibold text-white mb-2">{style.style}</h5>
                {style.tagline && <p className="text-cyan-400 text-sm italic mb-2">"{style.tagline}"</p>}
                {style.description && <p className="text-slate-300 text-sm mb-2">{style.description}</p>}
              </div>
            ))}
          </div>
        );
      
      case 'situational-leadership':
        return (
          <div className="space-y-4">
            {content.title && <h4 className="executive-font text-xl font-bold text-white mb-4">{content.title}</h4>}
            {content.integration_framework && <p className="text-slate-300 mb-4">{content.integration_framework}</p>}
            {content.by_team_stage && Object.entries(content.by_team_stage).map(([stage, styleInfo]) => (
              <div key={stage} className="border-l-2 border-yellow-400/50 pl-4">
                <h5 className="text-white font-semibold capitalize mb-1">{stage}:</h5>
                <p className="text-slate-300 text-sm"><span className="text-cyan-400">Primary:</span> {styleInfo.primary}</p>
                <p className="text-slate-300 text-sm"><span className="text-cyan-400">Secondary:</span> {styleInfo.secondary}</p>
              </div>
            ))}
          </div>
        );
      
      case 'practical-application':
        return (
          <div className="space-y-4">
            {content.title && <h4 className="executive-font text-xl font-bold text-white mb-4">{content.title}</h4>}
            {content.self_assessment_questions && content.self_assessment_questions.diagnostic_questions && (
              <div className="space-y-4">
                {content.self_assessment_questions.diagnostic_questions.map((q, idx) => (
                  <div key={idx} className="border-l-2 border-indigo-400/50 pl-4">
                    <h5 className="text-white font-semibold mb-2">{q.question}</h5>
                    {q.guidance && Array.isArray(q.guidance) && (
                      <ul className="list-disc list-inside text-slate-300 text-sm space-y-1 ml-4">
                        {q.guidance.map((guidance, gIdx) => (
                          <li key={gIdx}>{guidance}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      
      case 'summary':
        return (
          <div className="space-y-4">
            {content.title && <h4 className="executive-font text-xl font-bold text-white mb-4">{content.title}</h4>}
            {content.tuckman_stages_key_points && (
              <div className="mb-4">
                <h5 className="text-cyan-400 font-semibold mb-2">Tuckman's Stages - Key Points:</h5>
                {content.tuckman_stages_key_points.map((point, idx) => (
                  <div key={idx} className="mb-3 border-l-2 border-teal-400/50 pl-4">
                    <h6 className="text-white font-semibold mb-1">{point.point}</h6>
                    {point.details && Array.isArray(point.details) && (
                      <ul className="list-disc list-inside text-slate-300 text-sm space-y-1 ml-4">
                        {point.details.map((detail, dIdx) => (
                          <li key={dIdx}>{detail}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
            {content.leadership_styles_key_points && (
              <div>
                <h5 className="text-cyan-400 font-semibold mb-2">Leadership Styles - Key Points:</h5>
                {content.leadership_styles_key_points.map((point, idx) => (
                  <div key={idx} className="mb-3 border-l-2 border-teal-400/50 pl-4">
                    <h6 className="text-white font-semibold mb-1">{point.point}</h6>
                    {point.details && Array.isArray(point.details) && (
                      <ul className="list-disc list-inside text-slate-300 text-sm space-y-1 ml-4">
                        {point.details.map((detail, dIdx) => (
                          <li key={dIdx}>{detail}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      
      case 'resources':
        return (
          <div className="space-y-4">
            {content.books && (
              <div className="mb-4">
                <h5 className="text-cyan-400 font-semibold mb-2">Books:</h5>
                <ul className="list-disc list-inside text-slate-300 space-y-2">
                  {content.books.map((book, idx) => (
                    <li key={idx}>
                      <span className="font-semibold text-white">"{book.title}"</span> by {book.author}
                      {book.focus && <span className="text-slate-400 text-sm"> - {book.focus}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {content.tools && (
              <div>
                <h5 className="text-cyan-400 font-semibold mb-2">Tools:</h5>
                <ul className="list-disc list-inside text-slate-300 space-y-1">
                  {content.tools.map((tool, idx) => (
                    <li key={idx}>{tool}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      
      case 'thomas-kilmann':
        return (
          <div className="space-y-4">
            {content.description && <p className="text-slate-300 mb-4">{content.description}</p>}
            {content.five_modes && content.five_modes.map((mode, idx) => (
              <div key={idx} className="border-l-2 border-purple-500/50 pl-4">
                <h5 className="font-semibold text-white mb-2">{mode.mode}</h5>
                <p className="text-sm mb-2">{mode.description}</p>
                <div className="text-xs text-slate-400">
                  <div className="mb-1"><span className="font-semibold">Assertiveness:</span> {mode.assertiveness}</div>
                  <div className="mb-1"><span className="font-semibold">Cooperativeness:</span> {mode.cooperativeness}</div>
                  <div className="mb-1"><span className="font-semibold">Outcome:</span> {mode.outcome}</div>
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'step-by-step':
        return (
          <div className="space-y-4">
            {content.map((step, idx) => (
              <div key={idx} className="border-l-2 border-emerald-500/50 pl-4">
                <h5 className="font-semibold text-white mb-2">Step {step.step}: {step.title}</h5>
                {step.actions && (
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {step.actions.map((action, actionIdx) => (
                      <li key={actionIdx} className="text-slate-300">{action}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        );
      
      case 'common-mistakes':
        return (
          <div className="space-y-3">
            {content.map((mistake, idx) => (
              <div key={idx} className="border-l-2 border-rose-500/50 pl-4">
                <h5 className="font-semibold text-white mb-1">{mistake.mistake}</h5>
                <p className="text-sm text-slate-400 mb-1"><span className="font-semibold">Consequence:</span> {mistake.consequence}</p>
                <p className="text-sm text-emerald-400"><span className="font-semibold">Correction:</span> {mistake.correction}</p>
              </div>
            ))}
          </div>
        );
      
      case 'emotional-intelligence':
        return (
          <div className="space-y-3 text-sm">
            <div><span className="font-semibold text-white">Self-Awareness:</span> {content.self_awareness}</div>
            <div><span className="font-semibold text-white">Self-Management:</span> {content.self_management}</div>
            <div><span className="font-semibold text-white">Social Awareness:</span> {content.social_awareness}</div>
            <div><span className="font-semibold text-white">Relationship Management:</span> {content.relationship_management}</div>
          </div>
        );
      
      case 'key-frameworks':
        return (
          <div className="space-y-6">
            {content.sbi_model && (
              <div className="border-l-4 border-blue-500/50 bg-blue-500/5 p-4 rounded">
                <h4 className="executive-font text-lg font-semibold text-white mb-3">📊 {content.sbi_model.title}</h4>
                <div className="space-y-2 text-sm">
                  <p className="text-slate-300"><span className="font-semibold text-blue-400">S</span> = {content.sbi_model.s}</p>
                  <p className="text-slate-300"><span className="font-semibold text-blue-400">B</span> = {content.sbi_model.b}</p>
                  <p className="text-slate-300"><span className="font-semibold text-blue-400">I</span> = {content.sbi_model.i}</p>
                </div>
              </div>
            )}
            {content.recognition_types && (
              <div className="border-l-4 border-purple-500/50 bg-purple-500/5 p-4 rounded">
                <h4 className="executive-font text-lg font-semibold text-white mb-3">⭐ {content.recognition_types.title}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-400 mb-1">Formal: {content.recognition_types.formal}</p>
                    <p className="text-slate-400">Informal: {content.recognition_types.informal}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 mb-1">Public: {content.recognition_types.public}</p>
                    <p className="text-slate-400">Private: {content.recognition_types.private}</p>
                  </div>
                </div>
              </div>
            )}
            {content.performance_continuum && (
              <div className="border-l-4 border-emerald-500/50 bg-emerald-500/5 p-4 rounded">
                <h4 className="executive-font text-lg font-semibold text-white mb-3">📈 {content.performance_continuum.title}</h4>
                <p className="text-slate-300">{content.performance_continuum.stages}</p>
              </div>
            )}
          </div>
        );
      
      case 'performance-framework':
        return (
          <div className="space-y-4">
            {content.measure_performance && (
              <div className="border-l-4 border-blue-500/50 bg-blue-500/5 p-4 rounded">
                <h4 className="executive-font text-lg font-semibold text-white mb-2">📊 1. Measure Performance</h4>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">When:</span> {content.measure_performance.when}</p>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">Action:</span> {content.measure_performance.action}</p>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">Metrics:</span> {content.measure_performance.metrics}</p>
                <p className="text-sm text-emerald-400 italic"><span className="font-semibold">Key:</span> {content.measure_performance.key}</p>
              </div>
            )}
            {content.provide_feedback && (
              <div className="border-l-4 border-purple-500/50 bg-purple-500/5 p-4 rounded">
                <h4 className="executive-font text-lg font-semibold text-white mb-2">📈 2. Provide Feedback</h4>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">When:</span> {content.provide_feedback.when}</p>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">Action:</span> {content.provide_feedback.action}</p>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">Approach:</span> {content.provide_feedback.approach}</p>
                <p className="text-sm text-emerald-400 italic"><span className="font-semibold">Key:</span> {content.provide_feedback.key}</p>
              </div>
            )}
            {content.coach_and_develop && (
              <div className="border-l-4 border-cyan-500/50 bg-cyan-500/5 p-4 rounded">
                <h4 className="executive-font text-lg font-semibold text-white mb-2">🎯 3. Coach and Develop</h4>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">When:</span> {content.coach_and_develop.when}</p>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">Action:</span> {content.coach_and_develop.action}</p>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">Focus:</span> {content.coach_and_develop.focus}</p>
                <p className="text-sm text-emerald-400 italic"><span className="font-semibold">Key:</span> {content.coach_and_develop.key}</p>
              </div>
            )}
            {content.recognize_and_reward && (
              <div className="border-l-4 border-amber-500/50 bg-amber-500/5 p-4 rounded">
                <h4 className="executive-font text-lg font-semibold text-white mb-2">🌟 4. Recognize and Reward</h4>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">When:</span> {content.recognize_and_reward.when}</p>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">Action:</span> {content.recognize_and_reward.action}</p>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">Types:</span> {content.recognize_and_reward.types}</p>
                <p className="text-sm text-emerald-400 italic"><span className="font-semibold">Key:</span> {content.recognize_and_reward.key}</p>
              </div>
            )}
            {content.address_underperformance && (
              <div className="border-l-4 border-red-500/50 bg-red-500/5 p-4 rounded">
                <h4 className="executive-font text-lg font-semibold text-white mb-2">⚠️ 5. Address Underperformance</h4>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">When:</span> {content.address_underperformance.when}</p>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">Action:</span> {content.address_underperformance.action}</p>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">Process:</span> {content.address_underperformance.process}</p>
                <p className="text-sm text-emerald-400 italic"><span className="font-semibold">Key:</span> {content.address_underperformance.key}</p>
              </div>
            )}
          </div>
        );
      
      case 'sbi-examples':
        return (
          <div className="space-y-6">
            {content.good_example && (
              <div className="border-l-4 border-emerald-500/50 bg-emerald-500/5 p-4 rounded">
                <h4 className="executive-font text-lg font-semibold text-emerald-400 mb-3">✅ Good SBI Example:</h4>
                <div className="space-y-2 text-sm">
                  <p className="text-slate-300"><span className="font-semibold text-blue-400">S:</span> "{content.good_example.s}"</p>
                  <p className="text-slate-300"><span className="font-semibold text-blue-400">B:</span> "{content.good_example.b}"</p>
                  <p className="text-slate-300"><span className="font-semibold text-blue-400">I:</span> "{content.good_example.i}"</p>
                </div>
              </div>
            )}
            {content.bad_example && (
              <div className="border-l-4 border-red-500/50 bg-red-500/5 p-4 rounded">
                <h4 className="executive-font text-lg font-semibold text-red-400 mb-3">❌ Bad Feedback (No SBI):</h4>
                <p className="text-slate-300 mb-2">"{content.bad_example.text}"</p>
                <p className="text-sm text-red-400 italic">Problem: {content.bad_example.problem}</p>
              </div>
            )}
            {content.good_positive && (
              <div className="border-l-4 border-cyan-500/50 bg-cyan-500/5 p-4 rounded">
                <h4 className="executive-font text-lg font-semibold text-cyan-400 mb-3">✅ Good Positive SBI:</h4>
                <div className="space-y-2 text-sm">
                  <p className="text-slate-300"><span className="font-semibold text-blue-400">S:</span> "{content.good_positive.s}"</p>
                  <p className="text-slate-300"><span className="font-semibold text-blue-400">B:</span> "{content.good_positive.b}"</p>
                  <p className="text-slate-300"><span className="font-semibold text-blue-400">I:</span> "{content.good_positive.i}"</p>
                </div>
              </div>
            )}
          </div>
        );
      
      case 'recognition-practices':
        return (
          <div className="space-y-4">
            {content.make_timely && (
              <div className="border-l-2 border-amber-500/50 pl-4">
                <h4 className="executive-font text-base font-semibold text-white mb-2">⭐ 1. Make It Timely</h4>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">When:</span> {content.make_timely.when}</p>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">Why:</span> {content.make_timely.why}</p>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">How:</span> {content.make_timely.how}</p>
                <p className="text-sm text-red-400 italic"><span className="font-semibold">Avoid:</span> {content.make_timely.avoid}</p>
              </div>
            )}
            {content.be_specific && (
              <div className="border-l-2 border-amber-500/50 pl-4">
                <h4 className="executive-font text-base font-semibold text-white mb-2">🎯 2. Be Specific</h4>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">When:</span> {content.be_specific.when}</p>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">Why:</span> {content.be_specific.why}</p>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">How:</span> {content.be_specific.how}</p>
                <p className="text-sm text-red-400 italic"><span className="font-semibold">Avoid:</span> {content.be_specific.avoid}</p>
              </div>
            )}
            {content.match_preference && (
              <div className="border-l-2 border-amber-500/50 pl-4">
                <h4 className="executive-font text-base font-semibold text-white mb-2">👥 3. Match Preference</h4>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">When:</span> {content.match_preference.when}</p>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">Why:</span> {content.match_preference.why}</p>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">How:</span> {content.match_preference.how}</p>
                <p className="text-sm text-red-400 italic"><span className="font-semibold">Avoid:</span> {content.match_preference.avoid}</p>
              </div>
            )}
            {content.recognize_effort && (
              <div className="border-l-2 border-amber-500/50 pl-4">
                <h4 className="executive-font text-base font-semibold text-white mb-2">🏆 4. Recognize Effort, Not Just Results</h4>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">When:</span> {content.recognize_effort.when}</p>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">Why:</span> {content.recognize_effort.why}</p>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">How:</span> {content.recognize_effort.how}</p>
                <p className="text-sm text-red-400 italic"><span className="font-semibold">Avoid:</span> {content.recognize_effort.avoid}</p>
              </div>
            )}
            {content.use_multiple_forms && (
              <div className="border-l-2 border-amber-500/50 pl-4">
                <h4 className="executive-font text-base font-semibold text-white mb-2">🎁 5. Use Multiple Forms</h4>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">When:</span> {content.use_multiple_forms.when}</p>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">Why:</span> {content.use_multiple_forms.why}</p>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">How:</span> {content.use_multiple_forms.how}</p>
                <p className="text-sm text-red-400 italic"><span className="font-semibold">Avoid:</span> {content.use_multiple_forms.avoid}</p>
              </div>
            )}
          </div>
        );
      
      case 'exam-principles':
        return (
          <div className="space-y-4">
            {content.feedback_should_be && content.feedback_should_be.length > 0 && (
              <div className="border-l-4 border-blue-500/50 bg-blue-500/5 p-4 rounded mb-4">
                <h4 className="executive-font text-lg font-semibold text-white mb-3">Feedback Should Be:</h4>
                <ul className="space-y-1">
                  {content.feedback_should_be.map((item, idx) => (
                    <li key={idx} className="text-slate-300 flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {content.recognition_principles && content.recognition_principles.length > 0 && (
              <div className="border-l-4 border-purple-500/50 bg-purple-500/5 p-4 rounded mb-4">
                <h4 className="executive-font text-lg font-semibold text-white mb-3">Recognition Principles:</h4>
                <ul className="space-y-1">
                  {content.recognition_principles.map((item, idx) => (
                    <li key={idx} className="text-slate-300 flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {content.address_underperformance && content.address_underperformance.length > 0 && (
              <div className="border-l-4 border-red-500/50 bg-red-500/5 p-4 rounded mb-4">
                <h4 className="executive-font text-lg font-semibold text-white mb-3">Address Underperformance:</h4>
                <ul className="space-y-1">
                  {content.address_underperformance.map((item, idx) => (
                    <li key={idx} className="text-slate-300 flex items-start gap-2">
                      <span className="text-red-400 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {content.development_focus && content.development_focus.length > 0 && (
              <div className="border-l-4 border-emerald-500/50 bg-emerald-500/5 p-4 rounded">
                <h4 className="executive-font text-lg font-semibold text-white mb-3">Development Focus:</h4>
                <ul className="space-y-1">
                  {content.development_focus.map((item, idx) => (
                    <li key={idx} className="text-slate-300 flex items-start gap-2">
                      <span className="text-emerald-400 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      
      case 'sample-questions':
        return (
          <div className="space-y-6">
            {content.map((q, idx) => (
              <div key={idx} className="border-l-4 border-blue-500/50 bg-blue-500/5 p-5 rounded">
                <h4 className="executive-font text-lg font-semibold text-white mb-3">Sample Question {idx + 1}</h4>
                <p className="text-white font-medium mb-4">"{q.question}"</p>
                <div className="space-y-2 mb-4">
                  {q.options && q.options.map((opt, optIdx) => (
                    <div key={optIdx} className={`p-2 rounded ${optIdx === parseInt(q.correct) ? 'bg-emerald-500/20 border border-emerald-500/50' : 'bg-slate-800/50'}`}>
                      <span className="text-slate-400 mr-2">{String.fromCharCode(65 + optIdx)}:</span>
                      <span className={optIdx === parseInt(q.correct) ? 'text-emerald-400 font-semibold' : 'text-slate-300'}>{opt}</span>
                      {optIdx === parseInt(q.correct) && <span className="ml-2 text-emerald-400">✓ Correct</span>}
                    </div>
                  ))}
                </div>
                <div className="bg-emerald-500/10 p-3 rounded border border-emerald-500/30">
                  <p className="text-emerald-400 font-semibold mb-2">Why Correct:</p>
                  <p className="text-slate-300 text-sm">{q.why_correct}</p>
                </div>
                {q.why_others_wrong && (
                  <div className="mt-3 bg-red-500/10 p-3 rounded border border-red-500/30">
                    <p className="text-red-400 font-semibold mb-2">Why Others Are Wrong:</p>
                    {Object.entries(q.why_others_wrong).map(([key, value]) => (
                      <p key={key} className="text-slate-300 text-sm mb-1">
                        <span className="font-semibold">{key}:</span> {value}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      
      case 'exam-strategy':
        return (
          <div className="space-y-4">
            {content.do && content.do.length > 0 && (
              <div className="border-l-4 border-emerald-500/50 bg-emerald-500/5 p-4 rounded">
                <h4 className="executive-font text-lg font-semibold text-emerald-400 mb-3">✓ Do:</h4>
                <ul className="space-y-1">
                  {content.do.map((item, idx) => (
                    <li key={idx} className="text-slate-300 flex items-start gap-2">
                      <span className="text-emerald-400 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {content.dont && content.dont.length > 0 && (
              <div className="border-l-4 border-red-500/50 bg-red-500/5 p-4 rounded">
                <h4 className="executive-font text-lg font-semibold text-red-400 mb-3">✗ Don't:</h4>
                <ul className="space-y-1">
                  {content.dont.map((item, idx) => (
                    <li key={idx} className="text-slate-300 flex items-start gap-2">
                      <span className="text-red-400 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {content.key_phrases_correct && content.key_phrases_correct.length > 0 && (
              <div className="border-l-4 border-cyan-500/50 bg-cyan-500/5 p-4 rounded">
                <h4 className="executive-font text-lg font-semibold text-cyan-400 mb-3">Key Phrases That Signal Correct Answers:</h4>
                <ul className="space-y-1">
                  {content.key_phrases_correct.map((item, idx) => (
                    <li key={idx} className="text-slate-300 flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {content.key_phrases_wrong && content.key_phrases_wrong.length > 0 && (
              <div className="border-l-4 border-orange-500/50 bg-orange-500/5 p-4 rounded">
                <h4 className="executive-font text-lg font-semibold text-orange-400 mb-3">Key Phrases That Signal Wrong Answers:</h4>
                <ul className="space-y-1">
                  {content.key_phrases_wrong.map((item, idx) => (
                    <li key={idx} className="text-slate-300 flex items-start gap-2">
                      <span className="text-orange-400 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      
      case 'performance-support-framework':
      case 'sbi-feedback-model':
      case 'recognition-strategies':
      case 'addressing-underperformance':
      case 'development-growth':
      case 'performance-metrics':
      case 'integration-tasks':
        // Render complex nested objects as formatted sections
        return (
          <div className="space-y-4 text-slate-300">
            {typeof content === 'object' && content !== null ? (
              <div className="space-y-4">
                {Object.entries(content).map(([key, value]) => (
                  <div key={key} className="border-l-2 border-slate-600/50 pl-4">
                    <h5 className="text-white font-semibold mb-2 capitalize">{key.replace(/_/g, ' ')}</h5>
                    {typeof value === 'string' ? (
                      <p className="text-sm text-slate-300">{value}</p>
                    ) : Array.isArray(value) ? (
                      <ul className="list-disc list-inside space-y-1 text-sm text-slate-300">
                        {value.map((item, idx) => (
                          <li key={idx}>{typeof item === 'string' ? item : JSON.stringify(item)}</li>
                        ))}
                      </ul>
                    ) : (
                      <pre className="whitespace-pre-wrap text-xs bg-slate-900/50 p-2 rounded">{JSON.stringify(value, null, 2)}</pre>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>{content}</p>
            )}
          </div>
        );
      
      default:
        return <p className="text-slate-300">{typeof content === 'string' ? content : JSON.stringify(content)}</p>;
    }
  };

  if (view === 'learn-hub') {
    const sections = getContentSections();
    const isExpanded = (sectionKey) => {
      const state = expandedLearningSections[subView];
      return state && state[sectionKey] === true;
    };
    
    // Jewel colors array for buttons
    const jewelColors = [
      { border: 'border-emerald-500', hover: 'hover:border-emerald-400', bg: 'hover:bg-emerald-500/10', text: 'text-emerald-400', close: 'text-emerald-400 hover:text-emerald-300' }, // Emerald
      { border: 'border-sapphire-500', hover: 'hover:border-sapphire-400', bg: 'hover:bg-sapphire-500/10', text: 'text-sapphire-400', close: 'text-sapphire-400 hover:text-sapphire-300' }, // Sapphire (blue)
      { border: 'border-ruby-500', hover: 'hover:border-ruby-400', bg: 'hover:bg-ruby-500/10', text: 'text-ruby-400', close: 'text-ruby-400 hover:text-ruby-300' }, // Ruby (red)
      { border: 'border-amethyst-500', hover: 'hover:border-amethyst-400', bg: 'hover:bg-amethyst-500/10', text: 'text-amethyst-400', close: 'text-amethyst-400 hover:text-amethyst-300' }, // Amethyst (purple)
      { border: 'border-amber-500', hover: 'hover:border-amber-400', bg: 'hover:bg-amber-500/10', text: 'text-amber-400', close: 'text-amber-400 hover:text-amber-300' }, // Amber
      { border: 'border-turquoise-500', hover: 'hover:border-turquoise-400', bg: 'hover:bg-turquoise-500/10', text: 'text-turquoise-400', close: 'text-turquoise-400 hover:text-turquoise-300' }, // Turquoise
      { border: 'border-topaz-500', hover: 'hover:border-topaz-400', bg: 'hover:bg-topaz-500/10', text: 'text-topaz-400', close: 'text-topaz-400 hover:text-topaz-300' }, // Topaz (yellow)
      { border: 'border-garnet-500', hover: 'hover:border-garnet-400', bg: 'hover:bg-garnet-500/10', text: 'text-garnet-400', close: 'text-garnet-400 hover:text-garnet-300' }, // Garnet (deep red)
    ];
    
    // Get jewel color for a section index
    const getJewelColor = (index) => {
      return jewelColors[index % jewelColors.length];
    };
    
    // Grid: Always start with 2 columns, expand as needed
    const getGridCols = () => {
      const count = sections.length;
      if (count <= 4) return 'grid-cols-2';
      if (count <= 6) return 'grid-cols-2 md:grid-cols-3';
      if (count <= 9) return 'grid-cols-2 md:grid-cols-3';
      return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
    };

    return (
      <>
        <Confetti />
        <div className={`max-w-7xl w-full p-10 animate-fadeIn text-left view-transition-wrapper ${viewTransition.isTransitioning ? 'view-transition-exit' : 'view-transition-enter'}`}>
          {/* Header with Back Button */}
          <header className="mb-8">
            <div className="flex items-center justify-between gap-4 mb-6">
              <button 
                onClick={() => setView('task-interstitial')}
                className="px-4 py-2 executive-font text-xs text-slate-400 hover:text-white uppercase font-semibold transition-colors flex items-center gap-2"
              >
                ← Back
              </button>
              <button
                onClick={(e) => {
                  createRipple(e);
                  handleViewChange('practice-hub');
                }}
                className="px-6 py-2 executive-font text-sm font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 btn-ripple"
              >
                Go Practice →
              </button>
            </div>
            <h1 className="executive-font text-5xl font-bold text-white tracking-tight mb-2">
              {selectedTask}
            </h1>
            <p className="text-slate-400 text-lg mb-6">
              {subView === 'overview' ? 'Overview' : subView === 'pmp-application' ? 'PMP Application' : 'Deep Dive'}
            </p>
            
            {/* Tab Navigation */}
            <div className="flex gap-8 border-b border-white/10">
              <button 
                onClick={() => setSubView('overview')} 
                className={`px-4 py-3 executive-font text-xs font-semibold uppercase transition-all relative ${
                  subView === 'overview' 
                    ? 'text-white border-b-2 border-cyan-400' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Overview
              </button>
              <button 
                onClick={() => setSubView('pmp-application')} 
                className={`px-4 py-3 executive-font text-xs font-semibold uppercase transition-all relative ${
                  subView === 'pmp-application' 
                    ? 'text-white border-b-2 border-cyan-400' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                PMP Application
              </button>
              <button 
                onClick={() => setSubView('deep-dive')} 
                className={`px-4 py-3 executive-font text-xs font-semibold uppercase transition-all relative ${
                  subView === 'deep-dive' 
                    ? 'text-white border-b-2 border-cyan-400' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Deep Dive
              </button>
            </div>
          </header>

          {/* Content Area - Two Column Layout: Buttons Left, Content Right */}
          {sections.length === 0 ? (
            <div className="glass-card p-10 text-center">
              <p className="text-slate-400 text-lg">No content available for this section.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 min-h-[500px]">
              {/* Left Column - Buttons */}
              <div className="space-y-3">
                {sections.map((section, index) => {
                  const expanded = isExpanded(section.key);
                  
                  // Jewel tone color classes with full opacity for better visibility
                  const jewelBgClasses = [
                    { bg: 'bg-emerald-600', hover: 'hover:bg-emerald-500', active: 'bg-emerald-500', ring: 'ring-emerald-400' }, // Emerald
                    { bg: 'bg-blue-600', hover: 'hover:bg-blue-500', active: 'bg-blue-500', ring: 'ring-blue-400' }, // Sapphire
                    { bg: 'bg-red-600', hover: 'hover:bg-red-500', active: 'bg-red-500', ring: 'ring-red-400' }, // Ruby
                    { bg: 'bg-purple-600', hover: 'hover:bg-purple-500', active: 'bg-purple-500', ring: 'ring-purple-400' }, // Amethyst
                    { bg: 'bg-amber-600', hover: 'hover:bg-amber-500', active: 'bg-amber-500', ring: 'ring-amber-400' }, // Amber
                    { bg: 'bg-cyan-600', hover: 'hover:bg-cyan-500', active: 'bg-cyan-500', ring: 'ring-cyan-400' }, // Turquoise
                    { bg: 'bg-yellow-600', hover: 'hover:bg-yellow-500', active: 'bg-yellow-500', ring: 'ring-yellow-400' }, // Topaz
                    { bg: 'bg-rose-600', hover: 'hover:bg-rose-500', active: 'bg-rose-500', ring: 'ring-rose-400' }, // Garnet
                  ];
                  const jewel = jewelBgClasses[index % jewelBgClasses.length];
                  
                  return (
                    <button
                      key={section.key}
                      onClick={(e) => {
                        e.preventDefault();
                        // Close all other sections and toggle this one
                        const currentValue = expandedLearningSections[subView]?.[section.key] || false;
                        const newState = { [section.key]: !currentValue };
                        // Close all others
                        sections.forEach(s => {
                          if (s.key !== section.key) {
                            newState[s.key] = false;
                          }
                        });
                        setExpandedLearningSections(prev => ({
                          ...prev,
                          [subView]: {
                            ...prev[subView],
                            ...newState
                          }
                        }));
                      }}
                      className={`w-full p-4 text-left transition-all rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.02] cursor-pointer ${
                        expanded 
                          ? `${jewel.active} ring-2 ${jewel.ring} ring-opacity-50` 
                          : `${jewel.bg} ${jewel.hover}`
                      }`}
                    >
                      <h3 className="executive-font text-sm font-semibold mb-1 text-white drop-shadow-md">
                        {section.title}
                      </h3>
                      {!expanded && (
                        <p className="text-xs text-white/90 mt-1">Click to view →</p>
                      )}
                      {expanded && (
                        <p className="text-xs text-white font-semibold mt-1">● Active</p>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Right Column - Content Display */}
              <div className="glass-card p-6 border-l-4 border-cyan-500/50">
                {(() => {
                  const expandedSection = sections.find(s => isExpanded(s.key));
                  if (!expandedSection) {
                    return (
                      <div className="flex items-center justify-center h-full min-h-[400px]">
                        <div className="text-center">
                          <p className="text-slate-400 text-lg mb-2">Select a section to view content</p>
                          <p className="text-slate-500 text-sm">Click any button on the left to expand</p>
                        </div>
                      </div>
                    );
                  }
                  
                  const jewel = getJewelColor(sections.findIndex(s => s.key === expandedSection.key));
                  
                  return (
                    <div className="h-full flex flex-col">
                      <div className="flex items-start justify-between mb-4 pb-4 border-b border-white/10">
                        <h3 className="executive-font text-2xl font-semibold text-white flex-1">
                          {expandedSection.title}
                        </h3>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Close this section
                            setExpandedLearningSections(prev => ({
                              ...prev,
                              [subView]: {
                                ...prev[subView],
                                [expandedSection.key]: false
                              }
                            }));
                          }}
                          className="text-slate-400 hover:text-white text-2xl font-bold ml-4 flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                          title="Close"
                        >
                          ×
                        </button>
                      </div>
                      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                        {expandedSection.domain && (
                          <p className="text-emerald-400 text-sm font-semibold mb-4">Domain: {expandedSection.domain}</p>
                        )}
                        {renderSectionContent(expandedSection)}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
          <GlobalNavFooter />
        </div>
      </>
    );
  }

  // Old learn-hub content removed - now using grid layout above

  // Fallback return - should never reach here if all views are properly handled
  return (
    <>
      <Confetti />
      <div className={`p-20 text-center view-transition-wrapper ${viewTransition.isTransitioning ? 'view-transition-exit' : 'view-transition-enter'}`}>
        <h1 className="executive-font text-4xl text-white animate-pulse font-semibold">Initializing PMP Prep Center...</h1>
        <GlobalNavFooter />
      </div>
    </>
  );
};

// View Transition Wrapper
const ViewTransitionWrapper = ({ children, isTransitioning }) => {
  return (
    <div className={`view-transition-wrapper ${isTransitioning ? 'view-transition-exit' : 'view-transition-enter'}`}>
      {children}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<PMPApp />);