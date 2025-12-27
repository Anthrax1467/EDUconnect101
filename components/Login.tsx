
import React from 'react';
import { UserRole } from '../types';
import { GraduationCap, Users, Briefcase, UserRound, ShieldCheck } from 'lucide-react';

interface LoginProps {
  onSelectRole: (role: UserRole) => void;
}

const Login: React.FC<LoginProps> = ({ onSelectRole }) => {
  const roles = [
    { id: 'student', label: 'Student', icon: GraduationCap, color: 'bg-blue-600', desc: 'Manage homework, grades & scholarships' },
    { id: 'parent', label: 'Parent', icon: Users, color: 'bg-indigo-600', desc: 'Track progress & collaborate with teachers' },
    { id: 'teacher', label: 'Teacher / Faculty', icon: Briefcase, color: 'bg-emerald-600', desc: 'Post resources & send mass reports' },
    { id: 'guest', label: 'Guest Access', icon: UserRound, color: 'bg-slate-700', desc: 'View public reviews & general info' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-3xl shadow-2xl shadow-blue-600/30 mb-6 animate-bounce">
            <GraduationCap size={40} className="text-white" />
          </div>
          <h1 className="text-5xl font-outfit font-extrabold text-white tracking-tight mb-4">EduConnect Elite</h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
            The high-trust educational network for verified student, parent, and institutional collaboration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roles.map((r) => {
            const Icon = r.icon;
            return (
              <button
                key={r.id}
                onClick={() => onSelectRole(r.id as UserRole)}
                className="group relative flex items-start gap-6 p-8 bg-slate-900/50 border border-slate-800 rounded-3xl text-left hover:border-blue-500/50 hover:bg-slate-900 transition-all hover:-translate-y-1"
              >
                <div className={`shrink-0 w-14 h-14 ${r.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                  <Icon size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{r.label}</h3>
                  <p className="text-slate-400 text-sm">{r.desc}</p>
                </div>
                {r.id !== 'guest' && (
                  <ShieldCheck className="absolute top-4 right-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                )}
              </button>
            );
          })}
        </div>

        <p className="text-center text-slate-500 mt-12 text-xs">
          By continuing, you agree to our <span className="underline cursor-pointer">Academic Integrity Policy</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
