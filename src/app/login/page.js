"use client";
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
      setName("");
      setCode("");
      setPassword("");
    window.location.href="http://localhost:3000/home";
      return true;
    }
    window.location.href="http://localhost:3000/signup";
    return false;

  }

  return (

  <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 text-foreground">
    
    <div className="bg-card shadow-2xl rounded-[2.5rem] p-10 w-full max-w-md border border-card-border flex flex-col items-center">
      
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black tracking-tighter uppercase italic">
          Login Page
        </h1>
        <p className="text-muted text-xs mt-2 font-bold uppercase tracking-widest">
          Teacher Helping System
        </p>
      </div>

      <form className="flex flex-col w-full gap-6">
        
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-muted uppercase tracking-wider ml-1">
            Teacher Name
          </label>
          <input 
            type="text" 
            placeholder="Full Name"
            className="bg-card-muted border border-card-border rounded-2xl p-4 outline-none focus:ring-2 focus:ring-accent transition-all text-foreground font-medium placeholder:text-muted/50" 
            onChange={(e)=>(setName(e.target.value))}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-muted uppercase tracking-wider ml-1">
            Teacher Code
          </label>
          <input 
            type="text" 
            placeholder="Enter Code"
            className="bg-card-muted border border-card-border rounded-2xl p-4 outline-none focus:ring-2 focus:ring-accent transition-all text-foreground font-medium placeholder:text-muted/50" 
            onChange={(e)=>(setCode(e.target.value))}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-muted uppercase tracking-wider ml-1">
            Password
          </label>
          <input 
            type="password" 
            placeholder="••••••••"
            className="bg-card-muted border border-card-border rounded-2xl p-4 outline-none focus:ring-2 focus:ring-accent transition-all text-foreground font-medium placeholder:text-muted/50" 
            onChange={(e)=>(setPassword(e.target.value))}
          />
        </div>

        <button 
          className="cursor-pointer bg-foreground text-background hover:opacity-90 font-black py-5 rounded-2xl mt-4 shadow-xl shadow-accent/10 transition-all active:scale-95 text-center uppercase tracking-widest" 
          onClick={(e)=>Onclick(e)}
        >
          Login
        </button>
      </form>
    </div>
  </div>
);
}
