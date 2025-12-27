
import React, { useState, useRef } from 'react';
import { 
  Trophy, 
  Mail, 
  Github, 
  Globe, 
  Plus, 
  Download, 
  Sparkles, 
  FileText, 
  Upload, 
  Wand2, 
  Layout, 
  CheckCircle, 
  Loader2, 
  AlertCircle,
  Eye,
  FileSearch,
  Check,
  Edit3,
  Trash2,
  User
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

const ResumeBuilder: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'preview' | 'help' | 'builder'>('preview');
  const [selectedTemplate, setSelectedTemplate] = useState<'modern' | 'classic' | 'minimalist'>('modern');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [resume, setResume] = useState({
    name: "Alex Johnson",
    email: "alex.j@educonnect.com",
    bio: "Honors student specializing in Physics and AI applications. Passionate about community leadership.",
    education: ["Central High School - Advanced Placement Program (2020 - Present)"],
    skills: ["Python", "Physics Research", "Public Speaking", "Team Management"],
    awards: ["National Merit Scholar", "Science Fair Gold Medalist"]
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
    }
  };

  const analyzeResume = async () => {
    if (!uploadedFileName && !resume.bio) return;
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Act as an expert career coach. Analyze this student profile and provide 3 constructive, high-impact suggestions to make it better for college applications:
      Name: ${resume.name}
      Bio: ${resume.bio}
      Skills: ${resume.skills.join(', ')}
      Awards: ${resume.awards.join(', ')}
      Keep suggestions short and punchy.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      setAiFeedback(response.text || "Analysis failed.");
    } catch (e) {
      console.error(e);
      setAiFeedback("Error connecting to AI Advisor. Please try again later.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const templates = [
    { id: 'modern', name: 'The Modernist', desc: 'Sleek, color-accented grid layout.', icon: Layout },
    { id: 'classic', name: 'The Executive', desc: 'High-trust, professional typography.', icon: FileText },
    { id: 'minimalist', name: 'The Minimalist', desc: 'Focus on whitespace and clarity.', icon: Eye },
  ];

  const updateResumeField = (field: string, value: string | string[]) => {
    setResume(prev => ({ ...prev, [field]: value }));
  };

  const addListItem = (field: 'skills' | 'education' | 'awards') => {
    setResume(prev => ({ ...prev, [field]: [...prev[field], "New Item"] }));
  };

  const removeListItem = (field: 'skills' | 'education' | 'awards', index: number) => {
    setResume(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const updateListItem = (field: 'skills' | 'education' | 'awards', index: number, value: string) => {
    const newList = [...resume[field]];
    newList[index] = value;
    updateResumeField(field, newList);
  };

  const renderBuilderTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-left-4 duration-500">
      <div className="space-y-6">
        <section className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <User className="text-blue-500" /> Personal Details
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Full Name</label>
              <input 
                type="text" 
                value={resume.name}
                onChange={(e) => updateResumeField('name', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Email Address</label>
              <input 
                type="email" 
                value={resume.email}
                onChange={(e) => updateResumeField('email', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Professional Summary</label>
              <textarea 
                value={resume.bio}
                onChange={(e) => updateResumeField('bio', e.target.value)}
                className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none resize-none"
              />
            </div>
          </div>
        </section>

        <section className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="text-indigo-400" /> Skills
            </h3>
            <button onClick={() => addListItem('skills')} className="text-blue-500 hover:text-blue-400"><Plus size={20}/></button>
          </div>
          <div className="space-y-3">
            {resume.skills.map((skill, i) => (
              <div key={i} className="flex gap-2">
                <input 
                  type="text" 
                  value={skill}
                  onChange={(e) => updateListItem('skills', i, e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white outline-none"
                />
                <button onClick={() => removeListItem('skills', i)} className="p-3 text-slate-600 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="space-y-6">
        <section className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="text-emerald-500" /> Education
            </h3>
            <button onClick={() => addListItem('education')} className="text-blue-500 hover:text-blue-400"><Plus size={20}/></button>
          </div>
          <div className="space-y-3">
            {resume.education.map((edu, i) => (
              <div key={i} className="flex gap-2">
                <textarea 
                  value={edu}
                  onChange={(e) => updateListItem('education', i, e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white outline-none h-20 resize-none"
                />
                <button onClick={() => removeListItem('education', i)} className="p-3 text-slate-600 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Trophy className="text-amber-500" /> Awards & Distinctions
            </h3>
            <button onClick={() => addListItem('awards')} className="text-blue-500 hover:text-blue-400"><Plus size={20}/></button>
          </div>
          <div className="space-y-3">
            {resume.awards.map((award, i) => (
              <div key={i} className="flex gap-2">
                <input 
                  type="text" 
                  value={award}
                  onChange={(e) => updateListItem('awards', i, e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white outline-none"
                />
                <button onClick={() => removeListItem('awards', i)} className="p-3 text-slate-600 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
              </div>
            ))}
          </div>
        </section>
        
        <button 
          onClick={() => setActiveTab('preview')}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 transition-all rounded-2xl font-bold text-white shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2"
        >
          <Eye size={18} />
          View Live Preview
        </button>
      </div>
    </div>
  );

  const renderHelpTab = () => (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: AI Architect */}
        <div className="space-y-6">
          <section className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                <Wand2 size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">AI Architect</h3>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Refine & Optimize</p>
              </div>
            </div>

            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-800 rounded-2xl p-8 text-center hover:border-indigo-500/50 hover:bg-slate-800/20 transition-all cursor-pointer group mb-6"
            >
              <Upload className="mx-auto mb-4 text-slate-500 group-hover:text-indigo-400" size={32} />
              <p className="text-slate-300 font-bold">
                {uploadedFileName ? uploadedFileName : "Upload Existing Resume"}
              </p>
              <p className="text-slate-500 text-xs mt-1">PDF, DOCX or TXT (Max 5MB)</p>
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
            </div>

            <button 
              onClick={analyzeResume}
              disabled={isAnalyzing}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-800 transition-all rounded-xl font-bold text-white shadow-xl shadow-indigo-600/10 flex items-center justify-center gap-2"
            >
              {isAnalyzing ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
              Analyze with Gemini AI
            </button>

            {aiFeedback && (
              <div className="mt-8 p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2 text-indigo-400 mb-4">
                  <FileSearch size={18} />
                  <h4 className="text-xs font-bold uppercase tracking-widest">Architect's Feedback</h4>
                </div>
                <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap italic">
                  {aiFeedback}
                </div>
              </div>
            )}
          </section>

          <section className="bg-emerald-500/5 border border-emerald-500/10 rounded-3xl p-8">
            <h4 className="text-white font-bold mb-2 flex items-center gap-2">
              <CheckCircle size={18} className="text-emerald-500" />
              Academic Verification
            </h4>
            <p className="text-sm text-slate-400">
              Verified Student IDs from EduConnect automatically receive a "Trusted Credentials" badge on their exported portfolios.
            </p>
          </section>
        </div>

        {/* Right Column: Template Gallery */}
        <div className="space-y-6">
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                <Layout size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Visual Templates</h3>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Switch Identity Styles</p>
              </div>
            </div>

            <div className="space-y-4">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id as any)}
                  className={`w-full flex items-center gap-4 p-5 rounded-2xl border transition-all text-left group ${
                    selectedTemplate === t.id 
                      ? 'bg-blue-600/10 border-blue-500/50 ring-2 ring-blue-500/20' 
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                    selectedTemplate === t.id ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500'
                  }`}>
                    <t.icon size={24} />
                  </div>
                  <div className="flex-1">
                    <p className={`font-bold transition-colors ${selectedTemplate === t.id ? 'text-blue-400' : 'text-slate-200'}`}>
                      {t.name}
                    </p>
                    <p className="text-xs text-slate-500">{t.desc}</p>
                  </div>
                  {selectedTemplate === t.id && (
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white">
                      <Check size={14} />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setActiveTab('preview')}
              className="w-full mt-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2"
            >
              Apply Template & Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <header className="flex flex-col md:flex-row justify-between md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-outfit font-bold text-slate-50">Academic Portfolio</h1>
          <p className="text-slate-400 mt-2">Verified identity for elite higher education & research opportunities.</p>
        </div>
        <div className="flex p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit self-start md:self-auto shadow-2xl">
          <button 
            onClick={() => setActiveTab('preview')}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'preview' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Eye size={14} />
            Live Preview
          </button>
          <button 
            onClick={() => setActiveTab('builder')}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'builder' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Edit3 size={14} />
            Resume Builder
          </button>
          <button 
            onClick={() => setActiveTab('help')}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'help' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Sparkles size={14} />
            AI Architect
          </button>
        </div>
      </header>

      {activeTab === 'builder' && renderBuilderTab()}
      {activeTab === 'help' && renderHelpTab()}
      {activeTab === 'preview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Editor Sidebar */}
          <div className="space-y-6">
            <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-3xl space-y-4">
              <h3 className="font-bold text-white mb-2">Social Profiles</h3>
              <div className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer">
                <Github size={18} /> <span>github.com/alexj</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer">
                <Globe size={18} /> <span>alexphysics.dev</span>
              </div>
            </div>
            
            <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-3xl">
              <h3 className="font-bold text-white mb-4">Core Skills</h3>
              <div className="flex flex-wrap gap-2">
                {resume.skills.map(s => <span key={s} className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-lg border border-blue-500/20">{s}</span>)}
                <button onClick={() => setActiveTab('builder')} className="p-1 border border-dashed border-slate-700 rounded-lg text-slate-500 hover:text-white transition-colors"><Plus size={16} /></button>
              </div>
            </div>
            
            <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold transition-all border border-slate-700">
              <Download size={18} />
              Export Portfolio PDF
            </button>
          </div>

          {/* Live Preview Pane */}
          <div className={`lg:col-span-2 rounded-3xl shadow-2xl p-12 min-h-[800px] relative overflow-hidden transition-all duration-500 ${
            selectedTemplate === 'minimalist' ? 'bg-slate-50 text-slate-900' :
            selectedTemplate === 'classic' ? 'bg-white text-slate-900 font-serif' :
            'bg-white text-slate-900'
          }`}>
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-50 ${
              selectedTemplate === 'modern' ? 'bg-blue-50' : 'hidden'
            }`} />
            
            <div className="flex justify-between items-start mb-12">
              <div>
                <h2 className={`text-4xl font-bold tracking-tight mb-2 ${selectedTemplate === 'classic' ? 'font-serif' : 'font-outfit'}`}>{resume.name}</h2>
                <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
                  <span className="flex items-center gap-1"><Mail size={14} /> {resume.email}</span>
                  <span className="flex items-center gap-1 text-blue-600"><Trophy size={14} /> Verified Student ID: #9921</span>
                </div>
              </div>
              <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300">
                <FileText size={40} />
              </div>
            </div>

            <section className="mb-10">
              <h4 className={`text-xs font-bold uppercase tracking-widest mb-4 border-b pb-2 ${
                selectedTemplate === 'modern' ? 'text-blue-600 border-blue-100' : 
                selectedTemplate === 'classic' ? 'text-slate-900 border-slate-200' :
                'text-slate-400 border-slate-100'
              }`}>Profile</h4>
              <p className="text-lg leading-relaxed text-slate-700">{resume.bio}</p>
            </section>

            <section className="mb-10">
              <h4 className={`text-xs font-bold uppercase tracking-widest mb-4 border-b pb-2 ${
                selectedTemplate === 'modern' ? 'text-blue-600 border-blue-100' : 
                selectedTemplate === 'classic' ? 'text-slate-900 border-slate-200' :
                'text-slate-400 border-slate-100'
              }`}>Education</h4>
              <div className="space-y-4">
                {resume.education.map(e => <p key={e} className="font-bold text-slate-800 whitespace-pre-wrap">{e}</p>)}
              </div>
            </section>

            <section className="mb-10">
              <h4 className={`text-xs font-bold uppercase tracking-widest mb-4 border-b pb-2 ${
                selectedTemplate === 'modern' ? 'text-blue-600 border-blue-100' : 
                selectedTemplate === 'classic' ? 'text-slate-900 border-slate-200' :
                'text-slate-400 border-slate-100'
              }`}>Distinctions</h4>
              <ul className="space-y-2">
                {resume.awards.map(a => <li key={a} className="flex items-center gap-3 text-slate-700 font-medium"><Trophy size={16} className="text-amber-500" /> {a}</li>)}
              </ul>
            </section>

            <div className="absolute bottom-8 left-12 right-12 flex justify-between items-center pt-8 border-t border-slate-100">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Verified via EduConnect Academic Trust Network</p>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full" />
                <div className="w-2 h-2 bg-indigo-600 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// BookOpen import fix
const BookOpen: React.FC<{ size?: number, className?: string }> = ({ size = 24, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

export default ResumeBuilder;
