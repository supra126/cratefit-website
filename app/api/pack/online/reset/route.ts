import { NextRequest } from "next/server";
import {
  getRateLimitKey,
  checkRateLimit,
  rateLimitResponse,
  errorResponse,
  validationErrorResponse,
  successResponse,
  validateRequest,
} from "@/lib/api";
import { getSession, getSessionState } from "@/lib/online-sessions";
import { resetRequestSchema } from "@/lib/schemas";

export async function POST(request: NextRequest) {
  const key = getRateLimitKey(request);
  const { allowed, remaining, resetTime } = checkRateLimit(key);

  if (!allowed) {
    return rateLimitResponse(resetTime);
  }

  // Validate input with Zod (early exit on invalid input)
  const validation = await validateRequest(request, resetRequestSchema);

  if (!validation.success) {
    return validationErrorResponse(validation.error);
  }

  const { sessionId } = validation.data;

  try {
    const packer = getSession(sessionId);
    if (!packer) {
      return errorResponse("Session not found or expired", 404);
    }

    packer.reset();
    const state = getSessionState(sessionId);

    return successResponse(
      {
        reset: true,
        ...state,
      },
      {
        "X-RateLimit-Remaining": String(remaining),
      }
    );
  } catch (error) {
    console.error("Online pack reset error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Internal server error",
      500
    );
  }
}
