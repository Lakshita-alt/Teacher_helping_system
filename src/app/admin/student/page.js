"use client"

import { useState } from "react";

export default function StudentSummary() {

    const Api3Response = [
        {
            className: "Class A",
            one: 75,
            two: 82,
            three: 68,
            four: 90,
            graph: "inc",
            hash: "hguyfuyoijhtrewedfgvbbfjhfv",
            students: [
                { name: "Ayush", rollno: "A101", persona: "1" },
                { name: "Rohan", rollno: "A102", persona: "2" },
                { name: "Sneha", rollno: "A103", persona: "3" }
            ]
        },
        {
            className: "Class B",
            one: 88,
            two: 79,
            three: 84,
            four: 80,
            graph: "dec",
            hash: "hguyfuyvhtgchfcfjhfv",
            students: [
                { name: "Karan", rollno: "B101", persona: "2" },
                { name: "Ishita", rollno: "B102", persona: "1" },
                { name: "Manav", rollno: "B103", persona: "4" }
            ]
        },
        {
            className: "Class C",
            one: 60,
            two: 65,
            three: 63,
            four: 64,
            graph: "mid",
            hash: "hguyfuyfbvghchgjhfv",
            students: [
                { name: "Ananya", rollno: "C101", persona: "3" },
                { name: "Dev", rollno: "C102", persona: "2" },
                { name: "Priya", rollno: "C103", persona: "1" }
            ]
        },
        {
            className: "Class D",
            one: 92,
            two: 94,
            three: 96,
            four: 98,
            graph: "inc",
            hash: "hguyffxcfkhbuyfjhfv",
            students: [
                { name: "Arjun", rollno: "D101", persona: "1" },
                { name: "Megha", rollno: "D102", persona: "2" },
                { name: "Siddharth", rollno: "D103", persona: "4" }
            ]
        },
        {
            className: "Class E",
            one: 70,
            two: 72,
            three: 71,
            four: 69,
            graph: "mid",
            hash: "hguyfuyfjyhgujjhfv",
            students: [
                { name: "Tanya", rollno: "E101", persona: "2" },
                { name: "Rahul", rollno: "E102", persona: "3" },
                { name: "Neha", rollno: "E103", persona: "1" }
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
        <div>
            <div>
                <select
                    onChange={(e) => {
                        setSelectedCls(e.target.value)
                    }}
                >
                    <option></option>
                    {Api3Response.map((cls) => {
                        return (
                            <option
                                key={cls.hash}
                            >{cls.className}</option>
                        )
                    })}
                </select>
                <input type="text"
                    onChange={(e) => {
                        setSearchRollNo((prev) => e.target.value)
                    }}
                    className="bg-black text-white" />
                <button className="bg-black text-white ml-10 cursor-pointer" onClick={OnButtonClick}>hello</button>
            </div>
            {Api3Response
                .filter((cls) => cls.className === selectedcls)
                .map((cls) => (
                    <div key={cls.hash}>
                        {cls.students.map((student) => (
                            <div key={student.rollno}>
                                {student.name} - {student.rollno}
                            </div>
                        ))}
                    </div>
                ))}
        </div>
    )
}