"use client"

import { useState, useEffect } from "react";
import SingleClassOverview from "@/component/admin/SingleClassOverview";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function HOME(){
    const [classes, setClasses] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [classesRes, summaryRes] = await Promise.all([
                    fetch('/api/classes'),
                    fetch('/api/class-summary')
                ]);
                const classesData = await classesRes.json();
                const summaryData = await summaryRes.json();
                setClasses(classesData);
                setSummary(summaryData);
            } catch (error) {
                console.error("Failed to fetch school data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="w-full h-[60vh] flex items-center justify-center">
                <div className="text-muted font-black uppercase tracking-[0.2em] animate-pulse">Analyzing Campus Data...</div>
            </div>
        );
    }

    const personaData = Object.entries(summary.personaDistribution).map(([name, value], index) => ({
        name: name.split(' ').slice(0, 2).join(' '),
        fullLabel: name,
        value,
        color: ['#6366f1', '#f59e0b', '#f43f5e', '#10b981', '#ec4899', '#8b5cf6'][index % 6]
    })).sort((a, b) => b.value - a.value).slice(0, 4);

    const metrics = [
      { label: "Total Students", value: summary.totalStudents },
      { label: "Avg Attendance", value: `${summary.averageAttendance}%` },
      { label: "Active Sections", value: classes.length },
      { label: "High Risk", value: summary.riskDistribution["High Risk"] || 0 }
    ];

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        window.location.href = "/login";
    };

    return(
        <div className="space-y-8 w-full max-w-full text-foreground">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight leading-none italic uppercase">School Summary</h1>
                <p className="text-[10px] font-bold text-muted uppercase mt-2 tracking-widest">Real-time dynamic data from JSON database</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-rose-500/10 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-rose-500/20 hover:bg-rose-500/20 transition-all"
                >
                    Logout
                </button>
                <div className="w-fit px-4 py-2 bg-card rounded-2xl shadow-sm border border-card-border text-[10px] md:text-sm font-bold text-muted uppercase tracking-widest">
                    Academic Year 2025-26
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-8 bg-card p-8 md:p-12 rounded-[2rem] shadow-sm border border-card-border min-h-[400px] md:min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="flex flex-col md:flex-row items-center gap-12 w-full h-full relative z-10">
                    <div className="relative w-64 h-64 shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={personaData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
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
                                    contentStyle={{borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 900}}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-2xl font-black tracking-tighter">Campus</span>
                            <span className="text-[10px] font-black text-muted uppercase">Archetypes</span>
                        </div>
                    </div>

                    <div className="flex-1 space-y-6">
                        <h3 className="text-xl font-black tracking-tight leading-none italic uppercase">Campus Distribution</h3>
                        <p className="text-sm font-medium text-muted">Aggregated persona data across {classes.length} active sections.</p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {personaData.map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor: item.color}}></div>
                                    <span className="text-[10px] font-bold text-muted uppercase tracking-wider line-clamp-1">{item.name}</span>
                                    <span className="text-xs font-black">{Math.round((item.value/summary.totalStudents)*100)}%</span>
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
                  <button className="text-sm font-black text-foreground/70 hover:text-foreground uppercase tracking-widest">View All {classes.length} Sections</button>
                </div>
                <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
                    {classes.map((cls)=>(
                        <SingleClassOverview key={cls.hash} ClsInfo={cls}/>
                    ))}
                </div>
            </div>
        </div>
    )
}