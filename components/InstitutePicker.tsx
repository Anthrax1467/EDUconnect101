
import React, { useState } from 'react';
import { Institute, UserRole } from '../types';
import { Building2, Search, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

interface InstitutePickerProps {
  role: UserRole;
  onSelect: (inst: Institute) => void;
}

const InstitutePicker: React.FC<InstitutePickerProps> = ({ role, onSelect }) => {
  const [search, setSearch] = useState('');
  
  const institutes: Institute[] = [
    { id: '1', name: 'Central High School', type: 'school', location: 'New York, NY' },
    { id: '2', name: 'Oxford University College', type: 'college', location: 'Oxford, UK' },
    { id: '3', name: 'St. Mary’s Academy', type: 'school', location: 'London, UK' },
    { id: '4', name: 'MIT - Faculty of Science', type: 'university', location: 'Cambridge, MA' },
    { id: '5', name: 'Westside Community School', type: 'school', location: 'Austin, TX' },
  ];

  const filtered = institutes.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-slate-900/40 border border-slate-800 rounded-3xl p-10 backdrop-blur-xl">
        <header className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-500">
            <Building2 size={32} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Identify Your Institute</h2>
          <p className="text-slate-400">As a <span className="text-blue-400 font-bold capitalize">{role}</span>, select your verified organization to unlock resources.</p>
        </header>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input 
            type="text" 
            placeholder="Search school or college name..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500/50 outline-none text-white text-lg transition-all"
          />
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
          {filtered.map((inst) => (
            <button
              key={inst.id}
              onClick={() => onSelect(inst)}
              className="w-full flex items-center justify-between p-5 bg-slate-950/50 border border-slate-800 rounded-2xl hover:bg-slate-900 hover:border-blue-500/50 transition-all group"
            >
              <div className="flex items-start gap-4 text-left">
                <div className="mt-1 p-2 bg-slate-800 rounded-lg text-slate-400 group-hover:text-blue-500 transition-colors">
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    {inst.name}
                    <ShieldCheck size={16} className="text-blue-500" />
                  </h3>
                  <div className="flex items-center gap-1 text-slate-500 text-sm mt-1">
                    <MapPin size={12} />
                    <span>{inst.location} • </span>
                    <span className="capitalize">{inst.type}</span>
                  </div>
                </div>
              </div>
              <ArrowRight className="text-slate-700 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" size={20} />
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-10 text-slate-500 italic">
              No matching institutes found. Contact your admin.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstitutePicker;
