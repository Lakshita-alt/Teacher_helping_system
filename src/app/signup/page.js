"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {

  const [name,setName] = useState("");
  const [code,setCode] = useState("");
  const [password,setPassword] = useState("");

  function Onclick(e){
    e.preventDefault();

    // <todo> -> replace the hard checking with auth 
    if(name=="John" && code=="1234" && password=="1234"){
      console.log([name,code,password])
      window.location.href="http://localhost:3000/";
      return true;
    }
    return false;

  }

  return (
    // light background
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-sm border border-slate-100">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase italic">
            Sign Up
          </h1>
          <p className="text-slate-400 text-xs mt-2 font-bold uppercase tracking-widest">
            Teacher Helping System
          </p>
        </div>

        <form className="flex flex-col gap-5 w-full">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Teacher Code</label>
            <input 
              type="text" 
              placeholder="Enter Code"
              className="bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-amber-400 transition-all text-black" 
              onChange={(e) => setCode(e.target.value)} 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Teacher Name</label>
            <input 
              type="text" 
              placeholder="Full Name"
              className="bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-amber-400 transition-all text-black" 
              onChange={(e) => setName(e.target.value)} 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Password</label>
            <input 
              type="password" // Changed 2 password type for security dots 
              placeholder="••••••••"
              className="bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-amber-400 transition-all text-black" 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>

          <button 
            className="cursor-pointer bg-slate-800 hover:bg-slate-900 text-white font-black py-4 rounded-xl mt-4 shadow-lg shadow-slate-200 transition-all active:scale-95 text-center uppercase tracking-widest" 
            onClick={(e) => Onclick(e)}
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}
