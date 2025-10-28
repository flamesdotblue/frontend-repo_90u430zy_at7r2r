import React, { useEffect, useMemo, useState } from 'react';
import ClientManager from './components/ClientManager.jsx';
import LedgerEntryForm from './components/LedgerEntryForm.jsx';
import LedgerTable from './components/LedgerTable.jsx';
import OverviewTable from './components/OverviewTable.jsx';
import { NotebookPen } from 'lucide-react';

const LS_KEY = 'ledger.crm.clients.v1';

function loadClients() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch (e) {
    return [];
  }
}

function saveClients(clients) {
  localStorage.setItem(LS_KEY, JSON.stringify(clients));
}

const App = () => {
  const [clients, setClients] = useState(() => loadClients());
  const [activeClientId, setActiveClientId] = useState(() => {
    const initial = loadClients();
    return initial[0]?.id || null;
  });

  useEffect(() => {
    saveClients(clients);
  }, [clients]);

  const activeClient = useMemo(() => clients.find((c) => c.id === activeClientId) || null, [clients, activeClientId]);

  const addClient = (name) => {
    const newClient = { id: crypto.randomUUID(), name, entries: [] };
    setClients((prev) => {
      const next = [...prev, newClient];
      return next;
    });
    setActiveClientId(newClient.id);
  };

  const selectClient = (id) => setActiveClientId(id);

  const addEntryToActive = (entry) => {
    if (!activeClient) return;
    setClients((prev) => prev.map((c) => (c.id === activeClient.id ? { ...c, entries: [...c.entries, entry] } : c)));
  };

  const deleteEntryFromActive = (entryId) => {
    if (!activeClient) return;
    // Recompute running balance after deletion
    setClients((prev) => prev.map((c) => {
      if (c.id !== activeClient.id) return c;
      const filtered = c.entries.filter((e) => e.id !== entryId);
      let running = 0;
      const recalculated = filtered.map((e) => {
        running = running + (e.debit || 0) - (e.credit || 0);
        return { ...e, balance: running };
      });
      return { ...c, entries: recalculated };
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="sticky top-0 z-10 backdrop-blur bg-white/60 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-slate-900 text-white flex items-center justify-center">
            <NotebookPen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Client Ledgers</h1>
            <p className="text-slate-600 text-sm">Track date, particular, debit, credit, and running balance. Create multiple client ledgers and view a unified overview.</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <ClientManager
          clients={clients}
          activeClientId={activeClientId}
          onAddClient={addClient}
          onSelectClient={selectClient}
        />

        {activeClient && (
          <LedgerEntryForm
            entries={activeClient.entries}
            onAddEntry={addEntryToActive}
          />)
        }

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LedgerTable
            clientName={activeClient?.name || ''}
            entries={activeClient?.entries || []}
            onDelete={deleteEntryFromActive}
          />

          <OverviewTable clients={clients} />
        </div>
      </main>

      <footer className="max-w-6xl mx-auto px-4 pb-8 pt-2 text-xs text-slate-500">
        Pro tip: Balance is calculated automatically as you add or remove entries.
      </footer>
    </div>
  );
};

export default App;
