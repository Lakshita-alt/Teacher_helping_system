import { NextResponse } from 'next/server';
import { getClassSummaryByName } from '@/lib/data';

export async function GET(request, context) {
  const { params } = context;
  const { className } = await params;
  const decodedClassName = decodeURIComponent(className);
  try {
    const summary = getClassSummaryByName(decodedClassName);
    if (!summary) {
        return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }
    return NextResponse.json(summary);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch class summary' }, { status: 500 });
  }
}
