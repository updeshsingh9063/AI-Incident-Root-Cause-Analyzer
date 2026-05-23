import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://backend:8080';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.toString();
    const url = `${BACKEND_URL}/api/v1/incidents${query ? `?${query}` : ''}`;
    
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('Proxy GET /incidents error:', error);
    return NextResponse.json({ error: 'Backend unavailable' }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const res = await fetch(`${BACKEND_URL}/api/v1/incidents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('Proxy POST /incidents error:', error);
    return NextResponse.json({ error: 'Backend unavailable' }, { status: 503 });
  }
}
