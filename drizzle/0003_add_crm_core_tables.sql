-- Migration for CRM core tables (companies, contacts, deals, pipelines, notes, tasks, activities)
CREATE TABLE "companies" (
  "id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "team_id" text NOT NULL REFERENCES "teams"("id") ON DELETE CASCADE,
  "name" text NOT NULL,
  "website" text,
  "phone" text,
  "address" text,
  "description" text,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX "companies_teamid_name_idx" ON "companies" ("team_id", "name");

CREATE TABLE "contacts" (
  "id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "team_id" text NOT NULL REFERENCES "teams"("id") ON DELETE CASCADE,
  "company_id" text REFERENCES "companies"("id") ON DELETE SET NULL,
  "first_name" text NOT NULL,
  "last_name" text NOT NULL,
  "email" text,
  "phone" text,
  "title" text,
  "description" text,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE "pipelines" (
  "id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "team_id" text NOT NULL REFERENCES "teams"("id") ON DELETE CASCADE,
  "name" text NOT NULL,
  "description" text,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE "deals" (
  "id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "team_id" text NOT NULL REFERENCES "teams"("id") ON DELETE CASCADE,
  "company_id" text REFERENCES "companies"("id") ON DELETE SET NULL,
  "contact_id" text REFERENCES "contacts"("id") ON DELETE SET NULL,
  "pipeline_id" text REFERENCES "pipelines"("id") ON DELETE SET NULL,
  "name" text NOT NULL,
  "value" integer,
  "stage" text,
  "status" text NOT NULL DEFAULT 'open',
  "close_date" timestamptz,
  "description" text,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE "notes" (
  "id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "team_id" text NOT NULL REFERENCES "teams"("id") ON DELETE CASCADE,
  "related_type" text NOT NULL, -- contact, company, deal
  "related_id" text NOT NULL,
  "content" text NOT NULL,
  "created_by" text NOT NULL REFERENCES "users"("id") ON DELETE SET NULL,
  "created_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE "tasks" (
  "id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "team_id" text NOT NULL REFERENCES "teams"("id") ON DELETE CASCADE,
  "related_type" text NOT NULL, -- contact, company, deal
  "related_id" text NOT NULL,
  "title" text NOT NULL,
  "due_date" timestamptz,
  "completed" integer NOT NULL DEFAULT 0,
  "created_by" text NOT NULL REFERENCES "users"("id") ON DELETE SET NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE "activities" (
  "id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "team_id" text NOT NULL REFERENCES "teams"("id") ON DELETE CASCADE,
  "user_id" text NOT NULL REFERENCES "users"("id") ON DELETE SET NULL,
  "type" text NOT NULL,
  "summary" text,
  "details" text,
  "related_type" text NOT NULL,
  "related_id" text NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now()
);