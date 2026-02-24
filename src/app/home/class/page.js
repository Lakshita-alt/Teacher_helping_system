"use client"

export default function Class() {
  const stats = [
    { title: "Class Size", value: "42", color: "text-indigo-600", bg: "bg-indigo-50", icon: "👥" },
    { title: "High Risk", value: "12%", color: "text-rose-600", bg: "bg-rose-50", icon: "⚠️" },
    { title: "Avg. Score", value: "78", color: "text-amber-600", bg: "bg-amber-50", icon: "📈" },
    { title: "Engagement", value: "92%", color: "text-emerald-600", bg: "bg-emerald-50", icon: "✨" },
  ];

  const personaDistribution = [
    { name: "Visual Learners", value: 35, color: "bg-indigo-500" },
    { name: "Kinesthetic", value: 25, color: "bg-amber-500" },
    { name: "Auditory", value: 20, color: "bg-emerald-500" },
    { name: "Read/Write", value: 20, color: "bg-slate-500" },
  ];

  return (
    <div className="space-y-8 w-full animate-in fade-in duration-700 text-foreground">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase italic">Class Analysis</h1>
          <p className="text-muted font-bold text-xs uppercase tracking-widest mt-1">Section A • Morning Batch</p>
        </div>
        <div className="px-4 py-2 bg-card rounded-2xl shadow-sm border border-card-border text-xs font-black text-muted uppercase tracking-widest">
          Last Updated: Today
        </div>
      </div>
      
      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-card p-6 rounded-[2.5rem] shadow-sm border border-card-border flex items-center gap-5 hover:shadow-md transition-shadow group">
            <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform bg-opacity-10`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">{stat.title}</p>
              <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Trend Graph (SVG) */}
        <div className="bg-card p-8 rounded-[3rem] shadow-sm border border-card-border flex flex-col h-[400px]">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-black uppercase tracking-tight leading-none italic">Weekly Performance Trend</h3>
              <p className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1">Average Class Proficiency</p>
            </div>
            <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">+4.2% Growth</span>
          </div>
          <div className="flex-1 w-full relative px-4 pb-4">
            {/* Y-Axis Labels */}
            <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-[9px] font-black text-muted/50 uppercase h-[calc(100%-2rem)]">
              <span>100</span><span>75</span><span>50</span><span>25</span><span>0</span>
            </div>
            
            <div className="ml-8 h-full relative">
              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10 h-[calc(100%-2rem)]">
                {[0, 1, 2, 3, 4].map(i => <div key={i} className="border-t border-muted w-full"></div>)}
              </div>

              <svg className="w-full h-[calc(100%-2rem)] overflow-visible" viewBox="0 0 400 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                  </linearGradient>
                </defs>
                
                {/* Area under the line */}
                <path
                  d="M0,140 C50,130 100,160 150,100 C200,40 250,90 300,70 C350,50 400,20 400,20 L400,200 L0,200 Z"
                  fill="url(#lineGradient)"
                />
                
                {/* The Graph Line */}
                <path
                  d="M0,140 C50,130 100,160 150,100 C200,40 250,90 300,70 C350,50 400,20 400,20"
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="4"
                  strokeLinecap="round"
                  className="drop-shadow-md"
                />
                
                {/* Interaction points */}
                {[
                  {x: 0, y: 140, v: 65}, {x: 100, y: 160, v: 55}, {x: 200, y: 40, v: 85}, {x: 300, y: 70, v: 75}, {x: 400, y: 20, v: 95}
                ].map((p, i) => (
                  <g key={i} className="group/dot cursor-pointer">
                    <circle cx={p.x} cy={p.y} r="5" fill="white" stroke="#6366f1" strokeWidth="3" className="transition-all duration-300 group-hover/dot:r-8" />
                    <foreignObject x={p.x - 20} y={p.y - 35} width="40" height="25" className="opacity-0 group-hover/dot:opacity-100 transition-opacity pointer-events-none">
                      <div className="bg-foreground text-background text-[9px] font-black py-1 px-2 rounded-lg text-center shadow-xl">{p.v}%</div>
                    </foreignObject>
                  </g>
                ))}
              </svg>
              
              {/* X-Axis Labels */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] font-black text-muted/50 uppercase tracking-widest pt-4">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span>
              </div>
            </div>
          </div>
        </div>

        {/* Persona Distribution (Bar Graph) */}
        <div className="bg-card p-8 rounded-[3rem] shadow-sm border border-card-border flex flex-col h-[400px]">
          <h3 className="text-lg font-black uppercase tracking-tight mb-8 italic">Learning Personas</h3>
          <div className="space-y-6 flex-1 flex flex-col justify-center">
            {personaDistribution.map((persona) => (
              <div key={persona.name} className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted">
                  <span>{persona.name}</span>
                  <span>{persona.value}%</span>
                </div>
                <div className="h-3 w-full bg-card-muted rounded-full overflow-hidden border border-card-border">
                  <div 
                    className={`h-full ${persona.color} transition-all duration-1000 ease-out`} 
                    style={{ width: `${persona.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Summary Card */}
      <div className="bg-sidebar p-10 rounded-[3rem] text-foreground border border-card-border relative overflow-hidden group shadow-lg">
        <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:rotate-12 transition-transform">
          <span className="text-8xl">🚀</span>
        </div>
        <div className="relative z-10 max-w-2xl">
          <h3 className="text-accent font-black uppercase tracking-[0.2em] text-[10px] mb-4">AI Recommended Strategy</h3>
          <h4 className="text-2xl font-black mb-4 tracking-tight">Personalization Required for 5 Students</h4>
          <p className="text-muted font-medium leading-relaxed">
            The recent dip in mid-week performance suggests a need for kinesthetic learning materials in the upcoming module. Focus on grouping Persona 1 with Persona 3 for better peer-to-peer engagement.
          </p>
          <button className="mt-8 bg-foreground text-background font-black py-4 px-8 rounded-2xl hover:bg-accent transition-colors uppercase tracking-widest text-xs shadow-xl shadow-accent/20">
            Generate Lesson Plan
          </button>
        </div>
      </div>

    </div>
  );
}