// --- VIEW: STUDY HUB (DEEP CONTENT ENGINE) ---
  if (currentMode === 'studyhub') {
    return (
      <div className="min-h-screen p-6 md:p-12 bg-[#05070a] flex flex-col items-center">
        <div className="max-w-4xl w-full">
          {/* Back Navigation */}
          <button 
            onClick={() => setCurrentMode('dashboard')} 
            className="text-slate-500 mb-10 flex items-center gap-2 font-black uppercase text-[10px] tracking-widest hover:text-white transition-colors"
          >
            <LucideIcon name="arrow-left" className="w-4 h-4"/> Dashboard
          </button>
          
          {/* Domain Selection Tabs */}
          <div className="flex glass p-1 mb-10 gap-1 rounded-2xl">
            {['people', 'process', 'business'].map(d => (
              <button 
                key={d} 
                onClick={() => {setStudyTab(d); setExpandedTask(null);}} 
                className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${studyTab === d ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white'}`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Task List */}
          <div className="space-y-4">
            {pmpData.tasks[studyTab].map(t => (
              <div key={t.id} className="glass p-8 border-white/5 rounded-[2.5rem] overflow-hidden">
                <div 
                  onClick={() => setExpandedTask(expandedTask === t.id ? null : t.id)} 
                  className="flex justify-between items-center cursor-pointer group"
                >
                  <div className="flex items-center gap-6">
                    <span className="text-indigo-400 font-black bg-indigo-500/10 w-12 h-12 rounded-2xl flex items-center justify-center border border-indigo-500/20 group-hover:border-indigo-500/50 transition-colors">
                      {t.id}
                    </span>
                    <h3 className="text-xl font-black italic uppercase tracking-tighter group-hover:text-white transition-colors">
                      {t.title}
                    </h3>
                  </div>
                  <LucideIcon 
                    name={expandedTask === t.id ? "minus" : "plus"} 
                    className={`transition-transform duration-300 ${expandedTask === t.id ? 'text-indigo-400' : 'text-slate-600'}`} 
                  />
                </div>
                
                {expandedTask === t.id && (
                  <div className="mt-8 space-y-8 animate-fadeIn">
                    {/* Deep Dive Description */}
                    <p className="text-slate-300 text-sm leading-relaxed italic border-l-2 border-indigo-500/30 pl-6">
                      "{t.deepDive}"
                    </p>

                    {/* The 3-Column Surgical Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Enablers Column */}
                        <div>
                            <h4 className="text-[10px] font-black uppercase text-indigo-400 mb-4 tracking-[0.2em] border-b border-indigo-500/10 pb-2">Enablers</h4>
                            <ul className="space-y-3">
                                {(t.enablers || []).map((item, i) => (
                                    <li key={i} className="text-[11px] text-slate-400 flex items-start gap-2 leading-tight">
                                        <span className="text-indigo-500 font-black mt-1">›</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Deliverables Column */}
                        <div>
                            <h4 className="text-[10px] font-black uppercase text-purple-400 mb-4 tracking-[0.2em] border-b border-purple-500/10 pb-2">Deliverables</h4>
                            <ul className="space-y-3">
                                {(t.deliverables || []).map((item, i) => (
                                    <li key={i} className="text-[11px] text-slate-400 flex items-start gap-2 leading-tight">
                                        <span className="text-purple-500 font-black mt-1">›</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Tools Column */}
                        <div>
                            <h4 className="text-[10px] font-black uppercase text-emerald-400 mb-4 tracking-[0.2em] border-b border-emerald-500/10 pb-2">Tools</h4>
                            <ul className="space-y-3">
                                {(t.tools || []).map((item, i) => (
                                    <li key={i} className="text-[11px] text-slate-400 flex items-start gap-2 leading-tight">
                                        <span className="text-emerald-500 font-black mt-1">›</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Veteran Insight Footer */}
                    <div className="bg-emerald-500/5 p-6 rounded-3xl border border-emerald-500/10 text-emerald-400/90 text-xs font-bold leading-relaxed italic relative">
                        <div className="flex items-center gap-2 mb-2 opacity-50">
                          <LucideIcon name="shield-check" className="w-3 h-3" />
                          <span className="text-[8px] uppercase tracking-widest font-black">Veteran Diagnostic Insight</span>
                        </div>
                        {t.veteranTip}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }