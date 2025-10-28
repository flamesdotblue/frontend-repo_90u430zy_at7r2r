import { useEffect, useState } from "react";
import { allEntries } from "./api";

const statusBadge = (s) => {
  const map = {
    draft: "bg-gray-100 text-gray-700",
    submitted_for_review: "bg-blue-100 text-blue-700",
    reentry_requested: "bg-rose-100 text-rose-700",
    recheck_requested: "bg-amber-100 text-amber-700",
    reviewed: "bg-emerald-100 text-emerald-700",
    approved: "bg-purple-100 text-purple-700",
  };
  return map[s] || "bg-gray-100 text-gray-700";
};

export default function EntriesTable() {
  const [items, setItems] = useState([]);

  const load = async () => {
    const data = await allEntries();
    setItems(data || []);
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-xl font-semibold mb-4">All Entries</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600">
              <th className="py-2 pr-4">Title</th>
              <th className="py-2 pr-4">Amount</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Frozen</th>
            </tr>
          </thead>
          <tbody>
            {items.map((e) => (
              <tr key={e.id} className="border-t">
                <td className="py-2 pr-4">{e.title}</td>
                <td className="py-2 pr-4">{e.amount}</td>
                <td className="py-2 pr-4">
                  <span className={`px-2 py-1 rounded-full ${statusBadge(e.status)}`}>
                    {e.status.replaceAll("_", " ")}
                  </span>
                </td>
                <td className="py-2 pr-4">{e.frozen ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
