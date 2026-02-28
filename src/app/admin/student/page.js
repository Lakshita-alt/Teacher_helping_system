"use client"

import { useState, useEffect } from "react";
import { Icon } from "@/component/Icons";

export default function StudentSummary() {
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedClass, setSelectedClass] = useState("");
    const [searchId, setSearchId] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [suggestion, setSuggestion] = useState("");
    const [loadingSuggestion, setLoadingSuggestion] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const [studentsRes, classesRes] = await Promise.all([
                    fetch('/api/students'),
                    fetch('/api/classes')
                ]);
                const studentsData = await studentsRes.json();
                const classesData = await classesRes.json();
                setStudents(studentsData);
                setClasses(classesData);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const categories = Array.from(new Set(students.map(s => s.Risk_Category))).filter(Boolean);

    const filteredStudents = students.filter(student => 
        (!selectedCategory || student.Risk_Category === selectedCategory) &&
        (!selectedClass || student.className === selectedClass) &&
        (!searchId || 
         student.id.toLowerCase().includes(searchId.toLowerCase()) || 
         student.name.toLowerCase().includes(searchId.toLowerCase()) ||
         student.Persona.toLowerCase().includes(searchId.toLowerCase()))
    );

    // Show all if a class is selected, otherwise limit to 100
    const studentsToRender = selectedClass ? filteredStudents : filteredStudents.slice(0, 100);

    const handleStudentClick = async (student) => {
        setSelectedStudent(student);
        setLoadingSuggestion(true);
        setSuggestion("");
        try {
            const res = await fetch('/api/ai/suggestion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'student', student }),
            });
            const data = await res.json();
            setSuggestion(data.suggestion);
        } catch (error) {
            setSuggestion("Failed to load growth strategy. Please try again.");
        } finally {
            setLoadingSuggestion(false);
        }
    };

    function OnButtonClick(){
        // Handled by reactive state
    }

    return (
        <div className="space-y-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-700 text-foreground font-mono">
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 bg-card p-8 md:p-12 rounded-[3rem] border border-card-border shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-card-muted rounded-full -mr-32 -mt-32 pointer-events-none opacity-20"></div>
                
                <div className="flex-1 space-y-3 relative z-10">
                    <h1 className="text-4xl font-black tracking-tight leading-none italic uppercase">Student Search</h1>
                    <p className="text-muted font-bold text-[10px] md:text-xs uppercase tracking-[0.2em]">Analyze individual performance markers and archetypes</p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4 relative z-10">
                    <div className="flex flex-col gap-2 min-w-[160px]">
                        <label className="px-2 text-[10px] font-black text-muted uppercase tracking-widest">Select Class</label>
                        <div className="relative">
                            <select
                                className="w-full bg-card-muted border border-card-border rounded-2xl py-4 px-6 text-sm font-bold text-foreground outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent appearance-none transition-all cursor-pointer"
                                onChange={(e) => setSelectedClass(e.target.value)}
                            >
                                <option value="">All Classes</option>
                                {classes.map((cls) => (
                                    <option key={cls.className} value={cls.className}>{cls.className}</option>
                                ))}
                            </select>
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted">▼</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 min-w-[160px]">
                        <label className="px-2 text-[10px] font-black text-muted uppercase tracking-widest">Risk Category</label>
                        <div className="relative">
                            <select
                                className="w-full bg-card-muted border border-card-border rounded-2xl py-4 px-6 text-sm font-bold text-foreground outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent appearance-none transition-all cursor-pointer"
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted">▼</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 min-w-[200px]">
                        <label className="px-2 text-[10px] font-black text-muted uppercase tracking-widest">Search Student</label>
                        <input type="text"
                            placeholder="Type name or ID..."
                            onChange={(e) => setSearchId(e.target.value)}
                            className="w-full bg-card-muted border border-card-border rounded-2xl py-4 px-6 text-sm font-bold text-foreground outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all shadow-inner placeholder:opacity-50 placeholder:text-muted" />
                    </div>

                    <button className="bg-foreground text-background hover:opacity-90 font-black py-4 px-10 rounded-2xl shadow-xl dark:shadow-none transition-all active:scale-[0.98] cursor-pointer uppercase tracking-widest text-[10px] h-[58px]" onClick={OnButtonClick}>
                        Search
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="py-24 flex flex-col items-center justify-center text-muted italic animate-pulse">
                    <div className="w-24 h-24 bg-card rounded-full flex items-center justify-center text-5xl mb-6 shadow-sm border border-card-border"><Icon name="trend" className="w-12 h-12 text-accent" /></div>
                    <p className="text-xl font-black text-foreground uppercase italic tracking-tight">Loading Database</p>
                    <p className="text-sm font-medium text-muted mt-2">Accessing {students.length || "..."} student profiles</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {!selectedClass && filteredStudents.length > 100 && (
                        <div className="bg-accent/10 border border-accent/20 p-4 rounded-2xl text-center">
                            <p className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">
                                Showing first 100 of {filteredStudents.length} students. Select a class to view all students in that class.
                            </p>
                        </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                        {studentsToRender.map((student) => (
                            <div key={student.id} 
                                 onClick={() => handleStudentClick(student)}
                                 className="bg-card p-8 rounded-[2.5rem] border border-card-border shadow-sm hover:shadow-xl dark:hover:shadow-none hover:-translate-y-1 transition-[transform,shadow,background-color,border-color] duration-300 group cursor-pointer">
                                <div className="flex items-center gap-5 mb-6">
                                    <div className="w-14 h-14 rounded-2xl bg-card-muted flex items-center justify-center group-hover:scale-110 group-hover:bg-card transition-[transform,background-color] duration-300 shadow-sm border border-card-border text-foreground">
                                        <Icon name="student" className="w-8 h-8" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-black text-foreground tracking-tight text-lg leading-tight">{student.name}</h3>
                                        <p className="text-[10px] font-black text-muted uppercase tracking-widest mt-1">ID: {student.id} • {student.Risk_Category}</p>
                                        <p className="text-[9px] font-bold text-accent/80 uppercase mt-0.5">{student.Persona}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between p-5 bg-card-muted rounded-2xl border border-card-border/50 group-hover:bg-card transition-colors">
                                    <span className="text-[10px] font-black text-muted uppercase tracking-wider">Attendance</span>
                                    <span className="px-4 py-1.5 bg-card rounded-xl text-xs font-black text-foreground shadow-sm border border-card-border group-hover:border-accent group-hover:text-accent transition-all">
                                        {student.Attendance}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {(!loading && filteredStudents.length === 0) && (
                <div className="py-24 flex flex-col items-center justify-center text-muted italic">
                    <div className="w-24 h-24 bg-card rounded-full flex items-center justify-center text-5xl mb-6 shadow-sm border border-card-border"><Icon name="search" className="w-12 h-12 opacity-30" /></div>
                    <p className="text-xl font-black text-foreground uppercase italic tracking-tight">No Results Found</p>
                    <p className="text-sm font-medium text-muted mt-2">Adjust your filters to see more students</p>
                </div>
            )}

            {/* Student Detail Modal */}
            {selectedStudent && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-[100] flex items-center justify-center p-4" onClick={() => setSelectedStudent(null)}>
                    <div 
                        className="bg-card w-full max-w-2xl rounded-[3rem] border border-card-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-8 md:p-12 space-y-8">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-3xl bg-card-muted flex items-center justify-center shadow-sm border border-card-border text-foreground">
                                        <Icon name="student" className="w-10 h-10" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black text-foreground tracking-tight leading-none italic uppercase">{selectedStudent.name}</h2>
                                        <p className="text-xs font-black text-muted uppercase tracking-[0.2em] mt-2">ID: {selectedStudent.id} • {selectedStudent.Persona}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setSelectedStudent(null)}
                                    className="w-12 h-12 rounded-2xl bg-card-muted hover:bg-card-border flex items-center justify-center transition-colors"
                                >
                                    <Icon name="close" className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                <div className="bg-card-muted p-6 rounded-3xl border border-card-border">
                                    <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">Risk Level</p>
                                    <p className="text-lg font-black text-accent">{selectedStudent.Risk_Category}</p>
                                </div>
                                <div className="bg-card-muted p-6 rounded-3xl border border-card-border">
                                    <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">Attendance</p>
                                    <p className="text-lg font-black text-foreground">{selectedStudent.Attendance}%</p>
                                </div>
                                <div className="bg-card-muted p-6 rounded-3xl border border-card-border">
                                    <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">Study Hours</p>
                                    <p className="text-lg font-black text-foreground">{selectedStudent.Hours_Studied}h/wk</p>
                                </div>
                                <div className="bg-card-muted p-6 rounded-3xl border border-card-border">
                                    <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">Motivation</p>
                                    <p className="text-lg font-black text-foreground">{selectedStudent.Motivation_Level}/2</p>
                                </div>
                                <div className="bg-card-muted p-6 rounded-3xl border border-card-border">
                                    <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">Sleep</p>
                                    <p className="text-lg font-black text-foreground">{selectedStudent.Sleep_Hours}h</p>
                                </div>
                                <div className="bg-card-muted p-6 rounded-3xl border border-card-border">
                                    <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">Tutoring</p>
                                    <p className="text-lg font-black text-foreground">{selectedStudent.Tutoring_Sessions}</p>
                                </div>
                                <div className="bg-card-muted p-6 rounded-3xl border border-card-border">
                                    <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">Resources</p>
                                    <p className="text-lg font-black text-foreground">{selectedStudent.Access_to_Resources}/2</p>
                                </div>
                                <div className="bg-card-muted p-6 rounded-3xl border border-card-border">
                                    <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">Peer Infl.</p>
                                    <p className="text-lg font-black text-foreground">{selectedStudent.Peer_Influence}/2</p>
                                </div>
                                <div className="bg-card-muted p-6 rounded-3xl border border-card-border">
                                    <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">Extracurr.</p>
                                    <p className="text-lg font-black text-foreground">{selectedStudent.Extracurricular_Activities == 1 ? "Yes" : "No"}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xs font-black text-muted uppercase tracking-[0.3em] px-2 italic">Future Growth Strategy</h3>
                                <div className="bg-foreground text-background p-8 rounded-[2.5rem] shadow-lg dark:shadow-none relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-background/10 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
                                    
                                    {loadingSuggestion ? (
                                        <div className="flex flex-col items-center justify-center py-4 gap-3">
                                            <div className="w-8 h-8 border-4 border-background/20 border-t-background rounded-full animate-spin"></div>
                                            <p className="text-[10px] font-black uppercase tracking-widest animate-pulse">Generating Insights...</p>
                                        </div>
                                    ) : (
                                        <div className="relative z-10">
                                            <p className="text-sm font-bold leading-relaxed opacity-90">
                                                {suggestion || "Selecting a strategy based on behavioral markers..."}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button 
                                    onClick={() => setSelectedStudent(null)}
                                    className="bg-card-muted hover:bg-card-border text-foreground font-black py-4 px-10 rounded-2xl transition-all uppercase tracking-widest text-[10px]"
                                >
                                    Close Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}