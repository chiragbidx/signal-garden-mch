"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@/components/ui/dialog";
import { DataTable } from "@/components/ui/data-table";
import { Plus } from "lucide-react";
import { createCompanyAction, updateCompanyAction, deleteCompanyAction } from "./actions";
import { useRouter } from "next/navigation";

/**
 * companies: Array from DB
 * userRole: string
 */
export default function CompaniesClient({ companies, userRole }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [pending, setPending] = useState(false);

  const router = useRouter();

  function handleAdd() {
    setEditing(null);
    setDialogOpen(true);
  }

  function handleEdit(company) {
    setEditing(company);
    setDialogOpen(true);
  }

  async function handleSubmit(formData) {
    setPending(true);
    try {
      if (editing) {
        await updateCompanyAction({ ...formData, id: editing.id });
      } else {
        await createCompanyAction(formData);
      }
      setDialogOpen(false);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  async function handleDelete(company) {
    if (window.confirm("Delete this company?")) {
      setPending(true);
      try {
        await deleteCompanyAction({ id: company.id });
        router.refresh();
      } finally {
        setPending(false);
      }
    }
  }

  const columns = [
    { header: "Name", accessorKey: "name" },
    { header: "Website", accessorKey: "website" },
    { header: "Phone", accessorKey: "phone" },
    { header: "Address", accessorKey: "address" },
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
        <h1 className="text-2xl font-bold">Companies</h1>
        <Button onClick={handleAdd} disabled={pending}>
          <Plus className="size-4 mr-1.5" /> Add Company
        </Button>
      </div>
      <DataTable columns={columns} data={companies} />
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogOverlay />
        <DialogContent>
          <DialogTitle>
            {editing ? "Edit Company" : "Add Company"}
          </DialogTitle>
          <CompanyForm
            initial={editing}
            pending={pending}
            onSubmit={handleSubmit}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CompanyForm({ initial, pending, onSubmit, onCancel }) {
  const [form, setForm] = useState(
    initial || {
      name: "",
      website: "",
      phone: "",
      address: "",
      description: "",
    }
  );

  function updateField(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        name="name"
        placeholder="Company Name"
        value={form.name}
        onChange={updateField}
        className="border p-2 rounded"
        required
      />
      <input
        name="website"
        placeholder="Website"
        value={form.website}
        onChange={updateField}
        className="border p-2 rounded"
      />
      <input
        name="phone"
        placeholder="Phone"
        value={form.phone}
        onChange={updateField}
        className="border p-2 rounded"
      />
      <input
        name="address"
        placeholder="Address"
        value={form.address}
        onChange={updateField}
        className="border p-2 rounded"
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