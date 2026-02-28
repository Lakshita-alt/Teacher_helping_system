"use client"
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@/component/Icons';

export default function NotificationBell() {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [lastReadTimestamp, setLastReadTimestamp] = useState(null);
    const [teacherId, setTeacherId] = useState(null);
    const [mounted, setMounted] = useState(false);
    const prevCountRef = useRef(0);
    const audioRef = useRef(null);

    const fetchNotifications = async (currentTeacherId) => {
        try {
            const res = await fetch('/api/notifications');
            const data = await res.json();
            
            // Filter notifications for this teacher
            const filteredData = data.filter(n => 
                n.target === 'all' || 
                n.target === 'urgent' || 
                n.target === 'news' || 
                n.target === currentTeacherId
            );
            
            setNotifications(filteredData);
            
            // Check for new notifications since last read or last check
            const lastReadTime = localStorage.getItem('teacher_last_notif_read') || '0';
            const unread = filteredData.filter(n => new Date(n.timestamp).getTime() > parseInt(lastReadTime));
            setUnreadCount(unread.length);

            // Play sound if new notification detected
            if (filteredData.length > prevCountRef.current && prevCountRef.current !== 0) {
                if (audioRef.current) {
                    audioRef.current.play().catch(e => console.log('Audio play failed', e));
                }
            }
            prevCountRef.current = filteredData.length;
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };

    useEffect(() => {
        setMounted(true);
        // Get teacher ID from token
        const token = localStorage.getItem('teacher_token');
        let currentTeacherId = null;
        if (token) {
            try {
                const payload = JSON.parse(atob(token));
                currentTeacherId = payload.teacherId;
                // Move state update outside of immediate execution or wrap it
                setTimeout(() => {
                    setTeacherId(currentTeacherId);
                }, 0);
            } catch (e) {
                console.error("Failed to parse teacher token", e);
            }
        }

        // Load last read timestamp
        const lastRead = localStorage.getItem('teacher_last_notif_read');
        if (lastRead) {
            setTimeout(() => {
                setLastReadTimestamp(parseInt(lastRead));
            }, 0);
        }

        setTimeout(() => {
            fetchNotifications(currentTeacherId);
        }, 0);
        const interval = setInterval(() => fetchNotifications(currentTeacherId), 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

    const toggleNotifications = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            const now = Date.now();
            setLastReadTimestamp(now);
            setUnreadCount(0);
            localStorage.setItem('teacher_last_notif_read', now.toString());
        }
    };

    return (
        <div className="relative">
            <button 
                onClick={toggleNotifications}
                className="p-3 bg-sidebar-border/20 hover:bg-sidebar-border/40 rounded-xl transition-all relative group"
            >
                <Icon name="notification" className="w-6 h-6 group-hover:scale-110 transition-transform text-foreground" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full shadow-sm dark:shadow-none">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Notification Sound */}
            <audio ref={audioRef} src="https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3" />

            {isOpen && mounted && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-10">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-background/80 backdrop-blur-md animate-in fade-in duration-300"
                        onClick={() => setIsOpen(false)}
                    />
                    
                    {/* Modal Content */}
                    <div className="relative w-full max-w-5xl bg-sidebar border border-sidebar-border rounded-[2.5rem] shadow-2xl overflow-hidden font-mono animate-in zoom-in-95 duration-300 flex flex-col max-h-[80vh]">
                        <div className="p-8 border-b border-sidebar-border bg-foreground/5 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-black uppercase tracking-tighter italic">Notification Archive</h3>
                                <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest mt-1">Incoming Transmissions</p>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-foreground/5 hover:bg-rose-500 hover:text-white transition-all group"
                            >
                                <Icon name="close" className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                            {notifications.length === 0 ? (
                                <div className="py-20 text-center">
                                    <Icon name="notification" className="w-12 h-12 mb-4 opacity-20 mx-auto" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 italic">No historical data found in the archives.</p>
                                </div>
                            ) : (
                                notifications.map((n) => {
                                    const isNew = new Date(n.timestamp).getTime() > (lastReadTimestamp || 0);
                                    return (
                                        <div 
                                            key={n.id} 
                                            className={`p-6 rounded-3xl border transition-all ${
                                                isNew 
                                                ? 'bg-accent/5 border-accent shadow-lg dark:shadow-none' 
                                                : 'bg-foreground/[0.02] border-sidebar-border hover:border-foreground/20'
                                            }`}
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex gap-2">
                                                    <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-full ${
                                                        n.target === 'urgent' ? 'bg-rose-500 text-white' : 'bg-foreground/10'
                                                    }`}>
                                                        {n.target}
                                                    </span>
                                                    {isNew && (
                                                        <span className="text-[8px] font-black uppercase px-2 py-1 rounded-full bg-accent text-foreground animate-pulse">
                                                            New
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-[10px] font-bold opacity-40 uppercase">
                                                    {new Date(n.timestamp).toLocaleDateString()} @ {new Date(n.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                </span>
                                            </div>
                                            <h4 className="text-sm font-black uppercase tracking-tight mb-2">{n.title}</h4>
                                            <p className="text-xs opacity-70 leading-relaxed font-sans">{n.message}</p>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        <div className="p-8 border-t border-sidebar-border bg-foreground/[0.02] flex justify-between items-center">
                            <div className="text-[8px] font-black uppercase opacity-30">
                                Total Messages: {notifications.length}
                            </div>
                            <button 
                                className="px-6 py-3 bg-foreground text-background text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-accent hover:text-foreground transition-all active:scale-95"
                                onClick={() => {
                                    localStorage.setItem('teacher_last_notif_read', Date.now().toString());
                                    setUnreadCount(0);
                                    setIsOpen(false);
                                }}
                            >
                                Mark All as Read
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
