"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";

/**
 * activities: Array from DB
 * userRole: string
 */
export default function ActivitiesClient({ activities, userRole }) {
  // Only viewing for now; activity feed/audit can be expanded
  const columns = [
    { header: "Type", accessorKey: "type" },
    { header: "Related", accessorKey: "relatedType" },
    { header: "Summary", accessorKey: "summary" },
    { header: "Details", accessorKey: "details" },
    { header: "User", accessorKey: "userId" },
    { header: "Created", accessorKey: "createdAt" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Activities</h1>
      </div>
      <DataTable columns={columns} data={activities} />
      {/* You can later expand this table with filters, activity entry, etc */}
    </div>
  );
}