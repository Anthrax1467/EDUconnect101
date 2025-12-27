
import React, { useState, useEffect } from 'react';
import { FeeTransaction, FeeSummary, Region } from '../types';
import { 
  CreditCard, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  Download,
  Plus,
  RefreshCw,
  Wallet,
  Receipt,
  Smartphone
} from 'lucide-react';

interface FinanceHubProps {
  region: Region;
}

const FinanceHub: React.FC<FinanceHubProps> = ({ region }) => {
  const currency = region === 'nepal' ? 'Rs.' : '$';
  const exchangeRate = 132; // Simplified for simulation
  
  const initialTransactions: FeeTransaction[] = [
    { id: 't1', item: 'Semester Tuition - Spring 2024', amount: 4500, date: '2024-01-15', status: 'paid', category: 'tuition' },
    { id: 't2', item: 'Physics Lab Materials', amount: 150, date: '2024-02-10', status: 'paid', category: 'lab' },
    { id: 't3', item: 'Annual Library Access Fee', amount: 75, date: '2024-03-01', status: 'pending', category: 'other' },
    { id: 't4', item: 'Tech & Infrastructure Levy', amount: 120, date: '2024-03-15', status: 'pending', category: 'other' }
  ];

  const [transactions, setTransactions] = useState<FeeTransaction[]>(initialTransactions);
  const [isSyncing, setIsSyncing] = useState(false);

  const calculateSummary = (): FeeSummary => {
    const pending = transactions.filter(t => t.status !== 'paid').reduce((acc, curr) => acc + curr.amount, 0);
    const paid = transactions.filter(t => t.status === 'paid').reduce((acc, curr) => acc + curr.amount, 0);
    return {
      totalDue: pending,
      paidAmount: paid,
      nextDeadline: 'March 28, 2024',
      scholarshipDeduction: 500
    };
  };

  const summary = calculateSummary();

  const formatAmount = (val: number) => {
    if (region === 'nepal') {
      return (val * exchangeRate).toLocaleString();
    }
    return val.toLocaleString();
  };

  const simulateNewCharge = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const newCharge: FeeTransaction = {
        id: `t${Date.now()}`,
        item: region === 'nepal' ? 'Extracurricular Club Fee' : 'Excursion Fee',
        amount: 45,
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        category: 'events'
      };
      setTransactions(prev => [newCharge, ...prev]);
      setIsSyncing(false);
    }, 800);
  };

  const handlePay = (id: string) => {
    setIsSyncing(true);
    setTimeout(() => {
      setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: 'paid' } : t));
      setIsSyncing(false);
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-outfit font-bold text-slate-50">Finance Hub</h1>
          <p className="text-slate-400 mt-2 flex items-center gap-2">
            Real-time balance tracking for {region === 'nepal' ? 'Academic Session 2080/81' : 'Academic Year 2024'}.
            {isSyncing && <span className="flex items-center gap-1 text-blue-400 text-xs animate-pulse"><RefreshCw size={12} className="animate-spin" /> Syncing...</span>}
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={simulateNewCharge}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-all"
          >
            <Plus size={16} />
            Add Test Charge
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-xl text-xs font-bold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
            <Download size={16} />
            Statement
          </button>
        </div>
      </header>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-8 rounded-3xl relative overflow-hidden group">
          <Wallet className="absolute -right-4 -bottom-4 w-24 h-24 opacity-5 group-hover:scale-110 transition-transform" />
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Total Outstanding</p>
          <p className="text-4xl font-bold text-white">{currency} {formatAmount(summary.totalDue)}</p>
          <div className="mt-6 flex items-center gap-2 text-xs">
            <span className="text-amber-400 font-bold flex items-center gap-1"><Clock size={12} /> Pay by {summary.nextDeadline}</span>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Paid This Session</p>
          <p className="text-4xl font-bold text-emerald-400">{currency} {formatAmount(summary.paidAmount)}</p>
          <p className="mt-6 text-xs text-slate-500">Includes scholarship credits</p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Primary Method</p>
            <p className="text-xl font-bold text-slate-200 flex items-center gap-2">
              <Smartphone size={20} className="text-emerald-500" />
              {region === 'nepal' ? 'eSewa Verified' : 'International Card'}
            </p>
          </div>
          <button className="w-full mt-4 py-3 bg-blue-600/10 hover:bg-blue-600 transition-all border border-blue-500/20 rounded-xl text-xs font-bold text-blue-400 hover:text-white">
            Manage Pay Modes
          </button>
        </div>
      </div>

      {/* Real-time Ledger */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-sm">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Receipt className="text-blue-500" />
            <h2 className="text-xl font-bold text-white">Verified Ledger</h2>
          </div>
          {region === 'nepal' && (
            <div className="flex gap-2">
              <span className="text-[10px] font-bold px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg border border-emerald-500/20 uppercase">eSewa Ready</span>
              <span className="text-[10px] font-bold px-2 py-1 bg-purple-500/10 text-purple-500 rounded-lg border border-purple-500/20 uppercase">Khalti Ready</span>
            </div>
          )}
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-950/50">
                <th className="p-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Description</th>
                <th className="p-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Type</th>
                <th className="p-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Amount</th>
                <th className="p-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="p-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Settlement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {transactions.map(t => (
                <tr key={t.id} className="hover:bg-slate-900/80 transition-all group">
                  <td className="p-6">
                    <p className="font-bold text-slate-200">{t.item}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{t.date}</p>
                  </td>
                  <td className="p-6">
                    <span className="px-2 py-1 bg-slate-800 rounded text-[10px] font-bold uppercase text-slate-400">{t.category}</span>
                  </td>
                  <td className="p-6 font-bold text-slate-100">{currency} {formatAmount(t.amount)}</td>
                  <td className="p-6">
                    {t.status === 'paid' ? (
                      <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                        <CheckCircle2 size={14} /> Confirmed
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
                        <Clock size={14} /> Pending
                      </span>
                    )}
                  </td>
                  <td className="p-6 text-right">
                    {t.status === 'pending' ? (
                      <div className="flex justify-end gap-2">
                         {region === 'nepal' ? (
                           <button 
                            onClick={() => handlePay(t.id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-[10px] font-bold text-white transition-all shadow-md active:scale-95"
                          >
                            Pay via eSewa
                          </button>
                         ) : (
                           <button 
                            onClick={() => handlePay(t.id)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-[10px] font-bold text-white transition-all shadow-md"
                          >
                            Pay Now
                          </button>
                         )}
                      </div>
                    ) : (
                      <button className="p-2 text-slate-600 hover:text-blue-400 transition-colors">
                        <Download size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-3xl flex items-start gap-4">
        <AlertCircle className="text-blue-400 shrink-0" size={24} />
        <div>
          <h4 className="font-bold text-blue-100">
            {region === 'nepal' ? 'FNC Licensed Platform' : 'Secure Financial Framework'}
          </h4>
          <p className="text-sm text-slate-400 mt-1">
            {region === 'nepal' 
              ? 'Our payment gateway is optimized for Nepali internet speeds and supports direct wallet integration for easy school fee payments.'
              : 'End-to-end encrypted financial data syncing with global standards for institutional fee management.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinanceHub;
