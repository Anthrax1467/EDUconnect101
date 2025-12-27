
import React from 'react';
import { UserRole, Region } from '../types';
import { 
  Bell, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  BookOpen,
  Calendar,
  ChevronRight,
  CreditCard,
  Flag,
  Info
} from 'lucide-react';

interface DashboardProps {
  role: UserRole;
  isVerified: boolean;
  region: Region;
}

const Dashboard: React.FC<DashboardProps> = ({ role, isVerified, region }) => {
  const currency = region === 'nepal' ? 'Rs.' : '$';
  
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-outfit font-bold">
            Namaste, {role === 'teacher' ? 'Prof. Miller' : 'Alex'}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-slate-400 text-sm">You are exploring </span>
            <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-xs font-bold uppercase rounded border border-blue-500/20">
              {region === 'nepal' ? 'Nepal Hub' : 'Global Hub'}
            </span>
            {isVerified && <ShieldCheck size={14} className="text-blue-400" />}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-3 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-all relative">
            <Bell size={20} className="text-slate-400" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900"></span>
          </button>
        </div>
      </header>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-3xl shadow-xl shadow-blue-900/20 col-span-1 md:col-span-2 relative overflow-hidden group">
          <Zap className="absolute right-[-20px] top-[-20px] w-48 h-48 opacity-10 group-hover:rotate-12 transition-transform duration-1000" />
          <h3 className="text-lg font-bold text-white/90">Academic Performance</h3>
          <p className="text-3xl font-bold text-white mt-2">GPA 3.82</p>
          <div className="mt-4 w-full bg-white/20 h-2 rounded-full overflow-hidden">
            <div className="bg-white h-full" style={{ width: '85%' }} />
          </div>
          <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mt-3">
            Ranked: Top 3 in {region === 'nepal' ? 'National Batch' : 'International Tier'}
          </p>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
          <BookOpen className="text-blue-500 mb-2" size={24} />
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Completed Credits</p>
          <p className="text-2xl font-bold text-slate-100 mt-1">128 / 150</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl group cursor-pointer hover:border-blue-500/50 transition-all">
          <div className="flex justify-between items-start">
            <CreditCard className="text-emerald-500 mb-2" size={24} />
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Pending Dues</p>
          <p className="text-2xl font-bold text-slate-100 mt-1">{currency} {region === 'nepal' ? '24,500' : '195.00'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-100">
              {region === 'nepal' ? 'National Exam Timeline' : 'Upcoming Timeline'}
            </h2>
            <button className="text-xs font-bold text-blue-500 hover:underline">View All</button>
          </div>
          
          <div className="space-y-3">
            {(region === 'nepal' ? [
              { title: 'NEB Board Registration', time: 'Ends in 5 days', type: 'Official', color: 'bg-red-500' },
              { title: 'IOE Entrance Mock Test', time: 'Sunday, 11:00 AM', type: 'Exam', color: 'bg-blue-500' },
              { title: 'SEE Result Re-totaling', time: 'Application Open', type: 'Notice', color: 'bg-amber-500' }
            ] : [
              { title: 'Mathematics Exam', time: 'Tomorrow, 09:00', type: 'Exam', color: 'bg-amber-500' },
              { title: 'Physics Lab Session', time: 'Mar 22, 14:30', type: 'Lab', color: 'bg-blue-500' },
              { title: 'International Symposium', time: 'Apr 05, 10:00', type: 'Event', color: 'bg-purple-500' }
            ]).map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-900/40 border border-slate-800 rounded-2xl hover:bg-slate-900 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className={`w-1 ${item.color} h-10 rounded-full`}></div>
                  <div>
                    <p className="font-bold text-slate-200">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.type}
                  </span>
                  <ChevronRight size={18} className="text-slate-700" />
                </div>
              </div>
            ))}
          </div>

          {region === 'nepal' && (
            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-3xl">
              <div className="flex items-center gap-2 mb-4 text-blue-400">
                <Info size={18} />
                <h3 className="text-sm font-bold uppercase tracking-widest">MoEST Latest Alerts</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                The Ministry of Education has announced new guidelines for the 2081 Academic Session. 
                Scholarship quotas for community school students have been increased by 15%. 
                <button className="text-blue-500 hover:underline font-bold ml-1">Read Official PDF</button>
              </p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-100">Regional Tools</h2>
          <div className="grid grid-cols-1 gap-3">
            <button className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl text-left hover:border-blue-500/50 transition-all group">
              <Calendar size={20} className="text-blue-500 mb-2" />
              <p className="text-sm font-bold text-slate-200">
                {region === 'nepal' ? 'Nepali Calendar (BS)' : 'Global Schedule'}
              </p>
              <p className="text-[10px] text-slate-500 group-hover:text-slate-400">Check holidays & festival breaks</p>
            </button>
            <button className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl text-left hover:border-emerald-500/50 transition-all group">
              <TrendingUp size={20} className="text-emerald-500 mb-2" />
              <p className="text-sm font-bold text-slate-200">
                {region === 'nepal' ? 'GPA Calculator (NEB)' : 'Grade Predictor'}
              </p>
              <p className="text-[10px] text-slate-500 group-hover:text-slate-400">Convert percentages to local GPA</p>
            </button>
            <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl">
              <Flag size={20} className="text-red-500 mb-2" />
              <p className="text-sm font-bold text-slate-200">Verified Presence</p>
              <p className="text-[10px] text-slate-500">EduConnect is officially partnered with 150+ local Nepali institutes.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
