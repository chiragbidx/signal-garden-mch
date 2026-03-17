import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { pipelines } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import PipelinesClient from "./client";

export default async function PipelinesPage() {
  const session = await getAuthSession();
  if (!session) return null;

  // Fetch all pipelines for the user's team
  const pipelineRows = await db
    .select()
    .from(pipelines)
    .where(eq(pipelines.teamId, session.teamId))
    .orderBy(pipelines.createdAt);

  return (
    <PipelinesClient
      pipelines={pipelineRows}
      userRole={session.role}
    />
  );
}