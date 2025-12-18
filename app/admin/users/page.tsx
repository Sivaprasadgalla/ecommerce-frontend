// app/admin/users/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { createUser, deleteUser, getUsers, updateUser, User } from "@/services/user.service";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState({ username: "", email: "", role: "user" });

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  function startCreate() {
    setEditing(null);
    setForm({ username: "", email: "", role: "user" });

    setError(null);
  }

  function startEdit(u: User) {
    setEditing(u);
    setForm({ username: u.username, email: u.email, role: u.role });
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.username.trim() || !form.email.trim()) {
      setError("Name and email are required");
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await updateUser(editing._id, { username: form.username.trim(), email: form.email.trim(), role: form.role });
      } else {
        await createUser({ username: form.username.trim(), email: form.email.trim(), role: form.role, password: "defaultPassword123" });
      }
      await fetchUsers();
      setEditing(null);
      setForm({ username: "", email: "", role: "user" });
    } catch (err: any) {
      setError(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this user? This action cannot be undone.")) return;
    setError(null);
    try {
      await deleteUser(id);
      await fetchUsers();
    } catch (err: any) {
      setError(err.message || "Delete failed");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-black">Users</h1>
        <button onClick={startCreate} className="bg-indigo-600 text-white px-3 py-2 rounded-md text-sm hover:bg-indigo-700">
          + Create user
        </button>
      </div>

      <div className="bg-white border rounded-md p-4">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
          <div>
            <label className="text-sm text-indigo-600">Name</label>
            <input value={form.username} onChange={(e) => setForm(s => ({ ...s, username: e.target.value }))} className="w-full border px-3 py-2 text-gray-700 rounded-md" />
          </div>

          <div>
            <label className="text-sm text-indigo-600">Email</label>
            <input value={form.email} onChange={(e) => setForm(s => ({ ...s, email: e.target.value }))} className="w-full border px-3 py-2 text-gray-700 rounded-md" />
          </div>

          <div>
            <label className="text-sm text-indigo-600">Role</label>
            <select value={form.role} onChange={(e) => setForm(s => ({ ...s, role: e.target.value }))} className="w-full border px-3 py-2 text-gray-700 rounded-md">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="bg-green-600 text-white px-3 py-2 rounded-md">
              {saving ? "Saving…" : (editing ? "Update" : "Create")}
            </button>
            {editing && (
              <button type="button" onClick={() => { setEditing(null); setForm({ username: "", email: "", role: "user" }); }} className="px-3 py-2 rounded-md border">
                Cancel
              </button>
            )}
          </div>

          {error && <div className="sm:col-span-4 text-sm text-red-500">{error}</div>}
        </form>
      </div>

      <div className="bg-white border rounded-md overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-500">
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Role</th>
              <th className="text-left px-4 py-3">Created</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-4">Loading…</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={5} className="p-4 text-center">No users</td></tr>
            ) : (
              users.map(u => (
                <tr key={u._id} className="border-t hover:bg-gray-50 cursor-pointer">
                  <td className="px-4 py-3 text-black">{u.username}</td>
                  <td className="px-4 py-3 text-black">{u.email}</td>
                  <td className="px-4 py-3 text-black">{u.role}</td>
                  <td className="px-4 py-3 text-black">{u.createdAt ? new Date(u.createdAt).toLocaleString() : "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => startEdit(u)} className="px-2 py-1 border text-indigo-400 hover:text-indigo-300 rounded text-sm cursor-pointer">Edit</button>
                      <button onClick={() => handleDelete(u._id)} className="px-2 py-1 border rounded text-sm text-red-600 cursor-pointer">Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
