import React, { useMemo } from 'react';
import { Trash2 } from 'lucide-react';

const currency = (n) => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n || 0);

const LedgerTable = ({ clientName, entries, onDelete }) => {
  const totals = useMemo(() => {
    const debit = entries.reduce((sum, e) => sum + (e.debit || 0), 0);
    const credit = entries.reduce((sum, e) => sum + (e.credit || 0), 0);
    const balance = entries.length ? entries[entries.length - 1].balance || 0 : 0;
    return { debit, credit, balance };
  }, [entries]);

  return (
    <div className="bg-white/70 backdrop-blur rounded-xl p-4 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-slate-800">Ledger — {clientName || 'Select a client'}</h3>
      </div>
      <div className="overflow-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-slate-600">
              <th className="py-2 pr-4">Date</th>
              <th className="py-2 pr-4">Particular</th>
              <th className="py-2 pr-4 text-right">Debit</th>
              <th className="py-2 pr-4 text-right">Credit</th>
              <th className="py-2 pr-4 text-right">Balance</th>
              <th className="py-2 pr-2"></th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-slate-500">No entries yet.</td>
              </tr>
            )}
            {entries.map((e) => (
              <tr key={e.id} className="border-t border-slate-200 hover:bg-slate-50">
                <td className="py-2 pr-4 whitespace-nowrap">{e.date}</td>
                <td className="py-2 pr-4">{e.particular}</td>
                <td className="py-2 pr-4 text-right text-emerald-700">{e.debit ? currency(e.debit) : '-'}</td>
                <td className="py-2 pr-4 text-right text-rose-700">{e.credit ? currency(e.credit) : '-'}</td>
                <td className="py-2 pr-4 text-right font-medium">{currency(e.balance)}</td>
                <td className="py-2 pr-2 text-right">
                  <button
                    onClick={() => onDelete(e.id)}
                    className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Delete entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          {entries.length > 0 && (
            <tfoot>
              <tr className="border-t-2 border-slate-300">
                <td className="py-2 pr-4 font-medium" colSpan={2}>Totals</td>
                <td className="py-2 pr-4 text-right font-semibold text-emerald-700">{currency(totals.debit)}</td>
                <td className="py-2 pr-4 text-right font-semibold text-rose-700">{currency(totals.credit)}</td>
                <td className="py-2 pr-4 text-right font-semibold">{currency(totals.balance)}</td>
                <td></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};

export default LedgerTable;
