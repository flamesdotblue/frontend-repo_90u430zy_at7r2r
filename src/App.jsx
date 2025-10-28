import { useEffect, useState } from "react";
import RoleSwitcher from "./components/RoleSwitcher";
import EntryForm from "./components/EntryForm";
import ReviewPanel from "./components/ReviewPanel";
import ApprovalPanel from "./components/ApprovalPanel";
import EntriesTable from "./components/EntriesTable";

function App() {
  const [role, setRole] = useState("creator");
  const [actingRole, setActingRole] = useState("creator");
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => setRefreshKey((k) => k + 1);

  useEffect(() => {
    if (role !== "blackadam") setActingRole(role);
  }, [role]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Accounting CRM</h1>
          <RoleSwitcher
            role={role}
            setRole={setRole}
            actingRole={actingRole}
            setActingRole={setActingRole}
          />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EntryForm role={role} actingRole={actingRole} onRefresh={triggerRefresh} />
          <ReviewPanel role={role} actingRole={actingRole} onRefresh={triggerRefresh} />
          <ApprovalPanel role={role} actingRole={actingRole} onRefresh={triggerRefresh} />
        </div>

        <EntriesTable key={refreshKey} />

        <div className="text-xs text-gray-500 text-center pt-6">
          Workflow: Creator submits → Reviewer marks reviewed or requests re-entry → Approver approves or requests re-review. Approved entries are frozen.
        </div>
      </main>
    </div>
  );
}

export default App;
