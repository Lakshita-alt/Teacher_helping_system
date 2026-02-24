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
        <div className="flex m-4 gap-2">
            <div className="w-55 h-150 bg-pink-50 overflow-y-auto">
                <select className="w-20 h-10"
                    onChange={(e) => { setSearchName(e.target.value) }} value={searchName}
                >
                    {personas.map((persona) => {
                        return (<option key={persona}>
                            {persona}
                        </option>
                        )
                    })}
                </select>

                <div className="flex flex-col gap-2 overflow-y-auto max-h-[70vh] pr-2">
                    {students.filter(student => student.personas.toLowerCase().includes(searchName?.toLowerCase() || "")).map((student) => (
                        <div key={student.name} className="w-full rounded-xl p-3 bg-white border border-pink-50 shadow-sm cursor-pointer hover:bg-pink-500 hover:text-white transition-all font-bold text-gray-600">
                            {student.name}
                        </div>))}
                </div>
            </div>
            <div>
                {/* Card 1 */}
                <div className="bg-white p-8 rounded-[30px] shadow-xl border border-gray-100 min-h-[300px]">
                    <h3 className="text-pink-600 font-black uppercase tracking-widest text-xs mb-4">Top Section</h3>
                    <div className="text-xl font-bold text-gray-800">Student Identity</div>
                </div>

                {/* Card 2 */}
                <div className="bg-white p-8 rounded-[30px] shadow-xl border border-gray-100 min-h-[300px]">
                    <h3 className="text-orange-500 font-black uppercase tracking-widest text-xs mb-4">Analysis</h3>
                    <div className="text-xl font-bold text-gray-800">Why this student fits this learning pattern</div>
                </div>
            </div>

            <div>
                {/* Card 3 */}
                <div className="bg-white p-8 rounded-[30px] shadow-xl border border-gray-100 min-h-[300px]">
                    <h3 className="text-red-500 font-black uppercase tracking-widest text-xs mb-4">Risk Factors</h3>
                    <div className="text-xl font-bold text-gray-800">Early Warning Signals</div>
                </div>

                {/* Card 4 */}
                <div className="bg-white p-8 rounded-[30px] shadow-xl border border-gray-100 min-h-[300px]">
                    <h3 className="text-green-500 font-black uppercase tracking-widest text-xs mb-4">Action Plan</h3>
                    <div className="text-xl font-bold text-gray-800">Recommended Teaching Strategies</div>
                </div>
            </div>
        </div>
    )
}