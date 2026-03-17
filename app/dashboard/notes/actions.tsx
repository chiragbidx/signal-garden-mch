"use server";

import { z } from "zod";
import { db } from "@/lib/db/client";
import { notes } from "@/lib/db/schema";
import { getAuthSession } from "@/lib/auth/session";
import { eq, and } from "drizzle-orm";

// Only simple note creation/delete for now
const noteSchema = z.object({
  relatedType: z.enum(["contact", "company", "deal"]),
  relatedId: z.string().min(1),
  content: z.string().min(1),
});

export async function createNoteAction(formData) {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated");
  const data = noteSchema.parse(formData);
  await db.insert(notes).values({
    ...data,
    teamId: session.teamId,
    createdBy: session.userId,
  });
}

export async function deleteNoteAction({ id }) {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated");
  await db.delete(notes).where(and(eq(notes.id, id), eq(notes.teamId, session.teamId)));
}