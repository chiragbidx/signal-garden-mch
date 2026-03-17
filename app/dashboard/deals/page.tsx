import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { deals, companies, contacts, pipelines } from "@/lib/db/schema";
import DealsClient from "./client";

export default async function DealsPage() {
  const session = await getAuthSession();
  if (!session) return null;
  // Fetch deals + for select options, fetch companies, contacts, pipelines
  const dealRows = await db
    .select()
    .from(deals)
    .where(deals.teamId.eq(session.teamId))
    .orderBy(deals.createdAt);

  const companyRows = await db
    .select({ id: companies.id, name: companies.name })
    .from(companies)
    .where(companies.teamId.eq(session.teamId));

  const contactRows = await db
    .select({ id: contacts.id, firstName: contacts.firstName, lastName: contacts.lastName })
    .from(contacts)
    .where(contacts.teamId.eq(session.teamId));

  const pipelineRows = await db
    .select({ id: pipelines.id, name: pipelines.name })
    .from(pipelines)
    .where(pipelines.teamId.eq(session.teamId));

  return (
    <DealsClient
      deals={dealRows}
      companies={companyRows}
      contacts={contactRows}
      pipelines={pipelineRows}
      userRole={session.role}
    />
  );
}