
import React, { useState } from 'react';
import { Region, Consultancy, Review } from '../types';
import { 
  Plane, 
  Search, 
  Star, 
  ShieldCheck, 
  TrendingUp, 
  CheckCircle, 
  Users, 
  FileText, 
  Award, 
  Globe, 
  Navigation,
  MessageCircle,
  BarChart3,
  ThumbsUp,
  MapPin,
  ChevronRight,
  Stamp
} from 'lucide-react';

interface AbroadHubProps {
  region: Region;
}

const AbroadHub: React.FC<AbroadHubProps> = ({ region }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const consultancies: Consultancy[] = [
    {
      id: 'c1',
      name: 'Global Reach Nepal',
      location: 'Putalisadak, Kathmandu',
      specialization: ['IELTS', 'PTE', 'Australia Visa', 'USA Visa'],
      trustScore: 98,
      reviewCount: 1250,
      successRate: '92%',
      isVerified: true,
      services: ['Career Counseling', 'Visa Guidance', 'Scholarship Assistance']
    },
    {
      id: 'c2',
      name: 'The Chopras',
      location: 'New Baneshwor, Kathmandu',
      specialization: ['GRE', 'SAT', 'UK Visa', 'Canada Visa'],
      trustScore: 94,
      reviewCount: 890,
      successRate: '88%',
      isVerified: true,
      services: ['Admission Support', 'Test Prep', 'Loan Assistance']
    },
    {
      id: 'c3',
      name: 'Elite Abroad Education',
      location: 'Chitwan, Nepal',
      specialization: ['IELTS', 'Germany Visa', 'Poland Visa'],
      trustScore: 82,
      reviewCount: 340,
      successRate: '85%',
      isVerified: false,
      services: ['Language Classes', 'Documentation']
    }
  ];

  const filtered = consultancies.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.specialization.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  ).sort((a, b) => b.trustScore - a.trustScore);

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-outfit font-bold text-slate-50 flex items-center gap-3">
            <Plane className="text-blue-500" />
            Abroad Study Hub
          </h1>
          <p className="text-slate-400">Verified Consultancies & Trusted Test Preparation (IELTS, GRE, SAT).</p>
        </div>
        
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2 w-full md:w-96">
          <Search size={20} className="text-slate-500" />
          <input 
            type="text" 
            placeholder="Search IELTS, GRE or Visa services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-white w-full"
          />
        </div>
      </header>

      {/* Trust Meter Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-3xl shadow-xl shadow-blue-900/20 col-span-1 md:col-span-2 relative overflow-hidden group">
          <Award className="absolute right-[-20px] top-[-20px] w-48 h-48 opacity-10 group-hover:scale-110 transition-transform" />
          <p className="text-white/70 text-xs font-bold uppercase tracking-widest">Transparency Standard</p>
          <h3 className="text-2xl font-bold text-white mt-2">Verified Partner Network</h3>
          <p className="text-white/60 text-sm mt-2 leading-relaxed">
            All consultancies listed here are ranked by real student polls. We prioritize documented success and honest reviews over marketing.
          </p>
          <div className="mt-4 flex gap-2">
            <span className="px-2 py-1 bg-white/20 rounded-lg text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
              <CheckCircle size={10} /> Government Licensed
            </span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
          <Users className="text-blue-500 mb-2" size={24} />
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Students Polled</p>
          <p className="text-2xl font-bold text-slate-100 mt-1">15.4k+</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
          <Stamp className="text-emerald-500 mb-2" size={24} />
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Visa Success Rate</p>
          <p className="text-2xl font-bold text-slate-100 mt-1">89% Avg</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {['all', 'IELTS', 'GRE/SAT', 'Visa Experts', 'Scholarships'].map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              activeFilter === filter 
                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filtered.map((consultancy) => (
          <div key={consultancy.id} className="group bg-slate-900/40 border border-slate-800 rounded-3xl p-8 hover:bg-slate-900 hover:border-blue-500/30 transition-all flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-blue-500 shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Globe size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    {consultancy.name}
                    {consultancy.isVerified && <ShieldCheck size={16} className="text-blue-500" />}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin size={12} /> {consultancy.location}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-blue-400 font-bold text-lg">
                  <BarChart3 size={18} /> {consultancy.trustScore}%
                </div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Trust Ranking</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {consultancy.specialization.map(spec => (
                <span key={spec} className="px-2 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase rounded-md border border-blue-500/20">
                  {spec}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-950/50 rounded-2xl border border-slate-800 mb-8">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Success Rate</p>
                <p className="text-sm font-bold text-emerald-400">{consultancy.successRate}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Student Reviews</p>
                <p className="text-sm font-bold text-slate-300">{consultancy.reviewCount.toLocaleString()}+</p>
              </div>
            </div>

            <div className="space-y-2 mb-8">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2 flex items-center gap-2">
                <CheckCircle size={12} className="text-blue-500" /> Transparency Check: Services Offered
              </p>
              <div className="grid grid-cols-2 gap-y-1">
                {consultancy.services.map(s => (
                  <div key={s} className="flex items-center gap-2 text-xs text-slate-400">
                    <div className="w-1 h-1 bg-blue-500 rounded-full" /> {s}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-xl shadow-blue-600/20">
                <ThumbsUp size={16} /> Poll Trust
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold transition-all border border-slate-700">
                Full Profile & Reviews <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-8 bg-amber-500/5 border border-amber-500/10 rounded-3xl">
        <div className="flex items-start gap-4">
          <MessageCircle className="text-amber-500 shrink-0" size={24} />
          <div>
            <h4 className="font-bold text-amber-200">Wait-listed Consultancies?</h4>
            <p className="text-sm text-slate-400 mt-1 leading-relaxed">
              We only show consultancies that pass our 5-point transparency check. If a consultancy has a trust score below 70%, they are hidden from the main feed until they provide verifiable service documentation and student feedback audits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AbroadHub;
