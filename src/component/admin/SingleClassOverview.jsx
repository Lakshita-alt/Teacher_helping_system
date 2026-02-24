"use client"
 
export default function SingleClassOverview({ClsInfo}){
    return(
        <div className="bg-card-muted p-6 rounded-2xl hover:bg-card transition-all duration-200 border border-card-border hover:border-muted/30 group flex flex-col h-full min-h-[180px]">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="font-black text-foreground text-lg tracking-tight leading-none mb-1 italic uppercase">{ClsInfo.className}</h3>
                    <p className="text-[10px] font-black text-muted uppercase tracking-widest">Performance Index</p>
                </div>
                <div className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter ${
                    ClsInfo.graph === 'inc' ? 'bg-emerald-500/10 text-emerald-600' : 
                    ClsInfo.graph === 'dec' ? 'bg-rose-500/10 text-rose-600' : 'bg-slate-500/10 text-slate-600'
                }`}>
                    {ClsInfo.graph === 'inc' ? '↑ Increasing' : ClsInfo.graph === 'dec' ? '↓ Decreasing' : '→ Stable'}
                </div>
            </div>
            
            <div className="flex gap-2 items-end h-20 md:h-24 mt-auto">
                {[
                    { val: ClsInfo.one, color: 'bg-indigo-500' },
                    { val: ClsInfo.two, color: 'bg-amber-500' },
                    { val: ClsInfo.three, color: 'bg-rose-500' },
                    { val: ClsInfo.four, color: 'bg-emerald-500' }
                ].map((persona, i) => (
                    <div key={i} className={`flex-1 ${persona.color} rounded-t-sm relative group/bar transition-all duration-200`} style={{height: `${persona.val}%`}}>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-[9px] font-black py-1 px-2 rounded opacity-0 group-hover/bar:opacity-100 transition-all whitespace-nowrap z-20">
                            P{i+1}: {persona.val}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}