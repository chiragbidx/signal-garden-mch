"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@/components/ui/dialog";
import { DataTable } from "@/components/ui/data-table";
import { Plus } from "lucide-react";
import { createTaskAction, updateTaskAction, deleteTaskAction } from "./actions";
import { useRouter } from "next/navigation";

/**
 * tasks: Array from DB
 * contacts, companies, deals: arrays
 * userRole: string
 */
export default function TasksClient({ tasks, contacts, companies, deals, userRole }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [pending, setPending] = useState(false);

  const router = useRouter();

  function handleAdd() {
    setEditing(null);
    setDialogOpen(true);
  }

  function handleEdit(task) {
    setEditing(task);
    setDialogOpen(true);
  }

  async function handleSubmit(formData) {
    setPending(true);
    try {
      if (editing) {
        await updateTaskAction({ ...formData, id: editing.id });
      } else {
        await createTaskAction(formData);
      }
      setDialogOpen(false);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  async function handleDelete(task) {
    if (window.confirm("Delete this task?")) {
      setPending(true);
      try {
        await deleteTaskAction({ id: task.id });
        router.refresh();
      } finally {
        setPending(false);
      }
    }
  }

  const columns = [
    {
      header: "Linked To",
      accessorKey: "relatedType",
      cell: (row) => {
        const t = row.original;
        if (t.relatedType === "contact") {
          const ct = contacts.find(c => c.id === t.relatedId);
          return ct ? `Contact: ${ct.firstName} ${ct.lastName}` : "Contact";
        }
        if (t.relatedType === "company") {
          const co = companies.find(c => c.id === t.relatedId);
          return co ? `Company: ${co.name}` : "Company";
        }
        if (t.relatedType === "deal") {
          const dl = deals.find(d => d.id === t.relatedId);
          return dl ? `Deal: ${dl.name}` : "Deal";
        }
        return "";
      },
    },
    { header: "Title", accessorKey: "title" },
    { header: "Due Date", accessorKey: "dueDate" },
    {
      header: "Status",
      accessorKey: "completed",
      cell: (row) => (row.original.completed ? "Completed" : "Open"),
    },
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
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Button onClick={handleAdd} disabled={pending}>
          <Plus className="size-4 mr-1.5" /> Add Task
        </Button>
      </div>
      <DataTable columns={columns} data={tasks} />
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogOverlay />
        <DialogContent>
          <DialogTitle>
            {editing ? "Edit Task" : "Add Task"}
          </DialogTitle>
          <TaskForm
            initial={editing}
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

function TaskForm({ initial, contacts, companies, deals, pending, onSubmit, onCancel }) {
  const [form, setForm] = useState(
    initial || {
      relatedType: "contact",
      relatedId: "",
      title: "",
      dueDate: "",
      completed: 0,
    }
  );

  function updateField(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ ...form, completed: Number(form.completed) });
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
      <input
        name="title"
        placeholder="Task title"
        value={form.title}
        onChange={updateField}
        className="border p-2 rounded"
        required
      />
      <input
        name="dueDate"
        type="date"
        placeholder="Due date"
        value={form.dueDate}
        onChange={updateField}
        className="border p-2 rounded"
      />
      <select
        name="completed"
        value={form.completed}
        onChange={updateField}
        className="border p-2 rounded"
      >
        <option value="0">Open</option>
        <option value="1">Completed</option>
      </select>
      <div className="flex items-center justify-between gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}