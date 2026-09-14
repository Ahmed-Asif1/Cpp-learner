import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { UserProgress } from '../../../src/types';

export const dynamic = 'force-dynamic';

function getRedis(): Redis | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    return new Redis({ url, token });
  } catch (e) {
    console.error('[Redis init error]', e);
    return null;
  }
}

function isValidUsername(name: unknown): name is string {
  if (!name || typeof name !== 'string') return false;
  const trimmed = name.trim();
  return trimmed.length >= 2 && trimmed.length <= 24 && /^[a-zA-Z0-9_-]+$/.test(trimmed);
}

function userKey(username: string): string {
  return `cpp_odyssey:progress:${username.toLowerCase().trim()}`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username || username.trim() === '') {
    return NextResponse.json({ error: 'username is required' }, { status: 400 });
  }

  if (!isValidUsername(username)) {
    return NextResponse.json({ error: 'Invalid username format (2-24 chars, alphanumeric, _ or -)' }, { status: 400 });
  }

  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ error: 'DB not configured', offline: true }, { status: 503 });
  }

  try {
    const data = await redis.get(userKey(username));
    return NextResponse.json({ progress: data ?? null });
  } catch (e) {
    console.error('[progress GET]', e);
    return NextResponse.json({ error: 'DB not configured', offline: true }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  let body: { username?: string; progress?: UserProgress };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { username, progress } = body;
  if (!username || !progress) {
    return NextResponse.json({ error: 'username and progress are required' }, { status: 400 });
  }

  if (!isValidUsername(username)) {
    return NextResponse.json({ error: 'Invalid username format (2-24 chars, alphanumeric, _ or -)' }, { status: 400 });
  }

  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ error: 'DB not configured', offline: true }, { status: 503 });
  }

  try {
    // Store with 90-day TTL (seconds)
    await redis.set(userKey(username), JSON.stringify(progress), { ex: 60 * 60 * 24 * 90 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[progress POST]', e);
    return NextResponse.json({ error: 'DB not configured', offline: true }, { status: 503 });
  }
}
