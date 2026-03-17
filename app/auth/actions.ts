"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db/client";
import { users, teams, teamMembers } from "@/lib/db/schema";
import { setAuthSession, clearAuthSession, getAuthSession } from "@/lib/auth/session";
import { eq } from "drizzle-orm";

// Existing Zod schemas...

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function signUpWithPassword(formData) {
  const parsed = signUpSchema.parse(formData);

  // Check for existing user
  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.email, parsed.email));
  if (existing) {
    throw new Error("Account already exists.");
  }

  const passwordHash = await bcrypt.hash(parsed.password, 11);
  // Create user
  const [user] = await db
    .insert(users)
    .values({
      email: parsed.email,
      passwordHash,
      firstName: parsed.firstName,
      lastName: parsed.lastName,
    })
    .returning();

  // Auto-create a first team
  const [team] = await db
    .insert(teams)
    .values({
      name: `${parsed.firstName}'s Team`,
    })
    .returning();

  // Link user to the team as owner
  await db.insert(teamMembers).values({
    teamId: team.id,
    userId: user.id,
    role: "owner",
  });

  await setAuthSession(user.id, user.email);

  return { email: parsed.email };
}

export async function signInWithPassword(formData) {
  const parsed = signInSchema.parse(formData);

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, parsed.email));

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const isMatch = await bcrypt.compare(parsed.password, user.passwordHash);
  if (!isMatch) {
    throw new Error("Invalid email or password.");
  }

  // Make sure the user is on a team; get first one if needed
  const [membership] = await db
    .select({
      teamId: teamMembers.teamId,
      role: teamMembers.role,
    })
    .from(teamMembers)
    .where(eq(teamMembers.userId, user.id))
    .limit(1);

  if (!membership) {
    throw new Error("User has no active team.");
  }

  await setAuthSession(user.id, user.email);

  return { email: parsed.email };
}

export async function signOutAction() {
  clearAuthSession();
  return { ok: true };
}