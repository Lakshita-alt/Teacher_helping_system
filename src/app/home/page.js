"use client"

import UploadForm from "@/component/Uploadcsv"

export default function Home(){
    return(
        <div className="min-h-[85vh] flex flex-col items-center justify-center p-4 w-full text-foreground">
             <div className="text-center mb-12 space-y-3 w-full max-w-2xl px-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight uppercase italic leading-tight">Upload Training Data</h1>
                <p className="text-muted font-bold text-[10px] md:text-xs uppercase tracking-[0.2em]">Process your student profiles and class data with AI</p>
             </div>
             
             <div className="bg-card p-6 md:p-12 rounded-[2.5rem] md:rounded-[4rem] shadow-2xl border border-card-border w-full max-w-[90%] md:max-w-xl lg:max-w-2xl">
                <UploadForm />
             </div>
             
             <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl px-4">
                {[
                    {icon: '📁', title: 'CSV Only', desc: 'Standard format'},
                    {icon: '⚡', title: 'Fast Process', desc: 'Instant results'},
                    {icon: '🛡️', title: 'Secure', desc: 'Encrypted data'}
                ].map((item, i) => (
                    <div key={i} className="bg-card p-8 rounded-3xl border border-card-border flex flex-col items-center text-center hover:bg-card-muted transition-all duration-300">
                        <span className="text-3xl mb-3">{item.icon}</span>
                        <h3 className="font-bold text-sm md:text-base">{item.title}</h3>
                        <p className="text-[10px] text-muted font-bold uppercase tracking-tight mt-1">{item.desc}</p>
                    </div>
                ))}
             </div>
        </div>
    )
}