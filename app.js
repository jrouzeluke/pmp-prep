// --- VIEW: INTERACTIVE TACTICAL BLUEPRINT ---
  if (view === 'simulation' && currentTaskContent) {
    const [methodology, setMethodology] = useState('agile');

    return (
      <div className="max-w-6xl w-full p-12 animate-fadeIn relative">
        <header className="flex justify-between items-center mb-10">
            <button onClick={() => setView('practice-selection')} className="text-purple-400 text-[10px] font-black tracking-widest uppercase">// BACK</button>
            <div className="text-center">
                <h1 className="hud-font text-4xl font-black italic text-white uppercase tracking-tighter">Tactical Blueprint: {selectedTask}</h1>
                {/* METHODOLOGY TOGGLE */}
                <div className="mt-4 flex gap-4 justify-center">
                    <button onClick={() => setMethodology('predictive')} className={`text-[9px] font-black px-4 py-1 rounded border ${methodology === 'predictive' ? 'bg-purple-500 border-purple-400 text-white' : 'border-white/10 text-slate-500'}`}>WATERFALL</button>
                    <button onClick={() => setMethodology('agile')} className={`text-[9px] font-black px-4 py-1 rounded border ${methodology === 'agile' ? 'bg-cyan-500 border-cyan-400 text-white' : 'border-white/10 text-slate-500'}`}>AGILE/HYBRID</button>
                </div>
            </div>
            <span className="hud-font text-[10px] text-purple-400 font-bold uppercase">Veteran HUD Active</span>
        </header>

        <div className="grid grid-cols-2 gap-8 mb-10">
          {/* INTERACTIVE QUADRANT 01: DYNAMIC MINDSET */}
          <div className="glass-card p-8 border-l-4 border-purple-500 bg-purple-500/5">
            <h4 className="hud-font text-[10px] text-purple-500 mb-4 tracking-widest">01. {methodology.toUpperCase()} MINDSET</h4>
            <p className="text-slate-300 text-sm italic leading-relaxed">
                {methodology === 'agile' 
                  ? "Facilitate the team to resolve internally during retrospectives. PM acts as a Servant Leader." 
                  : "Address conflict immediately to prevent impact on the critical path and formal schedule."}
            </p>
          </div>

          {/* INTERACTIVE QUADRANT 02: ENABLER CHECKLIST */}
          <div className="glass-card p-8 border-l-4 border-emerald-500 bg-emerald-500/5">
            <h4 className="hud-font text-[10px] text-emerald-500 mb-4 tracking-widest">02. TACTICAL CHECKLIST</h4>
            <div className="space-y-3">
                {['Identify Source', 'Analyze Context', 'Select Strategy'].map(item => (
                    <label key={item} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="hidden" />
                        <div className="w-3 h-3 border border-emerald-500 group-hover:bg-emerald-500/20"></div>
                        <span className="text-[10px] text-slate-400 uppercase font-black group-hover:text-white transition-colors">{item}</span>
                    </label>
                ))}
            </div>
          </div>

          {/* QUADRANT 03 & 04 (Filters & Artifacts) - Can be updated to include tooltips */}
        </div>

        <button onClick={() => setView('decision-lab')} className="w-full bg-purple-500 border border-purple-400 py-6 rounded-2xl hud-font text-[14px] font-black uppercase tracking-[0.6em] hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] transition-all">
           Launch Decision Lab
        </button>
      </div>
    );
  }