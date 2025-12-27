
import React, { useState } from 'react';
import { AppProject } from '../types';
import { generateAppVisual } from '../services/geminiService';
import { Camera, RefreshCw, Loader2, Download, ExternalLink } from 'lucide-react';

interface VisualizerProps {
  project: AppProject;
  onUpdate: (p: AppProject) => void;
}

const Visualizer: React.FC<VisualizerProps> = ({ project, onUpdate }) => {
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const imageUrl = await generateAppVisual(project.description);
      if (imageUrl) {
        onUpdate({ ...project, imageUrl, status: 'visualizing' });
      }
    } catch (error) {
      console.error(error);
      alert("Failed to generate visualization.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-outfit font-bold text-slate-50">Interface Visualizer</h1>
          <p className="text-slate-400 mt-2">Generate high-fidelity UI previews for {project.name}.</p>
        </div>
        <button 
          onClick={handleGenerate}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-800 transition-all rounded-xl font-bold shadow-lg shadow-indigo-600/20"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
          {project.imageUrl ? 'Re-generate Design' : 'Generate UI Preview'}
        </button>
      </header>

      <div className="relative group rounded-3xl overflow-hidden border border-slate-800 bg-slate-900/50 aspect-video flex items-center justify-center">
        {project.imageUrl ? (
          <>
            <img 
              src={project.imageUrl} 
              alt="UI Preview" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
              <div className="flex gap-4">
                <a 
                  href={project.imageUrl} 
                  download={`${project.name}-preview.png`}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 backdrop-blur rounded-lg text-sm font-semibold hover:bg-slate-700"
                >
                  <Download size={16} />
                  Download PNG
                </a>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center p-12">
            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Camera size={40} className="text-slate-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-400">No Visualization Generated</h3>
            <p className="text-slate-500 mt-2 max-w-sm">Use the AI to render a potential landing page or dashboard interface for your app concept.</p>
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
            <p className="text-slate-300 font-medium animate-pulse">Designing your interface...</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl">
          <h4 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">Design Style</h4>
          <p className="text-slate-100 font-medium">Modern Glassmorphism</p>
          <p className="text-slate-400 text-sm mt-1">Clean layouts with subtle transparency and depth.</p>
        </div>
        <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl">
          <h4 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">Color Palette</h4>
          <p className="text-slate-100 font-medium">Deep Slate & Indigo</p>
          <p className="text-slate-400 text-sm mt-1">High-contrast, professional tech aesthetic.</p>
        </div>
        <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl">
          <h4 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">Next Steps</h4>
          <p className="text-slate-100 font-medium">Figma Export (Mockup)</p>
          <p className="text-slate-400 text-sm mt-1">Ready for high-fidelity component mapping.</p>
        </div>
      </div>
    </div>
  );
};

export default Visualizer;
