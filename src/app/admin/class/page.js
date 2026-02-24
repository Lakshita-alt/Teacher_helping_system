"use client"

import ClassOverviewModal from "@/component/admin/ClassOverviewModal";
import { useState } from "react";

export default function ClassOverview(){

    const ClassInfoApiRes = [
  { className: "Class A", one: 75, two: 82, three: 68, four: 90, graph: "inc", hash: "hash_a_123" },
  { className: "Class B", one: 88, two: 79, three: 84, four: 80, graph: "dec", hash: "hash_b_456" },
  { className: "Class C", one: 60, two: 65, three: 63, four: 64, graph: "mid", hash: "hash_c_789" },
  { className: "Class D", one: 92, two: 94, three: 96, four: 98, graph: "inc", hash: "hash_d_012" },
  { className: "Class E", one: 70, two: 72, three: 71, four: 69, graph: "mid", hash: "hash_e_345" },
  { className: "Class F", one: 45, two: 55, three: 85, four: 40, graph: "dec", hash: "hash_f_678" },
  { className: "Class G", one: 30, two: 40, three: 50, four: 95, graph: "inc", hash: "hash_g_901" },
  { className: "Class H", one: 85, two: 30, three: 45, four: 60, graph: "mid", hash: "hash_h_234" },
  { className: "Class I", one: 65, two: 85, three: 25, four: 70, graph: "inc", hash: "hash_i_567" },
  { className: "Class J", one: 50, two: 50, three: 50, four: 50, graph: "mid", hash: "hash_j_890" },
  { className: "Class K", one: 95, two: 85, three: 75, four: 65, graph: "dec", hash: "hash_k_111" },
  { className: "Class L", one: 20, two: 40, three: 60, four: 80, graph: "inc", hash: "hash_l_222" }
];

    const [searchCls,setSearchCls] = useState(null);
    const [buttonClick,setButtonClick] = useState(false);
    const [hash,setHash] = useState(null);

    return(
        <div className="flex flex-col xl:flex-row gap-8 w-full min-h-[calc(100vh-10rem)] text-foreground">
            <div className="w-full xl:w-[25vw] max-w-md flex flex-col gap-6">
                <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-muted">🔍</span>
                    <input type="text" className="w-full bg-card border border-card-border rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-foreground focus:border-accent focus:ring-4 focus:ring-accent/5 outline-none shadow-sm transition-all placeholder:text-muted/50" 
                    placeholder="Search classes..." onChange={(e)=> setSearchCls(e.target.value)}></input>
                </div>
                
                <div className="bg-card rounded-[2.5rem] border border-card-border p-4 shadow-sm flex flex-col gap-1 overflow-y-auto max-h-[50vh] xl:max-h-[65vh]">
                    <div className="px-4 py-2 mb-2">
                        <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Class Directory</h3>
                    </div>
                    {ClassInfoApiRes.filter((cls)=> cls.className?.toLowerCase().includes(searchCls?.toLowerCase() || "")).map((cls)=>
                    <div key={cls.className} id={cls.hash} 
                        className={`w-full rounded-2xl p-4 cursor-pointer transition-all font-bold text-sm flex items-center justify-between ${
                            hash === cls.hash 
                            ? "bg-foreground text-background shadow-xl shadow-accent/10" 
                            : "bg-transparent text-muted hover:bg-card-muted border border-transparent hover:border-card-border"
                        }`}
                        onClick={()=>{
                            setHash(cls.hash);
                            setButtonClick(true);
                        }}>
                        <span>{cls.className}</span>
                        {hash === cls.hash && <span className="text-[10px] bg-background/20 px-2 py-0.5 rounded-lg text-background">Active</span>}
                    </div>
                    )}
                </div>
            </div>

            <div className="flex-1 bg-card rounded-[3rem] border border-card-border p-8 md:p-12 shadow-sm min-h-[600px] relative overflow-hidden">
                {buttonClick && hash ? (
                    <ClassOverviewModal 
                        prop={ClassInfoApiRes.find((cls)=>cls.hash===hash)}
                    />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted italic p-12 text-center">
                        <div className="w-20 h-20 bg-card-muted rounded-3xl flex items-center justify-center text-4xl mb-6 border border-card-border">📁</div>
                        <p className="text-xl font-black text-foreground tracking-tight mb-2 uppercase italic">No Class Selected</p>
                        <p className="text-sm font-medium text-muted max-w-xs">Pick a class from the directory on the left to analyze its persona distribution.</p>
                    </div>
                )}
            </div>
        </div>
    )
}