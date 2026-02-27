"use client"
import { useState, useEffect } from "react";

export default function Teacher() {
    const [searchPersona, setSearchPersona] = useState("");
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState(null);

    useEffect(() => {
        async function fetchStudents() {
            try {
                const token = localStorage.getItem('teacher_token');
                let className = null;
                if (token) {
                    try {
                        const payload = JSON.parse(atob(token));
                        className = payload.className;
                    } catch (e) { console.error("Auth error", e); }
                }

                const res = await fetch('/api/students');
                const data = await res.json();
                
                if (className) {
                    setStudents(data.filter(s => s.className === className));
                } else {
                    setStudents(data);
                }
            } catch (error) {
                console.error("Failed to fetch students:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchStudents();
    }, []);

    const personas = Array.from(new Set(students.map(s => s.Risk_Category))).filter(Boolean);

    const filteredStudents = students.filter(student => 
        !searchPersona || student.Risk_Category === searchPersona
    );

    return (
        <div className="flex flex-col xl:flex-row gap-8 w-full min-h-[calc(100vh-6rem)] text-foreground font-mono">
            {/* Sidebar Search Area */}
            <div className="w-full xl:w-[25vw] max-w-md flex flex-col gap-6">
                <div className="space-y-4 bg-card p-6 rounded-[2.5rem] border border-card-border shadow-sm">
                    <div className="flex flex-col gap-2">
                        <label className="px-2 text-[10px] font-black text-muted uppercase tracking-[0.2em]">Filter by Risk Category</label>
                        <div className="relative">
                            <select className="w-full bg-card-muted border border-card-border rounded-2xl py-4 px-6 text-sm font-bold text-foreground outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent appearance-none transition-all cursor-pointer"
                                onChange={(e) => { setSearchPersona(e.target.value) }} value={searchPersona}
                            >
                                <option value="">All Categories</option>
                                {personas.map((persona) => {
                                    return (<option key={persona} value={persona}>
                                        {persona}
                                    </option>
                                    )
                                })}
                            </select>
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted">▼</span>
                        </div>
                    </div>
                </div>

                <div className="bg-card rounded-[2.5rem] border border-card-border p-4 shadow-sm flex flex-col gap-1 overflow-y-auto max-h-[50vh] xl:max-h-[60vh]">
                    <div className="px-4 py-3 mb-2 flex justify-between items-center">
                        <h3 className="text-xs font-black text-muted uppercase tracking-widest">Student List</h3>
                        <span className="text-[10px] font-bold bg-card-muted px-2 py-0.5 rounded-full text-muted border border-card-border">
                            {loading ? "..." : filteredStudents.length}
                        </span>
                    </div>
                    {loading ? (
                        <div className="p-4 text-center text-muted font-bold animate-pulse uppercase tracking-widest text-[10px]">Loading...</div>
                    ) : filteredStudents.slice(0, 100).map((student) => (
                        <button 
                            key={student.id} 
                            onClick={() => setSelectedStudent(student)}
                            className={`w-full rounded-2xl p-4 transition-all font-bold text-sm border flex items-center gap-3 group ${selectedStudent?.id === student.id ? 'bg-accent/10 border-accent text-accent' : 'bg-transparent text-muted border-transparent hover:bg-card-muted hover:border-card-border'}`}
                        >
                            <div className="w-8 h-8 rounded-xl bg-card-muted flex items-center justify-center text-[10px] group-hover:bg-card transition-colors border border-card-border">👤</div>
                            <div className="flex flex-col items-start overflow-hidden">
                                <span className="leading-tight text-foreground line-clamp-1">{student.name}</span>
                                <span className="text-[9px] font-medium text-muted opacity-0 group-hover:opacity-100 transition-opacity">ID: {student.id} • {student.Persona}</span>
                            </div>
                        </button>
                    ))}
                    {!loading && filteredStudents.length > 100 && (
                        <div className="p-4 text-center text-muted text-[10px] font-bold uppercase tracking-widest">Showing first 100</div>
                    )}
                </div>
            </div>

            {/* Content Cards Area */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 content-start">
                {selectedStudent ? (
                    <>
                        <div className="bg-card p-10 rounded-[3rem] shadow-sm border border-card-border hover:shadow-xl hover:shadow-accent/5 transition-all duration-500 group">
                            <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform border border-card-border/50">🆔</div>
                            <h3 className="text-indigo-500 font-black uppercase tracking-[0.2em] text-[10px] mb-4">Identity Profile</h3>
                            <div className="text-2xl font-black text-foreground tracking-tight mb-2 uppercase italic">{selectedStudent.name}</div>
                            <p className="text-[10px] font-bold text-muted uppercase tracking-widest italic mb-4">{selectedStudent.Persona}</p>
                            <p className="text-muted text-sm font-medium leading-relaxed">Status: {selectedStudent.Risk_Category}. Individual engagement score calculated at {parseFloat(selectedStudent.Risk_Score).toFixed(3)} based on attendance ({selectedStudent.Attendance}%).</p>
                        </div>

                        <div className="bg-card p-10 rounded-[3rem] shadow-sm border border-card-border hover:shadow-xl hover:shadow-accent/5 transition-all duration-500 group">
                            <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform border border-card-border/50">🔍</div>
                            <h3 className="text-amber-500 font-black uppercase tracking-[0.2em] text-[10px] mb-4">Deep Analysis</h3>
                            <div className="text-2xl font-black text-foreground tracking-tight mb-2 uppercase italic">Learning Patterns</div>
                            <p className="text-muted text-sm font-medium leading-relaxed">Student spends {selectedStudent.Hours_Studied} hours/week on studies with a motivation level of {selectedStudent.Motivation_Level}. Peer influence is rated at {selectedStudent.Peer_Influence}.</p>
                        </div>

                        <div className="bg-card p-10 rounded-[3rem] shadow-sm border border-card-border hover:shadow-xl hover:shadow-accent/5 transition-all duration-500 group">
                            <div className="w-14 h-14 bg-rose-500/10 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform border border-card-border/50">⚠️</div>
                            <h3 className="text-rose-500 font-black uppercase tracking-[0.2em] text-[10px] mb-4">Risk Evaluation</h3>
                            <div className="text-2xl font-black text-foreground tracking-tight mb-2 uppercase italic">Warning Signals</div>
                            <p className="text-muted text-sm font-medium leading-relaxed">
                                {selectedStudent.Risk_Category === 'High Risk' 
                                    ? "CRITICAL: Immediate action recommended. Low attendance and high risk score indicate potential failure." 
                                    : "STABLE: Standard monitoring sufficient. No critical risk triggers detected at this stage."}
                            </p>
                        </div>

                        <div className="bg-card p-10 rounded-[3rem] shadow-sm border border-card-border hover:shadow-xl hover:shadow-accent/5 transition-all duration-500 group">
                            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform border border-card-border/50">🎯</div>
                            <h3 className="text-emerald-500 font-black uppercase tracking-[0.2em] text-[10px] mb-4">Intervention</h3>
                            <div className="text-2xl font-black text-foreground tracking-tight mb-2 uppercase italic">Action Strategy</div>
                            <p className="text-muted text-sm font-medium leading-relaxed">
                                {selectedStudent.Tutoring_Sessions === '0.0' 
                                    ? "Strategic Move: Initiate tutoring sessions and encourage more extracurricular activities." 
                                    : "Strategic Move: Maintain current support systems and review progress in 15 days."}
                            </p>
                        </div>
                    </>
                ) : (
                    <div className="col-span-full h-full flex flex-col items-center justify-center bg-card rounded-[3rem] border border-card-border p-12 text-center">
                        <div className="text-6xl mb-6">👩‍🏫</div>
                        <h2 className="text-2xl font-black uppercase italic mb-2">Teacher Workspace</h2>
                        <p className="text-muted font-bold text-xs uppercase tracking-widest">Select a student from the database to perform deep AI-assisted analysis</p>
                    </div>
                )}
            </div>
        </div>
    )
}