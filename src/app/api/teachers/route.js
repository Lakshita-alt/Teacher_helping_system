import { NextResponse } from 'next/server';
import { getTeachers } from '@/lib/data';

export async function GET() {
  try {
    const teachers = getTeachers();
    return NextResponse.json(teachers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch teachers' }, { status: 500 });
  }
}
