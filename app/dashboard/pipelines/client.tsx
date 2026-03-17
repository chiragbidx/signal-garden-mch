"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@/components/ui/dialog";
import { DataTable } from "@/components/ui/data-table";
import { Plus } from "lucide-react";
import { createPipelineAction, updatePipelineAction, deletePipelineAction } from "./actions";
import { useRouter } from "next/navigation";

/**
 * pipelines: Array from DB
 * userRole: string
 */
export default function PipelinesClient({ pipelines, userRole }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [pending, setPending] = useState(false);

  const router = useRouter();

  function handleAdd() {
    setEditing(null);
    setDialogOpen(true);
  }

  function handleEdit(pipeline) {
    setEditing(pipeline);
    setDialogOpen(true);
  }

  async function handleSubmit(formData) {
    setPending(true);
    try {
      if (editing) {
        await updatePipelineAction({ ...formData, id: editing.id });
      } else {
        await createPipelineAction(formData);
      }
      setDialogOpen(false);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  async function handleDelete(pipeline) {
    if (window.confirm("Delete this pipeline?")) {
      setPending(true);
      try {
        await deletePipelineAction({ id: pipeline.id });
        router.refresh();
      } finally {
        setPending(false);
      }
    }
  }

  const columns = [
    { header: "Name", accessorKey: "name" },
    { header: "Description", accessorKey: "description" },
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
        <h1 className="text-2xl font-bold">Pipelines</h1>
        <Button onClick={handleAdd} disabled={pending}>
          <Plus className="size-4 mr-1.5" /> Add Pipeline
        </Button>
      </div>
      <DataTable columns={columns} data={pipelines} />
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogOverlay />
        <DialogContent>
          <DialogTitle>
            {editing ? "Edit Pipeline" : "Add Pipeline"}
          </DialogTitle>
          <PipelineForm
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

function PipelineForm({ initial, pending, onSubmit, onCancel }) {
  const [form, setForm] = useState(
    initial || {
      name: "",
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
        placeholder="Pipeline Name"
        value={form.name}
        onChange={updateField}
        className="border p-2 rounded"
        required
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