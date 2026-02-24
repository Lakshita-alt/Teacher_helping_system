"use client"

export default function ClassOverviewModal({prop}){
    return(
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">{prop.className} Overview</h2>
                <div className="px-4 py-2 bg-slate-50 rounded-xl text-xs font-black uppercase text-slate-500 tracking-widest border border-slate-100">
                    ID: {prop.hash.substring(0, 8)}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 flex flex-col items-center justify-center relative group overflow-hidden">
                    <div className="relative w-full aspect-square max-w-[240px]">
                      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 transform drop-shadow-xl">
                        {(() => {
                          const total = prop.one + prop.two + prop.three + prop.four;
                          const p1Perc = (prop.one / total) * 100;
                          const p2Perc = (prop.two / total) * 100;
                          const p3Perc = (prop.three / total) * 100;
                          const p4Perc = (prop.four / total) * 100;
                          
                          let currentOffset = 0;
                          return [
                            { perc: p1Perc, color: '#6366f1' }, // Indigo
                            { perc: p2Perc, color: '#f59e0b' }, // Amber
                            { perc: p3Perc, color: '#f43f5e' }, // Rose
                            { perc: p4Perc, color: '#10b981' }  // Emerald
                          ].map((segment, i) => {
                            const offset = currentOffset;
                            currentOffset += segment.perc;
                            return (
                              <circle
                                key={i}
                                cx="50" cy="50" r="40"
                                fill="transparent"
                                stroke={segment.color}
                                strokeWidth="12"
                                strokeDasharray={`${segment.perc} ${100 - segment.perc}`}
                                strokeDashoffset={-offset}
                                className="transition-all duration-1000 ease-out"
                              />
                            );
                          });
                        })()}
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-black text-slate-800 tracking-tighter">{prop.one + prop.two + prop.three + prop.four}</span>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total</span>
                      </div>
                    </div>
                    <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase">P1: {Math.round((prop.one/(prop.one+prop.two+prop.three+prop.four))*100)}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase">P2: {Math.round((prop.two/(prop.one+prop.two+prop.three+prop.four))*100)}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase">P3: {Math.round((prop.three/(prop.one+prop.two+prop.three+prop.four))*100)}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase">P4: {Math.round((prop.four/(prop.one+prop.two+prop.three+prop.four))*100)}%</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4 justify-center">
                    {[
                        {label: 'Persona 1', val: prop.one, color: 'bg-indigo-500'},
                        {label: 'Persona 2', val: prop.two, color: 'bg-amber-500'},
                        {label: 'Persona 3', val: prop.three, color: 'bg-rose-500'},
                        {label: 'Persona 4', val: prop.four, color: 'bg-emerald-500'},
                    ].map((item, i) => (
                        <div key={i} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-md transition-all">
                            <div className="flex items-center gap-4">
                                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                                <span className="font-bold text-slate-700">{item.label}</span>
                            </div>
                            <span className="text-2xl font-black text-slate-800">{item.val}</span>
                        </div>
                    ))}
                    
                    <div className="mt-4 p-6 bg-slate-900 rounded-3xl text-white flex items-center justify-between shadow-xl shadow-slate-200">
                        <span className="font-bold uppercase tracking-widest text-xs opacity-60">Total Students</span>
                        <span className="text-3xl font-black">{prop.one + prop.four + prop.two + prop.three}</span>
                    </div>
                </div>
            </div>

            <div className="bg-amber-50 p-8 rounded-[2rem] border border-amber-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                    <span className="text-6xl">💡</span>
                </div>
                <h3 className="text-lg font-black text-amber-900 uppercase tracking-tight mb-4 flex items-center gap-2">
                    AI Suggestion Box
                </h3>
                <p className="text-amber-800/80 leading-relaxed font-medium">
                    Based on the current distribution, focusing on collaborative learning activities between Persona 1 and Persona 4 could improve overall class engagement by 15% this month.
                </p>
            </div>
        </div>
    )
}