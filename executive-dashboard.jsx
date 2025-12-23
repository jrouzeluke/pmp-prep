import React, { useState, useEffect } from 'react';

const ExecutiveDashboard = () => {
  const [animated, setAnimated] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const [expandedDomain, setExpandedDomain] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hoveredTask, setHoveredTask] = useState(null);
  const [counters, setCounters] = useState({ tasks: 0, activities: 0, mastered: 0, health: 0 });
  const [breathe, setBreathe] = useState(0);

  // Stats data
  const stats = {
    tasksStarted: 12,
    totalTasks: 35,
    activitiesCompleted: 47,
    totalActivities: 210,
    tasksMastered: 3,
    portfolioHealth: 78,
    timeInvested: { hours: 12, minutes: 34 },
    studyStreak: 7,
    lastActive: new Date('2024-12-22'),
    strongest: { name: 'Lightning Round', score: 92 },
    needsPractice: { name: 'Document Detective', score: 78, attemptsNeeded: 2 },
  };

  const activityTypes = [
    { name: 'PM Simulator', score: 87, attempts: 12, color: '#ff6b35' },
    { name: 'Lightning Round', score: 92, attempts: 8, color: '#00d4ff' },
    { name: 'Document Detective', score: 78, attempts: 5, color: '#bf5af2' },
    { name: 'Conflict Matcher', score: 85, attempts: 9, color: '#ff6b35' },
    { name: 'Timeline Reconstructor', score: 0, attempts: 0, color: '#00d4ff' },
    { name: 'Empathy Exercise', score: 91, attempts: 6, color: '#bf5af2' },
  ];

  const domains = [
    {
      id: 'people',
      name: 'People',
      description: 'Leadership & Stakeholder Management',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      ),
      accent: '#ff6b35',
      accentRgb: '255, 107, 53',
      tasks: [
        { id: '01', name: 'Manage Conflict', progress: 100 },
        { id: '02', name: 'Lead a Team', progress: 85 },
        { id: '03', name: 'Support Team Performance', progress: 70 },
        { id: '04', name: 'Empower Team Members', progress: 45 },
        { id: '05', name: 'Ensure Team Training', progress: 30 },
        { id: '06', name: 'Build a Team', progress: 20 },
        { id: '07', name: 'Address Impediments', progress: 10 },
        { id: '08', name: 'Negotiate Project Agreements', progress: 0 },
        { id: '09', name: 'Collaborate with Stakeholders', progress: 0 },
        { id: '10', name: 'Build Shared Understanding', progress: 0 },
        { id: '11', name: 'Engage Stakeholders', progress: 0 },
        { id: '12', name: 'Mentor Stakeholders', progress: 0 },
        { id: '13', name: 'Apply Emotional Intelligence', progress: 0 },
        { id: '14', name: 'Manage Communications', progress: 0 },
      ]
    },
    {
      id: 'process',
      name: 'Process',
      description: 'Planning, Execution & Delivery',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
        </svg>
      ),
      accent: '#00d4ff',
      accentRgb: '0, 212, 255',
      tasks: [
        { id: '01', name: 'Execute Project Work', progress: 60 },
        { id: '02', name: 'Plan & Manage Schedule', progress: 55 },
        { id: '03', name: 'Plan & Manage Budget', progress: 40 },
        { id: '04', name: 'Plan & Manage Quality', progress: 35 },
        { id: '05', name: 'Plan & Manage Scope', progress: 25 },
        { id: '06', name: 'Integrate Project Planning', progress: 15 },
        { id: '07', name: 'Manage Project Changes', progress: 10 },
        { id: '08', name: 'Plan & Manage Procurement', progress: 0 },
        { id: '09', name: 'Manage Project Artifacts', progress: 0 },
        { id: '10', name: 'Determine Methodology', progress: 0 },
        { id: '11', name: 'Establish Governance', progress: 0 },
        { id: '12', name: 'Manage Project Issues', progress: 0 },
        { id: '13', name: 'Ensure Knowledge Transfer', progress: 0 },
        { id: '14', name: 'Plan & Manage Closeout', progress: 0 },
        { id: '15', name: 'Manage Resources', progress: 0 },
        { id: '16', name: 'Plan & Manage Risk', progress: 0 },
        { id: '17', name: 'Deliver Project Value', progress: 0 },
      ]
    },
    {
      id: 'business',
      name: 'Business Environment',
      description: 'Compliance, Benefits & Change',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
        </svg>
      ),
      accent: '#bf5af2',
      accentRgb: '191, 90, 242',
      tasks: [
        { id: '01', name: 'Plan & Manage Compliance', progress: 50 },
        { id: '02', name: 'Evaluate & Deliver Benefits', progress: 25 },
        { id: '03', name: 'Support Organizational Change', progress: 0 },
        { id: '04', name: 'Manage External Environment', progress: 0 },
      ]
    }
  ];

  const completeColor = '#00ff88';

  // Breathing effect for ambient glow
  useEffect(() => {
    const interval = setInterval(() => {
      setBreathe(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Animated counters
  useEffect(() => {
    if (animated) {
      const duration = 2000;
      const steps = 60;
      const interval = duration / steps;
      let step = 0;
      
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        const eased = 1 - Math.pow(1 - progress, 4);
        
        setCounters({
          tasks: Math.round(stats.tasksStarted * eased),
          activities: Math.round(stats.activitiesCompleted * eased),
          mastered: Math.round(stats.tasksMastered * eased),
          health: Math.round(stats.portfolioHealth * eased),
        });
        
        if (step >= steps) clearInterval(timer);
      }, interval);
      
      return () => clearInterval(timer);
    }
  }, [animated]);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 300);
    const clockInterval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => { clearTimeout(timer); clearInterval(clockInterval); };
  }, []);

  const getDomainProgress = (tasks) => Math.round(tasks.reduce((a, t) => a + t.progress, 0) / tasks.length);
  const getCompleted = (tasks) => tasks.filter(t => t.progress === 100).length;
  const getActive = (tasks) => tasks.filter(t => t.progress > 0 && t.progress < 100).length;

  const totalTasks = domains.reduce((a, d) => a + d.tasks.length, 0);
  const totalComplete = domains.reduce((a, d) => a + getCompleted(d.tasks), 0);
  const totalActive = domains.reduce((a, d) => a + getActive(d.tasks), 0);
  const overallProgress = Math.round(domains.reduce((a, d) => a + getDomainProgress(d.tasks), 0) / domains.length);

  const avgScore = Math.round(activityTypes.filter(a => a.attempts > 0).reduce((a, b) => a + b.score, 0) / activityTypes.filter(a => a.attempts > 0).length) || 0;

  const getTaskStatus = (progress) => {
    if (progress === 100) return 'complete';
    if (progress > 0) return 'active';
    return 'standby';
  };

  const breatheOpacity = (0.08 + Math.sin(breathe * Math.PI / 180) * 0.04);

  // Radial Progress with glow
  const RadialProgress = ({ progress, size = 140, color = '#00d4ff', label = 'Progress' }) => {
    const strokeWidth = 8;
    const radius = (size - strokeWidth * 2) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;
    
    return (
      <div className="relative flex flex-col items-center" style={{ width: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <defs>
            <linearGradient id={`gradient-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor={color + '60'} />
            </linearGradient>
          </defs>
          {/* Track */}
          <circle
            cx={size/2} cy={size/2} r={radius}
            fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth}
          />
          {/* Progress */}
          <circle
            cx={size/2} cy={size/2} r={radius}
            fill="none" stroke={`url(#gradient-${label})`} strokeWidth={strokeWidth}
            strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
            style={{ filter: `drop-shadow(0 0 10px ${color}80)` }}
          />
          {/* Inner glow ring */}
          <circle
            cx={size/2} cy={size/2} r={radius - 15}
            fill="none" stroke={color} strokeWidth="1" opacity="0.2"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-white">{progress}</span>
          <span className="text-xs text-white/40 uppercase tracking-widest mt-1">{label}</span>
        </div>
      </div>
    );
  };

  // Three-ring progress
  const TripleRing = ({ values, size = 140 }) => {
    const rings = [
      { value: values[0], color: '#ff6b35', radius: 58, width: 6 },
      { value: values[1], color: '#00d4ff', radius: 46, width: 6 },
      { value: values[2], color: '#bf5af2', radius: 34, width: 6 },
    ];
    
    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {rings.map((ring, i) => {
            const circumference = ring.radius * 2 * Math.PI;
            const offset = circumference - (ring.value / 100) * circumference;
            return (
              <g key={i}>
                <circle cx={size/2} cy={size/2} r={ring.radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={ring.width} />
                <circle cx={size/2} cy={size/2} r={ring.radius} fill="none" stroke={ring.color} strokeWidth={ring.width}
                  strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
                  className="transition-all duration-1000 ease-out"
                  style={{ filter: `drop-shadow(0 0 6px ${ring.color}80)` }}
                />
              </g>
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white">{overallProgress}%</span>
          <span className="text-xs text-white/40">Overall</span>
        </div>
      </div>
    );
  };

  // Segmented progress for cards
  const SegmentedProgress = ({ progress, color, size = 52 }) => {
    const segments = 16;
    const activeSegments = Math.round((progress / 100) * segments);
    const radius = (size - 8) / 2;
    
    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          {Array.from({ length: segments }).map((_, i) => {
            const angle = (i / segments) * 360;
            const isActive = i < activeSegments;
            const segmentAngle = (360 / segments) - 6;
            const circumference = 2 * Math.PI * radius;
            return (
              <circle key={i} cx={size/2} cy={size/2} r={radius} fill="none"
                stroke={isActive ? color : 'rgba(255,255,255,0.08)'} strokeWidth="4"
                strokeDasharray={`${(segmentAngle / 360) * circumference} ${circumference}`}
                strokeDashoffset={-((angle / 360) * circumference)} strokeLinecap="butt"
                style={{ filter: isActive ? `drop-shadow(0 0 3px ${color})` : 'none', transition: 'all 0.3s ease' }}/>
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-white">{progress}%</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Subtle breathing ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[200px] transition-opacity duration-1000"
          style={{ background: '#ff6b35', opacity: breatheOpacity * 0.6 }}
        />
        <div 
          className="absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full blur-[200px] transition-opacity duration-1000"
          style={{ background: '#00d4ff', opacity: breatheOpacity * 0.5 }}
        />
        <div 
          className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] rounded-full blur-[200px] transition-opacity duration-1000"
          style={{ background: '#bf5af2', opacity: breatheOpacity * 0.5 }}
        />
      </div>

      {/* Vignette */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.5) 100%)' }} />

      <div className="relative z-10 min-h-screen flex flex-col">
        
        {/* Header */}
        <header className="flex-shrink-0 border-b border-white/[0.06] bg-black/40 backdrop-blur-xl">
          <div className="px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                {/* Logo with gradient border */}
                <div className="relative group">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#ff6b35] via-[#00d4ff] to-[#bf5af2] opacity-60 blur-sm group-hover:opacity-80 transition-opacity" />
                  <div className="relative w-11 h-11 rounded-xl bg-black flex items-center justify-center border border-white/10">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5"/>
                    </svg>
                  </div>
                </div>
                
                <div>
                  <h1 className="text-xl font-semibold tracking-tight text-white">Task Mastery Overview</h1>
                  <p className="text-xs text-white/30 tracking-wider uppercase mt-0.5">PMP Certification Training</p>
                </div>
              </div>

              <div className="flex items-center gap-5">
                {/* Status badge */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]">
                  <div className="relative">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping opacity-60" />
                  </div>
                  <span className="text-xs text-white/40">Live</span>
                </div>

                {/* Time */}
                <div className="text-right">
                  <div className="text-lg font-semibold text-white tabular-nums tracking-tight">
                    {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                  </div>
                  <div className="text-xs text-white/30">{currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                </div>

                {/* Triple ring progress */}
                <TripleRing values={[
                  Math.round((stats.tasksStarted / stats.totalTasks) * 100),
                  Math.round((stats.activitiesCompleted / stats.totalActivities) * 100),
                  avgScore
                ]} size={70} />
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 px-6 lg:px-8 py-8 overflow-x-hidden">
          <div className="max-w-6xl mx-auto">
            
            {/* Hero metrics */}
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 transition-all duration-1000 ${animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              
              {/* Overall Progress */}
              <div className="rounded-2xl p-6 bg-white/[0.02] border border-white/[0.06] flex flex-col items-center justify-center hover:bg-white/[0.03] transition-colors">
                <RadialProgress progress={overallProgress} color="#00d4ff" label="Progress" />
              </div>

              {/* Key Metrics */}
              <div className="rounded-2xl p-6 bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.03] transition-colors">
                <h3 className="text-xs text-white/40 uppercase tracking-wider mb-5">Key Metrics</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Tasks Started', value: counters.tasks, total: stats.totalTasks, color: '#ff6b35' },
                    { label: 'Activities Done', value: counters.activities, total: stats.totalActivities, color: '#00d4ff' },
                    { label: 'Mastery Achieved', value: counters.mastered, total: null, color: completeColor },
                  ].map((metric, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm text-white/50">{metric.label}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-20 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-1000"
                            style={{ 
                              width: metric.total ? `${(metric.value / metric.total) * 100}%` : '100%',
                              backgroundColor: metric.color,
                              boxShadow: `0 0 10px ${metric.color}60`
                            }}
                          />
                        </div>
                        <span className="text-sm font-semibold min-w-[60px] text-right" style={{ color: metric.color }}>
                          {metric.value}{metric.total && <span className="text-white/20">/{metric.total}</span>}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Score */}
              <div className="rounded-2xl p-6 bg-white/[0.02] border border-white/[0.06] flex flex-col items-center justify-center hover:bg-white/[0.03] transition-colors">
                <RadialProgress progress={avgScore} color="#bf5af2" label="Avg Score" />
              </div>
            </div>

            {/* Insights Bar */}
            <div 
              className={`grid grid-cols-2 lg:grid-cols-5 gap-3 mb-3 transition-all duration-700 ${animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: '150ms' }}
            >
              {/* Time Invested */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-cyan-500/10 text-cyan-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-lg font-bold text-white">{stats.timeInvested.hours}h {stats.timeInvested.minutes}m</div>
                  <div className="text-xs text-white/30">Time Invested</div>
                </div>
              </div>

              {/* Study Streak */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-orange-500/10 text-orange-400">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 23c-1.1 0-1.99-.89-1.99-1.99h3.98c0 1.1-.89 1.99-1.99 1.99zm7-6v-6c0-3.35-2.36-6.15-5.5-6.83V3c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v1.17C7.36 4.85 5 7.65 5 11v6l-2 2v1h18v-1l-2-2z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-lg font-bold text-white flex items-center gap-1">
                    {stats.studyStreak}
                    <span className="text-xs text-orange-400">🔥</span>
                  </div>
                  <div className="text-xs text-white/30">Day Streak</div>
                </div>
              </div>

              {/* Last Active */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-emerald-500/10 text-emerald-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                </div>
                <div>
                  <div className="text-lg font-bold text-white">Today</div>
                  <div className="text-xs text-white/30">Last Active</div>
                </div>
              </div>

              {/* Strongest */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-emerald-500/20">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-emerald-500/10 text-emerald-400">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-emerald-400 truncate">{stats.strongest.name}</div>
                  <div className="text-xs text-white/30">Strongest • {stats.strongest.score}%</div>
                </div>
              </div>

              {/* Needs Practice */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-amber-500/20">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-amber-500/10 text-amber-400">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-amber-400 truncate">{stats.needsPractice.name}</div>
                  <div className="text-xs text-white/30">Focus Area • {stats.needsPractice.score}%</div>
                </div>
              </div>
            </div>

            {/* Deep Dive Link */}
            <div 
              className={`flex justify-end mb-4 transition-all duration-700 ${animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: '180ms' }}
            >
              <a 
                href="/detailed-analytics" 
                className="group flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors"
              >
                <span>View detailed breakdown</span>
                <svg 
                  className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>

            {/* Domain Summary Bar */}
            <div 
              className={`flex items-center justify-between p-4 mb-6 rounded-xl bg-white/[0.02] border border-white/[0.06] transition-all duration-700 ${animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: '200ms' }}
            >
              <div className="flex items-center gap-6">
                <span className="text-sm text-white/40">Domains</span>
                <div className="flex items-center gap-4">
                  {domains.map((d, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.accent, boxShadow: `0 0 8px ${d.accent}60` }} />
                      <span className="text-sm text-white/60">{d.name}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-white/[0.06]" style={{ color: d.accent }}>{getDomainProgress(d.tasks)}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: completeColor }} />
                  <span className="text-white/40">Complete</span>
                  <span className="font-semibold" style={{ color: completeColor }}>{totalComplete}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-white/40">Active</span>
                  <span className="font-semibold text-cyan-400">{totalActive}</span>
                </div>
              </div>
            </div>

            {/* Accordion sections */}
            <div className="space-y-3">
              
              {/* Progress Statistics */}
              <div className={`transition-all duration-700 ${animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '300ms' }}>
                <div
                  onClick={() => setExpandedSection(expandedSection === 'stats' ? null : 'stats')}
                  className="relative overflow-hidden rounded-xl cursor-pointer border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.03] transition-all duration-300 group"
                  style={{ boxShadow: expandedSection === 'stats' ? '0 0 30px rgba(0, 212, 255, 0.1)' : 'none', borderColor: expandedSection === 'stats' ? 'rgba(0, 212, 255, 0.3)' : undefined }}
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl transition-all" style={{ backgroundColor: '#00d4ff', boxShadow: expandedSection === 'stats' ? '0 0 15px #00d4ff' : '0 0 10px #00d4ff60' }} />
                  
                  <div className="p-4 pl-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 transition-transform group-hover:scale-110">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/>
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-sm font-medium text-white">Progress Statistics</h2>
                          <p className="text-xs text-white/30">Task completion & mastery tracking</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 text-sm">
                          <span style={{ color: '#ff6b35' }}>{stats.tasksStarted}</span>
                          <span className="text-white/20">•</span>
                          <span style={{ color: '#00d4ff' }}>{stats.activitiesCompleted}</span>
                          <span className="text-white/20">•</span>
                          <span style={{ color: completeColor }}>{stats.tasksMastered}</span>
                        </div>
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 ${expandedSection === 'stats' ? 'rotate-180 bg-cyan-500/20' : 'bg-white/[0.03]'}`}>
                          <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path d="M19 9l-7 7-7-7"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`overflow-hidden transition-all duration-500 ease-out ${expandedSection === 'stats' ? 'max-h-[400px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                  <div className="rounded-xl border border-white/[0.06] bg-black/40 p-4">
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'Tasks Started', value: stats.tasksStarted, total: stats.totalTasks, color: '#ff6b35' },
                        { label: 'Activities Done', value: stats.activitiesCompleted, total: stats.totalActivities, color: '#00d4ff' },
                        { label: 'Mastered', value: stats.tasksMastered, total: null, color: completeColor },
                      ].map((s, i) => (
                        <div key={i} className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                          <p className="text-xs text-white/30 uppercase tracking-wider mb-2">{s.label}</p>
                          <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}{s.total && <span className="text-white/20 text-sm">/{s.total}</span>}</p>
                          {s.total && <div className="mt-3 h-1 rounded-full bg-white/[0.06] overflow-hidden"><div className="h-full rounded-full" style={{ width: `${(s.value/s.total)*100}%`, backgroundColor: s.color, boxShadow: `0 0 8px ${s.color}` }}/></div>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Scores */}
              <div className={`transition-all duration-700 ${animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '400ms' }}>
                <div
                  onClick={() => setExpandedSection(expandedSection === 'activities' ? null : 'activities')}
                  className="relative overflow-hidden rounded-xl cursor-pointer border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.03] transition-all duration-300 group"
                  style={{ boxShadow: expandedSection === 'activities' ? '0 0 30px rgba(191, 90, 242, 0.1)' : 'none', borderColor: expandedSection === 'activities' ? 'rgba(191, 90, 242, 0.3)' : undefined }}
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl transition-all" style={{ backgroundColor: '#bf5af2', boxShadow: expandedSection === 'activities' ? '0 0 15px #bf5af2' : '0 0 10px #bf5af260' }} />
                  
                  <div className="p-4 pl-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-purple-500/10 border border-purple-500/20 text-purple-400 transition-transform group-hover:scale-110">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-sm font-medium text-white">Activity Scores</h2>
                          <p className="text-xs text-white/30">Performance across 6 activity types</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="hidden sm:flex gap-0.5">
                          {activityTypes.map((a, i) => (
                            <div key={i} className="w-1 h-5 rounded-full" style={{ backgroundColor: a.attempts > 0 ? a.color : 'rgba(255,255,255,0.08)', boxShadow: a.attempts > 0 ? `0 0 4px ${a.color}60` : 'none' }}/>
                          ))}
                        </div>
                        <span className="text-sm font-semibold" style={{ color: '#bf5af2' }}>{avgScore}%</span>
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 ${expandedSection === 'activities' ? 'rotate-180 bg-purple-500/20' : 'bg-white/[0.03]'}`}>
                          <svg className="w-3.5 h-3.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path d="M19 9l-7 7-7-7"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`overflow-hidden transition-all duration-500 ease-out ${expandedSection === 'activities' ? 'max-h-[400px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                  <div className="rounded-xl border border-white/[0.06] bg-black/40 overflow-hidden">
                    {activityTypes.map((a, i) => (
                      <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: a.attempts > 0 ? a.color : 'rgba(255,255,255,0.1)', boxShadow: a.attempts > 0 ? `0 0 6px ${a.color}` : 'none' }}/>
                        <span className={`flex-1 text-sm ${a.attempts > 0 ? 'text-white/80' : 'text-white/30'}`}>{a.name}</span>
                        <div className="w-20 h-1 rounded-full bg-white/[0.06] overflow-hidden"><div className="h-full rounded-full" style={{ width: `${a.score}%`, backgroundColor: a.color }}/></div>
                        <span className="text-sm w-10 text-right" style={{ color: a.attempts > 0 ? a.color : 'rgba(255,255,255,0.2)' }}>{a.score}%</span>
                        <span className="text-xs text-white/30 w-14 text-right">{a.attempts} tries</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Domain Cards */}
              {domains.map((domain, index) => {
                const isExpanded = expandedDomain === domain.id;
                const progress = getDomainProgress(domain.tasks);
                const completed = getCompleted(domain.tasks);
                const active = getActive(domain.tasks);

                return (
                  <div key={domain.id} className={`transition-all duration-700 ${animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${(index + 5) * 100}ms` }}>
                    <div
                      onClick={() => setExpandedDomain(isExpanded ? null : domain.id)}
                      className="relative overflow-hidden rounded-xl cursor-pointer border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.03] transition-all duration-300 group"
                      style={{ boxShadow: isExpanded ? `0 0 30px rgba(${domain.accentRgb}, 0.1)` : 'none', borderColor: isExpanded ? `rgba(${domain.accentRgb}, 0.3)` : undefined }}
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl transition-all" style={{ backgroundColor: domain.accent, boxShadow: isExpanded ? `0 0 15px ${domain.accent}` : `0 0 10px ${domain.accent}60` }} />
                      
                      <div className="p-4 pl-5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center border transition-transform group-hover:scale-110"
                              style={{ backgroundColor: `rgba(${domain.accentRgb}, 0.1)`, borderColor: `rgba(${domain.accentRgb}, 0.2)`, color: domain.accent }}>
                              {domain.icon}
                            </div>
                            <div>
                              <h2 className="text-sm font-medium text-white">{domain.name}</h2>
                              <p className="text-xs text-white/30">{domain.tasks.length} tasks • {domain.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="hidden lg:flex gap-0.5">
                              {domain.tasks.map((t, i) => (
                                <div key={i} className="w-1 h-5 rounded-full" style={{
                                  backgroundColor: t.progress === 100 ? completeColor : t.progress > 0 ? domain.accent : 'rgba(255,255,255,0.08)',
                                  boxShadow: t.progress > 0 ? `0 0 3px ${t.progress === 100 ? completeColor : domain.accent}60` : 'none'
                                }}/>
                              ))}
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                              <span className="px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(0,255,136,0.1)', color: completeColor }}>{completed}</span>
                              <span className="px-1.5 py-0.5 rounded" style={{ backgroundColor: `rgba(${domain.accentRgb}, 0.1)`, color: domain.accent }}>{active}</span>
                              <span className="px-1.5 py-0.5 rounded bg-white/[0.04] text-white/30">{domain.tasks.length - completed - active}</span>
                            </div>
                            <SegmentedProgress progress={progress} color={domain.accent} />
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                              style={{ backgroundColor: isExpanded ? `rgba(${domain.accentRgb}, 0.2)` : 'rgba(255,255,255,0.03)' }}>
                              <svg className="w-3.5 h-3.5" style={{ color: domain.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path d="M19 9l-7 7-7-7"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={`overflow-hidden transition-all duration-500 ease-out ${isExpanded ? 'max-h-[600px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                      <div className="rounded-xl border overflow-hidden" style={{ borderColor: `rgba(${domain.accentRgb}, 0.15)`, backgroundColor: 'rgba(0,0,0,0.4)' }}>
                        <div className="max-h-[500px] overflow-y-auto">
                          {domain.tasks.map((task, taskIndex) => {
                            const status = getTaskStatus(task.progress);
                            const isHovered = hoveredTask === `${domain.id}-${taskIndex}`;
                            return (
                              <div key={taskIndex}
                                onMouseEnter={() => setHoveredTask(`${domain.id}-${taskIndex}`)}
                                onMouseLeave={() => setHoveredTask(null)}
                                className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.03] transition-all"
                                style={{ backgroundColor: isHovered ? `rgba(${domain.accentRgb}, 0.04)` : 'transparent' }}>
                                <span className="text-xs text-white/20 w-8">{task.id}</span>
                                <div className="w-1.5 h-1.5 rounded-full" style={{
                                  backgroundColor: status === 'complete' ? completeColor : status === 'active' ? domain.accent : 'rgba(255,255,255,0.15)',
                                  boxShadow: status !== 'standby' ? `0 0 6px ${status === 'complete' ? completeColor : domain.accent}` : 'none'
                                }}/>
                                <span className={`flex-1 text-sm ${status === 'standby' ? 'text-white/30' : ''}`} style={{ color: status === 'complete' ? completeColor : status === 'active' ? 'white' : undefined }}>{task.name}</span>
                                <div className="w-20 flex items-center gap-2">
                                  <div className="flex-1 h-1 rounded-full bg-white/[0.06] overflow-hidden"><div className="h-full rounded-full" style={{ width: `${task.progress}%`, backgroundColor: status === 'complete' ? completeColor : domain.accent }}/></div>
                                  <span className="text-xs text-white/30 w-7 text-right">{task.progress}%</span>
                                </div>
                                <button className="text-xs px-2.5 py-1 rounded-md border transition-all hover:scale-105" style={{
                                  backgroundColor: status !== 'standby' ? `rgba(${status === 'complete' ? '0,255,136' : domain.accentRgb}, 0.1)` : 'transparent',
                                  color: status === 'complete' ? completeColor : status === 'active' ? domain.accent : 'rgba(255,255,255,0.3)',
                                  borderColor: status !== 'standby' ? `rgba(${status === 'complete' ? '0,255,136' : domain.accentRgb}, 0.3)` : 'rgba(255,255,255,0.08)'
                                }}>
                                  {status === 'complete' ? 'Review' : status === 'active' ? 'Continue' : 'Start'}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="flex-shrink-0 border-t border-white/[0.06] px-6 lg:px-8 py-3 bg-black/40">
          <div className="flex items-center justify-between text-xs text-white/30">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping opacity-50" />
              </div>
              <span>System Online</span>
            </div>
            <span>PMP Certification • 35 Tasks • 3 Domains</span>
            <span>v2.0</span>
          </div>
        </footer>
      </div>

      <style jsx>{`
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.15); }
      `}</style>
    </div>
  );
};

export default ExecutiveDashboard;
