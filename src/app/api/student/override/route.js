import { NextResponse } from 'next/server';
import { updateStudentOverride } from '@/lib/data';

export async function POST(request) {
  try {
    const { id, overrideData } = await request.json();
    
    if (!id || !overrideData) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const success = updateStudentOverride(id, overrideData);

    if (success) {
        return NextResponse.json({ message: 'Pedagogical override applied successfully.' });
    } else {
        return NextResponse.json({ error: 'Failed to apply override.' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Server error during override processing.' }, { status: 500 });
  }
}
