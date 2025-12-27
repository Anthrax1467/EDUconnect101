
import React, { useState } from 'react';
import { BlogPost } from '../types';
import { GoogleGenAI } from '@google/genai';
import { 
  Search, 
  Clock, 
  User, 
  ChevronRight, 
  Sparkles, 
  Loader2, 
  BookOpen, 
  ArrowLeft,
  Calendar,
  Tag
} from 'lucide-react';

const Blogs: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'The Future of AI in Modern Classrooms',
      excerpt: 'How generative AI is moving from a distraction to a core pedagogical tool for personalized learning.',
      author: 'Dr. Sarah Chen',
      date: 'Mar 18, 2024',
      category: 'tech',
      readTime: '6 min read',
      imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
      content: `Artificial Intelligence is no longer just a buzzword in educational circles. From automated grading to personalized tutoring systems, AI is reshaping how we think about instruction.

In this deep dive, we explore how teachers can leverage Gemini and other LLMs to create bespoke lesson plans that adapt to each student's unique learning pace. We also address the ethical considerations of data privacy and the essential role of human mentorship in an AI-augmented world.`
    },
    {
      id: '2',
      title: '10 Productivity Hacks for Engineering Students',
      excerpt: 'Mastering your schedule and technical stack can give you back 10 hours a week for deep work.',
      author: 'Marcus Rivera',
      date: 'Mar 15, 2024',
      category: 'productivity',
      readTime: '4 min read',
      imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
      content: `Engineering curriculums are notoriously rigorous. Without a system, it's easy to burn out. 

Key strategies discussed include:
- The "Deep Work" protocol for complex coding sessions.
- Automating repetitive documentation tasks.
- Selecting the right IDE extensions to minimize context switching.`
    },
    {
      id: '3',
      title: 'Navigating Scholarship Applications in 2024',
      excerpt: 'Financial aid landscapes are shifting. Learn how to stand out in a sea of verified applications.',
      author: 'Elena Gilbert',
      date: 'Mar 12, 2024',
      category: 'career',
      readTime: '8 min read',
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
      content: `The competition for grants has never been fiercer. We analyze successful application patterns from the previous cycle and provide a roadmap for the upcoming fall semester.`
    },
    {
      id: '4',
      title: 'STEM vs. STEAM: The Value of Arts in Engineering',
      excerpt: 'Why top-tier tech companies are increasingly looking for engineers with a background in design and philosophy.',
      author: 'Julian Thorne',
      date: 'Mar 10, 2024',
      category: 'education',
      readTime: '5 min read',
      imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80',
      content: `Innovation happens at the intersection of technology and the liberal arts. We look at case studies from Apple, Figma, and Tesla where aesthetic sensibility drove technical breakthroughs.`
    }
  ];

  const categories = [
    { id: 'all', label: 'All Stories' },
    { id: 'tech', label: 'Tech & AI' },
    { id: 'education', label: 'Education' },
    { id: 'career', label: 'Career Growth' },
    { id: 'productivity', label: 'Productivity' }
  ];

  const handleSummarize = async (post: BlogPost) => {
    setIsSummarizing(true);
    setSummary(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Summarize this blog post into 3 high-impact bullet points for a busy student. 
        Title: ${post.title}
        Content: ${post.content || post.excerpt}`,
        config: {
          systemInstruction: "You are a concise educational analyst. Provide short, punchy summaries."
        }
      });
      setSummary(response.text || "Summary unavailable.");
    } catch (e) {
      console.error(e);
      setSummary("Could not generate AI summary at this time.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (selectedPost) {
    return (
      <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
        <button 
          onClick={() => { setSelectedPost(null); setSummary(null); }}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Feed
        </button>

        <img 
          src={selectedPost.imageUrl} 
          alt={selectedPost.title} 
          className="w-full h-80 object-cover rounded-3xl shadow-2xl border border-slate-800"
        />

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase rounded-full border border-blue-500/20">
              {selectedPost.category}
            </span>
            <span className="text-slate-500 text-sm flex items-center gap-1">
              <Calendar size={14} /> {selectedPost.date}
            </span>
            <span className="text-slate-500 text-sm flex items-center gap-1">
              <Clock size={14} /> {selectedPost.readTime}
            </span>
          </div>
          <h1 className="text-5xl font-outfit font-extrabold text-white leading-tight">{selectedPost.title}</h1>
          <div className="flex items-center gap-2 text-slate-300 font-medium">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-blue-500">
              {selectedPost.author[0]}
            </div>
            By {selectedPost.author}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8 border-t border-slate-800">
          <div className="lg:col-span-2 prose prose-invert prose-lg text-slate-300 leading-relaxed max-w-none">
            {selectedPost.content?.split('\n\n').map((para, i) => (
              <p key={i} className="mb-6">{para}</p>
            ))}
          </div>

          <aside className="space-y-6">
            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-3xl sticky top-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Sparkles size={18} className="text-blue-500" />
                  AI Summary
                </h3>
              </div>
              
              {summary ? (
                <div className="text-sm text-slate-400 space-y-3 animate-in fade-in">
                  {summary.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              ) : (
                <button 
                  onClick={() => handleSummarize(selectedPost)}
                  disabled={isSummarizing}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 transition-all rounded-xl text-sm font-bold text-white"
                >
                  {isSummarizing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  Generate Key Points
                </button>
              )}
            </div>
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-outfit font-bold text-slate-50">Educational Insights</h1>
          <p className="text-slate-400 mt-2">Expert perspectives on tech, productivity, and academic growth.</p>
        </div>
        <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2 w-full md:w-96">
          <Search size={20} className="text-slate-500" />
          <input 
            type="text" 
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-white w-full"
          />
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              activeCategory === cat.id 
                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post) => (
          <article 
            key={post.id} 
            className="group flex flex-col bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden hover:bg-slate-900 hover:border-blue-500/30 transition-all cursor-pointer"
            onClick={() => setSelectedPost(post)}
          >
            <div className="relative h-48 overflow-hidden">
              <img 
                src={post.imageUrl} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                alt={post.title} 
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-blue-400 uppercase rounded-lg border border-slate-800">
                  {post.category}
                </span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors leading-snug">
                {post.title}
              </h3>
              
              <p className="text-sm text-slate-400 line-clamp-3 mb-6 flex-1">
                {post.excerpt}
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-slate-800/50">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-blue-500">
                    {post.author[0]}
                  </div>
                  <span className="text-xs font-bold text-slate-300">{post.author}</span>
                </div>
                <ChevronRight size={18} className="text-slate-600 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </article>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-20">
          <BookOpen size={48} className="text-slate-800 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-400">No matching articles found</h3>
          <p className="text-slate-600 mt-1">Try adjusting your search or category filters.</p>
        </div>
      )}
    </div>
  );
};

export default Blogs;
