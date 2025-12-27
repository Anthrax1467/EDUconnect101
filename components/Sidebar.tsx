
import React from 'react';
import { EduView, UserRole, Region } from '../types';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Zap, 
  Briefcase,
  Trophy,
  FileCode,
  LogOut,
  ShieldCheck,
  Newspaper,
  CreditCard,
  Globe,
  MapPin,
  Map,
  Plane
} from 'lucide-react';

interface SidebarProps {
  currentView: EduView;
  onViewChange: (view: EduView) => void;
  role: UserRole;
  region: Region;
  setRegion: (r: Region) => void;
  isVerified: boolean;
  instituteName: string;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  onViewChange, 
  role, 
  region,
  setRegion,
  isVerified,
  instituteName,
  onLogout
}) => {
  const menuItems = [
    { id: EduView.DASHBOARD, label: 'Overview', icon: LayoutDashboard, roles: ['student', 'parent', 'teacher', 'creator'] },
    { id: EduView.COMMUNITY, label: 'Transparency Hub', icon: Users, roles: ['student', 'parent', 'guest'] },
    { id: EduView.BLOGS, label: 'Insights & Blogs', icon: Newspaper, roles: ['student', 'parent', 'teacher', 'guest'] },
    { id: EduView.ACADEMICS, label: 'My Academics', icon: BookOpen, roles: ['student', 'parent'] },
    { id: EduView.FINANCE, label: 'Finance Hub', icon: CreditCard, roles: ['student', 'parent'] },
    { id: EduView.PROJECT_LAB, label: 'Project Lab', icon: FileCode, roles: ['student', 'teacher'] },
    { id: EduView.RESUME, label: 'Academic Portfolio', icon: Trophy, roles: ['student'] },
    { id: EduView.WORKSHOPS, label: 'Educational Marketplace', icon: Map, roles: ['student', 'parent', 'guest', 'creator'] },
    { id: EduView.ABROAD_HUB, label: 'Abroad Study Hub', icon: Plane, roles: ['student', 'parent', 'guest'] },
    { id: EduView.SCHOLARSHIPS, label: 'Scholarships', icon: GraduationCap, roles: ['student', 'parent'] },
    { id: EduView.TEACHER_PORTAL, label: 'Teacher Tools', icon: Briefcase, roles: ['teacher'] },
    { id: EduView.AI_ADVISOR, label: 'Academic AI', icon: Zap, roles: ['student', 'parent', 'teacher'] },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950 flex flex-col shrink-0">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
            <GraduationCap size={24} className="text-white" />
          </div>
          <div>
            <span className="text-xl font-outfit font-bold tracking-tight block">EduConnect</span>
            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">
              {region === 'nepal' ? 'Nepal Hub' : 'Elite V2'}
            </span>
          </div>
        </div>

        {/* Region Switcher */}
        <div className="mb-6 flex gap-1 bg-slate-900/50 border border-slate-800 rounded-xl p-1">
          <button 
            onClick={() => setRegion('nepal')}
            className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-[10px] font-bold transition-all ${region === 'nepal' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <MapPin size={10} /> Nepal
          </button>
          <button 
            onClick={() => setRegion('global')}
            className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-[10px] font-bold transition-all ${region === 'global' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Globe size={10} /> Global
          </button>
        </div>

        <div className="mb-6 p-4 bg-slate-900 rounded-2xl border border-slate-800">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Current Home</p>
          <p className="text-xs font-bold text-slate-200 truncate flex items-center gap-1">
            {instituteName}
            {isVerified && <ShieldCheck size={12} className="text-blue-500" />}
          </p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar pb-6">
        {menuItems
          .filter(item => item.roles.includes(role))
          .map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'} />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            );
          })}
      </nav>

      <div className="p-4 mt-auto border-t border-slate-800/50">
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white hover:bg-red-950 transition-all text-sm font-bold"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
