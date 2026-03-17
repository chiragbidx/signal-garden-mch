import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { tasks, contacts, companies, deals } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import TasksClient from "./client";

export default async function TasksPage() {
  const session = await getAuthSession();
  if (!session) return null;

  const taskRows = await db
    .select()
    .from(tasks)
    .where(eq(tasks.teamId, session.teamId))
    .orderBy(tasks.createdAt);

  const contactRows = await db
    .select({ id: contacts.id, firstName: contacts.firstName, lastName: contacts.lastName })
    .from(contacts)
    .where(eq(contacts.teamId, session.teamId));

  const companyRows = await db
    .select({ id: companies.id, name: companies.name })
    .from(companies)
    .where(eq(companies.teamId, session.teamId));

  const dealRows = await db
    .select({ id: deals.id, name: deals.name })
    .from(deals)
    .where(eq(deals.teamId, session.teamId));

  return (
    <TasksClient
      tasks={taskRows}
      contacts={contactRows}
      companies={companyRows}
      deals={dealRows}
      userRole={session.role}
    />
  );
}