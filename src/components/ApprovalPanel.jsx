import { useEffect, useState } from "react";
import { approverAction, listEntries } from "./api";

export default function ApprovalPanel({ role, actingRole, onRefresh }) {
  const effectiveRole = role === "blackadam" ? actingRole : role;
  const [items, setItems] = useState([]);
  const [comments, setComments] = useState({});
  const canUse = effectiveRole === "approver";

  const load = async () => {
    const reviewed = await listEntries("reviewed");
    setItems(reviewed || []);
  };

  useEffect(() => {
    if (canUse) load();
  }, [canUse]);

  const doAction = (id, action) =>
    approverAction(id, effectiveRole, action, comments[id])
      .then(load)
      .then(() => onRefresh?.())
      .catch((e) => alert(e.message));

  if (!canUse) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-xl font-semibold mb-4">Approver Queue</h2>
      {items.length === 0 && (
        <div className="text-sm text-gray-500">No entries awaiting approval.</div>
      )}
      <div className="space-y-4">
        {items.map((e) => (
          <div key={e.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium">{e.title}</div>
              <div className="text-sm text-gray-600">Amount: {e.amount}</div>
            </div>
            <div className="text-sm text-gray-600 mb-2">{e.description}</div>
            <textarea
              placeholder="Optional comment"
              className="w-full border rounded-lg px-3 py-2 mb-3"
              value={comments[e.id] || ""}
              onChange={(ev) => setComments((c) => ({ ...c, [e.id]: ev.target.value }))}
            />
            <div className="flex gap-2">
              <button
                onClick={() => doAction(e.id, "approve")}
                className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700"
              >
                Approve
              </button>
              <button
                onClick={() => doAction(e.id, "request_rereview")}
                className="bg-amber-600 text-white px-3 py-1.5 rounded-lg hover:bg-amber-700"
              >
                Request Re-review
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
