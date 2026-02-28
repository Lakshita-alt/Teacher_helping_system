"use client"
import { useState, useEffect } from 'react';
import { Icon } from '@/component/Icons';

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [target, setTarget] = useState('all'); // all or specific teacher
    const [sending, setSending] = useState(false);
    const [status, setStatus] = useState({ type: '', text: '' });

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/notifications');
            const data = await res.json();
            setNotifications(data);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };

    const fetchTeachers = async () => {
        try {
            const res = await fetch('/api/teachers');
            const data = await res.json();
            setTeachers(data);
        } catch (error) {
            console.error('Failed to fetch teachers', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        fetchTeachers();
    }, []);

    const getTargetLabel = (targetId) => {
        if (targetId === 'all') return 'All Teachers';
        if (targetId === 'urgent') return 'Urgent Alerts';
        if (targetId === 'news') return 'General News';
        const teacher = teachers.find(t => t.id === targetId);
        return teacher ? `Teacher: ${teacher.name}` : targetId;
    };

    const sendNotification = async (e) => {
        e.preventDefault();
        if (!title || !message) return;

        setSending(true);
        setStatus({ type: '', text: '' });

        try {
            const res = await fetch('/api/notifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, message, target }),
            });

            if (res.ok) {
                setStatus({ type: 'success', text: 'Notification sent successfully!' });
                setTitle('');
                setMessage('');
                fetchNotifications();
            } else {
                setStatus({ type: 'error', text: 'Failed to send notification.' });
            }
        } catch (error) {
            setStatus({ type: 'error', text: 'An error occurred while sending.' });
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-8">
            <h1 className="text-3xl font-black uppercase tracking-tighter italic border-b-4 border-foreground pb-4">
                Global Notification Center
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Send Form */}
                <div className="bg-sidebar p-8 rounded-3xl border border-sidebar-border shadow-2xl">
                    <h2 className="text-sm font-black uppercase tracking-widest mb-6 opacity-60">Send New Message</h2>
                    <form onSubmit={sendNotification} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40 px-2">Message Title</label>
                            <input 
                                type="text" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Alert: Scheduled Maintenance"
                                className="w-full bg-background border border-sidebar-border p-4 rounded-xl font-mono text-xs focus:ring-2 focus:ring-accent outline-none"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40 px-2">Broadcast Target</label>
                            <select 
                                value={target}
                                onChange={(e) => setTarget(e.target.value)}
                                className="w-full bg-background border border-sidebar-border p-4 rounded-xl font-mono text-xs focus:ring-2 focus:ring-accent outline-none"
                            >
                                <optgroup label="Broadcasting">
                                    <option value="all">All Teachers</option>
                                    <option value="urgent">Urgent Alerts Only</option>
                                    <option value="news">General News</option>
                                </optgroup>
                                <optgroup label="Specific Teachers">
                                    {teachers.map(teacher => (
                                        <option key={teacher.id} value={teacher.id}>{teacher.name} ({teacher.subject})</option>
                                    ))}
                                </optgroup>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40 px-2">Message Body</label>
                            <textarea 
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Details of the announcement..."
                                rows="4"
                                className="w-full bg-background border border-sidebar-border p-4 rounded-xl font-mono text-xs focus:ring-2 focus:ring-accent outline-none resize-none"
                                required
                            />
                        </div>

                        {status.text && (
                            <div className={`p-4 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                                status.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                            }`}>
                                {status.text}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={sending}
                            className="w-full bg-foreground text-background font-black py-4 rounded-2xl hover:bg-accent hover:text-foreground transition-all shadow-xl dark:shadow-none flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                        >
                            <span>{sending ? 'TRANSMITTING...' : 'INITIATE BROADCAST'}</span>
                            <Icon name="megaphone" className="w-5 h-5" />
                        </button>
                    </form>
                </div>

                {/* Sent History */}
                <div className="space-y-4">
                    <h2 className="text-sm font-black uppercase tracking-widest mb-6 opacity-60">Transmission History</h2>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {notifications.length === 0 ? (
                            <div className="p-8 border-2 border-dashed border-sidebar-border rounded-3xl text-center opacity-30 italic text-xs">
                                No messages in the archives.
                            </div>
                        ) : (
                            notifications.map((n) => (
                                <div key={n.id} className="bg-sidebar p-6 rounded-2xl border border-sidebar-border relative group overflow-hidden">
                                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity">
                                        <span className="text-[8px] font-black uppercase">{new Date(n.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1 text-foreground">
                                            {n.target === 'urgent' ? <Icon name="warning" className="w-6 h-6" /> : n.target === 'news' ? <Icon name="newspaper" className="w-6 h-6" /> : <Icon name="mail" className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <h3 className="font-black text-xs uppercase tracking-tight">{n.title}</h3>
                                            <p className="text-[10px] mt-2 opacity-70 leading-relaxed font-sans">{n.message}</p>
                                            <div className="flex gap-2 mt-4">
                                                <span className="text-[8px] font-black bg-foreground/5 px-2 py-1 rounded uppercase tracking-tighter">
                                                    Target: {getTargetLabel(n.target)}
                                                </span>
                                                <span className="text-[8px] font-black bg-foreground/5 px-2 py-1 rounded uppercase tracking-tighter">
                                                    {new Date(n.timestamp).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
