"use client"

// class is a keyword

import SingleClassOverview from "@/component/admin/SingleClassOverview";

export default function HOME(){

    const ClassInfoApiRes = [
  { className: "Class A", one: 75, two: 82, three: 68, four: 90, graph: "inc" },
  { className: "Class B", one: 88, two: 79, three: 84, four: 80, graph: "dec" },
  { className: "Class C", one: 60, two: 65, three: 63, four: 64, graph: "mid" },
  { className: "Class D", one: 92, two: 94, three: 96, four: 98, graph: "inc" },
  { className: "Class E", one: 70, two: 72, three: 71, four: 69, graph: "mid" },
  { className: "Class F", one: 45, two: 55, three: 85, four: 40, graph: "dec" },
  { className: "Class G", one: 30, two: 40, three: 50, four: 95, graph: "inc" },
  { className: "Class H", one: 85, two: 30, three: 45, four: 60, graph: "mid" },
  { className: "Class I", one: 65, two: 85, three: 25, four: 70, graph: "inc" },
  { className: "Class J", one: 50, two: 50, three: 50, four: 50, graph: "mid" },
  { className: "Class K", one: 95, two: 85, three: 75, four: 65, graph: "dec" },
  { className: "Class L", one: 20, two: 40, three: 60, four: 80, graph: "inc" }
];

    const totalClasses = ClassInfoApiRes.length;
    const avgP1 = Math.round(ClassInfoApiRes.reduce((acc, curr) => acc + curr.one, 0) / totalClasses);
    const avgP4 = Math.round(ClassInfoApiRes.reduce((acc, curr) => acc + curr.four, 0) / totalClasses);
    const trendInc = ClassInfoApiRes.filter(c => c.graph === "inc").length;

    const metrics = [
      { label: "Total Classes", value: totalClasses },
      { label: "Avg Persona 1", value: `${avgP1}%` },
      { label: "Avg Persona 4", value: `${avgP4}%` },
      { label: "Rising Trends", value: trendInc }
    ];

    return(
        <div className="space-y-8 w-full max-w-full text-foreground">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight leading-none italic uppercase">School Summary</h1>
              <div className="w-fit px-4 py-2 bg-card rounded-2xl shadow-sm border border-card-border text-[10px] md:text-sm font-bold text-muted uppercase tracking-widest">
                Academic Year 2025-26
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-8 bg-card p-8 md:p-12 rounded-[2rem] shadow-sm border border-card-border min-h-[400px] md:min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="flex flex-col md:flex-row items-center gap-12 w-full h-full relative z-10">
                    {/* SVG Pie Chart */}
                    <div className="relative w-64 h-64 shrink-0">
                      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 transform rounded-full">
                        {(() => {
                          const total = avgP1 + avgP4 + 70 + 60; // Just using some mock total for visual
                          const p1Perc = (avgP1 / total) * 100;
                          const p2Perc = (75 / total) * 100;
                          const p3Perc = (65 / total) * 100;
                          const p4Perc = (avgP4 / total) * 100;
                          
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
                                strokeWidth="20"
                                strokeDasharray={`${segment.perc} ${100 - segment.perc}`}
                                strokeDashoffset={-offset}
                                className="transition-all duration-700 ease-out"
                              />
                            );
                          });
                        })()}
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-card rounded-full m-8 border border-card-border shadow-sm">
                        <span className="text-2xl font-black tracking-tighter">Avg.</span>
                        <span className="text-[10px] font-black text-muted uppercase">Distribution</span>
                      </div>
                    </div>

                    <div className="flex-1 space-y-6">
                        <h3 className="text-xl font-black tracking-tight leading-none italic uppercase">Campus Distribution</h3>
                        <p className="text-sm font-medium text-muted">Aggregated persona data across {totalClasses} active sections.</p>
                        
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: 'Persona 1', color: 'bg-indigo-500', val: avgP1 },
                                { label: 'Persona 2', color: 'bg-amber-500', val: '75%' },
                                { label: 'Persona 3', color: 'bg-rose-500', val: '65%' },
                                { label: 'Persona 4', color: 'bg-emerald-500', val: avgP4 }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-sm ${item.color}`}></div>
                                    <span className="text-[10px] font-bold text-muted uppercase tracking-wider">{item.label}</span>
                                    <span className="text-xs font-black">{item.val}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
              </div>
              <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                {metrics.map((m, i) => (
                  <div key={i} className="bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-card-border flex flex-col items-center justify-center hover:bg-card-muted transition-all duration-200 group">
                    <span className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-2 group-hover:text-foreground transition-colors">{m.label}</span>
                    <span className="text-3xl md:text-4xl font-black tracking-tighter">{m.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-2xl shadow-sm border border-card-border overflow-hidden">
                <div className="px-8 py-6 border-b border-card-border flex items-center justify-between">
                  <h2 className="text-lg md:text-xl font-bold tracking-tight">Class Overviews</h2>
                  <button className="text-sm font-black text-foreground/70 hover:text-foreground uppercase tracking-widest">View All</button>
                </div>
                <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
                    {ClassInfoApiRes.map((cls)=>(
                        <SingleClassOverview key={cls.className} ClsInfo={cls}/>
                    ))}
                </div>
            </div>
        </div>
    )
}