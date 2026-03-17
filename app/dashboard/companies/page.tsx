import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { companies } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import CompaniesClient from "./client";

// Server component – Companies dashboard
export default async function CompaniesPage() {
  const session = await getAuthSession();
  if (!session) return null;

  // Fetch all companies for the user's team
  const companyRows = await db
    .select()
    .from(companies)
    .where(eq(companies.teamId, session.teamId))
    .orderBy(companies.createdAt);

  return (
    <CompaniesClient
      companies={companyRows}
      userRole={session.role}
    />
  );
}