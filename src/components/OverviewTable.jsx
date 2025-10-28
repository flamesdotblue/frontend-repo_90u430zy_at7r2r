import React, { useMemo } from 'react';

const currency = (n) => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n || 0);

const OverviewTable = ({ clients }) => {
  const rows = useMemo(() => {
    const out = [];
    clients.forEach((c) => {
      c.entries.forEach((e) => {
        out.push({ ...e, clientName: c.name });
      });
    });
    // Sort by date then client
    out.sort((a, b) => (a.date || '').localeCompare(b.date || '') || (a.clientName || '').localeCompare(b.clientName || ''));
    return out;
  }, [clients]);

  const totals = useMemo(() => {
    const debit = rows.reduce((sum, r) => sum + (r.debit || 0), 0);
    const credit = rows.reduce((sum, r) => sum + (r.credit || 0), 0);
    const balance = rows.reduce((sum, r) => r.balance, 0); // not meaningful across clients; show last row balance per row
    return { debit, credit, balance };
  }, [rows]);

  return (
    <div className="bg-white/70 backdrop-blur rounded-xl p-4 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-slate-800">Overview — All Clients & Ledgers</h3>
      </div>
      <div className="overflow-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-slate-600">
              <th className="py-2 pr-4">Client</th>
              <th className="py-2 pr-4">Date</th>
              <th className="py-2 pr-4">Particular</th>
              <th className="py-2 pr-4 text-right">Debit</th>
              <th className="py-2 pr-4 text-right">Credit</th>
              <th className="py-2 pr-4 text-right">Balance</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-slate-500">No entries across any client.</td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-slate-200 hover:bg-slate-50">
                <td className="py-2 pr-4 whitespace-nowrap">{r.clientName}</td>
                <td className="py-2 pr-4 whitespace-nowrap">{r.date}</td>
                <td className="py-2 pr-4">{r.particular}</td>
                <td className="py-2 pr-4 text-right text-emerald-700">{r.debit ? currency(r.debit) : '-'}</td>
                <td className="py-2 pr-4 text-right text-rose-700">{r.credit ? currency(r.credit) : '-'}</td>
                <td className="py-2 pr-4 text-right font-medium">{currency(r.balance)}</td>
              </tr>
            ))}
          </tbody>
          {rows.length > 0 && (
            <tfoot>
              <tr className="border-t-2 border-slate-300">
                <td className="py-2 pr-4 font-medium" colSpan={3}>Totals</td>
                <td className="py-2 pr-4 text-right font-semibold text-emerald-700">{currency(totals.debit)}</td>
                <td className="py-2 pr-4 text-right font-semibold text-rose-700">{currency(totals.credit)}</td>
                <td className="py-2 pr-4 text-right font-semibold">—</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};

export default OverviewTable;
