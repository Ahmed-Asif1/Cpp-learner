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

// In-memory sliding-window IP rate limiter
interface RateLimitEntry {
  count: number;
  resetTime: number;
}
const ipRateLimitMap = new Map<string, RateLimitEntry>();

function isRateLimited(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = ipRateLimitMap.get(ip);

  // Clean up expired entries if map grows
  if (ipRateLimitMap.size > 5000) {
    for (const [key, val] of ipRateLimitMap.entries()) {
      if (now > val.resetTime) {
        ipRateLimitMap.delete(key);
      }
    }
  }

  if (!entry || now > entry.resetTime) {
    ipRateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (entry.count >= limit) {
    return true;
  }

  entry.count++;
  return false;
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const firstIp = forwarded.split(',')[0].trim();
    if (firstIp) return firstIp;
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return '127.0.0.1';
}

function isValidUsername(name: unknown): name is string {
  if (!name || typeof name !== 'string') return false;
  const trimmed = name.trim();
  return trimmed.length >= 2 && trimmed.length <= 24 && /^[a-zA-Z0-9_-]+$/.test(trimmed);
}

function isValidProgress(progress: unknown): progress is UserProgress {
  if (!progress || typeof progress !== 'object' || Array.isArray(progress)) {
    return false;
  }
  const p = progress as Partial<UserProgress>;
  if (!Array.isArray(p.completedLessons) || !Array.isArray(p.completedExercises)) {
    return false;
  }
  if (p.completedLessons.length > 500 || p.completedExercises.length > 500) {
    return false;
  }
  if (typeof p.xp !== 'number' || p.xp < 0 || p.xp > 10_000_000 || !Number.isFinite(p.xp)) {
    return false;
  }
  return true;
}

function userKey(username: string): string {
  return `cpp_odyssey:progress:${username.toLowerCase().trim()}`;
}

export async function GET(request: NextRequest) {
  // Rate limit: 60 GET requests per minute per IP
  const clientIp = getClientIp(request);
  if (isRateLimited(clientIp, 60, 60_000)) {
    return NextResponse.json(
      { error: 'Too many requests. Please slow down.' },
      { status: 429, headers: { 'Retry-After': '60' } }
    );
  }

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
  // Rate limit: 30 POST requests per minute per IP
  const clientIp = getClientIp(request);
  if (isRateLimited(clientIp, 30, 60_000)) {
    return NextResponse.json(
      { error: 'Too many requests. Please slow down.' },
      { status: 429, headers: { 'Retry-After': '60' } }
    );
  }

  // Reject oversized payloads (max 32KB)
  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength, 10) > 32768) {
    return NextResponse.json({ error: 'Payload too large (max 32KB)' }, { status: 413 });
  }

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

  if (!isValidProgress(progress)) {
    return NextResponse.json({ error: 'Invalid progress data structure' }, { status: 400 });
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
