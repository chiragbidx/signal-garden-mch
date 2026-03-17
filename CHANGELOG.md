# Changelog
<!--
  Purpose:
  - Track project change history over time.
  - Record date, summary, and key files touched for each change set.
  - Keep entries append-only (do not delete past entries).
-->

## 2024-06-10

- Major CRM feature enablement for ClientNest: database schema, migration, and sidebar navigation.
  - Added scalable CRM entities to Drizzle ORM schema: companies, contacts, deals, pipelines, notes, tasks, activities.
  - Generated matching migration (`drizzle/0003_add_crm_core_tables.sql`) for core CRM tables.
  - Updated migration journal (`drizzle/meta/_journal.json`) to include CRM migration.
  - Refreshed dashboard sidebar navigation for all CRM functions (Contacts, Companies, Deals, Pipelines, Notes, Tasks, Activities).
  - Next step: scaffold UI, server actions, and real dashboard pages for each CRM entity.

  **Files changed**:
  - lib/db/schema.ts
  - drizzle/0003_add_crm_core_tables.sql
  - drizzle/meta/_journal.json
  - components/dashboard/sidebar-nav.tsx