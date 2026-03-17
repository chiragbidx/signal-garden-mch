"use server";

import { z } from "zod";
import { db } from "@/lib/db/client";
import { contacts } from "@/lib/db/schema";
import { getAuthSession } from "@/lib/auth/session";
import { eq, and } from "drizzle-orm";

// Validation schema
const contactSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  title: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  companyId: z.string().optional().or(z.literal("")),
});

// CREATE
export async function createContactAction(formData) {
  const session = await getAuthSession();
  if (!session) {
    throw new Error("Not authenticated");
  }
  const data = contactSchema.parse(formData);
  await db.insert(contacts).values({
    ...data,
    teamId: session.teamId,
  });
}

// UPDATE
export async function updateContactAction(formData) {
  const session = await getAuthSession();
  if (!session) {
    throw new Error("Not authenticated");
  }
  const { id, ...rest } = formData;
  const data = contactSchema.parse(rest);
  await db
    .update(contacts)
    .set(data)
    .where(and(eq(contacts.id, id), eq(contacts.teamId, session.teamId)));
}

// DELETE
export async function deleteContactAction({ id }) {
  const session = await getAuthSession();
  if (!session) {
    throw new Error("Not authenticated");
  }
  await db.delete(contacts).where(and(eq(contacts.id, id), eq(contacts.teamId, session.teamId)));
}