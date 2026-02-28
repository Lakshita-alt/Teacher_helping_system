"use client"

import { uploadCsvFile } from "../../server/csv"

export default function UploadForm() {

  function ClickRedirect(e){
    window.location.href = "http://localhost:3000/home/class"
  }

    return (
      <div className="w-full">
        <form action={uploadCsvFile} className="flex flex-col gap-6">
          
          <div className="relative group rounded-[2.5rem] overflow-hidden">
            <input 
              type="file" 
              name="file" 
              accept=".csv" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
            />
            <div className="flex flex-col items-center justify-center p-10 md:p-14 border-4 border-dashed border-card-border bg-card-muted group-hover:bg-accent/10 group-hover:border-accent transition-all duration-300">
              <div className="bg-card p-5 rounded-3xl mb-4 shadow-sm group-hover:scale-110 group-hover:shadow-lg transition-all duration-300 border border-card-border">
                <span className="text-4xl">📄</span>
              </div>
              <p className="text-sm font-black text-muted uppercase tracking-widest leading-tight text-center">
                Drop your CSV<br/>
                <span className="text-[10px] text-accent font-bold mt-1 block">or click to browse</span>
              </p>
            </div>
          </div>
  
          <button 
            type="submit" 
            className="w-full py-5 px-6 bg-foreground text-background hover:bg-foreground/90 font-black text-sm uppercase tracking-[0.2em] rounded-2xl shadow-xl dark:shadow-none active:scale-[0.98] transition-all cursor-pointer relative z-30" 
            onClick={(e)=>ClickRedirect(e)}
          >
            Process and Upload
          </button>
          
        </form>
      </div>
    )
  }
  