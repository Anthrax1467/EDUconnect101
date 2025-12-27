
import React, { useState } from 'react';
import { 
  Search, 
  Star, 
  Clock, 
  Tag, 
  ChevronRight, 
  MapPin, 
  ShieldCheck, 
  User, 
  Navigation, 
  Filter,
  MessageCircle,
  Award,
  Globe,
  Monitor,
  Layers,
  BarChart,
  ListChecks,
  Hourglass,
  Store,
  TrendingUp,
  PlusCircle,
  Wallet,
  ArrowUpRight,
  Banknote,
  Smartphone,
  CheckCircle,
  MoreVertical,
  Users
} from 'lucide-react';

type DeliveryMode = 'Physical' | 'Online' | 'Hybrid';
type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

interface LocalCourse {
  id: string;
  title: string;
  category: 'tech' | 'life-skill' | 'business' | 'arts' | 'cyber';
  description: string;
  rating: number;
  reviewCount: number;
  price: number; // Numeric for math in creator mode
  distance: string;
  mode: DeliveryMode;
  difficulty: Difficulty;
  length: string;
  prerequisites: string[];
  teacher: {
    name: string;
    id: string;
    credentials: string;
  };
  nextSession: string;
}

const Workshops: React.FC = () => {
  const [viewMode, setViewMode] = useState<'student' | 'creator'>('student');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCat, setActiveCat] = useState('all');
  const [activeMode, setActiveMode] = useState<'all' | DeliveryMode>('all');

  // Define the categories used in the filter UI
  const categories = [
    { id: 'all', label: 'All Courses' },
    { id: 'tech', label: 'Tech' },
    { id: 'life-skill', label: 'Life Skills' },
    { id: 'business', label: 'Business' },
    { id: 'arts', label: 'Arts' },
    { id: 'cyber', label: 'Cyber' }
  ];

  const courses: LocalCourse[] = [
    { 
      id: '1', 
      title: 'Ethical Hacking & Network Defense', 
      category: 'cyber', 
      description: 'A hands-on workshop in local network security and identity protection using industry-standard tools.', 
      rating: 4.9, 
      reviewCount: 156, 
      price: 0, 
      distance: '0.8 km',
      mode: 'Hybrid',
      difficulty: 'Intermediate',
      length: '12 Weeks',
      prerequisites: ['Basic Networking', 'Linux Fundamentals'],
      teacher: { name: 'Prof. Aryan Koirala', id: 't1', credentials: 'Cybersecurity Analyst at NEA' },
      nextSession: 'Tomorrow, 10:00' 
    },
    { 
      id: '2', 
      title: 'Financial Literacy for Gen Z', 
      category: 'life-skill', 
      description: 'Practical budgeting, savings, and investment strategies tailored for the modern economy.', 
      rating: 4.7, 
      reviewCount: 92, 
      price: 500, 
      distance: '2.4 km',
      mode: 'Online',
      difficulty: 'Beginner',
      length: '4 Weeks',
      prerequisites: ['No prior knowledge required'],
      teacher: { name: 'Ms. Sunita Sharma', id: 't2', credentials: 'Chartered Accountant' },
      nextSession: 'Sat, Mar 25' 
    },
    { 
      id: '3', 
      title: 'Visual Identity & Branding', 
      category: 'arts', 
      description: 'Master the tools of modern design to build your personal brand and portfolio.', 
      rating: 5.0, 
      reviewCount: 210, 
      price: 1200, 
      distance: '1.2 km',
      mode: 'Physical',
      difficulty: 'Advanced',
      length: '8 Weeks',
      prerequisites: ['Adobe Suite Basics', 'Portfolio Draft'],
      teacher: { name: 'Julian Thorne', id: 't3', credentials: 'Senior Creative Director' },
      nextSession: 'Weekly' 
    }
  ];

  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.teacher.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = activeCat === 'all' || c.category === activeCat;
    const matchesMode = activeMode === 'all' || c.mode === activeMode;
    return matchesSearch && matchesCat && matchesMode;
  });

  const getDifficultyColor = (diff: Difficulty) => {
    switch(diff) {
      case 'Beginner': return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10';
      case 'Intermediate': return 'text-blue-400 border-blue-500/20 bg-blue-500/10';
      case 'Advanced': return 'text-rose-400 border-rose-500/20 bg-rose-500/10';
      default: return 'text-slate-400 border-slate-500/20 bg-slate-500/10';
    }
  };

  const renderCreatorPortal = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Creator Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-3xl shadow-xl shadow-indigo-900/20 col-span-1 md:col-span-2 relative overflow-hidden group">
          <TrendingUp className="absolute right-[-20px] top-[-20px] w-40 h-40 opacity-10 group-hover:scale-110 transition-transform" />
          <p className="text-white/70 text-xs font-bold uppercase tracking-widest">Total Course Earnings</p>
          <p className="text-4xl font-bold text-white mt-2">Rs. 84,250</p>
          <div className="mt-4 flex items-center gap-2">
            <span className="px-2 py-0.5 bg-white/20 text-white text-[10px] rounded font-bold">+12% from last month</span>
          </div>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
          <Users className="text-blue-500 mb-2" size={24} />
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Active Students</p>
          <p className="text-2xl font-bold text-slate-100 mt-1">456</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
          <Star className="text-amber-500 mb-2" size={24} />
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Avg. Course Rating</p>
          <p className="text-2xl font-bold text-slate-100 mt-1">4.92</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-100">My Listed Courses</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-xs font-bold text-white transition-all">
              <PlusCircle size={16} /> List New Course
            </button>
          </div>

          <div className="space-y-4">
            {courses.slice(0, 2).map(c => (
              <div key={c.id} className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl flex items-center justify-between group hover:border-blue-500/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-blue-500 font-bold">
                    {c.title[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100">{c.title}</h3>
                    <p className="text-xs text-slate-500">Listed: Mar 10 • {c.price === 0 ? 'Free' : `Rs. ${c.price}`}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-white">128 Enrolled</p>
                    <p className="text-[10px] text-emerald-400 font-bold uppercase">Trending</p>
                  </div>
                  <button className="p-2 text-slate-600 hover:text-white"><MoreVertical size={18}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <Wallet className="text-emerald-500" size={18} />
              Nepali Payment Setup
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-400">Primary Bank</span>
                  <CheckCircle size={14} className="text-emerald-500" />
                </div>
                <p className="text-sm font-bold text-white">Nabil Bank Ltd.</p>
                <p className="text-[10px] text-slate-600 uppercase">A/C: ****2081</p>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-400">Digital Wallet</span>
                  <div className="flex gap-1">
                    <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 text-[8px] font-bold rounded">eSewa</span>
                    <span className="px-1.5 py-0.5 bg-purple-500/10 text-purple-500 text-[8px] font-bold rounded">Khalti</span>
                  </div>
                </div>
                <p className="text-sm font-bold text-white">9841******</p>
                <p className="text-[10px] text-slate-600 uppercase tracking-widest">KYC Verified</p>
              </div>

              <button className="w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-300 transition-all flex items-center justify-center gap-2">
                <ArrowUpRight size={14} /> Payout Settings
              </button>
            </div>
          </div>

          <div className="p-6 bg-blue-600/5 border border-blue-500/10 rounded-3xl">
            <h4 className="text-xs font-bold text-blue-400 uppercase mb-2">Creator Insights</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your "Ethical Hacking" course is seeing 20% higher engagement from students in Kathmandu Valley. Consider a physical workshop in Baneshwor for a 2x income boost.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-outfit font-bold text-slate-50 flex items-center gap-3">
            {viewMode === 'student' ? <Globe className="text-blue-500" /> : <Store className="text-indigo-500" />}
            {viewMode === 'student' ? 'Courses Near Me' : 'Course Creator Hub'}
          </h1>
          <p className="text-slate-400">
            {viewMode === 'student' 
              ? 'Find elite local workshops or virtual masterclasses.' 
              : 'Empowering independent educators to list, teach, and earn locally.'}
          </p>
        </div>
        
        <div className="flex gap-2 p-1 bg-slate-900 border border-slate-800 rounded-2xl">
          <button 
            onClick={() => setViewMode('student')}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'student' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300'}`}
          >
            I'm a Student
          </button>
          <button 
            onClick={() => setViewMode('creator')}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'creator' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-300'}`}
          >
            I'm a Creator
          </button>
        </div>
      </header>

      {viewMode === 'creator' ? renderCreatorPortal() : (
        <>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <div className="relative group flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Search courses or expert creators..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map(c => (
                  <button 
                    key={c.id} 
                    onClick={() => setActiveCat(c.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${activeCat === c.id ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-500'}`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCourses.map(course => (
              <div key={course.id} className="group bg-slate-900/40 border border-slate-800 rounded-3xl p-8 hover:bg-slate-900 hover:border-blue-500/30 transition-all flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-[10px] font-bold uppercase tracking-widest border border-blue-500/20">
                      <Tag size={12} />
                      {course.category}
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getDifficultyColor(course.difficulty)}`}>
                      <BarChart size={12} />
                      {course.difficulty}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1 text-amber-500 mb-1">
                      <Star size={16} fill="currentColor" />
                      <span className="font-bold text-slate-200">{course.rating}</span>
                    </div>
                    <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{course.reviewCount} Enrolled</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors leading-tight">{course.title}</h3>
                  <div className="flex items-center gap-4 text-slate-500">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest">
                      <Monitor size={14}/> {course.mode}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest">
                      <Hourglass size={14} className="text-indigo-400" />
                      {course.length}
                    </div>
                  </div>
                </div>

                <p className="text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed">{course.description}</p>

                <div className="mb-6 space-y-2">
                   <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                     <ListChecks size={14} className="text-blue-500" />
                     Prerequisites:
                   </div>
                   <div className="flex flex-wrap gap-2">
                     {course.prerequisites.map((pre, i) => (
                       <span key={i} className="px-2 py-1 bg-slate-950 border border-slate-800 rounded-md text-[10px] text-slate-400">{pre}</span>
                     ))}
                   </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-950/50 rounded-2xl border border-slate-800 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-blue-500">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white flex items-center gap-1">
                      {course.teacher.name}
                      <ShieldCheck size={14} className="text-blue-400" />
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{course.teacher.credentials}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-4 bg-slate-950/30 rounded-2xl border border-slate-800/50">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Fee & Settlement</p>
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase">
                      <Banknote size={14} />
                      {course.price === 0 ? 'Free Entry' : `Rs. ${course.price}`}
                    </div>
                  </div>
                  <div className="p-4 bg-slate-950/30 rounded-2xl border border-slate-800/50">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Local Proximity</p>
                    <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase">
                      <MapPin size={14} />
                      {course.distance}
                    </div>
                  </div>
                </div>

                <div className="mt-auto space-y-3">
                  <button className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-blue-600/20">
                    Enroll via eSewa / Khalti
                    <ChevronRight size={18} />
                  </button>
                  <p className="text-center text-[10px] text-slate-500 uppercase tracking-widest">Secure Nepali Gateway Integrated</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Workshops;
