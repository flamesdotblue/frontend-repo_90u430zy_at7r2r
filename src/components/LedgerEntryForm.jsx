import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, FileText, ArrowDownCircle, ArrowUpCircle, Save } from 'lucide-react';

const numberOrZero = (v) => {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
};

const LedgerEntryForm = ({ entries, onAddEntry }) => {
  const [date, setDate] = useState('');
  const [particular, setParticular] = useState('');
  const [debit, setDebit] = useState('');
  const [credit, setCredit] = useState('');

  const currentBalance = useMemo(() => {
    if (!entries || entries.length === 0) return 0;
    return entries[entries.length - 1].balance || 0;
  }, [entries]);

  const computedBalance = useMemo(() => {
    return currentBalance + numberOrZero(debit) - numberOrZero(credit);
  }, [currentBalance, debit, credit]);

  useEffect(() => {
    // Default date to today on mount if empty
    if (!date) {
      const today = new Date().toISOString().slice(0, 10);
      setDate(today);
    }
  }, []); // eslint-disable-line

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date || !particular) return;

    const payload = {
      id: crypto.randomUUID(),
      date,
      particular: particular.trim(),
      debit: numberOrZero(debit),
      credit: numberOrZero(credit),
      balance: computedBalance,
    };
    onAddEntry(payload);
    setParticular('');
    setDebit('');
    setCredit('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/70 backdrop-blur rounded-xl p-4 shadow-sm border border-slate-200">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <div className="flex flex-col">
          <label className="text-xs font-medium text-slate-600 mb-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Date
          </label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        </div>
        <div className="flex flex-col md:col-span-2">
          <label className="text-xs font-medium text-slate-600 mb-1 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5" /> Particular
          </label>
          <input
            type="text"
            required
            value={particular}
            onChange={(e) => setParticular(e.target.value)}
            placeholder="Describe the transaction"
            className="rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs font-medium text-slate-600 mb-1 flex items-center gap-1">
            <ArrowDownCircle className="w-3.5 h-3.5" /> Debit
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            value={debit}
            onChange={(e) => setDebit(e.target.value)}
            placeholder="0.00"
            className="rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs font-medium text-slate-600 mb-1 flex items-center gap-1">
            <ArrowUpCircle className="w-3.5 h-3.5" /> Credit
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            value={credit}
            onChange={(e) => setCredit(e.target.value)}
            placeholder="0.00"
            className="rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="text-sm text-slate-600">
          New Balance: <span className="font-semibold text-slate-900">{computedBalance.toFixed(2)}</span>
        </div>
        <button
          type="submit"
          className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition"
        >
          <Save className="w-4 h-4" /> Add Entry
        </button>
      </div>
    </form>
  );
};

export default LedgerEntryForm;
