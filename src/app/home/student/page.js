"use client"
import { useState } from "react";

export default function StudentSummary(){

    const [searchName,setSearchName] = useState();

    function searchNameInput(e){
        console.log(e);
        setSearchName((prev)=>e)
    }

    const students = [
  "Ayush", "Aman", "Rohit", "Rahul", "Kunal", "Ankit", "Saurabh", "Vikash",
  "Shubham", "Aditya", "Arjun", "Mohit", "Nikhil", "Piyush", "Abhishek",
  "Harsh", "Yash", "Pranav", "Ritik", "Siddharth", "Manish", "Deepak",
  "Akash", "Sumit", "Raj", "Kartik", "Varun", "Dev", "Tushar", "Naveen",
  "Ashish", "Gaurav", "Ravi", "Ujjwal", "Sachin", "Shivam", "Mayank",
  "Anuj", "Lakshay", "Aayush", "Ishaan", "Raghav", "Neeraj", "Jay",
  "Om", "Aryan", "Keshav", "Tanmay", "Abhay", "Vansh"
];


    return (
        <div className="flex flex-col xl:flex-row gap-8 w-full min-h-[calc(100vh-6rem)]">
            {/* Search Sidebar */}
            <div className="w-full xl:w-[25vw] max-w-md flex flex-col gap-6">
                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
                    <label className="px-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Search Student Database</label>
                    <div className="relative">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                        <input type="text" 
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-inner" 
                            placeholder="Type student name..." 
                            onChange={(e) => setSearchName(e.target.value)} 
                        />
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-100 p-4 shadow-sm flex flex-col gap-1 overflow-y-auto max-h-[60vh] xl:max-h-[70vh]">
                    <div className="px-4 py-3 mb-2 flex justify-between items-center">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Results</h3>
                        <span className="text-[10px] font-bold bg-slate-100 px-2 py-0.5 rounded-full text-slate-500">
                            {students.filter(s => !searchName || s.toLowerCase().includes(searchName.toLowerCase())).length}
                        </span>
                    </div>
                    {students.filter(student => !searchName || student.toLowerCase().includes(searchName.toLowerCase())).map((student) => (
                        <div key={student} className="w-full rounded-2xl p-4 transition-all font-bold text-sm bg-transparent text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-100 group flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-[10px] group-hover:bg-white transition-colors">👤</div>
                                <span>{student}</span>
                            </div>
                            <span className="text-[10px] text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">View Details →</span>
                        </div>))}
                </div>
            </div>

            {/* Analysis Grid */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 content-start">
                {[
                    { title: "Profile Summary", label: "Student Identity", color: "text-blue-600", bg: "bg-blue-50", icon: "📋", desc: "Core identifiers and demographic status markers for the individual profile." },
                    { title: "Behavioral Analysis", label: "Learning Logic", color: "text-amber-500", bg: "bg-amber-50", icon: "🧠", desc: "Structural reasoning for why this student matches specific learning archetypes." },
                    { title: "Critical Warnings", label: "Risk Indicators", color: "text-rose-500", bg: "bg-rose-50", icon: "🚨", desc: "Specific performance bottlenecks and social factors requiring immediate attention." },
                    { title: "Growth Strategy", label: "Teaching Roadmap", color: "text-emerald-500", bg: "bg-emerald-50", icon: "🚀", desc: "Actionable milestones and specific pedagogical adjustments for better outcomes." }
                ].map((card, i) => (
                    <div key={i} className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group">
                        <div className={`w-14 h-14 ${card.bg} rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:rotate-12 transition-transform`}>{card.icon}</div>
                        <h3 className={`${card.color} font-black uppercase tracking-[0.2em] text-[10px] mb-4`}>{card.title}</h3>
                        <div className="text-2xl font-black text-slate-800 tracking-tight mb-2">{card.label}</div>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed">{card.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}