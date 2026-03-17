"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@/components/ui/dialog";
import { DataTable } from "@/components/ui/data-table";
import { Plus } from "lucide-react";
import { createContactAction, updateContactAction, deleteContactAction } from "./actions";
import { Contact } from "@/lib/types/crm";
import { useRouter } from "next/navigation";

/**
 * Props:
 * contacts: Array<Contact>
 * companies: Array<{ id: string, name: string }>
 * userRole: string
 */
export default function ContactsClient({ contacts, companies, userRole }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null = create, {} = edit obj
  const [pending, setPending] = useState(false);

  const router = useRouter();

  function handleAdd() {
    setEditing(null);
    setDialogOpen(true);
  }

  function handleEdit(contact) {
    setEditing(contact);
    setDialogOpen(true);
  }

  async function handleSubmit(formData) {
    setPending(true);
    try {
      if (editing) {
        await updateContactAction({ ...formData, id: editing.id });
      } else {
        await createContactAction(formData);
      }
      setDialogOpen(false);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  async function handleDelete(contact) {
    if (window.confirm("Delete this contact?")) {
      setPending(true);
      try {
        await deleteContactAction({ id: contact.id });
        router.refresh();
      } finally {
        setPending(false);
      }
    }
  }

  // Columns definition (simplified)
  const columns = [
    { header: "First Name", accessorKey: "firstName" },
    { header: "Last Name", accessorKey: "lastName" },
    { header: "Company", accessorKey: "companyName" },
    { header: "Email", accessorKey: "email" },
    { header: "Phone", accessorKey: "phone" },
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
        <h1 className="text-2xl font-bold">Contacts</h1>
        <Button onClick={handleAdd} disabled={pending}>
          <Plus className="size-4 mr-1.5" /> Add Contact
        </Button>
      </div>
      <DataTable columns={columns} data={contacts.map(c => ({
        ...c,
        companyName: companies.find(co => co.id === c.companyId)?.name ?? "",
      }))} />
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogOverlay />
        <DialogContent>
          <DialogTitle>
            {editing ? "Edit Contact" : "Add Contact"}
          </DialogTitle>
          <ContactForm
            initial={editing}
            companies={companies}
            pending={pending}
            onSubmit={handleSubmit}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ContactForm({ initial, companies, pending, onSubmit, onCancel }) {
  const [form, setForm] = useState(
    initial || {
      companyId: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      title: "",
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
      <input
        name="firstName"
        placeholder="First Name"
        value={form.firstName}
        onChange={updateField}
        className="border p-2 rounded"
        required
      />
      <input
        name="lastName"
        placeholder="Last Name"
        value={form.lastName}
        onChange={updateField}
        className="border p-2 rounded"
        required
      />
      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={updateField}
        className="border p-2 rounded"
        type="email"
      />
      <input
        name="phone"
        placeholder="Phone"
        value={form.phone}
        onChange={updateField}
        className="border p-2 rounded"
      />
      <input
        name="title"
        placeholder="Title/Position"
        value={form.title}
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