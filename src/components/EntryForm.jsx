import { useEffect, useMemo, useState } from "react";
import { allEntries, createEntry, listEntries, submitEntry, updateEntry } from "./api";

export default function EntryForm({ role, actingRole, onRefresh }) {
  const effectiveRole = role === "blackadam" ? actingRole : role;
  const [form, setForm] = useState({ title: "", amount: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [editable, setEditable] = useState([]);
  const canUse = effectiveRole === "creator";

  const loadEditable = async () => {
    const [drafts, reentries] = await Promise.all([
      listEntries("draft"),
      listEntries("reentry_requested"),
    ]);
    setEditable([...(drafts || []), ...(reentries || [])]);
  };

  useEffect(() => {
    loadEditable();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!canUse) return;
    setLoading(true);
    try {
      const payload = {
        title: form.title,
        amount: Number(form.amount || 0),
        description: form.description,
      };
      await createEntry(payload);
      setForm({ title: "", amount: "", description: "" });
      await loadEditable();
      onRefresh?.();
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (entryId, field, value) =>
    updateEntry(entryId, { [field]: value, role: effectiveRole })
      .then(loadEditable)
      .then(() => onRefresh?.())
      .catch((e) => alert(e.message));

  const submit = (entryId) =>
    submitEntry(entryId, effectiveRole)
      .then(loadEditable)
      .then(() => onRefresh?.())
      .catch((e) => alert(e.message));

  if (!canUse) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-xl font-semibold mb-4">Creator Workspace</h2>
      <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <input
          className="px-3 py-2 border rounded-lg"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          required
        />
        <input
          className="px-3 py-2 border rounded-lg"
          placeholder="Amount"
          type="number"
          step="0.01"
          value={form.amount}
          onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
          required
        />
        <input
          className="px-3 py-2 border rounded-lg md:col-span-3"
          placeholder="Description (optional)"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        />
        <button
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Entry"}
        </button>
      </form>

      <h3 className="font-medium mb-2">Your editable entries</h3>
      <div className="space-y-3">
        {editable.length === 0 && (
          <div className="text-sm text-gray-500">No draft entries yet.</div>
        )}
        {editable.map((e) => (
          <div key={e.id} className="border rounded-lg p-4 flex flex-col gap-2">
            <div className="flex flex-col md:flex-row gap-3">
              <input
                className="px-3 py-2 border rounded-lg flex-1"
                value={e.title}
                onChange={(ev) => updateField(e.id, "title", ev.target.value)}
              />
              <input
                className="px-3 py-2 border rounded-lg w-40"
                type="number"
                step="0.01"
                value={e.amount}
                onChange={(ev) => updateField(e.id, "amount", Number(ev.target.value))}
              />
            </div>
            <textarea
              className="px-3 py-2 border rounded-lg"
              rows={2}
              value={e.description || ""}
              onChange={(ev) => updateField(e.id, "description", ev.target.value)}
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Status: {e.status}</span>
              <button
                onClick={() => submit(e.id)}
                className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700"
              >
                Send for review
              </button>
            </div>
            {e.comments?.length > 0 && (
              <div className="text-sm text-gray-600">
                <div className="font-medium">Comments</div>
                <ul className="list-disc ml-6">
                  {e.comments.map((c, idx) => (
                    <li key={idx}>
                      <span className="capitalize font-medium">{c.role}</span>: {c.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
