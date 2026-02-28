"use client"
import UploadForm from "@/component/Uploadcsv"
import { Icon } from "@/component/Icons"

export default function UploadPage(){
    return(
        <div className="min-h-[85vh] flex flex-col items-center justify-center p-4 w-full text-foreground">
             <div className="text-center mb-12 space-y-3 w-full max-w-2xl px-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight uppercase italic leading-tight">Data Management</h1>
                <p className="text-muted font-bold text-[10px] md:text-xs uppercase tracking-[0.2em]">Bulk process student profiles and class data with AI</p>
             </div>
             
             <div className="bg-card p-6 md:p-12 rounded-[2.5rem] md:rounded-[4rem] shadow-2xl border border-card-border w-full max-w-[90%] md:max-w-xl lg:max-w-2xl">
                <div className="mb-8 border-b border-card-border pb-4">
                    <h2 className="text-xl font-black uppercase italic">CSV Data Import</h2>
                    <p className="text-[10px] font-bold text-muted uppercase">Upload student metrics for analysis</p>
                </div>
                <UploadForm />
             </div>

             {/* New Bulk Submissions Section */}
             <div className="mt-8 bg-card p-6 md:p-12 rounded-[2.5rem] md:rounded-[4rem] shadow-2xl border border-card-border w-full max-w-[90%] md:max-w-xl lg:max-w-2xl">
                <div className="mb-8 border-b border-card-border pb-4">
                    <h2 className="text-xl font-black uppercase italic">Bulk Grading (.ZIP)</h2>
                    <p className="text-[10px] font-bold text-muted uppercase">Upload multiple student essays for AI batch grading</p>
                </div>
                <div className="relative group rounded-[2.5rem] overflow-hidden">
                    <input 
                        type="file" 
                        name="zipfile" 
                        accept=".zip" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
                    />
                    <div className="flex flex-col items-center justify-center p-10 md:p-14 border-4 border-dashed border-card-border bg-card-muted group-hover:bg-accent/10 group-hover:border-accent transition-all duration-300">
                        <div className="bg-card p-5 rounded-3xl mb-4 shadow-sm group-hover:scale-110 group-hover:shadow-lg transition-all duration-300 border border-card-border">
                            <Icon name="folder" className="w-10 h-10 text-foreground" />
                        </div>
                        <p className="text-sm font-black text-muted uppercase tracking-widest leading-tight text-center">
                            Drop a .zip of essays<br/>
                            <span className="text-[10px] text-accent font-bold mt-1 block">AI will process all files in sequence</span>
                        </p>
                    </div>
                </div>
                <button className="w-full mt-6 py-5 bg-button-bg text-button-text font-black text-sm uppercase tracking-widest rounded-2xl border border-sidebar-border hover:bg-button-hover transition-all">
                    Process Batch Grading
                </button>
             </div>
             
             <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl px-4">
                {[
                    {icon: 'folder', title: 'CSV Only', desc: 'Standard format'},
                    {icon: 'bolt', title: 'Fast Process', desc: 'Instant results'},
                    {icon: 'shield', title: 'Secure', desc: 'Encrypted data'}
                ].map((item, i) => (
                    <div key={i} className="bg-card p-8 rounded-3xl border border-card-border flex flex-col items-center text-center hover:bg-card-muted transition-all duration-300 text-foreground">
                        <Icon name={item.icon} className="w-10 h-10 mb-3" />
                        <h3 className="font-bold text-sm md:text-base">{item.title}</h3>
                        <p className="text-[10px] text-muted font-bold uppercase tracking-tight mt-1">{item.desc}</p>
                    </div>
                ))}
             </div>
        </div>
    )
}
