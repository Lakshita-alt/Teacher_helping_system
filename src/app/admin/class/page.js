"use client"

import ClassOverviewModal from "@/component/admin/ClassOverviewModal";
import { useState, useEffect } from "react";
import { Icon } from "@/component/Icons";

export default function ClassOverview(){
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchCls,setSearchCls] = useState("");
    const [hash,setHash] = useState(null);

    useEffect(() => {
        async function fetchClasses() {
            try {
                const res = await fetch('/api/classes');
                const data = await res.json();
                setClasses(data);
            } catch (error) {
                console.error("Failed to fetch classes:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchClasses();
    }, []);

    const filteredClasses = classes.filter((cls)=> 
        cls.className?.toLowerCase().includes(searchCls?.toLowerCase() || "")
    );

    const selectedClass = classes.find((cls)=>cls.hash===hash);

    return(
        <div className="flex flex-col xl:flex-row gap-8 w-full min-h-[calc(100vh-10rem)] text-foreground">
            <div className="w-full xl:w-[25vw] max-w-md flex flex-col gap-6">
                <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-muted"><Icon name="search" className="w-5 h-5" /></span>
                    <input type="text" className="w-full bg-card border border-card-border rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-foreground focus:border-accent focus:ring-4 focus:ring-accent/5 outline-none shadow-sm transition-all placeholder:text-muted/50" 
                    placeholder="Search classes..." onChange={(e)=> setSearchCls(e.target.value)}></input>
                </div>
                
                <div className="bg-card rounded-[2.5rem] border border-card-border p-4 shadow-sm flex flex-col gap-1 overflow-y-auto max-h-[50vh] xl:max-h-[65vh]">
                    <div className="px-4 py-2 mb-2 flex justify-between items-center">
                        <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Class Directory</h3>
                        <span className="text-[10px] font-bold bg-card-muted px-2 py-0.5 rounded-full text-muted border border-card-border">
                            {loading ? "..." : filteredClasses.length}
                        </span>
                    </div>
                    {loading ? (
                        <div className="p-4 text-center text-muted font-bold animate-pulse uppercase tracking-widest text-[10px]">Loading classes...</div>
                    ) : filteredClasses.map((cls)=>
                    <button key={cls.hash} 
                        className={`w-full rounded-2xl p-4 cursor-pointer transition-all font-bold text-sm flex items-center justify-between border ${
                            hash === cls.hash 
                            ? "bg-foreground text-background border-foreground shadow-xl dark:shadow-none" 
                            : "bg-transparent text-muted hover:bg-card-muted border-transparent hover:border-card-border"
                        }`}
                        onClick={()=>{
                            setHash(cls.hash);
                        }}>
                        <span className="text-left">{cls.className}</span>
                        {hash === cls.hash && <span className="text-[10px] bg-background/20 px-2 py-0.5 rounded-lg text-background whitespace-nowrap">Active</span>}
                    </button>
                    )}
                </div>
            </div>

            <div className="flex-1 bg-card rounded-[3rem] border border-card-border p-8 md:p-12 shadow-sm min-h-[600px] relative overflow-hidden">
                {selectedClass ? (
                    <ClassOverviewModal prop={selectedClass} />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted italic p-12 text-center">
                        <div className="w-20 h-20 bg-card-muted rounded-3xl flex items-center justify-center mb-6 border border-card-border">
                            <Icon name="folder" className="w-10 h-10 opacity-30" />
                        </div>
                        <p className="text-xl font-black text-foreground tracking-tight mb-2 uppercase italic">No Class Selected</p>
                        <p className="text-sm font-medium text-muted max-w-xs">Pick a class from the directory on the left to analyze its persona distribution.</p>
                    </div>
                )}
            </div>
        </div>
    )
}