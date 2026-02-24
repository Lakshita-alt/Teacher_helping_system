"use client"
 
export default function SingleClassOverview({ClsInfo}){
    return(
        <div className="bg-slate-50 p-6 rounded-[2rem] hover:bg-white transition-all duration-300 border border-transparent hover:border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 group flex flex-col h-full min-h-[180px]">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="font-black text-slate-800 text-lg tracking-tight leading-none mb-1">{ClsInfo.className}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Performance Index</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                    ClsInfo.graph === 'inc' ? 'bg-green-100 text-green-600' : 
                    ClsInfo.graph === 'dec' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
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
                    <div key={i} className={`flex-1 ${persona.color} rounded-t-xl relative group/bar shadow-sm hover:brightness-110 transition-all duration-300`} style={{height: `${persona.val}%`}}>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-black py-1 px-2 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-all scale-75 group-hover/bar:scale-100 whitespace-nowrap z-20">
                            P{i+1}: {persona.val}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}