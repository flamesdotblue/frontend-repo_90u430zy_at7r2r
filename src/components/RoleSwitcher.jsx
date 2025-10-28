import { useEffect } from "react";

const roles = [
  { value: "creator", label: "Creator" },
  { value: "reviewer", label: "Reviewer" },
  { value: "approver", label: "Approver" },
  { value: "blackadam", label: "BlackAdam (Impersonate)" },
];

const impersonatable = [
  { value: "creator", label: "Creator" },
  { value: "reviewer", label: "Reviewer" },
  { value: "approver", label: "Approver" },
];

export default function RoleSwitcher({ role, setRole, actingRole, setActingRole }) {
  useEffect(() => {
    if (role !== "blackadam") setActingRole(role);
  }, [role, setActingRole]);

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 bg-white/70 backdrop-blur rounded-xl p-4 border border-gray-200">
      <div>
        <label className="block text-sm text-gray-600 mb-1">Active Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {roles.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      {role === "blackadam" && (
        <div>
          <label className="block text-sm text-gray-600 mb-1">Impersonating</label>
          <select
            value={actingRole}
            onChange={(e) => setActingRole(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {impersonatable.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="text-sm text-gray-600 mt-1">
        <span className="font-medium">Current permissions:</span> {role === "blackadam" ? `BlackAdam acting as ${actingRole}` : role}
      </div>
    </div>
  );
}
