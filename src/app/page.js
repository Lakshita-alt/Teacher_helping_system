"use client";
import { redirect, usePathname } from "next/navigation";
import { useState } from "react";

export default function Home() {

  const pathname = usePathname();

  if(pathname.startsWith("/") && !pathname.includes("/admin")){
    redirect("/admin/school")
  }

  return (
    <div className="text-black flex flex-col">
      <h1 className = "font-black text-black">
        Not valid
      </h1>
    </div>
  );
}
