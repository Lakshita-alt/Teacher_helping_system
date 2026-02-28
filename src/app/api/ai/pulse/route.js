import { NextResponse } from 'next/server';
import { updateStudentPulse } from '@/lib/data';

export async function POST(request) {
  try {
    const { updates } = await request.json(); // Array of { id, engagement }
    
    if (!updates || !Array.isArray(updates)) {
        return NextResponse.json({ error: 'Invalid updates format' }, { status: 400 });
    }

    let successCount = 0;
    updates.forEach(update => {
        const success = updateStudentPulse(update.id, update.engagement);
        if (success) successCount++;
    });

    return NextResponse.json({ 
        message: `Successfully synchronized ${successCount} pulse entries.`,
        count: successCount 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to synchronize pulse' }, { status: 500 });
  }
}
