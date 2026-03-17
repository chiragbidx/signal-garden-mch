import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { contacts, companies } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import ContactsClient from "./client";

// Server component – Contacts dashboard
export default async function ContactsPage() {
  const session = await getAuthSession();
  if (!session) {
    // Auth guard – redirect from server, not on client
    return null;
  }

  // Fetch all contacts for the user's team
  const contactRows = await db
    .select()
    .from(contacts)
    .where(eq(contacts.teamId, session.teamId))
    .orderBy(contacts.createdAt);

  // Fetch companies for select options (simplified, paging isn’t shown here)
  const companyRows = await db
    .select({ id: companies.id, name: companies.name })
    .from(companies)
    .where(eq(companies.teamId, session.teamId));

  return (
    <ContactsClient
      contacts={contactRows}
      companies={companyRows}
      userRole={session.role}
    />
  );
}