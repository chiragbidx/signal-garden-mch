"use server";

import { z } from "zod";
import { db } from "@/lib/db/client";
import { tasks } from "@/lib/db/schema";
import { getAuthSession } from "@/lib/auth/session";
import { eq, and } from "drizzle-orm";

const taskSchema = z.object({
  relatedType: z.enum(["contact", "company", "deal"]),
  relatedId: z.string().min(1),
  title: z.string().min(1),
  dueDate: z.string().optional().or(z.literal("")),
  completed: z.coerce.number().default(0),
});

export async function createTaskAction(formData) {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated");
  const data = taskSchema.parse(formData);
  await db.insert(tasks).values({
    ...data,
    dueDate: data.dueDate ? new Date(data.dueDate) : null,
    teamId: session.teamId,
    createdBy: session.userId,
  });
}

export async function updateTaskAction(formData) {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated");
  const { id, ...rest } = formData;
  const data = taskSchema.parse(rest);
  await db
    .update(tasks)
    .set({ ...data, dueDate: data.dueDate ? new Date(data.dueDate) : null })
    .where(and(eq(tasks.id, id), eq(tasks.teamId, session.teamId)));
}

export async function deleteTaskAction({ id }) {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated");
  await db.delete(tasks).where(and(eq(tasks.id, id), eq(tasks.teamId, session.teamId)));
}