
import React, { useState } from 'react';
import { AppProject } from '../types';
import { generateAppStrategy } from '../services/geminiService';
import { Sparkles, Save, Loader2, Wand2 } from 'lucide-react';

interface IdeatorProps {
  project: AppProject | null;
  onSave: (p: AppProject) => void;
}

const Ideator: React.FC<IdeatorProps> = ({ project, onSave }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<AppProject>>(
    project || {
      name: '',
      description: '',
      targetAudience: '',
      features: [],
      techStack: [],
      status: 'draft'
    }
  );

  const handleMagicRefinement = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const data = await generateAppStrategy(prompt);
      setFormData({
        ...data,
        id: project?.id || Math.random().toString(36).substr(2, 9),
        status: 'planning'
      });
    } catch (error) {
      console.error(error);
      alert("Failed to generate strategy. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!formData.name) return;
    onSave({
      ...formData as AppProject,
      id: project?.id || Math.random().toString(36).substr(2, 9),
    });
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-outfit font-bold text-slate-50">Concept Ideator</h1>
        <p className="text-slate-400 mt-2">Describe your vision and let AI refine the architectural roadmap.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Input Magic Section */}
        <section className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-6 text-indigo-400">
            <Wand2 size={24} />
            <h2 className="text-xl font-bold text-slate-100">AI Blueprint Generator</h2>
          </div>
          
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A subscription-based platform for freelance photographers to manage bookings and deliver high-res images to clients..."
            className="w-full h-48 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
          />

          <button
            onClick={handleMagicRefinement}
            disabled={loading || !prompt.trim()}
            className="w-full mt-6 flex items-center justify-center gap-2 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-800 disabled:text-slate-500 transition-all rounded-xl font-bold text-white shadow-xl shadow-indigo-600/10 active:scale-[0.98]"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Refining Vision...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Generate Strategic Blueprint
              </>
            )}
          </button>
        </section>

        {/* Blueprint Section */}
        <section className="bg-slate-900/20 border border-slate-800 rounded-3xl p-8 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-slate-200">Current Blueprint</h2>
            {formData.name && (
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                <Save size={18} />
                Save Project
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Project Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-transparent border-b border-slate-800 py-2 focus:border-indigo-500 outline-none text-xl font-bold text-indigo-400"
                placeholder="Naming the future..."
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Audience</label>
              <input
                type="text"
                value={formData.targetAudience || ''}
                onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                className="w-full bg-transparent border-b border-slate-800 py-2 focus:border-indigo-500 outline-none text-slate-300"
                placeholder="Who is this for?"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Core Features</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.features?.map((feature, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-800 text-slate-300 text-xs rounded-full border border-slate-700">
                    {feature}
                  </span>
                ))}
                {(!formData.features || formData.features.length === 0) && (
                  <p className="text-slate-600 text-xs italic">Awaiting AI generation...</p>
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tech Stack Recommendations</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.techStack?.map((tech, i) => (
                  <span key={i} className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs rounded-full border border-indigo-500/20">
                    {tech}
                  </span>
                ))}
                {(!formData.techStack || formData.techStack.length === 0) && (
                  <p className="text-slate-600 text-xs italic">Awaiting AI generation...</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Ideator;
