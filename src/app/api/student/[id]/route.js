import { NextResponse } from 'next/server';
import { getStudentById } from '@/lib/data';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const student = getStudentById(id);
    
    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }
    
    return NextResponse.json(student);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch student details' }, { status: 500 });
  }
}
