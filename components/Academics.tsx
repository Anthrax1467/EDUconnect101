
import React from 'react';
import { AcademicRecord } from '../types';
import { BookOpen, CheckSquare, TrendingUp, Calendar, FileText } from 'lucide-react';

interface AcademicsProps {
  role: string;
}

const Academics: React.FC<AcademicsProps> = ({ role }) => {
  const records: AcademicRecord[] = [
    { id: '1', studentName: 'John Doe', subject: 'Mathematics', grade: 'A-', homework: 'Calculus Ch 4', progress: 85, nextMeeting: 'Mar 25' },
    { id: '2', studentName: 'John Doe', subject: 'Physics', grade: 'B+', homework: 'Optics Lab Report', progress: 72, nextMeeting: 'Apr 02' },
    { id: '3', studentName: 'John Doe', subject: 'Computer Science', grade: 'A', homework: 'React Project', progress: 98 }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-4xl font-outfit font-bold text-slate-50">Academic Dashboard</h1>
        <p className="text-slate-400 mt-2">Real-time tracking of grades, homework, and progress reports.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-600/10 border border-blue-500/20 rounded-3xl p-6">
          <TrendingUp className="text-blue-500 mb-4" size={24} />
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Average Grade</p>
          <p className="text-3xl font-bold text-slate-100">A- (3.75)</p>
        </div>
        <div className="bg-emerald-600/10 border border-emerald-500/20 rounded-3xl p-6">
          <CheckSquare className="text-emerald-500 mb-4" size={24} />
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Homework Score</p>
          <p className="text-3xl font-bold text-slate-100">92%</p>
        </div>
        <div className="bg-purple-600/10 border border-purple-500/20 rounded-3xl p-6">
          <Calendar className="text-purple-500 mb-4" size={24} />
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Next PT Meeting</p>
          <p className="text-3xl font-bold text-slate-100">March 25</p>
        </div>
      </div>

      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-950/50">
            <tr>
              <th className="p-6 text-xs font-bold text-slate-500 uppercase tracking-widest">Subject</th>
              <th className="p-6 text-xs font-bold text-slate-500 uppercase tracking-widest">Current Grade</th>
              <th className="p-6 text-xs font-bold text-slate-500 uppercase tracking-widest">Active Homework</th>
              <th className="p-6 text-xs font-bold text-slate-500 uppercase tracking-widest">Progress</th>
              <th className="p-6 text-xs font-bold text-slate-500 uppercase tracking-widest">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {records.map(r => (
              <tr key={r.id} className="hover:bg-slate-900/50 transition-colors">
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-blue-400">
                      <BookOpen size={16} />
                    </div>
                    <span className="font-bold text-slate-200">{r.subject}</span>
                  </div>
                </td>
                <td className="p-6">
                  <span className="px-3 py-1 bg-slate-800 rounded-full font-bold text-emerald-400">{r.grade}</span>
                </td>
                <td className="p-6 text-slate-400 text-sm">{r.homework}</td>
                <td className="p-6">
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full transition-all duration-1000" style={{ width: `${r.progress}%` }} />
                  </div>
                </td>
                <td className="p-6">
                  <button className="text-blue-500 hover:text-blue-400 transition-colors">
                    <FileText size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Academics;
