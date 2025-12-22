import React, { useState, useEffect } from 'react';

const CondensedDashboard = () => {
  const [animated, setAnimated] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const [expandedDomain, setExpandedDomain] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hoveredTask, setHoveredTask] = useState(null);
  const [pulseRing, setPulseRing] = useState(0);

  // Stats data
  const stats = {
    tasksStarted: 12,
    totalTasks: 35,
    activitiesCompleted: 47,
    totalActivities: 210,
    tasksMastered: 3,
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

  // Calculate activity averages
  const activeActivities = activityTypes.filter(a => a.attempts > 0);
  const avgScore = activeActivities.length > 0 
    ? Math.round(activeActivities.reduce((a, b) => a + b.score, 0) / activeActivities.length)
    : 0;
  const totalAttempts = activityTypes.reduce((a, b) => a + b.attempts, 0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseRing(prev => (prev + 1) % 3);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    const clockInterval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => {
      clearTimeout(timer);
      clearInterval(clockInterval);
    };
  }, []);

  const getDomainProgress = (tasks) => Math.round(tasks.reduce((a, t) => a + t.progress, 0) / tasks.length);
  const getCompleted = (tasks) => tasks.filter(t => t.progress === 100).length;
  const getActive = (tasks) => tasks.filter(t => t.progress > 0 && t.progress < 100).length;

  const totalTasks = domains.reduce((a, d) => a + d.tasks.length, 0);
  const totalComplete = domains.reduce((a, d) => a + getCompleted(d.tasks), 0);
  const totalActive = domains.reduce((a, d) => a + getActive(d.tasks), 0);
  const overallProgress = Math.round(domains.reduce((a, d) => a + getDomainProgress(d.tasks), 0) / domains.length);

  const getTaskStatus = (progress) => {
    if (progress === 100) return 'complete';
    if (progress > 0) return 'active';
    return 'standby';
  };

  // Orbital progress
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

  // Segmented progress for cards
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

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full blur-[150px] opacity-20 animate-pulse" style={{ background: '#ff6b35', animationDuration: '4s' }}/>
        <div className="absolute top-1/4 -right-32 w-[500px] h-[500px] rounded-full blur-[150px] opacity-15 animate-pulse" style={{ background: '#00d4ff', animationDuration: '5s', animationDelay: '1s' }}/>
        <div className="absolute -bottom-32 left-1/4 w-[550px] h-[550px] rounded-full blur-[150px] opacity-15 animate-pulse" style={{ background: '#bf5af2', animationDuration: '6s', animationDelay: '2s' }}/>
      </div>

      {/* Scan lines */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)', opacity: 0.3 }}/>

      {/* Vignette */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)' }}/>

      {/* HUD Corners */}
      <div className="fixed inset-6 pointer-events-none hidden lg:block">
        {['top-0 left-0 border-t-2 border-l-2 rounded-tl-xl', 'top-0 right-0 border-t-2 border-r-2 rounded-tr-xl',
          'bottom-0 left-0 border-b-2 border-l-2 rounded-bl-xl', 'bottom-0 right-0 border-b-2 border-r-2 rounded-br-xl'
        ].map((classes, i) => (
          <div key={i} className={`absolute w-8 h-8 ${classes} transition-all duration-1000`}
            style={{ borderColor: `rgba(0, 212, 255, ${animated ? 0.4 : 0})`, transitionDelay: `${i * 200}ms` }}/>
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        
        {/* Header */}
        <header className="flex-shrink-0 border-b border-white/10 bg-black/50 backdrop-blur-xl">
          <div className="px-6 lg:px-8 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="flex gap-1.5 h-12">
                  {[{ color: '#ff6b35', height: '100%', delay: 0 }, { color: '#00d4ff', height: '75%', delay: 100 }, { color: '#bf5af2', height: '50%', delay: 200 }].map((bar, i) => (
                    <div key={i} className={`w-2 rounded-full self-end transition-all duration-700 ${animated ? 'opacity-100' : 'opacity-0 scale-y-0'}`}
                      style={{ background: `linear-gradient(180deg, ${bar.color} 0%, ${bar.color}80 100%)`, height: bar.height, boxShadow: `0 0 20px ${bar.color}80`, transitionDelay: `${bar.delay}ms`, transformOrigin: 'bottom' }}/>
                  ))}
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-wide text-white">Task Mastery Overview</h1>
                  <p className="text-xs text-white/40 tracking-widest uppercase mt-1">PMP Certification Training</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                  <div className="relative">
                    <div className="w-2 h-2 rounded-full bg-green-400"/>
                    <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-400 animate-ping"/>
                  </div>
                  <span className="text-xs text-white/50">Live</span>
                </div>
                <div className="text-right hidden sm:block">
                  <div className="text-xl font-bold text-white tabular-nums">{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</div>
                  <div className="text-xs text-white/30">{currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                </div>
                <OrbitalProgress progress={overallProgress}/>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 px-6 lg:px-8 py-6 overflow-x-hidden">
          <div className="max-w-7xl mx-auto space-y-4">

            {/* ==================== PROGRESS STATISTICS - COMPACT ==================== */}
            <div
              className={`transition-all duration-700 ${animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: '100ms' }}
            >
              <div
                onClick={() => setExpandedSection(expandedSection === 'stats' ? null : 'stats')}
                className={`
                  relative overflow-hidden rounded-2xl cursor-pointer
                  border transition-all duration-500 group
                  ${expandedSection === 'stats' ? 'border-opacity-80' : 'border-white/10 hover:border-opacity-50'}
                `}
                style={{
                  borderColor: expandedSection === 'stats' ? '#00d4ff' : undefined,
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.5) 100%)',
                  boxShadow: expandedSection === 'stats' ? '0 0 50px rgba(0, 212, 255, 0.2), inset 0 0 60px rgba(0, 212, 255, 0.05)' : 'none'
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #00d4ff, transparent)', opacity: expandedSection === 'stats' ? 1 : 0.3 }}/>
                <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: '#00d4ff', boxShadow: '0 0 20px #00d4ff80' }}/>

                <div className="relative p-5 pl-6">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center border transition-all duration-300 group-hover:scale-110"
                        style={{ backgroundColor: 'rgba(0, 212, 255, 0.1)', borderColor: 'rgba(0, 212, 255, 0.4)', color: '#00d4ff', boxShadow: 'inset 0 0 20px rgba(0, 212, 255, 0.2), 0 0 20px rgba(0, 212, 255, 0.1)' }}>
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/>
                        </svg>
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h2 className="text-lg font-bold text-white">Progress Statistics</h2>
                          <span className="text-xs px-2 py-0.5 rounded border" style={{ borderColor: 'rgba(0, 212, 255, 0.4)', color: '#00d4ff', backgroundColor: 'rgba(0, 212, 255, 0.1)' }}>
                            3 metrics
                          </span>
                        </div>
                        <p className="text-sm text-white/40 mt-1">Completion tracking and task mastery</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      {/* Quick stats inline */}
                      <div className="hidden lg:flex items-center gap-4 text-sm">
                        <div className="text-center px-3">
                          <div className="font-bold text-white">{stats.tasksStarted}<span className="text-white/30">/{stats.totalTasks}</span></div>
                          <div className="text-xs text-white/30">Started</div>
                        </div>
                        <div className="w-px h-8 bg-white/10"/>
                        <div className="text-center px-3">
                          <div className="font-bold" style={{ color: '#00d4ff' }}>{stats.activitiesCompleted}<span className="text-white/30">/{stats.totalActivities}</span></div>
                          <div className="text-xs text-white/30">Activities</div>
                        </div>
                        <div className="w-px h-8 bg-white/10"/>
                        <div className="text-center px-3">
                          <div className="font-bold" style={{ color: completeColor }}>{stats.tasksMastered}</div>
                          <div className="text-xs text-white/30">Mastered</div>
                        </div>
                      </div>

                      <SegmentedProgress progress={Math.round((stats.tasksStarted / stats.totalTasks) * 100)} color="#00d4ff"/>

                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-all duration-300 ${expandedSection === 'stats' ? 'rotate-180' : ''}`}
                        style={{ borderColor: 'rgba(0, 212, 255, 0.3)', backgroundColor: expandedSection === 'stats' ? 'rgba(0, 212, 255, 0.2)' : 'rgba(255,255,255,0.03)' }}>
                        <svg className="w-4 h-4" style={{ color: '#00d4ff' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path d="M19 9l-7 7-7-7"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded stats content */}
              <div className={`overflow-hidden transition-all duration-500 ease-out ${expandedSection === 'stats' ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                <div className="rounded-xl border overflow-hidden p-4" style={{ borderColor: 'rgba(0, 212, 255, 0.2)', backgroundColor: 'rgba(0,0,0,0.4)' }}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { label: 'Tasks Started', value: stats.tasksStarted, total: stats.totalTasks, color: '#ff6b35' },
                      { label: 'Activities Completed', value: stats.activitiesCompleted, total: stats.totalActivities, color: '#00d4ff' },
                      { label: 'Tasks Mastered', value: stats.tasksMastered, total: null, color: completeColor },
                    ].map((stat, i) => (
                      <div key={i} className="p-4 rounded-lg border border-white/5 bg-white/[0.02]">
                        <p className="text-xs text-white/40 uppercase tracking-wider mb-2">{stat.label}</p>
                        <p className="text-3xl font-bold" style={{ color: stat.color }}>
                          {stat.value}{stat.total && <span className="text-white/30 text-lg">/{stat.total}</span>}
                        </p>
                        {stat.total && (
                          <div className="mt-3 h-1.5 rounded-full overflow-hidden bg-white/10">
                            <div className="h-full rounded-full" style={{ width: `${(stat.value / stat.total) * 100}%`, backgroundColor: stat.color, boxShadow: `0 0 10px ${stat.color}` }}/>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ==================== ACTIVITY SCORES - COMPACT ==================== */}
            <div
              className={`transition-all duration-700 ${animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: '200ms' }}
            >
              <div
                onClick={() => setExpandedSection(expandedSection === 'activities' ? null : 'activities')}
                className={`
                  relative overflow-hidden rounded-2xl cursor-pointer
                  border transition-all duration-500 group
                  ${expandedSection === 'activities' ? 'border-opacity-80' : 'border-white/10 hover:border-opacity-50'}
                `}
                style={{
                  borderColor: expandedSection === 'activities' ? '#bf5af2' : undefined,
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.5) 100%)',
                  boxShadow: expandedSection === 'activities' ? '0 0 50px rgba(191, 90, 242, 0.2), inset 0 0 60px rgba(191, 90, 242, 0.05)' : 'none'
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #bf5af2, transparent)', opacity: expandedSection === 'activities' ? 1 : 0.3 }}/>
                <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: '#bf5af2', boxShadow: '0 0 20px #bf5af280' }}/>

                <div className="relative p-5 pl-6">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center border transition-all duration-300 group-hover:scale-110"
                        style={{ backgroundColor: 'rgba(191, 90, 242, 0.1)', borderColor: 'rgba(191, 90, 242, 0.4)', color: '#bf5af2', boxShadow: 'inset 0 0 20px rgba(191, 90, 242, 0.2), 0 0 20px rgba(191, 90, 242, 0.1)' }}>
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                        </svg>
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h2 className="text-lg font-bold text-white">Activity Scores</h2>
                          <span className="text-xs px-2 py-0.5 rounded border" style={{ borderColor: 'rgba(191, 90, 242, 0.4)', color: '#bf5af2', backgroundColor: 'rgba(191, 90, 242, 0.1)' }}>
                            6 types
                          </span>
                        </div>
                        <p className="text-sm text-white/40 mt-1">Average performance by activity type</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      {/* Activity type indicators */}
                      <div className="hidden lg:flex gap-1">
                        {activityTypes.map((activity, i) => (
                          <div key={i} className="w-1.5 h-8 rounded-full" style={{
                            backgroundColor: activity.attempts > 0 ? activity.color : 'rgba(255,255,255,0.06)',
                            boxShadow: activity.attempts > 0 ? `0 0 8px ${activity.color}60` : 'none'
                          }}/>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <div className="text-center px-3">
                          <div className="font-bold" style={{ color: '#bf5af2' }}>{avgScore}%</div>
                          <div className="text-xs text-white/30">Avg Score</div>
                        </div>
                        <div className="w-px h-8 bg-white/10"/>
                        <div className="text-center px-3">
                          <div className="font-bold text-white">{totalAttempts}</div>
                          <div className="text-xs text-white/30">Attempts</div>
                        </div>
                      </div>

                      <SegmentedProgress progress={avgScore} color="#bf5af2"/>

                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-all duration-300 ${expandedSection === 'activities' ? 'rotate-180' : ''}`}
                        style={{ borderColor: 'rgba(191, 90, 242, 0.3)', backgroundColor: expandedSection === 'activities' ? 'rgba(191, 90, 242, 0.2)' : 'rgba(255,255,255,0.03)' }}>
                        <svg className="w-4 h-4" style={{ color: '#bf5af2' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path d="M19 9l-7 7-7-7"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded activities content */}
              <div className={`overflow-hidden transition-all duration-500 ease-out ${expandedSection === 'activities' ? 'max-h-[400px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'rgba(191, 90, 242, 0.2)', backgroundColor: 'rgba(0,0,0,0.4)' }}>
                  {activityTypes.map((activity, i) => (
                    <div key={i} className="flex items-center gap-4 px-5 py-3.5 border-b transition-all duration-200 hover:bg-white/[0.02]" style={{ borderColor: 'rgba(255,255,255,0.03)' }}>
                      <div className="w-2.5 h-2.5 rounded-full" style={{
                        backgroundColor: activity.attempts > 0 ? activity.color : 'rgba(255,255,255,0.1)',
                        boxShadow: activity.attempts > 0 ? `0 0 10px ${activity.color}` : 'none'
                      }}/>
                      <span className={`flex-1 text-sm ${activity.attempts > 0 ? 'text-white' : 'text-white/40'}`}>{activity.name}</span>
                      <div className="w-32 flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-white/10">
                          <div className="h-full rounded-full" style={{ width: `${activity.score}%`, backgroundColor: activity.color, boxShadow: activity.score > 0 ? `0 0 8px ${activity.color}` : 'none' }}/>
                        </div>
                        <span className="text-xs w-10 text-right" style={{ color: activity.attempts > 0 ? activity.color : 'rgba(255,255,255,0.3)' }}>{activity.score}%</span>
                      </div>
                      <span className="text-xs text-white/30 w-20 text-right">{activity.attempts} attempts</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ==================== DOMAIN TASKS ==================== */}
            {domains.map((domain, index) => {
              const isExpanded = expandedDomain === domain.id;
              const progress = getDomainProgress(domain.tasks);
              const completed = getCompleted(domain.tasks);
              const active = getActive(domain.tasks);

              return (
                <div key={domain.id}
                  className={`transition-all duration-700 ${animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: `${(index + 3) * 100}ms` }}>
                  <div
                    onClick={() => setExpandedDomain(isExpanded ? null : domain.id)}
                    className={`relative overflow-hidden rounded-2xl cursor-pointer border transition-all duration-500 group ${isExpanded ? 'border-opacity-80' : 'border-white/10 hover:border-opacity-50'}`}
                    style={{
                      borderColor: isExpanded ? domain.accent : undefined,
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.5) 100%)',
                      boxShadow: isExpanded ? `0 0 50px rgba(${domain.accentRgb}, 0.2), inset 0 0 60px rgba(${domain.accentRgb}, 0.05)` : 'none'
                    }}>
                    <div className="absolute top-0 left-0 right-0 h-px transition-opacity duration-500" style={{ background: `linear-gradient(90deg, transparent, ${domain.accent}, transparent)`, opacity: isExpanded ? 1 : 0.3 }}/>
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-300" style={{ backgroundColor: domain.accent, boxShadow: `0 0 ${isExpanded ? '30px' : '20px'} ${domain.accent}${isExpanded ? '' : '80'}` }}/>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `radial-gradient(circle at 30% 50%, ${domain.accent}10 0%, transparent 50%)` }}/>

                    <div className="relative p-5 pl-6">
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-xl flex items-center justify-center border transition-all duration-300 group-hover:scale-110"
                            style={{ backgroundColor: `rgba(${domain.accentRgb}, 0.1)`, borderColor: `rgba(${domain.accentRgb}, 0.4)`, color: domain.accent, boxShadow: `inset 0 0 20px rgba(${domain.accentRgb}, 0.2), 0 0 20px rgba(${domain.accentRgb}, 0.1)` }}>
                            {domain.icon}
                          </div>
                          <div>
                            <div className="flex items-center gap-3 flex-wrap">
                              <h3 className="text-lg font-bold text-white tracking-wide">{domain.name}</h3>
                              <span className="text-xs px-2 py-0.5 rounded border" style={{ borderColor: `rgba(${domain.accentRgb}, 0.4)`, color: domain.accent, backgroundColor: `rgba(${domain.accentRgb}, 0.1)` }}>
                                {domain.tasks.length} tasks
                              </span>
                            </div>
                            <p className="text-sm text-white/40 mt-1">{domain.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="hidden lg:flex gap-1">
                            {domain.tasks.map((task, i) => (
                              <div key={i} className="w-1.5 h-8 rounded-full transition-all duration-300" style={{
                                backgroundColor: task.progress === 100 ? completeColor : task.progress > 0 ? domain.accent : 'rgba(255,255,255,0.06)',
                                boxShadow: task.progress === 100 ? `0 0 8px ${completeColor}` : task.progress > 0 ? `0 0 8px ${domain.accent}60` : 'none'
                              }}/>
                            ))}
                          </div>

                          <div className="flex items-center text-sm border border-white/10 rounded-lg overflow-hidden">
                            <div className="px-3 py-2 bg-green-500/10 border-r border-white/10 text-center">
                              <div className="font-bold" style={{ color: completeColor }}>{completed}</div>
                              <div className="text-xs text-white/30">Done</div>
                            </div>
                            <div className="px-3 py-2 border-r border-white/10 text-center" style={{ backgroundColor: `rgba(${domain.accentRgb}, 0.1)` }}>
                              <div className="font-bold" style={{ color: domain.accent }}>{active}</div>
                              <div className="text-xs text-white/30">Active</div>
                            </div>
                            <div className="px-3 py-2 bg-white/5 text-center">
                              <div className="font-bold text-white/40">{domain.tasks.length - completed - active}</div>
                              <div className="text-xs text-white/30">Left</div>
                            </div>
                          </div>

                          <SegmentedProgress progress={progress} color={domain.accent}/>

                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-all duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                            style={{ borderColor: `rgba(${domain.accentRgb}, 0.3)`, backgroundColor: isExpanded ? `rgba(${domain.accentRgb}, 0.2)` : 'rgba(255,255,255,0.03)' }}>
                            <svg className="w-4 h-4" style={{ color: domain.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path d="M19 9l-7 7-7-7"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded tasks */}
                  <div className={`overflow-hidden transition-all duration-500 ease-out ${isExpanded ? 'max-h-[600px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                    <div className="rounded-xl border overflow-hidden" style={{ borderColor: `rgba(${domain.accentRgb}, 0.2)`, backgroundColor: 'rgba(0,0,0,0.4)' }}>
                      <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                        {domain.tasks.map((task, taskIndex) => {
                          const status = getTaskStatus(task.progress);
                          const isHovered = hoveredTask === `${domain.id}-${taskIndex}`;
                          return (
                            <div key={taskIndex}
                              onMouseEnter={() => setHoveredTask(`${domain.id}-${taskIndex}`)}
                              onMouseLeave={() => setHoveredTask(null)}
                              className={`flex items-center gap-4 px-5 py-3.5 border-b transition-all duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}
                              style={{ borderColor: 'rgba(255,255,255,0.03)', backgroundColor: isHovered ? `rgba(${domain.accentRgb}, 0.05)` : 'transparent', transitionDelay: `${taskIndex * 20}ms` }}>
                              <span className="text-xs text-white/30 w-16">Task {task.id}</span>
                              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-all duration-300" style={{
                                backgroundColor: status === 'complete' ? completeColor : status === 'active' ? domain.accent : 'rgba(255,255,255,0.1)',
                                boxShadow: status === 'complete' ? `0 0 ${isHovered ? '15px' : '10px'} ${completeColor}` : status === 'active' ? `0 0 ${isHovered ? '15px' : '10px'} ${domain.accent}` : 'none'
                              }}/>
                              <span className={`flex-1 text-sm transition-colors duration-200 ${status === 'complete' ? '' : status === 'active' ? 'text-white' : 'text-white/40'}`} style={{ color: status === 'complete' ? completeColor : undefined }}>{task.name}</span>
                              <div className="w-36 flex items-center gap-3">
                                <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-white/10">
                                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${task.progress}%`, backgroundColor: status === 'complete' ? completeColor : domain.accent, boxShadow: task.progress > 0 ? `0 0 10px ${status === 'complete' ? completeColor : domain.accent}` : 'none' }}/>
                                </div>
                                <span className="text-xs tabular-nums w-10 text-right text-white/40">{task.progress}%</span>
                              </div>
                              <button className="w-24 text-xs px-3 py-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105 border" style={{
                                backgroundColor: status === 'complete' ? 'rgba(0, 255, 136, 0.1)' : status === 'active' ? `rgba(${domain.accentRgb}, 0.15)` : 'rgba(255,255,255,0.03)',
                                color: status === 'complete' ? completeColor : status === 'active' ? domain.accent : 'rgba(255,255,255,0.4)',
                                borderColor: status === 'complete' ? completeColor + '40' : status === 'active' ? domain.accent + '40' : 'rgba(255,255,255,0.1)',
                                boxShadow: status !== 'standby' ? `0 0 15px ${status === 'complete' ? completeColor : domain.accent}20` : 'none'
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
        </main>

        {/* Footer */}
        <footer className="flex-shrink-0 border-t border-white/10 px-6 lg:px-8 py-4 bg-black/50 backdrop-blur-xl">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: completeColor, boxShadow: `0 0 8px ${completeColor}` }}/>
                <div className="absolute inset-0 w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: completeColor, opacity: 0.4 }}/>
              </div>
              <span className="text-white/40">System Online</span>
            </div>
            <span className="hidden sm:block text-white/30">PMP Certification • 35 Modules • 3 Domains</span>
            <span className="text-white/30">v2.0</span>
          </div>
        </footer>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
};

export default CondensedDashboard;
