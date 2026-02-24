"use client"
import { redirect, usePathname } from 'next/navigation';

export default function Admin() {
    const pathname = usePathname();

  if (pathname.startsWith('/admin') && !pathname.includes('/school')) {
    redirect('/admin/login');
  }
    return (
        <div className="flex justify-center items-center h-screen">
      <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
    </div>
    )
}