"use client"

import { uploadCsvFile } from "../../server/csv"

export default function UploadForm() {
  return (
    <div className="w-full max-w-[160px] flex flex-col gap-3 mb-6">
      <form action={uploadCsvFile} className="flex flex-col gap-3">
        
        <div className="relative group">
          <input type="file" name="file" accept=".csv" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
          />
          <div className="flex flex-col items-center justify-center p-4 py-8 border-2 border-dashed border-gray-300 rounded-[20px] bg-white group-hover:bg-pink-50 group-hover:border-pink-300 transition-all">
            <div className="bg-gray-100 p-2 rounded-lg mb-2">
              <span className="text-xl text-gray-400">📄</span>
            </div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-tight leading-tight text-center">
              Select CSV<br/>File
            </p>
          </div>
        </div>

        <button type="submit" className="w-full py-4 px-2 bg-[#FF9F00] hover:bg-[#E68F00] text-white font-black text-xs uppercase rounded-[15px] shadow-lg shadow-orange-100 
        active:scale-95 transition-all cursor-pointer">Upload Data</button>
        
      </form>
    </div>
  )
}