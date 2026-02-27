import { NextResponse } from 'next/server';
import { getStudentSuggestion, getClassSuggestion } from '@/lib/gemini';

export async function POST(request) {
  try {
    const data = await request.json();
    
    if (data.type === 'student') {
        const suggestion = await getStudentSuggestion(data.student);
        return NextResponse.json({ suggestion });
    } else if (data.type === 'class') {
        const suggestion = await getClassSuggestion(data.classData);
        return NextResponse.json({ suggestion });
    }
    
    return NextResponse.json({ error: 'Invalid data type' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate AI insights' }, { status: 500 });
  }
}
