
import React from 'react';
import { FileText, Table, Presentation, Globe, Plus, Folder, ExternalLink, HardDrive, Calendar } from 'lucide-react';

const ProjectLab: React.FC = () => {
  const tools = [
    { name: 'Collab Docs', icon: FileText, color: 'text-blue-500', url: 'https://docs.google.com' },
    { name: 'Analysis Sheets', icon: Table, color: 'text-emerald-500', url: 'https://sheets.google.com' },
    { name: 'Project Slides', icon: Presentation, color: 'text-amber-500', url: 'https://slides.google.com' },
    { name: 'Events Calendar', icon: Calendar, color: 'text-red-500', url: 'https://calendar.google.com' },
    { name: 'Shared Drive', icon: HardDrive, color: 'text-indigo-500', url: 'https://drive.google.com' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-4xl font-outfit font-bold text-slate-50">Project Lab</h1>
        <p className="text-slate-400 mt-2">Centralized project management with Google Workspace integration.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {tools.map(tool => (
          <a 
            key={tool.name} 
            href={tool.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-6 bg-slate-900/50 border border-slate-800 rounded-3xl hover:border-blue-500/50 transition-all flex flex-col items-center text-center group"
          >
            <div className={`mb-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 ${tool.color} group-hover:scale-110 transition-transform`}>
              <tool.icon size={28} />
            </div>
            <h3 className="font-bold text-slate-100 text-sm">{tool.name}</h3>
            <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-widest">Open Workspace</p>
          </a>
        ))}
      </div>

      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Folder className="text-blue-500" />
            <h2 className="text-xl font-bold text-white">Project Filesystem</h2>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-xl text-xs font-bold hover:bg-blue-700 transition-all">
            <Plus size={16} /> New Folder
          </button>
        </div>
        
        <div className="p-6 space-y-3">
          {[
            { name: 'Capstone_Physics_2024', owner: 'Self', date: '2h ago', size: '12MB' },
            { name: 'Science_Fair_Graphics', owner: 'Partner', date: 'Yesterday', size: '45MB' },
            { name: 'Literature_Review_Notes', owner: 'Self', date: 'Mar 15', size: '1.2MB' },
          ].map(file => (
            <div key={file.name} className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-2xl hover:bg-slate-900 transition-all group cursor-pointer">
              <div className="flex items-center gap-4">
                <FileText size={20} className="text-slate-500 group-hover:text-blue-400" />
                <div>
                  <p className="font-bold text-slate-200">{file.name}</p>
                  <p className="text-xs text-slate-500">Last edited by {file.owner} • {file.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-xs text-slate-600 font-bold uppercase tracking-widest">{file.size}</span>
                <ExternalLink size={16} className="text-slate-700 group-hover:text-blue-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectLab;
