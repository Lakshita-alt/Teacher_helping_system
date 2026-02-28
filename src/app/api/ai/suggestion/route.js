import { NextResponse } from 'next/server';
import { getStudentSuggestion, getClassSuggestion, getLessonPlan } from '@/lib/gemini';
import { getStudentById } from '@/lib/data';

export async function POST(request) {
  try {
    const data = await request.json();
    
    if (data.type === 'student') {
        // Fetch student data on the server side instead of taking it from frontend
        const student = data.id ? getStudentById(data.id) : data.student;
        
        if (!student) {
            return NextResponse.json({ error: 'Student not found' }, { status: 404 });
        }

        const suggestion = await getStudentSuggestion(student);
        return NextResponse.json({ suggestion });
    } else if (data.type === 'class') {
        const suggestion = await getClassSuggestion(data.classData);
        return NextResponse.json({ suggestion });
    } else if (data.type === 'lesson-plan') {
        const plan = await getLessonPlan(data.classData, data.topic);
        return NextResponse.json({ suggestion: plan });
    }
    
    return NextResponse.json({ error: 'Invalid data type' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate AI insights' }, { status: 500 });
  }
}
