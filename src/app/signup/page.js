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
      window.location.href="http://localhost:3000/home";
      return true;
    }
    return false;

  }

  return (
    // light background
    <div className="min-h-screen flex items-center justify-center bg-background p-4 text-foreground">
      
      <div className="bg-card shadow-2xl rounded-3xl p-8 w-full max-w-sm border border-card-border">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tight uppercase italic">
            Sign Up
          </h1>
          <p className="text-muted text-xs mt-2 font-bold uppercase tracking-widest">
            Teacher Helping System
          </p>
        </div>

        <form className="flex flex-col gap-5 w-full">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-muted ml-1 uppercase">Teacher Code</label>
            <input 
              type="text" 
              placeholder="Enter Code"
              className="bg-card-muted border border-card-border rounded-xl p-3 outline-none focus:ring-2 focus:ring-accent transition-all text-foreground placeholder:text-muted/50" 
              onChange={(e) => setCode(e.target.value)} 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-muted ml-1 uppercase">Teacher Name</label>
            <input 
              type="text" 
              placeholder="Full Name"
              className="bg-card-muted border border-card-border rounded-xl p-3 outline-none focus:ring-2 focus:ring-accent transition-all text-foreground placeholder:text-muted/50" 
              onChange={(e) => setName(e.target.value)} 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-muted ml-1 uppercase">Password</label>
            <input 
              type="password" // Changed 2 password type for security dots 
              placeholder="••••••••"
              className="bg-card-muted border border-card-border rounded-xl p-3 outline-none focus:ring-2 focus:ring-accent transition-all text-foreground placeholder:text-muted/50" 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>

          <button 
            className="cursor-pointer bg-foreground text-background hover:opacity-90 font-black py-4 rounded-xl mt-4 shadow-lg dark:shadow-none transition-all active:scale-95 text-center uppercase tracking-widest" 
            onClick={(e) => Onclick(e)}
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}
