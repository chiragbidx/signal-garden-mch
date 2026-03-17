"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@/components/ui/dialog";
import { DataTable } from "@/components/ui/data-table";
import { Plus } from "lucide-react";
import { createNoteAction, deleteNoteAction } from "./actions";
import { useRouter } from "next/navigation";

/**
 * notes: Array from DB
 * contacts, companies, deals: arrays
 * userRole: string
 */
export default function NotesClient({ notes, contacts, companies, deals, userRole }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const router = useRouter();

  function handleAdd() {
    setDialogOpen(true);
  }

  async function handleSubmit(formData) {
    setPending(true);
    try {
      await createNoteAction(formData);
      setDialogOpen(false);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  async function handleDelete(note) {
    if (window.confirm("Delete this note?")) {
      setPending(true);
      try {
        await deleteNoteAction({ id: note.id });
        router.refresh();
      } finally {
        setPending(false);
      }
    }
  }

  const columns = [
    {
      header: "Related",
      accessorKey: "relatedType",
      cell: (row) => {
        const n = row.original;
        if (n.relatedType === "contact") {
          const ct = contacts.find(c => c.id === n.relatedId);
          return ct ? `Contact: ${ct.firstName} ${ct.lastName}` : "Contact";
        }
        if (n.relatedType === "company") {
          const co = companies.find(c => c.id === n.relatedId);
          return co ? `Company: ${co.name}` : "Company";
        }
        if (n.relatedType === "deal") {
          const dl = deals.find(d => d.id === n.relatedId);
          return dl ? `Deal: ${dl.name}` : "Deal";
        }
        return "";
      },
    },
    { header: "Content", accessorKey: "content" },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          {/* No edit for notes; editable in future */}
          <Button size="sm" variant="destructive" onClick={() => handleDelete(row.original)}>Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Notes</h1>
        <Button onClick={handleAdd} disabled={pending}>
          <Plus className="size-4 mr-1.5" /> Add Note
        </Button>
      </div>
      <DataTable columns={columns} data={notes} />
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogOverlay />
        <DialogContent>
          <DialogTitle>
            Add Note
          </DialogTitle>
          <NoteForm
            contacts={contacts}
            companies={companies}
            deals={deals}
            pending={pending}
            onSubmit={handleSubmit}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function NoteForm({ contacts, companies, deals, pending, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    relatedType: "contact",
    relatedId: "",
    content: "",
  });

  function updateField(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  function relatedOptions() {
    switch (form.relatedType) {
      case "contact":
        return contacts.map((c) => (
          <option key={c.id} value={c.id}>
            {c.firstName} {c.lastName}
          </option>
        ));
      case "company":
        return companies.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ));
      case "deal":
        return deals.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ));
      default:
        return null;
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <select
        name="relatedType"
        value={form.relatedType}
        onChange={updateField}
        className="border p-2 rounded"
      >
        <option value="contact">Contact</option>
        <option value="company">Company</option>
        <option value="deal">Deal</option>
      </select>
      <select
        name="relatedId"
        value={form.relatedId}
        onChange={updateField}
        className="border p-2 rounded"
      >
        <option value="">-- Select --</option>
        {relatedOptions()}
      </select>
      <textarea
        name="content"
        placeholder="Note content"
        value={form.content}
        onChange={updateField}
        className="border p-2 rounded"
        required
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