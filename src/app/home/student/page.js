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
                <input type="text" className="bg-yellow-50 pl-2 mb-10" placeholder="Student Name" onChange={(e)=>searchNameInput(e.target.value)} />
                {searchName?students.map((student)=>{
                    if(searchName!="" && searchName && student.toLowerCase().includes(searchName.toLowerCase())){
                    return(
                        <div key={student} className="w-full rounded-2xl h-10 bg-red-300 mb-1 cursor-pointer scroll-auto p-2 hover:bg-red-400
">
                            {student}
                        </div>
                    )
                }}):students.map((student)=>{
                    return(
                        <div key={student} className="w-full rounded-2xl h-10 bg-red-300 mb-1 cursor-pointer scroll-auto p-2 hover:bg-red-400
">
                            {student}
                        </div>
                    )
                })}
            </div>
            <div className="bg-red-300 w-210 rounded-2xl flex flex-col justify-center align-middle p-2">
                <div className="flex justify-between">
                    <div className="border h-80 ">
                        Top Section — Student Identity
                    </div>
                    <div className="border h-80">
                        Why this student fits this learning pattern
                    </div>
                </div>
                <div className="flex justify-between">
                    <div className="border h-80 ">
                        Early Warning Signals
                    </div>
                    <div className="border h-80 ">
                        Recommended Teaching Strategies 
                    </div>
                </div>
            </div>
        </div>
    )
}