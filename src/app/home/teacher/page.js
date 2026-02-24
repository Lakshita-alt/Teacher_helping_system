"use client"
import { useState } from "react";

export default function Teacher() {

    const [searchName, setSearchName] = useState("");

    const personas = ["High-Risk students", "Motivated but Under-Resourced", "low attendance"];

    const students = [
        { name: "Aarav Patel", personas: "High-Risk students" },
        { name: "Bhavna Sharma", personas: "Motivated but Under-Resourced" },
        { name: "Chirag Kumar", personas: "low attendance" },
        { name: "Divya Singh", personas: "High-Risk students" },
        { name: "Esha Gupta", personas: "Motivated but Under-Resourced" },
        { name: "Faisal Khan", personas: "low attendance" },
        { name: "Gitika Verma", personas: "High-Risk students" },
        { name: "Harendra Yadav", personas: "Motivated but Under-Resourced" },
        { name: "Ishita Nair", personas: "low attendance" },
        { name: "Jaideep Sinha", personas: "High-Risk students" },
        { name: "Kavita Reddy", personas: "Motivated but Under-Resourced" },
        { name: "Laxmi Iyer", personas: "low attendance" },
        { name: "Mehul Desai", personas: "High-Risk students" },
        { name: "Neha Bhat", personas: "Motivated but Under-Resourced" },
        { name: "Omkar Kulkarni", personas: "low attendance" },
        { name: "Priya Menon", personas: "High-Risk students" },
        { name: "Quinton Roy", personas: "Motivated but Under-Resourced" },
        { name: "Radhika Das", personas: "low attendance" },
        { name: "Sameer Pillai", personas: "High-Risk students" },
        { name: "Tanvi Joshi", personas: "Motivated but Under-Resourced" },
        { name: "Uday Nambiar", personas: "low attendance" },
        { name: "Vaishali Saxena", personas: "High-Risk students" },
        { name: "Waqar Ahmed", personas: "Motivated but Under-Resourced" },
        { name: "Xara Malik", personas: "low attendance" },
        { name: "Yuki Tanaka", personas: "High-Risk students" },
        { name: "Zainab Ali", personas: "Motivated but Under-Resourced" },
        { name: "Arjun Krishnan", personas: "low attendance" },
        { name: "Ananya Das", personas: "High-Risk students" },
        { name: "Akash Srivastava", personas: "Motivated but Under-Resourced" },
        { name: "Aditya Rao", personas: "low attendance" },
        { name: "Abhinav Singh", personas: "High-Risk students" },
        { name: "Amrita Kapoor", personas: "Motivated but Under-Resourced" },
        { name: "Aryan Malhotra", personas: "low attendance" },
        { name: "Avni Chopra", personas: "High-Risk students" },
        { name: "Arnab Sengupta", personas: "Motivated but Under-Resourced" },
        { name: "Anu Iyer", personas: "low attendance" },
        { name: "Aarushi Pathak", personas: "High-Risk students" },
        { name: "Ankur Mittal", personas: "Motivated but Under-Resourced" },
        { name: "Asmita Prabhu", personas: "low attendance" },
        { name: "Atharva Kulkarni", personas: "High-Risk students" },
        { name: "Apoorva Desai", personas: "Motivated but Under-Resourced" },
        { name: "Abhishek Verma", personas: "low attendance" },
        { name: "Anjali Sharma", personas: "High-Risk students" },
        { name: "Ashwin Reddy", personas: "Motivated but Under-Resourced" },
        { name: "Anushka Nair", personas: "low attendance" },
        { name: "Akram Hassan", personas: "High-Risk students" },
        { name: "Anamika Singh", personas: "Motivated but Under-Resourced" },
        { name: "Arvind Yadav", personas: "low attendance" },
        { name: "Alekhya Bhat", personas: "High-Risk students" },
        { name: "Aniket Pillai", personas: "Motivated but Under-Resourced" },
        { name: "Avantika Joshi", personas: "low attendance" },
        { name: "Alok Saxena", personas: "High-Risk students" }
    ]

    return (
        <div className="flex flex-col xl:flex-row gap-8 w-full min-h-[calc(100vh-6rem)] text-foreground">
            {/* Sidebar Search Area */}
            <div className="w-full xl:w-[25vw] max-w-md flex flex-col gap-6">
                <div className="space-y-4 bg-card p-6 rounded-[2.5rem] border border-card-border shadow-sm">
                    <div className="flex flex-col gap-2">
                        <label className="px-2 text-[10px] font-black text-muted uppercase tracking-[0.2em]">Filter by Persona</label>
                        <div className="relative">
                            <select className="w-full bg-card-muted border border-card-border rounded-2xl py-4 px-6 text-sm font-bold text-foreground outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent appearance-none transition-all cursor-pointer"
                                onChange={(e) => { setSearchName(e.target.value) }} value={searchName}
                            >
                                <option value="">All Personas</option>
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

                <div className="bg-card rounded-[2.5rem] border border-card-border p-4 shadow-sm flex flex-col gap-1 overflow-y-auto max-h-[60vh] xl:max-h-[70vh]">
                    <div className="px-4 py-3 mb-2">
                        <h3 className="text-xs font-black text-muted uppercase tracking-widest">Student List</h3>
                    </div>
                    {students.filter(student => !searchName || student.personas.toLowerCase().includes(searchName?.toLowerCase())).map((student) => (
                        <div key={student.name} className="w-full rounded-2xl p-4 transition-all font-bold text-sm bg-transparent text-muted hover:bg-card-muted border border-transparent hover:border-card-border group flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-card-muted flex items-center justify-center text-[10px] group-hover:bg-card transition-colors border border-card-border">👤</div>
                            <div className="flex flex-col">
                                <span className="leading-tight text-foreground">{student.name}</span>
                                <span className="text-[9px] font-medium text-muted opacity-0 group-hover:opacity-100 transition-opacity">{student.personas}</span>
                            </div>
                        </div>))}
                </div>
            </div>

            {/* Content Cards Area */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 content-start">
                {/* Card 1 */}
                <div className="bg-card p-10 rounded-[3rem] shadow-sm border border-card-border hover:shadow-xl hover:shadow-accent/5 transition-all duration-500 group">
                    <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform border border-card-border/50">🆔</div>
                    <h3 className="text-indigo-500 font-black uppercase tracking-[0.2em] text-[10px] mb-4">Identity Profile</h3>
                    <div className="text-2xl font-black text-foreground tracking-tight mb-2 uppercase italic">Student Identity</div>
                    <p className="text-muted text-sm font-medium leading-relaxed">Comprehensive background and demographic mapping of the selected student persona.</p>
                </div>

                {/* Card 2 */}
                <div className="bg-card p-10 rounded-[3rem] shadow-sm border border-card-border hover:shadow-xl hover:shadow-accent/5 transition-all duration-500 group">
                    <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform border border-card-border/50">🔍</div>
                    <h3 className="text-amber-500 font-black uppercase tracking-[0.2em] text-[10px] mb-4">Deep Analysis</h3>
                    <div className="text-2xl font-black text-foreground tracking-tight mb-2 uppercase italic">Learning Patterns</div>
                    <p className="text-muted text-sm font-medium leading-relaxed">AI-driven insights into why this student aligns with specific behavioral markers.</p>
                </div>

                {/* Card 3 */}
                <div className="bg-card p-10 rounded-[3rem] shadow-sm border border-card-border hover:shadow-xl hover:shadow-accent/5 transition-all duration-500 group">
                    <div className="w-14 h-14 bg-rose-500/10 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform border border-card-border/50">⚠️</div>
                    <h3 className="text-rose-500 font-black uppercase tracking-[0.2em] text-[10px] mb-4">Risk Evaluation</h3>
                    <div className="text-2xl font-black text-foreground tracking-tight mb-2 uppercase italic">Warning Signals</div>
                    <p className="text-muted text-sm font-medium leading-relaxed">Identification of critical triggers and early warning signs that require attention.</p>
                </div>

                {/* Card 4 */}
                <div className="bg-card p-10 rounded-[3rem] shadow-sm border border-card-border hover:shadow-xl hover:shadow-accent/5 transition-all duration-500 group">
                    <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform border border-card-border/50">🎯</div>
                    <h3 className="text-emerald-500 font-black uppercase tracking-[0.2em] text-[10px] mb-4">Intervention</h3>
                    <div className="text-2xl font-black text-foreground tracking-tight mb-2 uppercase italic">Action Strategy</div>
                    <p className="text-muted text-sm font-medium leading-relaxed">Personalized teaching methodologies and tactical steps for student success.</p>
                </div>
            </div>
        </div>
    )
}