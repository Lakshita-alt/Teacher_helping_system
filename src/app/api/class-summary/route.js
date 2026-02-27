import { NextResponse } from 'next/server';
import { getClassSummary } from '@/lib/data';

export async function GET() {
  try {
    const summary = getClassSummary();
    if (!summary) {
      return NextResponse.json({ error: 'No class data found' }, { status: 404 });
    }
    return NextResponse.json(summary);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch class summary' }, { status: 500 });
  }
}
