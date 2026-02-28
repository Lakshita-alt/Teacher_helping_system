import fs from 'node:fs';
import path from 'node:path';
import { NextResponse } from 'next/server';

const NOTIFICATIONS_PATH = path.join(process.cwd(), 'notifications.json');

// Ensure the file exists
if (!fs.existsSync(NOTIFICATIONS_PATH)) {
    fs.writeFileSync(NOTIFICATIONS_PATH, JSON.stringify([]));
}

export async function GET() {
    try {
        const data = fs.readFileSync(NOTIFICATIONS_PATH, 'utf-8');
        return NextResponse.json(JSON.parse(data));
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read notifications' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const newNotification = await request.json();
        const data = fs.readFileSync(NOTIFICATIONS_PATH, 'utf-8');
        const notifications = JSON.parse(data);
        
        const notificationWithId = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            ...newNotification
        };
        
        notifications.unshift(notificationWithId);
        // Keep only last 50 notifications
        const trimmedNotifications = notifications.slice(0, 50);
        
        fs.writeFileSync(NOTIFICATIONS_PATH, JSON.stringify(trimmedNotifications, null, 2));
        return NextResponse.json(notificationWithId);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save notification' }, { status: 500 });
    }
}
