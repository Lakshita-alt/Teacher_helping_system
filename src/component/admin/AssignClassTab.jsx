"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AssignClassTab(){
    const pathname = usePathname();
    const isActive = pathname === "/admin/assign";

    return(
        <div className="w-full mb-3">
            <Link href="/admin/assign" className="block w-full">
                <button type="button" 
                    className={`w-full py-4 px-6 border border-sidebar-border font-bold text-sm uppercase tracking-wider rounded-2xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all cursor-pointer text-left ${
                        isActive 
                        ? "bg-foreground text-background shadow-xl shadow-accent/10" 
                        : "bg-button-bg hover:bg-button-hover text-button-text"
                    }`}>
                    <span className="mr-2">📝</span> Assign Class
                </button>
            </Link>
        </div>
    )
}
