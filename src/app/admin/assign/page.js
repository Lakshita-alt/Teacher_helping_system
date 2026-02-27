"use client"
import { useState, useEffect } from "react";

export default function AssignClass() {
    const [teachers, setTeachers] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTeacher, setSelectedTeacher] = useState("");
    const [selectedClass, setSelectedClass] = useState("");
    const [assignments, setAssignments] = useState([]);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const [tRes, cRes] = await Promise.all([
                    fetch('/api/teachers'),
                    fetch('/api/classes')
                ]);
                const tData = await tRes.json();
                const cData = await cRes.json();
                setTeachers(tData);
                setClasses(cData);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const handleAssign = () => {
        if (!selectedTeacher || !selectedClass) return;
        
        const teacher = teachers.find(t => t.id === selectedTeacher);
        const cls = classes.find(c => c.hash === selectedClass);
        
        const newAssignment = {
            id: Date.now(),
            teacherId: teacher.id,
            teacherName: teacher.name,
            className: cls.className,
            classHash: cls.hash,
            timestamp: new Date().toLocaleString()
        };
        
        const currentAssignments = JSON.parse(localStorage.getItem('teacher_assignments') || '[]');
        const updatedAssignments = [newAssignment, ...currentAssignments];
        localStorage.setItem('teacher_assignments', JSON.stringify(updatedAssignments));
        
        // For simple demo, we also set the 'current_teacher_class' to the most recent one
        localStorage.setItem('current_teacher_class', JSON.stringify({
            teacherName: teacher.name,
            className: cls.className
        }));

        setAssignments(updatedAssignments);
        setMessage(`Successfully assigned ${cls.className} to ${teacher.name}`);
        setTimeout(() => setMessage(null), 3000);
        
        setSelectedTeacher("");
        setSelectedClass("");
    };

    // Load initial assignments from localStorage
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('teacher_assignments') || '[]');
        setAssignments(saved);
    }, []);

    if (loading) {
        return (
            <div className="w-full h-[60vh] flex items-center justify-center">
                <div className="text-muted font-black uppercase tracking-[0.2em] animate-pulse">Initializing Assignment Suite...</div>
            </div>
        );
    }

    return (
        <div className="space-y-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-700 text-foreground">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-black tracking-tight leading-none italic uppercase">Class Assignment</h1>
                <div className="px-4 py-2 bg-card rounded-2xl shadow-sm border border-card-border text-xs font-black text-muted uppercase tracking-widest">
                    Resource Management
                </div>
            </div>

            {message && (
                <div className="bg-emerald-500 text-white p-4 rounded-2xl font-black text-center text-xs uppercase tracking-widest animate-in slide-in-from-top-2">
                    {message}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Configuration Card */}
                <div className="bg-card p-10 rounded-[3rem] border border-card-border shadow-sm space-y-8">
                    <div className="space-y-2">
                        <h3 className="text-lg font-black uppercase italic tracking-tight">Assignment Config</h3>
                        <p className="text-xs font-bold text-muted uppercase tracking-widest">Link faculty to specific student batches</p>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="px-2 text-[10px] font-black text-muted uppercase tracking-widest">Select Faculty Member</label>
                            <select 
                                value={selectedTeacher}
                                onChange={(e) => setSelectedTeacher(e.target.value)}
                                className="w-full bg-card-muted border border-card-border rounded-2xl py-4 px-6 text-sm font-bold text-foreground outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent appearance-none transition-all cursor-pointer"
                            >
                                <option value="">Select Teacher...</option>
                                {teachers.map(t => <option key={t.id} value={t.id}>{t.name} ({t.subject})</option>)}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="px-2 text-[10px] font-black text-muted uppercase tracking-widest">Select Target Class</label>
                            <select 
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="w-full bg-card-muted border border-card-border rounded-2xl py-4 px-6 text-sm font-bold text-foreground outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent appearance-none transition-all cursor-pointer"
                            >
                                <option value="">Select Class...</option>
                                {classes.map(c => <option key={c.hash} value={c.hash}>{c.className}</option>)}
                            </select>
                        </div>

                        <button 
                            disabled={!selectedTeacher || !selectedClass}
                            onClick={handleAssign}
                            className="w-full bg-foreground text-background font-black py-5 rounded-2xl hover:bg-accent transition-all uppercase tracking-[0.2em] text-xs shadow-xl shadow-accent/10 active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            Authorize Assignment
                        </button>
                    </div>
                </div>

                {/* History Card */}
                <div className="bg-card p-10 rounded-[3rem] border border-card-border shadow-sm flex flex-col h-full">
                    <div className="mb-8">
                        <h3 className="text-lg font-black uppercase italic tracking-tight">Live Registry</h3>
                        <p className="text-xs font-bold text-muted uppercase tracking-widest">Real-time allocation log</p>
                    </div>

                    <div className="flex-1 space-y-3 overflow-y-auto max-h-[400px] pr-2">
                        {assignments.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40 grayscale">
                                <span className="text-4xl mb-4">📋</span>
                                <p className="text-[10px] font-black uppercase tracking-widest">No active assignments in current session</p>
                            </div>
                        ) : (
                            assignments.map(a => (
                                <div key={a.id} className="bg-card-muted p-5 rounded-2xl border border-card-border flex items-center justify-between group">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-black text-foreground uppercase">{a.teacherName}</span>
                                        <span className="text-[9px] font-bold text-muted uppercase tracking-widest">Assigned to {a.className}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[8px] font-black text-muted uppercase block">{a.timestamp}</span>
                                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-tighter">Verified</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
