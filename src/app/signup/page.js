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
    <div className="text-black flex flex-col">
      <h1 className = "font-black text-black">
        SignUp Page
       </h1>
       <form className="flex flex-col w-100 gap-3">
       <label>Teacher Code</label>
       <input type="text" className="bg-amber-100 rounded-1xl" onChange={(e)=>(setCode(e.target.value))}/>
       <label>Teacher Name</label>
       <input type="text" className="bg-amber-100 rounded-1xl" onChange={(e)=>(setName(e.target.value))}/>
       <label>Password</label>
       <input type="text" className="bg-amber-100 rounded-1xl" onChange={(e)=>(setPassword(e.target.value))}/>
       <button className="cursor-pointer bg-gray-400 rounded-4xl" onClick={(e)=>Onclick(e)}>Login</button>
    </form>
    </div>
  );
}
