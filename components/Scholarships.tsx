
import React from 'react';
import { Scholarship } from '../types';
import { GraduationCap, Calendar, DollarSign, ArrowRight, ClipboardCheck } from 'lucide-react';

interface ScholarshipsProps {
  role: string;
}

const Scholarships: React.FC<ScholarshipsProps> = ({ role }) => {
  const scholarships: Scholarship[] = [
    {
      id: 's1',
      instituteId: 'inst1',
      name: 'Merit-Based Excellence Grant',
      amount: '$5,000 / Year',
      requirement: 'Minimum GPA 3.8, active sports participation.',
      deadline: 'Sept 30, 2024',
      status: 'pending'
    },
    {
      id: 's2',
      instituteId: 'inst2',
      name: 'Future Engineers Fund',
      amount: 'Full Tuition',
      requirement: 'Top 5% in entrance exam, family income < $30k.',
      deadline: 'Oct 15, 2024'
    },
    {
      id: 's3',
      instituteId: 'inst3',
      name: 'Community Leadership Scholarship',
      amount: '$2,500',
      requirement: 'Verified 100+ community service hours.',
      deadline: 'Nov 01, 2024'
    }
  ];

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <header>
        <h1 className="text-4xl font-outfit font-bold text-slate-50">Scholarship Portal</h1>
        <p className="text-slate-400 mt-2">Find and apply for financial aid directly from institutes.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {scholarships.map((s) => (
          <div key={s.id} className="group bg-slate-900/40 border border-slate-800 rounded-3xl p-6 transition-all hover:border-blue-500/50 hover:bg-slate-900">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-blue-600/10 rounded-2xl text-blue-500">
                <DollarSign size={24} />
              </div>
              {s.status && (
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                  s.status === 'pending' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
                }`}>
                  Status: {s.status}
                </span>
              )}
            </div>

            <h3 className="text-xl font-bold text-slate-100 mb-2">{s.name}</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">{s.requirement}</p>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-800/50">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Benefit</p>
                <p className="text-sm font-semibold text-emerald-400">{s.amount}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Deadline</p>
                <div className="flex items-center gap-1 text-sm font-semibold text-slate-300">
                  <Calendar size={14} className="text-blue-500" />
                  {s.deadline}
                </div>
              </div>
            </div>

            <button className="w-full mt-6 flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white transition-all rounded-xl font-bold">
              Apply Now
              <ArrowRight size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Scholarships;
