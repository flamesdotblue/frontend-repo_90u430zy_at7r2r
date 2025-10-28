import React, { useState } from 'react';
import { Plus, Users } from 'lucide-react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const ClientManager = ({ clients, activeClientId, onAddClient, onSelectClient }) => {
  const [name, setName] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onAddClient(trimmed);
    setName('');
  };

  return (
    <div className="bg-white/70 backdrop-blur rounded-xl p-4 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-slate-700">
          <Users className="w-5 h-5" />
          <h3 className="font-semibold">Clients</h3>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <form onSubmit={handleAdd} className="flex items-center gap-2 w-full">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Add new client"
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-3 py-2 rounded-lg hover:bg-slate-800 transition"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </form>
      </div>

      <div className="flex flex-wrap gap-2">
        {clients.length === 0 && (
          <div className="text-slate-500 text-sm">No clients yet. Create your first client above.</div>
        )}
        {clients.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelectClient(c.id)}
            className={classNames(
              'px-3 py-1.5 rounded-full text-sm border transition',
              c.id === activeClientId
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
            )}
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ClientManager;
