import { useState, useEffect, useRef, cloneElement, lazy, Suspense } from 'react';
import './index.css';
import { safeRenderText, renderMarkdown as renderMarkdownHelper } from './utils/helpers';
import { getAllTasks as getAllTasksHelper } from './constants';
import { ErrorBoundary } from './components/ErrorBoundary';
import { domainMap } from './constants';
import { CheckIcon, XIcon, CircleIcon, WarningIcon, DashIcon, BulletIcon, StarIcon, ChartIcon, LockIcon, SearchIcon, TrophyIcon, FileIcon, LightbulbIcon } from './components/Icons';

// Lazy load views
const LazyProgressStats = lazy(() => import('./views/ProgressStats.jsx'));
import {
  getOrCreateUserId,
  getScoreData,
  getQuizData,
  saveScoreData,
  recordComprehensiveScore,
  getBestScore,
  getActivityStats
} from './utils/scoreUtils';

const PMPApp = ({ onAppReady }) => {

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
  // Navigation state for task connections
  const [showingRelatedTask, setShowingRelatedTask] = useState(false);
  const [relatedTaskId, setRelatedTaskId] = useState(null);
  const [returnToSection, setReturnToSection] = useState('connections');
  
  // Navigation function for practice hub
  const goToPracticeHub = () => {
    setView('practice-hub');
  };
  
  // Progress Tracking State
  const [progressData, setProgressData] = useState({
    completedActivities: {}, // { 'taskName': { 'activityName': { completed: true, completedAt: 'date', attempts: 1, bestScore: 0 } } }
    activityScores: {} // { 'taskName': { 'activityName': [{ attempt: 1, score: 0, date: 'date', ... }] } }
  });
  
  // Task Progress Modal State
  const [showTaskProgressModal, setShowTaskProgressModal] = useState(false);
  const [showTasksModal, setShowTasksModal] = useState(false);
  
  // Practice Quizzes State
  const [quizView, setQuizView] = useState('main'); // main, domain-select, task-select, approach-select, quiz, results
  const [quizHoveredCard, setQuizHoveredCard] = useState(null);
  const [quizSelectedDomain, setQuizSelectedDomain] = useState(null);
  const [quizSelectedApproach, setQuizSelectedApproach] = useState(null);
  const [quizExpandedDomain, setQuizExpandedDomain] = useState('people');
  const [quizSearchTerm, setQuizSearchTerm] = useState('');
  const [quizSelectedTask, setQuizSelectedTask] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizCurrentQuestion, setQuizCurrentQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [quizResults, setQuizResults] = useState(null);
  
  // Progress Stats Animation State (must be at top level - Rules of Hooks)
  const [masteryCardsVisible, setMasteryCardsVisible] = useState(false);
  const masterySectionRef = useRef(null);
  
  // Condensed Dashboard State
  const [expandedSection, setExpandedSection] = useState(null);
  const [expandedDomain, setExpandedDomain] = useState(null);
  const [hoveredTask, setHoveredTask] = useState(null);
  const [pulseRing, setPulseRing] = useState(0);
  const [animated, setAnimated] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [expandedTaskList, setExpandedTaskList] = useState(null);



  useEffect(() => {
    // Load taskData.json with caching
    const fetchData = async () => {
      try {
        const { loadTaskData } = await import('./utils/dataLoader.js');
        const data = await loadTaskData();
        console.log("Task data loaded successfully", Object.keys(data));
        setTaskDatabase(data);
        // Hide loading screen once data is loaded
        if (onAppReady) {
          setTimeout(() => onAppReady(), 100);
        }
      } catch (err) {
        console.error("Data Load Failure", err);
        // Hide loading screen even on error so user can see the error
        if (onAppReady) {
          setTimeout(() => onAppReady(), 100);
        }
        // Set user-friendly error message
        const errorMessage = err.message || 'Failed to load task data';
        setError({
          type: 'data_load_error',
          message: errorMessage,
          details: `Unable to load task data from './data/taskData.json'. Please ensure the file exists and is accessible.`,
          timestamp: new Date().toISOString()
        });
        // Don't block the app - set empty database so app can still render
        console.log("Setting empty database due to error");
        setTaskDatabase({});
        // Hide loading screen even on error so user can see the error message
        if (onAppReady) {
          setTimeout(() => onAppReady(), 100);
        }
      }
    };
    
    fetchData();
  }, [onAppReady]);

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

  // Animate progress-stats view on load
  useEffect(() => {
    if (view === 'progress-stats') {
      // Set animated immediately
      setAnimated(true);
      // Update current time every minute
      const timeInterval = setInterval(() => {
        setCurrentTime(new Date());
      }, 60000);
      return () => clearInterval(timeInterval);
    } else {
      setAnimated(false);
    }
  }, [view]);
  
  // Also set animated when view changes to progress-stats (immediate)
  useEffect(() => {
    if (view === 'progress-stats' && !animated) {
      setAnimated(true);
    }
  }, [view, animated]);

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
        <button onClick={(e) => { createRipple(e); handleViewChange('strategy-suite'); }} className="executive-font btn-ripple">Learn</button>
        <button onClick={(e) => { createRipple(e); handleViewChange('practice-hub'); }} className="executive-font btn-ripple">Practice</button>
        <button onClick={(e) => { createRipple(e); handleViewChange('practice-quizzes'); }} className="executive-font btn-ripple">Quizzes</button>
        <button onClick={(e) => { createRipple(e); handleViewChange('strategy-suite'); }} className="executive-font btn-ripple">Task Areas</button>
        <button onClick={(e) => { createRipple(e); handleViewChange('progress-stats'); }} className="executive-font btn-ripple">My Progress</button>
        {view !== 'executive-hud' && (
          <button onClick={(e) => { createRipple(e); handleViewChange('executive-hud'); }} className="executive-font btn-ripple">Home</button>
        )}
    </div>
  );

  // Show loading only if taskDatabase hasn't been initialized yet (null, not empty object)
  if (taskDatabase === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center p-20">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-6"></div>
          <h1 className="executive-font text-4xl text-white font-semibold tracking-tight mb-4">Initializing PMP Prep Center...</h1>
          <p className="text-slate-400 text-lg">Loading learning content...</p>
          <div className="mt-8 w-64 mx-auto bg-slate-800/50 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-blue-500 animate-pulse" style={{width: '60%'}}></div>
          </div>
        </div>
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
                <WarningIcon size={20} stroke="#f87171" className="inline-block" />
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
    
    if (completed === 0) return { level: 'not-started', completed, total: 6, label: 'Not Started', color: 'slate', progress: 0 };
    if (completed <= 3) return { level: 'in-progress', completed, total: 6, label: 'In Progress', color: 'yellow', progress: Math.round((completed / 6) * 100) };
    if (completed <= 5) return { level: 'advanced', completed, total: 6, label: 'Advanced', color: 'orange', progress: Math.round((completed / 6) * 100) };
    return { level: 'mastered', completed, total: 6, label: 'Mastered', color: 'emerald', progress: 100 };
  };
  
  // Check if a task is truly mastered (all 3 learn pages opened AND all 6 activities attempted)
  const isTaskMastered = (taskName) => {
    // Check all 3 learn pages are opened
    const learnTabs = ['overview', 'pmp-application', 'deep-dive'];
    const allLearnPagesOpened = learnTabs.every(tab => {
      return localStorage.getItem(`learn-viewed-${taskName}-${tab}`);
    });
    
    // Check all 6 activities have been attempted (not necessarily completed)
    const activities = ['pm-simulator', 'lightning-round', 'document-detective', 'conflict-matcher', 'timeline-reconstructor', 'empathy-exercise'];
    const allActivitiesAttempted = activities.every(activity => {
      // Check progressData first
      const progress = progressData.completedActivities[taskName]?.[activity];
      if (progress && (progress.attempts > 0 || progress.completed !== undefined)) {
        return true;
      }
      
      // Check localStorage for specific activities (e.g., lightning-round stores best score)
      if (activity === 'lightning-round') {
        const bestScore = localStorage.getItem(`lightning-round-best-${taskName}`);
        if (bestScore !== null) return true;
      }
      
      // Check for activity-accessed flag in localStorage
      const accessed = localStorage.getItem(`activity-accessed-${taskName}-${activity}`);
      if (accessed) return true;
      
      return false;
    });
    
    return allLearnPagesOpened && allActivitiesAttempted;
  };
  
  // Helper function to get task status
  const getTaskStatus = (taskName) => {
    const taskActivities = progressData.completedActivities[taskName] || {};
    const mastery = getTaskMastery(taskName);
    
    if (mastery.level === 'mastered') return 'completed';
    if (Object.keys(taskActivities).length > 0) return 'started';
    return 'not-started';
  };
  
  // Helper function to organize tasks by domain
  const getTasksByDomain = () => {
    const allTasks = domainMap ? Object.values(domainMap).flat().filter(Boolean) : [];
    const tasksByDomain = {
      'People Domain': [],
      'Process Domain': [],
      'Business Domain': []
    };
    
    allTasks.forEach(taskName => {
      const domain = Object.keys(domainMap).find(d => domainMap[d].includes(taskName));
      if (domain) {
        tasksByDomain[domain].push({
          name: taskName,
          status: getTaskStatus(taskName),
          mastery: getTaskMastery(taskName)
        });
      }
    });
    
    return tasksByDomain;
  };

  // Helper functions for Practice Quizzes
  const getQuestionsFromTask = (taskName) => {
    if (!taskDatabase || !taskDatabase[taskName]) return [];
    const task = taskDatabase[taskName];
    const questions = task.learn?.pmp_application?.exam_focus?.sample_questions || [];
    return questions.map((q, idx) => ({
      ...q,
      id: `${taskName}-${idx}`,
      task: taskName,
      domain: getTaskDomain(taskName)
    }));
  };

  const getTaskDomain = (taskName) => {
    if (domainMap['People Domain'].includes(taskName)) return 'people';
    if (domainMap['Process Domain'].includes(taskName)) return 'process';
    if (domainMap['Business Domain'].includes(taskName)) return 'business';
    return 'unknown';
  };

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const getRandomQuestions = (count = 15) => {
    if (!taskDatabase) return [];
    const allQuestions = [];
    Object.keys(taskDatabase).forEach(taskName => {
      const questions = getQuestionsFromTask(taskName);
      allQuestions.push(...questions);
    });
    return shuffleArray(allQuestions).slice(0, count);
  };

  const getDomainQuestions = (domainKey, count = 20) => {
    if (!taskDatabase) return [];
    const domainMapKey = domainKey === 'people' ? 'People Domain' : 
                        domainKey === 'process' ? 'Process Domain' : 
                        'Business Domain';
    const tasks = domainMap[domainMapKey] || [];
    const allQuestions = [];
    tasks.forEach(taskName => {
      const questions = getQuestionsFromTask(taskName);
      allQuestions.push(...questions);
    });
    return shuffleArray(allQuestions).slice(0, count);
  };

  const getTaskQuestions = (taskName, count = 30) => {
    const questions = getQuestionsFromTask(taskName);
    return shuffleArray(questions).slice(0, count);
  };

  const getApproachQuestions = (approach, count = 20) => {
    // For now, pull from all questions and filter by approach keywords
    // This is a simplified implementation - you may want to tag questions with approach metadata
    if (!taskDatabase) return [];
    const allQuestions = [];
    Object.keys(taskDatabase).forEach(taskName => {
      const questions = getQuestionsFromTask(taskName);
      allQuestions.push(...questions);
    });
    
    // Filter by approach keywords (simplified - ideally questions would be tagged)
    const keywords = {
      agile: ['agile', 'scrum', 'sprint', 'backlog', 'standup', 'retrospective', 'self-organizing', 'servant leadership'],
      predictive: ['waterfall', 'phase gate', 'baseline', 'critical path', 'earned value', 'change control board', 'wbs'],
      hybrid: ['hybrid', 'tailoring', 'adaptive', 'rolling wave', 'context-driven']
    };
    
    const approachKeywords = keywords[approach] || [];
    const filtered = allQuestions.filter(q => {
      const questionText = (q.question || '').toLowerCase();
      return approachKeywords.some(keyword => questionText.includes(keyword));
    });
    
    // If not enough filtered questions, supplement with random
    if (filtered.length < count) {
      const remaining = count - filtered.length;
      const randomQuestions = shuffleArray(allQuestions.filter(q => !filtered.includes(q))).slice(0, remaining);
      return shuffleArray([...filtered, ...randomQuestions]).slice(0, count);
    }
    
    return shuffleArray(filtered).slice(0, count);
  };

  const startQuiz = (quizType, selection = null) => {
    let questions = [];
    let quizTitle = '';
    
    if (quizType === 'random') {
      questions = getRandomQuestions(15);
      quizTitle = 'Random 15 Questions';
    } else if (quizType === 'domain') {
      questions = getDomainQuestions(selection, 20);
      const domainNames = { people: 'People', process: 'Process', business: 'Business Environment' };
      quizTitle = `${domainNames[selection]} Domain Quiz`;
    } else if (quizType === 'task') {
      questions = getTaskQuestions(selection, 30);
      quizTitle = `${selection} Quiz`;
    } else if (quizType === 'approach') {
      questions = getApproachQuestions(selection, 20);
      const approachNames = { agile: 'Agile', predictive: 'Predictive', hybrid: 'Hybrid' };
      quizTitle = `${approachNames[selection]} Approach Quiz`;
    }
    
    if (questions.length === 0) {
      alert('No questions available. Please ensure task data is loaded.');
      return;
    }
    
    setQuizQuestions(questions);
    setQuizCurrentQuestion(0);
    setQuizAnswers([]);
    setQuizStartTime(Date.now());
    setQuizView('quiz');
  };

  const finishQuiz = () => {
    const endTime = Date.now();
    const timeSpent = Math.floor((endTime - quizStartTime) / 1000);
    const minutes = Math.floor(timeSpent / 60);
    const seconds = timeSpent % 60;
    const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    const results = {
      total: quizQuestions.length,
      correct: quizAnswers.filter(a => a.correct).length,
      timeSpent: timeString,
      questions: quizQuestions.map((q, idx) => ({
        id: q.id || idx,
        correct: quizAnswers[idx]?.correct || false,
        task: q.task || 'Unknown',
        domain: q.domain || 'unknown',
        weakness: !quizAnswers[idx]?.correct && q.explanation ? 'Review needed' : null
      }))
    };
    
    setQuizResults(results);
    setQuizView('results');
    
    // Save quiz results to localStorage
    try {
      const quizHistory = getQuizData();
      quizHistory.quizzes = quizHistory.quizzes || [];
      quizHistory.quizzes.push({
        ...results,
        date: new Date().toISOString(),
        percentage: Math.round((results.correct / results.total) * 100)
      });
      // Keep only last 100 quizzes
      if (quizHistory.quizzes.length > 100) {
        quizHistory.quizzes = quizHistory.quizzes.slice(-100);
      }
      localStorage.setItem('pmp-quiz-history-v1', JSON.stringify(quizHistory));
    } catch (e) {
      console.error('Error saving quiz history:', e);
    }
  };
  
  // Reusable Page Wrapper Component with consistent styling
  const PageWrapper = ({ children, title, subtitle, showBackButton = false, backAction = null, showProgress = false, progressValue = 0 }) => {
    return (
      <div className="min-h-screen w-full" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 30%, #172554 60%, #0f172a 100%)', color: '#fff', padding: '30px 40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '35px' }}>
            {showBackButton && (
              <button 
                onClick={backAction || (() => setView('executive-hud'))}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', cursor: 'pointer', transition: 'color 0.2s', background: 'none', border: 'none', padding: 0 }}
                onMouseEnter={(e) => e.target.style.color = '#fff'}
                onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.6)'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                </svg>
                BACK
              </button>
            )}
            
            <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end', height: '44px' }}>
              <div style={{ width: '10px', borderRadius: '3px', height: '55%', background: '#f97316' }}></div>
              <div style={{ width: '10px', borderRadius: '3px', height: '100%', background: '#8b5cf6' }}></div>
              <div style={{ width: '10px', borderRadius: '3px', height: '70%', background: '#ec4899' }}></div>
            </div>
            
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff', margin: 0 }}>{title}</h1>
              {subtitle && (
                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: '3px', margin: 0 }}>{subtitle}</p>
              )}
            </div>
            
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '25px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '25px', fontSize: '0.8rem' }}>
                <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', animation: 'pulse 2s infinite', position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', animation: 'pulse 2s infinite' }}></div>
                </div>
                Live
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 600, letterSpacing: '-1px' }}>{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
              </div>
              {showProgress && (
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', border: '3px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1rem', position: 'relative' }}>
                  {progressValue}%
                  <div style={{ position: 'absolute', top: '-3px', left: '-3px', width: 'calc(100% + 6px)', height: 'calc(100% + 6px)', borderRadius: '50%', border: '3px solid transparent', borderTopColor: '#22c55e', transform: 'rotate(-90deg)' }}></div>
                </div>
              )}
            </div>
          </div>
          
          {/* Content */}
          {children}
        </div>
      </div>
    );
  };

  // Condensed Dashboard Helper Components
  const OrbitalProgress = ({ progress, size = 80 }) => {
    const rings = [
      { radius: 32, width: 4, color: '#ff6b35' },
      { radius: 26, width: 3, color: '#00d4ff' },
      { radius: 20, width: 2, color: '#bf5af2' },
    ];

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          {rings.map((ring, i) => {
            const circumference = ring.radius * 2 * Math.PI;
            const offset = circumference - (progress / 100) * circumference;
            const isPulsing = pulseRing === i;
            return (
              <g key={i}>
                <circle cx={size/2} cy={size/2} r={ring.radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={ring.width}/>
                <circle cx={size/2} cy={size/2} r={ring.radius} fill="none" stroke={ring.color} strokeWidth={ring.width} strokeLinecap="round"
                  strokeDasharray={circumference} strokeDashoffset={offset} filter="url(#glow)" className="transition-all duration-1000"
                  style={{ opacity: isPulsing ? 1 : 0.7, filter: isPulsing ? `drop-shadow(0 0 8px ${ring.color})` : 'none' }}/>
              </g>
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-white">{progress}%</span>
        </div>
      </div>
    );
  };

  const SegmentedProgress = ({ progress, color, size = 56 }) => {
    const segments = 20;
    const activeSegments = Math.round((progress / 100) * segments);
    const radius = (size - 10) / 2;
    
    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          {Array.from({ length: segments }).map((_, i) => {
            const angle = (i / segments) * 360;
            const isActive = i < activeSegments;
            const segmentAngle = (360 / segments) - 4;
            const circumference = 2 * Math.PI * radius;
            return (
              <circle key={i} cx={size/2} cy={size/2} r={radius} fill="none"
                stroke={isActive ? color : 'rgba(255,255,255,0.08)'} strokeWidth="4"
                strokeDasharray={`${(segmentAngle / 360) * circumference} ${circumference}`}
                strokeDashoffset={-((angle / 360) * circumference)} strokeLinecap="butt"
                style={{ filter: isActive ? `drop-shadow(0 0 4px ${color})` : 'none', transition: 'all 0.3s ease' }}/>
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-white">{progress}%</span>
        </div>
      </div>
    );
  };

  // Task List Two Column Component
  const TaskListTwoColumn = () => {
    const tasksByDomain = getTasksByDomain();
    const domainColors = {
      'People Domain': '#ff6b35',
      'Process Domain': '#00d4ff',
      'Business Domain': '#bf5af2'
    };
    
    // Separate tasks into completed and not completed
    const completedTasks = {
      'People Domain': [],
      'Process Domain': [],
      'Business Domain': []
    };
    const notCompletedTasks = {
      'People Domain': [],
      'Process Domain': [],
      'Business Domain': []
    };
    
    Object.keys(tasksByDomain).forEach(domain => {
      tasksByDomain[domain].forEach(task => {
        if (task.status === 'completed') {
          completedTasks[domain].push(task);
        } else {
          notCompletedTasks[domain].push(task);
        }
      });
    });
    
    const renderTaskItem = (task, domain) => (
      <div key={task.name} className="p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors mb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 flex-1">
            {task.status === 'completed' && (
              <CheckIcon size={16} stroke="#10b981" className="inline-block" />
            )}
            <span className="text-sm text-white">{task.name}</span>
            {task.status !== 'completed' && (
              <span className="text-xs text-white/40">({task.status === 'started' ? 'started' : 'not started'})</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setSelectedTask(task.name); setView('learn-hub'); }}
            className="px-2 py-1 text-xs rounded border transition-colors hover:bg-white/10"
            style={{ borderColor: `${domainColors[domain]}40`, color: domainColors[domain] }}
          >
            Learn
          </button>
          <button
            onClick={() => { setSelectedTask(task.name); setView('practice-hub'); }}
            className="px-2 py-1 text-xs rounded border transition-colors hover:bg-white/10"
            style={{ borderColor: `${domainColors[domain]}40`, color: domainColors[domain] }}
          >
            Practice
          </button>
        </div>
      </div>
    );
    
    const renderDomainSection = (tasks, domain, title) => {
      if (tasks[domain].length === 0) return null;
      
      return (
        <div key={domain} className="mb-6">
          <h3 
            className="text-sm font-semibold uppercase tracking-wider mb-3 pb-2 border-b"
            style={{ color: domainColors[domain], borderColor: `${domainColors[domain]}40` }}
          >
            {domain.replace(' Domain', '')}
          </h3>
          <div className="space-y-2">
            {tasks[domain].map(task => renderTaskItem(task, domain))}
          </div>
        </div>
      );
    };
    
    return (
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column: Completed Tasks */}
        <div className="border rounded-lg p-4 overflow-y-auto max-h-[600px]" style={{ borderColor: 'rgba(0, 212, 255, 0.2)', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <h2 className="text-lg font-bold text-white mb-4">Completed Tasks</h2>
          {Object.keys(completedTasks).map(domain => renderDomainSection(completedTasks, domain, 'Completed'))}
          {Object.values(completedTasks).every(tasks => tasks.length === 0) && (
            <p className="text-sm text-white/40 text-center py-8">No completed tasks yet</p>
          )}
        </div>
        
        {/* Right Column: Not Completed Tasks */}
        <div className="border rounded-lg p-4 overflow-y-auto max-h-[600px]" style={{ borderColor: 'rgba(0, 212, 255, 0.2)', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <h2 className="text-lg font-bold text-white mb-4">Not Completed Tasks</h2>
          {Object.keys(notCompletedTasks).map(domain => renderDomainSection(notCompletedTasks, domain, 'Not Completed'))}
          {Object.values(notCompletedTasks).every(tasks => tasks.length === 0) && (
            <p className="text-sm text-white/40 text-center py-8">All tasks completed!</p>
          )}
        </div>
      </div>
    );
  };

  // Activities List By Domain Component
  const ActivitiesListByDomain = () => {
    const [expandedDomains, setExpandedDomains] = useState({});
    const [expandedTasks, setExpandedTasks] = useState({});
    
    const domainColors = {
      'People Domain': '#ff6b35',
      'Process Domain': '#00d4ff',
      'Business Domain': '#bf5af2'
    };
    
    const activityNames = {
      'pm-simulator': 'PM Simulator',
      'lightning-round': 'Lightning Round',
      'document-detective': 'Document Detective',
      'conflict-matcher': 'Conflict Matcher',
      'timeline-reconstructor': 'Timeline Reconstructor',
      'empathy-exercise': 'Empathy Exercise'
    };
    
    const allActivities = ['pm-simulator', 'lightning-round', 'document-detective', 'conflict-matcher', 'timeline-reconstructor', 'empathy-exercise'];
    
    // Organize activities by domain > task
    const activitiesByDomain = {};
    Object.keys(domainMap).forEach(domain => {
      activitiesByDomain[domain] = {};
      domainMap[domain].forEach(taskName => {
        activitiesByDomain[domain][taskName] = allActivities.map(activityKey => {
          const progress = getActivityProgress(taskName, activityKey);
          return {
            key: activityKey,
            name: activityNames[activityKey],
            completed: progress?.completed || false,
            attempts: progress?.attempts || 0,
            bestScore: progress?.bestScore || 0
          };
        });
      });
    });
    
    const toggleDomain = (domain) => {
      setExpandedDomains(prev => ({
        ...prev,
        [domain]: !prev[domain]
      }));
    };
    
    const toggleTask = (domain, task) => {
      const key = `${domain}-${task}`;
      setExpandedTasks(prev => ({
        ...prev,
        [key]: !prev[key]
      }));
    };
    
    const launchActivity = (taskName, activityKey) => {
      setSelectedTask(taskName);
      setView(activityKey);
    };
    
    return (
      <div className="border rounded-lg p-4 overflow-y-auto max-h-[600px]" style={{ borderColor: 'rgba(0, 212, 255, 0.2)', backgroundColor: 'rgba(0,0,0,0.4)' }}>
        <h2 className="text-lg font-bold text-white mb-4">Activities by Domain</h2>
        <div className="space-y-3">
          {Object.keys(activitiesByDomain).map(domain => {
            const isDomainExpanded = expandedDomains[domain];
            const domainColor = domainColors[domain];
            
            return (
              <div key={domain} className="border rounded-lg overflow-hidden" style={{ borderColor: `${domainColor}40` }}>
                {/* Domain Header */}
                <button
                  onClick={() => toggleDomain(domain)}
                  className="w-full p-3 flex items-center justify-between hover:bg-white/5 transition-colors"
                  style={{ backgroundColor: isDomainExpanded ? `${domainColor}20` : 'rgba(0,0,0,0.2)' }}
                >
                  <div className="flex items-center gap-3">
                    <svg 
                      className={`w-4 h-4 transition-transform duration-300 ${isDomainExpanded ? 'rotate-90' : ''}`}
                      style={{ color: domainColor }}
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <h3 
                      className="text-sm font-semibold uppercase tracking-wider"
                      style={{ color: domainColor }}
                    >
                      {domain.replace(' Domain', '')}
                    </h3>
                  </div>
                  <span className="text-xs text-white/40">
                    {domainMap[domain].length} tasks
                  </span>
                </button>
                
                {/* Tasks List */}
                {isDomainExpanded && (
                  <div className="border-t" style={{ borderColor: `${domainColor}30` }}>
                    {Object.keys(activitiesByDomain[domain]).map(taskName => {
                      const taskKey = `${domain}-${taskName}`;
                      const isTaskExpanded = expandedTasks[taskKey];
                      const taskActivities = activitiesByDomain[domain][taskName];
                      const completedCount = taskActivities.filter(a => a.completed).length;
                      
                      return (
                        <div key={taskName} className="border-b last:border-b-0" style={{ borderColor: `${domainColor}20` }}>
                          {/* Task Header */}
                          <button
                            onClick={() => toggleTask(domain, taskName)}
                            className="w-full p-2.5 pl-8 flex items-center justify-between hover:bg-white/5 transition-colors"
                            style={{ backgroundColor: isTaskExpanded ? `${domainColor}10` : 'transparent' }}
                          >
                            <div className="flex items-center gap-2">
                              <svg 
                                className={`w-3 h-3 transition-transform duration-300 ${isTaskExpanded ? 'rotate-90' : ''}`}
                                style={{ color: domainColor }}
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                              <span className="text-sm text-white">{taskName}</span>
                            </div>
                            <span className="text-xs text-white/40">
                              {completedCount}/{taskActivities.length} completed
                            </span>
                          </button>
                          
                          {/* Activities List */}
                          {isTaskExpanded && (
                            <div className="pl-12 pr-2 py-2 space-y-2">
                              {taskActivities.map(activity => (
                                <div 
                                  key={activity.key}
                                  className="flex items-center justify-between p-2 rounded border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
                                >
                                  <div className="flex items-center gap-2 flex-1">
                                    {activity.completed ? (
                                      <CheckIcon size={16} stroke="#10b981" className="inline-block" />
                                    ) : activity.attempts > 0 ? (
                                      <DashIcon size={16} stroke="#fbbf24" className="inline-block" />
                                    ) : (
                                      <CircleIcon size={16} stroke="rgba(255,255,255,0.3)" className="inline-block" />
                                    )}
                                    <span className="text-sm text-white">{activity.name}</span>
                                    {activity.completed && activity.bestScore > 0 && (
                                      <span className="text-xs text-white/40">({activity.bestScore}% best)</span>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => launchActivity(taskName, activity.key)}
                                    className="px-3 py-1 text-xs rounded border transition-colors hover:bg-white/10"
                                    style={{ borderColor: `${domainColor}40`, color: domainColor }}
                                  >
                                    Launch
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Mastered Tasks List Component
  const MasteredTasksList = () => {
    const [expandedDomains, setExpandedDomains] = useState({});
    const allTasks = domainMap ? Object.values(domainMap).flat().filter(Boolean) : [];
    const masteredTasks = allTasks.filter(taskName => isTaskMastered(taskName));
    const completeColor = '#00ff88';
    
    const domainColors = {
      'People Domain': '#ff6b35',
      'Process Domain': '#00d4ff',
      'Business Domain': '#bf5af2'
    };
    
    // Organize ALL tasks by domain (not just mastered)
    const tasksByDomain = {
      'People Domain': [],
      'Process Domain': [],
      'Business Domain': []
    };
    
    allTasks.forEach(taskName => {
      const domain = Object.keys(domainMap).find(d => domainMap[d].includes(taskName));
      if (domain) {
        tasksByDomain[domain].push(taskName);
      }
    });
    
    const toggleDomain = (domain) => {
      setExpandedDomains(prev => ({
        ...prev,
        [domain]: !prev[domain]
      }));
    };
    
    return (
      <div style={{ border: '1px solid rgba(0, 255, 136, 0.2)', borderRadius: '12px', padding: '16px', background: 'rgba(0,0,0,0.2)' }}>
        <div style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: completeColor }}>What is Mastery?</div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
            A task is mastered when you've opened all 3 learn pages (Overview, PMP Application, Deep Dive) and attempted all 6 activities. 
            <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.5)' }}> Mastery means exploration and attempt, not 100% scores.</span>
          </div>
          {masteredTasks.length > 0 && (
            <div style={{ marginTop: '8px', fontSize: '0.7rem', color: completeColor, fontWeight: 600 }}>
              {masteredTasks.length} task{masteredTasks.length !== 1 ? 's' : ''} mastered
            </div>
          )}
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '600px', overflowY: 'auto' }}>
          {Object.keys(tasksByDomain).map(domain => {
            if (tasksByDomain[domain].length === 0) return null;
            const isExpanded = expandedDomains[domain];
            const domainMasteredCount = tasksByDomain[domain].filter(t => isTaskMastered(t)).length;
            const domainTotalCount = tasksByDomain[domain].length;
            
            return (
              <div key={domain} style={{ border: `1px solid ${domainColors[domain]}30`, borderRadius: '8px', overflow: 'hidden', background: 'rgba(0,0,0,0.1)' }}>
                <div 
                  onClick={() => toggleDomain(domain)}
                  style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    cursor: 'pointer',
                    background: isExpanded ? `rgba(${domain === 'People Domain' ? '255, 107, 53' : domain === 'Process Domain' ? '0, 212, 255' : '191, 90, 242'}, 0.1)` : 'transparent',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (!isExpanded) {
                      e.currentTarget.style.background = `rgba(${domain === 'People Domain' ? '255, 107, 53' : domain === 'Process Domain' ? '0, 212, 255' : '191, 90, 242'}, 0.05)`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isExpanded) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                    <svg 
                      style={{ 
                        width: '16px', 
                        height: '16px', 
                        color: domainColors[domain], 
                        transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', 
                        transition: 'transform 0.3s' 
                      }}
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <h3 
                      style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: 600, 
                        textTransform: 'uppercase', 
                        letterSpacing: '1px', 
                        margin: 0,
                        color: domainColors[domain]
                      }}
                    >
                      {domain.replace(' Domain', '')}
                    </h3>
                    <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginLeft: '8px' }}>
                      ({domainMasteredCount}/{domainTotalCount} mastered)
                    </span>
                  </div>
                </div>
                
                {isExpanded && (
                  <div style={{ padding: '12px 16px', borderTop: `1px solid ${domainColors[domain]}20` }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {tasksByDomain[domain].map(taskName => {
                    const isMastered = isTaskMastered(taskName);
                    // Get completed learn pages
                    const learnTabs = ['overview', 'pmp-application', 'deep-dive'];
                    const completedLearnPages = learnTabs.filter(tab => 
                      localStorage.getItem(`learn-viewed-${taskName}-${tab}`)
                    );
                    
                    // Get attempted/completed activities
                    const activities = [
                      { key: 'pm-simulator', name: 'PM Simulator' },
                      { key: 'lightning-round', name: 'Lightning Round' },
                      { key: 'document-detective', name: 'Document Detective' },
                      { key: 'conflict-matcher', name: 'Conflict Matcher' },
                      { key: 'timeline-reconstructor', name: 'Timeline Reconstructor' },
                      { key: 'empathy-exercise', name: 'Empathy Exercise' }
                    ];
                    
                    const completedActivities = activities.filter(activity => {
                      const progress = progressData.completedActivities[taskName]?.[activity.key];
                      if (progress && (progress.attempts > 0 || progress.completed !== undefined)) {
                        return true;
                      }
                      if (activity.key === 'lightning-round') {
                        const bestScore = localStorage.getItem(`lightning-round-best-${taskName}`);
                        if (bestScore !== null) return true;
                      }
                      const accessed = localStorage.getItem(`activity-accessed-${taskName}-${activity.key}`);
                      return accessed !== null;
                    });
                    
                    return (
                      <div key={taskName}>
                        <div 
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.05)',
                            background: 'rgba(255,255,255,0.02)',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                            e.currentTarget.style.borderColor = `${domainColors[domain]}40`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                            <span style={{ color: isMastered ? completeColor : 'rgba(255,255,255,0.3)', fontSize: '0.875rem' }}>
                              {isMastered ? '✓' : '○'}
                            </span>
                            <span style={{ fontSize: '0.875rem', color: isMastered ? '#fff' : 'rgba(255,255,255,0.7)' }}>{taskName}</span>
                            {isMastered && (
                              <span style={{ 
                                fontSize: '0.65rem', 
                                padding: '2px 6px', 
                                borderRadius: '4px', 
                                background: `${completeColor}20`, 
                                color: completeColor,
                                fontWeight: 600
                              }}>
                                MASTERED
                              </span>
                            )}
                          </div>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              onClick={() => { setSelectedTask(taskName); setView('learn-hub'); }}
                              style={{
                                padding: '4px 10px',
                                fontSize: '0.7rem',
                                borderRadius: '6px',
                                border: `1px solid ${domainColors[domain]}40`,
                                background: `rgba(${domain === 'People Domain' ? '255, 107, 53' : domain === 'Process Domain' ? '0, 212, 255' : '191, 90, 242'}, 0.1)`,
                                color: domainColors[domain],
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = `rgba(${domain === 'People Domain' ? '255, 107, 53' : domain === 'Process Domain' ? '0, 212, 255' : '191, 90, 242'}, 0.2)`;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = `rgba(${domain === 'People Domain' ? '255, 107, 53' : domain === 'Process Domain' ? '0, 212, 255' : '191, 90, 242'}, 0.1)`;
                              }}
                            >
                              Learn
                            </button>
                            <button
                              onClick={() => { setSelectedTask(taskName); setView('practice-hub'); }}
                              style={{
                                padding: '4px 10px',
                                fontSize: '0.7rem',
                                borderRadius: '6px',
                                border: `1px solid ${domainColors[domain]}40`,
                                background: `rgba(${domain === 'People Domain' ? '255, 107, 53' : domain === 'Process Domain' ? '0, 212, 255' : '191, 90, 242'}, 0.1)`,
                                color: domainColors[domain],
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = `rgba(${domain === 'People Domain' ? '255, 107, 53' : domain === 'Process Domain' ? '0, 212, 255' : '191, 90, 242'}, 0.2)`;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = `rgba(${domain === 'People Domain' ? '255, 107, 53' : domain === 'Process Domain' ? '0, 212, 255' : '191, 90, 242'}, 0.1)`;
                              }}
                            >
                              Practice
                            </button>
                          </div>
                        </div>
                        
                        {/* Completed Areas Breakdown */}
                        <div style={{
                          marginTop: '6px',
                          padding: '10px 12px',
                          borderRadius: '6px',
                          background: 'rgba(0,0,0,0.2)',
                          border: '1px solid rgba(255,255,255,0.03)',
                          fontSize: '0.7rem'
                        }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            {/* Learn Pages */}
                            <div>
                              <div style={{ 
                                fontSize: '0.65rem', 
                                color: 'rgba(255,255,255,0.5)', 
                                marginBottom: '6px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                              }}>
                                Learn Pages ({completedLearnPages.length}/3)
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {learnTabs.map(tab => {
                                  const isCompleted = completedLearnPages.includes(tab);
                                  const displayName = tab === 'pmp-application' ? 'PMP Application' : tab.charAt(0).toUpperCase() + tab.slice(1);
                                  return (
                                    <div key={tab} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <span style={{ color: isCompleted ? completeColor : 'rgba(255,255,255,0.3)', fontSize: '0.65rem' }}>
                                        {isCompleted ? '✓' : '○'}
                                      </span>
                                      <span style={{ color: isCompleted ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)', fontSize: '0.65rem' }}>
                                        {displayName}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                            
                            {/* Activities */}
                            <div>
                              <div style={{ 
                                fontSize: '0.65rem', 
                                color: 'rgba(255,255,255,0.5)', 
                                marginBottom: '6px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                              }}>
                                Activities ({completedActivities.length}/6)
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {activities.map(activity => {
                                  const isCompleted = completedActivities.some(a => a.key === activity.key);
                                  return (
                                    <div key={activity.key} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <span style={{ color: isCompleted ? completeColor : 'rgba(255,255,255,0.3)', fontSize: '0.65rem' }}>
                                        {isCompleted ? '✓' : '○'}
                                      </span>
                                      <span style={{ color: isCompleted ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)', fontSize: '0.65rem' }}>
                                        {activity.name}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Badge3D Component
  const Badge3D = ({ name, icon, color = 'purple', tier = 'Rare', description, requirement, xp, earnedDate, isLocked = false, progress }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    
    const badgeColors = {
      purple: {
        outer: 'conic-gradient(from 0deg, #a78bfa, #8b5cf6, #7c3aed, #a78bfa, #c4b5fd, #a78bfa)',
        inner: 'linear-gradient(145deg, #e9d5ff 0%, #a78bfa 30%, #8b5cf6 70%, #6d28d9 100%)',
        edge: '#5b21b6',
        icon: '#4c1d95',
        tooltip: { bg: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa' }
      },
      orange: {
        outer: 'conic-gradient(from 0deg, #fb923c, #f97316, #ea580c, #fb923c, #fdba74, #fb923c)',
        inner: 'linear-gradient(145deg, #fed7aa 0%, #fb923c 30%, #f97316 70%, #c2410c 100%)',
        edge: '#c2410c',
        icon: '#7c2d12',
        tooltip: { bg: 'rgba(249, 115, 22, 0.2)', color: '#fb923c' }
      },
      teal: {
        outer: 'conic-gradient(from 0deg, #2dd4bf, #14b8a6, #0d9488, #2dd4bf, #5eead4, #2dd4bf)',
        inner: 'linear-gradient(145deg, #99f6e4 0%, #2dd4bf 30%, #14b8a6 70%, #0f766e 100%)',
        edge: '#0f766e',
        icon: '#134e4a',
        tooltip: { bg: 'rgba(45, 212, 191, 0.2)', color: '#2dd4bf' }
      },
      pink: {
        outer: 'conic-gradient(from 0deg, #f472b6, #ec4899, #db2777, #f472b6, #fbcfe8, #f472b6)',
        inner: 'linear-gradient(145deg, #fbcfe8 0%, #f472b6 30%, #ec4899 70%, #be185d 100%)',
        edge: '#be185d',
        icon: '#831843',
        tooltip: { bg: 'rgba(236, 72, 153, 0.2)', color: '#f472b6' }
      },
      cyan: {
        outer: 'conic-gradient(from 0deg, #22d3ee, #06b6d4, #0891b2, #22d3ee, #67e8f9, #22d3ee)',
        inner: 'linear-gradient(145deg, #a5f3fc 0%, #22d3ee 30%, #06b6d4 70%, #0e7490 100%)',
        edge: '#0e7490',
        icon: '#164e63',
        tooltip: { bg: 'rgba(34, 211, 238, 0.2)', color: '#22d3ee' }
      },
      gradient: {
        outer: 'conic-gradient(from 0deg, #a78bfa, #f472b6, #fb923c, #2dd4bf, #22d3ee, #a78bfa)',
        inner: 'linear-gradient(145deg, #fdf4ff 0%, #e9d5ff 20%, #f9a8d4 50%, #fed7aa 80%, #99f6e4 100%)',
        edge: 'linear-gradient(90deg, #5b21b6, #be185d, #0f766e)',
        icon: '#4c1d95',
        tooltip: { bg: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2))', color: '#a78bfa' }
      }
    };
    
    const badgeStyle = isLocked ? {
      outer: 'conic-gradient(from 0deg, #374151, #1f2937, #111827, #374151, #4b5563, #374151)',
      inner: 'linear-gradient(145deg, #4b5563 0%, #374151 50%, #1f2937 100%)',
      edge: '#1f2937',
      icon: '#6b7280',
      tooltip: { bg: 'rgba(75, 85, 99, 0.2)', color: '#9ca3af' }
    } : badgeColors[color] || badgeColors.purple;
    
    return (
      <div 
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div style={{ width: '60px', height: '60px', position: 'relative', cursor: 'pointer', transformStyle: 'preserve-3d', transition: 'transform 0.4s ease', opacity: isLocked ? 0.4 : 1 }}
          onMouseEnter={(e) => {
            if (!isLocked) {
              e.currentTarget.style.transform = 'rotateY(-15deg) rotateX(10deg) scale(1.15)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1)';
          }}
        >
          <div style={{ width: '100%', height: '100%', borderRadius: '50%', position: 'absolute', top: 0, left: 0, transformStyle: 'preserve-3d' }}>
            {/* Edge */}
            <div style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', transform: 'translateZ(-3px)', background: badgeStyle.edge, boxShadow: isLocked ? '0 4px 0 #111827, 0 7px 12px rgba(0,0,0,0.4)' : `0 4px 0 ${badgeStyle.edge}, 0 7px 12px rgba(139, 92, 246, 0.3)` }}></div>
            {/* Outer */}
            <div style={{ width: '100%', height: '100%', borderRadius: '50%', position: 'absolute', transform: 'translateZ(0px)', background: badgeStyle.outer, boxShadow: isLocked ? '0 5px 18px rgba(0,0,0,0.4)' : `0 5px 18px rgba(139, 92, 246, 0.4), inset 0 1px 0 rgba(255,255,255,0.4)` }}></div>
            {/* Inner */}
            <div style={{ position: 'absolute', top: '8%', left: '8%', width: '84%', height: '84%', borderRadius: '50%', transform: 'translateZ(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: badgeStyle.inner, boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.5), inset 0 -2px 4px rgba(0,0,0,0.3)' }}>
              <div style={{ width: '50%', height: '50%', transform: 'translateZ(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: badgeStyle.icon }}>
                  {typeof icon === 'object' && icon.props ? cloneElement(icon, { style: { width: '100%', height: '100%', fill: 'currentColor', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' } }) : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>}
                </div>
              </div>
            </div>
            {/* Shine */}
            <div style={{ position: 'absolute', top: '5%', left: '15%', width: '35%', height: '20%', background: 'linear-gradient(180deg, rgba(255,255,255,0.6) 0%, transparent 100%)', borderRadius: '50%', transform: 'translateZ(8px) rotate(-20deg)', pointerEvents: 'none' }}></div>
            {/* Status */}
            <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem', fontWeight: 700, transform: 'translateZ(10px)', border: '2px solid #0f172a', background: isLocked ? 'linear-gradient(135deg, #4b5563, #374151)' : 'linear-gradient(135deg, #22c55e, #16a34a)', color: isLocked ? '#9ca3af' : 'white', boxShadow: isLocked ? 'none' : '0 2px 5px rgba(34, 197, 94, 0.5)' }}>
              {isLocked ? 'ðŸ”’' : '“'}
            </div>
          </div>
        </div>
        
        <div style={{ marginTop: '8px', fontWeight: 600, fontSize: '0.65rem', textAlign: 'center', maxWidth: '70px', color: isLocked ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.85)' }}>
          {name}
        </div>
        
        {/* Tooltip */}
        {showTooltip && (
          <div style={{
            position: 'absolute',
            bottom: 'calc(100% + 10px)',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '220px',
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '12px',
            zIndex: 100,
            boxShadow: '0 12px 35px rgba(0,0,0,0.5)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: badgeStyle.tooltip.bg }}>
                <div style={{ width: '14px', height: '14px' }}>{icon}</div>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.8rem' }}>{name}</div>
                <div style={{ fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: badgeStyle.tooltip.color }}>{tier}</div>
              </div>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.35, marginBottom: '8px' }}>{description}</div>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '6px', padding: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>How to Earn</div>
              <div style={{ fontSize: '0.65rem', fontWeight: 500, color: badgeStyle.tooltip.color }}>{requirement}</div>
            </div>
            {isLocked && progress !== undefined && (
              <div style={{ marginTop: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.55rem', color: 'rgba(255,255,255,0.5)', marginBottom: '3px' }}>
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <div style={{ height: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: '2px', width: `${progress}%`, background: 'linear-gradient(90deg, #8b5cf6, #ec4899, #f97316)' }}></div>
                </div>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', background: 'rgba(45, 212, 191, 0.12)', color: '#2dd4bf', padding: '2px 6px', borderRadius: '8px', fontSize: '0.55rem', fontWeight: 600 }}>
                ⚡ +{xp} XP
              </div>
              {earnedDate && <div style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.3)' }}>{earnedDate}</div>}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Keep old GlobalFooter for backward compatibility if needed
  const GlobalFooter = GlobalNavFooter;

  // Practice Quizzes View - Complete Redesign
  if (view === 'practice-quizzes') {
    // Task data organized by domain
    const quizTaskData = {
      people: {
        name: 'People',
        color: 'violet',
        gradient: 'from-violet-600 to-purple-600',
        icon: '💪',
        percentage: '42%',
        tasks: domainMap['People Domain'].map((name, idx) => ({ id: idx + 1, name, short: name.split(' ').slice(-1)[0] }))
      },
      process: {
        name: 'Process',
        color: 'cyan',
        gradient: 'from-cyan-500 to-blue-600',
        icon: '',
        percentage: '50%',
        tasks: domainMap['Process Domain'].map((name, idx) => ({ id: idx + 15, name, short: name.split(' ').slice(-1)[0] }))
      },
      business: {
        name: 'Business Environment',
        color: 'emerald',
        gradient: 'from-emerald-500 to-teal-600',
        icon: '',
        percentage: '8%',
        tasks: domainMap['Business Domain'].map((name, idx) => ({ id: idx + 32, name, short: name.split(' ').slice(-1)[0] }))
      }
    };

    // Approach data
    const approachData = {
      agile: {
        name: 'Agile',
        subtitle: 'Adaptive & Iterative',
        gradient: 'from-emerald-500 to-teal-600',
        borderColor: 'border-emerald-500',
        icon: '',
        description: 'Scrum, Kanban, sprints, user stories, continuous delivery',
        concepts: ['Sprints & Iterations', 'Product Backlog', 'Daily Standups', 'Retrospectives', 'User Stories', 'Velocity'],
        examTip: '~50% of PMP questions have agile context'
      },
      predictive: {
        name: 'Predictive',
        subtitle: 'Plan-Driven & Sequential',
        gradient: 'from-blue-500 to-indigo-600',
        borderColor: 'border-blue-500',
        icon: '',
        description: 'Waterfall, detailed planning, phase gates, formal change control',
        concepts: ['WBS & Scope Baseline', 'Critical Path', 'Earned Value', 'Change Control Board', 'Phase Gates', 'Formal Sign-offs'],
        examTip: 'Foundation of traditional PM knowledge'
      },
      hybrid: {
        name: 'Hybrid',
        subtitle: 'Best of Both Worlds',
        gradient: 'from-orange-500 to-amber-500',
        borderColor: 'border-orange-500',
        icon: '',
        description: 'Combining approaches based on project needs and context',
        concepts: ['Tailoring', 'Adaptive Planning', 'Rolling Wave', 'Mixed Teams', 'Phased Agile', 'Context-Driven'],
        examTip: 'PMI emphasizes choosing the right approach'
      }
    };

    // Filter tasks based on search
    const filterTasks = (tasks) => {
      if (!quizSearchTerm) return tasks;
      return tasks.filter(t => 
        t.name.toLowerCase().includes(quizSearchTerm.toLowerCase()) ||
        t.short.toLowerCase().includes(quizSearchTerm.toLowerCase())
      );
    };

    // Main Quiz Selection View
    const MainView = () => {
      const quizOptions = [
        {
          id: 'random',
          title: 'Random 15',
          description: '15 questions across all domains',
          icon: '',
          color: 'from-violet-600 to-purple-600',
          borderColor: 'border-violet-500',
          badge: 'POPULAR',
          action: () => startQuiz('random')
        },
        {
          id: 'domain',
          title: 'By Domain',
          description: 'People • Process • Business',
          icon: '',
          color: 'from-cyan-500 to-blue-600',
          borderColor: 'border-cyan-500',
          action: () => setQuizView('domain-select')
        },
        {
          id: 'task',
          title: 'By Task Area',
          description: 'Target specific ECO tasks',
          icon: '',
          color: 'from-emerald-500 to-teal-600',
          borderColor: 'border-emerald-500',
          action: () => setQuizView('task-select')
        },
        {
          id: 'approach',
          title: 'By Approach',
          description: 'Agile • Predictive • Hybrid',
          icon: '⚡',
          color: 'from-orange-500 to-amber-500',
          borderColor: 'border-orange-500',
          action: () => setQuizView('approach-select')
        }
      ];

      return (
        <>
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Practice Quizzes
            </h1>
            <p className="text-slate-400 text-sm mt-1">Choose your challenge</p>
          </div>

          <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-4">
            {quizOptions.map((quiz) => (
              <div
                key={quiz.id}
                onClick={quiz.action}
                className={`
                  relative cursor-pointer rounded-2xl
                  bg-slate-900/80 backdrop-blur-sm
                  border-2 transition-all duration-300
                  ${quizHoveredCard === quiz.id ? `${quiz.borderColor} scale-[1.02]` : 'border-slate-800'}
                  flex flex-col justify-center items-center text-center p-6
                `}
                onMouseEnter={() => setQuizHoveredCard(quiz.id)}
                onMouseLeave={() => setQuizHoveredCard(null)}
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${quiz.color} opacity-0 blur-xl transition-opacity duration-300 -z-10 ${quizHoveredCard === quiz.id ? 'opacity-30' : ''}`}></div>
                
                {quiz.badge && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 rounded-full">
                    {quiz.badge}
                  </span>
                )}

                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${quiz.color} flex items-center justify-center text-3xl mb-4 shadow-lg transition-transform duration-300 ${quizHoveredCard === quiz.id ? 'scale-110' : ''}`}>
                  {quiz.icon}
                </div>

                <h3 className="text-xl font-bold mb-1">{quiz.title}</h3>
                <p className="text-sm text-slate-400 mb-4">{quiz.description}</p>

                <button className={`px-5 py-2 rounded-lg bg-gradient-to-r ${quiz.color} font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center gap-2`}>
                  Select <span>â†’</span>
                </button>
              </div>
            ))}
          </div>
        </>
      );
    };

    // Domain Selection View
    const DomainSelectView = () => {
      const domains = [
        { key: 'people', ...quizTaskData.people },
        { key: 'process', ...quizTaskData.process },
        { key: 'business', ...quizTaskData.business }
      ];

      return (
        <>
          <div className="text-center mb-6">
            <button onClick={() => setQuizView('main')} className="text-slate-400 hover:text-white text-sm mb-2 flex items-center gap-1 mx-auto">
              â† Back to Quiz Types
            </button>
            <h1 className="text-3xl font-bold text-white">Select Domain</h1>
            <p className="text-slate-400 text-sm mt-1">Choose a domain to focus your practice</p>
          </div>

          <div className="flex-1 flex gap-4 items-stretch">
            {domains.map((domain) => (
              <div
                key={domain.key}
                onClick={() => startQuiz('domain', domain.key)}
                className="flex-1 cursor-pointer rounded-2xl bg-slate-900/80 backdrop-blur-sm border-2 transition-all duration-300 hover:scale-[1.02] flex flex-col p-6 relative overflow-hidden group"
                style={{ borderColor: '#1e293b' }}
                onMouseEnter={(e) => {
                  const colorMap = { 'violet': '#8b5cf6', 'cyan': '#06b6d4', 'emerald': '#10b981' };
                  e.currentTarget.style.borderColor = colorMap[domain.color] || '#475569';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#1e293b';
                }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${domain.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                
                <div className="absolute top-4 right-4 px-3 py-1 bg-slate-800 rounded-full text-xs font-bold text-slate-300">
                  {domain.percentage} of exam
                </div>

                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${domain.gradient} flex items-center justify-center text-4xl mb-4 shadow-lg`}>
                  {domain.icon}
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">{domain.name}</h2>
                
                <p className="text-slate-400 mb-4">{domain.tasks.length} task areas</p>

                <div className="flex-1 space-y-1">
                  {domain.tasks.slice(0, 4).map((task, i) => (
                    <div key={i} className="text-xs text-slate-500 truncate">• {task.short}</div>
                  ))}
                  {domain.tasks.length > 4 && (
                    <div className="text-xs text-slate-600">+{domain.tasks.length - 4} more...</div>
                  )}
                </div>

                <button className={`mt-4 w-full py-3 rounded-xl bg-gradient-to-r ${domain.gradient} font-semibold transition-all hover:shadow-lg`}>
                  Start {domain.name} Quiz â†’
                </button>
              </div>
            ))}
          </div>
        </>
      );
    };

    // Approach Selection View
    const ApproachSelectView = () => {
      const approaches = [
        { key: 'agile', ...approachData.agile },
        { key: 'predictive', ...approachData.predictive },
        { key: 'hybrid', ...approachData.hybrid }
      ];

      return (
        <>
          <div className="text-center mb-6">
            <button onClick={() => setQuizView('main')} className="text-slate-400 hover:text-white text-sm mb-2 flex items-center gap-1 mx-auto">
              â† Back to Quiz Types
            </button>
            <h1 className="text-3xl font-bold text-white">Select Approach</h1>
            <p className="text-slate-400 text-sm mt-1">Choose a methodology to focus your practice</p>
          </div>

          <div className="flex-1 flex gap-4 items-stretch">
            {approaches.map((approach) => (
              <div
                key={approach.key}
                onClick={() => startQuiz('approach', approach.key)}
                className={`
                  flex-1 cursor-pointer rounded-2xl
                  bg-slate-900/80 backdrop-blur-sm
                  border-2 border-slate-800 hover:${approach.borderColor}
                  transition-all duration-300 hover:scale-[1.02]
                  flex flex-col p-6 relative overflow-hidden group
                `}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${approach.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${approach.gradient} flex items-center justify-center text-4xl mb-4 shadow-lg`}>
                  {approach.icon}
                </div>

                <h2 className="text-2xl font-bold text-white mb-1">{approach.name}</h2>
                <p className="text-sm text-slate-400 mb-3">{approach.subtitle}</p>
                
                <p className="text-xs text-slate-500 mb-4">{approach.description}</p>

                <div className="flex-1">
                  <div className="text-xs text-slate-400 mb-2 font-medium">Key Concepts:</div>
                  <div className="flex flex-wrap gap-1">
                    {approach.concepts.map((concept, i) => (
                      <span key={i} className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 p-2 bg-slate-800/50 rounded-lg">
                  <span className="text-xs text-amber-400 flex items-center gap-1"><WarningIcon size={14} stroke="#fbbf24" className="inline-block" /> {approach.examTip}</span>
                </div>

                <button className={`mt-4 w-full py-3 rounded-xl bg-gradient-to-r ${approach.gradient} font-semibold transition-all hover:shadow-lg`}>
                  Start {approach.name} Quiz â†’
                </button>
              </div>
            ))}
          </div>
        </>
      );
    };

    // Task Area Selection View
    const TaskSelectView = () => {
      return (
        <>
          <div className="text-center mb-4">
            <button onClick={() => setQuizView('main')} className="text-slate-400 hover:text-white text-sm mb-2 flex items-center gap-1 mx-auto">
              â† Back to Quiz Types
            </button>
            <h1 className="text-2xl font-bold text-white">Select Task Area</h1>
            
            <div className="mt-3 max-w-md mx-auto relative">
              <input
                type="text"
                placeholder="Search 35 task areas..."
                value={quizSearchTerm}
                onChange={(e) => setQuizSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <span className="absolute left-3 top-2.5 text-slate-500">ðŸ”</span>
            </div>
          </div>

          <div className="flex-1 flex gap-4 overflow-hidden">
            <div className="w-48 flex flex-col gap-2">
              {Object.entries(quizTaskData).map(([key, domain]) => (
                <button
                  key={key}
                  onClick={() => setQuizExpandedDomain(key)}
                  className={`
                    p-3 rounded-xl text-left transition-all duration-300
                    ${quizExpandedDomain === key 
                      ? `bg-gradient-to-r ${domain.gradient} text-white` 
                      : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'}
                  `}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{domain.icon}</span>
                    <div>
                      <div className="font-semibold text-sm">{domain.name}</div>
                      <div className="text-xs opacity-70">{domain.tasks.length} tasks</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex-1 bg-slate-900/50 rounded-2xl p-4 overflow-y-auto">
              <div className="grid grid-cols-3 gap-2">
                {filterTasks(quizTaskData[quizExpandedDomain].tasks).map((task) => (
                  <button
                    key={task.id}
                    onClick={() => startQuiz('task', task.name)}
                    className="p-3 rounded-xl text-left transition-all duration-200 bg-slate-800/50 hover:bg-slate-700 border hover:scale-[1.02] group"
                    style={{ borderColor: '#334155' }}
                    onMouseEnter={(e) => {
                      const colorMap = { 'violet': '#8b5cf6', 'cyan': '#06b6d4', 'emerald': '#10b981' };
                      e.currentTarget.style.borderColor = colorMap[quizTaskData[quizExpandedDomain].color] || '#334155';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#334155';
                    }}
                  >
                    <div className="text-lg mb-1">#{task.id}</div>
                    <div className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                      {task.name}
                    </div>
                  </button>
                ))}
              </div>
              
              {filterTasks(quizTaskData[quizExpandedDomain].tasks).length === 0 && (
                <div className="text-center text-slate-500 py-8">
                  No tasks found matching "{quizSearchTerm}"
                </div>
              )}
            </div>
          </div>
        </>
      );
    };

    // Quiz Results View
    const ResultsView = () => {
      if (!quizResults) return null;
      
      const percentage = Math.round((quizResults.correct / quizResults.total) * 100);
      const isPassing = percentage >= 70;
      
      // Group incorrect answers by domain
      const incorrectByDomain = quizResults.questions
        .filter(q => !q.correct)
        .reduce((acc, q) => {
          if (!acc[q.domain]) acc[q.domain] = [];
          acc[q.domain].push(q);
          return acc;
        }, {});

      return (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="text-center mb-4">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br ${isPassing ? 'from-emerald-500 to-teal-600' : 'from-orange-500 to-red-500'} mb-3`}>
              <span className="text-3xl font-bold">{percentage}%</span>
            </div>
            <h1 className="text-2xl font-bold text-white">
              {isPassing ? '🎉 Great Job!' : '📚 Keep Studying!'}
            </h1>
            <p className="text-slate-400 text-sm">
              {quizResults.correct} of {quizResults.total} correct • {quizResults.timeSpent} elapsed
            </p>
          </div>

          <div className="flex-1 flex gap-4 overflow-hidden">
            <div className="w-1/2 bg-slate-900/50 rounded-2xl p-4 overflow-y-auto">
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                <SearchIcon size={18} stroke="currentColor" className="inline-block" /> Question Breakdown
              </h3>
              <div className="space-y-2">
                {quizResults.questions.map((q, i) => (
                  <div 
                    key={i}
                    className={`flex items-center gap-3 p-2 rounded-lg ${q.correct ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${q.correct ? 'bg-emerald-500' : 'bg-red-500'}`}>
                      {q.correct ? '“' : '✗'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white truncate">{q.task}</div>
                      <div className="text-xs text-slate-500 capitalize">{q.domain}</div>
                    </div>
                    {!q.correct && (
                      <span className="text-xs text-red-400 truncate max-w-24">{q.weakness}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="w-1/2 bg-slate-900/50 rounded-2xl p-4 overflow-y-auto">
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                <ChartIcon size={18} stroke="currentColor" className="inline-block mr-2" /> Areas to Study
              </h3>
              
              {Object.keys(incorrectByDomain).length === 0 ? (
                <div className="text-center py-8">
                  <span className="text-4xl mb-2 block">ðŸ†</span>
                  <p className="text-emerald-400 font-medium">Perfect Score!</p>
                  <p className="text-slate-500 text-sm">No areas need review</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(incorrectByDomain).map(([domain, questions]) => (
                    <div key={domain} className="bg-slate-800/50 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{quizTaskData[domain]?.icon || '📚'}</span>
                        <span className="font-medium text-white">{quizTaskData[domain]?.name || domain}</span>
                        <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                          {questions.length} missed
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        {questions.map((q, i) => (
                          <div key={i} className="flex items-center justify-between bg-slate-900/50 rounded-lg p-2">
                            <div>
                              <div className="text-sm text-white">{q.task}</div>
                              <div className="text-xs text-orange-400">Review: {q.weakness || 'General concepts'}</div>
                            </div>
                            <button 
                              onClick={(e) => {
                                createRipple(e);
                                setSelectedTask(q.task);
                                setView('learn-hub');
                                setSubView('overview');
                                setQuizView('main');
                              }}
                              className={`px-3 py-1 rounded-lg bg-gradient-to-r ${quizTaskData[domain]?.gradient || 'from-slate-600 to-slate-700'} text-xs font-medium hover:scale-105 transition-transform`}
                            >
                              Study â†’
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-slate-700 space-y-2">
                <button 
                  onClick={() => {
                    setQuizView('quiz');
                    setQuizCurrentQuestion(0);
                    setQuizAnswers([]);
                    setQuizStartTime(Date.now());
                  }}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold hover:scale-[1.02] transition-transform"
                >
                  <><FileIcon size={18} stroke="currentColor" className="inline-block mr-2" /> Retry Quiz</>
                </button>
                <button 
                  onClick={() => {
                    setQuizView('main');
                    setQuizResults(null);
                    setQuizSelectedDomain(null);
                    setQuizSelectedTask(null);
                    setQuizSelectedApproach(null);
                  }}
                  className="w-full py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  â† Back to Quiz Selection
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    };

    // Quiz View - Actual Quiz Component
    const QuizView = () => {
      if (!quizQuestions || quizQuestions.length === 0) {
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">ðŸ“</div>
              <h2 className="text-2xl font-bold text-white mb-2">Loading Questions...</h2>
            </div>
          </div>
        );
      }

      const currentQ = quizQuestions[quizCurrentQuestion];
      const progress = ((quizCurrentQuestion + 1) / quizQuestions.length) * 100;
      const hasAnswered = quizAnswers[quizCurrentQuestion] !== undefined;

      const handleAnswer = (answerIndex) => {
        if (hasAnswered) return;
        
        const isCorrect = answerIndex === currentQ.correct;
        const newAnswers = [...quizAnswers];
        newAnswers[quizCurrentQuestion] = {
          answer: answerIndex,
          correct: isCorrect
        };
        setQuizAnswers(newAnswers);

        // Auto-advance after 2 seconds
        setTimeout(() => {
          if (quizCurrentQuestion < quizQuestions.length - 1) {
            setQuizCurrentQuestion(quizCurrentQuestion + 1);
          } else {
            finishQuiz();
          }
        }, 2000);
      };

      const handleNext = () => {
        if (quizCurrentQuestion < quizQuestions.length - 1) {
          setQuizCurrentQuestion(quizCurrentQuestion + 1);
        } else {
          finishQuiz();
        }
      };

      const handlePrevious = () => {
        if (quizCurrentQuestion > 0) {
          setQuizCurrentQuestion(quizCurrentQuestion - 1);
        }
      };

      return (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-slate-400 mb-2">
              <span>Question {quizCurrentQuestion + 1} of {quizQuestions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Question Card */}
          <div className="flex-1 bg-slate-900/50 rounded-2xl p-6 overflow-y-auto mb-4">
            <div className="mb-4">
              <span className="text-xs text-slate-500 uppercase">{currentQ.task || 'General'}</span>
            </div>
            
            <h2 className="text-xl font-bold text-white mb-6 leading-relaxed">
              {currentQ.question}
            </h2>

            <div className="space-y-3">
              {currentQ.options.map((option, idx) => {
                const isSelected = hasAnswered && quizAnswers[quizCurrentQuestion].answer === idx;
                const isCorrect = idx === currentQ.correct;
                const showFeedback = hasAnswered;
                
                let buttonClass = 'w-full text-left p-4 rounded-xl border-2 transition-all ';
                if (showFeedback) {
                  if (isCorrect) {
                    buttonClass += 'bg-emerald-500/20 border-emerald-500 text-emerald-100';
                  } else if (isSelected) {
                    buttonClass += 'bg-red-500/20 border-red-500 text-red-100';
                  } else {
                    buttonClass += 'bg-slate-800/50 border-slate-700 text-slate-400';
                  }
                } else {
                  buttonClass += 'bg-slate-800/50 border-slate-700 text-white hover:border-cyan-500 hover:bg-slate-800 cursor-pointer';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={hasAnswered}
                    className={buttonClass}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                        showFeedback && isCorrect ? 'bg-emerald-500' :
                        showFeedback && isSelected ? 'bg-red-500' :
                        'bg-slate-700'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1">{option}</span>
                      {showFeedback && isCorrect && <span className="text-emerald-400">“</span>}
                      {showFeedback && isSelected && !isCorrect && <XIcon size={16} stroke="#f87171" className="inline-block" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {hasAnswered && currentQ.explanation && (
              <div className="mt-6 p-4 bg-blue-500/10 border-l-4 border-blue-500 rounded-lg">
                <p className="text-sm text-blue-200 font-semibold mb-2">Explanation:</p>
                <p className="text-sm text-slate-300">{currentQ.explanation}</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between gap-4">
            <button
              onClick={handlePrevious}
              disabled={quizCurrentQuestion === 0}
              className="px-6 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              â† Previous
            </button>
            
            <button
              onClick={handleNext}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold hover:scale-105 transition-transform"
            >
              {quizCurrentQuestion === quizQuestions.length - 1 ? 'Finish Quiz â†’' : 'Next â†’'}
            </button>
          </div>
        </div>
      );
    };

    return (
      <div className="h-screen bg-slate-950 text-white p-6 flex flex-col overflow-hidden">
        {/* Background glows */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-cyan-600/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 flex flex-col h-full max-w-5xl mx-auto w-full">
          {quizView === 'main' && <MainView />}
          {quizView === 'domain-select' && <DomainSelectView />}
          {quizView === 'task-select' && <TaskSelectView />}
          {quizView === 'approach-select' && <ApproachSelectView />}
          {quizView === 'quiz' && <QuizView />}
          {quizView === 'results' && <ResultsView />}

          {/* Footer Nav */}
          <div className="flex justify-center gap-8 pt-4 mt-4 border-t border-slate-800">
            <button onClick={(e) => { createRipple(e); handleViewChange('strategy-suite'); }} className="executive-font btn-ripple">LEARN</button>
            <button onClick={(e) => { createRipple(e); handleViewChange('practice-hub'); }} className="executive-font btn-ripple">PRACTICE</button>
            <button className="executive-font btn-ripple">QUIZZES</button>
            <button onClick={(e) => { createRipple(e); handleViewChange('strategy-suite'); }} className="executive-font btn-ripple">TASK AREAS</button>
            <button onClick={(e) => { createRipple(e); handleViewChange('progress-stats'); }} className="executive-font btn-ripple">MY PROGRESS</button>
            <button onClick={(e) => { createRipple(e); handleViewChange('executive-hud'); }} className="executive-font btn-ripple">HOME</button>
          </div>
        </div>
      </div>
    );
  }

  // PM Simulator Activity View
  if (view === 'pm-simulator') {
    // Handle both stress_test (old format) and pm_simulator (new format)
    const stressTests = currentTask.practice?.pm_simulator || currentTask.practice?.stress_test || [];
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
              â† Back to Practice Hub
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
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button 
                  onClick={(e) => {
                    createRipple(e);
                    setSelectedTask(selectedTask);
                    setView('learn-hub');
                    setSubView('overview');
                    setSimulatorState({ currentScene: 0, morale: 75, projectHealth: 75, trust: 75, choices: [], showingFeedback: false, showEndScreen: false });
                  }}
                  className="px-4 py-2 executive-font text-xs text-blue-400 hover:text-blue-300 uppercase font-semibold transition-colors flex items-center gap-2 border border-blue-400/30 hover:border-blue-400/50 rounded-lg btn-ripple"
                >
                  Learn More about this task
                </button>
                <button 
                  onClick={(e) => {
                    createRipple(e);
                    setSimulatorState({ currentScene: 0, morale: 75, projectHealth: 75, trust: 75, choices: [], showingFeedback: false, showEndScreen: false });
                    handleViewChange('strategy-suite');
                  }}
                  className="px-4 py-2 executive-font text-xs text-slate-400 hover:text-white uppercase font-semibold transition-colors flex items-center gap-2 btn-ripple"
                >
                  Back to Activity Selector
                </button>
              </div>
            </div>
            <h1 className="executive-font text-5xl font-bold text-white tracking-tight">{missionStatus}</h1>
          </header>

          <div className="glass-card p-8 mb-6">
            <div className="text-center mb-6">
              <h2 className="executive-font text-3xl font-bold text-white mb-2">Final Score: {finalScore}%</h2>
              {isNewBest && (
                <p className="text-emerald-400 text-xl font-bold animate-pulse mt-2">ðŸ† NEW HIGH SCORE! ðŸ†</p>
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
            <div className="flex gap-4">
              <button 
                onClick={(e) => {
                  createRipple(e);
                  setSelectedTask(selectedTask);
                  setView('learn-hub');
                  setSubView('overview');
                  setSimulatorState({ currentScene: 0, morale: 75, projectHealth: 75, trust: 75, choices: [], showingFeedback: false, showEndScreen: false });
                }}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors executive-font btn-ripple"
              >
                Learn More about this task
              </button>
              <button 
                onClick={(e) => {
                  createRipple(e);
                  setSimulatorState({ currentScene: 0, morale: 75, projectHealth: 75, trust: 75, choices: [], showingFeedback: false, showEndScreen: false });
                  setView('practice-hub');
                }}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors executive-font btn-ripple"
              >
                Back to Activity Selector
              </button>
            </div>
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
              onClick={(e) => {
                createRipple(e);
                setSelectedTask(selectedTask);
                setView('learn-hub');
                setSubView('overview');
                setSimulatorState({ currentScene: 0, morale: 75, projectHealth: 75, trust: 75, choices: [], showingFeedback: false, showEndScreen: false });
              }}
              className="px-4 py-2 executive-font text-xs text-blue-400 hover:text-blue-300 uppercase font-semibold transition-colors flex items-center gap-2 border border-blue-400/30 hover:border-blue-400/50 rounded-lg btn-ripple"
            >
              Learn More about this task
            </button>
            <button 
              onClick={(e) => {
                createRipple(e);
                setSimulatorState({ currentScene: 0, morale: 75, projectHealth: 75, trust: 75, choices: [], showingFeedback: false, showEndScreen: false });
                handleViewChange('strategy-suite');
              }}
              className="px-4 py-2 executive-font text-xs text-slate-400 hover:text-white uppercase font-semibold transition-colors flex items-center gap-2 btn-ripple"
            >
              Back to Activity Selector
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
                  <span className="text-white font-bold">{simulatorState.morale}% {simulatorState.moraleChange > 0 ? 'â†—ï¸' : simulatorState.moraleChange < 0 ? 'â†˜ï¸' : ''} {simulatorState.moraleChange !== 0 && `${simulatorState.moraleChange > 0 ? '+' : ''}${simulatorState.moraleChange}%`}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-4">
                  <div className={`${getBarColor(simulatorState.morale)} h-4 rounded-full status-meter`} style={{width: `${simulatorState.morale}%`}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-white font-semibold">Project Health</span>
                  <span className="text-white font-bold">{simulatorState.projectHealth}% {simulatorState.projectHealthChange > 0 ? 'â†—ï¸' : simulatorState.projectHealthChange < 0 ? 'â†˜ï¸' : ''} {simulatorState.projectHealthChange !== 0 && `${simulatorState.projectHealthChange > 0 ? '+' : ''}${simulatorState.projectHealthChange}%`}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-4">
                  <div className={`${getBarColor(simulatorState.projectHealth)} h-4 rounded-full status-meter`} style={{width: `${simulatorState.projectHealth}%`}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-white font-semibold">Trust</span>
                  <span className="text-white font-bold">{simulatorState.trust}% {simulatorState.trustChange > 0 ? 'â†—ï¸' : simulatorState.trustChange < 0 ? 'â†˜ï¸' : ''} {simulatorState.trustChange !== 0 && `${simulatorState.trustChange > 0 ? '+' : ''}${simulatorState.trustChange}%`}</span>
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
              {isGoodChoice ? '… EXCELLENT CHOICE!' : '<WarningIcon size={16} stroke="#f87171" className="inline-block mr-1" /> NOT IDEAL'}
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
            <div className="flex items-center gap-4">
              <button 
                onClick={(e) => {
                  createRipple(e);
                  setSelectedTask(selectedTask);
                  setView('learn-hub');
                  setSubView('overview');
                  setSimulatorState({ currentScene: 0, morale: 75, projectHealth: 75, trust: 75, choices: [], showingFeedback: false, showEndScreen: false });
                }}
                className="px-4 py-2 executive-font text-xs text-blue-400 hover:text-blue-300 uppercase font-semibold transition-colors flex items-center gap-2 border border-blue-400/30 hover:border-blue-400/50 rounded-lg btn-ripple"
              >
                Learn More about this task
              </button>
              <button 
                onClick={(e) => {
                  createRipple(e);
                  setSimulatorState({ currentScene: 0, morale: 75, projectHealth: 75, trust: 75, choices: [], showingFeedback: false, showEndScreen: false });
                  setView('practice-hub');
                }}
                className="px-4 py-2 executive-font text-xs text-slate-400 hover:text-white uppercase font-semibold transition-colors flex items-center gap-2 btn-ripple"
              >
                Back to Activity Selector
              </button>
            </div>
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
    // Handle both reflex_prompts (old format) and lightning_round (new format)
    const reflexPrompts = currentTask.practice?.lightning_round || currentTask.practice?.reflex_prompts || [];
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
                â† Back
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
                  onClick={(e) => { 
                    createRipple(e); 
                    resetQuiz(); 
                    setSelectedTask(selectedTask);
                    setView('learn-hub');
                    setSubView('overview');
                  }}
                  className="px-4 py-2 executive-font text-xs text-blue-400 hover:text-blue-300 uppercase font-semibold transition-colors flex items-center gap-2 border border-blue-400/30 hover:border-blue-400/50 rounded-lg btn-ripple"
                >
                  Learn More about this task
                </button>
                <button 
                  onClick={(e) => { createRipple(e); resetQuiz(); setView('practice-hub'); }}
                  className="px-4 py-2 executive-font text-xs text-slate-400 hover:text-white uppercase font-semibold transition-colors flex items-center gap-2 btn-ripple"
                >
                  Back to Activity Selector
                </button>
              </div>
              <h1 className="executive-font text-5xl font-bold text-white tracking-tight">🎉 Lightning Round Complete!</h1>
            </header>

          <div className="glass-card p-8 mb-6">
            <div className="text-center mb-6">
              <h2 className="executive-font text-4xl font-bold text-white mb-2">Final Score: {lightningRoundState.score.toLocaleString()}</h2>
              {isNewBest && (
                <p className="text-emerald-400 text-xl font-bold animate-pulse">ðŸ† NEW HIGH SCORE! ðŸ†</p>
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
                <div className={`text-3xl font-bold text-white streak-counter ${longestStreak > 0 ? 'pulse' : ''} flex items-center gap-1`}>
                  {Array(Math.min(longestStreak, 5)).fill(0).map((_, i) => <StarIcon key={i} size={24} stroke="#ff6b35" fill="#ff6b35" className="inline-block" />)}
                  {longestStreak}x
                </div>
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
            <div className="flex gap-4 mt-6">
              <button 
                onClick={(e) => {
                  createRipple(e);
                  resetQuiz();
                  setSelectedTask(selectedTask);
                  setView('learn-hub');
                  setSubView('overview');
                }}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors executive-font btn-ripple"
              >
                Learn More about this task
              </button>
              <button 
                onClick={(e) => {
                  createRipple(e);
                  resetQuiz();
                  setView('practice-hub');
                }}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors executive-font btn-ripple"
              >
                Back to Activity Selector
              </button>
            </div>
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
              {isCorrect ? '…' : 'âŒ'}
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
    const streakFires = Array(Math.min(lightningRoundState.streak, 5)).fill(0).map((_, i) => <StarIcon key={i} size={20} stroke="#ff6b35" fill="#ff6b35" className="inline-block" />);

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
              â† Back
            </button>
          </div>
          <h1 className="executive-font text-4xl font-bold text-white tracking-tight">⚡ Lightning Round</h1>
        </header>

        {/* Timer Progress Bar */}
        <div className="glass-card p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="text-slate-400 text-sm">â±ï¸ {lightningRoundState.timeRemaining}s</div>
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
    // Handle both document_detective formats
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

    const goToTasksList = () => {
      setDocumentDetectiveState({
        currentCase: 0,
        selectedDocs: [],
        showingFeedback: false,
        score: 0,
        currentQuestion: 0,
        showingAnswer: false,
        userAnswers: {}
      });
      handleViewChange('strategy-suite');
    };

    if (!currentCaseData) {
      return (
        <div className="max-w-6xl w-full p-10 animate-fadeIn text-left">
          <div className="glass-card p-10 text-center">
            <h1 className="executive-font text-3xl font-bold text-white mb-4">ðŸ•µï¸ Document Detective</h1>
            <p className="text-slate-400">No cases available for this task.</p>
            <div className="flex gap-4 mt-6 justify-center">
              <button 
                onClick={(e) => {
                  createRipple(e);
                  setDocumentDetectiveState({
                    currentCase: 0,
                    selectedDocs: [],
                    showingFeedback: false,
                    score: 0,
                    currentQuestion: 0,
                    showingAnswer: false,
                    userAnswers: {}
                  });
                  setSelectedTask(selectedTask);
                  setView('learn-hub');
                  setSubView('overview');
                }}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors executive-font btn-ripple"
              >
                Learn More about this task
              </button>
              <button 
                onClick={(e) => {
                  createRipple(e);
                  goToTasksList();
                }}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors executive-font btn-ripple"
              >
                Back to Activity Selector
              </button>
            </div>
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
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button 
                  onClick={(e) => {
                    createRipple(e);
                    setDocumentDetectiveState({
                      currentCase: 0,
                      selectedDocs: [],
                      showingFeedback: false,
                      score: 0,
                      currentQuestion: 0,
                      showingAnswer: false,
                      userAnswers: {}
                    });
                    setSelectedTask(selectedTask);
                    setView('learn-hub');
                    setSubView('overview');
                  }}
                  className="px-4 py-2 executive-font text-xs text-blue-400 hover:text-blue-300 uppercase font-semibold transition-colors flex items-center gap-2 border border-blue-400/30 hover:border-blue-400/50 rounded-lg btn-ripple"
                >
                  Learn More about this task
                </button>
                <button 
                  onClick={(e) => {
                    createRipple(e);
                    goToTasksList();
                  }}
                  className="px-4 py-2 executive-font text-xs text-slate-400 hover:text-white uppercase font-semibold transition-colors flex items-center gap-2 btn-ripple"
                >
                  Back to Activity Selector
                </button>
              </div>
            </div>
            <h1 className="executive-font text-5xl font-bold text-white tracking-tight">ðŸ•µï¸ Document Detective: {currentCaseData.title}</h1>
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
              <h3 className="executive-font text-xl font-semibold text-white mb-4">… Correct Selections</h3>
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
              <h3 className="executive-font text-xl font-semibold text-white mb-4">âŒ Important Documents You Missed</h3>
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
                Next Case â†’
              </button>
            )}
            <div className="flex gap-4">
              <button 
                onClick={(e) => {
                  createRipple(e);
                  setDocumentDetectiveState({
                    currentCase: 0,
                    selectedDocs: [],
                    showingFeedback: false,
                    score: 0,
                    currentQuestion: 0,
                    showingAnswer: false,
                    userAnswers: {}
                  });
                  setSelectedTask(selectedTask);
                  setView('learn-hub');
                  setSubView('overview');
                }}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors executive-font btn-ripple"
              >
                Learn More about this task
              </button>
              <button 
                onClick={(e) => {
                  createRipple(e);
                  goToTasksList();
                }}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors executive-font btn-ripple"
              >
                Back to Activity Selector
              </button>
            </div>
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
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button 
                  onClick={(e) => {
                    createRipple(e);
                    setDocumentDetectiveState({
                      currentCase: 0,
                      selectedDocs: [],
                      showingFeedback: false,
                      score: 0,
                      currentQuestion: 0,
                      showingAnswer: false,
                      userAnswers: {}
                    });
                    setSelectedTask(selectedTask);
                    setView('learn-hub');
                    setSubView('overview');
                  }}
                  className="px-4 py-2 executive-font text-xs text-blue-400 hover:text-blue-300 uppercase font-semibold transition-colors flex items-center gap-2 border border-blue-400/30 hover:border-blue-400/50 rounded-lg btn-ripple"
                >
                  Learn More about this task
                </button>
                <button 
                  onClick={(e) => {
                    createRipple(e);
                    goToTasksList();
                  }}
                  className="px-4 py-2 executive-font text-xs text-slate-400 hover:text-white uppercase font-semibold transition-colors flex items-center gap-2 btn-ripple"
                >
                  Back to Activity Selector
                </button>
              </div>
            </div>
            <h1 className="executive-font text-5xl font-bold text-white tracking-tight">ðŸ•µï¸ Document Detective</h1>
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
              <h3 className="executive-font text-xl font-semibold text-white mb-4 flex items-center gap-2"><LightbulbIcon size={20} stroke="currentColor" className="inline-block" /> Key Insights</h3>
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
                  â† Previous Case
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
                  Next Case â†’
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
              â† Back
            </button>
          </div>
          <h1 className="executive-font text-5xl font-bold text-white tracking-tight">ðŸ•µï¸ Document Detective: {currentCaseData.title}</h1>
        </header>

        {/* Case Display */}
        <div className="glass-card p-8 mb-6">
          <h2 className="executive-font text-2xl font-bold text-white mb-4">{currentCaseData.title}</h2>
          <div className="text-slate-300 mb-6 whitespace-pre-line leading-relaxed">
            {currentCaseData.scenario}
          </div>
          <div className="glass-card p-4 bg-blue-500/10 border-l-4 border-blue-500">
            <p className="text-blue-400 font-semibold">ðŸ“‹ Your Mission: Select the 3 most relevant documents</p>
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
                        {isSelected && <span className="text-white text-xs">“</span>}
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
    // For Lead a Team, use leadership_style_matcher, for Empower Team use delegation_level_matcher, otherwise conflict_matcher
    let dataKey = 'conflict_matcher';
    let activityTitle = 'Conflict Mode Matcher';
    if (selectedTask === 'Lead a Team') {
      dataKey = 'leadership_style_matcher';
      activityTitle = 'Leadership Style Matcher';
    } else if (selectedTask === 'Empower Team') {
      dataKey = 'delegation_level_matcher';
      activityTitle = 'Delegation Level Matcher';
    }
    
    // Extract scenarios - handle both object with scenarios property and direct array
    const rawData = currentTask.practice?.[dataKey] || currentTask.practice?.conflict_matcher;
    
    // For Empower Team, use situations array and delegation_levels
    let conflictMatcherScenarios, availableModes;
    if (selectedTask === 'Empower Team' && rawData?.situations) {
      conflictMatcherScenarios = rawData.situations;
      availableModes = rawData.delegation_levels || [];
    } else {
      conflictMatcherScenarios = (rawData?.scenarios || (Array.isArray(rawData) ? rawData : null)) || [
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
      availableModes = null;
    }

    // Define modes/styles based on task
    const conflictModes = selectedTask === 'Empower Team' && availableModes ? 
      availableModes.map(level => ({
        name: level.name,
        emoji: level.level === 1 ? "ðŸ“¢" : level.level === 2 ? "ðŸ’¬" : level.level === 3 ? "ðŸ¤" : level.level === 4 ? "ðŸ¤" : level.level === 5 ? "ðŸ’¡" : level.level === 6 ? "â“" : "…",
        color: level.color || "blue",
        level: level.level
      })) :
      selectedTask === 'Lead a Team' ? [
      { name: "Commanding", emoji: "⚡", color: "red" },
      { name: "Authoritative", emoji: "", color: "blue" },
      { name: "Affiliative", emoji: "", color: "emerald" },
      { name: "Democratic", emoji: "", color: "yellow" },
      { name: "Pacesetting", emoji: "⚡", color: "orange" },
      { name: "Coaching", emoji: "📚", color: "purple" }
    ] : [
      { name: "COLLABORATE", emoji: "", color: "emerald" },
      { name: "CONFRONT", emoji: "", color: "blue" },
      { name: "COMPROMISE", emoji: "", color: "yellow" },
      { name: "ACCOMMODATE", emoji: "", color: "orange" },
      { name: "FORCE", icon: <WarningIcon size={16} stroke="currentColor" />, color: "red" },
      { name: "AVOID", emoji: "", color: "slate" }
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
      const scenario = conflictMatcherScenarios.find(s => s.id === scenarioId);
      let correctAnswer;
      if (selectedTask === 'Empower Team' && scenario) {
        // For Empower Team, check correctLevel or levelName
        const correctLevel = scenario.correctLevel;
        const levelName = scenario.levelName;
        const matchedMode = conflictModes.find(m => m.level === correctLevel || m.name === levelName);
        correctAnswer = matchedMode?.name || levelName;
      } else {
        correctAnswer = scenario?.correctStyle || scenario?.correctMode;
      }
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

    const goToTasksList = () => {
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
                â† Back
              </button>
            </div>
            <h1 className="executive-font text-5xl font-bold text-white tracking-tight">ðŸ§© {activityTitle}</h1>
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
              let correctAnswer;
              if (selectedTask === 'Empower Team' && scenario.levelName) {
                correctAnswer = scenario.levelName;
              } else {
                correctAnswer = scenario.correctStyle || scenario.correctMode;
              }
              // Handle combined answers like "Authoritative/Commanding" - check if user answer is in the combined string
              const isCorrect = correctAnswer && (correctAnswer.includes('/') 
                ? correctAnswer.split('/').some(style => style.trim() === userMatch)
                : userMatch === correctAnswer);

              return (
                <div 
                  key={scenario.id} 
                  className={`glass-card p-6 border-l-4 ${
                    isCorrect ? 'border-emerald-500 correct-match' : 'border-red-500 incorrect-match'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <span className="text-3xl">{isCorrect ? '…' : 'âŒ'}</span>
                    <div className="flex-1">
                      <p className="text-white mb-2">{scenario.scenario || scenario.context || scenario.title}</p>
                      {selectedTask === 'Empower Team' && scenario.factors && (
                        <div className="mb-2">
                          <span className="text-xs text-slate-400">Key factors: </span>
                          <span className="text-xs text-slate-300">{scenario.factors.join(', ')}</span>
                        </div>
                      )}
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
                            {scenario.levelName || scenario.correctStyle || scenario.correctMode}
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
                      <span className="text-sm font-semibold text-white">Why {scenario.levelName || scenario.correctStyle || scenario.correctMode}:</span>
                      <p className="text-sm text-slate-300 mt-1">{scenario.explanation || scenario.why}</p>
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
              â† Back
            </button>
          </div>
          <h1 className="executive-font text-5xl font-bold text-white tracking-tight">ðŸ§© {activityTitle}</h1>
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
                    <p className="text-white text-sm">{scenario.scenario || scenario.context || scenario.title}</p>
                    {selectedTask === 'Empower Team' && scenario.factors && (
                      <p className="text-xs text-slate-400 mt-1">Factors: {scenario.factors.join(', ')}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column - Conflict Modes / Leadership Styles */}
          <div>
            <h2 className="executive-font text-2xl font-bold text-white mb-4">
              {selectedTask === 'Empower Team' ? 'Delegation Levels' : selectedTask === 'Lead a Team' ? 'Leadership Styles' : 'Conflict Modes'}
            </h2>
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

    const goToTasksList = () => {
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
            <h1 className="executive-font text-3xl font-bold text-white mb-4">ðŸ“‹ {activityTitle}</h1>
            <p className="text-slate-400">No timeline data available for this task.</p>
            <div className="flex gap-4 mt-6 justify-center">
              <button 
                onClick={(e) => {
                  createRipple(e);
                  setTimelineReconstructorState({
                    steps: [],
                    showingFeedback: false,
                    score: 0,
                    draggedStep: null,
                    dragOverIndex: null,
                    expandedCards: {}
                  });
                  setSelectedTask(selectedTask);
                  setView('learn-hub');
                  setSubView('overview');
                }}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors executive-font btn-ripple"
              >
                Learn More about this task
              </button>
              <button 
                onClick={(e) => {
                  createRipple(e);
                  goToTasksList();
                }}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors executive-font btn-ripple"
              >
                Back to Activity Selector
              </button>
            </div>
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
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button 
                  onClick={(e) => {
                    createRipple(e);
                    setTimelineReconstructorState({
                      steps: [],
                      showingFeedback: false,
                      score: 0,
                      draggedStep: null,
                      dragOverIndex: null,
                      expandedCards: {}
                    });
                    setSelectedTask(selectedTask);
                    setView('learn-hub');
                    setSubView('overview');
                  }}
                  className="px-4 py-2 executive-font text-xs text-blue-400 hover:text-blue-300 uppercase font-semibold transition-colors flex items-center gap-2 border border-blue-400/30 hover:border-blue-400/50 rounded-lg btn-ripple"
                >
                  Learn More about this task
                </button>
                <button 
                  onClick={(e) => {
                    createRipple(e);
                    goToTasksList();
                  }}
                  className="px-4 py-2 executive-font text-xs text-slate-400 hover:text-white uppercase font-semibold transition-colors flex items-center gap-2 btn-ripple"
                >
                  Back to Activity Selector
                </button>
              </div>
            </div>
            <h1 className="executive-font text-5xl font-bold text-white tracking-tight">ðŸ“‹ {activityTitle}: {timelineData.title || timelineData.subtitle || 'Timeline Reconstructor'}</h1>
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
                        {isCorrect ? '…' : 'âŒ'}
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
                â† Back
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
                  <p className="text-slate-400 text-sm mb-2">â±ï¸ <strong>Time Estimate:</strong> {timelineData.introduction.timeEstimate}</p>
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
                <h3 className="text-green-400 font-bold text-lg mb-2">ðŸŒ± Forming</h3>
                <p className="text-slate-300 text-sm">New team, polite, uncertain, dependent on PM, many questions about roles/process</p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded border-l-2 border-red-500">
                <h3 className="text-red-400 font-bold text-lg mb-2">⚡ Storming</h3>
                <p className="text-slate-300 text-sm">Conflict, power struggles, challenging authority, competition, energy to disagreement</p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded border-l-2 border-blue-500">
                <h3 className="text-blue-400 font-bold text-lg mb-2">ðŸ¤ Norming</h3>
                <p className="text-slate-300 text-sm">Cooperation, "we" language, processes working, team identity forming, mutual support</p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded border-l-2 border-cyan-500">
                <h3 className="text-cyan-400 font-bold text-lg mb-2">ðŸš€ Performing</h3>
                <p className="text-slate-300 text-sm">High autonomy, self-organizing, consistent excellence, minimal PM intervention</p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded border-l-2 border-yellow-500">
                <h3 className="text-yellow-400 font-bold text-lg mb-2">ðŸ‘‹ Adjourning</h3>
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
                      {/* Drag Handle - More Prominent and Easier to Use */}
                      <div 
                        className="flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-500/30 hover:bg-cyan-500/60 active:bg-cyan-500/80 cursor-grab active:cursor-grabbing transition-all duration-200 flex-shrink-0 border border-cyan-400/50 hover:border-cyan-400 hover:scale-110 active:scale-95 shadow-md hover:shadow-lg"
                        title="Drag to reorder"
                      >
                        <div className="text-cyan-300 text-xl font-bold select-none">â˜°</div>
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
                      <div className="px-2.5 pb-2.5 border-t border-slate-700/50 pt-2.5 space-y-3">
                        {/* Event Content */}
                        {event.content && (
                          <div className="bg-slate-900/50 p-3 rounded border border-slate-700">
                            <h4 className="text-cyan-400 font-semibold text-xs mb-2 uppercase tracking-wide">Event Details</h4>
                            <pre className="text-slate-300 whitespace-pre-wrap font-mono text-xs leading-relaxed">{event.content}</pre>
                          </div>
                        )}
                        
                        {/* Key Indicators */}
                        {event.indicators && (
                          <div className="bg-blue-900/30 p-3 rounded border-l-4 border-blue-500">
                            <h4 className="text-blue-400 font-semibold text-xs mb-2 uppercase tracking-wide">Key Indicators</h4>
                            <p className="text-slate-300 text-xs leading-relaxed">{event.indicators}</p>
                          </div>
                        )}
                        
                        {/* Why This Order */}
                        {event.whyThisOrder && (
                          <div className="bg-emerald-900/30 p-3 rounded border-l-4 border-emerald-500">
                            <h4 className="text-emerald-400 font-semibold text-xs mb-2 uppercase tracking-wide">Why This Order</h4>
                            <p className="text-slate-300 text-xs leading-relaxed">{event.whyThisOrder}</p>
                          </div>
                        )}
                        
                        {/* Event Metadata */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {event.month && (
                            <div className="bg-slate-800/50 p-2 rounded">
                              <label className="text-slate-400 block mb-1 text-xs">Month:</label>
                              <span className="text-white font-semibold">{event.month}</span>
                          </div>
                          )}
                          {event.stage && (
                            <div className="bg-slate-800/50 p-2 rounded">
                              <label className="text-slate-400 block mb-1 text-xs">Stage:</label>
                              <span className="text-white font-semibold">{event.stage}</span>
                        </div>
                          )}
                          {event.leadershipStyle && (
                            <div className="bg-slate-800/50 p-2 rounded">
                              <label className="text-slate-400 block mb-1 text-xs">Leadership Style:</label>
                              <span className="text-white font-semibold">{event.leadershipStyle}</span>
                            </div>
                          )}
                          {event.correctOrder && (
                            <div className="bg-slate-800/50 p-2 rounded">
                              <label className="text-slate-400 block mb-1 text-xs">Correct Sequence:</label>
                              <span className="text-white font-semibold">#{event.correctOrder}</span>
                            </div>
                          )}
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
                          <h4 className="text-white font-semibold mb-2">Forming â†’ Storming</h4>
                          <p><strong>Between:</strong> {timelineData.answers.stageTransitions.formingToStorming.betweenEvents}</p>
                          <p><strong>Trigger:</strong> {timelineData.answers.stageTransitions.formingToStorming.trigger}</p>
                          <p><strong>Evidence:</strong> {timelineData.answers.stageTransitions.formingToStorming.evidence}</p>
                          <p><strong>Timeline:</strong> {timelineData.answers.stageTransitions.formingToStorming.timeline}</p>
                        </div>
                      )}
                      {timelineData.answers.stageTransitions.stormingToNorming && (
                        <div className="bg-slate-800/50 p-4 rounded">
                          <h4 className="text-white font-semibold mb-2">Storming â†’ Norming</h4>
                          <p><strong>Between:</strong> {timelineData.answers.stageTransitions.stormingToNorming.betweenEvents}</p>
                          <p><strong>Trigger:</strong> {timelineData.answers.stageTransitions.stormingToNorming.trigger}</p>
                          <p><strong>Evidence:</strong> {timelineData.answers.stageTransitions.stormingToNorming.evidence}</p>
                          <p><strong>Timeline:</strong> {timelineData.answers.stageTransitions.stormingToNorming.timeline}</p>
                        </div>
                      )}
                      {timelineData.answers.stageTransitions.normingToPerforming && (
                        <div className="bg-slate-800/50 p-4 rounded">
                          <h4 className="text-white font-semibold mb-2">Norming â†’ Performing</h4>
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
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button 
                onClick={(e) => {
                  createRipple(e);
                  setTimelineReconstructorState({
                    steps: [],
                    showingFeedback: false,
                    score: 0,
                    draggedStep: null,
                    dragOverIndex: null,
                    expandedCards: {}
                  });
                  setSelectedTask(selectedTask);
                  setView('learn-hub');
                  setSubView('overview');
                }}
                className="px-4 py-2 executive-font text-xs text-blue-400 hover:text-blue-300 uppercase font-semibold transition-colors flex items-center gap-2 border border-blue-400/30 hover:border-blue-400/50 rounded-lg btn-ripple"
              >
                Learn More about this task
              </button>
              <button 
                onClick={(e) => {
                  createRipple(e);
                  goToTasksList();
                }}
                className="px-4 py-2 executive-font text-xs text-slate-400 hover:text-white uppercase font-semibold transition-colors flex items-center gap-2 btn-ripple"
              >
                Back to Activity Selector
              </button>
            </div>
          </div>
            <h1 className="executive-font text-5xl font-bold text-white tracking-tight">ðŸ“‹ {activityTitle}: {timelineData.title || timelineData.subtitle || 'Timeline Reconstructor'}</h1>
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
              <h3 className="text-green-400 font-bold text-lg mb-2">ðŸŒ± Forming</h3>
              <p className="text-slate-300 text-sm">New team, polite, uncertain, dependent on PM, many questions about roles/process</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded border-l-2 border-red-500">
              <h3 className="text-red-400 font-bold text-lg mb-2">⚡ Storming</h3>
              <p className="text-slate-300 text-sm">Conflict, power struggles, challenging authority, competition, energy to disagreement</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded border-l-2 border-blue-500">
              <h3 className="text-blue-400 font-bold text-lg mb-2">ðŸ¤ Norming</h3>
              <p className="text-slate-300 text-sm">Cooperation, "we" language, processes working, team identity forming, mutual support</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded border-l-2 border-cyan-500">
              <h3 className="text-cyan-400 font-bold text-lg mb-2">ðŸš€ Performing</h3>
              <p className="text-slate-300 text-sm">High autonomy, self-organizing, consistent excellence, minimal PM intervention</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded border-l-2 border-yellow-500">
              <h3 className="text-yellow-400 font-bold text-lg mb-2">ðŸ‘‹ Adjourning</h3>
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
                    {/* Drag Handle - More Prominent and Easier to Use */}
                    <div 
                      className="flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-500/30 hover:bg-cyan-500/60 active:bg-cyan-500/80 cursor-grab active:cursor-grabbing transition-all duration-200 flex-shrink-0 border border-cyan-400/50 hover:border-cyan-400 hover:scale-110 active:scale-95 shadow-md hover:shadow-lg"
                      title="Drag to reorder"
                    >
                      <div className="text-cyan-300 text-xl font-bold select-none">â˜°</div>
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
                        â†‘
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
                        â†“
                      </button>
                    </div>
                  </div>

                  {/* Collapsible Content */}
                  {isExpanded && (
                    <div className="px-2.5 pb-2.5 border-t border-slate-700/50 pt-2.5 space-y-3">
                      {/* Event Details/Content */}
                      {step.content && (
                        <div className="bg-slate-900/50 p-3 rounded border border-slate-700">
                          <h4 className="text-cyan-400 font-semibold text-xs mb-2 uppercase tracking-wide">Event Details</h4>
                          <pre className="text-slate-300 whitespace-pre-wrap font-mono text-xs leading-relaxed">{step.content}</pre>
                        </div>
                      )}
                      {step.details && !step.content && (
                        <div className="bg-slate-900/50 p-3 rounded border border-slate-700">
                          <h4 className="text-cyan-400 font-semibold text-xs mb-2 uppercase tracking-wide">Event Details</h4>
                          <p className="text-slate-300 text-xs leading-relaxed">{step.details}</p>
                        </div>
                      )}
                      
                      {/* Key Indicators */}
                      {step.indicators && (
                        <div className="bg-blue-900/30 p-3 rounded border-l-4 border-blue-500">
                          <h4 className="text-blue-400 font-semibold text-xs mb-2 uppercase tracking-wide">Key Indicators</h4>
                          <p className="text-slate-300 text-xs leading-relaxed">{step.indicators}</p>
                        </div>
                      )}
                      
                      {/* Why This Order */}
                      {step.whyThisOrder && (
                        <div className="bg-emerald-900/30 p-3 rounded border-l-4 border-emerald-500">
                          <h4 className="text-emerald-400 font-semibold text-xs mb-2 uppercase tracking-wide">Why This Order</h4>
                          <p className="text-slate-300 text-xs leading-relaxed">{step.whyThisOrder}</p>
                        </div>
                      )}
                      
                      {/* Event Metadata */}
                      {(step.month || step.stage || step.leadershipStyle || step.correctOrder) && (
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {step.month && (
                            <div className="bg-slate-800/50 p-2 rounded">
                              <label className="text-slate-400 block mb-1 text-xs">Month:</label>
                              <span className="text-white font-semibold">{step.month}</span>
                            </div>
                          )}
                          {step.stage && (
                            <div className="bg-slate-800/50 p-2 rounded">
                              <label className="text-slate-400 block mb-1 text-xs">Stage:</label>
                              <span className="text-white font-semibold">{step.stage}</span>
                            </div>
                          )}
                          {step.leadershipStyle && (
                            <div className="bg-slate-800/50 p-2 rounded">
                              <label className="text-slate-400 block mb-1 text-xs">Leadership Style:</label>
                              <span className="text-white font-semibold">{step.leadershipStyle}</span>
                            </div>
                          )}
                          {step.correctOrder && (
                            <div className="bg-slate-800/50 p-2 rounded">
                              <label className="text-slate-400 block mb-1 text-xs">Correct Sequence:</label>
                              <span className="text-white font-semibold">#{step.correctOrder}</span>
                            </div>
                          )}
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
              onClick={() => setView('strategy-suite')}
              className="px-4 py-2 executive-font text-xs text-slate-400 hover:text-white uppercase font-semibold transition-colors flex items-center gap-2"
            >
              â† Back
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
          <p className="text-slate-400 mt-4">â±ï¸ <strong>Time Estimate:</strong> 45-60 minutes</p>
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

              {/* Scenario 1B: Storming */}
              {teamMemberPerspectivesState.currentScenario === '1B' && (
                <div className="space-y-6">
                  <div className="glass-card p-6 border-l-4 border-red-500">
                    <h3 className="executive-font text-xl font-bold text-white mb-4">Scenario 1B: Alex Four Weeks Later (Storming)</h3>
                    <div className="bg-slate-800/50 p-4 rounded mb-4">
                      <p className="text-white font-semibold mb-2">YOU ARE: Still Alex, UX Designer</p>
                      <p className="text-slate-300 text-sm mb-2"><strong>PROJECT STATUS: Week 4</strong></p>
                      <p className="text-slate-300 text-sm">
                        The first couple weeks were better after Sarah sent those process documents and you had a good 1-on-1. You started working on designs and felt more confident. But now things are getting tense.
                      </p>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-white font-semibold mb-2">TODAY'S DESIGN REVIEW MEETING</h4>
                      <p className="text-slate-300 leading-relaxed mb-2">
                        You're presenting your mockups for the main dashboard. You worked hard on these - stayed late two nights getting them right. You're proud of the design.
                      </p>
                      <div className="bg-slate-800/50 p-4 rounded my-3">
                        <p className="text-slate-300 mb-2"><strong>You:</strong> "So I've incorporated the user research insights into this dashboard design. The key actions are front and center, and I've”"</p>
                        <p className="text-red-400 mb-2"><strong>Jordan (Dev Lead):</strong> "Wait, this won't work. You've got the navigation on the left, but our framework uses top navigation. Redesigning the whole nav structure would add three weeks to the timeline."</p>
                        <p className="text-slate-300 mb-2"><strong>You:</strong> "Oh, I didn't know about that constraint. Why wasn't that in the requirements?"</p>
                        <p className="text-red-400 mb-2"><strong>Jordan:</strong> "It's common knowledge about our tech stack. Any designer should know this."</p>
                        <p className="text-slate-300 mb-2 italic">You feel your face getting hot. "Any designer should know this" - is he saying I'm incompetent?</p>
                        <p className="text-slate-300 mb-2"><strong>You:</strong> "Well, I'm new to the company, so I didn't know about your specific framework. If someone had told me”"</p>
                        <p className="text-red-400 mb-2"><strong>Jordan:</strong> "Sarah, did we not share the tech stack documentation?"</p>
                        <p className="text-slate-300 mb-2"><strong>Sarah:</strong> "I think it was in the shared drive..."</p>
                        <p className="text-red-400 mb-2"><strong>Jordan:</strong> "Well, regardless, we can't use left navigation. Sorry, Alex, but you'll need to redesign."</p>
                        <p className="text-slate-300 italic">You worked so hard on this. And he just dismisses it. "Sorry, Alex" - he doesn't sound sorry at all.</p>
                        <p className="text-slate-300 mb-2"><strong>Casey (jumping in):</strong> "Actually, could we consider changing the framework? Left nav is a better UX pattern for this use case."</p>
                        <p className="text-red-400 mb-2"><strong>Jordan:</strong> "No. That would blow the timeline. We're using the existing framework."</p>
                        <p className="text-red-400 mb-2"><strong>Jordan:</strong> "Look, I don't mean to be harsh, but we don't have time to debate this. Just move the nav to the top and we can move forward."</p>
                        <p className="text-slate-300 italic">The meeting continues but you're barely listening. You feel embarrassed, frustrated, and angry.</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-white font-semibold mb-2">AFTER THE MEETING</h4>
                      <p className="text-slate-300 leading-relaxed mb-2">
                        You're back at your desk, staring at your mockups. Morgan walks by.
                      </p>
                      <div className="bg-slate-800/50 p-4 rounded">
                        <p className="text-slate-300 mb-2"><strong>Morgan:</strong> "Hey, you okay? That meeting was rough."</p>
                        <p className="text-slate-300 mb-2"><strong>You:</strong> "I'm fine."</p>
                        <p className="text-slate-300 mb-2"><strong>Morgan:</strong> "Jordan can be... intense. Don't take it personally."</p>
                        <p className="text-slate-300 mb-2"><strong>You:</strong> "He basically called me incompetent in front of everyone. And Sarah didn't say anything."</p>
                        <p className="text-slate-300 mb-2"><strong>Morgan:</strong> "I know. She should have stepped in. Jordan does this to everyone, though. Last week he tore apart Casey's product requirements."</p>
                        <p className="text-slate-300"><strong>Morgan:</strong> "Yeah. Casey and I were talking about it. Jordan thinks he knows everything."</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-white font-semibold mb-2">YOUR INTERNAL MONOLOGUE</h4>
                      <div className="bg-slate-800/50 p-4 rounded italic text-slate-300">
                        <p className="mb-2">"I can't believe Jordan humiliated me like that. 'Any designer should know this' - in front of the whole team. And Sarah just sat there.</p>
                        <p className="mb-2">Why didn't she defend me? Or at least acknowledge that the tech stack documentation wasn't clearly shared? It feels like she's siding with Jordan.</p>
                        <p className="mb-2">Now I have to redo two weeks of work. I'm so frustrated. I don't even want to work on this anymore.</p>
                        <p className="mb-2">Morgan's right - Jordan does this to everyone. He shot down Casey's ideas too. Why does Sarah let him dominate everything?</p>
                        <p className="mb-2">Maybe I should look for another project. Or another company. This isn't what I signed up for.</p>
                        <p className="mb-2">But I also wonder... was Jordan right? Should I have known about the tech stack? Am I actually not as good as I thought?</p>
                        <p className="mb-2">No, this isn't my fault. If it was documented in a shared drive that I didn't know existed, how was I supposed to find it?</p>
                        <p className="mb-2">God, I don't even want to go to tomorrow's standup. It'll be so awkward seeing Jordan. Do I apologize? Defend myself? Pretend it didn't happen?</p>
                        <p>I need to talk to Sarah. But what do I even say? 'Jordan was mean to me'? That sounds childish. But if I don't say something, how will this get better?</p>
                        <p>I miss my old team. We never had this kind of conflict."</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-white font-semibold mb-2">Reflection Questions</h4>
                      <ol className="list-decimal list-inside space-y-2 text-slate-300 ml-4">
                        <li>What stage is the team in now? How has this changed from Week 1?</li>
                        <li>What emotions is Alex experiencing? List at least 5 specific feelings.</li>
                        <li>What does Alex need from Sarah RIGHT NOW? Be specific about actions.</li>
                        <li>What's really happening between Jordan and Alex? Is this personal? Technical? Something else?</li>
                        <li>What mistakes has Sarah made in handling this?</li>
                        <li>If you were Sarah, what would you do in the next 24 hours?</li>
                        <li>How might this situation be an opportunity? What could the team learn?</li>
                      </ol>
                    </div>

                    <details className="glass-card p-4 bg-slate-800/30">
                      <summary className="text-white font-semibold cursor-pointer hover:text-red-400">
                        Click for Analysis & Insights
                      </summary>
                      <div className="mt-4 space-y-4 text-slate-300 text-sm">
                        <div>
                          <h5 className="text-white font-semibold mb-2">Stage Recognition:</h5>
                          <p className="mb-2"><strong>The team has moved from Forming to Storming.</strong></p>
                          <p className="mb-2"><strong>Evidence:</strong></p>
                          <ul className="list-disc list-inside space-y-1 ml-4">
                            <li>Open conflict (Jordan vs. Alex)</li>
                            <li>PM authority questioned ("She should have stepped in")</li>
                            <li>Coalitions forming (Morgan and Casey talking about Jordan)</li>
                            <li>Personal tension ("Jordan thinks he knows everything")</li>
                            <li>Productivity impact (two weeks of work needs redoing)</li>
                            <li>Team members considering leaving</li>
                            <li>Energy going to conflict, not work</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="text-white font-semibold mb-2">Alex's Emotional State (Storming):</h5>
                          <ul className="list-disc list-inside space-y-1 ml-4">
                            <li><strong>Humiliated</strong> - Called out in front of team</li>
                            <li><strong>Angry</strong> - At Jordan and Sarah both</li>
                            <li><strong>Frustrated</strong> - Hard work dismissed</li>
                            <li><strong>Confused</strong> - Whose fault is this really?</li>
                            <li><strong>Self-doubting</strong> - "Am I not as good as I thought?"</li>
                            <li><strong>Unsupported</strong> - Sarah didn't defend them</li>
                            <li><strong>Anxious</strong> - About tomorrow's standup</li>
                            <li><strong>Disconnected</strong> - "I miss my old team"</li>
                            <li><strong>Vengeful</strong> - Talking negatively about Jordan</li>
                            <li><strong>Uncertain</strong> - Should I stay on this project?</li>
                          </ul>
                          <p className="mt-2 italic">This is classic Storming stage emotional experience - much more intense than Forming.</p>
                        </div>
                        <div>
                          <h5 className="text-white font-semibold mb-2">What Alex Needs IMMEDIATELY (within 2 hours):</h5>
                          <p className="mb-2">Sarah should pull Alex aside (private 1-on-1) and:</p>
                          <ul className="list-disc list-inside space-y-1 ml-4">
                            <li>Apologize for not handling the meeting better</li>
                            <li>Take responsibility for the tech stack documentation gap</li>
                            <li>Address Jordan's inappropriate delivery</li>
                            <li>Validate Alex's excellent design work</li>
                            <li>Acknowledge the real technical constraint</li>
                            <li>Ask what Alex needs</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="text-white font-semibold mb-2">What Sarah Got Wrong:</h5>
                          <ul className="list-disc list-inside space-y-1 ml-4">
                            <li>Didn't facilitate the conflict in the moment</li>
                            <li>Appeared to side with Jordan through silence</li>
                            <li>Didn't follow up immediately after meeting</li>
                            <li>Didn't set ground rules for conflict earlier</li>
                            <li>Didn't acknowledge her own error</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="text-white font-semibold mb-2">Leadership Style Needed:</h5>
                          <p><strong>Coaching/Facilitating</strong> - Help them work through it, establish constructive conflict norms, don't take sides, facilitate resolution. With Affiliative elements to acknowledge emotions and repair relationships.</p>
                        </div>
                        <div>
                          <h5 className="text-white font-semibold mb-2">Key Insight:</h5>
                          <p>Storming is NECESSARY. Teams that avoid or suppress conflict never reach high performance. The PM's job is to facilitate them through it constructively, not eliminate it.</p>
                        </div>
                      </div>
                    </details>
                  </div>
                </div>
              )}

              {/* Placeholder for scenarios 1C, 1D, 1E - will add full content */}
              {['1C', '1D', '1E'].includes(teamMemberPerspectivesState.currentScenario) && (
                <div className="glass-card p-8 text-center">
                  <p className="text-slate-400 mb-4">
                    Scenario {teamMemberPerspectivesState.currentScenario} content coming soon.
                  </p>
                  <p className="text-slate-500 text-sm">
                    Full content for {teamMemberPerspectivesState.currentScenario === '1C' ? 'Norming' : teamMemberPerspectivesState.currentScenario === '1D' ? 'Performing' : 'Adjourning'} stage will be added.
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
                  { id: '2A', name: 'Casey', role: 'Junior Developer', emoji: 'ðŸ‘¨ðŸ’»', color: 'green' },
                  { id: '2B', name: 'Jordan', role: 'Senior Developer', emoji: 'ðŸ‘©ðŸ’»', color: 'blue' },
                  { id: '2C', name: 'Morgan', role: 'Developer with Anxiety', emoji: 'ðŸ§‘ðŸ’»', color: 'yellow' },
                  { id: '2D', name: 'Taylor', role: 'Context-Seeking Developer', emoji: 'ðŸ‘¨ðŸ’¼', color: 'purple' }
                ].map(perspective => (
                  <button
                    key={perspective.id}
                    onClick={() => setTeamMemberPerspectivesState(prev => ({ ...prev, currentScenario: perspective.id }))}
                    className="glass-card p-4 text-left transition-all border-l-4"
                    style={{
                      borderColor: teamMemberPerspectivesState.currentScenario === perspective.id
                        ? (perspective.color === 'green' ? '#10b981' : 
                           perspective.color === 'blue' ? '#3b82f6' : 
                           perspective.color === 'yellow' ? '#eab308' : 
                           perspective.color === 'purple' ? '#a855f7' : '#64748b')
                        : '#475569',
                      backgroundColor: teamMemberPerspectivesState.currentScenario === perspective.id
                        ? (perspective.color === 'green' ? 'rgba(16, 185, 129, 0.1)' : 
                           perspective.color === 'blue' ? 'rgba(59, 130, 246, 0.1)' : 
                           perspective.color === 'yellow' ? 'rgba(234, 179, 8, 0.1)' : 
                           perspective.color === 'purple' ? 'rgba(168, 85, 247, 0.1)' : 'transparent')
                        : 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      if (teamMemberPerspectivesState.currentScenario !== perspective.id) {
                        e.currentTarget.style.borderColor = '#64748b';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (teamMemberPerspectivesState.currentScenario !== perspective.id) {
                        e.currentTarget.style.borderColor = '#475569';
                      }
                    }}
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
              {teamMemberPerspectivesState.currentScenario === '2A' && (
                <div className="glass-card p-6 border-l-4 border-green-500">
                  <h3 className="executive-font text-xl font-bold text-white mb-4">Perspective A: Casey (Junior Developer, 6 months experience)</h3>
                  <div className="bg-slate-800/50 p-4 rounded mb-4">
                    <p className="text-white font-semibold mb-2">YOU ARE: Casey</p>
                    <p className="text-slate-300 text-sm">
                      <strong>Your Background:</strong> First job out of coding bootcamp, 6 months professional experience, smart but inexperienced with production issues, eager to learn but easily overwhelmed. This is your first production outage.
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-white font-semibold mb-2">WHAT HAPPENS:</h4>
                    <p className="text-slate-300 leading-relaxed mb-2">
                      You see the alerts come through. Your heart starts racing. <em>Oh god, the whole system is down. What do I do?</em>
                    </p>
                    <p className="text-slate-300 leading-relaxed mb-2">
                      You start opening logs but there's so much data you don't know where to start. <em>Database errors? API timeouts? Is it on our end or AWS? I don't know what I'm looking for.</em>
                    </p>
                    <div className="bg-slate-800/50 p-4 rounded my-3">
                      <p className="text-cyan-400 mb-2"><strong>Chris:</strong> "Everyone stop what you're doing. Here's what we're doing right now. Casey - check the API gateway logs for errors in the past 30 minutes. Filter for 500-level errors. Send me the count in the #incident channel. Do that first, nothing else."</p>
                      <p className="text-slate-300 italic mb-2">Oh thank god. Okay, I can do that. API gateway logs, 500-level errors, past 30 minutes. That's clear.</p>
                      <p className="text-slate-300 mb-2">You navigate to the logs, apply the filters Chris specified. You find 247 errors. You post in Slack: "247 500-level errors in API gateway"</p>
                      <p className="text-cyan-400 mb-2"><strong>Chris:</strong> "Good, Casey. Now check if they're all from the same endpoint or distributed. Post findings."</p>
                      <p className="text-slate-300 mb-2">You run the query. "All from /api/auth/login endpoint"</p>
                      <p className="text-cyan-400 mb-2"><strong>Chris:</strong> "Perfect. Stand by."</p>
                      <p className="text-slate-300 italic">My hands have stopped shaking. I know what I'm doing now. Chris is handling this. We're going to fix it.</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-white font-semibold mb-2">YOUR INTERNAL THOUGHTS:</h4>
                    <div className="bg-slate-800/50 p-4 rounded italic text-slate-300">
                      <p className="mb-2">"I was panicking, but Chris's clear instructions helped me focus. I didn't have to figure out what to do - he told me exactly what. That's what I needed.</p>
                      <p className="mb-2">I know some people don't like being told what to do, but in a crisis like this? I'm relieved someone with experience is taking charge. I wouldn't have known where to start.</p>
                      <p className="mb-2">Chris trusts me to do this specific task. It's small enough I can handle it, but important enough to matter. I feel useful, not useless.</p>
                      <p>I'm learning what to look for in a production issue. Next time, maybe I'll know how to start investigating on my own."</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-white font-semibold mb-2">Reflection Questions</h4>
                    <ol className="list-decimal list-inside space-y-2 text-slate-300 ml-4">
                      <li>How did Chris's Commanding style affect Casey? Was it helpful or harmful?</li>
                      <li>What does Casey need that Chris provided?</li>
                      <li>Why did Casey feel relieved rather than frustrated?</li>
                    </ol>
                  </div>

                  <details className="glass-card p-4 bg-slate-800/30">
                    <summary className="text-white font-semibold cursor-pointer hover:text-green-400">
                      Click for Analysis
                    </summary>
                    <div className="mt-4 space-y-4 text-slate-300 text-sm">
                      <div>
                        <h5 className="text-white font-semibold mb-2">Casey's Experience:</h5>
                        <p className="mb-2"><strong>Commanding style WORKED for Casey because:</strong></p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Casey is junior and inexperienced with production issues</li>
                          <li>Clear, specific instructions reduced panic</li>
                          <li>Didn't have to figure out what to do (wouldn't have known where to start)</li>
                          <li>Felt useful and trusted with achievable task</li>
                          <li>Learning through structured guidance</li>
                        </ul>
                        <p className="mt-2"><strong>Casey's needs:</strong> Clear expectations, step-by-step guidance, regular feedback, building confidence through small successes</p>
                      </div>
                    </div>
                  </details>
                </div>
              )}

              {teamMemberPerspectivesState.currentScenario === '2B' && (
                <div className="glass-card p-6 border-l-4 border-blue-500">
                  <h3 className="executive-font text-xl font-bold text-white mb-4">Perspective B: Jordan (Senior Developer, 12 years experience)</h3>
                  <div className="bg-slate-800/50 p-4 rounded mb-4">
                    <p className="text-white font-semibold mb-2">YOU ARE: Jordan</p>
                    <p className="text-slate-300 text-sm">
                      <strong>Your Background:</strong> 12 years as a software engineer, you've handled dozens of production outages, very experienced with this codebase, pride yourself on quick problem diagnosis, independent and confident.
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-white font-semibold mb-2">WHAT HAPPENS:</h4>
                    <p className="text-slate-300 leading-relaxed mb-2">
                      You see the alerts. <em>System's down. Okay, let's see...</em>
                    </p>
                    <p className="text-slate-300 leading-relaxed mb-2">
                      You immediately start investigating. You pull up monitoring dashboards, check recent deployments, scan error logs. You're mentally building a hypothesis: <em>Probably the authentication service. The deployment from yesterday might have”</em>
                    </p>
                    <div className="bg-slate-800/50 p-4 rounded my-3">
                      <p className="text-cyan-400 mb-2"><strong>Chris:</strong> "Everyone stop what you're doing. Here's what we're doing. Jordan - check the database connection pool. Count active connections vs. max connections. Report back in 5 minutes."</p>
                      <p className="text-slate-300 italic mb-2">Wait, what? The database connection pool? That's not where the problem is. This is clearly an auth service issue, not a database problem.</p>
                      <p className="text-slate-300 mb-2">You check the connection pool anyway because Chris told you to. <em>47 active connections, max is 100. Plenty of capacity. This is a waste of time.</em></p>
                      <p className="text-slate-300 mb-2">You post: "Connection pool fine. 47 active."</p>
                      <p className="text-slate-300 italic">I could have had this diagnosed by now if he'd just let me investigate. I already had a hypothesis. Now I'm checking things I know aren't the problem because Chris is micromanaging everyone.</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-white font-semibold mb-2">YOUR INTERNAL THOUGHTS:</h4>
                    <div className="bg-slate-800/50 p-4 rounded italic text-slate-300">
                      <p className="mb-2">"I get that Chris is trying to coordinate, but this feels like he doesn't trust me to do my job. I've handled more outages than he has.</p>
                      <p className="mb-2">That task he gave me was something a junior could do. I'm capable of leading the investigation, not just running a single query.</p>
                      <p className="mb-2">If he'd asked 'Jordan, what do you need to investigate?' instead of telling me what to check, we'd probably be further along.</p>
                      <p className="mb-2">This command-and-control approach might work for Casey, but it's frustrating for me. I'm not a soldier following orders, I'm an experienced engineer who can troubleshoot.</p>
                      <p>I want to respect Chris's role as PM, but this is making me less effective, not more."</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-white font-semibold mb-2">Reflection Questions</h4>
                    <ol className="list-decimal list-inside space-y-2 text-slate-300 ml-4">
                      <li>How did the SAME Commanding style affect Jordan differently than Casey?</li>
                      <li>What does Jordan need that Chris didn't provide?</li>
                      <li>How could Chris have adapted his approach for Jordan while still coordinating?</li>
                    </ol>
                  </div>

                  <details className="glass-card p-4 bg-slate-800/30">
                    <summary className="text-white font-semibold cursor-pointer hover:text-blue-400">
                      Click for Analysis
                    </summary>
                    <div className="mt-4 space-y-4 text-slate-300 text-sm">
                      <div>
                        <h5 className="text-white font-semibold mb-2">Jordan's Experience:</h5>
                        <p className="mb-2"><strong>Commanding style DIDN'T WORK for Jordan because:</strong></p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Jordan is senior and experienced - doesn't need micromanagement</li>
                          <li>Already had a hypothesis and was investigating</li>
                          <li>Felt untrusted and underutilized</li>
                          <li>Task assigned was too simple for his expertise</li>
                          <li>Wasted time on tasks that weren't the problem</li>
                        </ul>
                        <p className="mt-2"><strong>Better approach for Jordan:</strong> "Jordan, you've handled more outages than anyone. What's your hypothesis about root cause? You lead the auth service investigation. Keep me posted every 5 minutes."</p>
                        <p className="mt-2"><strong>Jordan's needs:</strong> Trust and autonomy, strategic direction (not tactical), recognition of expertise, space to lead in domain, input on approach</p>
                      </div>
                    </div>
                  </details>
                </div>
              )}

              {teamMemberPerspectivesState.currentScenario === '2C' && (
                <div className="glass-card p-6 border-l-4 border-yellow-500">
                  <h3 className="executive-font text-xl font-bold text-white mb-4">Perspective C: Morgan (Developer with Performance Anxiety)</h3>
                  <div className="bg-slate-800/50 p-4 rounded mb-4">
                    <p className="text-white font-semibold mb-2">YOU ARE: Morgan</p>
                    <p className="text-slate-300 text-sm">
                      <strong>Your Background:</strong> 4 years development experience, competent developer but struggles with anxiety, performance anxiety worsens under pressure, doctor-diagnosed anxiety disorder, managing well with therapy and medication, but stress still triggers symptoms.
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-white font-semibold mb-2">WHAT HAPPENS:</h4>
                    <p className="text-slate-300 leading-relaxed mb-2">
                      You see the alerts. Your chest tightens immediately. <em>Oh no, not now. Everyone's going to see if I mess this up.</em>
                    </p>
                    <p className="text-slate-300 leading-relaxed mb-2">
                      Your hands start trembling slightly. You try to pull up logs but accidentally close the wrong window. <em>Come on, focus. Everyone else is probably already investigating. I'm behind.</em>
                    </p>
                    <div className="bg-slate-800/50 p-4 rounded my-3">
                      <p className="text-cyan-400 mb-2"><strong>Chris (loudly):</strong> "Everyone STOP. Here's what we're doing RIGHT NOW. Morgan - check Redis cache status. Is it up? Are we getting hits or misses? Report back IMMEDIATELY."</p>
                      <p className="text-slate-300 italic mb-2">His tone is so intense. This must be really bad. Okay, Redis, Redis...</p>
                      <p className="text-slate-300 mb-2">Your heart is pounding. You try to SSH into the Redis server but you typo the command. <em>Shit. Everyone can see this in the terminal. They'll know I'm panicking.</em></p>
                      <p className="text-slate-300 mb-2">You try again, hands shaking worse. You get in.</p>
                      <p className="text-cyan-400 mb-2"><strong>Chris:</strong> "Morgan, where's the Redis status? Need it now."</p>
                      <p className="text-slate-300 italic mb-2">I'm going as fast as I can! The pressure is making it worse.</p>
                      <p className="text-slate-300 mb-2">You finally get the info: "Redis is up, showing 73% hit rate"</p>
                      <p className="text-cyan-400 mb-2"><strong>Chris:</strong> "Okay. Stand by for next task."</p>
                      <p className="text-slate-300 italic">I did it. But I feel like I'm going to throw up. My heart won't stop racing. I hate feeling this way.</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-white font-semibold mb-2">YOUR INTERNAL THOUGHTS:</h4>
                    <div className="bg-slate-800/50 p-4 rounded italic text-slate-300">
                      <p className="mb-2">"Chris's commanding approach makes the crisis feel even more urgent and intense. I know he's trying to coordinate, but the barking orders raises my anxiety.</p>
                      <p className="mb-2">When he said 'RIGHT NOW' and 'IMMEDIATELY,' it made me more panicked, not more effective. I started making typos and mistakes.</p>
                      <p className="mb-2">If he'd said 'Morgan, when you can, check Redis status and let me know' - same request, less panic-inducing.</p>
                      <p className="mb-2">I know I have anxiety issues that aren't Chris's fault. But his leadership style is amplifying my anxiety, not helping me manage it.</p>
                      <p>After this is over, I'm going to be exhausted. The crisis itself plus managing my panic response - it's draining.</p>
                      <p>I wish I could tell Chris that I work better with calm direction than urgent barking. But I don't want him to think I can't handle pressure."</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-white font-semibold mb-2">Reflection Questions</h4>
                    <ol className="list-decimal list-inside space-y-2 text-slate-300 ml-4">
                      <li>How did Chris's urgent, intense tone affect Morgan?</li>
                      <li>What would have helped Morgan perform better?</li>
                      <li>How can leaders adapt their communication for team members with anxiety?</li>
                    </ol>
                  </div>

                  <details className="glass-card p-4 bg-slate-800/30">
                    <summary className="text-white font-semibold cursor-pointer hover:text-yellow-400">
                      Click for Analysis
                    </summary>
                    <div className="mt-4 space-y-4 text-slate-300 text-sm">
                      <div>
                        <h5 className="text-white font-semibold mb-2">Morgan's Experience:</h5>
                        <p className="mb-2"><strong>Commanding style HARMED Morgan because:</strong></p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Urgent, intense tone increased anxiety</li>
                          <li>"RIGHT NOW" and "IMMEDIATELY" created panic</li>
                          <li>Made mistakes due to pressure (typos, wrong windows)</li>
                          <li>Physical symptoms worsened (hands shaking, heart racing)</li>
                          <li>Less effective, not more</li>
                        </ul>
                        <p className="mt-2"><strong>Better approach for Morgan:</strong> "Morgan, I need you to check Redis cache status when you're able. Let me know what you find - no rush, I'm gathering info from everyone." (Calm, steady tone)</p>
                        <p className="mt-2"><strong>Morgan's needs:</strong> Calm, steady leadership, psychological safety, patience with processing time, understanding of anxiety as real, confidence-building rather than pressure</p>
                      </div>
                    </div>
                  </details>
                </div>
              )}

              {teamMemberPerspectivesState.currentScenario === '2D' && (
                <div className="glass-card p-6 border-l-4 border-purple-500">
                  <h3 className="executive-font text-xl font-bold text-white mb-4">Perspective D: Taylor (Developer who needs context)</h3>
                  <div className="bg-slate-800/50 p-4 rounded mb-4">
                    <p className="text-white font-semibold mb-2">YOU ARE: Taylor</p>
                    <p className="text-slate-300 text-sm">
                      <strong>Your Background:</strong> 8 years development experience, analytical thinker who needs to understand the "why", makes good decisions when you understand the full picture, can execute tasks but works better when you understand the strategy, values autonomy and context.
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-white font-semibold mb-2">WHAT HAPPENS:</h4>
                    <p className="text-slate-300 leading-relaxed mb-2">
                      You see the alerts and start investigating. You're trying to understand the full scope: <em>What services are down? What's the user impact? Where should we focus first?</em>
                    </p>
                    <div className="bg-slate-800/50 p-4 rounded my-3">
                      <p className="text-cyan-400 mb-2"><strong>Chris:</strong> "Taylor - check the load balancer health checks. Tell me which instances are responding."</p>
                      <p className="text-slate-300 mb-2">You start checking, but you're thinking: <em>Why the load balancer? What's his theory about root cause? What have others found?</em></p>
                      <p className="text-slate-300 mb-2">You find the info: "All instances responding to health checks"</p>
                      <p className="text-cyan-400 mb-2"><strong>Chris:</strong> "Good. Now check the SSL certificate expiration dates."</p>
                      <p className="text-slate-300 italic mb-2">SSL certificates? That seems random. Is he just throwing out tasks or does he have a hypothesis? I wish I understood his thinking.</p>
                      <p className="text-slate-300 mb-2">You check: "Certificates valid for 89 more days"</p>
                      <p className="text-cyan-400 mb-2"><strong>Chris:</strong> "Okay, stand by."</p>
                      <p className="text-slate-300 italic">I'm just running random checks. I have no idea if we're getting closer to the problem or not. Are we working from a theory or just checking everything we can think of?</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-white font-semibold mb-2">YOUR INTERNAL THOUGHTS:</h4>
                    <div className="bg-slate-800/50 p-4 rounded italic text-slate-300">
                      <p className="mb-2">"I'm following orders but I don't understand the strategy. That makes it hard for me to know if my findings are important or not.</p>
                      <p className="mb-2">When I found all instances were healthy, I didn't know if that was good news (not a deployment issue) or bad news (the problem is somewhere else). Chris just said 'good' and moved on.</p>
                      <p className="mb-2">If Chris had said 'I think this might be a routing issue, I need you to check load balancer health checks to rule that out' - I'd understand why I'm doing this and what to look for.</p>
                      <p className="mb-2">I can follow instructions, but I'm much more effective when I understand the context. Right now I'm a robot executing commands.</p>
                      <p>I also have insights about this system that could help, but there's no space for me to share them. It's all top-down direction.</p>
                      <p>Once we fix this, I probably won't understand WHY my findings mattered or what I learned for next time."</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-white font-semibold mb-2">Reflection Questions</h4>
                    <ol className="list-decimal list-inside space-y-2 text-slate-300 ml-4">
                      <li>How did the lack of context affect Taylor's effectiveness?</li>
                      <li>What would have helped Taylor contribute more?</li>
                      <li>How can leaders provide context even in urgent situations?</li>
                    </ol>
                  </div>

                  <details className="glass-card p-4 bg-slate-800/30">
                    <summary className="text-white font-semibold cursor-pointer hover:text-purple-400">
                      Click for Analysis
                    </summary>
                    <div className="mt-4 space-y-4 text-slate-300 text-sm">
                      <div>
                        <h5 className="text-white font-semibold mb-2">Taylor's Experience:</h5>
                        <p className="mb-2"><strong>Commanding style WITHOUT CONTEXT didn't work for Taylor because:</strong></p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Taylor needs to understand WHY to be effective</li>
                          <li>Operating blindly without understanding strategy</li>
                          <li>Can't determine if findings are important</li>
                          <li>Has insights that aren't being utilized</li>
                          <li>Won't learn from the experience</li>
                        </ul>
                        <p className="mt-2"><strong>Better approach for Taylor:</strong> "Taylor, I'm thinking this might be a routing or configuration issue since the alerts started after yesterday's deployment. Can you check load balancer and SSL cert status? I want to rule out infrastructure before we dive into application code."</p>
                        <p className="mt-2"><strong>Taylor's needs:</strong> Context and rationale, understanding the strategy, opportunity to contribute ideas, explanation of how pieces fit together, trusted with the full picture</p>
                      </div>
                    </div>
                  </details>
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

  // Empathy Exercise view (for tasks other than Lead a Team/Support Performance)
  // Note: team-member-perspectives for Lead a Team/Support Performance is handled above
  if (view === 'empathy-exercise' || (view === 'team-member-perspectives' && selectedTask !== 'Lead a Team' && selectedTask !== 'Support Performance')) {
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
    // For Lead a Team, use team_member_perspectives, for Empower Team use empowerment_perspectives, otherwise empathy_exercise
    let dataKey, activityTitle;
    if (selectedTask === 'Lead a Team' || selectedTask === 'Support Performance') {
      dataKey = 'team_member_perspectives';
      activityTitle = 'Team Member Perspectives';
    } else if (selectedTask === 'Empower Team') {
      dataKey = 'empowerment_perspectives';
      activityTitle = 'Empowerment Perspectives';
    } else {
      dataKey = 'empathy_exercise';
      activityTitle = 'Empathy Exercise';
    }
    // Extract scenarios - handle both object with scenarios property and direct array
    const rawData = currentTask.practice?.[dataKey] || currentTask.practice?.empathy_exercise;
    const empathyScenarios = (rawData?.scenarios || (Array.isArray(rawData) ? rawData : null)) || [];
    const currentScenarioData = empathyScenarios[empathyExerciseState.currentScenario];

    const handlePerspectiveView = (perspective) => {
      const scenarioId = currentScenarioData?.id;
      if (!scenarioId) return;

      const isEmpowerTeam = selectedTask === 'Empower Team';
      const perspectiveKey = isEmpowerTeam 
        ? (perspective === 'personA' ? 'perspective0' : perspective === 'personB' ? 'perspective1' : 'perspective2')
        : perspective;

      setEmpathyExerciseState(prev => ({
        ...prev,
        currentPerspective: perspective,
        viewedPerspectives: {
          ...prev.viewedPerspectives,
          [scenarioId]: {
            ...(prev.viewedPerspectives[scenarioId] || {}),
            [perspectiveKey]: true
          }
        }
      }));

      // Check if all perspectives viewed
      const viewedForScenario = empathyExerciseState.viewedPerspectives[scenarioId] || {};
      const allViewed = isEmpowerTeam
        ? viewedForScenario.perspective0 && viewedForScenario.perspective1 && viewedForScenario.perspective2
        : viewedForScenario.personA && viewedForScenario.personB && viewedForScenario.pm;
      if (allViewed || (perspective === 'pm' && !isEmpowerTeam && viewedForScenario.personA && viewedForScenario.personB)) {
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

    // Use the top-level goToPracticeHub function, but reset state first
    const resetAndGoToPracticeHub = () => {
      setEmpathyExerciseState({
        currentScenario: 0,
        currentPerspective: 'personA',
        viewedPerspectives: {},
        showingInsight: false,
        reflections: {},
        progressRecorded: false,
        lastRecordedScenario: -1
      });
      goToPracticeHub();
    };

    if (!currentScenarioData) {
      return (
        <div className="max-w-6xl w-full p-10 animate-fadeIn text-left">
          <div className="glass-card p-10 text-center">
            <h1 className="executive-font text-3xl font-bold text-white mb-4">ðŸ‘¥ {activityTitle}</h1>
            <p className="text-slate-400">No scenarios available for this task.</p>
            <button 
              onClick={goToPracticeHub}
              className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors executive-font"
            >
              â† Back to Practice Hub
            </button>
            <GlobalNavFooter />
          </div>
        </div>
      );
    }

    const scenarioId = currentScenarioData.id;
    const viewedForScenario = empathyExerciseState.viewedPerspectives[scenarioId] || {};
    
    // Handle different structure: Empower Team has perspectives array, others have perspective_a/perspective_b/pm
    const isEmpowerTeam = selectedTask === 'Empower Team';
    const perspectives = isEmpowerTeam && Array.isArray(currentScenarioData.perspectives) 
      ? currentScenarioData.perspectives 
      : null;
    
    // For Empower Team, use perspective indices (0, 1, 2) instead of personA/personB/pm
    const currentPerspectiveIndex = isEmpowerTeam 
      ? (empathyExerciseState.currentPerspective === 'personA' ? 0 : empathyExerciseState.currentPerspective === 'personB' ? 1 : 2)
      : null;
    const currentPerspective = isEmpowerTeam && perspectives && currentPerspectiveIndex !== null
      ? perspectives[currentPerspectiveIndex] 
      : null;
    
    const allPerspectivesViewed = isEmpowerTeam
      ? perspectives && perspectives.every((_, idx) => viewedForScenario[`perspective${idx}`])
      : viewedForScenario.personA && viewedForScenario.personB && viewedForScenario.pm;

    return (
      <div className="max-w-6xl w-full p-10 animate-fadeIn text-left">
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={goToPracticeHub}
              className="px-4 py-2 executive-font text-xs text-slate-400 hover:text-white uppercase font-semibold transition-colors flex items-center gap-2"
            >
              â† Back
            </button>
          </div>
          <div className="flex items-center justify-between mb-4">
            <h1 className="executive-font text-5xl font-bold text-white tracking-tight">ðŸ‘¥ {activityTitle}: See Both Sides</h1>
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
            {isEmpowerTeam && perspectives ? (
              // Empower Team: render perspectives from array
              perspectives.map((perspective, idx) => {
                const perspectiveKey = idx === 0 ? 'personA' : idx === 1 ? 'personB' : 'pm';
                const isActive = empathyExerciseState.currentPerspective === perspectiveKey;
                const borderColors = ['border-blue-400', 'border-orange-400', 'border-purple-400'];
                return (
                  <button
                    key={idx}
                    onClick={() => handlePerspectiveView(perspectiveKey)}
                    className={`px-6 py-3 executive-font text-xs font-semibold uppercase transition-all relative ${
                      isActive
                        ? `text-white border-b-2 ${borderColors[idx]}`
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {perspective.role} {perspective.emoji}
                    {viewedForScenario[`perspective${idx}`] && <span className="ml-2 text-emerald-400">“</span>}
                  </button>
                );
              })
            ) : (
              // Other tasks: use personA/personB/pm structure
              <>
            <button
              onClick={() => handlePerspectiveView('personA')}
              className={`px-6 py-3 executive-font text-xs font-semibold uppercase transition-all relative ${
                empathyExerciseState.currentPerspective === 'personA'
                  ? 'text-white border-b-2 border-blue-400'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
                  View as {currentScenarioData.perspectives?.personA?.name || currentScenarioData.perspective_a?.name} {currentScenarioData.perspectives?.personA?.emoji || currentScenarioData.perspective_a?.emoji}
              {viewedForScenario.personA && <span className="ml-2 text-emerald-400">“</span>}
            </button>
            <button
              onClick={() => handlePerspectiveView('personB')}
              className={`px-6 py-3 executive-font text-xs font-semibold uppercase transition-all relative ${
                empathyExerciseState.currentPerspective === 'personB'
                  ? 'text-white border-b-2 border-orange-400'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
                  View as {currentScenarioData.perspectives?.personB?.name || currentScenarioData.perspective_b?.name} {currentScenarioData.perspectives?.personB?.emoji || currentScenarioData.perspective_b?.emoji}
              {viewedForScenario.personB && <span className="ml-2 text-emerald-400">“</span>}
            </button>
            <button
              onClick={() => handlePerspectiveView('pm')}
              className={`px-6 py-3 executive-font text-xs font-semibold uppercase transition-all relative ${
                empathyExerciseState.currentPerspective === 'pm'
                  ? 'text-white border-b-2 border-purple-400'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
                  View as PM {currentScenarioData.perspectives?.pm?.emoji || currentScenarioData.perspective_pm?.emoji}
              {viewedForScenario.pm && <span className="ml-2 text-emerald-400">“</span>}
            </button>
              </>
            )}
          </div>

          {/* Person A Perspective */}
          {empathyExerciseState.currentPerspective === 'personA' && (
            <div className="glass-card p-8 border-l-4 border-blue-500 bg-blue-500/5 perspective-content">
              {isEmpowerTeam && perspectives && perspectives[0] ? (
                // Empower Team structure
                <>
              <div className="flex items-center gap-3 mb-6">
                    <span className="text-4xl">{perspectives[0].emoji}</span>
                <div>
                      <h3 className="executive-font text-2xl font-bold text-white">{perspectives[0].role}</h3>
                </div>
              </div>
              <div className="bg-slate-800/50 p-6 rounded border-l-4 border-blue-400 mb-6">
                    <p className="text-white text-lg italic leading-relaxed">"{perspectives[0].thoughts}"</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-white font-semibold mb-2">Feelings:</h4>
                      <div className="flex flex-wrap gap-2">
                        {perspectives[0].feelings.map((feeling, idx) => (
                          <span key={idx} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">{feeling}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-2">Needs:</h4>
                      <p className="text-slate-300">{perspectives[0].needs}</p>
                    </div>
                  </div>
                </>
              ) : (
                // Other tasks structure
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-4xl">{currentScenarioData.perspectives?.personA?.emoji || currentScenarioData.perspective_a?.emoji}</span>
                    <div>
                      <h3 className="executive-font text-2xl font-bold text-white">{currentScenarioData.perspectives?.personA?.name || currentScenarioData.perspective_a?.name}</h3>
                      <p className="text-slate-400">{currentScenarioData.perspectives?.personA?.role || currentScenarioData.perspective_a?.role}</p>
                    </div>
                  </div>
                  <div className="bg-slate-800/50 p-6 rounded border-l-4 border-blue-400 mb-6">
                    <p className="text-white text-lg italic leading-relaxed">"{currentScenarioData.perspectives?.personA?.thoughts || currentScenarioData.perspective_a?.internal_monologue}"</p>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-white font-semibold mb-2">Concerns:</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                        {(currentScenarioData.perspectives?.personA?.concerns || []).map((concern, idx) => (
                      <li key={idx}>{concern}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Fears:</h4>
                      <p className="text-slate-300">{currentScenarioData.perspectives?.personA?.fears || ''}</p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">What they wish others knew:</h4>
                      <p className="text-slate-300 italic">{currentScenarioData.perspectives?.personA?.wishesOthersKnew || ''}</p>
                </div>
              </div>
                </>
              )}
            </div>
          )}

          {/* Person B Perspective */}
          {empathyExerciseState.currentPerspective === 'personB' && (
            <div className="glass-card p-8 border-l-4 border-orange-500 bg-orange-500/5 animate-fadeIn">
              {isEmpowerTeam && perspectives && perspectives[1] ? (
                // Empower Team structure
                <>
              <div className="flex items-center gap-3 mb-6">
                    <span className="text-4xl">{perspectives[1].emoji}</span>
                <div>
                      <h3 className="executive-font text-2xl font-bold text-white">{perspectives[1].role}</h3>
                </div>
              </div>
              <div className="bg-slate-800/50 p-6 rounded border-l-4 border-orange-400 mb-6">
                    <p className="text-white text-lg italic leading-relaxed">"{perspectives[1].thoughts}"</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-white font-semibold mb-2">Feelings:</h4>
                      <div className="flex flex-wrap gap-2">
                        {perspectives[1].feelings.map((feeling, idx) => (
                          <span key={idx} className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-sm">{feeling}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-2">Needs:</h4>
                      <p className="text-slate-300">{perspectives[1].needs}</p>
                    </div>
                  </div>
                </>
              ) : (
                // Other tasks structure
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-4xl">{currentScenarioData.perspectives?.personB?.emoji || currentScenarioData.perspective_b?.emoji}</span>
                    <div>
                      <h3 className="executive-font text-2xl font-bold text-white">{currentScenarioData.perspectives?.personB?.name || currentScenarioData.perspective_b?.name}</h3>
                      <p className="text-slate-400">{currentScenarioData.perspectives?.personB?.role || currentScenarioData.perspective_b?.role}</p>
                    </div>
                  </div>
                  <div className="bg-slate-800/50 p-6 rounded border-l-4 border-orange-400 mb-6">
                    <p className="text-white text-lg italic leading-relaxed">"{currentScenarioData.perspectives?.personB?.thoughts || currentScenarioData.perspective_b?.internal_monologue}"</p>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-white font-semibold mb-2">Concerns:</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                        {(currentScenarioData.perspectives?.personB?.concerns || []).map((concern, idx) => (
                      <li key={idx}>{concern}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Fears:</h4>
                      <p className="text-slate-300">{currentScenarioData.perspectives?.personB?.fears || ''}</p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">What they wish others knew:</h4>
                      <p className="text-slate-300 italic">{currentScenarioData.perspectives?.personB?.wishesOthersKnew || ''}</p>
                </div>
              </div>
                </>
              )}
            </div>
          )}

          {/* PM Perspective */}
          {empathyExerciseState.currentPerspective === 'pm' && (
            <div className="glass-card p-8 border-l-4 border-purple-500 bg-purple-500/5 perspective-content">
              {isEmpowerTeam && perspectives && perspectives[2] ? (
                // Empower Team structure
                <>
              <div className="flex items-center gap-3 mb-6">
                    <span className="text-4xl">{perspectives[2].emoji}</span>
                    <div>
                      <h3 className="executive-font text-2xl font-bold text-white">{perspectives[2].role}</h3>
                    </div>
                  </div>
                  <div className="bg-slate-800/50 p-6 rounded border-l-4 border-purple-400 mb-6">
                    <p className="text-white text-lg italic leading-relaxed">"{perspectives[2].thoughts}"</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-white font-semibold mb-2">Feelings:</h4>
                      <div className="flex flex-wrap gap-2">
                        {perspectives[2].feelings && perspectives[2].feelings.length > 0 && perspectives[2].feelings[0] !== 'N/A - Context' ? (
                          perspectives[2].feelings.map((feeling, idx) => (
                            <span key={idx} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">{feeling}</span>
                          ))
                        ) : (
                          <span className="text-slate-400 italic">Context information</span>
                        )}
                      </div>
                    </div>
                    {perspectives[2].needs && perspectives[2].needs !== 'N/A - Context' && (
                      <div>
                        <h4 className="text-white font-semibold mb-2">Needs:</h4>
                        <p className="text-slate-300">{perspectives[2].needs}</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                // Other tasks structure
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-4xl">{currentScenarioData.perspectives?.pm?.emoji || currentScenarioData.perspective_pm?.emoji}</span>
                <h3 className="executive-font text-2xl font-bold text-white">Project Manager's View</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="text-white font-semibold mb-3">Observations:</h4>
                  <ul className="list-disc list-inside space-y-2 text-slate-300">
                        {(currentScenarioData.perspectives?.pm?.observations || []).map((obs, idx) => (
                      <li key={idx}>{obs}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-3">Valid Points:</h4>
                  <div className="space-y-2">
                    <div className="bg-blue-500/10 p-3 rounded border-l-2 border-blue-400">
                          <p className="text-slate-300"><span className="font-semibold text-blue-400">{currentScenarioData.perspectives?.personA?.name || currentScenarioData.perspective_a?.name}:</span> {currentScenarioData.perspectives?.pm?.validPoints?.architect || currentScenarioData.perspectives?.pm?.validPoints?.personA}</p>
                    </div>
                    <div className="bg-orange-500/10 p-3 rounded border-l-2 border-orange-400">
                          <p className="text-slate-300"><span className="font-semibold text-orange-400">{currentScenarioData.perspectives?.personB?.name || currentScenarioData.perspective_b?.name}:</span> {currentScenarioData.perspectives?.pm?.validPoints?.engineer || currentScenarioData.perspectives?.pm?.validPoints?.personB || currentScenarioData.perspectives?.pm?.validPoints?.marketing}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">The Real Issue:</h4>
                      <p className="text-slate-300">{currentScenarioData.perspectives?.pm?.realIssue || ''}</p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Solution:</h4>
                      <p className="text-slate-300">{currentScenarioData.perspectives?.pm?.solution || ''}</p>
                </div>
              </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Insight Reveal */}
        {empathyExerciseState.showingInsight && (
          <div className="glass-card p-8 mb-6 border-l-4 border-yellow-500 bg-yellow-500/10 animate-fadeIn">
            <div className="flex items-center gap-3 mb-6">
              <LightbulbIcon size={48} stroke="currentColor" fill="currentColor" className="text-4xl" />
              <h2 className="executive-font text-3xl font-bold text-white">KEY INSIGHT</h2>
            </div>
            <div className="space-y-6">
              {isEmpowerTeam ? (
                // Empower Team structure: insight and betterApproach are strings
                <>
              <div>
                    <p className="text-white text-lg leading-relaxed">{currentScenarioData.insight}</p>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Better Approach:</h4>
                    <p className="text-slate-300 leading-relaxed">{currentScenarioData.betterApproach}</p>
                  </div>
                </>
              ) : (
                // Other tasks structure: insight is an object
                <>
                  <div>
                    <h3 className="text-yellow-400 font-bold text-xl mb-3">{currentScenarioData.insight?.title || currentScenarioData.key_insight}</h3>
                    <p className="text-white text-lg leading-relaxed">{currentScenarioData.insight?.revelation || currentScenarioData.insight || currentScenarioData.key_insight}</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Best Approach:</h4>
                    <p className="text-slate-300 leading-relaxed">{currentScenarioData.insight?.bestApproach || ''}</p>
              </div>
                  {currentScenarioData.insight?.eiConnection && (
              <div className="bg-blue-500/10 p-4 rounded border-l-2 border-blue-400">
                <h4 className="text-blue-400 font-semibold mb-2">Emotional Intelligence Connection:</h4>
                <p className="text-slate-300">{currentScenarioData.insight.eiConnection}</p>
              </div>
                  )}
                  {currentScenarioData.insight?.examTip && (
                <div className="bg-emerald-500/10 p-4 rounded border-l-2 border-emerald-400">
                  <h4 className="text-emerald-400 font-semibold mb-2">Exam Tip:</h4>
                  <p className="text-slate-300">{currentScenarioData.insight.examTip}</p>
                </div>
                  )}
                </>
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
              Next Scenario â†’
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
        â† Back to Learning
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
        â† Back to Task
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
        â† Back to Dashboard
      </button>
      <GlobalNavFooter />
    </div>
  );

  if (view === 'executive-hud') {
    return (
      <>
        <Confetti />
        <div className="min-h-screen w-full view-transition-wrapper" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 30%, #172554 60%, #0f172a 100%)', color: '#fff', padding: '30px 40px' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <ErrorBanner />
            
            {/* Header - Matching Progress Dashboard Style */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '35px' }}>
              <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end', height: '44px' }}>
                <div style={{ width: '10px', borderRadius: '3px', height: '55%', background: '#f97316' }}></div>
                <div style={{ width: '10px', borderRadius: '3px', height: '100%', background: '#8b5cf6' }}></div>
                <div style={{ width: '10px', borderRadius: '3px', height: '70%', background: '#ec4899' }}></div>
              </div>
              
              <div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff', margin: 0 }}>PMP Prep Center</h1>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: '3px', margin: 0 }}>Executive Learning Platform</p>
              </div>
              
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '25px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '25px', fontSize: '0.8rem' }}>
                  <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', animation: 'pulse 2s infinite', position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: 0, width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', animation: 'pulse 2s infinite' }}></div>
                  </div>
                  Live
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 600, letterSpacing: '-1px' }}>{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                </div>
              </div>
            </div>

            {/* Privacy Disclaimer */}
            <div style={{ 
              background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                <LockIcon size={24} stroke="#F59E0B" fill="none" />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.5 }}>
                    <span style={{ fontWeight: 600, color: '#fff' }}>Privacy First:</span> All your progress and scores are stored locally on your device. Nothing is shared or transmitted. Your data stays private and secure.
                  </p>
                </div>
              </div>
            </div>

      {/* Main Navigation Buttons - 3D Portfolio Style */}
      <div className="mb-12 animate-fadeIn">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <button 
            onClick={(e) => { createRipple(e); handleViewChange('strategy-suite'); }} 
            className="group relative glass-card p-8 text-center hover:scale-105 hover:-translate-y-2 transition-all duration-300 border-l-4 hover:shadow-[0_20px_50px_rgba(255,107,53,0.4)] hover:shadow-[#ff6b35]/30 btn-ripple overflow-hidden transform perspective-1000 preserve-3d"
            style={{transformStyle: 'preserve-3d', borderColor: '#ff6b35', backgroundColor: 'rgba(255, 107, 53, 0.1)'}}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#ff6b35]/0 to-[#ff6b35]/0 group-hover:from-[#ff6b35]/10 group-hover:to-[#ff6b35]/5 transition-all duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 transform group-hover:translate-z-10 transition-transform duration-300">
              <div className="text-4xl mb-3 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300" style={{transformStyle: 'preserve-3d'}}>📚</div>
              <div className="executive-font text-lg font-bold text-white mb-2 group-hover:text-[#ff6b35] transition-colors drop-shadow-lg">Learn</div>
              <div className="text-xs text-slate-400 group-hover:text-slate-300 uppercase tracking-widest">35 PMP Tasks</div>
            </div>
          </button>
          
          <button 
            onClick={(e) => { createRipple(e); handleViewChange('strategy-suite'); }} 
            className="group relative glass-card p-8 text-center hover:scale-105 hover:-translate-y-2 transition-all duration-300 border-l-4 hover:shadow-[0_20px_50px_rgba(0,212,255,0.4)] hover:shadow-[#00d4ff]/30 btn-ripple overflow-hidden transform perspective-1000 preserve-3d"
            style={{transformStyle: 'preserve-3d', borderColor: '#00d4ff', backgroundColor: 'rgba(0, 212, 255, 0.1)'}}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#00d4ff]/0 to-[#00d4ff]/0 group-hover:from-[#00d4ff]/10 group-hover:to-[#00d4ff]/5 transition-all duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 transform group-hover:translate-z-10 transition-transform duration-300">
              <div className="text-4xl mb-3 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300" style={{transformStyle: 'preserve-3d'}}>⚡</div>
              <div className="executive-font text-lg font-bold text-white mb-2 group-hover:text-[#00d4ff] transition-colors drop-shadow-lg">Practice</div>
              <div className="text-xs text-slate-400 group-hover:text-slate-300 uppercase tracking-widest">Task Areas</div>
            </div>
          </button>
          
          <button 
            onClick={(e) => { createRipple(e); handleViewChange('practice-quizzes'); }} 
            className="group relative glass-card p-8 text-center hover:scale-105 hover:-translate-y-2 transition-all duration-300 border-l-4 hover:shadow-[0_20px_50px_rgba(191,90,242,0.4)] hover:shadow-[#bf5af2]/30 btn-ripple overflow-hidden transform perspective-1000 preserve-3d"
            style={{transformStyle: 'preserve-3d', borderColor: '#bf5af2', backgroundColor: 'rgba(191, 90, 242, 0.1)'}}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#bf5af2]/0 to-[#bf5af2]/0 group-hover:from-[#bf5af2]/10 group-hover:to-[#bf5af2]/5 transition-all duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 transform group-hover:translate-z-10 transition-transform duration-300">
              <div className="text-4xl mb-3 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300" style={{transformStyle: 'preserve-3d'}}>ðŸŽ¯</div>
              <div className="executive-font text-lg font-bold text-white mb-2 group-hover:text-[#bf5af2] transition-colors drop-shadow-lg">Quizzes</div>
              <div className="text-xs text-slate-400 group-hover:text-slate-300 uppercase tracking-widest">Test Knowledge</div>
            </div>
          </button>
          
          <button 
            onClick={(e) => { createRipple(e); handleViewChange('practice-quizzes'); }} 
            className="group relative glass-card p-8 text-center hover:scale-105 hover:-translate-y-2 transition-all duration-300 border-l-4 hover:shadow-[0_20px_50px_rgba(0,255,136,0.4)] hover:shadow-[#00ff88]/30 btn-ripple overflow-hidden transform perspective-1000 preserve-3d"
            style={{transformStyle: 'preserve-3d', borderColor: '#00ff88', backgroundColor: 'rgba(0, 255, 136, 0.1)'}}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#00ff88]/0 to-[#00ff88]/0 group-hover:from-[#00ff88]/10 group-hover:to-[#00ff88]/5 transition-all duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 transform group-hover:translate-z-10 transition-transform duration-300">
              <div className="text-4xl mb-3 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300" style={{transformStyle: 'preserve-3d'}}>ðŸŽ“</div>
              <div className="executive-font text-lg font-bold text-white mb-2 group-hover:text-[#00ff88] transition-colors drop-shadow-lg">Full Exam</div>
              <div className="text-xs text-slate-400 group-hover:text-slate-300 uppercase tracking-widest">180 Questions</div>
            </div>
          </button>
        </div>
      </div>

      {/* Progress & Stats Navigation Buttons */}
      <div className="mb-10 animate-fadeIn">
        <div className="grid grid-cols-1 gap-6">
          <button 
            onClick={(e) => { createRipple(e); handleViewChange('progress-stats'); }} 
            className="group relative glass-card p-8 text-center hover:scale-105 hover:-translate-y-2 transition-all duration-300 border-l-4 hover:shadow-[0_20px_50px_rgba(255,193,7,0.4)] hover:shadow-[#ffc107]/30 btn-ripple overflow-hidden transform perspective-1000 preserve-3d"
            style={{transformStyle: 'preserve-3d', borderColor: '#ffc107', backgroundColor: 'rgba(255, 193, 7, 0.1)'}}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#ffc107]/0 to-[#ffc107]/0 group-hover:from-[#ffc107]/10 group-hover:to-[#ffc107]/5 transition-all duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 transform group-hover:translate-z-10 transition-transform duration-300">
              <div className="text-4xl mb-3 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300" style={{transformStyle: 'preserve-3d'}}>ðŸ†</div>
              <div className="executive-font text-lg font-bold text-white mb-2 group-hover:text-[#ffc107] transition-colors drop-shadow-lg">My Progress/Badges</div>
              <div className="text-xs text-slate-400 group-hover:text-slate-300 uppercase tracking-widest">Track Your Journey</div>
            </div>
          </button>
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
                Ã—
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
        </div>
      </>
    );
  }

  if (view === 'strategy-suite') {
    const getDomainProgress = (tasks) => {
      let completed = 0;
      let total = 0;
      tasks.forEach(task => {
        ['overview', 'pmp-application', 'deep-dive'].forEach(tab => {
          total++;
          if (localStorage.getItem(`learn-viewed-${task}-${tab}`)) completed++;
        });
        ['pm-simulator', 'lightning-round', 'document-detective', 'conflict-matcher', 'timeline-reconstructor', 'empathy-exercise'].forEach(activity => {
          total++;
          if (progressData.completedActivities[task]?.[activity]?.completed ||
              localStorage.getItem(`activity-accessed-${task}-${activity}`) ||
              localStorage.getItem(`lightning-round-best-${task}`)) {
            completed++;
          }
        });
      });
      return total > 0 ? Math.round((completed / total) * 100) : 0;
    };

    const domainConfig = {
      'People Domain': { color: '#ff7a2f', icon: '' },
      'Process Domain': { color: '#00e5ff', icon: '' },
      'Business Domain': { color: '#c454ff', icon: '' }
    };

    return (
      <div className="min-h-screen w-full executive-hud-bg" style={{ color: '#fff', padding: '30px 40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          
          <header className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-5">
              <button 
                onClick={() => handleViewChange('executive-hud')}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
                style={{ background: 'rgba(0, 229, 255, 0.1)', border: '1px solid rgba(0, 229, 255, 0.3)', color: '#00e5ff' }}
              >
                â† Back
              </button>
              <div className="flex gap-1 items-end h-10">
                <div style={{ width: '8px', borderRadius: '3px', height: '50%', background: '#ff7a2f' }}></div>
                <div style={{ width: '8px', borderRadius: '3px', height: '100%', background: '#c454ff' }}></div>
                <div style={{ width: '8px', borderRadius: '3px', height: '70%', background: '#00e5ff' }}></div>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">Learning Lab</h1>
                <p className="text-xs text-slate-500 uppercase tracking-widest">Explore PMP Knowledge Domains and Tasks</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                Live
              </div>
              <div className="text-right">
                <div className="text-xl font-light" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                </div>
                <div className="text-xs text-slate-500">{currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {Object.entries(domainMap).map(([domain, tasks]) => {
              const config = domainConfig[domain] || { color: '#666', icon: '📚' };
              const progress = getDomainProgress(tasks);
              
              return (
                <div key={domain} className="domain-pill" style={{ '--domain-color': config.color }}>
                  <div className="domain-pill-inner">
                    <div className="flex items-center gap-4 mb-5 pb-4" style={{ borderBottom: `1px solid ${config.color}30` }}>
                      <div className="domain-coin" style={{ '--glow-inner': `${config.color}40` }}>
                        <span style={{ fontSize: '24px', filter: `drop-shadow(0 0 8px ${config.color})` }}>{config.icon}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: config.color }}>{domain}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: config.color, boxShadow: `0 0 10px ${config.color}` }}></div>
                          </div>
                          <span className="text-xs font-mono" style={{ color: config.color }}>{progress}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {tasks.map(task => {
                        const mastery = getTaskMastery(task);
                        const isComplete = mastery.level === 'mastered';
                        const inProgress = mastery.completed > 0;
                        
                        return (
                          <button
                            key={task}
                            onClick={() => { setSelectedTask(task); handleViewChange('task-interstitial'); }}
                            className="task-pill w-full"
                            style={{ '--task-color': config.color }}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-sm text-left flex-1">{task}</span>
                              <div className="flex items-center gap-2">
                                {isComplete && <span className="text-xs">…</span>}
                                {inProgress && !isComplete && (
                                  <div className="flex gap-0.5">
                                    {[...Array(6)].map((_, i) => (
                                      <div 
                                        key={i} 
                                        className="w-1.5 h-1.5 rounded-full"
                                        style={{ 
                                          background: i < mastery.completed ? config.color : 'rgba(255,255,255,0.2)',
                                          boxShadow: i < mastery.completed ? `0 0 4px ${config.color}` : 'none'
                                        }}
                                      ></div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <GlobalNavFooter />
        </div>
      </div>
    );
  }

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
    <PageWrapper 
      title={`Practice Hub: ${selectedTask}`}
      subtitle="Skill Building Activities"
      showBackButton={true}
      backAction={() => setView('task-interstitial')}
    >
      <div className="animate-fadeIn text-left">
      
      {/* Activity Cards Grid - 3x2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {(() => {
          // Base activity configuration
          const baseActivities = [
            { name: 'pm-simulator', emoji: 'ðŸŽ¯', title: 'PM Simulator', desc: 'Branching scenarios with consequences', color: '#ff6b35', borderColor: '#ff6b35', hoverColor: 'rgba(255, 107, 53, 0.1)', shadowColor: 'rgba(255, 107, 53, 0.2)' },
            { name: 'lightning-round', emoji: '⚡', title: 'Lightning Round', desc: 'Fast-paced quiz - 10 questions', color: '#00d4ff', borderColor: '#00d4ff', hoverColor: 'rgba(0, 212, 255, 0.1)', shadowColor: 'rgba(0, 212, 255, 0.2)' },
            { name: 'document-detective', emoji: 'ðŸ•µï¸', title: 'Document Detective', desc: 'Match documents to scenarios', color: '#bf5af2', borderColor: '#bf5af2', hoverColor: 'rgba(191, 90, 242, 0.1)', shadowColor: 'rgba(191, 90, 242, 0.2)' },
            { name: 'conflict-matcher', emoji: 'ðŸ§©', title: selectedTask === 'Empower Team' ? 'Delegation Level Matcher' : selectedTask === 'Support Performance' ? 'Feedback Type Matcher' : 'Conflict Mode Matcher', desc: 'Drag-drop matching', color: '#ff6b35', borderColor: '#ff6b35', hoverColor: 'rgba(255, 107, 53, 0.1)', shadowColor: 'rgba(255, 107, 53, 0.2)' },
            { name: 'timeline-reconstructor', emoji: 'ðŸ“‹', title: 'Timeline Reconstructor', desc: 'Order resolution steps', color: '#00d4ff', borderColor: '#00d4ff', hoverColor: 'rgba(0, 212, 255, 0.1)', shadowColor: 'rgba(0, 212, 255, 0.2)' },
            { name: 'empathy-exercise', emoji: 'ðŸ‘¥', title: (selectedTask === 'Lead a Team' || selectedTask === 'Support Performance') ? 'Team Member Perspectives' : 'Empathy Exercise', desc: 'See all perspectives', color: '#bf5af2', borderColor: '#bf5af2', hoverColor: 'rgba(191, 90, 242, 0.1)', shadowColor: 'rgba(191, 90, 242, 0.2)' }
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
          
          // For Empower Team, rename specific activities
          if (selectedTask === 'Empower Team') {
            return baseActivities.map(activity => {
              if (activity.name === 'conflict-matcher') {
                return { ...activity, title: 'Delegation Level Matcher', desc: 'Match scenarios to delegation levels' };
              } else if (activity.name === 'empathy-exercise') {
                return { ...activity, title: 'Empowerment Perspectives', desc: 'See empowerment situations from multiple stakeholder viewpoints' };
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
            statusTooltip = `“ Completed on ${completedDate ? new Date(completedDate).toLocaleDateString() : 'recently'}`;
          } else if (isInProgress) {
            statusTooltip = '“ In progress';
          } else {
            statusTooltip = '○ Not started yet';
          }
          
          return (
            <button
              key={activity.name}
              onClick={() => {
                // For Lead a Team and Support Performance, route empathy-exercise to team-member-perspectives
                if (activity.name === 'empathy-exercise' && (selectedTask === 'Lead a Team' || selectedTask === 'Support Performance')) {
                  setView('team-member-perspectives');
                } else {
                  setView(activity.name);
                }
              }}
              className={`glass-card p-8 text-left ${activity.hoverColor} transition-all ${isCompleted ? 'border-l-4 border-emerald-500' : activity.borderColor} min-h-[200px] transform hover:scale-105 hover:shadow-2xl ${activity.shadowColor} relative group`}
            >
              {/* Status Indicator */}
              <div 
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all"
                style={{
                  backgroundColor: isCompleted ? '#00ff88' : isInProgress ? activity.color : 'transparent',
                  border: isCompleted || isInProgress ? 'none' : '2px solid rgba(255,255,255,0.3)',
                  boxShadow: isCompleted ? `0 0 10px #00ff88` : isInProgress ? `0 0 10px ${activity.color}` : 'none',
                  color: isCompleted || isInProgress ? '#000' : 'rgba(255,255,255,0.5)'
                }}
                title={statusTooltip}
              >
                {isCompleted ? (
                  <span className="text-lg font-bold">“</span>
                ) : isInProgress ? (
                  <span className="text-lg font-bold">“</span>
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
                    <p className="text-xs font-semibold mb-1" style={{color: '#00ff88'}}>Best: {bestScore.toLocaleString()} pts</p>
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
    </PageWrapper>
  );

  // Progress Stats View - Lazy loaded
  if (view === 'progress-stats') {
    return (
      <Suspense fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-6"></div>
            <h1 className="executive-font text-4xl text-white font-semibold tracking-tight mb-4">Loading Progress...</h1>
          </div>
        </div>
      }>
        <LazyProgressStats
          progressData={progressData}
          currentTime={currentTime}
          setView={setView}
          setSelectedTask={setSelectedTask}
          setSubView={setSubView}
          domainMap={domainMap}
        />
      </Suspense>
    );
  }

  // OLD Progress Stats View - REMOVED
  // This entire block has been moved to src/views/ProgressStats.jsx and is now lazy loaded
  if (view === 'detailed-analytics') {
    const completeColor = '#00ff88';
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
    
    // Get quiz statistics
    const quizData = getQuizData();

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
              â† Back
            </button>
            <button
              onClick={exportProgress}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors executive-font text-sm"
            >
              <><FileIcon size={18} stroke="currentColor" className="inline-block mr-2" /> Export Progress</>
            </button>
          </div>
          <h1 className="executive-font text-5xl font-bold text-white tracking-tight mb-2 flex items-center gap-3"><SearchIcon size={48} stroke="currentColor" className="inline-block" /> Detailed Analytics</h1>
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

        {/* Quiz Statistics */}
        {quizData.totalQuizzes > 0 && (
          <div className="glass-card p-6 mb-6">
            <h2 className="executive-font text-2xl font-bold text-white mb-4">ðŸ“ Quiz Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-card p-4 bg-slate-800/30 border-l-4 border-cyan-500">
                <h3 className="text-white font-semibold mb-3">Total Quizzes</h3>
                <div className="text-3xl font-bold text-cyan-400 mb-1">{quizData.totalQuizzes}</div>
                <div className="text-xs text-slate-400">Quizzes completed</div>
              </div>
              <div className="glass-card p-4 bg-slate-800/30 border-l-4 border-emerald-500">
                <h3 className="text-white font-semibold mb-3">Best Score</h3>
                <div className="text-3xl font-bold text-emerald-400 mb-1">{quizData.bestScore}%</div>
                <div className="text-xs text-slate-400">Highest percentage</div>
              </div>
              <div className="glass-card p-4 bg-slate-800/30 border-l-4 border-blue-500">
                <h3 className="text-white font-semibold mb-3">Average Score</h3>
                <div className="text-3xl font-bold text-blue-400 mb-1">{quizData.averageScore}%</div>
                <div className="text-xs text-slate-400">Overall average</div>
              </div>
              <div className="glass-card p-4 bg-slate-800/30 border-l-4 border-purple-500">
                <h3 className="text-white font-semibold mb-3">Questions Answered</h3>
                <div className="text-3xl font-bold text-purple-400 mb-1">{quizData.totalQuestions}</div>
                <div className="text-xs text-slate-400">{quizData.totalCorrect} correct</div>
              </div>
            </div>
          </div>
        )}

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
                <h3 className="text-white font-semibold mb-3">ðŸŽ¯ PM Simulator</h3>
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
                <h3 className="text-white font-semibold mb-3">ðŸ•µï¸ Document Detective</h3>
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
                <h3 className="text-white font-semibold mb-3">ðŸ§© Conflict Matcher</h3>
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
                <h3 className="text-white font-semibold mb-3">ðŸ“‹ Timeline Reconstructor</h3>
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
                <h3 className="text-white font-semibold mb-3">ðŸ‘¥ Empathy/Team Perspectives</h3>
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
            <h2 className="executive-font text-2xl font-bold text-white mb-4">ðŸ’¡ Recommendations</h2>
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
  // Wrapper for renderMarkdown to return JSX
  const renderMarkdown = (markdown) => {
    if (!markdown) return <div className="text-slate-400">Loading content...</div>;
    const html = renderMarkdownHelper(markdown);
    return <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />;
  };

  // Use getAllTasks from constants
  const getAllTasks = getAllTasksHelper;

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
      // Support Performance uses 7-section structure: What This Task Is, ECO Enablers, Key Frameworks, How To Apply It, Exam Triggers, Quick Scenarios, Common Mistakes
      if (overview.what_this_task_is) sections.push({ key: 'what_this_task_is', title: 'What This Task Is', content: overview.what_this_task_is, type: 'what-this-task-is' });
      if (overview.definition) sections.push({ key: 'definition', title: 'Definition', content: overview.definition, type: 'definition' });
      if (overview.eco_enablers && overview.eco_enablers.length > 0) sections.push({ key: 'eco_enablers', title: 'ECO Enablers', content: overview.eco_enablers, type: 'list' });
      if (overview.core_principle) sections.push({ key: 'core_principle', title: 'Core Principle', content: overview.core_principle, type: 'text' });
      if (overview.module_introduction) sections.push({ key: 'module_introduction', title: 'Module Introduction', content: overview.module_introduction, type: 'text' });
      if (overview.key_frameworks) {
        const isEnhanced = typeof overview.key_frameworks === 'object' && overview.key_frameworks !== null && overview.key_frameworks.enhanced === true;
        sections.push({ key: 'key_frameworks', title: 'Key Frameworks', content: overview.key_frameworks, type: 'key-frameworks' });
      }
      if (overview.how_to_apply_it) {
        const isEnhanced = typeof overview.how_to_apply_it === 'object' && overview.how_to_apply_it !== null && overview.how_to_apply_it.enhanced === true;
        sections.push({ key: 'how_to_apply_it', title: 'How To Apply It', content: overview.how_to_apply_it, type: 'how-to-apply' });
      }
      if (overview.what_youll_learn && overview.what_youll_learn.length > 0) sections.push({ key: 'what_youll_learn', title: "What You'll Learn", content: overview.what_youll_learn, type: 'list' });
      if (overview.key_learning_objectives && overview.key_learning_objectives.length > 0) sections.push({ key: 'key_learning_objectives', title: 'Key Learning Objectives', content: overview.key_learning_objectives, type: 'numbered-list' });
      if (overview.why_this_matters) sections.push({ key: 'why_this_matters', title: 'Why This Matters', content: overview.why_this_matters, type: 'text' });
      if (overview.exam_triggers) {
        const isEnhanced = typeof overview.exam_triggers === 'object' && overview.exam_triggers !== null && overview.exam_triggers.enhanced === true;
        const isArray = Array.isArray(overview.exam_triggers) && overview.exam_triggers.length > 0;
        if (isEnhanced || isArray) {
          sections.push({ key: 'exam_triggers', title: 'Exam Triggers', content: overview.exam_triggers, type: 'list' });
        }
      }
      if (overview.performance_management_framework) sections.push({ key: 'performance_management_framework', title: 'Performance Management Framework', content: overview.performance_management_framework, type: 'performance-framework' });
      if (overview.sbi_examples) sections.push({ key: 'sbi_examples', title: 'SBI Feedback Examples', content: overview.sbi_examples, type: 'sbi-examples' });
      if (overview.recognition_best_practices) sections.push({ key: 'recognition_best_practices', title: 'Recognition Best Practices', content: overview.recognition_best_practices, type: 'recognition-practices' });
      if (overview.quick_scenarios) {
        const isEnhanced = typeof overview.quick_scenarios === 'object' && overview.quick_scenarios !== null && overview.quick_scenarios.enhanced === true;
        const isArray = Array.isArray(overview.quick_scenarios) && overview.quick_scenarios.length > 0;
        if (isEnhanced || isArray) {
          sections.push({ key: 'quick_scenarios', title: 'Quick Scenarios', content: overview.quick_scenarios, type: 'scenarios' });
        }
      }
      if (overview.key_exam_principles) sections.push({ key: 'key_exam_principles', title: 'Key Exam Principles', content: overview.key_exam_principles, type: 'exam-principles' });
      if (overview.common_wrong_answers && overview.common_wrong_answers.length > 0) sections.push({ key: 'common_wrong_answers', title: 'Common Wrong Answers', content: overview.common_wrong_answers, type: 'list' });
      if (overview.common_mistakes) {
        const isEnhanced = typeof overview.common_mistakes === 'object' && overview.common_mistakes !== null && overview.common_mistakes.enhanced === true;
        sections.push({ key: 'common_mistakes', title: 'Common Mistakes', content: overview.common_mistakes, type: 'common-mistakes' });
      }
      if (overview.key_takeaways) {
        sections.push({ key: 'key_takeaways', title: 'Key Takeaways', content: overview.key_takeaways, type: 'numbered-list' });
      }
      if (overview.pmi_hierarchy && overview.pmi_hierarchy.length > 0) sections.push({ key: 'pmi_hierarchy', title: 'PMI Hierarchy', content: overview.pmi_hierarchy, type: 'hierarchy' });
    } else if (subView === 'pmp-application' && currentTask.learn.pmp_application) {
      const pmp = currentTask.learn.pmp_application;
      // Support Performance uses 5-section structure: How This Task Is Tested, Sample Question 1, Sample Question 2, Sample Question 3, Exam Strategy
      if (pmp.how_this_task_is_tested) sections.push({ key: 'how_this_task_is_tested', title: 'How This Task Is Tested', content: pmp.how_this_task_is_tested, type: 'how-task-tested' });
      if (pmp.sample_question_1) {
        const correctAnswer = pmp.sample_question_1.enhanced ? pmp.sample_question_1.correct_answer : 'B';
        sections.push({ key: 'sample_question_1', title: 'Sample Question 1', content: pmp.sample_question_1, type: 'sample-question', correctAnswer });
      }
      if (pmp.sample_question_2) {
        const correctAnswer = pmp.sample_question_2.enhanced ? pmp.sample_question_2.correct_answer : 'B';
        sections.push({ key: 'sample_question_2', title: 'Sample Question 2', content: pmp.sample_question_2, type: 'sample-question', correctAnswer });
      }
      if (pmp.sample_question_3) {
        const correctAnswer = pmp.sample_question_3.enhanced ? pmp.sample_question_3.correct_answer : 'B';
        sections.push({ key: 'sample_question_3', title: 'Sample Question 3', content: pmp.sample_question_3, type: 'sample-question', correctAnswer });
      }
      if (pmp.connection_to_pmp) sections.push({ key: 'connection_to_pmp', title: 'Connection to PMP Certification', content: pmp.connection_to_pmp, domain: pmp.domain, type: 'text' });
      if (pmp.related_tasks && pmp.related_tasks.length > 0) sections.push({ key: 'related_tasks', title: 'Related PMP Tasks', content: pmp.related_tasks, type: 'related-tasks' });
      if (pmp.exam_strategy) sections.push({ key: 'exam_strategy', title: 'Exam Strategy', content: pmp.exam_strategy, type: 'exam-strategy' });
      if (pmp.how_this_task_appears_on_exam) sections.push({ key: 'how_this_task_appears_on_exam', title: 'How This Task Appears on Exam', content: pmp.how_this_task_appears_on_exam, type: 'text' });
      if (pmp.how_module_supports_pmp_application && pmp.how_module_supports_pmp_application.length > 0) sections.push({ key: 'how_module_supports_pmp_application', title: 'How This Module Supports Your PMP Application', content: pmp.how_module_supports_pmp_application, type: 'numbered-list' });
      if (pmp.application_tips && pmp.application_tips.length > 0) sections.push({ key: 'application_tips', title: 'Application Tips', content: pmp.application_tips, type: 'list' });
      if (pmp.question_patterns && pmp.question_patterns.length > 0) sections.push({ key: 'question_patterns', title: 'Question Patterns', content: pmp.question_patterns, type: 'question-patterns' });
      if (pmp.sample_questions && pmp.sample_questions.length > 0) sections.push({ key: 'sample_questions', title: 'Sample Questions', content: pmp.sample_questions, type: 'sample-questions' });
      if (pmp.agile_vs_traditional) sections.push({ key: 'agile_vs_traditional', title: 'Agile vs Traditional', content: pmp.agile_vs_traditional, type: 'agile-vs-traditional' });
      if (pmp.decision_tree_visual) sections.push({ key: 'decision_tree_visual', title: 'Decision Tree', content: pmp.decision_tree_visual, type: 'text' });
    } else if (subView === 'deep-dive' && currentTask.learn.deep_dive) {
      const deep = currentTask.learn.deep_dive;
      // Support Performance uses 7-section structure: Introduction, SBI Feedback Model, Recognition & Development, Practical Application, Common Challenges, Connections to Other Tasks, Key Takeaways
      if (selectedTask === 'Support Performance') {
        // Exact 7 sections for Support Performance
        if (deep.introduction) {
          const introType = typeof deep.introduction === 'string' ? 'text' : 'introduction-detailed';
          sections.push({ key: 'introduction', title: 'Introduction', content: deep.introduction, type: introType });
        }
        if (deep.sbi_feedback_model) sections.push({ key: 'sbi_feedback_model', title: 'The SBI Feedback Model', content: deep.sbi_feedback_model, type: 'sbi-feedback-model' });
        if (deep.recognition_and_development) sections.push({ key: 'recognition_and_development', title: 'Recognition & Development', content: deep.recognition_and_development, type: 'recognition-development' });
        if (deep.practical_application) sections.push({ key: 'practical_application', title: 'Practical Application', content: deep.practical_application, type: 'practical-application' });
        if (deep.common_challenges && deep.common_challenges.length > 0) sections.push({ key: 'common_challenges', title: 'Common Challenges', content: deep.common_challenges, type: 'common-challenges' });
        if (deep.connections_to_other_tasks) sections.push({ key: 'connections_to_other_tasks', title: 'Connections to Other Tasks', content: deep.connections_to_other_tasks, type: 'connections-tasks' });
        if (deep.key_takeaways && deep.key_takeaways.length > 0) sections.push({ key: 'key_takeaways', title: 'Key Takeaways', content: deep.key_takeaways, type: 'numbered-list' });
      } else if (selectedTask === 'Manage Conflict') {
        // Enhanced Deep Dive structure for Manage Conflict
        if (deep.introduction && deep.introduction.enhanced) {
          sections.push({ key: 'introduction', title: 'Introduction', content: deep.introduction, type: 'introduction-enhanced' });
        }
        if (deep.thomas_kilmann_deep_dive && deep.thomas_kilmann_deep_dive.enhanced) {
          sections.push({ key: 'thomas_kilmann_deep_dive', title: 'Thomas-Kilmann Deep Dive', content: deep.thomas_kilmann_deep_dive, type: 'thomas-kilmann-enhanced' });
        }
        if (deep.emotional_intelligence && deep.emotional_intelligence.enhanced) {
          sections.push({ key: 'emotional_intelligence', title: 'Emotional Intelligence', content: deep.emotional_intelligence, type: 'emotional-intelligence-enhanced' });
        }
        if (deep.difficult_conversation_techniques && deep.difficult_conversation_techniques.enhanced) {
          sections.push({ key: 'difficult_conversation_techniques', title: 'Difficult Conversation Techniques', content: deep.difficult_conversation_techniques, type: 'difficult-conversations-enhanced' });
        }
        if (deep.common_challenges && deep.common_challenges.enhanced) {
          sections.push({ key: 'common_challenges', title: 'Common Challenges', content: deep.common_challenges, type: 'common-challenges-enhanced' });
        }
        if (deep.connections_to_other_tasks && deep.connections_to_other_tasks.enhanced) {
          sections.push({ key: 'connections_to_other_tasks', title: 'Connections to Other Tasks', content: deep.connections_to_other_tasks, type: 'connections-tasks-enhanced' });
        }
        if (deep.key_takeaways && deep.key_takeaways.enhanced) {
          sections.push({ key: 'key_takeaways', title: 'Key Takeaways', content: deep.key_takeaways, type: 'key-takeaways-enhanced' });
        }
      } else if (selectedTask === 'Empower Team') {
        // Exact 7 sections for Empower Team: Introduction, Delegation Continuum, Building Self-Organizing Teams, Practical Application, Common Challenges, Connections to Other Tasks, Key Takeaways
        if (deep.introduction) {
          const introType = typeof deep.introduction === 'string' ? 'text' : 'introduction-detailed';
          sections.push({ key: 'introduction', title: 'Introduction', content: deep.introduction, type: introType });
        }
        if (deep.delegation_continuum) sections.push({ key: 'delegation_continuum', title: 'The Delegation Continuum', content: deep.delegation_continuum, type: 'delegation-continuum' });
        if (deep.building_self_organizing_teams) sections.push({ key: 'building_self_organizing_teams', title: 'Building Self-Organizing Teams', content: deep.building_self_organizing_teams, type: 'self-organizing-teams' });
        if (deep.practical_application) sections.push({ key: 'practical_application', title: 'Practical Application', content: deep.practical_application, type: 'practical-application' });
        if (deep.common_challenges) sections.push({ key: 'common_challenges', title: 'Common Challenges', content: deep.common_challenges, type: 'common-challenges' });
        if (deep.connections_to_other_tasks) sections.push({ key: 'connections_to_other_tasks', title: 'Connections to Other Tasks', content: deep.connections_to_other_tasks, type: 'connections-tasks' });
        if (deep.key_takeaways) sections.push({ key: 'key_takeaways', title: 'Key Takeaways', content: deep.key_takeaways, type: 'key-takeaways' });
      } else {
        // Other tasks - use flexible structure
        if (deep.introduction) {
          const introType = typeof deep.introduction === 'string' ? 'text' : 'introduction-detailed';
          sections.push({ key: 'introduction', title: 'Introduction', content: deep.introduction, type: introType });
        }
        if (deep.foundational_concept) sections.push({ key: 'foundational_concept', title: 'Foundational Concept', content: deep.foundational_concept, type: 'text' });
        if (deep.performance_support_framework) sections.push({ key: 'performance_support_framework', title: 'The Performance Support Framework', content: deep.performance_support_framework, type: 'performance-support-framework' });
        if (deep.sbi_feedback_model) sections.push({ key: 'sbi_feedback_model', title: 'The SBI Feedback Model', content: deep.sbi_feedback_model, type: 'sbi-feedback-model' });
        if (deep.recognition_strategies) sections.push({ key: 'recognition_strategies', title: 'Recognition Strategies', content: deep.recognition_strategies, type: 'recognition-strategies' });
        if (deep.recognition_and_development) sections.push({ key: 'recognition_and_development', title: 'Recognition & Development', content: deep.recognition_and_development, type: 'recognition-development' });
        if (deep.addressing_underperformance) sections.push({ key: 'addressing_underperformance', title: 'Addressing Underperformance', content: deep.addressing_underperformance, type: 'addressing-underperformance' });
        if (deep.practical_application) sections.push({ key: 'practical_application', title: 'Practical Application', content: deep.practical_application, type: 'practical-application' });
        if (deep.development_and_growth) sections.push({ key: 'development_and_growth', title: 'Development and Growth', content: deep.development_and_growth, type: 'development-growth' });
        if (deep.performance_metrics) sections.push({ key: 'performance_metrics', title: 'Performance Metrics', content: deep.performance_metrics, type: 'performance-metrics' });
        if (deep.integration_with_other_tasks) sections.push({ key: 'integration_with_other_tasks', title: 'Integration with Other Tasks', content: deep.integration_with_other_tasks, type: 'integration-tasks' });
        if (deep.connections_to_other_tasks) sections.push({ key: 'connections_to_other_tasks', title: 'Connections to Other Tasks', content: deep.connections_to_other_tasks, type: 'connections-tasks' });
        if (deep.key_principles && deep.key_principles.length > 0) sections.push({ key: 'key_principles', title: 'Summary: Key Principles', content: deep.key_principles, type: 'numbered-list' });
        if (deep.key_takeaways && deep.key_takeaways.length > 0) sections.push({ key: 'key_takeaways', title: 'Key Takeaways', content: deep.key_takeaways, type: 'numbered-list' });
        if (deep.common_challenges && deep.common_challenges.length > 0) sections.push({ key: 'common_challenges', title: 'Common Challenges', content: deep.common_challenges, type: 'common-challenges' });
        if (deep.tuckmans_model) sections.push({ key: 'tuckmans_model', title: "Tuckman's Model", content: deep.tuckmans_model, type: 'tuckman' });
        if (deep.leadership_styles) sections.push({ key: 'leadership_styles', title: 'Leadership Styles', content: deep.leadership_styles, type: 'leadership-styles' });
        if (deep.situational_leadership) sections.push({ key: 'situational_leadership', title: 'Situational Leadership', content: deep.situational_leadership, type: 'situational-leadership' });
        if (deep.summary_and_key_takeaways) sections.push({ key: 'summary_and_key_takeaways', title: 'Summary and Key Takeaways', content: deep.summary_and_key_takeaways, type: 'summary' });
        if (deep.additional_resources) sections.push({ key: 'additional_resources', title: 'Additional Resources', content: deep.additional_resources, type: 'resources' });
        if (deep.thomas_kilmann_model) sections.push({ key: 'thomas_kilmann_model', title: 'Thomas-Kilmann Conflict Model', content: deep.thomas_kilmann_model, type: 'thomas-kilmann' });
        if (deep.step_by_step_process && deep.step_by_step_process.length > 0) sections.push({ key: 'step_by_step_process', title: 'Step-by-Step Process', content: deep.step_by_step_process, type: 'step-by-step' });
        if (deep.common_mistakes && deep.common_mistakes.length > 0) sections.push({ key: 'common_mistakes', title: 'Common Mistakes', content: deep.common_mistakes, type: 'common-mistakes' });
        if (deep.emotional_intelligence_connection) sections.push({ key: 'emotional_intelligence_connection', title: 'Emotional Intelligence Connection', content: deep.emotional_intelligence_connection, type: 'emotional-intelligence' });
      }
    }
    
    return sections;
  };

  // Helper function to render section content
  const SectionContentRenderer = ({ section }) => {
    const { type, content, domain } = section;
    
    switch (type) {
      case 'definition':
        // Special enhanced definition for Manage Conflict
        if (selectedTask === 'Manage Conflict' && typeof content === 'object' && content !== null && content.enhanced === true) {
          const def = content;
          return (
            <div className="space-y-6 max-w-full overflow-hidden">
              {/* Official ECO Definition */}
              <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-xl p-6 border border-emerald-500/20 max-w-full overflow-hidden">
                <div className="flex items-start gap-4 max-w-full">
                  <div className="bg-emerald-500/20 rounded-full p-3 flex-shrink-0">
                    <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <div className="text-emerald-400 text-sm font-semibold uppercase tracking-wide mb-2 break-words">ECO Task Definition</div>
                    <p className="text-xl text-gray-200 italic break-words overflow-hidden">
                      "{def.eco_definition || 'Apply emotional intelligence and interpersonal skills to navigate disagreements, reach consensus, and maintain team productivity while preserving relationships.'}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Core Principle */}
              {def.core_principle && (
                <div className="bg-white/5 rounded-xl p-6 border border-white/10 max-w-full overflow-hidden">
                  <h4 className="text-lg font-semibold text-amber-400 mb-4 break-words">Core Principle</h4>
                  <p className="text-gray-300 text-lg leading-relaxed break-words overflow-hidden">{safeRenderText(def.core_principle)}</p>
                </div>
              )}

              {/* The Conflict Equation */}
              {def.conflict_equation && (
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20 max-w-full overflow-hidden">
                  <h4 className="text-lg font-semibold text-purple-400 mb-4 break-words">The Conflict Management Equation</h4>
                  <div className="flex flex-wrap items-center justify-center gap-3 text-xl py-4 max-w-full">
                    <span className="bg-blue-500/20 px-4 py-2 rounded-lg text-blue-400 font-semibold break-words">Early Detection</span>
                    <span className="text-gray-500">+</span>
                    <span className="bg-emerald-500/20 px-4 py-2 rounded-lg text-emerald-400 font-semibold break-words">Right Approach</span>
                    <span className="text-gray-500">+</span>
                    <span className="bg-amber-500/20 px-4 py-2 rounded-lg text-amber-400 font-semibold break-words">Emotional Intelligence</span>
                    <span className="text-gray-500">=</span>
                    <span className="bg-gradient-to-r from-emerald-500/30 to-blue-500/30 px-4 py-2 rounded-lg text-white font-bold break-words">Resolution + Stronger Relationships</span>
                  </div>
                  {def.conflict_equation_note && (
                    <p className="text-gray-400 text-center text-sm mt-2 break-words overflow-hidden">{def.conflict_equation_note}</p>
                  )}
                </div>
              )}

              {/* Three Truths About Conflict */}
              {def.three_truths && Array.isArray(def.three_truths) && (
                <div className="bg-white/5 rounded-xl p-6 border border-white/10 max-w-full overflow-hidden">
                  <h4 className="text-lg font-semibold text-cyan-400 mb-4 break-words">Three Truths PMI Wants You to Know</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-full">
                    {def.three_truths.map((truth, idx) => {
                      const getColorClasses = (color) => {
                        switch(color) {
                          case 'cyan':
                            return { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-400' };
                          case 'emerald':
                            return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' };
                          case 'purple':
                            return { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400' };
                          default:
                            return { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-400' };
                        }
                      };
                      const colors = getColorClasses(truth.color);
                      return (
                        <div key={idx} className={`${colors.bg} rounded-lg p-4 border ${colors.border} text-center max-w-full overflow-hidden`}>
                          <div className="text-3xl mb-2">{truth.emoji}</div>
                          <div className={`${colors.text} font-semibold mb-2 break-words`}>{truth.title}</div>
                          <p className="text-gray-400 text-sm break-words overflow-hidden">{truth.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* What This Looks Like in Practice */}
              {def.practice_comparison && (
                <div className="bg-white/5 rounded-xl p-6 border border-white/10 max-w-full overflow-hidden">
                  <h4 className="text-lg font-semibold text-rose-400 mb-4 break-words">What This Looks Like in Practice</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-full">
                    <div className="space-y-3">
                      <div className="text-emerald-400 font-semibold flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Effective Conflict Management
                      </div>
                      <ul className="text-gray-300 text-sm space-y-2 ml-7 break-words">
                        {def.practice_comparison.effective && def.practice_comparison.effective.map((item, idx) => (
                          <li key={idx} className="break-words">• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <div className="text-red-400 font-semibold flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Ineffective Approaches
                      </div>
                      <ul className="text-gray-400 text-sm space-y-2 ml-7 break-words">
                        {def.practice_comparison.ineffective && def.practice_comparison.ineffective.map((item, idx) => (
                          <li key={idx} className="break-words">• {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Why This Matters */}
              {def.why_matters && (
                <div className="bg-gradient-to-r from-red-500/10 to-amber-500/10 rounded-xl p-6 border border-red-500/20 max-w-full overflow-hidden">
                  <h4 className="text-lg font-semibold text-red-400 mb-3 break-words">Why This Matters</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center max-w-full">
                    {def.why_matters.stats && def.why_matters.stats.map((stat, idx) => {
                      const colorClasses = {
                        red: 'text-red-400',
                        amber: 'text-amber-400',
                        orange: 'text-orange-400',
                        emerald: 'text-emerald-400'
                      };
                      const colorClass = colorClasses[stat.color] || colorClasses.red;
                      return (
                        <div key={idx}>
                          <div className={`text-3xl font-bold ${colorClass}`}>{stat.value}</div>
                          <div className="text-gray-400 text-xs">{stat.label}</div>
                        </div>
                      );
                    })}
                  </div>
                  {def.why_matters.note && (
                    <p className="text-gray-400 text-sm text-center mt-4 italic break-words">{def.why_matters.note}</p>
                  )}
                </div>
              )}

              {/* Bottom Line Callout */}
              {def.bottom_line && (
                <div className="bg-black/40 rounded-xl p-5 border-l-4 border-emerald-500 max-w-full overflow-hidden">
                  <p className="text-gray-200 text-lg break-words overflow-hidden">{safeRenderText(def.bottom_line)}</p>
                </div>
              )}
            </div>
          );
        }
        // Default simple definition for other tasks
        // Handle both string and object cases
        if (typeof content === 'string') {
        return <p className="text-xl text-white font-light italic leading-tight">"{content}"</p>;
        }
        // If content is an object but not enhanced, try to extract a string value
        if (typeof content === 'object' && content !== null) {
          const defText = content.eco_definition || content.definition || JSON.stringify(content);
          return <p className="text-xl text-white font-light italic leading-tight">"{defText}"</p>;
        }
        // Fallback
        return <p className="text-xl text-white font-light italic leading-tight">"{String(content)}"</p>;
      
      case 'text':
        return <p className="text-slate-300 leading-relaxed">{content}</p>;
      
      case 'list':
        // Enhanced Exam Triggers for Manage Conflict
        if (selectedTask === 'Manage Conflict' && section.key === 'exam_triggers' && typeof content === 'object' && content !== null && content.enhanced === true) {
          const triggers = content;
          
          return (
            <div className="space-y-6 max-w-full overflow-hidden">
              {/* Intro */}
              {triggers.intro && (
                <div style={{background: 'linear-gradient(to right, rgba(245, 158, 11, 0.1), rgba(249, 115, 22, 0.1))', padding: '20px', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '12px', marginBottom: '24px'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px'}}>
                    <div style={{fontSize: '24px'}}>ðŸŽ¯</div>
                    <p style={{color: '#e5e7eb', fontSize: '18px', lineHeight: '1.6'}}>
                      {String(triggers.intro || '').replace(/<[^>]*>/g, '').replace(/className/g, 'class')}
                    </p>
                  </div>
                </div>
              )}

              {/* Trigger Words Grid - ALWAYS RENDER */}
              <div style={{background: 'rgba(255,255,255,0.05)', padding: '24px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', marginBottom: '24px'}}>
                <h4 style={{fontSize: '18px', fontWeight: 600, color: '#f87171', marginBottom: '16px'}}>ðŸš¨ High-Alert Trigger Words</h4>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                  {triggers.high_alert_words && Array.isArray(triggers.high_alert_words) && triggers.high_alert_words.length > 0 ? (
                    triggers.high_alert_words.map((word, i) => (
                      <span key={i} style={{background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '6px 12px', borderRadius: '9999px', fontSize: '14px', fontWeight: 500, border: '1px solid rgba(239, 68, 68, 0.3)'}}>
                        {word}
                      </span>
                    ))
                  ) : (
                    <p style={{color: '#f87171', fontSize: '14px'}}>No high alert words found</p>
                  )}
                </div>
              </div>

              {/* Situation Triggers - ALWAYS RENDER */}
              <div style={{background: 'rgba(255,255,255,0.05)', padding: '24px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', marginBottom: '24px'}}>
                <h4 style={{fontSize: '18px', fontWeight: 600, color: '#fbbf24', marginBottom: '16px'}}><WarningIcon size={18} stroke="#fbbf24" className="inline-block mr-1" /> Situation Triggers</h4>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                  {triggers.situation_triggers && Array.isArray(triggers.situation_triggers) && triggers.situation_triggers.length > 0 ? (
                    triggers.situation_triggers.map((word, i) => (
                      <span key={i} style={{background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', padding: '6px 12px', borderRadius: '9999px', fontSize: '14px', fontWeight: 500, border: '1px solid rgba(245, 158, 11, 0.3)'}}>
                        {word}
                      </span>
                    ))
                  ) : (
                    <p style={{color: '#fbbf24', fontSize: '14px'}}>No situation triggers found</p>
                  )}
                </div>
              </div>

              {/* Resolution Triggers - ALWAYS RENDER */}
              <div style={{background: 'rgba(255,255,255,0.05)', padding: '24px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', marginBottom: '24px'}}>
                <h4 style={{fontSize: '18px', fontWeight: 600, color: '#60a5fa', marginBottom: '16px'}}>ðŸ’­ Resolution Triggers</h4>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                  {triggers.resolution_triggers && Array.isArray(triggers.resolution_triggers) && triggers.resolution_triggers.length > 0 ? (
                    triggers.resolution_triggers.map((word, i) => (
                      <span key={i} style={{background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', padding: '6px 12px', borderRadius: '9999px', fontSize: '14px', fontWeight: 500, border: '1px solid rgba(59, 130, 246, 0.3)'}}>
                        {word}
                      </span>
                    ))
                  ) : (
                    <p style={{color: '#60a5fa', fontSize: '14px'}}>No resolution triggers found</p>
                  )}
                </div>
              </div>

              {/* Pattern Recognition - Inline styles */}
              <div style={{background: 'linear-gradient(to bottom right, rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.1))', borderRadius: '12px', padding: '24px', border: '1px solid rgba(168, 85, 247, 0.2)', marginBottom: '24px', maxWidth: '100%', overflow: 'hidden'}}>
                <h4 style={{fontSize: '18px', fontWeight: 600, color: '#a78bfa', marginBottom: '16px', wordBreak: 'break-word'}}>ðŸ§  Question Pattern Recognition</h4>
                <div className="space-y-3" style={{maxWidth: '100%'}}>
                  {triggers.question_patterns && Array.isArray(triggers.question_patterns) && triggers.question_patterns.length > 0 ? (
                    triggers.question_patterns.map((pattern, idx) => (
                      <div key={idx} style={{display: 'flex', alignItems: 'flex-start', gap: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '16px', maxWidth: '100%', overflow: 'hidden'}}>
                        <div style={{color: '#a78bfa', fontFamily: 'monospace', fontSize: '14px', background: 'rgba(168, 85, 247, 0.2)', padding: '4px 8px', borderRadius: '4px'}}>{pattern.pattern}</div>
                        <div style={{wordBreak: 'break-word'}}>
                          <p style={{color: '#d1d5db', wordBreak: 'break-word'}}>{pattern.question}</p>
                          <p style={{color: '#a78bfa', fontSize: '14px', marginTop: '4px', wordBreak: 'break-word'}}>â†’ {pattern.look_for}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{color: '#a78bfa', fontSize: '14px'}}>No question patterns found</p>
                  )}
                </div>
              </div>

              {/* Pro Tip - NO dangerouslySetInnerHTML */}
              {triggers.pro_tip && (
                <div style={{background: 'rgba(0,0,0,0.4)', padding: '20px', borderLeft: '4px solid #f59e0b', borderRadius: '12px', marginBottom: '24px'}}>
                  <p style={{color: '#e5e7eb', lineHeight: '1.6'}}>
                    {String(triggers.pro_tip || '').replace(/<[^>]*>/g, '').replace(/className/g, 'class')}
                  </p>
                </div>
              )}
            </div>
          );
        }
        // Check if this is ECO enablers section (show checkmarks)
        const isEcoEnablers = section.key === 'eco_enablers';
        // Handle array content (old format)
        if (Array.isArray(content)) {
        return (
          <ul className="space-y-2">
            {content.map((item, idx) => (
              <li key={idx} className="text-slate-300 flex items-start gap-2">
                {isEcoEnablers ? (
                  <span className="text-emerald-400 mt-1 font-bold">“</span>
                ) : (
                  <span className="text-purple-400 mt-1">•</span>
                )}
                <span>{item}</span>
              </li>
            ))}
          </ul>
        );
        }
        // Fallback: If content is an object but not enhanced, try to render it
        if (typeof content === 'object' && content !== null && !Array.isArray(content)) {
          // For exam_triggers that might not have enhanced flag set correctly
          if (section.key === 'exam_triggers' && selectedTask === 'Manage Conflict') {
            // Try to render even if enhanced flag is missing
            const triggers = content;
            if (triggers.intro || triggers.high_alert_words || triggers.situation_triggers) {
              return (
                <div className="space-y-6 max-w-full overflow-hidden">
                  {/* Intro */}
                  {triggers.intro && (
                    <div style={{background: 'linear-gradient(to right, rgba(245, 158, 11, 0.1), rgba(249, 115, 22, 0.1))', padding: '20px', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '12px', marginBottom: '24px'}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px'}}>
                        <div style={{fontSize: '24px'}}>ðŸŽ¯</div>
                        <p style={{color: '#e5e7eb', fontSize: '18px', lineHeight: '1.6'}}>
                          {String(triggers.intro || '').replace(/<[^>]*>/g, '').replace(/className/g, 'class')}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Trigger Words Grid */}
                  {triggers.high_alert_words && triggers.high_alert_words.length > 0 && (
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10 max-w-full overflow-hidden">
                      <h4 className="text-lg font-semibold text-red-400 mb-4 break-words">ðŸš¨ High-Alert Trigger Words</h4>
                      <div className="flex flex-wrap gap-2 max-w-full">
                        {triggers.high_alert_words.map((word, i) => (
                          <span key={i} className="bg-red-500/20 text-red-400 px-3 py-1.5 rounded-full text-sm font-medium border border-red-500/30">
                            {word}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {triggers.situation_triggers && triggers.situation_triggers.length > 0 && (
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10 max-w-full overflow-hidden">
                      <h4 className="text-lg font-semibold text-amber-400 mb-4 break-words"><WarningIcon size={18} stroke="#fbbf24" className="inline-block mr-1" /> Situation Triggers</h4>
                      <div className="flex flex-wrap gap-2 max-w-full">
                        {triggers.situation_triggers.map((word, i) => (
                          <span key={i} className="bg-amber-500/20 text-amber-400 px-3 py-1.5 rounded-full text-sm font-medium border border-amber-500/30">
                            {word}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {triggers.resolution_triggers && triggers.resolution_triggers.length > 0 && (
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10 max-w-full overflow-hidden">
                      <h4 className="text-lg font-semibold text-blue-400 mb-4 break-words">ðŸ’­ Resolution Triggers</h4>
                      <div className="flex flex-wrap gap-2 max-w-full">
                        {triggers.resolution_triggers.map((word, i) => (
                          <span key={i} className="bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded-full text-sm font-medium border border-blue-500/30">
                            {word}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pattern Recognition */}
                  {triggers.question_patterns && Array.isArray(triggers.question_patterns) && triggers.question_patterns.length > 0 && (
                    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20 max-w-full overflow-hidden">
                      <h4 className="text-lg font-semibold text-purple-400 mb-4 break-words">ðŸ§  Question Pattern Recognition</h4>
                      <div className="space-y-3 max-w-full">
                        {triggers.question_patterns.map((pattern, idx) => (
                          <div key={idx} className="flex items-start gap-3 bg-black/20 rounded-lg p-4 max-w-full overflow-hidden">
                            <div className="text-purple-400 font-mono text-sm bg-purple-500/20 px-2 py-1 rounded">{pattern.pattern}</div>
                            <div className="break-words">
                              <p className="text-gray-300 break-words">{pattern.question}</p>
                              <p className="text-purple-400 text-sm mt-1 break-words">â†’ {pattern.look_for}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pro Tip */}
                  {triggers.pro_tip && (
                    <div className="bg-black/40 rounded-xl p-5 border-l-4 border-amber-500 max-w-full overflow-hidden">
                      <p className="text-gray-200 break-words overflow-hidden">{safeRenderText(triggers.pro_tip)}</p>
                    </div>
                  )}
                </div>
              );
            }
          }
          // Generic object fallback
          return <pre className="whitespace-pre-wrap text-xs bg-slate-900/50 p-2 rounded text-slate-300">{JSON.stringify(content, null, 2)}</pre>;
        }
        return null;
      
      case 'numbered-list':
        // Enhanced Key Takeaways for Manage Conflict
        if (selectedTask === 'Manage Conflict' && section.key === 'key_takeaways' && typeof content === 'object' && content !== null && content.enhanced === true) {
          const takeaways = content;
          return (
            <div className="space-y-6 max-w-full overflow-hidden">
              {/* The Big 5 */}
              {takeaways.big_5 && (
                <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-xl p-6 border border-emerald-500/20 max-w-full overflow-hidden">
                  <h4 className="text-xl font-bold text-white mb-6 text-center break-words">ðŸ† {takeaways.big_5.title}</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 max-w-full">
                    {takeaways.big_5.items && takeaways.big_5.items.map((item, idx) => {
                      const getItemColor = (color) => {
                        switch(color) {
                          case 'emerald': return 'text-emerald-400';
                          case 'blue': return 'text-blue-400';
                          case 'purple': return 'text-purple-400';
                          case 'amber': return 'text-amber-400';
                          case 'rose': return 'text-rose-400';
                          default: return 'text-emerald-400';
                        }
                      };
                      return (
                        <div key={idx} className="bg-black/30 rounded-xl p-4 text-center transform hover:scale-105 transition-transform max-w-full overflow-hidden">
                          <div className="text-4xl mb-3">{item.emoji}</div>
                          <div className={`${getItemColor(item.color)} font-bold break-words`}>{item.name}</div>
                          <p className="text-gray-400 text-xs mt-2 break-words overflow-hidden">{item.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Thomas-Kilmann Cheat Sheet */}
              {takeaways.thomas_kilmann_cheat_sheet && (
                <div className="bg-white/5 rounded-xl p-6 border border-white/10 max-w-full overflow-hidden">
                  <h4 className="text-lg font-semibold text-cyan-400 mb-4 break-words">ðŸ“‹ {takeaways.thomas_kilmann_cheat_sheet.title}</h4>
                  
                  <div className="overflow-x-auto max-w-full">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/20">
                          <th className="text-left p-3 text-gray-400">Approach</th>
                          <th className="text-left p-3 text-gray-400">When to Use</th>
                          <th className="text-left p-3 text-gray-400">Outcome</th>
                          <th className="text-center p-3 text-gray-400">PMI Preference</th>
                        </tr>
                      </thead>
                      <tbody>
                        {takeaways.thomas_kilmann_cheat_sheet.rows && takeaways.thomas_kilmann_cheat_sheet.rows.map((row, idx) => {
                          const getRowColor = (color) => {
                            switch(color) {
                              case 'emerald': return { bg: 'bg-emerald-500/5', text: 'text-emerald-400', stars: 'text-emerald-400' };
                              case 'amber': return { bg: '', text: 'text-amber-400', stars: 'text-amber-400' };
                              case 'blue': return { bg: '', text: 'text-blue-400', stars: 'text-blue-400' };
                              case 'red': return { bg: '', text: 'text-red-400', stars: 'text-red-400' };
                              case 'gray': return { bg: '', text: 'text-gray-400', stars: 'text-gray-400' };
                              default: return { bg: '', text: 'text-cyan-400', stars: 'text-cyan-400' };
                            }
                          };
                          const rowColors = getRowColor(row.color);
                          const stars = 'â­'.repeat(row.stars);
                          return (
                            <tr key={idx} className={`border-b border-white/10 ${rowColors.bg}`}>
                              <td className={`p-3 ${rowColors.text} font-semibold`}>{row.approach}</td>
                              <td className="p-3 text-gray-300 break-words">{row.when}</td>
                              <td className="p-3 text-gray-300 break-words">{row.outcome}</td>
                              <td className="p-3 text-center"><span className={`${rowColors.stars} text-lg`}>{stars}</span></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Exam Quick Reference */}
              {takeaways.exam_quick_reference && (
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-purple-400 mb-4">ðŸŽ¯ {takeaways.exam_quick_reference.title}</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {takeaways.exam_quick_reference.items && takeaways.exam_quick_reference.items.map((item, idx) => {
                      const getRefColor = (color) => {
                        switch(color) {
                          case 'emerald': return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' };
                          case 'blue': return { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400' };
                          case 'amber': return { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400' };
                          case 'red': return { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400' };
                          default: return { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-400' };
                        }
                      };
                      const refColors = getRefColor(item.color);
                      return (
                        <div key={idx} className={`${refColors.bg} rounded-lg p-4 border ${refColors.border}`}>
                          <div className={`${refColors.text} font-semibold mb-2`}>{item.condition}</div>
                          <p className="text-gray-300 text-sm break-words">{item.answer}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Final Memory Hook */}
              {takeaways.memory_hook && (
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30">
                  <h4 className="text-lg font-semibold text-white mb-4 text-center">ðŸ§  Memory Hook</h4>
                  <p className="text-2xl text-center text-gray-200 font-light break-words">{safeRenderText(takeaways.memory_hook)}</p>
                </div>
              )}

              {/* Bottom Line */}
              {takeaways.bottom_line && (
                <div className="bg-black/40 rounded-xl p-5 border-l-4 border-emerald-500">
                  <p className="text-gray-200 text-lg break-words">{safeRenderText(takeaways.bottom_line)}</p>
                </div>
              )}
            </div>
          );
        }
        // Default numbered list
        if (Array.isArray(content)) {
        return (
          <ol className="space-y-2 list-decimal list-inside">
            {content.map((item, idx) => (
              <li key={idx} className="text-slate-300">{item}</li>
            ))}
          </ol>
        );
        }
        return null;
      
      case 'scenarios':
        // Enhanced Quick Scenarios for Manage Conflict
        if (selectedTask === 'Manage Conflict' && section.key === 'quick_scenarios' && typeof content === 'object' && content !== null && content.enhanced === true) {
          const scenarios = content;
        return (
            <div className="space-y-6">
              {scenarios.intro && (
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-5 border border-purple-500/20">
                  <p className="text-gray-200 break-words">{safeRenderText(scenarios.intro)}</p>
                </div>
              )}

              {/* Scenario Cards */}
          <div className="space-y-4">
                {scenarios.scenarios && scenarios.scenarios.map((scenario, idx) => {
                  const gradientClass = scenario.gradient || 'from-blue-500/20 to-purple-500/20';
                  return (
                    <div key={idx} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                      <div className={`bg-gradient-to-r ${gradientClass} p-4 border-b border-white/10`}>
                        <div className="flex items-center gap-3">
                          <span className="bg-blue-500/30 text-blue-400 font-bold px-3 py-1 rounded-full text-sm">
                            {scenario.number}
                          </span>
                          <span className="text-white font-semibold break-words">{scenario.scenario}</span>
                        </div>
                      </div>
                      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-emerald-500/10 rounded-lg p-4 border border-emerald-500/20">
                          <div className="text-emerald-400 font-semibold mb-2 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            RIGHT
                          </div>
                          <p className="text-gray-300 text-sm break-words">{scenario.right_answer}</p>
                        </div>
                        <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
                          <div className="text-red-400 font-semibold mb-2 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            WRONG
                          </div>
                          <p className="text-gray-300 text-sm break-words">{scenario.wrong_answer}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Key Takeaway */}
              {scenarios.pattern_note && (
                <div className="bg-black/40 rounded-xl p-5 border-l-4 border-purple-500">
                  <p className="text-gray-200 break-words">{safeRenderText(scenarios.pattern_note)}</p>
                </div>
              )}
            </div>
          );
        }
        // Default scenarios rendering
        return (
          <div className="space-y-4">
            {Array.isArray(content) && content.map((scenario, idx) => {
              const isRight = scenario.right_wrong === 'Right';
              return (
                <div key={idx} className="border-l-2 border-cyan-500/50 pl-4">
                  <p className="text-white font-semibold mb-2">{scenario.scenario}</p>
                  {scenario.right_wrong ? (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{isRight ? '…' : 'âŒ'}</span>
                      <span className={`text-sm font-semibold ${isRight ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isRight ? 'Right' : 'Wrong'}
                      </span>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-red-400 mb-1"><span className="font-semibold">Wrong:</span> {scenario.wrong_answer}</p>
                      <p className="text-sm text-emerald-400 mb-1"><span className="font-semibold">Right:</span> {scenario.right_answer}</p>
                    </>
                  )}
                  <p className="text-sm text-slate-400 italic">{scenario.why}</p>
                </div>
              );
            })}
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
        // Empower Team structure
        if (content.delegation_in_practice) {
          return (
            <div className="space-y-6">
              <p className="text-gray-300 break-words">
                These five techniques help you implement empowerment systematically in real projects:
              </p>
              
              {/* Technique 1: Delegation Checklist */}
              {content.delegation_in_practice.technique_1_delegation_checklist && (
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-emerald-500/20 rounded-full w-8 h-8 flex items-center justify-center text-emerald-400 font-bold">1</div>
                    <h4 className="text-lg font-semibold text-emerald-400">The Delegation Checklist</h4>
                  </div>
                  <p className="text-gray-300 mb-4 break-words">
                    Before delegating any significant task, confirm these five elements:
                  </p>
                  <div className="bg-black/30 rounded-lg p-4 space-y-2">
                    {content.delegation_in_practice.technique_1_delegation_checklist.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-gray-300 break-words">
                        <div className="text-emerald-400">¡</div>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-amber-400/80 text-sm mt-4 italic">
                    If you can't check all five boxes, you're setting them up to fail.
                  </p>
                </div>
              )}
              
              {/* Technique 2: Completed Staff Work */}
              {content.delegation_in_practice.technique_2_completed_staff_work && (
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-500/20 rounded-full w-8 h-8 flex items-center justify-center text-blue-400 font-bold">2</div>
                    <h4 className="text-lg font-semibold text-blue-400">Completed Staff Work</h4>
                  </div>
                  {content.delegation_in_practice.technique_2_completed_staff_work.principle && (
                    <p className="text-gray-300 mb-4 break-words">
                      {content.delegation_in_practice.technique_2_completed_staff_work.principle} The four-level framework:
                    </p>
                  )}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 bg-red-500/10 rounded-lg p-3 border border-red-500/20">
                      <div className="text-red-400 font-mono text-sm">L1</div>
                      <div>
                        <span className="text-red-400 font-medium">Investigate</span>
                        <span className="text-gray-400"> ” "Here are the options I found"</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-orange-500/10 rounded-lg p-3 border border-orange-500/20">
                      <div className="text-orange-400 font-mono text-sm">L2</div>
                      <div>
                        <span className="text-orange-400 font-medium">Recommend</span>
                        <span className="text-gray-400"> ” "Here's what I recommend and why"</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
                      <div className="text-blue-400 font-mono text-sm">L3</div>
                      <div>
                        <span className="text-blue-400 font-medium">Decide & Inform</span>
                        <span className="text-gray-400"> ” "I decided X, here's why, FYI"</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/20">
                      <div className="text-emerald-400 font-mono text-sm">L4</div>
                      <div>
                        <span className="text-emerald-400 font-medium">Decide & Act</span>
                        <span className="text-gray-400"> ” "Done. Results attached."</span>
                      </div>
                    </div>
                  </div>
                  {content.delegation_in_practice.technique_2_completed_staff_work.before_dependency && (
                    <div className="mt-4 space-y-2">
                      <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
                        <p className="text-red-400 text-sm font-semibold mb-1">Before (Dependency):</p>
                        <p className="text-gray-300 text-sm italic break-words">{content.delegation_in_practice.technique_2_completed_staff_work.before_dependency}</p>
                      </div>
                      <div className="bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/20">
                        <p className="text-emerald-400 text-sm font-semibold mb-1">After (Empowerment):</p>
                        <p className="text-gray-300 text-sm italic break-words">{content.delegation_in_practice.technique_2_completed_staff_work.after_empowerment}</p>
                      </div>
                    </div>
                  )}
                  {content.delegation_in_practice.technique_2_completed_staff_work.builds && (
                    <p className="text-gray-400 text-sm mt-4">
                      Progress team members from L1 â†’ L4 as they demonstrate capability.
                    </p>
                  )}
                </div>
              )}
              
              {/* Technique 3: RACI Conversation */}
              {content.delegation_in_practice.technique_3_raci_conversation && (
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-purple-500/20 rounded-full w-8 h-8 flex items-center justify-center text-purple-400 font-bold">3</div>
                    <h4 className="text-lg font-semibold text-purple-400">The RACI Conversation</h4>
                  </div>
                  <p className="text-gray-300 mb-4">
                    For ambiguous situations, have an explicit conversation using these prompts:
                  </p>
                  <div className="bg-black/30 rounded-lg p-4 space-y-3">
                    <p className="text-gray-300">
                      <span className="text-purple-400 font-medium">"For this deliverable..."</span>
                    </p>
                    <ul className="text-gray-300 ml-4 space-y-2">
                      <li>• <span className="text-cyan-400">Who is doing the work?</span> (Responsible)</li>
                      <li>• <span className="text-cyan-400">Who owns the final outcome?</span> (Accountable)</li>
                      <li>• <span className="text-cyan-400">Who needs to give input before decisions?</span> (Consulted)</li>
                      <li>• <span className="text-cyan-400">Who needs to know what was decided?</span> (Informed)</li>
                    </ul>
                  </div>
                  {content.delegation_in_practice.technique_3_raci_conversation.example && (
                    <div className="mt-4 bg-slate-800/50 p-4 rounded italic text-slate-300">
                      <p className="text-sm">{content.delegation_in_practice.technique_3_raci_conversation.example}</p>
                    </div>
                  )}
                  <p className="text-gray-400 text-sm mt-4">
                    Make this conversation part of every delegation, especially cross-functional work.
                  </p>
                </div>
              )}
              
              {/* Technique 4: Progressive Delegation */}
              {content.delegation_in_practice.technique_4_progressive_delegation && (
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-amber-500/20 rounded-full w-8 h-8 flex items-center justify-center text-amber-400 font-bold">4</div>
                    <h4 className="text-lg font-semibold text-amber-400">Progressive Delegation</h4>
                  </div>
                  <p className="text-gray-300 mb-4">
                    Build capability systematically with this four-stage approach:
                  </p>
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500 to-emerald-500"></div>
                    <div className="space-y-4 ml-8">
                      {content.delegation_in_practice.technique_4_progressive_delegation.map((stage, idx) => {
                        const stageColors = [
                          { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', dot: 'bg-amber-500' },
                          { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400', dot: 'bg-orange-500' },
                          { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', dot: 'bg-blue-500' },
                          { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', dot: 'bg-emerald-500' }
                        ];
                        const colors = stageColors[idx % 4];
                        return (
                          <div key={idx} className="relative">
                            <div className={`absolute -left-6 w-3 h-3 ${colors.dot} rounded-full`}></div>
                            <div className={`${colors.bg} rounded-lg p-3 border ${colors.border}`}>
                              <span className={`${colors.text} font-semibold`}>Stage {idx + 1}: {stage.phase}</span>
                              <p className="text-gray-400 text-sm">{stage.authority_given}</p>
                              <p className="text-gray-500 text-xs mt-1">{stage.support_provided}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mt-4">
                    Progression speed depends on capability growth and stakes involved.
                  </p>
                </div>
              )}
              
              {/* Technique 5: Authority Matrix */}
              {content.delegation_in_practice.technique_5_authority_matrix && (
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-cyan-500/20 rounded-full w-8 h-8 flex items-center justify-center text-cyan-400 font-bold">5</div>
                    <h4 className="text-lg font-semibold text-cyan-400">The Authority Matrix</h4>
                  </div>
                  <p className="text-gray-300 mb-4">
                    Create explicit documentation of who can decide what. Example structure:
                  </p>
                  {content.delegation_in_practice.technique_5_authority_matrix.example && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-white/20">
                            <th className="text-left p-2 text-gray-400">Decision Type</th>
                            <th className="text-center p-2 text-gray-400">Team Lead</th>
                            <th className="text-center p-2 text-gray-400">Dev Lead</th>
                            <th className="text-center p-2 text-gray-400">PM</th>
                            <th className="text-center p-2 text-gray-400">Sponsor</th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-300">
                          {content.delegation_in_practice.technique_5_authority_matrix.example.map((row, idx) => (
                            <tr key={idx} className="border-b border-white/10">
                              <td className="p-2">{row.decision_category}</td>
                              <td className="text-center p-2">{row.team_decides ? <span className="text-emerald-400">“</span> : '”'}</td>
                              <td className="text-center p-2">{row.team_recommends_pm_approves ? <span className="text-emerald-400">“</span> : '”'}</td>
                              <td className="text-center p-2">{row.pm_decides ? <span className="text-emerald-400">“</span> : '”'}</td>
                              <td className="text-center p-2">”</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  <p className="text-gray-400 text-sm mt-4">
                    Post this visibly. Refer to it. Update it as the project evolves.
                  </p>
                </div>
              )}
            </div>
          );
        }
        
        // Support Performance structure
        if (content.addressing_underperformance) {
          return (
            <div className="space-y-6">
              <h4 className="executive-font text-xl font-bold text-white mb-4">Addressing Underperformance</h4>
              {content.addressing_underperformance.step_1_observe_and_document && (
                <div className="border-l-4 border-blue-500/50 bg-blue-500/5 p-4 rounded">
                  <h5 className="text-white font-semibold mb-2">Step 1: Observe and Document</h5>
                  <ul className="space-y-1 text-slate-300 text-sm ml-4">
                    {content.addressing_underperformance.step_1_observe_and_document.map((item, idx) => (
                      <li key={idx}>• {item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {content.addressing_underperformance.step_2_diagnose_root_cause && (
                <div className="border-l-4 border-purple-500/50 bg-purple-500/5 p-4 rounded">
                  <h5 className="text-white font-semibold mb-2">Step 2: Diagnose Root Cause</h5>
                  <ul className="space-y-1 text-slate-300 text-sm ml-4">
                    {content.addressing_underperformance.step_2_diagnose_root_cause.map((item, idx) => (
                      <li key={idx}>• {item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {content.addressing_underperformance.step_3_have_the_conversation && (
                <div className="border-l-4 border-cyan-500/50 bg-cyan-500/5 p-4 rounded">
                  <h5 className="text-white font-semibold mb-2">Step 3: Have the Conversation</h5>
                  <ol className="space-y-2 text-slate-300 text-sm ml-4">
                    {content.addressing_underperformance.step_3_have_the_conversation.map((item, idx) => (
                      <li key={idx}>{idx + 1}. {item}</li>
                    ))}
                  </ol>
                </div>
              )}
              {content.addressing_underperformance.step_4_create_improvement_plan && (
                <div className="border-l-4 border-emerald-500/50 bg-emerald-500/5 p-4 rounded">
                  <h5 className="text-white font-semibold mb-2">Step 4: Create Improvement Plan</h5>
                  <ul className="space-y-1 text-slate-300 text-sm ml-4">
                    {content.addressing_underperformance.step_4_create_improvement_plan.map((item, idx) => (
                      <li key={idx}>• {item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {content.addressing_underperformance.step_5_follow_up && (
                <div className="border-l-4 border-yellow-500/50 bg-yellow-500/5 p-4 rounded">
                  <h5 className="text-white font-semibold mb-2">Step 5: Follow Up</h5>
                  <ul className="space-y-1 text-slate-300 text-sm ml-4">
                    {content.addressing_underperformance.step_5_follow_up.map((item, idx) => (
                      <li key={idx}>• {item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {content.addressing_underperformance.step_6_escalate_if_necessary && (
                <div className="border-l-4 border-red-500/50 bg-red-500/5 p-4 rounded">
                  <h5 className="text-white font-semibold mb-2">Step 6: Escalate if Necessary</h5>
                  <ul className="space-y-1 text-slate-300 text-sm ml-4">
                    {content.addressing_underperformance.step_6_escalate_if_necessary.map((item, idx) => (
                      <li key={idx}>• {item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {content.underperformance_conversation_script && (
                <div className="mt-4 space-y-4">
                  <div className="border-l-4 border-emerald-500/50 bg-emerald-500/5 p-4 rounded">
                    <h5 className="text-white font-semibold mb-2">What to Say:</h5>
                    <div className="bg-slate-800/50 p-4 rounded italic text-slate-300 leading-relaxed whitespace-pre-line">
                      {content.underperformance_conversation_script.what_to_say}
                    </div>
                  </div>
                  <div className="border-l-4 border-red-500/50 bg-red-500/5 p-4 rounded">
                    <h5 className="text-white font-semibold mb-2">What NOT to Say:</h5>
                    <div className="bg-slate-800/50 p-4 rounded italic text-red-300 leading-relaxed">
                      {content.underperformance_conversation_script.what_not_to_say}
                    </div>
                  </div>
                </div>
              )}
              {content.coaching_vs_corrective_spectrum && (
                <div className="mt-4">
                  <h5 className="text-white font-semibold mb-3">Coaching vs. Corrective Action Spectrum</h5>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-slate-600">
                          <th className="text-left p-3 text-white font-semibold">Approach</th>
                          <th className="text-left p-3 text-white font-semibold">When to Use</th>
                          <th className="text-left p-3 text-white font-semibold">Tone</th>
                          <th className="text-left p-3 text-white font-semibold">Focus</th>
                        </tr>
                      </thead>
                      <tbody>
                        {content.coaching_vs_corrective_spectrum.map((item, idx) => (
                          <tr key={idx} className="border-b border-slate-700/50">
                            <td className="p-3 text-orange-400 font-semibold">{item.approach}</td>
                            <td className="p-3 text-slate-300">{item.when_to_use}</td>
                            <td className="p-3 text-slate-300">{item.tone}</td>
                            <td className="p-3 text-slate-300">{item.focus}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        }
        // Fallback for other structures
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
        // Enhanced Common Mistakes for Manage Conflict
        if (selectedTask === 'Manage Conflict' && typeof content === 'object' && content !== null && content.enhanced === true) {
          const mistakes = content;
          return (
            <div className="space-y-6 max-w-full overflow-hidden">
              {mistakes.intro && (
                <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-xl p-5 border border-red-500/20 max-w-full overflow-hidden">
                  <p className="text-gray-200 break-words overflow-hidden">{safeRenderText(mistakes.intro)}</p>
                </div>
              )}

              {/* Mistake Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-full">
                {mistakes.mistakes && mistakes.mistakes.map((mistake, idx) => (
                  <div key={idx} className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-red-500/30 transition-colors max-w-full overflow-hidden">
                    <div className="flex items-center gap-3 mb-3 max-w-full">
                      <div className="bg-red-500/20 rounded-full p-2 flex-shrink-0">
                        <span className="text-xl">{mistake.emoji}</span>
                      </div>
                      <h4 className="text-red-400 font-semibold break-words min-w-0 flex-1">{mistake.name}</h4>
                    </div>
                    <p className="text-gray-300 text-sm mb-3 break-words overflow-hidden">{mistake.description}</p>
                    <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/20 max-w-full overflow-hidden">
                      <p className="text-red-400 text-xs font-semibold mb-1 break-words">WHY IT FAILS:</p>
                      <p className="text-gray-400 text-xs break-words overflow-hidden">{mistake.why_fails}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* What PMI Prefers */}
              {mistakes.pmi_preferences && (
                <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-xl p-6 border border-emerald-500/20 max-w-full overflow-hidden">
                  <h4 className="text-lg font-semibold text-emerald-400 mb-4 break-words">… {mistakes.pmi_preferences.title}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-full">
                    {mistakes.pmi_preferences.preferences && mistakes.pmi_preferences.preferences.map((pref, idx) => (
                      <div key={idx} className="text-center">
                        <div className="text-3xl mb-2">{pref.emoji}</div>
                        <div className="text-white font-semibold">{pref.name}</div>
                        <p className="text-gray-400 text-sm mt-1 break-words">{pref.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Exam Trap Alert */}
              {mistakes.exam_trap && (
                <div className="bg-black/40 rounded-xl p-5 border-l-4 border-amber-500 max-w-full overflow-hidden">
                  <p className="text-gray-200 break-words overflow-hidden">{safeRenderText(mistakes.exam_trap)}</p>
                </div>
              )}
            </div>
          );
        }
        // Support Performance uses object structure with wrong_answer_patterns
        if (content.wrong_answer_patterns) {
          return (
            <div className="space-y-4">
              {content.wrong_answer_patterns && content.wrong_answer_patterns.length > 0 && (
                <div>
                  <h4 className="executive-font text-lg font-semibold text-white mb-3">Wrong Answer Patterns on Exam</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-slate-600">
                          <th className="text-left p-3 text-white font-semibold">Trap</th>
                          <th className="text-left p-3 text-white font-semibold">Why It's Wrong</th>
                          <th className="text-left p-3 text-white font-semibold">Better Approach</th>
                        </tr>
                      </thead>
                      <tbody>
                        {content.wrong_answer_patterns.map((mistake, idx) => (
                          <tr key={idx} className="border-b border-slate-700/50">
                            <td className="p-3 text-red-400 font-semibold">{mistake.trap}</td>
                            <td className="p-3 text-slate-300">{mistake.why_wrong}</td>
                            <td className="p-3 text-emerald-400">{mistake.better_approach}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {content.feedback_sandwich_trap && (
                <div className="border-l-4 border-yellow-500/50 bg-yellow-500/5 p-4 rounded mt-4">
                  <h4 className="executive-font text-lg font-semibold text-white mb-2">The "Feedback Sandwich" Trap</h4>
                  <p className="text-slate-300">{content.feedback_sandwich_trap}</p>
                </div>
              )}
            </div>
          );
        }
        // Fallback for array format
        return (
          <div className="space-y-3">
            {Array.isArray(content) && content.map((mistake, idx) => (
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
        // Enhanced Key Frameworks for Manage Conflict
        if (selectedTask === 'Manage Conflict' && typeof content === 'object' && content !== null && content.enhanced === true) {
          const frameworks = content;
          return (
            <div className="space-y-6 max-w-full overflow-hidden">
              {/* Thomas-Kilmann Model */}
              {frameworks.thomas_kilmann && (
                <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/20 max-w-full overflow-hidden">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-2xl">â­</div>
                    <h4 className="text-xl font-bold text-blue-400">{frameworks.thomas_kilmann.title}</h4>
                    <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">PRIMARY FRAMEWORK</span>
                  </div>
                  <p className="text-gray-300 mb-6 break-words overflow-hidden">{frameworks.thomas_kilmann.subtitle}</p>
                  
                  {/* 5 Approaches Visual */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    {frameworks.thomas_kilmann.approaches && frameworks.thomas_kilmann.approaches.map((approach, idx) => {
                      const getColorClasses = (color) => {
                        switch(color) {
                          case 'emerald': return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', hover: 'hover:border-emerald-500/50', text: 'text-emerald-400', badge: 'bg-emerald-500/20' };
                          case 'amber': return { bg: 'bg-amber-500/10', border: 'border-amber-500/30', hover: 'hover:border-amber-500/50', text: 'text-amber-400', badge: 'bg-amber-500/20' };
                          case 'blue': return { bg: 'bg-blue-500/10', border: 'border-blue-500/30', hover: 'hover:border-blue-500/50', text: 'text-blue-400', badge: 'bg-blue-500/20' };
                          case 'red': return { bg: 'bg-red-500/10', border: 'border-red-500/30', hover: 'hover:border-red-500/50', text: 'text-red-400', badge: 'bg-red-500/20' };
                          case 'gray': return { bg: 'bg-gray-500/10', border: 'border-gray-500/30', hover: 'hover:border-gray-500/50', text: 'text-gray-400', badge: 'bg-gray-500/20' };
                          default: return { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', hover: 'hover:border-cyan-500/50', text: 'text-cyan-400', badge: 'bg-cyan-500/20' };
                        }
                      };
                      const colors = getColorClasses(approach.color);
                      return (
                        <div key={idx} className={`${colors.bg} rounded-xl p-4 border ${colors.border} ${colors.hover} transition-all hover:scale-105`}>
                          <div className="text-center">
                            <div className="text-3xl mb-2">{approach.emoji}</div>
                            <div className={`${colors.text} font-bold text-lg`}>{approach.name}</div>
                            <div className={`${colors.text}/60 text-xs uppercase tracking-wide mt-1`}>{approach.subtitle}</div>
                          </div>
                          <div className={`mt-3 pt-3 border-t ${colors.border}`}>
                            <p className="text-gray-400 text-xs text-center break-words">{approach.assertiveness}</p>
                          </div>
                          <div className={`mt-2 ${colors.badge} rounded-lg p-2`}>
                            <p className={`${colors.text} text-xs text-center font-semibold`}>{approach.badge}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* When to Use Each */}
                  <div className="mt-6 bg-black/30 rounded-lg p-4">
                    <h5 className="text-white font-semibold mb-3">When to Use Each Approach:</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      {frameworks.thomas_kilmann.approaches && frameworks.thomas_kilmann.approaches.map((approach, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className={approach.color === 'emerald' ? 'text-emerald-400' : approach.color === 'amber' ? 'text-amber-400' : approach.color === 'blue' ? 'text-blue-400' : approach.color === 'red' ? 'text-red-400' : 'text-gray-400'}>
                            {approach.emoji}
                          </span>
                          <span className="text-gray-300 break-words">
                            <strong className={approach.color === 'emerald' ? 'text-emerald-400' : approach.color === 'amber' ? 'text-amber-400' : approach.color === 'blue' ? 'text-blue-400' : approach.color === 'red' ? 'text-red-400' : 'text-gray-400'}>
                              {approach.name}:
                            </strong> {approach.when_to_use}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Conflict Escalation Ladder */}
              {frameworks.escalation_ladder && (
                <div className="bg-white/5 rounded-xl p-6 border border-white/10 max-w-full overflow-hidden">
                  <h4 className="text-lg font-semibold text-orange-400 mb-4 break-words">ðŸ“ˆ {frameworks.escalation_ladder.title}</h4>
                  <p className="text-gray-300 mb-4 break-words overflow-hidden">{frameworks.escalation_ladder.description}</p>
                  
                  <div className="relative max-w-full overflow-hidden">
                    <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500 via-amber-500 to-red-500 rounded-full"></div>
                    
                    <div className="space-y-4 ml-12">
                      {frameworks.escalation_ladder.levels && frameworks.escalation_ladder.levels.map((level, idx) => {
                        const getLevelColor = (color) => {
                          switch(color) {
                            case 'emerald': return { bg: 'bg-emerald-500', card: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' };
                            case 'lime': return { bg: 'bg-lime-500', card: 'bg-lime-500/10', border: 'border-lime-500/20', text: 'text-lime-400' };
                            case 'amber': return { bg: 'bg-amber-500', card: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400' };
                            case 'orange': return { bg: 'bg-orange-500', card: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400' };
                            case 'red': return { bg: 'bg-red-500', card: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400' };
                            default: return { bg: 'bg-gray-500', card: 'bg-gray-500/10', border: 'border-gray-500/20', text: 'text-gray-400' };
                          }
                        };
                        const levelColors = getLevelColor(level.color);
                        return (
                          <div key={idx} className="relative">
                            <div className={`absolute -left-8 w-4 h-4 ${levelColors.bg} rounded-full border-2 border-black`}></div>
                            <div className={`${levelColors.card} rounded-lg p-3 border ${levelColors.border}`}>
                              <div className="flex items-center justify-between">
                                <span className={`${levelColors.text} font-semibold`}>Level {level.level}: {level.name}</span>
                                {level.badge && <span className={`${levelColors.text}/60 text-xs`}>{level.badge}</span>}
                              </div>
                              <p className="text-gray-400 text-sm mt-1 break-words">{level.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Sources of Conflict */}
              {frameworks.sources_of_conflict && (
                <div className="bg-white/5 rounded-xl p-6 border border-white/10 max-w-full overflow-hidden">
                  <h4 className="text-lg font-semibold text-cyan-400 mb-4 break-words">ðŸ” {frameworks.sources_of_conflict.title}</h4>
                  <p className="text-gray-400 text-sm mb-4 break-words overflow-hidden">{frameworks.sources_of_conflict.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-full">
                    {frameworks.sources_of_conflict.sources && frameworks.sources_of_conflict.sources.map((source, idx) => (
                      <div key={idx} className="bg-cyan-500/10 rounded-lg p-3 border border-cyan-500/20 text-center">
                        <div className="text-2xl mb-1">{source.emoji}</div>
                        <div className="text-cyan-400 font-semibold text-sm">{source.name}</div>
                        <div className="text-gray-500 text-xs mt-1">{source.rank}</div>
                      </div>
                    ))}
                    {frameworks.sources_of_conflict.exam_tip && (
                      <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20 text-center">
                        <div className="text-2xl mb-1">{frameworks.sources_of_conflict.exam_tip.emoji}</div>
                        <div className="text-purple-400 font-semibold text-sm">{frameworks.sources_of_conflict.exam_tip.name}</div>
                        <div className="text-gray-500 text-xs mt-1">{frameworks.sources_of_conflict.exam_tip.description}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Memory Aid */}
              {frameworks.memory_aid && (
                <div className="bg-black/40 rounded-xl p-5 border-l-4 border-blue-500 max-w-full overflow-hidden">
                  <p className="text-gray-200 break-words overflow-hidden">{safeRenderText(frameworks.memory_aid)}</p>
                </div>
              )}
            </div>
          );
        }
        // Empower Team structure
        if (content.empowerment_triangle || content.delegation_levels || content.raci_matrix) {
          return (
            <div className="space-y-6">
              <p className="text-gray-300">
                Three frameworks help you think about empowerment systematically:
              </p>
              
              {/* Empowerment Triangle */}
              {content.empowerment_triangle && (
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-emerald-400 mb-4">{content.empowerment_triangle.title}</h4>
                  <p className="text-gray-300 mb-4">
                    All three elements must be present. Missing any one creates dysfunction:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-emerald-500/10 rounded-lg p-4 border border-emerald-500/30">
                      <div className="text-emerald-400 font-semibold mb-2">Authority</div>
                      <p className="text-gray-400 text-sm">{content.empowerment_triangle.elements?.authority?.definition || 'The power to make decisions and take action within defined boundaries'}</p>
                      <p className="text-gray-500 text-xs mt-2 italic">Without authority: Responsibility without power = frustration</p>
                    </div>
                    <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
                      <div className="text-blue-400 font-semibold mb-2">Accountability</div>
                      <p className="text-gray-400 text-sm">{content.empowerment_triangle.elements?.accountability?.definition || 'Ownership of outcomes”both credit for success and responsibility for problems'}</p>
                      <p className="text-gray-500 text-xs mt-2 italic">Without accountability: Authority without ownership = carelessness</p>
                    </div>
                    <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30">
                      <div className="text-purple-400 font-semibold mb-2">Autonomy</div>
                      <p className="text-gray-400 text-sm">{content.empowerment_triangle.elements?.autonomy?.definition || 'Freedom to choose HOW to accomplish goals within constraints'}</p>
                      <p className="text-gray-500 text-xs mt-2 italic">Without autonomy: Authority to decide but not to act = paralysis</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Delegation Levels */}
              {content.delegation_levels && (
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-amber-400 mb-4">{content.delegation_levels.title}</h4>
                  <p className="text-gray-300 mb-4">
                    Match your delegation level to the person's capability and the decision's stakes:
                  </p>
                  <div className="space-y-3">
                    {content.delegation_levels.levels && content.delegation_levels.levels.map((level, idx) => {
                      const levelColors = [
                        { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', badge: 'bg-red-500/20' },
                        { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400', badge: 'bg-orange-500/20' },
                        { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', badge: 'bg-blue-500/20' },
                        { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', badge: 'bg-emerald-500/20' }
                      ];
                      const colors = levelColors[idx % 4];
                      return (
                        <div key={idx} className={`flex items-center gap-4 ${colors.bg} rounded-lg p-3 ${colors.border} border`}>
                          <div className={`${colors.badge} rounded-full px-3 py-1 ${colors.text} text-sm font-mono`}>L{idx + 1}</div>
                          <div>
                            <span className={`${colors.text} font-semibold`}>{level.level}</span>
                            <span className="text-gray-400 ml-2">” {level.pm_role}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {/* RACI Matrix */}
              {content.raci_matrix && (
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-cyan-400 mb-4">{content.raci_matrix.title}</h4>
                  <p className="text-gray-300 mb-4">
                    Use RACI to make authority explicit and prevent confusion:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-cyan-500/10 rounded-lg p-3 border border-cyan-500/20 text-center">
                      <div className="text-cyan-400 text-2xl font-bold">R</div>
                      <div className="text-gray-300 text-sm">Responsible</div>
                      <div className="text-gray-500 text-xs">{content.raci_matrix.roles?.responsible?.definition || 'Does the work'}</div>
                    </div>
                    <div className="bg-cyan-500/10 rounded-lg p-3 border border-cyan-500/20 text-center">
                      <div className="text-cyan-400 text-2xl font-bold">A</div>
                      <div className="text-gray-300 text-sm">Accountable</div>
                      <div className="text-gray-500 text-xs">{content.raci_matrix.roles?.accountable?.definition || 'Owns the outcome'}</div>
                    </div>
                    <div className="bg-cyan-500/10 rounded-lg p-3 border border-cyan-500/20 text-center">
                      <div className="text-cyan-400 text-2xl font-bold">C</div>
                      <div className="text-gray-300 text-sm">Consulted</div>
                      <div className="text-gray-500 text-xs">{content.raci_matrix.roles?.consulted?.definition || 'Provides input'}</div>
                    </div>
                    <div className="bg-cyan-500/10 rounded-lg p-3 border border-cyan-500/20 text-center">
                      <div className="text-cyan-400 text-2xl font-bold">I</div>
                      <div className="text-gray-300 text-sm">Informed</div>
                      <div className="text-gray-500 text-xs">{content.raci_matrix.roles?.informed?.definition || 'Kept in the loop'}</div>
                    </div>
                  </div>
                  <p className="text-amber-400/80 text-sm mt-4 italic">
                    ðŸ’¡ Key Rule: Only ONE person can be Accountable for any deliverable
                  </p>
                </div>
              )}
            </div>
          );
        }
        
        // Fallback to Support Performance structure
        return (
          <div className="space-y-6">
            {content.sbi_model && (
              <div className="border-l-4 border-blue-500/50 bg-blue-500/5 p-4 rounded">
                <h4 className="executive-font text-lg font-semibold text-white mb-3">ðŸ“Š {content.sbi_model.title}</h4>
                {content.sbi_model.table ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-slate-600">
                          <th className="text-left p-3 text-white font-semibold">Component</th>
                          <th className="text-left p-3 text-white font-semibold">Question</th>
                          <th className="text-left p-3 text-white font-semibold">Example</th>
                        </tr>
                      </thead>
                      <tbody>
                        {content.sbi_model.table.map((row, idx) => (
                          <tr key={idx} className="border-b border-slate-700/50">
                            <td className="p-3 text-orange-400 font-semibold"><strong>{row.component}</strong></td>
                            <td className="p-3 text-slate-300">{row.question}</td>
                            <td className="p-3 text-slate-400 italic">{row.example}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="space-y-2 text-sm">
                    <p className="text-slate-300"><span className="font-semibold text-blue-400">S</span> = {content.sbi_model.s}</p>
                    <p className="text-slate-300"><span className="font-semibold text-blue-400">B</span> = {content.sbi_model.b}</p>
                    <p className="text-slate-300"><span className="font-semibold text-blue-400">I</span> = {content.sbi_model.i}</p>
                  </div>
                )}
              </div>
            )}
            {content.performance_equation && (
              <div className="border-l-4 border-cyan-500/50 bg-cyan-500/5 p-4 rounded">
                <h4 className="executive-font text-lg font-semibold text-white mb-3">ðŸ“ˆ {content.performance_equation.title}</h4>
                <p className="text-slate-300 text-xl font-mono text-center mb-4 font-bold">{content.performance_equation.formula}</p>
                {content.performance_equation.table && (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-slate-600">
                          <th className="text-left p-3 text-white font-semibold">Factor</th>
                          <th className="text-left p-3 text-white font-semibold">Symptoms</th>
                          <th className="text-left p-3 text-white font-semibold">Intervention</th>
                        </tr>
                      </thead>
                      <tbody>
                        {content.performance_equation.table.map((row, idx) => (
                          <tr key={idx} className="border-b border-slate-700/50">
                            <td className="p-3 text-orange-400 font-semibold">{row.factor}</td>
                            <td className="p-3 text-slate-300">{row.symptoms}</td>
                            <td className="p-3 text-emerald-400">{row.intervention}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
            {content.recognition_types && (
              <div className="border-l-4 border-purple-500/50 bg-purple-500/5 p-4 rounded">
                <h4 className="executive-font text-lg font-semibold text-white mb-3">â­ {content.recognition_types.title}</h4>
                {content.recognition_types.table ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-slate-600">
                          <th className="text-left p-3 text-white font-semibold">Dimension</th>
                          <th className="text-left p-3 text-white font-semibold">Options</th>
                        </tr>
                      </thead>
                      <tbody>
                        {content.recognition_types.table.map((row, idx) => (
                          <tr key={idx} className="border-b border-slate-700/50">
                            <td className="p-3 text-orange-400 font-semibold"><strong>{row.dimension}</strong></td>
                            <td className="p-3 text-slate-300">{row.options}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
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
                )}
              </div>
            )}
            {content.performance_continuum && (
              <div className="border-l-4 border-emerald-500/50 bg-emerald-500/5 p-4 rounded">
                <h4 className="executive-font text-lg font-semibold text-white mb-3">ðŸ“ˆ {content.performance_continuum.title}</h4>
                <p className="text-slate-300 text-lg font-mono text-center">{content.performance_continuum.stages}</p>
              </div>
            )}
          </div>
        );
      
      case 'performance-framework':
        return (
          <div className="space-y-4">
            {content.measure_performance && (
              <div className="border-l-4 border-blue-500/50 bg-blue-500/5 p-4 rounded">
                <h4 className="executive-font text-lg font-semibold text-white mb-2">ðŸ“Š 1. Measure Performance</h4>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">When:</span> {content.measure_performance.when}</p>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">Action:</span> {content.measure_performance.action}</p>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">Metrics:</span> {content.measure_performance.metrics}</p>
                <p className="text-sm text-emerald-400 italic"><span className="font-semibold">Key:</span> {content.measure_performance.key}</p>
              </div>
            )}
            {content.provide_feedback && (
              <div className="border-l-4 border-purple-500/50 bg-purple-500/5 p-4 rounded">
                <h4 className="executive-font text-lg font-semibold text-white mb-2">ðŸ“ˆ 2. Provide Feedback</h4>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">When:</span> {content.provide_feedback.when}</p>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">Action:</span> {content.provide_feedback.action}</p>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">Approach:</span> {content.provide_feedback.approach}</p>
                <p className="text-sm text-emerald-400 italic"><span className="font-semibold">Key:</span> {content.provide_feedback.key}</p>
              </div>
            )}
            {content.coach_and_develop && (
              <div className="border-l-4 border-cyan-500/50 bg-cyan-500/5 p-4 rounded">
                <h4 className="executive-font text-lg font-semibold text-white mb-2">ðŸŽ¯ 3. Coach and Develop</h4>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">When:</span> {content.coach_and_develop.when}</p>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">Action:</span> {content.coach_and_develop.action}</p>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">Focus:</span> {content.coach_and_develop.focus}</p>
                <p className="text-sm text-emerald-400 italic"><span className="font-semibold">Key:</span> {content.coach_and_develop.key}</p>
              </div>
            )}
            {content.recognize_and_reward && (
              <div className="border-l-4 border-amber-500/50 bg-amber-500/5 p-4 rounded">
                <h4 className="executive-font text-lg font-semibold text-white mb-2">ðŸŒŸ 4. Recognize and Reward</h4>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">When:</span> {content.recognize_and_reward.when}</p>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">Action:</span> {content.recognize_and_reward.action}</p>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">Types:</span> {content.recognize_and_reward.types}</p>
                <p className="text-sm text-emerald-400 italic"><span className="font-semibold">Key:</span> {content.recognize_and_reward.key}</p>
              </div>
            )}
            {content.address_underperformance && (
              <div className="border-l-4 border-red-500/50 bg-red-500/5 p-4 rounded">
                <h4 className="executive-font text-lg font-semibold text-white mb-2"><WarningIcon size={18} stroke="#f87171" className="inline-block mr-1" /> 5. Address Underperformance</h4>
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
                <h4 className="executive-font text-lg font-semibold text-emerald-400 mb-3">… Good SBI Example:</h4>
                <div className="space-y-2 text-sm">
                  <p className="text-slate-300"><span className="font-semibold text-blue-400">S:</span> "{content.good_example.s}"</p>
                  <p className="text-slate-300"><span className="font-semibold text-blue-400">B:</span> "{content.good_example.b}"</p>
                  <p className="text-slate-300"><span className="font-semibold text-blue-400">I:</span> "{content.good_example.i}"</p>
                </div>
              </div>
            )}
            {content.bad_example && (
              <div className="border-l-4 border-red-500/50 bg-red-500/5 p-4 rounded">
                <h4 className="executive-font text-lg font-semibold text-red-400 mb-3">âŒ Bad Feedback (No SBI):</h4>
                <p className="text-slate-300 mb-2">"{content.bad_example.text}"</p>
                <p className="text-sm text-red-400 italic">Problem: {content.bad_example.problem}</p>
              </div>
            )}
            {content.good_positive && (
              <div className="border-l-4 border-cyan-500/50 bg-cyan-500/5 p-4 rounded">
                <h4 className="executive-font text-lg font-semibold text-cyan-400 mb-3">… Good Positive SBI:</h4>
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
                <h4 className="executive-font text-base font-semibold text-white mb-2">â­ 1. Make It Timely</h4>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">When:</span> {content.make_timely.when}</p>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">Why:</span> {content.make_timely.why}</p>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">How:</span> {content.make_timely.how}</p>
                <p className="text-sm text-red-400 italic"><span className="font-semibold">Avoid:</span> {content.make_timely.avoid}</p>
              </div>
            )}
            {content.be_specific && (
              <div className="border-l-2 border-amber-500/50 pl-4">
                <h4 className="executive-font text-base font-semibold text-white mb-2">ðŸŽ¯ 2. Be Specific</h4>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">When:</span> {content.be_specific.when}</p>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">Why:</span> {content.be_specific.why}</p>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">How:</span> {content.be_specific.how}</p>
                <p className="text-sm text-red-400 italic"><span className="font-semibold">Avoid:</span> {content.be_specific.avoid}</p>
              </div>
            )}
            {content.match_preference && (
              <div className="border-l-2 border-amber-500/50 pl-4">
                <h4 className="executive-font text-base font-semibold text-white mb-2">ðŸ‘¥ 3. Match Preference</h4>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">When:</span> {content.match_preference.when}</p>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">Why:</span> {content.match_preference.why}</p>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">How:</span> {content.match_preference.how}</p>
                <p className="text-sm text-red-400 italic"><span className="font-semibold">Avoid:</span> {content.match_preference.avoid}</p>
              </div>
            )}
            {content.recognize_effort && (
              <div className="border-l-2 border-amber-500/50 pl-4">
                <h4 className="executive-font text-base font-semibold text-white mb-2">ðŸ† 4. Recognize Effort, Not Just Results</h4>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">When:</span> {content.recognize_effort.when}</p>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">Why:</span> {content.recognize_effort.why}</p>
                <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">How:</span> {content.recognize_effort.how}</p>
                <p className="text-sm text-red-400 italic"><span className="font-semibold">Avoid:</span> {content.recognize_effort.avoid}</p>
              </div>
            )}
            {content.use_multiple_forms && (
              <div className="border-l-2 border-amber-500/50 pl-4">
                <h4 className="executive-font text-base font-semibold text-white mb-2">ðŸŽ 5. Use Multiple Forms</h4>
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
                      {optIdx === parseInt(q.correct) && <span className="ml-2 text-emerald-400">“ Correct</span>}
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
        // Enhanced Exam Strategy for Manage Conflict
        if (selectedTask === 'Manage Conflict' && typeof content === 'object' && content !== null && content.enhanced === true) {
          const strategy = content;
          return (
            <div className="space-y-6 max-w-full overflow-hidden">
              {/* The Conflict Question Decision Tree */}
              {strategy.decision_tree && (
                <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-xl p-6 border border-emerald-500/20 max-w-full overflow-hidden">
                  <h4 className="text-xl font-bold text-white mb-6 text-center break-words">ðŸŒ³ {strategy.decision_tree.title}</h4>
                  
                  <div className="space-y-4 max-w-full">
                    {strategy.decision_tree.steps && strategy.decision_tree.steps.map((step, idx) => {
                      const getStepColor = (color) => {
                        switch(color) {
                          case 'amber': return { bg: 'bg-amber-500/30', text: 'text-amber-400' };
                          case 'blue': return { bg: 'bg-blue-500/30', text: 'text-blue-400' };
                          case 'purple': return { bg: 'bg-purple-500/30', text: 'text-purple-400' };
                          case 'cyan': return { bg: 'bg-cyan-500/30', text: 'text-cyan-400' };
                          default: return { bg: 'bg-amber-500/30', text: 'text-amber-400' };
                        }
                      };
                      const stepColors = getStepColor(step.color);
                      const getAnswerColor = (color) => {
                        switch(color) {
                          case 'red': return { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400' };
                          case 'orange': return { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400' };
                          case 'emerald': return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' };
                          case 'amber': return { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400' };
                          default: return { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-400' };
                        }
                      };
                      return (
                        <div key={idx} className="bg-black/30 rounded-xl p-4 max-w-full overflow-hidden">
                          <div className="flex items-center gap-3 mb-3 max-w-full">
                            <div className={`${stepColors.bg} rounded-full w-8 h-8 flex items-center justify-center ${stepColors.text} font-bold flex-shrink-0`}>
                              {step.number}
                            </div>
                            <span className={`${stepColors.text} font-semibold break-words min-w-0 flex-1`}>{step.question}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 ml-11 max-w-full">
                            {step.yes && (
                              <div className={`${getAnswerColor(step.yes.color).bg} rounded-lg p-3 border ${getAnswerColor(step.yes.color).border}`}>
                                <span className={`${getAnswerColor(step.yes.color).text} font-semibold`}>YES â†’</span>
                                <span className="text-gray-300 text-sm break-words"> {step.yes.text}</span>
                              </div>
                            )}
                            {step.no && (
                              <div className={`${getAnswerColor(step.no.color).bg} rounded-lg p-3 border ${getAnswerColor(step.no.color).border}`}>
                                <span className={`${getAnswerColor(step.no.color).text} font-semibold`}>NO â†’</span>
                                <span className="text-gray-300 text-sm break-words"> {step.no.text}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quick Reference: Word Triggers */}
              {strategy.keyword_reference && (
                <div className="bg-white/5 rounded-xl p-6 border border-white/10 max-w-full overflow-hidden">
                  <h4 className="text-lg font-semibold text-cyan-400 mb-4 break-words">⚡ {strategy.keyword_reference.title}</h4>
                  
                  <div className="overflow-x-auto max-w-full">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/20">
                          <th className="text-left p-3 text-gray-400">If Question Says...</th>
                          <th className="text-left p-3 text-gray-400">Likely Best Answer Involves...</th>
                        </tr>
                      </thead>
                      <tbody>
                        {strategy.keyword_reference.rows && strategy.keyword_reference.rows.map((row, idx) => {
                          const getKeywordColor = (color) => {
                            switch(color) {
                              case 'amber': return 'text-amber-400';
                              case 'emerald': return 'text-emerald-400';
                              case 'blue': return 'text-blue-400';
                              case 'red': return 'text-red-400';
                              case 'purple': return 'text-purple-400';
                              case 'orange': return 'text-orange-400';
                              case 'pink': return 'text-pink-400';
                              default: return 'text-cyan-400';
                            }
                          };
                          return (
                            <tr key={idx} className="border-b border-white/10">
                              <td className={`p-3 ${getKeywordColor(row.color)} font-semibold`}>{row.keyword}</td>
                              <td className="p-3 text-gray-300 break-words">{row.answer}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* DO vs DON'T */}
              {strategy.do_vs_dont && (
                <div className="bg-white/5 rounded-xl p-6 border border-white/10 max-w-full overflow-hidden">
                  <h4 className="text-lg font-semibold text-amber-400 mb-4 break-words">… DO vs âŒ DON'T</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-full">
                    <div className="bg-emerald-500/10 rounded-xl p-5 border border-emerald-500/20">
                      <div className="text-emerald-400 font-bold text-lg mb-3">… DO Choose Answers That...</div>
                      <ul className="text-gray-300 text-sm space-y-2">
                        {strategy.do_vs_dont.do && strategy.do_vs_dont.do.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-emerald-400">“</span>
                            <span className="break-words">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-red-500/10 rounded-xl p-5 border border-red-500/20">
                      <div className="text-red-400 font-bold text-lg mb-3">âŒ DON'T Choose Answers That...</div>
                      <ul className="text-gray-300 text-sm space-y-2">
                        {strategy.do_vs_dont.dont && strategy.do_vs_dont.dont.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <XIcon size={16} stroke="#f87171" className="inline-block" />
                            <span className="break-words">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Common Traps */}
              {strategy.common_traps && Array.isArray(strategy.common_traps) && (
                <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-xl p-6 border border-red-500/20 max-w-full overflow-hidden">
                  <h4 className="text-lg font-semibold text-red-400 mb-4 break-words">ðŸª¤ Common Exam Traps</h4>
                  
                  <div className="space-y-4 max-w-full">
                    {strategy.common_traps.map((trap, idx) => (
                      <div key={idx} className="bg-black/30 rounded-lg p-4 max-w-full overflow-hidden">
                        <div className="flex items-start gap-3 max-w-full">
                          <WarningIcon size={20} stroke="#f87171" className="inline-block flex-shrink-0" />
                          <div className="min-w-0 flex-1 overflow-hidden">
                            <div className="text-white font-semibold break-words">{trap.title}</div>
                            <p className="text-gray-400 text-sm mt-1 break-words overflow-hidden">{trap.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Final Memory Aid */}
              {strategy.memory_mantra && (
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30 max-w-full overflow-hidden">
                  <h4 className="text-lg font-semibold text-white mb-3 text-center break-words">ðŸ§  {strategy.memory_mantra.title}</h4>
                  <p className="text-3xl text-center font-light max-w-full overflow-hidden break-words">
                    {strategy.memory_mantra.words && strategy.memory_mantra.words.map((word, idx) => {
                      const getWordColor = (color) => {
                        switch(color) {
                          case 'emerald': return 'text-emerald-400';
                          case 'blue': return 'text-blue-400';
                          case 'purple': return 'text-purple-400';
                          case 'amber': return 'text-amber-400';
                          default: return 'text-cyan-400';
                        }
                      };
                      return (
                        <span key={idx} className="break-words">
                          <span className={`${getWordColor(word.color)} font-semibold break-words`}>{word.word}</span>
                          {idx < strategy.memory_mantra.words.length - 1 && <span className="text-gray-500 mx-2">â†’</span>}
                        </span>
                      );
                    })}
                  </p>
                  <p className="text-gray-400 text-center text-sm mt-3 break-words overflow-hidden">{strategy.memory_mantra.subtitle}</p>
                </div>
              )}

              {/* Bottom Line */}
              {strategy.bottom_line && (
                <div className="bg-black/40 rounded-xl p-5 border-l-4 border-emerald-500 max-w-full overflow-hidden">
                  <p className="text-gray-200 text-lg break-words overflow-hidden">{safeRenderText(strategy.bottom_line)}</p>
                </div>
              )}
            </div>
          );
        }
        // Empower Team structure
        if (content.decision_guide) {
          return (
            <div className="space-y-6">
              {/* Decision Guide */}
              {content.decision_guide && (
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-emerald-400 mb-4">{content.decision_guide.title}</h4>
                  <p className="text-gray-300 mb-4">{content.decision_guide.description}</p>
                  <div className="space-y-3">
                    {content.decision_guide.checks && content.decision_guide.checks.map((check, idx) => {
                      const colors = [
                        { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' },
                        { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400' },
                        { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400' },
                        { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400' }
                      ];
                      const color = colors[idx % 4];
                      return (
                        <div key={idx} className={`flex items-center gap-4 ${color.bg} rounded-lg p-4 border ${color.border}`}>
                          <div className={`${color.text} text-2xl`}>{check.number}</div>
                          <div>
                            <span className="text-gray-200 font-medium">{check.question}</span>
                            <p className="text-gray-400 text-sm">{check.guidance}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {/* Phrase Recognition */}
              {content.phrase_recognition && (
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-cyan-400 mb-4">{content.phrase_recognition.title}</h4>
                  <p className="text-gray-300 mb-4">{content.phrase_recognition.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-cyan-400 font-semibold mb-2">Phrases Suggesting MORE Delegation</div>
                      <ul className="text-gray-300 text-sm space-y-1">
                        {content.phrase_recognition.more_delegation_phrases && content.phrase_recognition.more_delegation_phrases.map((phrase, idx) => (
                          <li key={idx}>• {phrase}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-orange-400 font-semibold mb-2">Phrases Suggesting LESS Delegation</div>
                      <ul className="text-gray-300 text-sm space-y-1">
                        {content.phrase_recognition.less_delegation_phrases && content.phrase_recognition.less_delegation_phrases.map((phrase, idx) => (
                          <li key={idx}>• {phrase}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              
              {/* DO vs DON'T */}
              {content.do_vs_dont && (
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-amber-400 mb-4">{content.do_vs_dont.title}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                      <div className="text-green-400 font-semibold mb-3">“ Choose Answers That¦</div>
                      <ul className="text-gray-300 text-sm space-y-2">
                        {content.do_vs_dont.do && content.do_vs_dont.do.map((item, idx) => (
                          <li key={idx}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
                      <div className="text-red-400 font-semibold mb-3">✗ Avoid Answers That¦</div>
                      <ul className="text-gray-300 text-sm space-y-2">
                        {content.do_vs_dont.dont && content.do_vs_dont.dont.map((item, idx) => (
                          <li key={idx}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Trap Patterns */}
              {content.trap_patterns && (
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-red-400 mb-4">{content.trap_patterns.title}</h4>
                  <div className="space-y-4">
                    {content.trap_patterns.traps && content.trap_patterns.traps.map((trap, idx) => (
                      <div key={idx} className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
                        <div className="text-red-400 font-semibold mb-2">{trap.name}</div>
                        <p className="text-gray-400 text-sm">
                          {trap.description}
                          <span className="text-red-400"> ” {trap.reality}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Memory Aid */}
              {content.memory_aid && (
                <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-xl p-6 border border-emerald-500/20">
                  <h4 className="text-lg font-semibold text-white mb-3">ðŸ’¡ Quick Memory Aid</h4>
                  <p className="text-gray-300 text-lg text-center">{content.memory_aid.text}</p>
                </div>
              )}
            </div>
          );
        }
        
        // Fallback to original structure
        return (
          <div className="space-y-4">
            {content.do && Array.isArray(content.do) && content.do.length > 0 && (
              <div className="border-l-4 border-emerald-500/50 bg-emerald-500/5 p-4 rounded">
                <h4 className="executive-font text-lg font-semibold text-emerald-400 mb-3">“ Do:</h4>
                {typeof content.do[0] === 'object' && content.do[0].action ? (
                  <div className="space-y-2">
                    {content.do.map((item, idx) => (
                      <div key={idx} className="text-slate-300">
                        <span className="font-semibold text-emerald-400">{item.action}</span>
                        <span className="text-slate-400 ml-2">” {item.why}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="space-y-1">
                    {content.do.map((item, idx) => (
                      <li key={idx} className="text-slate-300 flex items-start gap-2">
                        <span className="text-emerald-400 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            {content.dont && Array.isArray(content.dont) && content.dont.length > 0 && (
              <div className="border-l-4 border-red-500/50 bg-red-500/5 p-4 rounded">
                <h4 className="executive-font text-lg font-semibold text-red-400 mb-3">✗ Don't:</h4>
                {typeof content.dont[0] === 'object' && content.dont[0].trap ? (
                  <div className="space-y-2">
                    {content.dont.map((item, idx) => (
                      <div key={idx} className="text-slate-300">
                        <span className="font-semibold text-red-400">{item.trap}</span>
                        <span className="text-slate-400 ml-2">” {item.why_wrong}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="space-y-1">
                    {content.dont.map((item, idx) => (
                      <li key={idx} className="text-slate-300 flex items-start gap-2">
                        <span className="text-red-400 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            {content.signal_words && (
              <>
                {content.signal_words.correct && content.signal_words.correct.length > 0 && (
                  <div className="border-l-4 border-cyan-500/50 bg-cyan-500/5 p-4 rounded">
                    <h4 className="executive-font text-lg font-semibold text-cyan-400 mb-3">Signal Words (Correct Answers):</h4>
                    <ul className="space-y-1">
                      {content.signal_words.correct.map((item, idx) => (
                        <li key={idx} className="text-slate-300 flex items-start gap-2">
                          <span className="text-cyan-400 mt-1">•</span>
                          <span className="break-words">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {content.signal_words.wrong && content.signal_words.wrong.length > 0 && (
                  <div className="border-l-4 border-orange-500/50 bg-orange-500/5 p-4 rounded">
                    <h4 className="executive-font text-lg font-semibold text-orange-400 mb-3">Signal Words (Wrong Answers):</h4>
                    <ul className="space-y-1">
                      {content.signal_words.wrong.map((item, idx) => (
                        <li key={idx} className="text-slate-300 flex items-start gap-2">
                          <span className="text-orange-400 mt-1">•</span>
                          <span className="break-words">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
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
      
      case 'what-this-task-is':
        return (
          <div className="space-y-4">
            {content.definition && (
              <div className="border-l-4 border-orange-500/50 bg-orange-500/5 p-4 rounded">
                <h4 className="executive-font text-lg font-semibold text-white mb-2">Definition</h4>
                <p className="text-slate-300 italic">"{content.definition}"</p>
              </div>
            )}
            {content.core_principle && (
              <div className="mt-4">
                <h4 className="executive-font text-lg font-semibold text-white mb-2">Core Principle</h4>
                <p className="text-slate-300 leading-relaxed">{content.core_principle}</p>
              </div>
            )}
          </div>
        );
      
      case 'how-to-apply':
        // Enhanced How to Apply It for Manage Conflict
        if (selectedTask === 'Manage Conflict' && typeof content === 'object' && content !== null && content.enhanced === true) {
          const howTo = content;
          return (
            <div className="space-y-6 max-w-full overflow-hidden">
              {/* The PAUSE Method */}
              {howTo.pause_method && (
                <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl p-6 border border-emerald-500/20 max-w-full overflow-hidden">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-2xl">â¸ï¸</div>
                    <h4 className="text-xl font-bold text-emerald-400">{howTo.pause_method.title}</h4>
                    <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-1 rounded-full">{howTo.pause_method.subtitle}</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
                    {howTo.pause_method.steps && howTo.pause_method.steps.map((step, idx) => {
                      const getColor = (color) => {
                        switch(color) {
                          case 'emerald': return 'text-emerald-400';
                          case 'teal': return 'text-teal-400';
                          case 'cyan': return 'text-cyan-400';
                          case 'blue': return 'text-blue-400';
                          case 'purple': return 'text-purple-400';
                          default: return 'text-emerald-400';
                        }
                      };
                      return (
                        <div key={idx} className="bg-black/30 rounded-xl p-4 text-center">
                          <div className={`text-4xl font-bold ${getColor(step.color)} mb-2`}>{step.letter}</div>
                          <div className="text-white font-semibold">{step.name}</div>
                          <p className="text-gray-400 text-sm mt-2 break-words">{step.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step-by-Step Process */}
              {howTo.step_by_step_process && (
                <div className="bg-white/5 rounded-xl p-6 border border-white/10 max-w-full overflow-hidden">
                  <h4 className="text-lg font-semibold text-amber-400 mb-4 break-words">ðŸ“‹ {howTo.step_by_step_process.title}</h4>
                  
                  <div className="relative max-w-full overflow-hidden">
                    <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-gradient-to-b from-amber-500 to-emerald-500"></div>
                    
                    <div className="space-y-6 ml-10">
                      {howTo.step_by_step_process.steps && howTo.step_by_step_process.steps.map((step, idx) => {
                        const getStepColor = (color) => {
                          switch(color) {
                            case 'amber': return { bg: 'bg-amber-500', text: 'text-amber-400', card: 'bg-amber-500/10', border: 'border-amber-500/20' };
                            case 'orange': return { bg: 'bg-orange-500', text: 'text-orange-400', card: 'bg-orange-500/10', border: 'border-orange-500/20' };
                            case 'blue': return { bg: 'bg-blue-500', text: 'text-blue-400', card: 'bg-blue-500/10', border: 'border-blue-500/20' };
                            case 'purple': return { bg: 'bg-purple-500', text: 'text-purple-400', card: 'bg-purple-500/10', border: 'border-purple-500/20' };
                            case 'emerald': return { bg: 'bg-emerald-500', text: 'text-emerald-400', card: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
                            case 'teal': return { bg: 'bg-teal-500', text: 'text-teal-400', card: 'bg-teal-500/10', border: 'border-teal-500/20' };
                            default: return { bg: 'bg-amber-500', text: 'text-amber-400', card: 'bg-amber-500/10', border: 'border-amber-500/20' };
                          }
                        };
                        const stepColors = getStepColor(step.color);
                        return (
                          <div key={idx} className="relative">
                            <div className={`absolute -left-8 w-6 h-6 ${stepColors.bg} rounded-full flex items-center justify-center text-black font-bold text-sm`}>
                              {step.number}
                            </div>
                            <div>
                              <h5 className={`${stepColors.text} font-semibold`}>{step.title}</h5>
                              <p className="text-gray-400 text-sm mt-1 break-words">{step.description}</p>
                              {step.example && (
                                <div className={`${stepColors.card} rounded-lg p-3 mt-2 border ${stepColors.border}`}>
                                  <p className="text-gray-300 text-sm italic break-words">{step.example}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Facilitation Phrases */}
              {howTo.power_phrases && (
                <div className="bg-white/5 rounded-xl p-6 border border-white/10 max-w-full overflow-hidden">
                  <h4 className="text-lg font-semibold text-cyan-400 mb-4 break-words">ðŸ’¬ {howTo.power_phrases.title}</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-full">
                    {howTo.power_phrases.categories && howTo.power_phrases.categories.map((category, idx) => {
                      const getCategoryColor = (color) => {
                        switch(color) {
                          case 'cyan': return { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-400' };
                          case 'emerald': return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' };
                          case 'purple': return { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400' };
                          case 'amber': return { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400' };
                          default: return { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-400' };
                        }
                      };
                      const catColors = getCategoryColor(category.color);
                      return (
                        <div key={idx} className={`${catColors.bg} rounded-lg p-4 border ${catColors.border}`}>
                          <div className={`${catColors.text} font-semibold mb-2`}>{category.name}</div>
                          <ul className="text-gray-300 text-sm space-y-2">
                            {category.phrases && category.phrases.map((phrase, pIdx) => (
                              <li key={pIdx} className="break-words">{phrase}</li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Pro Tip */}
              {howTo.pro_tip && (
                <div className="bg-black/40 rounded-xl p-5 border-l-4 border-emerald-500 max-w-full overflow-hidden">
                  <p className="text-gray-200 break-words overflow-hidden">{safeRenderText(howTo.pro_tip)}</p>
                </div>
              )}
            </div>
          );
        }
        // Empower Team structure
        if (content.organizing_around_strengths || content.bestowing_decision_making_authority || content.supporting_accountability) {
          return (
            <div className="space-y-6">
              {/* Organizing Around Strengths */}
              {content.organizing_around_strengths && (
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-emerald-400 mb-4">Organizing Around Strengths</h4>
                  <p className="text-gray-300 mb-4">
                    Empowerment starts with putting people where they can succeed:
                  </p>
                  <div className="space-y-3">
                    {content.organizing_around_strengths.step_1_assess_team_strengths && (
                      <div className="flex items-start gap-3">
                        <div className="text-emerald-400 mt-1">¦</div>
                        <div>
                          <span className="text-gray-200 font-medium">Know your team's capabilities</span>
                          <span className="text-gray-400"> ” Understand technical skills, experience levels, and growth areas</span>
                        </div>
                      </div>
                    )}
                    {content.organizing_around_strengths.step_2_match_work_to_strengths && (
                      <div className="flex items-start gap-3">
                        <div className="text-emerald-400 mt-1">¦</div>
                        <div>
                          <span className="text-gray-200 font-medium">Match assignments to strengths</span>
                          <span className="text-gray-400"> ” Give people work that leverages what they do well</span>
                        </div>
                      </div>
                    )}
                    {content.organizing_around_strengths.step_3_create_complementary_teams && (
                      <div className="flex items-start gap-3">
                        <div className="text-emerald-400 mt-1">¦</div>
                        <div>
                          <span className="text-gray-200 font-medium">Create stretch opportunities</span>
                          <span className="text-gray-400"> ” Assign challenging work with appropriate support structure</span>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start gap-3">
                      <div className="text-emerald-400 mt-1">¦</div>
                      <div>
                        <span className="text-gray-200 font-medium">Balance workload fairly</span>
                        <span className="text-gray-400"> ” Don't overload your best performers; develop everyone</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Bestowing Authority */}
              {content.bestowing_decision_making_authority && (
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-blue-400 mb-4">Bestowing Decision-Making Authority</h4>
                  <p className="text-gray-300 mb-4">
                    Make authority explicit ” don't leave people guessing about what they can decide:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                      <div className="text-green-400 font-semibold mb-2">“ DO</div>
                      <ul className="text-gray-300 text-sm space-y-2">
                        <li>• Define clear decision boundaries</li>
                        <li>• State explicitly what they CAN decide</li>
                        <li>• Specify when to escalate</li>
                        <li>• Match authority to accountability</li>
                        <li>• Adjust as capability grows</li>
                      </ul>
                    </div>
                    <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
                      <div className="text-red-400 font-semibold mb-2">✗ DON'T</div>
                      <ul className="text-gray-300 text-sm space-y-2">
                        <li>• Say "use your judgment" without boundaries</li>
                        <li>• Give responsibility without authority</li>
                        <li>• Override decisions after delegating</li>
                        <li>• Change rules without communication</li>
                        <li>• Delegate to avoid accountability yourself</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Supporting Accountability */}
              {content.supporting_accountability && (
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-purple-400 mb-4">Supporting Accountability</h4>
                  <p className="text-gray-300 mb-4">
                    Accountability requires ongoing support, not just assignment and hope:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
                      <div className="text-purple-400 font-bold text-lg">1</div>
                      <div>
                        <span className="text-gray-200 font-medium">Set clear expectations</span>
                        <p className="text-gray-400 text-sm">Define what success looks like and by when</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
                      <div className="text-purple-400 font-bold text-lg">2</div>
                      <div>
                        <span className="text-gray-200 font-medium">Provide necessary resources</span>
                        <p className="text-gray-400 text-sm">Tools, information, access, and budget to succeed</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
                      <div className="text-purple-400 font-bold text-lg">3</div>
                      <div>
                        <span className="text-gray-200 font-medium">Remove obstacles</span>
                        <p className="text-gray-400 text-sm">Clear organizational barriers they can't remove themselves</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
                      <div className="text-purple-400 font-bold text-lg">4</div>
                      <div>
                        <span className="text-gray-200 font-medium">Monitor outcomes, not activity</span>
                        <p className="text-gray-400 text-sm">Check results at appropriate intervals; don't micromanage steps</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
                      <div className="text-purple-400 font-bold text-lg">5</div>
                      <div>
                        <span className="text-gray-200 font-medium">Give feedback promptly</span>
                        <p className="text-gray-400 text-sm">Celebrate wins, address issues early, help them learn</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        }
        
        // Fallback to Support Performance structure
        return (
          <div className="space-y-6">
            {content.delivering_effective_feedback && (
              <div>
                <h4 className="executive-font text-lg font-semibold text-white mb-3">Delivering Effective Feedback</h4>
                <ol className="list-decimal list-inside space-y-2 text-slate-300 ml-4">
                  {content.delivering_effective_feedback.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ol>
              </div>
            )}
            {content.sbi_examples && (
              <div>
                <h4 className="executive-font text-lg font-semibold text-white mb-3">SBI Examples</h4>
                {content.sbi_examples.constructive && (
                  <div className="border-l-4 border-red-500/50 bg-red-500/5 p-4 rounded mb-4">
                    <h5 className="text-white font-semibold mb-2">Constructive:</h5>
                    <div className="bg-slate-800/50 p-4 rounded italic text-slate-300 space-y-2">
                      <p><strong className="text-red-400">S</strong>: "{content.sbi_examples.constructive.s}"</p>
                      <p><strong className="text-red-400">B</strong>: "{content.sbi_examples.constructive.b}"</p>
                      <p><strong className="text-red-400">I</strong>: "{content.sbi_examples.constructive.i}"</p>
                    </div>
                  </div>
                )}
                {content.sbi_examples.positive && (
                  <div className="border-l-4 border-emerald-500/50 bg-emerald-500/5 p-4 rounded">
                    <h5 className="text-white font-semibold mb-2">Positive:</h5>
                    <div className="bg-slate-800/50 p-4 rounded italic text-slate-300 space-y-2">
                      <p><strong className="text-emerald-400">S</strong>: "{content.sbi_examples.positive.s}"</p>
                      <p><strong className="text-emerald-400">B</strong>: "{content.sbi_examples.positive.b}"</p>
                      <p><strong className="text-emerald-400">I</strong>: "{content.sbi_examples.positive.i}"</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            {content.recognition_best_practices_taps && (
              <div>
                <h4 className="executive-font text-lg font-semibold text-white mb-3">Recognition Best Practices (T.A.P.S.)</h4>
                <div className="space-y-2 text-slate-300">
                  <p><strong className="text-orange-400">T</strong>: {content.recognition_best_practices_taps.t}</p>
                  <p><strong className="text-orange-400">A</strong>: {content.recognition_best_practices_taps.a}</p>
                  <p><strong className="text-orange-400">P</strong>: {content.recognition_best_practices_taps.p}</p>
                  <p><strong className="text-orange-400">S</strong>: {content.recognition_best_practices_taps.s}</p>
                </div>
              </div>
            )}
          </div>
        );
      
      case 'how-task-tested':
        // Enhanced How This Task Is Tested for Manage Conflict
        if (selectedTask === 'Manage Conflict' && typeof content === 'object' && content !== null && content.enhanced === true) {
          const tested = content;
          return (
            <div className="space-y-6 max-w-full overflow-hidden">
              {/* Intro Stats */}
              {tested.stats && (
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/20 max-w-full overflow-hidden">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center max-w-full">
                    <div>
                      <div className="text-3xl font-bold text-blue-400">{tested.stats.questions_on_exam}</div>
                      <div className="text-gray-400 text-sm">Questions on Exam</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-purple-400">{tested.stats.frequency}</div>
                      <div className="text-gray-400 text-sm">Frequency Topic</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-emerald-400">{tested.stats.situational_format}</div>
                      <div className="text-gray-400 text-sm">Situational Format</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-amber-400">{tested.stats.primary_framework}</div>
                      <div className="text-gray-400 text-sm">Primary Framework</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Question Patterns */}
              {tested.question_patterns && Array.isArray(tested.question_patterns) && (
                <div className="bg-white/5 rounded-xl p-6 border border-white/10 max-w-full overflow-hidden">
                  <h4 className="text-lg font-semibold text-cyan-400 mb-4 break-words">ðŸ“Š Six Question Patterns You'll See</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-full">
                    {tested.question_patterns.map((pattern, idx) => {
                      const getColorClasses = (color) => {
                        switch(color) {
                          case 'cyan': return { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-400', badge: 'bg-cyan-500/30' };
                          case 'emerald': return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', badge: 'bg-emerald-500/30' };
                          case 'purple': return { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400', badge: 'bg-purple-500/30' };
                          case 'amber': return { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', badge: 'bg-amber-500/30' };
                          case 'rose': return { bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-400', badge: 'bg-rose-500/30' };
                          case 'blue': return { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', badge: 'bg-blue-500/30' };
                          default: return { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-400', badge: 'bg-cyan-500/30' };
                        }
                      };
                      const colors = getColorClasses(pattern.color);
                      return (
                        <div key={idx} className={`${colors.bg} rounded-lg p-4 border ${colors.border} max-w-full overflow-hidden`}>
                          <div className="flex items-center gap-2 mb-2 max-w-full">
                            <span className={`${colors.badge} ${colors.text} text-xs font-bold px-2 py-1 rounded break-words`}>{pattern.pattern}</span>
                            <span className="text-white font-semibold break-words min-w-0 flex-1">{pattern.name}</span>
                          </div>
                          <p className="text-gray-400 text-sm break-words overflow-hidden">{pattern.question}</p>
                          <p className={`${colors.text} text-xs mt-2 break-words overflow-hidden`}>â†’ {pattern.tests}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* What PMI Expects */}
              {tested.pmi_expectations && Array.isArray(tested.pmi_expectations) && (
                <div className="bg-white/5 rounded-xl p-6 border border-white/10 max-w-full overflow-hidden">
                  <h4 className="text-lg font-semibold text-emerald-400 mb-4 break-words">ðŸŽ¯ What PMI Expects You to Demonstrate</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-full">
                    {tested.pmi_expectations.map((expectation, idx) => {
                      const getExpColor = (color) => {
                        switch(color) {
                          case 'emerald': return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' };
                          case 'blue': return { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400' };
                          case 'purple': return { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400' };
                          default: return { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-400' };
                        }
                      };
                      const expColors = getExpColor(expectation.color);
                      return (
                        <div key={idx} className={`${expColors.bg} rounded-xl p-5 border ${expColors.border} max-w-full overflow-hidden`}>
                          <div className="text-3xl mb-3 text-center">{expectation.emoji}</div>
                          <h5 className={`${expColors.text} font-semibold text-center mb-2 break-words`}>{expectation.title}</h5>
                          <ul className="text-gray-400 text-sm space-y-1 max-w-full">
                            {expectation.items && expectation.items.map((item, iIdx) => (
                              <li key={iIdx} className="break-words overflow-hidden">• {item}</li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* The PMI Mindset */}
              {tested.pmi_mindset && (
                <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl p-6 border border-amber-500/20 max-w-full overflow-hidden">
                  <h4 className="text-lg font-semibold text-amber-400 mb-4 break-words">ðŸ’­ The PMI Mindset for Conflict Questions</h4>
                  
                  <div className="bg-black/30 rounded-lg p-5 max-w-full overflow-hidden">
                    <p className="text-gray-200 text-lg leading-relaxed break-words overflow-hidden">{safeRenderText(tested.pmi_mindset.intro)}</p>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 max-w-full">
                      {tested.pmi_mindset.checklist && tested.pmi_mindset.checklist.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-gray-300">
                          <span className="text-emerald-400">“</span>
                          <span className="break-words">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Pro Tip */}
              {tested.pro_tip && (
                <div className="bg-black/40 rounded-xl p-5 border-l-4 border-blue-500 max-w-full overflow-hidden">
                  <p className="text-gray-200 break-words overflow-hidden">{safeRenderText(tested.pro_tip)}</p>
                </div>
              )}
            </div>
          );
        }
        // Default rendering
        return (
          <div className="space-y-4">
            {content.description && (
              <p className="text-slate-300 leading-relaxed mb-4">{content.description}</p>
            )}
            {content.question_patterns && content.question_patterns.length > 0 && (
              <div>
                <h4 className="executive-font text-lg font-semibold text-white mb-3">Question Patterns</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-slate-600">
                        <th className="text-left p-3 text-white font-semibold">Pattern</th>
                        <th className="text-left p-3 text-white font-semibold">What They Test</th>
                        <th className="text-left p-3 text-white font-semibold">Key Signals</th>
                      </tr>
                    </thead>
                    <tbody>
                      {content.question_patterns.map((pattern, idx) => (
                        <tr key={idx} className="border-b border-slate-700/50">
                          <td className="p-3 text-orange-400 font-semibold">{pattern.pattern}</td>
                          <td className="p-3 text-slate-300">{pattern.what_they_test}</td>
                          <td className="p-3 text-slate-400 italic">{pattern.key_signals}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {content.what_pmi_expects && content.what_pmi_expects.length > 0 && (
              <div className="border-l-4 border-cyan-500/50 bg-cyan-500/5 p-4 rounded">
                <h4 className="executive-font text-lg font-semibold text-white mb-3">What PMI Expects</h4>
                <ul className="space-y-2">
                  {content.what_pmi_expects.map((item, idx) => (
                    <li key={idx} className="text-slate-300 flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      
      case 'sample-question':
        // Enhanced Sample Questions for Manage Conflict
        if (selectedTask === 'Manage Conflict' && typeof content === 'object' && content !== null && content.enhanced === true) {
          const question = content;
          const getGradient = (num) => {
            switch(num) {
              case 1: return 'from-blue-500/10 to-indigo-500/10';
              case 2: return 'from-purple-500/10 to-pink-500/10';
              case 3: return 'from-amber-500/10 to-red-500/10';
              default: return 'from-blue-500/10 to-indigo-500/10';
            }
          };
          const getHeaderColor = (num) => {
            switch(num) {
              case 1: return { bg: 'bg-blue-500/20', border: 'border-blue-500/20', badge: 'bg-blue-500/30', text: 'text-blue-400' };
              case 2: return { bg: 'bg-purple-500/20', border: 'border-purple-500/20', badge: 'bg-purple-500/30', text: 'text-purple-400' };
              case 3: return { bg: 'bg-amber-500/20', border: 'border-amber-500/20', badge: 'bg-amber-500/30', text: 'text-amber-400' };
              default: return { bg: 'bg-blue-500/20', border: 'border-blue-500/20', badge: 'bg-blue-500/30', text: 'text-blue-400' };
            }
          };
          const questionNum = section.key === 'sample_question_1' ? 1 : (section.key === 'sample_question_2' ? 2 : 3);
          const headerColors = getHeaderColor(questionNum);
          const correctIndex = question.correct_answer === 'B' ? 1 : (question.correct_answer === 'A' ? 0 : (question.correct_answer === 'C' ? 2 : 3));
          
          return (
            <div className="space-y-6 max-w-full overflow-hidden">
              {/* Question Card */}
              <div className={`bg-gradient-to-br ${getGradient(questionNum)} rounded-xl border ${headerColors.border} overflow-hidden max-w-full`}>
                <div className={`${headerColors.bg} px-6 py-3 border-b ${headerColors.border} max-w-full overflow-hidden`}>
                  <div className="flex items-center justify-between max-w-full">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className={`${headerColors.badge} ${headerColors.text} font-bold px-3 py-1 rounded-full text-sm flex-shrink-0`}>
                        Question {questionNum}
                      </span>
                      <span className="text-gray-400 text-sm break-words min-w-0 flex-1">{question.title}</span>
                    </div>
                    <span className="text-gray-500 text-sm flex-shrink-0 ml-2">Difficulty: {question.difficulty}</span>
                  </div>
                </div>
                
                <div className="p-6 max-w-full overflow-hidden">
                  <p className="text-gray-200 text-lg leading-relaxed break-words overflow-hidden">{safeRenderText(question.question)}</p>
                </div>
              </div>

              {/* Answer Options */}
              <div className="space-y-3 max-w-full">
                {question.options && question.options.map((opt, optIdx) => (
                  <div key={optIdx} className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-white/20 transition-colors cursor-pointer max-w-full overflow-hidden">
                    <div className="flex items-start gap-3 max-w-full">
                      <span className="bg-gray-500/30 text-gray-400 font-bold px-3 py-1 rounded-full text-sm flex-shrink-0">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <p className="text-gray-300 break-words min-w-0 flex-1 overflow-hidden">{opt}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Answer Reveal */}
              <div className="bg-emerald-500/10 rounded-xl p-6 border border-emerald-500/30 max-w-full overflow-hidden">
                <div className="flex items-center gap-3 mb-4 max-w-full">
                  <div className="bg-emerald-500/30 rounded-full p-2 flex-shrink-0">
                    <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-emerald-400 font-bold text-xl break-words min-w-0 flex-1">Correct Answer: {question.correct_answer}</span>
                </div>
                
                <p className="text-gray-300 mb-4 break-words overflow-hidden">{question.correct_text}</p>
                
                <div className="bg-black/30 rounded-lg p-4 max-w-full overflow-hidden">
                  <h5 className="text-white font-semibold mb-2 break-words">Why This Is Correct:</h5>
                  <ul className="text-gray-400 text-sm space-y-2 max-w-full">
                    {question.why_correct && question.why_correct.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 max-w-full">
                        <span className="text-emerald-400 mt-1 flex-shrink-0">“</span>
                        <span className="break-words min-w-0 flex-1 overflow-hidden"><strong className="text-gray-300 break-words">{item.point}</strong> {item.detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Positions vs Interests (Question 2 only) */}
              {questionNum === 2 && question.positions_vs_interests && (
                <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl p-6 border border-amber-500/20 max-w-full overflow-hidden">
                  <h4 className="text-lg font-semibold text-amber-400 mb-4 break-words">ðŸ’¡ {question.positions_vs_interests.title}</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 max-w-full">
                    <div className="bg-black/30 rounded-lg p-4">
                      <div className="text-red-400 font-semibold mb-2">{question.positions_vs_interests.positions.title}</div>
                      <ul className="text-gray-400 text-sm space-y-1">
                        {question.positions_vs_interests.positions.examples && question.positions_vs_interests.positions.examples.map((ex, idx) => (
                          <li key={idx} className="break-words">• {ex}</li>
                        ))}
                      </ul>
                      <p className="text-red-400/70 text-xs mt-2">{question.positions_vs_interests.positions.note}</p>
                    </div>
                    <div className="bg-black/30 rounded-lg p-4">
                      <div className="text-emerald-400 font-semibold mb-2">{question.positions_vs_interests.interests.title}</div>
                      <ul className="text-gray-400 text-sm space-y-1">
                        {question.positions_vs_interests.interests.examples && question.positions_vs_interests.interests.examples.map((ex, idx) => (
                          <li key={idx} className="break-words">• {ex}</li>
                        ))}
                      </ul>
                      <p className="text-emerald-400/70 text-xs mt-2">{question.positions_vs_interests.interests.note}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm break-words">
                    <strong className="text-amber-400">Solution:</strong> {question.positions_vs_interests.solution}
                  </p>
                </div>
              )}

              {/* Observation-Based Feedback (Question 3 only) */}
              {questionNum === 3 && question.observation_feedback && (
                <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl p-6 border border-cyan-500/20 max-w-full overflow-hidden">
                  <h4 className="text-lg font-semibold text-cyan-400 mb-4 break-words">ðŸŽ¯ {question.observation_feedback.title}</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-full">
                    <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
                      <div className="text-red-400 font-semibold mb-2">{question.observation_feedback.vague.title}</div>
                      <ul className="text-gray-400 text-sm space-y-2">
                        {question.observation_feedback.vague.examples && question.observation_feedback.vague.examples.map((ex, idx) => (
                          <li key={idx} className="break-words">{ex}</li>
                        ))}
                      </ul>
                      <p className="text-red-400/70 text-xs mt-2">{question.observation_feedback.vague.note}</p>
                    </div>
                    <div className="bg-emerald-500/10 rounded-lg p-4 border border-emerald-500/20">
                      <div className="text-emerald-400 font-semibold mb-2">{question.observation_feedback.specific.title}</div>
                      <ul className="text-gray-400 text-sm space-y-2">
                        {question.observation_feedback.specific.examples && question.observation_feedback.specific.examples.map((ex, idx) => (
                          <li key={idx} className="break-words">{ex}</li>
                        ))}
                      </ul>
                      <p className="text-emerald-400/70 text-xs mt-2">{question.observation_feedback.specific.note}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Why Other Answers Are Wrong */}
              {question.why_wrong && Array.isArray(question.why_wrong) && (
                <div className="bg-white/5 rounded-xl p-6 border border-white/10 max-w-full overflow-hidden">
                  <h4 className="text-lg font-semibold text-red-400 mb-4 break-words">âŒ Why Other Answers Are Wrong</h4>
                  
                  <div className="space-y-4 max-w-full">
                    {question.why_wrong.map((wrong, idx) => (
                      <div key={idx} className="bg-red-500/10 rounded-lg p-4 border border-red-500/20 max-w-full overflow-hidden">
                        <div className="flex items-center gap-2 mb-2 max-w-full">
                          <span className="text-red-400 font-bold flex-shrink-0">{wrong.letter}</span>
                          <span className="text-gray-400 flex-shrink-0">|</span>
                          <span className="text-gray-300 break-words min-w-0 flex-1">{wrong.text}</span>
                        </div>
                        <p className="text-gray-400 text-sm break-words overflow-hidden">{safeRenderText(wrong.reason)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Takeaway */}
              {question.key_takeaway && (
                <div className="bg-black/40 rounded-xl p-5 border-l-4 border-blue-500 max-w-full overflow-hidden">
                  <p className="text-gray-200 break-words overflow-hidden">{safeRenderText(question.key_takeaway)}</p>
                </div>
              )}
            </div>
          );
        }
        // Default sample question rendering
        const correctIndex = section.correctAnswer === 'B' ? 1 : (section.correctAnswer === 'A' ? 0 : (section.correctAnswer === 'C' ? 2 : 3));
        return (
          <div className="space-y-4">
            {content.scenario && (
              <div className="bg-slate-800/50 p-4 rounded mb-4">
                <h4 className="text-white font-semibold mb-2">Scenario:</h4>
                <p className="text-slate-300 leading-relaxed">{content.scenario}</p>
              </div>
            )}
            {content.options && content.options.length > 0 && (
              <div className="space-y-2 mb-4">
                {content.options.map((opt, optIdx) => {
                  const isCorrect = optIdx === correctIndex;
                  return (
                    <div key={optIdx} className={`p-3 rounded transition-all ${
                      isCorrect 
                        ? 'bg-emerald-500/20 border-2 border-emerald-500/50' 
                        : 'bg-slate-800/50 border border-slate-700'
                    }`}>
                      <div className="flex items-start gap-3">
                        <span className={`font-bold text-lg ${isCorrect ? 'text-emerald-400' : 'text-slate-400'}`}>
                          {String.fromCharCode(65 + optIdx)}:
                        </span>
                        <span className={`flex-1 ${isCorrect ? 'text-emerald-300 font-semibold' : 'text-slate-300'}`}>
                          {opt}
                        </span>
                        {isCorrect && (
                          <span className="text-emerald-400 font-bold">“ Correct</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {content.analysis && (
              <>
                {content.analysis.why_b_correct && (
                  <div className="bg-emerald-500/10 p-4 rounded border border-emerald-500/30 mb-3">
                    <p className="text-emerald-400 font-semibold mb-2">Why B is correct:</p>
                    <p className="text-slate-300 text-sm leading-relaxed">{content.analysis.why_b_correct}</p>
                  </div>
                )}
                {content.analysis.why_others_wrong && (
                  <div className="bg-red-500/10 p-4 rounded border border-red-500/30">
                    <p className="text-red-400 font-semibold mb-2">Why others are wrong:</p>
                    <div className="space-y-2">
                      {Object.entries(content.analysis.why_others_wrong).map(([key, value]) => (
                        <div key={key} className="text-slate-300 text-sm">
                          <span className="font-semibold text-red-300">{key}:</span> {value}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
            {content.key_principle && (
              <div className="border-l-4 border-orange-500/50 bg-orange-500/5 p-4 rounded mt-4">
                <p className="text-white font-semibold mb-1">Key Principle</p>
                <p className="text-slate-300 text-sm">{content.key_principle}</p>
              </div>
            )}
          </div>
        );
      
      case 'common-mistakes':
        return (
          <div className="space-y-4">
            {content.wrong_answer_patterns && content.wrong_answer_patterns.length > 0 && (
              <div>
                <h4 className="executive-font text-lg font-semibold text-white mb-3">Wrong Answer Patterns on Exam</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-slate-600">
                        <th className="text-left p-3 text-white font-semibold">Trap</th>
                        <th className="text-left p-3 text-white font-semibold">Why It's Wrong</th>
                        <th className="text-left p-3 text-white font-semibold">Better Approach</th>
                      </tr>
                    </thead>
                    <tbody>
                      {content.wrong_answer_patterns.map((mistake, idx) => (
                        <tr key={idx} className="border-b border-slate-700/50">
                          <td className="p-3 text-red-400 font-semibold">{mistake.trap}</td>
                          <td className="p-3 text-slate-300">{mistake.why_wrong}</td>
                          <td className="p-3 text-emerald-400">{mistake.better_approach}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {content.feedback_sandwich_trap && (
              <div className="border-l-4 border-yellow-500/50 bg-yellow-500/5 p-4 rounded mt-4">
                <h4 className="executive-font text-lg font-semibold text-white mb-2">The \"Feedback Sandwich\" Trap</h4>
                <p className="text-slate-300">{content.feedback_sandwich_trap}</p>
              </div>
            )}
          </div>
        );
      
      case 'introduction-detailed':
        return (
          <div className="space-y-6">
            {content.description && (
              <p className="text-slate-300 leading-relaxed mb-4">{content.description}</p>
            )}
            {content.pm_vs_functional_manager && (
              <p className="text-slate-300 leading-relaxed mb-2">{content.pm_vs_functional_manager}</p>
            )}
            {content.pm_tools && content.pm_tools.length > 0 && (
              <ul className="space-y-2 text-slate-300 ml-4 mb-4">
                {content.pm_tools.map((tool, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    <span>{tool}</span>
                  </li>
                ))}
              </ul>
            )}
            {content.unique_challenge && (
              <p className="text-slate-300 leading-relaxed mt-4 italic mb-4">{content.unique_challenge}</p>
            )}
            {content.performance_equation && (
              <div className="border-l-4 border-orange-500/50 bg-orange-500/5 p-4 rounded">
                <h4 className="executive-font text-lg font-semibold text-white mb-3">The Performance Equation</h4>
                <div className="bg-slate-800/50 p-3 rounded mb-3 font-mono text-center">
                  <p className="text-orange-400 text-xl font-bold">{content.performance_equation.formula}</p>
                </div>
                {content.performance_equation.description && (
                  <p className="text-slate-300 text-sm mb-3">{content.performance_equation.description}</p>
                )}
                {content.performance_equation.diagnosis_table && content.performance_equation.diagnosis_table.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-slate-600">
                          <th className="text-left p-2 text-white font-semibold">Factor</th>
                          <th className="text-left p-2 text-white font-semibold">Symptoms</th>
                          <th className="text-left p-2 text-white font-semibold">Intervention</th>
                        </tr>
                      </thead>
                      <tbody>
                        {content.performance_equation.diagnosis_table.map((row, idx) => (
                          <tr key={idx} className="border-b border-slate-700/50">
                            <td className="p-2 text-orange-400 font-semibold">{row.factor}</td>
                            <td className="p-2 text-slate-300 text-sm">{row.symptoms}</td>
                            <td className="p-2 text-slate-300 text-sm">{row.intervention}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
            {content.what_youll_learn && content.what_youll_learn.length > 0 && (
              <div className="mt-4">
                <h4 className="executive-font text-lg font-semibold text-white mb-3">What You'll Learn:</h4>
                <ol className="list-decimal list-inside space-y-2 text-slate-300 ml-4">
                  {content.what_youll_learn.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        );
      
      case 'sbi-feedback-model':
        return (
          <div className="space-y-6">
            {content.why_sbi_works && (
              <div>
                <h4 className="executive-font text-lg font-semibold text-white mb-3">Why SBI Works</h4>
                {content.why_sbi_works.description && (
                  <p className="text-slate-300 mb-2">{content.why_sbi_works.description}</p>
                )}
                {content.why_sbi_works.problems && content.why_sbi_works.problems.length > 0 && (
                  <ul className="space-y-2 text-slate-300 ml-4 mb-3">
                    {content.why_sbi_works.problems.map((problem, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-red-400 mt-1">•</span>
                        <span>{problem}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {content.why_sbi_works.solution && (
                  <p className="text-emerald-400 font-semibold">{content.why_sbi_works.solution}</p>
                )}
              </div>
            )}
            {content.three_components && (
              <div>
                <h4 className="executive-font text-lg font-semibold text-white mb-3">The Three Components</h4>
                <div className="space-y-4">
                  {content.three_components.situation && (
                    <div className="border-l-4 border-blue-500/50 bg-blue-500/5 p-4 rounded">
                      <h5 className="text-white font-semibold mb-2">Situation (S)</h5>
                      <p className="text-slate-300 text-sm mb-2">{content.three_components.situation.description}</p>
                      {content.three_components.situation.benefits && (
                        <ul className="text-slate-300 text-sm space-y-1 ml-4 mb-2">
                          {content.three_components.situation.benefits.map((benefit, idx) => (
                            <li key={idx}>• {benefit}</li>
                          ))}
                        </ul>
                      )}
                      {content.three_components.situation.examples && (
                        <div className="mt-2">
                          <p className="text-slate-400 text-xs mb-1">Examples:</p>
                          <ul className="text-slate-300 text-sm space-y-1 ml-4">
                            {content.three_components.situation.examples.map((ex, idx) => (
                              <li key={idx}>• {ex}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                  {content.three_components.behavior && (
                    <div className="border-l-4 border-purple-500/50 bg-purple-500/5 p-4 rounded">
                      <h5 className="text-white font-semibold mb-2">Behavior (B)</h5>
                      <p className="text-slate-300 text-sm mb-2">{content.three_components.behavior.description}</p>
                      {content.three_components.behavior.guidance && (
                        <ul className="text-slate-300 text-sm space-y-1 ml-4 mb-2">
                          {content.three_components.behavior.guidance.map((guide, idx) => (
                            <li key={idx}>• {guide}</li>
                          ))}
                        </ul>
                      )}
                      {content.three_components.behavior.examples && (
                        <div className="mt-2">
                          <p className="text-slate-400 text-xs mb-1">Examples:</p>
                          <ul className="text-slate-300 text-sm space-y-1 ml-4">
                            {content.three_components.behavior.examples.map((ex, idx) => (
                              <li key={idx}>• {ex}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                  {content.three_components.impact && (
                    <div className="border-l-4 border-rose-500/50 bg-rose-500/5 p-4 rounded">
                      <h5 className="text-white font-semibold mb-2">Impact (I)</h5>
                      <p className="text-slate-300 text-sm mb-2">{content.three_components.impact.description}</p>
                      {content.three_components.impact.purpose && (
                        <p className="text-slate-300 text-sm italic mb-2">{content.three_components.impact.purpose}</p>
                      )}
                      {content.three_components.impact.scope && (
                        <p className="text-slate-400 text-xs mb-2">{content.three_components.impact.scope}</p>
                      )}
                      {content.three_components.impact.examples && (
                        <div className="mt-2">
                          <p className="text-slate-400 text-xs mb-1">Examples:</p>
                          <ul className="text-slate-300 text-sm space-y-1 ml-4">
                            {content.three_components.impact.examples.map((ex, idx) => (
                              <li key={idx}>• {ex}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
            {content.sbi_examples && (
              <div>
                <h4 className="executive-font text-lg font-semibold text-white mb-3">SBI Examples</h4>
                {content.sbi_examples.constructive && (
                  <div className="border-l-4 border-red-500/50 bg-red-500/5 p-4 rounded mb-4">
                    <h5 className="text-white font-semibold mb-2">Constructive (Issue-focused):</h5>
                    <div className="bg-slate-800/50 p-4 rounded italic text-slate-300 leading-relaxed">
                      <p>{content.sbi_examples.constructive}</p>
                    </div>
                  </div>
                )}
                {content.sbi_examples.positive && (
                  <div className="border-l-4 border-emerald-500/50 bg-emerald-500/5 p-4 rounded">
                    <h5 className="text-white font-semibold mb-2">Positive (Recognition-focused):</h5>
                    <div className="bg-slate-800/50 p-4 rounded italic text-slate-300 leading-relaxed">
                      <p>{content.sbi_examples.positive}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            {content.delivery_framework && content.delivery_framework.length > 0 && (
              <div>
                <h4 className="executive-font text-lg font-semibold text-white mb-3">SBI Delivery Framework</h4>
                <ol className="list-decimal list-inside space-y-2 text-slate-300 ml-4">
                  {content.delivery_framework.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ol>
              </div>
            )}
            {content.common_mistakes && content.common_mistakes.length > 0 && (
              <div>
                <h4 className="executive-font text-lg font-semibold text-white mb-3">Common SBI Mistakes</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-slate-600">
                        <th className="text-left p-3 text-white font-semibold">Mistake</th>
                        <th className="text-left p-3 text-white font-semibold">Example</th>
                        <th className="text-left p-3 text-white font-semibold">Fix</th>
                      </tr>
                    </thead>
                    <tbody>
                      {content.common_mistakes.map((mistake, idx) => (
                        <tr key={idx} className="border-b border-slate-700/50">
                          <td className="p-3 text-red-400 font-semibold">{mistake.mistake}</td>
                          <td className="p-3 text-slate-300 italic">{mistake.example}</td>
                          <td className="p-3 text-emerald-400">{mistake.fix}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );
      
      case 'recognition-development':
        return (
          <div className="space-y-6">
            {content.performance_equation && (
              <div className="border-l-4 border-cyan-500/50 bg-cyan-500/5 p-4 rounded">
                <h4 className="executive-font text-lg font-semibold text-white mb-3">The Performance Equation</h4>
                <p className="text-2xl font-bold text-cyan-400 mb-4 text-center">{content.performance_equation.formula}</p>
                {content.performance_equation.diagnosis_table && (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-slate-600">
                          <th className="text-left p-3 text-white font-semibold">Factor</th>
                          <th className="text-left p-3 text-white font-semibold">Signs</th>
                          <th className="text-left p-3 text-white font-semibold">Questions to Ask</th>
                          <th className="text-left p-3 text-white font-semibold">Interventions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {content.performance_equation.diagnosis_table.map((row, idx) => (
                          <tr key={idx} className="border-b border-slate-700/50">
                            <td className="p-3 text-orange-400 font-semibold">{row.factor}</td>
                            <td className="p-3 text-slate-300">{row.signs}</td>
                            <td className="p-3 text-slate-300 italic">{row.questions_to_ask}</td>
                            <td className="p-3 text-emerald-400">{row.interventions}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
            {content.why_recognition_matters && content.why_recognition_matters.length > 0 && (
              <div>
                <h4 className="executive-font text-lg font-semibold text-white mb-3">Why Recognition Matters</h4>
                <p className="text-slate-300 mb-3">Research consistently shows recognition is one of the most powerful performance drivers:</p>
                <ul className="space-y-2 text-slate-300 ml-4">
                  {content.why_recognition_matters.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-orange-400 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {content.types_of_recognition && (
              <div>
                <h4 className="executive-font text-lg font-semibold text-white mb-3">Types of Recognition</h4>
                {content.types_of_recognition.by_formality && (
                  <div className="mb-4">
                    <h5 className="text-white font-semibold mb-2">By Formality:</h5>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b border-slate-600">
                            <th className="text-left p-3 text-white font-semibold">Type</th>
                            <th className="text-left p-3 text-white font-semibold">Examples</th>
                            <th className="text-left p-3 text-white font-semibold">Best For</th>
                          </tr>
                        </thead>
                        <tbody>
                          {content.types_of_recognition.by_formality.map((type, idx) => (
                            <tr key={idx} className="border-b border-slate-700/50">
                              <td className="p-3 text-orange-400 font-semibold">{type.type}</td>
                              <td className="p-3 text-slate-300">{type.examples}</td>
                              <td className="p-3 text-slate-400">{type.best_for}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                {content.types_of_recognition.by_visibility && (
                  <div>
                    <h5 className="text-white font-semibold mb-2">By Visibility:</h5>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b border-slate-600">
                            <th className="text-left p-3 text-white font-semibold">Type</th>
                            <th className="text-left p-3 text-white font-semibold">Examples</th>
                            <th className="text-left p-3 text-white font-semibold">Best For</th>
                          </tr>
                        </thead>
                        <tbody>
                          {content.types_of_recognition.by_visibility.map((type, idx) => (
                            <tr key={idx} className="border-b border-slate-700/50">
                              <td className="p-3 text-orange-400 font-semibold">{type.type}</td>
                              <td className="p-3 text-slate-300">{type.examples}</td>
                              <td className="p-3 text-slate-400">{type.best_for}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
            {content.taps_framework && (
              <div className="border-l-4 border-purple-500/50 bg-purple-500/5 p-4 rounded">
                <h4 className="executive-font text-lg font-semibold text-white mb-3">The T.A.P.S. Recognition Framework</h4>
                <div className="space-y-2 text-slate-300">
                  <p><strong className="text-purple-400">T</strong>: {content.taps_framework.t}</p>
                  <p><strong className="text-purple-400">A</strong>: {content.taps_framework.a}</p>
                  <p><strong className="text-purple-400">P</strong>: {content.taps_framework.p}</p>
                  <p><strong className="text-purple-400">S</strong>: {content.taps_framework.s}</p>
                </div>
              </div>
            )}
            {content.herzberg_two_factor_theory && (
              <div>
                <h4 className="executive-font text-lg font-semibold text-white mb-3">Herzberg's Two-Factor Theory</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border-l-4 border-yellow-500/50 bg-yellow-500/5 p-4 rounded">
                    <h5 className="text-white font-semibold mb-2">Hygiene Factors (prevent dissatisfaction):</h5>
                    <ul className="space-y-1 text-slate-300 text-sm">
                      {content.herzberg_two_factor_theory.hygiene_factors.examples.map((factor, idx) => (
                        <li key={idx}>• {factor}</li>
                      ))}
                    </ul>
                    <p className="text-slate-400 text-xs mt-2 italic">{content.herzberg_two_factor_theory.hygiene_factors.note}</p>
                  </div>
                  <div className="border-l-4 border-emerald-500/50 bg-emerald-500/5 p-4 rounded">
                    <h5 className="text-white font-semibold mb-2">Motivators (drive engagement):</h5>
                    <ul className="space-y-1 text-slate-300 text-sm">
                      {content.herzberg_two_factor_theory.motivators.examples.map((factor, idx) => (
                        <li key={idx}>• {factor}</li>
                      ))}
                    </ul>
                    <p className="text-slate-400 text-xs mt-2 italic">{content.herzberg_two_factor_theory.motivators.note}</p>
                  </div>
                </div>
                {content.herzberg_two_factor_theory.implication && (
                  <p className="text-slate-300 mt-4 italic">{content.herzberg_two_factor_theory.implication}</p>
                )}
              </div>
            )}
          </div>
        );
      
      case 'common-challenges':
        // Handle both array format (Support Performance) and object format (Empower Team)
        if (Array.isArray(content)) {
          return (
            <div className="space-y-4">
              {content.map((challenge, idx) => (
                <div key={idx} className="border-l-4 border-orange-500/50 bg-orange-500/5 p-4 rounded">
                  <h4 className="executive-font text-lg font-semibold text-white mb-2">Challenge {idx + 1}: "{challenge.challenge}"</h4>
                  <div className="space-y-2 text-slate-300 text-sm">
                    <p><span className="font-semibold text-orange-400">Reality:</span> {challenge.reality}</p>
                    <p><span className="font-semibold text-emerald-400">Action:</span> {challenge.action}</p>
                  </div>
                </div>
              ))}
            </div>
          );
        } else if (typeof content === 'object' && content !== null) {
          // Object format (Empower Team)
          return (
            <div className="space-y-4">
              {Object.entries(content).map(([key, challenge], idx) => (
                <div key={key} className="border-l-4 border-orange-500/50 bg-orange-500/5 p-4 rounded">
                  <h4 className="executive-font text-lg font-semibold text-white mb-2">Challenge {idx + 1}: {challenge.problem || key.replace(/_/g, ' ')}</h4>
                  {challenge.symptoms && Array.isArray(challenge.symptoms) && (
                    <div className="mb-3">
                      <p className="text-sm font-semibold text-orange-400 mb-2">Symptoms:</p>
                      <ul className="list-disc list-inside space-y-1 text-slate-300 text-sm ml-4">
                        {challenge.symptoms.map((symptom, sIdx) => (
                          <li key={sIdx}>{symptom}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {challenge.solution && (
                    <div className="mt-3">
                      <p className="text-sm font-semibold text-emerald-400 mb-1">Solution:</p>
                      <p className="text-slate-300 text-sm">{challenge.solution}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        }
        return <p className="text-slate-300">No challenges data available.</p>;
      
      case 'connections-tasks':
        // Empower Team structure with navigation
        const taskColors = {
          'task_2_lead_team': { color: 'emerald', taskName: 'Lead a Team' },
          'task_3_support_performance': { color: 'blue', taskName: 'Support Team Performance' },
          'task_5_ensure_training': { color: 'purple', taskName: 'Ensure Training' },
          'task_7_address_impediments': { color: 'amber', taskName: 'Address Impediments' },
          'task_9_collaborate_stakeholders': { color: 'cyan', taskName: 'Collaborate with Stakeholders' },
          'task_1_manage_conflict': { color: 'rose', taskName: 'Manage Conflict' }
        };
        
        const navigateToRelatedTask = (taskId) => {
          // Map task IDs to task names
          const taskIdToName = {
            1: 'Manage Conflict',
            2: 'Lead a Team',
            3: 'Support Performance',
            5: 'Train Team',
            7: 'Address Obstacles',
            9: 'Collaborate Stakeholders'
          };
          const taskName = taskIdToName[taskId];
          if (taskName) {
            setRelatedTaskId(taskId);
            setReturnToSection('connections');
            setShowingRelatedTask(true);
            setSelectedTask(taskName);
            setView('learn-hub');
            setSubView('overview');
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        };
        
        const returnToConnections = () => {
          setShowingRelatedTask(false);
          setRelatedTaskId(null);
          setSelectedTask('Empower Team');
          setSubView('deep-dive');
          // Scroll to connections section
          setTimeout(() => {
            const connectionsSection = document.getElementById('connections-section');
            if (connectionsSection) {
              connectionsSection.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        };
        
        return (
          <div id="connections-section" className="space-y-6">
            <p className="text-gray-300">
              Empowerment connects directly to other People Domain tasks. Understanding these relationships 
              helps you apply empowerment principles holistically.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(content).map(([taskKey, taskData]) => {
                if (taskKey === 'agile_connection') {
                  return (
                    <div key={taskKey} className="md:col-span-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/20">
                      <h4 className="text-lg font-semibold text-white mb-3">ðŸ”„ {taskData.title || 'Agile Connection'}</h4>
                      <p className="text-gray-300">{taskData.description}</p>
                    </div>
                  );
                }
                
                const taskInfo = taskColors[taskKey] || { color: 'orange', taskName: taskData.task_name || taskKey.replace(/_/g, ' ') };
                const colorClass = taskInfo.color;
                const colorClasses = {
                  emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500/20', hover: 'hover:bg-emerald-500/30', border: 'hover:border-emerald-500/30' },
                  blue: { text: 'text-blue-400', bg: 'bg-blue-500/20', hover: 'hover:bg-blue-500/30', border: 'hover:border-blue-500/30' },
                  purple: { text: 'text-purple-400', bg: 'bg-purple-500/20', hover: 'hover:bg-purple-500/30', border: 'hover:border-purple-500/30' },
                  amber: { text: 'text-amber-400', bg: 'bg-amber-500/20', hover: 'hover:bg-amber-500/30', border: 'hover:border-amber-500/30' },
                  cyan: { text: 'text-cyan-400', bg: 'bg-cyan-500/20', hover: 'hover:bg-cyan-500/30', border: 'hover:border-cyan-500/30' },
                  rose: { text: 'text-rose-400', bg: 'bg-rose-500/20', hover: 'hover:bg-rose-500/30', border: 'hover:border-rose-500/30' },
                  orange: { text: 'text-orange-400', bg: 'bg-orange-500/20', hover: 'hover:bg-orange-500/30', border: 'hover:border-orange-500/30' }
                };
                const colors = colorClasses[colorClass] || colorClasses.orange;
                
                return (
                  <div key={taskKey} className={`bg-white/5 rounded-xl p-5 border border-white/10 ${colors.border} transition-colors`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`${colors.text} font-semibold`}>{taskData.task_name || taskInfo.taskName}</span>
                      {taskData.task_id && (
                        <button 
                          onClick={() => navigateToRelatedTask(taskData.task_id)}
                          className={`${colors.bg} ${colors.hover} ${colors.text} px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2`}
                        >
                          Learn More
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                )}
              </div>
                    <p className="text-gray-400 text-sm">
                      <span className="text-gray-300 font-medium">Connection:</span> {taskData.connection || taskData.summary}
                    </p>
                  </div>
                );
              })}
            </div>
            
            {/* Back Button - Show when viewing from another task */}
            {showingRelatedTask && (
              <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
                <button
                  onClick={returnToConnections}
                  className="bg-gray-800/90 backdrop-blur-sm hover:bg-gray-700/90 text-white px-6 py-3 rounded-full shadow-lg border border-white/10 flex items-center gap-3 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Back to Empower Team Connections</span>
                </button>
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
      case 'delegation-continuum':
        // Empower Team structure with 7 levels
        if (content.seven_levels && Array.isArray(content.seven_levels)) {
          const levelColors = [
            { bg: 'bg-red-500/20', border: 'border-red-500/30', text: 'text-red-400', badge: 'bg-red-500/30' },
            { bg: 'bg-orange-500/20', border: 'border-orange-500/30', text: 'text-orange-400', badge: 'bg-orange-500/30' },
            { bg: 'bg-amber-500/20', border: 'border-amber-500/30', text: 'text-amber-400', badge: 'bg-amber-500/30' },
            { bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', text: 'text-yellow-400', badge: 'bg-yellow-500/30' },
            { bg: 'bg-blue-500/20', border: 'border-blue-500/30', text: 'text-blue-400', badge: 'bg-blue-500/30' },
            { bg: 'bg-cyan-500/20', border: 'border-cyan-500/30', text: 'text-cyan-400', badge: 'bg-cyan-500/30' },
            { bg: 'bg-emerald-500/20', border: 'border-emerald-500/30', text: 'text-emerald-400', badge: 'bg-emerald-500/30' }
          ];
          
          return (
            <div className="space-y-6">
              {content.understanding && (
                <p className="text-gray-300">{content.understanding}</p>
              )}
              
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h4 className="text-lg font-semibold text-emerald-400 mb-4">{content.title || 'The Seven Levels of Delegation'}</h4>
                <div className="space-y-3">
                  {content.seven_levels.map((level, idx) => {
                    const colors = levelColors[idx];
                    return (
                      <div key={idx} className="group">
                        <div className={`flex items-center gap-4 ${colors.bg} rounded-lg p-4 border ${colors.border} transition-colors hover:opacity-80`}>
                          <div className={`${colors.badge} rounded-full w-10 h-10 flex items-center justify-center ${colors.text} font-bold text-lg`}>{level.level}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <span className={`${colors.text} font-semibold`}>{level.name?.toUpperCase()}</span>
                              <span className="text-gray-500">|</span>
                              <span className="text-gray-400 text-sm">{level.pm_does}</span>
                            </div>
                            <p className="text-gray-500 text-sm mt-1">Use for: {level.when_to_use}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Choosing the Right Level */}
              {content.choosing_right_level && (
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-amber-400 mb-4">Choosing the Right Level</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
                      <div className="text-red-400 font-semibold mb-2">â†“ Move DOWN (More PM Control)</div>
                      <ul className="text-gray-300 text-sm space-y-1">
                        {content.choosing_right_level.factors_move_down_scale && content.choosing_right_level.factors_move_down_scale.map((factor, idx) => (
                          <li key={idx}>• {factor}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-emerald-500/10 rounded-lg p-4 border border-emerald-500/20">
                      <div className="text-emerald-400 font-semibold mb-2">â†‘ Move UP (More Team Control)</div>
                      <ul className="text-gray-300 text-sm space-y-1">
                        {content.choosing_right_level.factors_move_up_scale && content.choosing_right_level.factors_move_up_scale.map((factor, idx) => (
                          <li key={idx}>• {factor}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Situational Leadership Connection */}
              {content.situational_leadership_connection && (
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-purple-400 mb-4">Situational Leadership Connection</h4>
                  <p className="text-gray-300 mb-4">
                    The Delegation Continuum aligns with Hersey & Blanchard's Situational Leadership:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {content.situational_leadership_connection.map((item, idx) => {
                      const slColors = [
                        { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400' },
                        { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400' },
                        { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400' },
                        { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' }
                      ];
                      const colors = slColors[idx % 4];
                      return (
                        <div key={idx} className={`${colors.bg} rounded-lg p-3 border ${colors.border}`}>
                          <div className={`${colors.text} font-semibold`}>{item.team_member_state}</div>
                          <p className="text-gray-400 text-sm">â†’ Use Levels {item.delegation_level} = {item.leadership_style} style</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        }
        
        // Fallback to generic renderer
      case 'self-organizing-teams':
      case 'key-takeaways':
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
      
      case 'introduction-enhanced':
        // Enhanced Introduction for Manage Conflict Deep Dive
        if (selectedTask === 'Manage Conflict' && typeof content === 'object' && content !== null && content.enhanced === true) {
          const intro = content;
          return (
            <div className="space-y-6 max-w-full overflow-hidden">
              {/* Hero Statement */}
              {intro.hero_statement && (
                <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl p-8 border border-purple-500/20 max-w-full overflow-hidden">
                  <div className="text-center max-w-full">
                    <div className="text-5xl mb-4">{intro.hero_statement.emoji}</div>
                    <h3 className="text-2xl font-bold text-white mb-4 break-words">{intro.hero_statement.title}</h3>
                    <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto break-words overflow-hidden">{safeRenderText(intro.hero_statement.text)}</p>
                  </div>
                </div>
              )}

              {/* Why This Matters */}
              {intro.why_matters && (
                <div className="bg-white/5 rounded-xl p-6 border border-white/10 max-w-full overflow-hidden">
                  <h4 className="text-lg font-semibold text-amber-400 mb-4 break-words">{intro.why_matters.title}</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-full">
                    {intro.why_matters.high_conflict_teams && (
                      <div>
                        <h5 className="text-emerald-400 font-semibold mb-3">{intro.why_matters.high_conflict_teams.title}</h5>
                        <ul className="text-gray-300 text-sm space-y-2">
                          {intro.why_matters.high_conflict_teams.items && intro.why_matters.high_conflict_teams.items.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-emerald-400">â†’</span>
                              <span className="break-words">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {intro.why_matters.low_conflict_teams && (
                      <div>
                        <h5 className="text-red-400 font-semibold mb-3">{intro.why_matters.low_conflict_teams.title}</h5>
                        <ul className="text-gray-300 text-sm space-y-2">
                          {intro.why_matters.low_conflict_teams.items && intro.why_matters.low_conflict_teams.items.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-red-400">â†’</span>
                              <span className="break-words">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* The PM's Role */}
              {intro.pm_role && (
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-cyan-400 mb-4">{intro.pm_role.title}</h4>
                  
                  <p className="text-gray-300 mb-4 break-words overflow-hidden">{safeRenderText(intro.pm_role.intro)}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {intro.pm_role.roles && intro.pm_role.roles.map((role, idx) => {
                      const getRoleColor = (color) => {
                        switch(color) {
                          case 'cyan': return { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-400' };
                          case 'purple': return { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400' };
                          case 'emerald': return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' };
                          default: return { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-400' };
                        }
                      };
                      const roleColors = getRoleColor(role.color);
                      return (
                        <div key={idx} className={`${roleColors.bg} rounded-lg p-4 border ${roleColors.border} text-center`}>
                          <div className="text-3xl mb-2">{role.emoji}</div>
                          <div className={`${roleColors.text} font-semibold`}>{role.title}</div>
                          <p className="text-gray-400 text-sm mt-2 break-words">{role.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* What You'll Master */}
              {intro.what_youll_master && (
                <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-xl p-6 border border-emerald-500/20">
                  <h4 className="text-lg font-semibold text-white mb-4">{intro.what_youll_master.title}</h4>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {intro.what_youll_master.topics && intro.what_youll_master.topics.map((topic, idx) => {
                      const getTopicColor = (color) => {
                        switch(color) {
                          case 'emerald': return 'text-emerald-400';
                          case 'blue': return 'text-blue-400';
                          case 'purple': return 'text-purple-400';
                          case 'amber': return 'text-amber-400';
                          case 'rose': return 'text-rose-400';
                          case 'cyan': return 'text-cyan-400';
                          default: return 'text-cyan-400';
                        }
                      };
                      return (
                        <div key={idx} className="bg-black/30 rounded-lg p-3 text-center">
                          <div className={`${getTopicColor(topic.color)} font-semibold text-sm`}>{topic.title}</div>
                          <div className="text-gray-500 text-xs">{topic.subtitle}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        }
        // Fallback
        return <p className="text-slate-300">{typeof content === 'string' ? content : JSON.stringify(content)}</p>;

      case 'thomas-kilmann-enhanced':
        // Enhanced Thomas-Kilmann Deep Dive for Manage Conflict
        if (selectedTask === 'Manage Conflict' && typeof content === 'object' && content !== null && content.enhanced === true) {
          const tk = content;
          return (
            <div className="space-y-6">
              {/* Framework Overview */}
              {tk.framework_overview && (
                <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl">{tk.framework_overview.emoji}</div>
                    <div>
                      <h4 className="text-xl font-bold text-white">{tk.framework_overview.title}</h4>
                      <p className="text-gray-400 text-sm">{tk.framework_overview.subtitle}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-4 break-words overflow-hidden">{safeRenderText(tk.framework_overview.description)}</p>
                </div>
              )}

              {/* Deep Dive into Each Mode */}
              {tk.modes && Array.isArray(tk.modes) && (
                <div className="space-y-4">
                  {tk.modes.map((mode, idx) => {
                    const getModeColor = (color) => {
                      switch(color) {
                        case 'emerald': return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', badge: 'bg-emerald-500/30' };
                        case 'amber': return { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', badge: 'bg-amber-500/30' };
                        case 'blue': return { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', badge: 'bg-blue-500/30' };
                        case 'red': return { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', badge: 'bg-red-500/30' };
                        case 'gray': return { bg: 'bg-gray-500/10', border: 'border-gray-500/20', text: 'text-gray-400', badge: 'bg-gray-500/30' };
                        default: return { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-400', badge: 'bg-cyan-500/30' };
                      }
                    };
                    const modeColors = getModeColor(mode.color);
                    return (
                      <div key={idx} className={`${modeColors.bg} rounded-xl p-6 border ${modeColors.border}`}>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="text-3xl">{mode.emoji}</div>
                            <div>
                              <h5 className={`text-xl font-bold ${modeColors.text}`}>{mode.mode}</h5>
                              <p className={`${modeColors.text}/60 text-sm`}>{mode.description}</p>
                            </div>
                          </div>
                          {mode.badge && (
                            <span className={`${modeColors.badge} ${modeColors.text} px-3 py-1 rounded-full text-sm font-semibold`}>{mode.badge}</span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-black/30 rounded-lg p-4">
                            <div className="text-white font-semibold mb-2">When to Use</div>
                            <ul className="text-gray-400 text-sm space-y-1 break-words">
                              {mode.when_to_use && mode.when_to_use.map((item, iIdx) => (
                                <li key={iIdx} className="break-words">• {item}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-black/30 rounded-lg p-4">
                            <div className="text-white font-semibold mb-2">What It Sounds Like</div>
                            <ul className="text-gray-400 text-sm space-y-1 italic break-words">
                              {mode.what_it_sounds_like && mode.what_it_sounds_like.map((item, iIdx) => (
                                <li key={iIdx} className="break-words">{item}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-black/30 rounded-lg p-4">
                            <div className="text-white font-semibold mb-2">Watch Out For</div>
                            <ul className="text-gray-400 text-sm space-y-1 break-words">
                              {mode.watch_out_for && mode.watch_out_for.map((item, iIdx) => (
                                <li key={iIdx} className="break-words">• {item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Selection Guide */}
              {tk.selection_rule && (
                <div className="bg-black/40 rounded-xl p-5 border-l-4 border-blue-500">
                  <p className="text-gray-200 break-words overflow-hidden">{safeRenderText(tk.selection_rule)}</p>
                </div>
              )}
            </div>
          );
        }
        return <p className="text-slate-300">{typeof content === 'string' ? content : JSON.stringify(content)}</p>;

      case 'emotional-intelligence-enhanced':
        // Enhanced Emotional Intelligence for Manage Conflict Deep Dive
        if (selectedTask === 'Manage Conflict' && typeof content === 'object' && content !== null && content.enhanced === true) {
          const ei = content;
          return (
            <div className="space-y-6 max-w-full overflow-hidden">
              {/* EI Framework */}
              {ei.framework && (
                <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-xl p-6 border border-pink-500/20 max-w-full overflow-hidden">
                  <div className="flex items-center gap-3 mb-4 max-w-full">
                    <div className="text-3xl flex-shrink-0">{ei.framework.emoji}</div>
                    <div className="min-w-0 flex-1 overflow-hidden">
                      <h4 className="text-xl font-bold text-white break-words">{ei.framework.title}</h4>
                      <p className="text-gray-400 text-sm break-words overflow-hidden">{ei.framework.subtitle}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-6 break-words overflow-hidden">{ei.framework.intro}</p>

                  {/* Four Quadrants */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-full">
                    {ei.quadrants && ei.quadrants.map((quadrant, idx) => {
                      const getQuadColor = (color) => {
                        switch(color) {
                          case 'purple': return { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400', badge: 'bg-purple-500/30' };
                          case 'blue': return { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', badge: 'bg-blue-500/30' };
                          case 'emerald': return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', badge: 'bg-emerald-500/30' };
                          case 'amber': return { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', badge: 'bg-amber-500/30' };
                          default: return { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-400', badge: 'bg-cyan-500/30' };
                        }
                      };
                      const quadColors = getQuadColor(quadrant.color);
                      return (
                        <div key={idx} className={`${quadColors.bg} rounded-xl p-5 border ${quadColors.border}`}>
                          <div className="flex items-center gap-2 mb-3">
                            <span className={`${quadColors.badge} ${quadColors.text} px-2 py-1 rounded text-xs font-bold`}>{quadrant.category}</span>
                            <span className={`${quadColors.text} font-semibold`}>{quadrant.title}</span>
                          </div>
                          <p className="text-gray-400 text-sm mb-3 break-words">{quadrant.description}</p>
                          {quadrant.in_conflict && (
                            <div className="bg-black/30 rounded-lg p-3">
                              <p className="text-gray-300 text-sm font-medium mb-2">{quadrant.in_conflict.title}</p>
                              <ul className="text-gray-400 text-xs space-y-1 break-words">
                                {quadrant.in_conflict.items && quadrant.in_conflict.items.map((item, iIdx) => (
                                  <li key={iIdx} className="break-words">• {item}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Emotional Triggers */}
              {ei.emotional_triggers && (
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-red-400 mb-4">{ei.emotional_triggers.title}</h4>
                  
                  <p className="text-gray-300 mb-4 break-words overflow-hidden">{ei.emotional_triggers.intro}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {ei.emotional_triggers.triggers && ei.emotional_triggers.triggers.map((trigger, idx) => (
                      <div key={idx} className="bg-red-500/10 rounded-lg p-3 border border-red-500/20 text-center">
                        <div className="text-xl mb-1">{trigger.emoji}</div>
                        <div className="text-red-400 text-sm font-semibold break-words">{trigger.title}</div>
                        <div className="text-gray-500 text-xs break-words">{trigger.example}</div>
                      </div>
                    ))}
                  </div>

                  {ei.emotional_triggers.when_triggered && (
                    <div className="bg-emerald-500/10 rounded-lg p-4 mt-4 border border-emerald-500/20">
                      <p className="text-emerald-400 font-semibold mb-2">When Triggered:</p>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm">
                        {ei.emotional_triggers.when_triggered.steps && ei.emotional_triggers.when_triggered.steps.map((step, idx) => (
                          <div key={idx} className="text-center">
                            <div className="text-2xl mb-1">{step.number}</div>
                            <div className="text-gray-300">{step.action}</div>
                            <div className="text-gray-500 text-xs">{step.detail}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* De-escalation Techniques */}
              {ei.deescalation_techniques && (
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-cyan-400 mb-4">{ei.deescalation_techniques.title}</h4>
                  
                  <div className="space-y-4">
                    {ei.deescalation_techniques.techniques && ei.deescalation_techniques.techniques.map((technique, idx) => (
                      <div key={idx} className="bg-cyan-500/10 rounded-lg p-4 border border-cyan-500/20">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-cyan-400 text-xl">{technique.emoji}</span>
                          <span className="text-white font-semibold">{technique.title}</span>
                        </div>
                        <p className="text-gray-400 text-sm break-words">{technique.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pro Tip */}
              {ei.pro_tip && (
                <div className="bg-black/40 rounded-xl p-5 border-l-4 border-pink-500">
                  <p className="text-gray-200 break-words overflow-hidden">{safeRenderText(ei.pro_tip)}</p>
                </div>
              )}
            </div>
          );
        }
        return <p className="text-slate-300">{typeof content === 'string' ? content : JSON.stringify(content)}</p>;

      case 'difficult-conversations-enhanced':
        // Enhanced Difficult Conversation Techniques for Manage Conflict Deep Dive
        if (selectedTask === 'Manage Conflict' && typeof content === 'object' && content !== null && content.enhanced === true) {
          const dc = content;
          return (
            <div className="space-y-6">
              {/* The COIN Model */}
              {dc.coin_model && (
                <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl p-6 border border-amber-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl">{dc.coin_model.emoji}</div>
                    <div>
                      <h4 className="text-xl font-bold text-white">{dc.coin_model.title}</h4>
                      <p className="text-gray-400 text-sm">{dc.coin_model.subtitle}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {dc.coin_model.steps && dc.coin_model.steps.map((step, idx) => {
                      const getCoinColor = (color) => {
                        switch(color) {
                          case 'amber': return { bg: 'bg-amber-500/10', text: 'text-amber-400', big: 'text-amber-400' };
                          case 'orange': return { bg: 'bg-orange-500/10', text: 'text-orange-400', big: 'text-orange-400' };
                          case 'red': return { bg: 'bg-red-500/10', text: 'text-red-400', big: 'text-red-400' };
                          case 'emerald': return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', big: 'text-emerald-400' };
                          default: return { bg: 'bg-cyan-500/10', text: 'text-cyan-400', big: 'text-cyan-400' };
                        }
                      };
                      const coinColors = getCoinColor(step.color);
                      return (
                        <div key={idx} className="bg-black/30 rounded-xl p-5 text-center">
                          <div className={`text-4xl font-bold ${coinColors.big} mb-2`}>{step.letter}</div>
                          <div className="text-white font-semibold mb-2">{step.title}</div>
                          <p className="text-gray-400 text-sm">{step.description}</p>
                          <div className={`mt-3 ${coinColors.bg} rounded-lg p-2`}>
                            <p className={`${coinColors.text} text-xs italic break-words`}>{step.example}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* The DESC Script */}
              {dc.desc_script && (
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-purple-400 mb-4">{dc.desc_script.title}</h4>
                  
                  <div className="space-y-4">
                    {dc.desc_script.steps && dc.desc_script.steps.map((step, idx) => {
                      const getDescColor = (color) => {
                        switch(color) {
                          case 'purple': return { bg: 'bg-purple-500/20', text: 'text-purple-400' };
                          case 'blue': return { bg: 'bg-blue-500/20', text: 'text-blue-400' };
                          case 'emerald': return { bg: 'bg-emerald-500/20', text: 'text-emerald-400' };
                          case 'amber': return { bg: 'bg-amber-500/20', text: 'text-amber-400' };
                          default: return { bg: 'bg-cyan-500/20', text: 'text-cyan-400' };
                        }
                      };
                      const descColors = getDescColor(step.color);
                      return (
                        <div key={idx} className="flex items-start gap-4">
                          <div className={`${descColors.bg} rounded-full w-12 h-12 flex items-center justify-center ${descColors.text} font-bold text-xl shrink-0`}>
                            {step.letter}
                          </div>
                          <div>
                            <div className="text-white font-semibold">{step.title}</div>
                            <p className="text-gray-400 text-sm break-words">{step.description}</p>
                            <p className={`${descColors.text} text-sm italic mt-1 break-words`}>{step.example}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Powerful Questions */}
              {dc.powerful_questions && (
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-cyan-400 mb-4">{dc.powerful_questions.title}</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dc.powerful_questions.categories && dc.powerful_questions.categories.map((category, idx) => {
                      const getCatColor = (color) => {
                        switch(color) {
                          case 'cyan': return { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-400' };
                          case 'emerald': return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' };
                          case 'purple': return { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400' };
                          case 'amber': return { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400' };
                          default: return { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-400' };
                        }
                      };
                      const catColors = getCatColor(category.color);
                      return (
                        <div key={idx} className={`${catColors.bg} rounded-lg p-4 border ${catColors.border}`}>
                          <div className={`${catColors.text} font-semibold mb-3`}>{category.title}</div>
                          <ul className="text-gray-300 text-sm space-y-2 break-words">
                            {category.questions && category.questions.map((q, qIdx) => (
                              <li key={qIdx} className="break-words">{q}</li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Pro Tip */}
              {dc.pro_tip && (
                <div className="bg-black/40 rounded-xl p-5 border-l-4 border-amber-500">
                  <p className="text-gray-200 break-words overflow-hidden">{safeRenderText(dc.pro_tip)}</p>
                </div>
              )}
            </div>
          );
        }
        return <p className="text-slate-300">{typeof content === 'string' ? content : JSON.stringify(content)}</p>;

      case 'common-challenges-enhanced':
        // Enhanced Common Challenges for Manage Conflict Deep Dive
        if (selectedTask === 'Manage Conflict' && typeof content === 'object' && content !== null && content.enhanced === true) {
          const cc = content;
          return (
            <div className="space-y-6">
              {cc.intro && (
                <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-xl p-5 border border-red-500/20">
                  <p className="text-gray-200 break-words overflow-hidden">{safeRenderText(cc.intro)}</p>
                </div>
              )}

              {/* Challenge Cards */}
              {cc.challenges && Array.isArray(cc.challenges) && (
                <div className="space-y-4">
                  {cc.challenges.map((challenge, idx) => {
                    const getChallengeColor = (color) => {
                      switch(color) {
                        case 'red': return { bg: 'bg-red-500/10', border: 'border-white/10' };
                        case 'orange': return { bg: 'bg-orange-500/10', border: 'border-white/10' };
                        case 'purple': return { bg: 'bg-purple-500/10', border: 'border-white/10' };
                        case 'cyan': return { bg: 'bg-cyan-500/10', border: 'border-white/10' };
                        case 'amber': return { bg: 'bg-amber-500/10', border: 'border-white/10' };
                        default: return { bg: 'bg-red-500/10', border: 'border-white/10' };
                      }
                    };
                    const challengeColors = getChallengeColor(challenge.color);
                    return (
                      <div key={idx} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                        <div className={`${challengeColors.bg} px-5 py-3 border-b border-white/10`}>
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{challenge.emoji}</span>
                            <span className="text-white font-semibold">{challenge.title}</span>
                          </div>
                        </div>
                        <div className="p-5">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-red-500/10 rounded-lg p-3">
                              <div className="text-red-400 font-semibold text-sm mb-2">Signs</div>
                              <ul className="text-gray-400 text-xs space-y-1 break-words">
                                {challenge.signs && challenge.signs.map((sign, sIdx) => (
                                  <li key={sIdx} className="break-words">• {sign}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="bg-blue-500/10 rounded-lg p-3">
                              <div className="text-blue-400 font-semibold text-sm mb-2">Why It Happens</div>
                              <ul className="text-gray-400 text-xs space-y-1 break-words">
                                {challenge.why && challenge.why.map((reason, rIdx) => (
                                  <li key={rIdx} className="break-words">• {reason}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="bg-emerald-500/10 rounded-lg p-3">
                              <div className="text-emerald-400 font-semibold text-sm mb-2">What to Do</div>
                              <ul className="text-gray-400 text-xs space-y-1 break-words">
                                {challenge.what_to_do && challenge.what_to_do.map((action, aIdx) => (
                                  <li key={aIdx} className="break-words">• {action}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* When to Escalate */}
              {cc.when_to_escalate && (
                <div className="bg-gradient-to-br from-red-500/10 to-purple-500/10 rounded-xl p-6 border border-red-500/20">
                  <h4 className="text-lg font-semibold text-red-400 mb-4">{cc.when_to_escalate.title}</h4>
                  
                  <p className="text-gray-300 mb-4 break-words overflow-hidden">{cc.when_to_escalate.intro}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {cc.when_to_escalate.criteria && cc.when_to_escalate.criteria.map((criterion, idx) => (
                      <div key={idx} className="bg-black/30 rounded-lg p-3 text-center">
                        <div className="text-xl mb-1">{criterion.emoji}</div>
                        <div className="text-gray-300 text-sm break-words">{criterion.text}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        }
        return <p className="text-slate-300">{typeof content === 'string' ? content : JSON.stringify(content)}</p>;

      case 'connections-tasks-enhanced':
        // Enhanced Connections to Other Tasks for Manage Conflict Deep Dive
        if (selectedTask === 'Manage Conflict' && typeof content === 'object' && content !== null && content.enhanced === true) {
          const conn = content;
          return (
            <div className="space-y-6">
              {conn.intro && (
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-5 border border-blue-500/20">
                  <p className="text-gray-200 break-words overflow-hidden">{safeRenderText(conn.intro)}</p>
                </div>
              )}

              {/* Connection Cards */}
              {conn.connections && Array.isArray(conn.connections) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {conn.connections.map((connection, idx) => {
                    const getConnColor = (color) => {
                      switch(color) {
                        case 'emerald': return { border: 'border-emerald-500/30', bg: 'bg-emerald-500/20', text: 'text-emerald-400', hover: 'hover:bg-emerald-500/30' };
                        case 'blue': return { border: 'border-blue-500/30', bg: 'bg-blue-500/20', text: 'text-blue-400', hover: 'hover:bg-blue-500/30' };
                        case 'purple': return { border: 'border-purple-500/30', bg: 'bg-purple-500/20', text: 'text-purple-400', hover: 'hover:bg-purple-500/30' };
                        case 'amber': return { border: 'border-amber-500/30', bg: 'bg-amber-500/20', text: 'text-amber-400', hover: 'hover:bg-amber-500/30' };
                        case 'cyan': return { border: 'border-cyan-500/30', bg: 'bg-cyan-500/20', text: 'text-cyan-400', hover: 'hover:bg-cyan-500/30' };
                        case 'rose': return { border: 'border-rose-500/30', bg: 'bg-rose-500/20', text: 'text-rose-400', hover: 'hover:bg-rose-500/30' };
                        default: return { border: 'border-cyan-500/30', bg: 'bg-cyan-500/20', text: 'text-cyan-400', hover: 'hover:bg-cyan-500/30' };
                      }
                    };
                    const connColors = getConnColor(connection.color);
                    return (
                      <div key={idx} className={`bg-white/5 rounded-xl p-5 border border-white/10 hover:${connColors.border.replace('/30', '/30')} transition-colors`}>
                        <div className="flex items-center justify-between mb-3">
                          <span className={`${connColors.text} font-semibold`}>{connection.task}</span>
                          <button 
                            onClick={() => {
                              const taskMap = {
                                'Task 2: Lead a Team': 'Lead a Team',
                                'Task 3: Support Team Performance': 'Support Performance',
                                'Task 4: Empower Team Members': 'Empower Team',
                                'Task 8: Negotiate Agreements': 'Negotiate Project Agreements',
                                'Task 9: Collaborate with Stakeholders': 'Collaborate with Stakeholders',
                                'Task 12: Define Team Ground Rules': 'Define Team Ground Rules'
                              };
                              const taskName = taskMap[connection.task] || connection.task;
                              setSelectedTask(taskName);
                              setSubView('learn');
                              setView('learn-hub');
                            }}
                            className={`${connColors.bg} ${connColors.hover} ${connColors.text} px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2`}
                          >
                            Learn More â†’
                          </button>
                        </div>
                        <p className="text-gray-400 text-sm break-words">
                          <span className="text-gray-300 font-medium">Connection:</span> {connection.connection}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Agile Connection */}
              {conn.agile_connection && (
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/20">
                  <h4 className="text-lg font-semibold text-white mb-3">{conn.agile_connection.title}</h4>
                  <p className="text-gray-300 break-words overflow-hidden">{safeRenderText(conn.agile_connection.text)}</p>
                </div>
              )}
            </div>
          );
        }
        return <p className="text-slate-300">{typeof content === 'string' ? content : JSON.stringify(content)}</p>;

      case 'key-takeaways-enhanced':
        // Enhanced Key Takeaways for Manage Conflict Deep Dive
        if (selectedTask === 'Manage Conflict' && typeof content === 'object' && content !== null && content.enhanced === true) {
          const kt = content;
          return (
            <div className="space-y-6">
              {/* The 10 Commandments */}
              {kt.ten_commandments && (
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20">
                  <h4 className="text-xl font-bold text-white mb-6 text-center">{kt.ten_commandments.title}</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {kt.ten_commandments.commandments && kt.ten_commandments.commandments.map((cmd, idx) => (
                      <div key={idx} className="flex items-start gap-3 bg-black/30 rounded-lg p-3">
                        <span className="bg-purple-500/30 text-purple-400 font-bold px-2 py-1 rounded text-sm">{cmd.number}</span>
                        <span className="text-gray-300 break-words">{safeRenderText(cmd.text)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Memory Cards */}
              {kt.quick_memory_cards && (
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-cyan-400 mb-4">{kt.quick_memory_cards.title}</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {kt.quick_memory_cards.cards && kt.quick_memory_cards.cards.map((card, idx) => {
                      const getCardColor = (color) => {
                        switch(color) {
                          case 'cyan': return { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-400' };
                          case 'amber': return { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400' };
                          case 'red': return { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400' };
                          default: return { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-400' };
                        }
                      };
                      const cardColors = getCardColor(card.color);
                      return (
                        <div key={idx} className={`${cardColors.bg} rounded-lg p-4 border ${cardColors.border} text-center`}>
                          <div className="text-sm text-gray-400 mb-2">{card.label}</div>
                          <div className={`text-2xl font-bold ${cardColors.text}`}>{card.answer}</div>
                          <div className="text-gray-500 text-xs mt-2 break-words">{card.detail}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Ultimate Memory Hook */}
              {kt.ultimate_memory_hook && (
                <div className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-xl p-6 border border-emerald-500/30">
                  <h4 className="text-lg font-semibold text-white mb-4 text-center">{kt.ultimate_memory_hook.title}</h4>
                  <div className="text-center">
                    <p className="text-2xl font-light mb-4 break-words overflow-hidden">{safeRenderText(kt.ultimate_memory_hook.quote)}</p>
                    <p className="text-gray-400 break-words overflow-hidden">{kt.ultimate_memory_hook.subtitle}</p>
                  </div>
                </div>
              )}

              {/* Bottom Line */}
              {kt.bottom_line && (
                <div className="bg-black/40 rounded-xl p-6 border-l-4 border-emerald-500">
                  <p className="text-gray-200 text-lg break-words overflow-hidden">{safeRenderText(kt.bottom_line)}</p>
                </div>
              )}
            </div>
          );
        }
        return <p className="text-slate-300">{typeof content === 'string' ? content : JSON.stringify(content)}</p>;
      
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
    
    const subViewTitles = {
      'overview': 'Overview',
      'pmp-application': 'PMP Application',
      'deep-dive': 'Deep Dive'
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
        <PageWrapper 
          title={`Learn: ${selectedTask}`}
          subtitle={subViewTitles[subView] || 'Learning Content'}
          showBackButton={true}
          backAction={() => setView('task-interstitial')}
        >
          <div className={`animate-fadeIn text-left view-transition-wrapper ${viewTransition.isTransitioning ? 'view-transition-exit' : 'view-transition-enter'}`}>
            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 mb-6">
              <button
                onClick={(e) => {
                  createRipple(e);
                  handleViewChange('practice-hub');
                }}
                className="px-6 py-2 executive-font text-sm font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 btn-ripple"
              >
                Go Practice â†’
              </button>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex gap-8 border-b border-white/10 mb-6">
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
                        <p className="text-xs text-white/90 mt-1">Click to view â†’</p>
                      )}
                      {expanded && (
                        <p className="text-xs text-white font-semibold mt-1"> Active</p>
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
                          Ã—
                        </button>
                      </div>
                      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                        {expandedSection.domain && (
                          <p className="text-emerald-400 text-sm font-semibold mb-4">Domain: {expandedSection.domain}</p>
                        )}
                        <ErrorBoundary fallbackMessage={`Error rendering ${expandedSection.title}`}>
                          <SectionContentRenderer section={expandedSection} />
                        </ErrorBoundary>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
          <GlobalNavFooter />
          </div>
        </PageWrapper>
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

export default PMPApp;
