"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Icon } from '@/component/Icons';

export default function Suggestion(){
    const pathname = usePathname();
    const isActive = pathname === "/home/teacher";

    return(
        <div className="w-full mb-3">
            <Link href="/home/teacher" className="block w-full">
                <button type="button" 
                    className={`w-full py-4 px-6 border border-sidebar-border font-bold text-sm uppercase tracking-wider rounded-2xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all cursor-pointer text-left ${
                        isActive 
                        ? "bg-foreground text-background shadow-xl dark:shadow-none" 
                        : "bg-button-bg hover:bg-button-hover text-button-text"
                    }`}>
                    <span className="mr-2"><Icon name="suggestion" className="w-4 h-4 inline" /></span> Gemini Insights
                </button>
            </Link>
        </div>
    )
}