import { NextResponse } from 'next/server';
import { getStudents } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const className = searchParams.get('className');
    
    let students = getStudents();
    
    if (className) {
      students = students.filter(s => s.className === className);
    }
    
    return NextResponse.json(students);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}
