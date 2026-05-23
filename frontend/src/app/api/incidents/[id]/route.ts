import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://backend:8080';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const res = await fetch(`${BACKEND_URL}/api/v1/incidents/${id}`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error(`Proxy GET /incidents/${(await params).id} error:`, error);
    return NextResponse.json({ error: 'Backend unavailable' }, { status: 503 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const res = await fetch(`${BACKEND_URL}/api/v1/incidents/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error(`Proxy PATCH /incidents/${(await params).id} error:`, error);
    return NextResponse.json({ error: 'Backend unavailable' }, { status: 503 });
  }
}
