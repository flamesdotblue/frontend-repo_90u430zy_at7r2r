const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export async function listEntries(status) {
  const q = status ? `?status=${encodeURIComponent(status)}` : "";
  const res = await fetch(`${BASE_URL}/api/entries${q}`);
  if (!res.ok) throw new Error("Failed to fetch entries");
  return res.json();
}

export async function createEntry(data) {
  const res = await fetch(`${BASE_URL}/api/entries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create entry");
  return res.json();
}

export async function updateEntry(id, data) {
  const res = await fetch(`${BASE_URL}/api/entries/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update entry");
  return res.json();
}

export async function submitEntry(id, role, comment) {
  const res = await fetch(`${BASE_URL}/api/entries/${id}/submit`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role, comment }),
  });
  if (!res.ok) throw new Error("Failed to submit entry");
  return res.json();
}

export async function reviewerAction(id, role, action, comment) {
  const res = await fetch(`${BASE_URL}/api/entries/${id}/review`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role, action, comment }),
  });
  if (!res.ok) throw new Error("Reviewer action failed");
  return res.json();
}

export async function approverAction(id, role, action, comment) {
  const res = await fetch(`${BASE_URL}/api/entries/${id}/approve`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role, action, comment }),
  });
  if (!res.ok) throw new Error("Approver action failed");
  return res.json();
}

export async function allEntries() {
  return listEntries();
}
