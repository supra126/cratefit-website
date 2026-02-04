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
import { placeRequestSchema } from "@/lib/schemas";

export async function POST(request: NextRequest) {
  const key = getRateLimitKey(request);
  const { allowed, remaining, resetTime } = checkRateLimit(key);

  if (!allowed) {
    return rateLimitResponse(resetTime);
  }

  // Validate input with Zod (early exit on invalid input)
  const validation = await validateRequest(request, placeRequestSchema);

  if (!validation.success) {
    return validationErrorResponse(validation.error);
  }

  const { sessionId, item } = validation.data;

  try {
    const packer = getSession(sessionId);
    if (!packer) {
      return errorResponse("Session not found or expired", 404);
    }

    const placement = packer.placeItem(item);
    const state = getSessionState(sessionId);

    return successResponse(
      {
        placed: placement !== null,
        placement,
        ...state,
      },
      {
        "X-RateLimit-Remaining": String(remaining),
      }
    );
  } catch (error) {
    console.error("Online pack place error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Internal server error",
      500
    );
  }
}
