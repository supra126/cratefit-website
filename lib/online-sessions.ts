import { randomUUID } from 'crypto';
import { OnlinePacker, type BinSpec, type ItemSpec } from '@cratefit/pack';

interface Session {
  packer: OnlinePacker;
  bin: BinSpec;
  createdAt: number;
  lastAccess: number;
}

const sessions = new Map<string, Session>();
const SESSION_TTL = 30 * 60 * 1000; // 30 minutes
const MAX_SESSIONS = 1000; // Limit to prevent memory issues

export function generateSessionId(): string {
  return randomUUID();
}

// Clean up expired sessions (called on each request)
function cleanupExpiredSessions() {
  const now = Date.now();
  for (const [sessionId, session] of sessions) {
    if (now - session.lastAccess > SESSION_TTL) {
      sessions.delete(sessionId);
    }
  }
}

export function createSession(bin: BinSpec): string {
  // Cleanup expired sessions first
  cleanupExpiredSessions();

  // Limit total sessions to prevent memory issues
  if (sessions.size >= MAX_SESSIONS) {
    // Remove oldest sessions
    const sortedSessions = [...sessions.entries()].sort(
      (a, b) => a[1].lastAccess - b[1].lastAccess
    );
    const toRemove = sortedSessions.slice(0, Math.floor(MAX_SESSIONS / 4));
    for (const [id] of toRemove) {
      sessions.delete(id);
    }
  }

  const sessionId = generateSessionId();
  const packer = new OnlinePacker({ bins: [bin] });

  sessions.set(sessionId, {
    packer,
    bin,
    createdAt: Date.now(),
    lastAccess: Date.now(),
  });

  return sessionId;
}

export function getSession(sessionId: string): OnlinePacker | null {
  const session = sessions.get(sessionId);
  if (!session) return null;

  session.lastAccess = Date.now();
  return session.packer;
}

export function deleteSession(sessionId: string): boolean {
  return sessions.delete(sessionId);
}

export function getSessionState(sessionId: string) {
  const session = sessions.get(sessionId);
  if (!session) return null;

  const { packer, bin } = session;
  const binState = packer.getBinState(bin.id);

  return {
    bin,
    items: binState?.items ?? [],
    utilization: binState?.utilization ?? 0,
    stats: packer.getStats(),
  };
}

// Note: Session cleanup is now done on each createSession call
// This is more reliable in serverless environments than setInterval
