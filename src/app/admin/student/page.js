"use client"

import { useState } from "react";

export default function StudentSummary() {

    const Api3Response = [
        {
            className: "Class A", one: 75, two: 82, three: 68, four: 90, graph: "inc", hash: "hash_a",
            students: [
                { name: "Ayush", rollno: "A101", persona: "1" },
                { name: "Rohan", rollno: "A102", persona: "2" },
                { name: "Sneha", rollno: "A103", persona: "3" },
                { name: "Vikram", rollno: "A104", persona: "4" }
            ]
        },
        {
            className: "Class B", one: 88, two: 79, three: 84, four: 80, graph: "dec", hash: "hash_b",
            students: [
                { name: "Karan", rollno: "B101", persona: "2" },
                { name: "Ishita", rollno: "B102", persona: "1" },
                { name: "Manav", rollno: "B103", persona: "4" },
                { name: "Pooja", rollno: "B104", persona: "3" }
            ]
        },
        {
            className: "Class C", one: 60, two: 65, three: 63, four: 64, graph: "mid", hash: "hash_c",
            students: [
                { name: "Ananya", rollno: "C101", persona: "3" },
                { name: "Dev", rollno: "C102", persona: "2" },
                { name: "Priya", rollno: "C103", persona: "1" },
                { name: "Rahul", rollno: "C104", persona: "4" }
            ]
        },
        {
            className: "Class D", one: 92, two: 94, three: 96, four: 98, graph: "inc", hash: "hash_d",
            students: [
                { name: "Arjun", rollno: "D101", persona: "1" },
                { name: "Megha", rollno: "D102", persona: "2" },
                { name: "Siddharth", rollno: "D103", persona: "4" },
                { name: "Kavita", rollno: "D104", persona: "3" }
            ]
        },
        {
            className: "Class E", one: 70, two: 72, three: 71, four: 69, graph: "mid", hash: "hash_e",
            students: [
                { name: "Tanya", rollno: "E101", persona: "2" },
                { name: "Rahul S.", rollno: "E102", persona: "3" },
                { name: "Neha", rollno: "E103", persona: "1" },
                { name: "Amit", rollno: "E104", persona: "4" }
            ]
        },
        {
            className: "Class F", one: 40, two: 60, three: 80, four: 20, graph: "dec", hash: "hash_f",
            students: [
                { name: "Zara", rollno: "F101", persona: "3" },
                { name: "Yash", rollno: "F102", persona: "2" },
                { name: "Xavier", rollno: "F103", persona: "1" },
                { name: "Wafa", rollno: "F104", persona: "4" }
            ]
        }
    ];

    function OnButtonClick(){
        if(!selectedcls){

        }
    }

    const [selectedcls, setSelectedCls] = useState("");
    const [searchRollNo, setSearchRollNo] = useState(null);
    

    return (
        <div className="space-y-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 bg-white p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 pointer-events-none opacity-50"></div>
                
                <div className="flex-1 space-y-3 relative z-10">
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none italic uppercase">Student Search</h1>
                    <p className="text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-[0.2em]">Analyze individual performance markers and archetypes</p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4 relative z-10">
                    <div className="flex flex-col gap-2 min-w-[200px]">
                        <label className="px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Class</label>
                        <div className="relative">
                            <select
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-amber-50 focus:border-amber-400 appearance-none transition-all cursor-pointer"
                                onChange={(e) => setSelectedCls(e.target.value)}
                            >
                                <option value="">All Classes</option>
                                {Api3Response.map((cls) => (
                                    <option key={cls.hash} value={cls.className}>{cls.className}</option>
                                ))}
                            </select>
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 min-w-[240px]">
                        <label className="px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Roll Number</label>
                        <input type="text"
                            placeholder="Type roll number..."
                            onChange={(e) => setSearchRollNo(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-amber-50 focus:border-amber-400 transition-all shadow-inner placeholder:opacity-50" />
                    </div>

                    <button className="bg-slate-900 hover:bg-black text-white font-black py-4 px-10 rounded-2xl shadow-xl shadow-slate-200 transition-all active:scale-[0.98] cursor-pointer uppercase tracking-widest text-[10px] h-[58px]" onClick={OnButtonClick}>
                        Search
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {Api3Response
                    .filter((cls) => cls.className === selectedcls || !selectedcls)
                    .flatMap((cls) => cls.students.map(s => ({...s, className: cls.className})))
                    .filter((student) => !searchRollNo || student.rollno.toLowerCase().includes(searchRollNo.toLowerCase()))
                    .map((student) => (
                        <div key={student.rollno} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 group">
                            <div className="flex items-center gap-5 mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:bg-white transition-all duration-300 shadow-sm">
                                    👤
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-800 tracking-tight text-lg leading-tight">{student.name}</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{student.className} • #{student.rollno}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100/50 group-hover:bg-white transition-colors">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Persona Type</span>
                                <span className="px-4 py-1.5 bg-white rounded-xl text-xs font-black text-slate-800 shadow-sm border border-slate-100 group-hover:border-amber-200 group-hover:text-amber-600 transition-all">
                                    Type {student.persona}
                                </span>
                            </div>
                        </div>
                    ))}
            </div>
            
            {(selectedcls === "" && (searchRollNo === null || searchRollNo === "")) && (
                <div className="py-24 flex flex-col items-center justify-center text-slate-300 italic animate-pulse">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-5xl mb-6 shadow-sm border border-slate-100">🔍</div>
                    <p className="text-xl font-black text-slate-800 uppercase italic tracking-tight">System Ready</p>
                    <p className="text-sm font-medium text-slate-400 mt-2">Enter student details above to begin analysis</p>
                </div>
            )}
        </div>
    )
}