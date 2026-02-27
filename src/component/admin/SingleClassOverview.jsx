"use client"
 
export default function SingleClassOverview({ClsInfo}){
    // Ensure we handle either legacy or dynamic data structure
    const total = ClsInfo.total || (ClsInfo.one + ClsInfo.two + ClsInfo.three + ClsInfo.four) || 1;
    
    // Safely get personas (dynamic) or use legacy mapping
    let personasList = [];
    if (ClsInfo.personas) {
        const colors = ['bg-indigo-500', 'bg-amber-500', 'bg-rose-500', 'bg-emerald-500', 'bg-pink-500', 'bg-purple-500'];
        personasList = Object.entries(ClsInfo.personas)
            .sort((a, b) => b[1] - a[1]) // Sort by highest
            .slice(0, 4) // Show top 4
            .map(([name, val], index) => ({
                name: name.split(' ').slice(0, 2).join(' '),
                val,
                color: colors[index % colors.length]
            }));
    } else {
        personasList = [
            { name: 'P1', val: ClsInfo.one, color: 'bg-indigo-500' },
            { name: 'P2', val: ClsInfo.two, color: 'bg-amber-500' },
            { name: 'P3', val: ClsInfo.three, color: 'bg-rose-500' },
            { name: 'P4', val: ClsInfo.four, color: 'bg-emerald-500' }
        ];
    }

    const graphType = ClsInfo.graph || 'mid';

    return(
        <div className="bg-card-muted p-6 rounded-2xl hover:bg-card transition-all duration-200 border border-card-border hover:border-muted/30 group flex flex-col h-full min-h-[180px]">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="font-black text-foreground text-lg tracking-tight leading-none mb-1 italic uppercase">{ClsInfo.className}</h3>
                    <p className="text-[10px] font-black text-muted uppercase tracking-widest">Top Personas</p>
                </div>
                <div className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter ${
                    graphType === 'inc' ? 'bg-emerald-500/10 text-emerald-600' : 
                    graphType === 'dec' ? 'bg-rose-500/10 text-rose-600' : 'bg-slate-500/10 text-slate-600'
                }`}>
                    {graphType === 'inc' ? '↑ Increasing' : graphType === 'dec' ? '↓ Decreasing' : '→ Stable'}
                </div>
            </div>
            
            <div className="flex gap-2 items-end h-20 md:h-24 mt-auto">
                {personasList.map((persona, i) => {
                    const percentage = Math.round((persona.val / total) * 100);
                    // Use a minimum height to ensure it's visible, max 100%
                    const heightStr = `${Math.max(10, Math.min(100, percentage))}%`;
                    return (
                        <div key={i} className={`flex-1 ${persona.color} rounded-t-sm relative group/bar transition-all duration-200`} style={{height: heightStr}}>
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-[9px] font-black py-1 px-2 rounded opacity-0 group-hover/bar:opacity-100 transition-all whitespace-nowrap z-20">
                                {percentage}% ({persona.val})
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}