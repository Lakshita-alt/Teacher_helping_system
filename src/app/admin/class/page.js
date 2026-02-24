"use client"

import ClassOverviewModal from "@/component/admin/ClassOverviewModal";
import { useState } from "react";

export default function ClassOverview(){

    const ClassInfoApiRes = [
  {
    className: "Class A",
    one: 75,
    two: 82,
    three: 68,
    four: 90,
    graph: "inc",
    hash:"hguyfuyoijhtrewedfgvbbfjhfv"
  },
  {
    className: "Class B",
    one: 88,
    two: 79,
    three: 84,
    four: 80,
    graph: "dec",
    hash:"hguyfuyvhtgchfcfjhfv"
  },
  {
    className: "Class C",
    one: 60,
    two: 65,
    three: 63,
    four: 64,
    hash:"hguyfuyfbvghchgjhfv",
    graph: "mid",
  },
  {
    className: "Class D",
    one: 92,
    two: 94,
    hash:"hguyffxcfkhbuyfjhfv",
    three: 96,
    four: 98,
    graph: "inc"
  },
  {
    className: "Class E",
    hash:"hguyfuyfjyhgujjhfv",
    one: 70,
    two: 72,
    three: 71,
    four: 69,
    graph: "mid"
  }
];

    const [searchCls,setSearchCls] = useState(null);
    const [buttonClick,setButtonClick] = useState(false);
    const [hash,setHash] = useState(null);

    return(
        <div className="flex">
            <div className="w-30vw bg-black ">
                <input type="text" className="w-full bg-white border-2 border-pink-100 rounded-2xl py-3 px-4 mb-6 text-sm focus:border-pink-400 outline-none shadow-sm transition-all" 
                placeholder="Search Student..." onChange={(e)=> setSearchCls((prev)=>e.target.value)}></input>
                {ClassInfoApiRes.filter((cls)=> cls.className?.toLowerCase().includes( searchCls?.toLowerCase() || "")).map((cls)=>
                <div key={cls.className} id={cls.hash} className="w-full rounded-xl p-3 bg-white border border-pink-50 shadow-sm cursor-pointer hover:bg-pink-500 hover:text-white transition-all font-bold text-gray-600"
                onClick={(e)=>{
                    setHash(cls.hash);
                    setButtonClick(true);
                }}>
                    {cls.className}
                </div>
                )}
            </div>
            <div>
                {buttonClick && (
                    <ClassOverviewModal 
                    prop={ClassInfoApiRes.find((cls)=>cls.hash===hash)}
                    />
                )}
            </div>
        </div>
    )
}