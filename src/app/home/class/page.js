"use client"
import { useState, useEffect } from "react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { Icon } from "@/component/Icons";

export default function Class() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [className, setClassName] = useState("Global Database");
  const [timeRange, setTimeRange] = useState('This Week');
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [loadingClusterAI, setLoadingClusterAI] = useState(false);
  const [clusterStrategy, setClusterStrategy] = useState("");

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
    { title: "Class Size", value: (summary?.totalStudents || 0).toString(), color: "text-foreground", bg: "bg-foreground/5", icon: "student" },
    { title: "High Risk", value: `${highRiskPercentage}%`, color: "text-rose-500", bg: "bg-rose-500/10", icon: "warning" },
    { title: "Avg. Attendance", value: `${summary?.averageAttendance || 0}%`, color: "text-accent", bg: "bg-accent/10", icon: "trend" },
    { title: "Avg. Study Hours", value: summary?.averageHoursStudied || 0, color: "text-emerald-500", bg: "bg-emerald-500/10", icon: "sparkles" },
  ];

  // Mock data for different timelines
  const timelineData = {
    'This Week': [
      { name: 'Mon', score: 65 },
      { name: 'Tue', score: 58 },
      { name: 'Wed', score: 82 },
      { name: 'Thu', score: 76 },
      { name: 'Fri', score: 91 },
    ],
    'Last Week': [
      { name: 'Mon', score: 45 },
      { name: 'Tue', score: 52 },
      { name: 'Wed', score: 48 },
      { name: 'Thu', score: 61 },
      { name: 'Fri', score: 55 },
    ],
    'Last Month': [
      { name: 'Week 1', score: 50 },
      { name: 'Week 2', score: 62 },
      { name: 'Week 3', score: 58 },
      { name: 'Week 4', score: 75 },
    ]
  };

  const trendData = timelineData[timeRange] || timelineData['This Week'];

  const generateClusterStrategy = async (personaName) => {
    setLoadingClusterAI(true);
    setSelectedCluster(personaName);
    setClusterStrategy("");
    try {
        const res = await fetch('/api/ai/suggestion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                type: 'class', 
                classData: {
                    className,
                    total: summary.totalStudents,
                    personas: { [personaName]: summary.personaDistribution[personaName] }
                } 
            })
        });
        const data = await res.json();
        setClusterStrategy(data.suggestion);
    } catch (e) {
        setClusterStrategy("Failed to generate batch strategy.");
    } finally {
        setLoadingClusterAI(false);
    }
  };

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
            <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform text-foreground`}>
              <Icon name={stat.icon} className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] leading-none mb-1">{stat.title}</p>
              <p className={`text-2xl font-black ${stat.color} tracking-tighter`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Trend Graph */}
        <div className="bg-card p-8 rounded-[3rem] shadow-sm border border-card-border flex flex-col h-[450px]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h3 className="text-lg font-black uppercase tracking-tight leading-none italic">Class Performance Trend</h3>
              <p className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1">Timeline Analytics Simulation</p>
            </div>
            
            <div className="flex bg-card-muted p-1 rounded-xl border border-card-border">
              {Object.keys(timelineData).map(range => (
                <button 
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${timeRange === range ? 'bg-foreground text-background shadow-lg dark:shadow-none' : 'text-muted hover:text-foreground'}`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--sidebar-border)" />
                <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10, fontWeight: 900, fill: 'var(--muted)'}}
                    dy={10}
                />
                <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10, fontWeight: 900, fill: 'var(--muted)'}}
                />
                <Tooltip 
                    contentStyle={{borderRadius: '1rem', border: '1px solid var(--card-border)', backgroundColor: 'var(--card)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 900, color: 'var(--foreground)'}}
                />
                <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="var(--accent)" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorScore)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cluster Strategy Engine */}
        <div className="bg-card p-8 rounded-[3rem] shadow-sm border border-card-border flex flex-col min-h-[450px]">
          <div className="flex justify-between items-center mb-8">
            <div>
                <h3 className="text-lg font-black uppercase tracking-tight italic leading-none">Cluster Strategy Engine</h3>
                <p className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1">Batch Instructional Scaffolding</p>
            </div>
            <div className="w-10 h-10 bg-accent/10 text-accent rounded-xl flex items-center justify-center">
                <Icon name="target" className="w-5 h-5" />
            </div>
          </div>
          
          <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
            {personaData.map((item, i) => (
              <div key={i} className={`p-6 rounded-[2rem] border transition-all ${selectedCluster === item.fullLabel ? 'bg-accent/5 border-accent' : 'bg-card-muted/50 border-card-border hover:border-accent/30'}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}} />
                        <div>
                            <h4 className="font-black text-sm uppercase tracking-tight text-foreground">{item.fullLabel}</h4>
                            <p className="text-[10px] font-bold text-muted uppercase">{item.value} Students in this cluster</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => generateClusterStrategy(item.fullLabel)}
                        disabled={loadingClusterAI && selectedCluster === item.fullLabel}
                        className="px-6 py-2 bg-foreground text-background rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-accent transition-all disabled:opacity-50"
                    >
                        {loadingClusterAI && selectedCluster === item.fullLabel ? "Synthesizing..." : "Generate Batch Plan"}
                    </button>
                </div>

                {selectedCluster === item.fullLabel && clusterStrategy && (
                    <div className="mt-6 p-5 bg-card rounded-2xl border border-accent/20 animate-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                            <p className="text-[9px] font-black text-accent uppercase tracking-widest">Qualitative Cluster Insight</p>
                        </div>
                        <p className="text-xs font-medium leading-relaxed italic text-foreground/80">
                            {clusterStrategy}
                        </p>
                    </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Summary Card */}
      <div className="bg-sidebar p-10 rounded-[3rem] text-foreground border border-card-border relative overflow-hidden group shadow-lg dark:shadow-none">
        <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:rotate-12 transition-transform">
          <Icon name="bolt" className="w-32 h-32" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h3 className="text-accent font-black uppercase tracking-[0.2em] text-[10px] mb-4">Class-Wide Catalyst Analysis</h3>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center border border-rose-500/20">
                <Icon name="warning" className="w-6 h-6" />
            </div>
            <div>
                <p className="text-[10px] font-black text-muted uppercase tracking-widest">Primary Risk Driver</p>
                <h4 className="text-xl font-black text-foreground uppercase italic tracking-tight">{summary.riskCatalyst?.label || "Calculating..."}</h4>
            </div>
          </div>
          
          <p className="text-muted font-medium leading-relaxed mb-6 italic">
            The model indicates that <span className="text-rose-500 font-black">{summary.riskCatalyst?.percentage}%</span> of your high-risk students are being triggered by this specific catalyst. 
            Recommended focus: Prioritize collective classroom scaffolding that addresses this root cause over individual remediation.
          </p>

          <button className="bg-foreground text-background font-black py-4 px-8 rounded-2xl hover:bg-accent transition-colors uppercase tracking-widest text-xs shadow-xl dark:shadow-none">
            Download Class Scaffolding Plan
          </button>
        </div>
      </div>

    </div>
  );
}