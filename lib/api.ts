import { NextResponse } from "next/server";
import { ZodError, ZodSchema } from "zod";

// ============================================================================
// Rate Limiting (In-Memory)
// ============================================================================

// Simple in-memory rate limiter (backup for Vercel WAF)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// 60 requests per minute (matches Vercel WAF config)
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX || "60", 10);
const RATE_LIMIT_WINDOW_MS = parseInt(
  process.env.RATE_LIMIT_WINDOW_MS || "60000",
  10
);

// Cleanup tracking (request-based cleanup instead of setInterval)
let lastCleanup = Date.now();
const CLEANUP_INTERVAL = 60000; // 1 minute
const MAX_ENTRIES = 10000; // Prevent unbounded growth

export function getRateLimitKey(request: Request): string {
  // Vercel provides the real IP in x-forwarded-for
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const firstForwarded = forwarded?.split(",")[0]?.trim();
  const ip = firstForwarded || realIp || "unknown";
  return ip;
}

export function checkRateLimit(key: string): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} {
  const now = Date.now();

  // Periodic cleanup (serverless-friendly, no setInterval)
  if (now - lastCleanup > CLEANUP_INTERVAL || rateLimitMap.size > MAX_ENTRIES) {
    for (const [k, record] of rateLimitMap) {
      if (now > record.resetTime) {
        rateLimitMap.delete(k);
      }
    }
    lastCleanup = now;
  }

  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    // Reset or create new record
    const resetTime = now + RATE_LIMIT_WINDOW_MS;
    rateLimitMap.set(key, { count: 1, resetTime });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1, resetTime };
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }

  record.count++;
  return {
    allowed: true,
    remaining: RATE_LIMIT_MAX - record.count,
    resetTime: record.resetTime,
  };
}

// Note: Cleanup is now done within checkRateLimit() on each request
// This is more reliable in serverless environments than setInterval

// ============================================================================
// Response Helpers
// ============================================================================

export function rateLimitResponse(resetTime: number) {
  const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);
  return NextResponse.json(
    {
      error: "Too many requests",
      message: "Rate limit exceeded. Please try again later.",
      retryAfter,
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfter),
        "X-RateLimit-Limit": String(RATE_LIMIT_MAX),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": String(Math.ceil(resetTime / 1000)),
      },
    }
  );
}

export function errorResponse(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function validationErrorResponse(error: ZodError) {
  const issues = error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));

  return NextResponse.json(
    {
      error: "Validation failed",
      issues,
    },
    { status: 400 }
  );
}

export function successResponse<T>(data: T, headers?: Record<string, string>) {
  return NextResponse.json(data, { headers });
}

// ============================================================================
// Validation Helper
// ============================================================================

export async function validateRequest<T>(
  request: Request,
  schema: ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; error: ZodError }> {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    return { success: true, data: result.data };
  } catch {
    // JSON parse error
    const error = new ZodError([
      {
        code: "custom",
        path: [],
        message: "Invalid JSON body",
      },
    ]);
    return { success: false, error };
  }
}

export function validateQuery<T>(
  params: URLSearchParams,
  schema: ZodSchema<T>
): { success: true; data: T } | { success: false; error: ZodError } {
  const obj = Object.fromEntries(params.entries());
  const result = schema.safeParse(obj);

  if (!result.success) {
    return { success: false, error: result.error };
  }

  return { success: true, data: result.data };
}
