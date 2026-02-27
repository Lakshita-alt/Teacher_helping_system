"use client"
import { useState, useEffect } from "react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function StudentSummary(){
    const [searchName, setSearchName] = useState("");
    const [riskFilter, setRiskFilter] = useState("");
    const [attendanceFilter, setAttendanceFilter] = useState(0);
    const [personaFilter, setPersonaFilter] = useState("");
    
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [loadingAI, setLoadingAI] = useState(false);
    const [aiSuggestion, setAiSuggestion] = useState("");

    useEffect(() => {
        async function fetchStudents() {
            try {
                const stored = localStorage.getItem('teacher_auth');
                let className = null;
                if (stored) {
                    const auth = JSON.parse(stored);
                    className = auth.className;
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

    const personas = Array.from(new Set(students.map(s => s.Persona))).filter(Boolean);
    const riskCategories = Array.from(new Set(students.map(s => s.Risk_Category))).filter(Boolean);

    const handleStudentClick = async (student) => {
        setLoadingDetails(true);
        setAiSuggestion("");
        try {
            const res = await fetch(`/api/student/${student.id}`);
            const data = await res.json();
            setSelectedStudent(data);
        } catch (error) {
            console.error("Failed to fetch student details:", error);
        } finally {
            setLoadingDetails(false);
        }
    };

    const generateAISuggestion = async () => {
        if (!selectedStudent) return;
        setLoadingAI(true);
        try {
            const aiRes = await fetch('/api/ai/suggestion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'student', student: selectedStudent })
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

    const filteredStudents = students.filter(student => {
        const matchesSearch = !searchName || 
            (student.name && student.name.toLowerCase().includes(searchName.toLowerCase())) || 
            student.Persona.toLowerCase().includes(searchName.toLowerCase()) || 
            student.id.includes(searchName);
        const matchesRisk = !riskFilter || student.Risk_Category === riskFilter;
        const matchesAttendance = parseFloat(student.Attendance) >= attendanceFilter;
        const matchesPersona = !personaFilter || student.Persona === personaFilter;
        return matchesSearch && matchesRisk && matchesAttendance && matchesPersona;
    });

    const exportToCSV = () => {
        const headers = ["ID", "Name", "Persona", "Risk Category", "Risk Score", "Attendance", "Hours Studied"];
        const rows = filteredStudents.slice(0, 500).map(s => [
            s.id, s.name, s.Persona, s.Risk_Category, s.Risk_Score, s.Attendance, s.Hours_Studied
        ]);
        
        let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "student_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text("Student Analytics Report", 14, 15);
        const tableColumn = ["ID", "Name", "Persona", "Risk Category", "Attendance", "Hours"];
        const tableRows = filteredStudents.slice(0, 50).map(s => [
            s.id, s.name, s.Persona, s.Risk_Category, s.Attendance + "%", s.Hours_Studied
        ]);

        doc.autoTable(tableColumn, tableRows, { startY: 20 });
        doc.save("student_report.pdf");
    };

    return (
        <div className="flex flex-col xl:flex-row gap-8 w-full min-h-[calc(100vh-6rem)] text-foreground font-mono">
            {/* Search & Filter Sidebar */}
            <div className="w-full xl:w-[25vw] max-w-md flex flex-col gap-6">
                <div className="bg-card p-6 rounded-[2.5rem] border border-card-border shadow-sm space-y-4">
                    <div className="flex justify-between items-center mb-2">
                        <label className="px-2 text-[10px] font-black text-muted uppercase tracking-[0.2em]">Filters</label>
                        <div className="flex gap-2">
                            <button onClick={exportToCSV} className="text-[9px] font-black bg-emerald-500/10 text-emerald-600 px-2 py-1 rounded-lg border border-emerald-500/20">CSV</button>
                            <button onClick={exportToPDF} className="text-[9px] font-black bg-rose-500/10 text-rose-600 px-2 py-1 rounded-lg border border-rose-500/20">PDF</button>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="relative">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-muted">🔍</span>
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

                <div className="bg-card rounded-[2.5rem] border border-card-border p-4 shadow-sm flex flex-col gap-1 overflow-y-auto max-h-[50vh] xl:max-h-[60vh]">
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
                            className={`w-full rounded-2xl p-4 transition-all font-bold text-sm border flex items-center justify-between group ${selectedStudent?.id === student.id ? 'bg-accent/10 border-accent text-accent' : 'bg-transparent text-muted border-transparent hover:bg-card-muted hover:border-card-border'}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] transition-colors border ${student.Risk_Category === 'High Risk' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-card-muted border-card-border text-muted group-hover:bg-card'}`}>
                                    {student.Risk_Category === 'High Risk' ? '⚠️' : '👤'}
                                </div>
                                <div className="flex flex-col items-start">
                                    <span className="text-foreground text-left line-clamp-1 text-xs">{student.name}</span>
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
                                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-2xl border border-card-border/50 text-blue-500">📋</div>
                                {parseFloat(selectedStudent.Risk_Score) > 0.4 && (
                                    <div className="px-4 py-1.5 bg-rose-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest animate-bounce shadow-lg shadow-rose-500/30">Predictive Alert</div>
                                )}
                            </div>
                            <h3 className="text-blue-500 font-black uppercase tracking-[0.2em] text-[10px] mb-4">Identity Overview</h3>
                            <div className="text-2xl font-black text-foreground tracking-tight mb-2 uppercase italic leading-none">{selectedStudent.name}</div>
                            <p className="text-[10px] font-bold text-muted uppercase tracking-widest italic">{selectedStudent.Persona}</p>
                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <div><p className="text-[9px] font-black text-muted uppercase">Attendance</p><p className="text-lg font-black">{selectedStudent.Attendance}%</p></div>
                                <div><p className="text-[9px] font-black text-muted uppercase">Risk Level</p><p className={`text-lg font-black ${selectedStudent.Risk_Category === 'High Risk' ? 'text-rose-500' : 'text-emerald-500'}`}>{selectedStudent.Risk_Category}</p></div>
                            </div>
                        </div>

                        {/* Trend Analysis Chart */}
                        <div className="bg-card p-8 rounded-[3rem] shadow-sm border border-card-border flex flex-col min-h-[300px]">
                            <h3 className="text-amber-500 font-black uppercase tracking-[0.2em] text-[10px] mb-6">Performance Trend (MoM)</h3>
                            <div className="flex-1 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={selectedStudent.trends}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#888888'}} />
                                        <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#888888'}} />
                                        <Tooltip contentStyle={{borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 900}} />
                                        <Line type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={4} dot={{ r: 6, fill: '#f59e0b', strokeWidth: 0 }} activeDot={{ r: 8, strokeWidth: 0 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Predictive Evaluation */}
                        <div className="bg-card p-10 rounded-[3rem] shadow-sm border border-card-border hover:shadow-xl hover:shadow-accent/5 transition-all duration-500">
                            <div className="w-14 h-14 bg-rose-500/10 rounded-2xl flex items-center justify-center text-2xl mb-6 border border-card-border/50 text-rose-500">🚨</div>
                            <h3 className="text-rose-500 font-black uppercase tracking-[0.2em] text-[10px] mb-4">Predictive Evaluation</h3>
                            <div className="text-2xl font-black text-foreground tracking-tight mb-2 uppercase italic">Warning Logic</div>
                            <p className="text-muted text-sm font-medium leading-relaxed mt-4">
                                {parseFloat(selectedStudent.Risk_Score) > 0.4 
                                    ? `AI predicts potential failure probability of ${Math.round(parseFloat(selectedStudent.Risk_Score)*100)}%. Critical factors include low motivation (${selectedStudent.Motivation_Level}) and limited tutoring sessions (${selectedStudent.Tutoring_Sessions}).` 
                                    : "Model predicts stable performance. No negative deviation expected in the next exam cycle."}
                            </p>
                        </div>

                        {/* Gemini AI Strategy */}
                        <div className="bg-card p-10 rounded-[3rem] shadow-sm border border-card-border hover:shadow-xl hover:shadow-accent/5 transition-all duration-500 group">
                            <div className="flex justify-between items-center mb-6">
                                <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-2xl border border-card-border/50 text-emerald-500">🚀</div>
                                {!aiSuggestion && (
                                    <button 
                                        disabled={loadingAI}
                                        onClick={generateAISuggestion}
                                        className="bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all disabled:opacity-50"
                                    >
                                        {loadingAI ? "Consulting Gemini..." : "Generate AI Strategy"}
                                    </button>
                                )}
                            </div>
                            <h3 className="text-emerald-500 font-black uppercase tracking-[0.2em] text-[10px] mb-4">Gemini AI Strategy</h3>
                            <div className="text-2xl font-black text-foreground tracking-tight mb-2 uppercase italic">Growth Roadmap</div>
                            <p className="text-muted text-sm font-medium leading-relaxed mt-4">
                                {aiSuggestion || "AI analysis is ready. Click the button above to generate a personalized intervention roadmap for this student."}
                            </p>
                        </div>
                    </>
                ) : (
                    <div className="col-span-full h-full flex flex-col items-center justify-center bg-card rounded-[3rem] border border-card-border p-12 text-center">
                        <div className="text-6xl mb-6">📊</div>
                        <h2 className="text-2xl font-black uppercase italic mb-2">Analytics Center</h2>
                        <p className="text-muted font-bold text-xs uppercase tracking-widest">Select a student profile to generate predictive alerts and trend analysis</p>
                    </div>
                )}
            </div>
        </div>
    )
}