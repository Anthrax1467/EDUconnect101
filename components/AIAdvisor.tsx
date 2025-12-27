
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Region } from '../types';
import { Sparkles, Send, Loader2, Lightbulb } from 'lucide-react';

interface AIAdvisorProps {
  role: string;
  region: Region;
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({ role, region }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const handleAsk = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const res = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          systemInstruction: `You are an elite Academic Advisor for the EduConnect platform. 
          The user is a ${role} based in ${region === 'nepal' ? 'Nepal' : 'a global setting'}. 
          If the region is Nepal, provide advice specific to the NEB/SEE board, Nepali university entrance exams (IOE/IOM/KU), 
          and local scholarship opportunities. Use culturally relevant examples but keep the tone professional.`
        }
      });
      setResponse(res.text);
    } catch (e) {
      console.error(e);
      setResponse("I'm sorry, I encountered an error helping you. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500 max-w-4xl mx-auto">
      <header className="text-center">
        <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Sparkles size={32} className="text-blue-500" />
        </div>
        <h1 className="text-4xl font-outfit font-bold text-slate-50">
          {region === 'nepal' ? 'Academic AI Guru' : 'Academic AI Advisor'}
        </h1>
        <p className="text-slate-400 mt-2">
          {region === 'nepal' 
            ? 'Get localized advice on SEE, NEB, and local university pathways.' 
            : 'Get personalized advice on curriculum, scholarships, or college orientation.'}
        </p>
      </header>

      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={region === 'nepal' 
              ? "Ask about SEE results, NEB board exams, or IOE entrance tips..." 
              : "Ask about scholarships, grades, or orientation..."}
            className="w-full h-32 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none pr-12"
          />
          <button
            onClick={handleAsk}
            disabled={loading || !prompt.trim()}
            className="absolute bottom-4 right-4 p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 transition-all rounded-xl text-white shadow-xl shadow-blue-600/20"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {region === 'nepal' ? (
            <>
              <button onClick={() => setPrompt("Explain the SEE grading system (2080).")} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-[10px] font-bold text-slate-400">#SEEGrades</button>
              <button onClick={() => setPrompt("What are the requirements for TU engineering entrance?")} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-[10px] font-bold text-slate-400">#IOE_Tips</button>
              <button onClick={() => setPrompt("Local scholarships for science students in Nepal.")} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-[10px] font-bold text-slate-400">#LocalGrants</button>
            </>
          ) : (
            <>
              <button onClick={() => setPrompt("What scholarships are best for computer science students?")} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-[10px] font-bold text-slate-400">#Scholarships</button>
              <button onClick={() => setPrompt("Explain how to prepare for college orientation.")} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-[10px] font-bold text-slate-400">#Orientation</button>
            </>
          )}
        </div>
      </div>

      {response && (
        <div className="bg-slate-900/20 border border-slate-800 rounded-3xl p-8 animate-in slide-in-from-top-4">
          <div className="flex items-center gap-2 mb-4 text-blue-400">
            <Lightbulb size={20} />
            <h2 className="text-sm font-bold uppercase tracking-widest">Advisor Insight</h2>
          </div>
          <div className="text-slate-300 prose prose-invert max-w-none leading-relaxed whitespace-pre-wrap text-lg">
            {response}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAdvisor;
