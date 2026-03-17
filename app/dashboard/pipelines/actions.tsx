"use server";

import { z } from "zod";
import { db } from "@/lib/db/client";
import { pipelines } from "@/lib/db/schema";
import { getAuthSession } from "@/lib/auth/session";
import { eq, and } from "drizzle-orm";

const pipelineSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().or(z.literal("")),
});

// CREATE
export async function createPipelineAction(formData) {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated");
  const data = pipelineSchema.parse(formData);
  await db.insert(pipelines).values({
    ...data,
    teamId: session.teamId,
  });
}

// UPDATE
export async function updatePipelineAction(formData) {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated");
  const { id, ...rest } = formData;
  const data = pipelineSchema.parse(rest);
  await db
    .update(pipelines)
    .set(data)
    .where(and(eq(pipelines.id, id), eq(pipelines.teamId, session.teamId)));
}

// DELETE
export async function deletePipelineAction({ id }) {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated");
  await db.delete(pipelines).where(and(eq(pipelines.id, id), eq(pipelines.teamId, session.teamId)));
}