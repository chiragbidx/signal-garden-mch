"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@/components/ui/dialog";
import { DataTable } from "@/components/ui/data-table";
import { Plus } from "lucide-react";
import { createDealAction, updateDealAction, deleteDealAction } from "./actions";
import { useRouter } from "next/navigation";

/**
 * deals: array from DB
 * companies: array {id, name}
 * contacts: array {id, firstName, lastName}
 * pipelines: array {id, name}
 * userRole: string
 */
export default function DealsClient({ deals, companies, contacts, pipelines, userRole }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [pending, setPending] = useState(false);

  const router = useRouter();

  function handleAdd() {
    setEditing(null);
    setDialogOpen(true);
  }

  function handleEdit(item) {
    setEditing(item);
    setDialogOpen(true);
  }

  async function handleSubmit(formData) {
    setPending(true);
    try {
      if (editing) {
        await updateDealAction({ ...formData, id: editing.id });
      } else {
        await createDealAction(formData);
      }
      setDialogOpen(false);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  async function handleDelete(item) {
    if (window.confirm("Delete this deal?")) {
      setPending(true);
      try {
        await deleteDealAction({ id: item.id });
        router.refresh();
      } finally {
        setPending(false);
      }
    }
  }

  const columns = [
    { header: "Name", accessorKey: "name" },
    {
      header: "Company",
      accessorKey: "companyId",
      cell: (row) =>
        companies.find((c) => c.id === row.original.companyId)?.name ?? "",
    },
    {
      header: "Contact",
      accessorKey: "contactId",
      cell: (row) => {
        const ct = contacts.find((c) => c.id === row.original.contactId);
        return ct ? `${ct.firstName} ${ct.lastName}` : "";
      },
    },
    {
      header: "Pipeline",
      accessorKey: "pipelineId",
      cell: (row) =>
        pipelines.find((p) => p.id === row.original.pipelineId)?.name ?? "",
    },
    { header: "Value", accessorKey: "value" },
    { header: "Stage", accessorKey: "stage" },
    { header: "Status", accessorKey: "status" },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => handleEdit(row.original)}>Edit</Button>
          <Button size="sm" variant="destructive" onClick={() => handleDelete(row.original)}>Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Deals</h1>
        <Button onClick={handleAdd} disabled={pending}>
          <Plus className="size-4 mr-1.5" /> Add Deal
        </Button>
      </div>
      <DataTable columns={columns} data={deals} />
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogOverlay />
        <DialogContent>
          <DialogTitle>
            {editing ? "Edit Deal" : "Add Deal"}
          </DialogTitle>
          <DealForm
            initial={editing}
            companies={companies}
            contacts={contacts}
            pipelines={pipelines}
            pending={pending}
            onSubmit={handleSubmit}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DealForm({ initial, companies, contacts, pipelines, pending, onSubmit, onCancel }) {
  const [form, setForm] = useState(
    initial || {
      name: "",
      companyId: "",
      contactId: "",
      pipelineId: "",
      value: "",
      stage: "",
      status: "open",
      closeDate: "",
      description: "",
    }
  );

  function updateField(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ ...form, value: form.value ? Number(form.value) : null });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        name="name"
        placeholder="Deal Name"
        value={form.name}
        onChange={updateField}
        className="border p-2 rounded"
        required
      />
      <select
        name="companyId"
        value={form.companyId}
        onChange={updateField}
        className="border p-2 rounded"
      >
        <option value="">-- Select Company --</option>
        {companies.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
      <select
        name="contactId"
        value={form.contactId}
        onChange={updateField}
        className="border p-2 rounded"
      >
        <option value="">-- Select Contact --</option>
        {contacts.map((c) => (
          <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
        ))}
      </select>
      <select
        name="pipelineId"
        value={form.pipelineId}
        onChange={updateField}
        className="border p-2 rounded"
      >
        <option value="">-- Select Pipeline --</option>
        {pipelines.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
      <input
        name="value"
        placeholder="Deal Value"
        value={form.value}
        onChange={updateField}
        className="border p-2 rounded"
        type="number"
      />
      <input
        name="stage"
        placeholder="Deal Stage"
        value={form.stage}
        onChange={updateField}
        className="border p-2 rounded"
      />
      <select
        name="status"
        value={form.status}
        onChange={updateField}
        className="border p-2 rounded"
      >
        <option value="open">Open</option>
        <option value="won">Won</option>
        <option value="lost">Lost</option>
      </select>
      <input
        name="closeDate"
        placeholder="Close Date"
        value={form.closeDate}
        onChange={updateField}
        className="border p-2 rounded"
        type="date"
      />
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={updateField}
        className="border p-2 rounded"
      />
      <div className="flex items-center justify-between gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}