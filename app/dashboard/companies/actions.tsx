"use server";

import { z } from "zod";
import { db } from "@/lib/db/client";
import { companies } from "@/lib/db/schema";
import { getAuthSession } from "@/lib/auth/session";
import { eq, and } from "drizzle-orm";

// Validation schema
const companySchema = z.object({
  name: z.string().min(1),
  website: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
});

// CREATE
export async function createCompanyAction(formData) {
  const session = await getAuthSession();
  if (!session || !session.teamId) {
    throw new Error("Not authenticated or missing team context");
  }
  const data = companySchema.parse(formData);
  await db.insert(companies).values({
    ...data,
    teamId: session.teamId,
  });
}

// UPDATE
export async function updateCompanyAction(formData) {
  const session = await getAuthSession();
  if (!session) {
    throw new Error("Not authenticated");
  }
  const { id, ...rest } = formData;
  const data = companySchema.parse(rest);
  await db
    .update(companies)
    .set(data)
    .where(and(eq(companies.id, id), eq(companies.teamId, session.teamId)));
}

// DELETE
export async function deleteCompanyAction({ id }) {
  const session = await getAuthSession();
  if (!session) {
    throw new Error("Not authenticated");
  }
  await db.delete(companies).where(and(eq(companies.id, id), eq(companies.teamId, session.teamId)));
}