"use client"
import { useState, useEffect } from "react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';

export default function Class() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [className, setClassName] = useState("Global Database");

  useEffect(() => {
    async function fetchSummary() {
      try {
        const stored = localStorage.getItem('teacher_auth');
        let assignedClass = null;
        if (stored) {
            const auth = JSON.parse(stored);
            assignedClass = auth.className;
            if (assignedClass) setClassName(assignedClass);
        }

        let url = '/api/class-summary';
        if (assignedClass) {
            url = `/api/class-summary/${encodeURIComponent(assignedClass)}`;
        }

        const res = await fetch(url);
        const data = await res.json();
        setSummary(data);
      } catch (error) {
        console.error("Failed to fetch class summary:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSummary();
  }, []);

  if (loading || !summary) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center font-mono">
        <div className="text-muted font-black uppercase tracking-[0.2em] animate-pulse">Loading Class Analytics...</div>
      </div>
    );
  }

  const highRiskCount = summary?.riskDistribution?.["High Risk"] || 0;
  const highRiskPercentage = ((highRiskCount / (summary?.totalStudents || 1)) * 100).toFixed(1);

  const stats = [
    { title: "Class Size", value: (summary?.totalStudents || 0).toString(), color: "text-indigo-600", bg: "bg-indigo-50", icon: "👥" },
    { title: "High Risk", value: `${highRiskPercentage}%`, color: "text-rose-600", bg: "bg-rose-50", icon: "⚠️" },
    { title: "Avg. Attendance", value: `${summary?.averageAttendance || 0}%`, color: "text-amber-600", bg: "bg-amber-50", icon: "📈" },
    { title: "Avg. Study Hours", value: summary?.averageHoursStudied || 0, color: "text-emerald-600", bg: "bg-emerald-50", icon: "✨" },
  ];

  // Mock data for trend since CSV doesn't have time series
  const trendData = [
    { name: 'Mon', score: 65 },
    { name: 'Tue', score: 58 },
    { name: 'Wed', score: 82 },
    { name: 'Thu', score: 76 },
    { name: 'Fri', score: 91 },
  ];

  const personaColors = ['#6366f1', '#f59e0b', '#10b981', '#64748b', '#ec4899', '#8b5cf6'];
  const personaData = Object.entries(summary?.personaDistribution || {}).map(([name, value], index) => ({
    name: name.split(' ').slice(0, 2).join(' '), // Shorten name
    value,
    fullLabel: name,
    color: personaColors[index % personaColors.length]
  })).sort((a, b) => b.value - a.value).slice(0, 5);

  return (
    <div className="space-y-8 w-full animate-in fade-in duration-700 text-foreground font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase italic">{className} Analysis</h1>
          <p className="text-muted font-bold text-xs uppercase tracking-widest mt-1">Focused Class Intelligence • Dynamic Insights</p>
        </div>
        <div className="px-4 py-2 bg-card rounded-2xl shadow-sm border border-card-border text-xs font-black text-muted uppercase tracking-widest">
          Last Updated: {new Date().toLocaleDateString()}
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
        {/* Performance Trend Graph */}
        <div className="bg-card p-8 rounded-[3rem] shadow-sm border border-card-border flex flex-col h-[400px]">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-black uppercase tracking-tight leading-none italic">Weekly Performance Trend</h3>
              <p className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1">Class Proficiency Simulation</p>
            </div>
            <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">+4.2% Growth</span>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10, fontWeight: 900, fill: '#888888'}}
                    dy={10}
                />
                <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10, fontWeight: 900, fill: '#888888'}}
                />
                <Tooltip 
                    contentStyle={{borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 900}}
                />
                <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#6366f1" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorScore)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Persona Distribution (Bar Graph) */}
        <div className="bg-card p-8 rounded-[3rem] shadow-sm border border-card-border flex flex-col h-[400px]">
          <h3 className="text-lg font-black uppercase tracking-tight mb-8 italic">Learning Personas (Top 5)</h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={personaData} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" hide />
                <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{fontSize: 10, fontWeight: 900, fill: '#888888'}}
                    width={100}
                />
                <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 900}}
                />
                <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={20}>
                  {personaData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
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
          <h4 className="text-2xl font-black mb-4 tracking-tight">Intervention Strategy for {highRiskCount} Students</h4>
          <p className="text-muted font-medium leading-relaxed">
            The database shows {highRiskPercentage}% of students are in the high-risk category. Most common persona is "{personaData[0]?.fullLabel}". 
            Recommended: Prioritize one-on-one sessions for students with attendance below 60%.
          </p>
          <button className="mt-8 bg-foreground text-background font-black py-4 px-8 rounded-2xl hover:bg-accent transition-colors uppercase tracking-widest text-xs shadow-xl shadow-accent/20">
            Export Targeted Plan
          </button>
        </div>
      </div>

    </div>
  );
}