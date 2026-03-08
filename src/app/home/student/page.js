"use client"
import { useState, useEffect, useMemo, useCallback } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Icon } from "@/component/Icons";

export default function StudentSummary(){
    const [searchName, setSearchName] = useState("");
    const [riskFilter, setRiskFilter] = useState("");
    const [attendanceFilter, setAttendanceFilter] = useState(0);
    
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [loadingAI, setLoadingAI] = useState(false);
    const [aiSuggestion, setAiSuggestion] = useState("");
    const [feedbackStatus, setFeedbackStatus] = useState("none");
    const [mentorRemarks, setMentorRemarks] = useState([]);
    const [newRemark, setNewRemark] = useState("");
    const [savingRemark, setSavingRemark] = useState(false);

    const handleOverride = async (type) => {
        if (!selectedStudent) return;
        try {
            const res = await fetch('/api/student/override', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    id: selectedStudent.id, 
                    overrideData: { type, label: type === 'snooze' ? 'Snoozed' : 'Low Priority' } 
                })
            });
            const data = await res.json();
            alert(data.message);
            // Refresh student data
            const refreshRes = await fetch(`/api/student/${selectedStudent.id}`);
            const refreshData = await refreshRes.json();
            setSelectedStudent(refreshData);
        } catch (e) {
            alert("Failed to apply manual override.");
        }
    };

    useEffect(() => {
        async function fetchStudents() {
            try {
                const stored = localStorage.getItem('teacher_auth');
                let className = null;
                if (stored) {
                    const auth = JSON.parse(stored);
                    className = auth.className;
                }

                const url = className ? `/api/students?className=${encodeURIComponent(className)}` : '/api/students';
                const res = await fetch(url);
                const data = await res.json();
                
                setStudents(data);
            } catch (error) {
                console.error("Failed to fetch students:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchStudents();
    }, []);

    const personas = useMemo(() => Array.from(new Set(students.map(s => s.Persona))).filter(Boolean), [students]);
    const riskCategories = useMemo(() => Array.from(new Set(students.map(s => s.Risk_Category))).filter(Boolean), [students]);

    const handleStudentClick = async (student) => {
        setLoadingDetails(true);
        setAiSuggestion("");
        setFeedbackStatus("none");
        setMentorRemarks([]);
        setNewRemark("");
        try {
            const [detailRes, remarksRes] = await Promise.all([
                fetch(`/api/student/${student.id}`),
                fetch(`/api/mentor-remarks?studentId=${student.id}`),
            ]);
            const data = await detailRes.json();
            const remarksData = await remarksRes.json();
            setSelectedStudent(data);
            setMentorRemarks(remarksData.remarks || []);
        } catch (error) {
            console.error("Failed to fetch student details:", error);
        } finally {
            setLoadingDetails(false);
        }
    };

    const saveRemark = async () => {
        if (!newRemark.trim() || !selectedStudent) return;
        setSavingRemark(true);
        try {
            const res = await fetch("/api/mentor-remarks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ studentId: selectedStudent.id, text: newRemark }),
            });
            const data = await res.json();
            setMentorRemarks((prev) => [...prev, data.remark]);
            setNewRemark("");
        } catch (error) {
            console.error("Failed to save remark:", error);
        } finally {
            setSavingRemark(false);
        }
    };

    const deleteRemark = async (remarkId) => {
        try {
            await fetch("/api/mentor-remarks", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ studentId: selectedStudent.id, remarkId }),
            });
            setMentorRemarks((prev) => prev.filter((r) => r.id !== remarkId));
        } catch (error) {
            console.error("Failed to delete remark:", error);
        }
    };

    const generateAISuggestion = async () => {
        if (!selectedStudent) return;
        setLoadingAI(true);
        try {
            const aiRes = await fetch('/api/ai/suggestion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'student', id: selectedStudent.id })
            });
            const aiData = await aiRes.json();
            setAiSuggestion(aiData?.suggestion || "AI suggestion unavailable.");
        } catch (error) {
            console.error("Failed to fetch AI data:", error);
            setAiSuggestion("Error: Quota might be exceeded. Try again in a minute.");
        } finally {
            setLoadingAI(false);
        }
    };

    const filteredStudents = useMemo(() => students.filter(student => {
        const matchesSearch = !searchName ||
            (student.name && student.name.toLowerCase().includes(searchName.toLowerCase())) ||
            student.Persona.toLowerCase().includes(searchName.toLowerCase()) ||
            student.id.includes(searchName);
        const matchesRisk = !riskFilter || student.Risk_Category === riskFilter;
        const matchesAttendance = parseFloat(student.Attendance) >= attendanceFilter;
        return matchesSearch && matchesRisk && matchesAttendance;
    }), [students, searchName, riskFilter, attendanceFilter]);

    const exportToCSV = useCallback(() => {
        const headers = ["ID", "Name", "Persona", "Risk Category", "Risk Score", "Attendance", "Hours Studied"];
        const rows = filteredStudents.slice(0, 500).map(s =>
            [s.id, s.name, s.Persona, s.Risk_Category, s.Risk_Score, s.Attendance, s.Hours_Studied]
                .map(v => `"${String(v ?? '').replace(/"/g, '""')}"`)
        );
        const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "student_report.csv";
        link.click();
        URL.revokeObjectURL(url);
    }, [filteredStudents]);

    return (
        <div className="flex flex-col xl:flex-row gap-8 w-full min-h-[calc(100vh-6rem)] text-foreground font-mono">
            {/* Search & Filter Sidebar */}
            <div className="w-full xl:w-[25vw] max-w-md flex flex-col gap-6">
                <div className="bg-card p-6 rounded-[2.5rem] border border-card-border shadow-sm space-y-4">
                    <div className="flex justify-between items-center mb-2">
                        <label className="px-2 text-[10px] font-black text-muted uppercase tracking-[0.2em]">Filters</label>
                        <div className="flex gap-2">
                            <button onClick={exportToCSV} className="text-[9px] font-black bg-emerald-500/10 text-emerald-600 px-2 py-1 rounded-lg border border-emerald-500/20">CSV</button>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="relative">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-muted"><Icon name="search" className="w-4 h-4" /></span>
                            <input type="text" 
                                className="w-full bg-card-muted border border-card-border rounded-2xl py-3 pl-12 pr-6 text-xs font-bold text-foreground outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all shadow-inner" 
                                placeholder="Name or ID..." 
                                onChange={(e) => setSearchName(e.target.value)} 
                            />
                        </div>

                        <select className="w-full bg-card-muted border border-card-border rounded-xl py-3 px-4 text-xs font-bold text-foreground outline-none"
                            onChange={(e) => setRiskFilter(e.target.value)} value={riskFilter}>
                            <option value="">All Risk Categories</option>
                            {riskCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>

                        <div className="space-y-1">
                            <div className="flex justify-between px-2"><span className="text-[10px] font-black text-muted uppercase">Min Attendance</span><span className="text-[10px] font-black text-foreground">{attendanceFilter}%</span></div>
                            <input type="range" min="0" max="100" value={attendanceFilter} onChange={(e) => setAttendanceFilter(parseInt(e.target.value))} className="w-full h-1.5 bg-card-muted rounded-lg appearance-none cursor-pointer accent-accent" />
                        </div>
                    </div>
                </div>

                <div className="bg-card rounded-[2.5rem] border border-card-border p-4 shadow-sm flex flex-col gap-1 overflow-y-auto max-h-[70vh] xl:max-h-[80vh]">
                    <div className="px-4 py-3 mb-2 flex justify-between items-center">
                        <h3 className="text-xs font-black text-muted uppercase tracking-widest">Results</h3>
                        <span className="text-[10px] font-bold bg-card-muted px-2 py-0.5 rounded-full text-muted border border-card-border">
                            {loading ? "..." : filteredStudents.length}
                        </span>
                    </div>
                    {loading ? (
                        <div className="p-4 text-center text-muted font-bold animate-pulse uppercase tracking-widest text-[10px]">Loading...</div>
                    ) : filteredStudents.slice(0, 100).map((student) => (
                        <button 
                            key={student.id} 
                            onClick={() => handleStudentClick(student)}
                            className={`w-full rounded-2xl p-4 transition-all font-bold text-sm border flex items-center justify-between group ${selectedStudent?.id === student.id ? 'bg-accent/10 border-accent text-accent shadow-sm dark:shadow-none' : 'bg-transparent text-muted border-transparent hover:bg-card-muted hover:border-card-border'}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] transition-colors border ${student.performanceAlert ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : student.Risk_Category === 'High Risk' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-card-muted border-card-border text-muted group-hover:bg-card'}`}>
                                    {student.performanceAlert ? <Icon name="trend" className="w-4 h-4" /> : student.Risk_Category === 'High Risk' ? <Icon name="warning" className="w-4 h-4" /> : <Icon name="student" className="w-4 h-4" />}
                                </div>
                                <div className="flex flex-col items-start">
                                    <div className="flex items-center gap-2">
                                        <span className="text-foreground text-left line-clamp-1 text-xs">{student.name}</span>
                                        {student.performanceAlert && <span className="text-[8px] font-black bg-amber-500 text-white px-1 rounded uppercase tracking-tighter">Drop</span>}
                                    </div>
                                    <span className="text-[9px] text-muted line-clamp-1">{student.Persona}</span>
                                </div>
                            </div>
                            <span className="text-[10px] text-muted opacity-0 group-hover:opacity-100 transition-opacity">ID: {student.id}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Analysis Grid */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 content-start pb-8">
                {loadingDetails ? (
                     <div className="col-span-full h-64 flex items-center justify-center bg-card rounded-[3rem] border border-card-border">
                        <div className="text-muted font-black uppercase tracking-[0.2em] animate-pulse">Analyzing Trend Data...</div>
                     </div>
                ) : selectedStudent ? (
                    <>
                        {/* Profile Info */}
                        <div className="bg-card p-8 rounded-[3rem] shadow-sm border border-card-border group">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-14 h-14 bg-foreground/5 rounded-2xl flex items-center justify-center text-2xl border border-card-border/50 text-foreground"><Icon name="student" className="w-8 h-8" /></div>
                                {parseFloat(selectedStudent.Risk_Score) > 0.4 && (
                                    <div className="px-4 py-1.5 bg-rose-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm dark:shadow-none">Predictive Alert</div>
                                )}
                            </div>
                            <h3 className="text-foreground/70 font-black uppercase tracking-[0.2em] text-[10px] mb-4">Identity Overview</h3>
                            <div className="text-2xl font-black text-foreground tracking-tight mb-2 uppercase italic leading-none">{selectedStudent.name}</div>
                            <p className="text-[10px] font-bold text-muted uppercase tracking-widest italic">{selectedStudent.Persona}</p>
                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <div><p className="text-[9px] font-black text-muted uppercase">Attendance</p><p className="text-lg font-black">{selectedStudent.Attendance}%</p></div>
                                <div>
                                    <p className="text-[9px] font-black text-muted uppercase">Risk Level</p>
                                    <div className="flex items-center gap-2">
                                        <p className={`text-lg font-black ${selectedStudent.pedagogicalOverride ? 'text-blue-500 opacity-50 line-through' : selectedStudent.Risk_Category === 'High Risk' ? 'text-rose-500' : 'text-emerald-500'}`}>
                                            {selectedStudent.Risk_Category}
                                        </p>
                                        {selectedStudent.pedagogicalOverride && (
                                            <span className="bg-blue-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter">
                                                {selectedStudent.pedagogicalOverride.label}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Trend Analysis Chart */}
                        <div className="bg-card p-8 rounded-[3rem] shadow-sm border border-card-border flex flex-col min-h-[300px]">
                            <h3 className="text-accent font-black uppercase tracking-[0.2em] text-[10px] mb-6">Performance Trend (MoM)</h3>
                            <div className="flex-1 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={selectedStudent.trends}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--sidebar-border)" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: 'var(--muted)'}} />
                                        <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: 'var(--muted)'}} />
                                        <Tooltip contentStyle={{backgroundColor: 'var(--card)', borderRadius: '1rem', border: '1px solid var(--card-border)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 900, color: 'var(--foreground)'}} />
                                        <Line type="monotone" dataKey="score" stroke="var(--accent)" strokeWidth={4} dot={{ r: 6, fill: 'var(--accent)', strokeWidth: 0 }} activeDot={{ r: 8, strokeWidth: 0 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>


                        {/* Longitudinal Behavioral Evolution */}
                        {(() => {
                            const trends = selectedStudent.trends || [];
                            const pulse = selectedStudent.dailyPulse || [];
                            const avgPulse = pulse.length
                                ? Math.round(pulse.reduce((s, p) => s + p.participation, 0) / pulse.length)
                                : null;
                            const pulsePerMonth = trends.map((t, i) => {
                                const slice = pulse.slice(
                                    Math.floor((i / trends.length) * pulse.length),
                                    Math.floor(((i + 1) / trends.length) * pulse.length)
                                );
                                return slice.length
                                    ? Math.round(slice.reduce((s, p) => s + p.participation, 0) / slice.length)
                                    : avgPulse;
                            });
                            const timeline = trends.map((t, i) => {
                                const prev = trends[i - 1];
                                const delta = prev ? t.score - prev.score : 0;
                                const state = t.score >= 75 ? 'Active' : t.score >= 65 ? 'Steady' : 'Declining';
                                const pulseScore = pulsePerMonth[i];
                                const desc = i === 0
                                    ? `Baseline ${t.score} — pulse ${pulseScore ?? '—'}`
                                    : delta > 5 ? `+${delta} pts — strong gain, pulse ${pulseScore ?? '—'}`
                                    : delta > 0 ? `+${delta} pts — improving, pulse ${pulseScore ?? '—'}`
                                    : delta === 0 ? `Stable at ${t.score}, pulse ${pulseScore ?? '—'}`
                                    : delta > -5 ? `${delta} pts — minor dip, pulse ${pulseScore ?? '—'}`
                                    : `${delta} pts — needs attention, pulse ${pulseScore ?? '—'}`;
                                return { month: t.month, state, score: t.score, delta, desc };
                            });
                            return (
                                <div className="bg-card p-10 rounded-[3rem] shadow-sm border border-card-border md:col-span-2">
                                    <div className="flex justify-between items-center mb-10">
                                        <div>
                                            <h3 className="text-accent font-black uppercase tracking-[0.2em] text-[10px]">Longitudinal Evolution</h3>
                                            <p className="text-2xl font-black text-foreground italic">Behavioral Narrative Timeline</p>
                                        </div>
                                        <Icon name="newspaper" className="w-8 h-8 text-accent opacity-20" />
                                    </div>
                                    <div className="relative">
                                        <div className="absolute top-6 left-0 right-0 h-0.5 bg-card-muted" />
                                        <div className={`relative grid gap-4`} style={{gridTemplateColumns: `repeat(${timeline.length}, 1fr)`}}>
                                            {timeline.map((m, i) => (
                                                <div key={i} className="flex flex-col items-center text-center gap-4 relative z-10">
                                                    <div className={`w-12 h-12 rounded-full border-4 border-card flex items-center justify-center shadow-lg transition-transform hover:scale-110 ${
                                                        m.state === 'Active' ? 'bg-emerald-500' : m.state === 'Steady' ? 'bg-blue-500' : 'bg-rose-500'
                                                    }`}>
                                                        <span className="text-[9px] font-black text-white">{m.score}</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-muted uppercase tracking-widest">{m.month}</p>
                                                        <p className={`text-xs font-black uppercase ${m.state === 'Active' ? 'text-emerald-500' : m.state === 'Steady' ? 'text-blue-500' : 'text-rose-500'}`}>{m.state}</p>
                                                        <p className="text-[9px] font-medium text-muted mt-1 leading-tight max-w-[100px] mx-auto">{m.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Qualitative Learning Dynamic */}
                        <div className="bg-card p-10 rounded-[3rem] shadow-sm border border-card-border hover:shadow-xl dark:hover:shadow-none transition-all duration-500">
                            <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center text-2xl mb-6 border border-card-border/50 text-accent"><Icon name="search" className="w-8 h-8" /></div>
                            <h3 className="text-accent font-black uppercase tracking-[0.2em] text-[10px] mb-4">Behavioral Synthesis</h3>
                            <div className="text-2xl font-black text-foreground tracking-tight mb-2 uppercase italic">Learning Dynamic</div>
                            
                            <div className="mt-4 space-y-4">
                                <div className="p-5 bg-card-muted border border-card-border rounded-2xl">
                                    <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-2">Qualitative Assessment:</p>
                                    <p className="text-sm font-medium leading-relaxed italic text-foreground/80">
                                        {parseFloat(selectedStudent.Attendance) < 70 ? "Exhibiting a pattern of 'Fragmented Presence' which disrupts the sequential logic of the curriculum." : 
                                         selectedStudent.Motivation_Level === 'Low' ? "Reflecting 'Cognitive Detachment'; student is present physically but shows minimal evidence of active conceptual inquiry." :
                                         "Demonstrating 'Emergent Mastery'; student maintains baseline engagement but lacks the deep-work stamina for advanced complexity."}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="p-4 bg-foreground/5 rounded-xl border border-card-border">
                                        <p className="text-[8px] font-black text-muted uppercase mb-1">Social Influence</p>
                                        <p className="text-xs font-bold">{parseFloat(selectedStudent.Peer_Influence) >= 2 ? 'Collaborative Catalyst' : parseFloat(selectedStudent.Peer_Influence) >= 1 ? 'Neutral Interaction' : 'Distraction-Prone Interaction'}</p>
                                    </div>
                                    <div className="p-4 bg-foreground/5 rounded-xl border border-card-border">
                                        <p className="text-[8px] font-black text-muted uppercase mb-1">Intrinsic Drive</p>
                                        <p className="text-xs font-bold">{parseFloat(selectedStudent.Motivation_Level) >= 2 ? 'High Persistence' : parseFloat(selectedStudent.Motivation_Level) >= 1 ? 'Steady' : 'Minimal Inquiry'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mentor Remarks */}
                        <div className="bg-card p-10 rounded-[3rem] shadow-sm border border-card-border hover:shadow-xl dark:hover:shadow-none transition-all duration-500 group">
                            <div className="flex justify-between items-center mb-6">
                                <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-2xl border border-card-border/50 text-indigo-500"><Icon name="student" className="w-8 h-8" /></div>
                            </div>
                            <h3 className="text-indigo-500 font-black uppercase tracking-[0.2em] text-[10px] mb-4">Social Scaffolding</h3>
                            <div className="text-2xl font-black text-foreground tracking-tight mb-2 uppercase italic">Mentor Synergy</div>

                            <div className="mt-6 space-y-3 mb-4">
                                {mentorRemarks.length === 0 ? (
                                    <p className="text-[10px] text-muted font-medium italic">No remarks yet.</p>
                                ) : (
                                    mentorRemarks.map((r) => (
                                        <div key={r.id} className="flex items-start justify-between gap-3 p-4 bg-card-muted rounded-2xl border border-card-border group/remark">
                                            <div>
                                                <p className="text-xs font-medium text-foreground leading-relaxed">{r.text}</p>
                                                <p className="text-[9px] text-muted mt-1">{new Date(r.timestamp).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                            </div>
                                            <button
                                                onClick={() => deleteRemark(r.id)}
                                                className="text-muted hover:text-rose-500 transition-colors opacity-0 group-hover/remark:opacity-100 shrink-0 text-[10px] font-black uppercase"
                                            >
                                                <Icon name="close" className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newRemark}
                                    onChange={(e) => setNewRemark(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && saveRemark()}
                                    placeholder="Add a remark..."
                                    className="flex-1 bg-card-muted border border-card-border rounded-2xl py-3 px-4 text-xs font-medium text-foreground outline-none focus:border-indigo-500 transition-colors"
                                />
                                <button
                                    onClick={saveRemark}
                                    disabled={savingRemark || !newRemark.trim()}
                                    className="px-4 py-3 bg-indigo-500 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all disabled:opacity-40"
                                >
                                    {savingRemark ? "..." : "Save"}
                                </button>
                            </div>
                        </div>

                        {/* AI Feedback Loop (Risk Override) */}
                        <div className="bg-card p-10 rounded-[3rem] shadow-sm border border-card-border hover:shadow-xl dark:hover:shadow-none transition-all duration-500">
                            <div className="w-14 h-14 bg-slate-500/10 rounded-2xl flex items-center justify-center text-2xl border border-card-border/50 text-slate-500"><Icon name="shield" className="w-8 h-8" /></div>
                            <h3 className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px] mb-4">Pedagogical Oversight</h3>
                            <div className="text-2xl font-black text-foreground tracking-tight mb-2 uppercase italic">Manual Adjustment</div>
                            
                            {selectedStudent.pedagogicalOverride ? (
                                <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-4">
                                    <Icon name="shield" className="w-6 h-6 text-emerald-500" />
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">Active Manual Override</p>
                                        <p className="text-xs font-bold text-foreground">Status: {selectedStudent.pedagogicalOverride.label}</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-muted text-sm font-medium leading-relaxed mt-4">
                                    Do you disagree with the AI&apos;s risk assessment? Manually override the status to recalibrate the model for this specific case.
                                </p>
                            )}

                            <div className="mt-8 flex flex-col gap-3">
                                <button 
                                    onClick={() => handleOverride('snooze')}
                                    className="w-full p-4 rounded-2xl bg-card-muted border border-card-border text-xs font-black uppercase tracking-widest hover:bg-emerald-500/10 hover:text-emerald-600 hover:border-emerald-500/20 transition-all flex items-center justify-between px-6"
                                >
                                    <span>Snooze Alerts (7 Days)</span>
                                    <Icon name="calendar" className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={() => handleOverride('low-priority')}
                                    className="w-full p-4 rounded-2xl bg-card-muted border border-card-border text-xs font-black uppercase tracking-widest hover:bg-rose-500/10 hover:text-rose-600 hover:border-rose-500/20 transition-all flex items-center justify-between px-6"
                                >
                                    <span>Mark as Low Priority</span>
                                    <Icon name="close" className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Gemini AI Strategy */}
                        <div className="bg-card p-10 rounded-[3rem] shadow-sm border border-card-border hover:shadow-xl dark:hover:shadow-none transition-all duration-500 group">
                            <div className="flex justify-between items-center mb-6">
                                <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-2xl border border-card-border/50 text-emerald-500"><Icon name="bolt" className="w-8 h-8" /></div>
                                {!aiSuggestion && (
                                    <button 
                                        disabled={loadingAI}
                                        onClick={generateAISuggestion}
                                        className="bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl shadow-md dark:shadow-none hover:bg-emerald-600 transition-all disabled:opacity-50"
                                    >
                                        {loadingAI ? "Consulting Gemini..." : "Generate AI Strategy"}
                                    </button>
                                )}
                            </div>
                            <h3 className="text-emerald-500 font-black uppercase tracking-[0.2em] text-[10px] mb-4">Gemini AI Strategy</h3>
                            <div className="text-2xl font-black text-foreground tracking-tight mb-2 uppercase italic">Targeted Intervention</div>
                            <div className="text-muted text-sm font-medium leading-relaxed mt-4 whitespace-pre-wrap">
                                {aiSuggestion || "AI analysis is ready. Click the button above to generate a personalized intervention roadmap for this student based on their unique learning pattern."}
                            </div>
                            
                            {aiSuggestion && (
                                <div className="mt-8 pt-6 border-t border-card-border flex items-center justify-between animate-in fade-in">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted">Was this helpful?</p>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => setFeedbackStatus('helpful')}
                                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${feedbackStatus === 'helpful' ? 'bg-emerald-500 text-white' : 'bg-card-muted hover:bg-emerald-500/10 hover:text-emerald-500'}`}
                                        >
                                            Helpful
                                        </button>
                                        <button 
                                            onClick={() => setFeedbackStatus('not-helpful')}
                                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${feedbackStatus === 'not-helpful' ? 'bg-rose-500 text-white' : 'bg-card-muted hover:bg-rose-500/10 hover:text-rose-500'}`}
                                        >
                                            Not Helpful
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="col-span-full h-full flex flex-col items-center justify-center bg-card rounded-[3rem] border border-card-border p-12 text-center text-foreground">
                        <Icon name="trend" className="w-20 h-20 mb-6 opacity-40" />
                        <h2 className="text-2xl font-black uppercase italic mb-2">Analytics Center</h2>
                        <p className="text-muted font-bold text-xs uppercase tracking-widest">Select a student profile to generate predictive alerts and trend analysis</p>
                    </div>
                )}
            </div>
        </div>
    )
}