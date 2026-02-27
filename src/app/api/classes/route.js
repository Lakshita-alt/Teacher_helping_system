import { NextResponse } from 'next/server';
import { getClasses } from '@/lib/data';

export async function GET() {
  try {
    const classes = getClasses();
    return NextResponse.json(classes);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch classes' }, { status: 500 });
  }
}
