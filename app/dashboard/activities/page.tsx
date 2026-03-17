import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { activities } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import ActivitiesClient from "./client";

export default async function ActivitiesPage() {
  const session = await getAuthSession();
  if (!session) return null;

  const rows = await db
    .select()
    .from(activities)
    .where(eq(activities.teamId, session.teamId))
    .orderBy(activities.createdAt);

  return <ActivitiesClient activities={rows} userRole={session.role} />;
}