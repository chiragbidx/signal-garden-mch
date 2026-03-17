"use server";

import { z } from "zod";
import { db } from "@/lib/db/client";
import { deals } from "@/lib/db/schema";
import { getAuthSession } from "@/lib/auth/session";
import { eq, and } from "drizzle-orm";

const dealSchema = z.object({
  name: z.string().min(1),
  companyId: z.string().optional().or(z.literal("")),
  contactId: z.string().optional().or(z.literal("")),
  pipelineId: z.string().optional().or(z.literal("")),
  value: z.coerce.number().nullable().optional(),
  stage: z.string().optional().or(z.literal("")),
  status: z.string().optional().default("open"),
  closeDate: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
});

// CREATE
export async function createDealAction(formData) {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated");
  const data = dealSchema.parse(formData);
  await db.insert(deals).values({
    ...data,
    teamId: session.teamId,
    closeDate: data.closeDate ? new Date(data.closeDate) : null,
  });
}

// UPDATE
export async function updateDealAction(formData) {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated");
  const { id, ...rest } = formData;
  const data = dealSchema.parse(rest);
  await db
    .update(deals)
    .set({
      ...data,
      closeDate: data.closeDate ? new Date(data.closeDate) : null,
    })
    .where(and(eq(deals.id, id), eq(deals.teamId, session.teamId)));
}

// DELETE
export async function deleteDealAction({ id }) {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated");
  await db.delete(deals).where(and(eq(deals.id, id), eq(deals.teamId, session.teamId)));
}