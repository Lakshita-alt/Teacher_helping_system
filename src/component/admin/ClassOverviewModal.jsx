"use client"
import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Icon } from '@/component/Icons';

export default function ClassOverviewModal({prop}){
    const personaData = Object.entries(prop.personas).map(([name, value], index) => ({
        name,
        value,
        color: ['#6366f1', '#f59e0b', '#f43f5e', '#10b981', '#ec4899', '#8b5cf6'][index % 6]
    }));

    const total = prop.total;

    const [suggestion, setSuggestion] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setSuggestion("");
        setLoading(true);

        fetch('/api/ai/suggestion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'class',
                classData: {
                    className: prop.className,
                    personas: prop.personas,
                }
            })
        })
        .then(res => res.json())
        .then(data => setSuggestion(data.suggestion || "No suggestion available."))
        .catch(() => setSuggestion("Failed to load suggestion."))
        .finally(() => setLoading(false));
    }, [prop.hash]);

    return(
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-foreground">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black text-foreground tracking-tight italic uppercase">{prop.className} Overview</h2>
                <div className="px-4 py-2 bg-card-muted rounded-xl text-xs font-black uppercase text-muted tracking-widest border border-card-border">
                    ID: {prop.hash.substring(5)}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-card-muted p-8 rounded-[2.5rem] border border-card-border flex flex-col items-center justify-center relative group overflow-hidden h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={personaData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {personaData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--card)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '1rem',
                                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                    fontWeight: 900,
                                    color: 'var(--foreground)'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-3xl font-black text-foreground tracking-tighter">{total}</span>
                        <span className="text-[9px] font-black text-muted uppercase tracking-widest">Students</span>
                    </div>
                </div>

                <div className="flex flex-col gap-3 justify-center overflow-y-auto max-h-[400px] pr-2">
                    {personaData.map((item, i) => (
                        <div key={i} className="bg-card-muted p-4 rounded-2xl border border-card-border flex items-center justify-between group hover:bg-card hover:shadow-md transition-all shrink-0">
                            <div className="flex items-center gap-4 overflow-hidden">
                                <div className="w-3 h-3 rounded-full shrink-0" style={{backgroundColor: item.color}}></div>
                                <span className="font-bold text-foreground/80 text-sm line-clamp-1">{item.name}</span>
                            </div>
                            <div className="flex items-center gap-3 shrink-0 ml-4">
                                <span className="text-[10px] font-black text-muted uppercase">{Math.round((item.value/total)*100)}%</span>
                                <span className="text-xl font-black text-foreground">{item.value}</span>
                            </div>
                        </div>
                    ))}

                    <div className="mt-2 p-5 bg-foreground text-background rounded-3xl flex items-center justify-between shadow-xl dark:shadow-none shrink-0">
                        <span className="font-bold uppercase tracking-widest text-[10px] opacity-60">Total Population</span>
                        <span className="text-2xl font-black">{total}</span>
                    </div>
                </div>
            </div>

            <div className="bg-accent/5 p-8 rounded-[2rem] border border-accent/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                    <Icon name="suggestion" className="w-16 h-16 text-accent" />
                </div>
                <h3 className="text-lg font-black text-accent uppercase tracking-tight mb-4 flex items-center gap-2">
                    AI Suggestion Box
                </h3>
                {loading ? (
                    <p className="text-muted font-medium animate-pulse">Analysing class data...</p>
                ) : (
                    <p className="text-foreground/80 leading-relaxed font-medium">{suggestion}</p>
                )}
            </div>
        </div>
    )
}
