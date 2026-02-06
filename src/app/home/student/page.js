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


    return(
        <div className="flex m-4 gap-2">
            <div className="w-55 h-150 bg-pink-50 overflow-y-auto">
                <input type="text" className="w-full bg-white border-2 border-pink-100 rounded-2xl py-3 px-4 mb-6 text-sm focus:border-pink-400 outline-none shadow-sm transition-all" 
                placeholder="Search Student..." onChange={(e) => setSearchName(e.target.value)} />

             <div className="flex flex-col gap-2 overflow-y-auto max-h-[70vh] pr-2">
             {students.filter(student => student.toLowerCase().includes(searchName?.toLowerCase() || "")).map((student) => (
               <div key={student} className="w-full rounded-xl p-3 bg-white border border-pink-50 shadow-sm cursor-pointer hover:bg-pink-500 hover:text-white transition-all font-bold text-gray-600">
                {student}
               </div>))}
               </div>
             </div>
             <div className="grid grid-cols-2 gap-6 w-full max-w-5xl">
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