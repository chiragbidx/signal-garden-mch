import { cookies } from "next/headers";
import { db } from "@/lib/db/client";
import { teamMembers } from "@/lib/db/schema";

// Session cookie config
const SESSION_COOKIE = "panda_auth_session";
const SESSION_OPTIONS = {
  httpOnly: true,
  sameSite: "none" as const,
  secure: true,
  path: "/",
  maxAge: 60 * 60 * 24 * 30, // 30 days
};

export interface AuthSession {
  userId: string;
  email: string;
  teamId: string;
  role: string;
}

// Set the session cookie with teamId and role (to be used in Server Actions)
export async function setAuthSession(userId: string, email: string) {
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

// Get the session cookie and parse, returns full session or null
export function getAuthSession(): AuthSession | null {
  // cookies() in Next.js returns a RequestCookies object (App Router)
  // .get returns { value: string } or undefined
  const cookieVal = cookies().get(SESSION_COOKIE)?.value;
  if (!cookieVal) return null;
  try {
    const data = JSON.parse(cookieVal);
    const valid =
      typeof data === "object" &&
      data &&
      typeof data.userId === "string" &&
      typeof data.email === "string" &&
      typeof data.teamId === "string" &&
      typeof data.role === "string";
    return valid ? (data as AuthSession) : null;
  } catch {
    return null;
  }
}

// Clear/expire the session cookie (for sign out)
export function clearAuthSession() {
  cookies().set(SESSION_COOKIE, "", {
    ...SESSION_OPTIONS,
    maxAge: 0,
  });
}