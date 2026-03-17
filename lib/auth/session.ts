import { cookies } from "next/headers";
import { db } from "@/lib/db/client";
import { teamMembers, teams } from "@/lib/db/schema";

// Session cookie config
const SESSION_COOKIE = "panda_auth_session";
const SESSION_OPTIONS = {
  httpOnly: true,
  sameSite: "none" as const,
  secure: true,
  path: "/",
  maxAge: 60 * 60 * 24 * 30, // 30 days
};

// The session payload now includes teamId and role
export interface AuthSession {
  userId: string;
  email: string;
  teamId: string;
  role: string;
}

// Set the session cookie with teamId and role
export async function setAuthSession(userId: string, email: string) {
  // Look up team membership for teamId and role
  const [membership] = await db
    .select({
      teamId: teamMembers.teamId,
      role: teamMembers.role,
    })
    .from(teamMembers)
    .where(teamMembers.userId.eq(userId))
    .limit(1);

  if (!membership) {
    throw new Error("User must have an active team");
  }

  const session: AuthSession = {
    userId,
    email,
    teamId: membership.teamId,
    role: membership.role,
  };
  cookies().set(
    SESSION_COOKIE,
    JSON.stringify(session),
    SESSION_OPTIONS
  );
}

// Get the session cookie, parse and return full session, or null
export function getAuthSession(): AuthSession | null {
  const value = cookies().get(SESSION_COOKIE)?.value;
  if (!value) return null;
  try {
    const data = JSON.parse(value);
    if (!("userId" in data) || !("email" in data) || !("teamId" in data) || !("role" in data)) return null;
    return data as AuthSession;
  } catch {
    return null;
  }
}

// Clear/expire the session cookie
export function clearAuthSession() {
  cookies().set(SESSION_COOKIE, "", {
    ...SESSION_OPTIONS,
    maxAge: 0,
  });
}