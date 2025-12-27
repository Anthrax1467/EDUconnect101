
import React, { useState, useMemo } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Classroom, StudentReport, FacultyMember, CalendarEvent } from '../types';
import { 
  Upload, 
  Mail, 
  Users, 
  FileText, 
  Send, 
  Building, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Loader2, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  Search,
  BookOpen,
  ClipboardList,
  FlaskConical,
  PenTool,
  Save,
  ArrowLeft,
  CalendarPlus,
  Video,
  X,
  ShieldCheck,
  Megaphone,
  UserPlus,
  Eye,
  Filter,
  /* Added missing Plus icon */
  Plus
} from 'lucide-react';

const TeacherPortal: React.FC = () => {
  const [activeView, setActiveView] = useState<'overview' | 'classes' | 'student-report' | 'faculty-calendar'>('overview');
  const [selectedInstitute, setSelectedInstitute] = useState('Central High School');
  const [selectedClass, setSelectedClass] = useState<Classroom | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentReport | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [facultySearch, setFacultySearch] = useState('');
  
  const [inviteDraft, setInviteDraft] = useState({
    title: '',
    body: '',
    recipients: { students: true, parents: true }
  });
  
  // Mock Institutes mapping for searching
  const instituteMap: Record<string, string> = {
    'Central High School': 'inst1',
    'Kathmandu Model College': 'inst2',
    'St. Xavier’s Academy': 'inst3'
  };

  const currentInstituteId = instituteMap[selectedInstitute];

  // Mock Faculty Directory - Multi-institute for privacy testing
  const [allFaculty] = useState<FacultyMember[]>([
    { id: 'f1', name: 'Dr. Sarah Chen', department: 'Physics', instituteId: 'inst1' },
    { id: 'f2', name: 'Marcus Rivera', department: 'Mathematics', instituteId: 'inst1' },
    { id: 'f3', name: 'Elena Gilbert', department: 'Chemistry', instituteId: 'inst1' },
    { id: 'f4', name: 'Bijay Tamang', department: 'Local History', instituteId: 'inst2' },
    { id: 'f5', name: 'Priya Sharma', department: 'IT', instituteId: 'inst2' },
    { id: 'f6', name: 'Julian Thorne', department: 'Arts', instituteId: 'inst3' },
  ]);

  // Scoped Faculty - Only those in the current institute
  const scopedFaculty = useMemo(() => 
    allFaculty.filter(f => f.instituteId === currentInstituteId),
  [allFaculty, currentInstituteId]);

  const [classes] = useState<Classroom[]>([
    { id: 'c1', name: 'Grade 11 - A', subject: 'Quantum Physics', studentCount: 32, schedule: 'Mon/Wed/Fri', timeframe: 'semester' },
    { id: 'c2', name: 'Grade 12 - B', subject: 'Advanced Mathematics', studentCount: 28, schedule: 'Tue/Thu', timeframe: 'semester' },
    { id: 'c3', name: 'Science Club', subject: 'Applied Robotics', studentCount: 15, schedule: 'Saturdays', timeframe: 'month' },
    { id: 'c4', name: 'NEB Prep 2081', subject: 'Local Nepali History', studentCount: 45, schedule: 'Daily', timeframe: 'year' },
  ]);

  const [studentReports, setStudentReports] = useState<StudentReport[]>([
    { studentId: 's1', studentName: 'Alex Johnson', writing: 85, reading: 90, research: 75, lab: 92, quizzes: 88 },
    { studentId: 's2', studentName: 'Priya Sharma', writing: 70, reading: 82, research: 95, lab: 88, quizzes: 74 },
    { studentId: 's3', studentName: 'Bijay Tamang', writing: 92, reading: 88, research: 82, lab: 70, quizzes: 95 },
  ]);

  const generateInviteDraft = async () => {
    setAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Draft a professional virtual meeting invitation for ${selectedClass?.name} - ${selectedClass?.subject}. 
      The invite is for both students and verified parents. 
      Subject: Urgent Academic Review & Project Roadmap. 
      Include a polite greeting, a reason for the meeting (progress update), and a placeholder for the link. 
      If the institute is in Nepal, use a professional but warm tone. Return in JSON-like structure: Title | Body.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      
      const text = response.text || '';
      const parts = text.split('|');
      setInviteDraft(prev => ({
        ...prev,
        title: parts[0]?.trim() || 'Urgent Academic Meeting Invite',
        body: parts[1]?.trim() || text
      }));
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  const generateAIReport = async (student: StudentReport) => {
    if (!student) return;
    setAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Provide high-quality qualitative feedback for a student named ${student.studentName} based on these academic scores:
      Writing: ${student.writing}/100, Reading: ${student.reading}/100, Research: ${student.research}/100, Lab Work: ${student.lab}/100, Quizzes: ${student.quizzes}/100.
      Generate professional, empathetic feedback in 3-4 sentences.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      
      const feedback = response.text || "Feedback generation failed.";
      setSelectedStudent(prev => prev ? { ...prev, feedback } : null);
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSendInvite = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setShowInviteModal(false);
      alert(`Meeting invite broadcasted to ${selectedClass?.studentCount} students and all verified parents!`);
    }, 2000);
  };

  const handleSaveReport = () => {
    if (selectedStudent) {
      setStudentReports(prev => prev.map(s => s.studentId === selectedStudent.studentId ? selectedStudent : s));
      setActiveView('classes');
    }
  };

  const renderOverview = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
      {/* Faculty Quick Sync */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="text-blue-500" />
            <h2 className="text-xl font-bold text-slate-100">Faculty Sync</h2>
          </div>
          <button onClick={() => setActiveView('faculty-calendar')} className="text-xs font-bold text-blue-500 hover:underline">Coordination Hub</button>
        </div>
        <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl mb-6">
          <p className="text-xs text-blue-300">
            You can only see faculty from <span className="font-bold underline">{selectedInstitute}</span>. Cross-institute lookup is disabled for security.
          </p>
        </div>
        <div className="space-y-3">
          {scopedFaculty.slice(0, 3).map(f => (
            <div key={f.id} className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-blue-400">{f.name[0]}</div>
                <div>
                  <p className="text-sm font-bold text-slate-200">{f.name}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">{f.department}</p>
                </div>
              </div>
              <button className="p-2 text-slate-600 hover:text-blue-500 transition-colors">
                <Eye size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Class Access */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Users className="text-emerald-500" />
            <h2 className="text-xl font-bold text-slate-100">Active Classes</h2>
          </div>
          <button onClick={() => setActiveView('classes')} className="text-xs font-bold text-blue-500 hover:underline">See All</button>
        </div>
        <div className="space-y-3">
          {classes.slice(0, 3).map(c => (
            <button 
              key={c.id} 
              onClick={() => { setSelectedClass(c); setActiveView('classes'); }}
              className="w-full flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-2xl hover:bg-slate-900 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-blue-500 font-bold">{c.name[0]}</div>
                <div className="text-left">
                  <p className="font-bold text-slate-200">{c.subject}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{c.studentCount} Students • {c.schedule}</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-700 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFacultyCalendar = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => setActiveView('overview')} className="p-2 hover:bg-slate-900 rounded-xl text-slate-500 hover:text-white transition-all"><ArrowLeft size={20} /></button>
          <div>
            <h2 className="text-2xl font-bold text-white">Faculty Coordination Hub</h2>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Scoped to {selectedInstitute}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-400">
            <Filter size={14} /> Departments
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-xl text-xs font-bold text-white shadow-lg shadow-blue-600/20">
            <Plus size={14} /> Schedule Meeting
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Faculty Sidebar */}
        <aside className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 h-fit">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Users size={16} /> Faculty Directory
          </h3>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
            <input 
              type="text" 
              placeholder={`Search ${selectedInstitute}...`}
              value={facultySearch}
              onChange={(e) => setFacultySearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs text-white outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            {scopedFaculty
              .filter(f => f.name.toLowerCase().includes(facultySearch.toLowerCase()))
              .map(f => (
                <div key={f.id} className="flex items-center justify-between p-3 bg-slate-950/30 border border-slate-800/50 rounded-xl group hover:border-blue-500/30 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-blue-400">{f.name[0]}</div>
                    <div>
                      <p className="text-xs font-bold text-slate-200">{f.name}</p>
                      <p className="text-[10px] text-slate-500">{f.department}</p>
                    </div>
                  </div>
                  <input type="checkbox" className="w-3 h-3 rounded bg-slate-800 border-slate-700 checked:bg-blue-600" />
                </div>
              ))}
          </div>
        </aside>

        {/* Main Calendar View */}
        <div className="lg:col-span-3 bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/20">
            <div className="flex gap-4">
              <button className="text-sm font-bold text-blue-400">Week</button>
              <button className="text-sm font-bold text-slate-500 hover:text-white transition-colors">Month</button>
            </div>
            <h3 className="font-bold text-slate-200">March 18 - 24, 2024</h3>
            <div className="flex gap-2">
              <button className="p-2 bg-slate-950 rounded-lg text-slate-400 hover:text-white">←</button>
              <button className="p-2 bg-slate-950 rounded-lg text-slate-400 hover:text-white">→</button>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-7 divide-x divide-slate-800 min-h-[500px]">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="p-2 space-y-2">
                <p className="text-[10px] font-bold text-slate-600 text-center mb-4 uppercase tracking-widest">{day}</p>
                {day === 'Mon' && (
                  <>
                    <div className="p-2 bg-blue-600/20 border-l-2 border-blue-600 rounded text-[10px]">
                      <p className="font-bold text-blue-400">Quantum Physics</p>
                      <p className="text-slate-500">09:00 - 10:30</p>
                    </div>
                    <div className="p-2 bg-emerald-600/20 border-l-2 border-emerald-600 rounded text-[10px]">
                      <p className="font-bold text-emerald-400">Faculty Lunch</p>
                      <p className="text-slate-500">12:00 - 13:00</p>
                    </div>
                  </>
                )}
                {day === 'Wed' && (
                  <div className="p-2 bg-purple-600/20 border-l-2 border-purple-600 rounded text-[10px]">
                    <p className="font-bold text-purple-400">Curriculum Sync</p>
                    <p className="text-slate-500">14:00 - 15:30</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderClassManagement = () => (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => setActiveView('overview')} className="p-2 hover:bg-slate-900 rounded-xl text-slate-500 hover:text-white transition-all"><ArrowLeft size={20} /></button>
          <div>
            <h2 className="text-2xl font-bold text-white">Classroom Directory</h2>
            {selectedClass && <p className="text-blue-400 text-sm font-medium">{selectedClass.name} — {selectedClass.subject}</p>}
          </div>
        </div>
        <button 
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-bold text-white shadow-xl shadow-blue-600/20 transition-all active:scale-95"
        >
          <CalendarPlus size={18} />
          Broadcast Meeting Invite
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['Year', 'Semester', 'Month', 'Week'].map((t) => (
          <button key={t} className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl text-center text-xs font-bold text-slate-400 hover:text-white hover:border-blue-500 transition-all uppercase tracking-widest">
            {t}ly View
          </button>
        ))}
      </div>

      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/20">
          <div className="flex items-center gap-3">
            <Search className="text-slate-500" size={18} />
            <input type="text" placeholder="Search students..." className="bg-transparent border-none outline-none text-sm text-white w-64" />
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-blue-600/10 text-blue-500 rounded-lg text-[10px] font-bold uppercase border border-blue-500/20">Active Session</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-950/50">
                <th className="p-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Student Name</th>
                <th className="p-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Avg. Performance</th>
                <th className="p-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Attendance</th>
                <th className="p-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Last Report</th>
                <th className="p-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {studentReports.map(s => (
                <tr key={s.studentId} className="hover:bg-slate-900/80 transition-all group">
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-blue-500 text-xs">{s.studentName[0]}</div>
                      <span className="font-bold text-slate-200">{s.studentName}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: `${(s.writing + s.reading + s.quizzes) / 3}%` }} />
                      </div>
                      <span className="text-xs font-bold text-slate-400">{Math.round((s.writing + s.reading + s.quizzes) / 3)}%</span>
                    </div>
                  </td>
                  <td className="p-6 text-sm text-slate-400">94%</td>
                  <td className="p-6 text-sm text-slate-500">2 days ago</td>
                  <td className="p-6 text-right">
                    <button 
                      onClick={() => { setSelectedStudent(s); setActiveView('student-report'); }}
                      className="px-4 py-2 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/5"
                    >
                      Open Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Broadcast Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <Megaphone className="text-blue-500" />
                Bulk Meeting Invite
              </h2>
              <button onClick={() => setShowInviteModal(false)} className="text-slate-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="flex items-center gap-6 p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${inviteDraft.recipients.students ? 'bg-blue-600 border-blue-600' : 'border-slate-700'}`}>
                    {inviteDraft.recipients.students && <CheckCircle2 size={14} className="text-white" />}
                    <input type="checkbox" className="hidden" checked={inviteDraft.recipients.students} onChange={() => setInviteDraft(prev => ({ ...prev, recipients: { ...prev.recipients, students: !prev.recipients.students } }))} />
                  </div>
                  <span className="text-sm font-bold text-slate-300">All Students ({selectedClass?.studentCount})</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${inviteDraft.recipients.parents ? 'bg-emerald-600 border-emerald-600' : 'border-slate-700'}`}>
                    {inviteDraft.recipients.parents && <ShieldCheck size={14} className="text-white" />}
                    {/* Fixed duplicate property 'parents' and incorrect property access in onChange */}
                    <input type="checkbox" className="hidden" checked={inviteDraft.recipients.parents} onChange={() => setInviteDraft(prev => ({ ...prev, recipients: { ...prev.recipients, parents: !prev.recipients.parents } }))} />
                  </div>
                  <span className="text-sm font-bold text-slate-300">All Verified Parents</span>
                </label>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Message Draft</label>
                  <button 
                    onClick={generateInviteDraft}
                    disabled={aiLoading}
                    className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest"
                  >
                    {aiLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                    {inviteDraft.body ? 'Re-draft with AI' : 'Magic Draft Invite'}
                  </button>
                </div>
                
                <input 
                  type="text"
                  placeholder="Invite Title (e.g., Parent-Teacher Quarterly Review)"
                  value={inviteDraft.title}
                  onChange={(e) => setInviteDraft(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:ring-2 focus:ring-blue-500/50 outline-none"
                />
                
                <textarea 
                  placeholder="Invite details, agenda, and meeting links..."
                  value={inviteDraft.body}
                  onChange={(e) => setInviteDraft(prev => ({ ...prev, body: e.target.value }))}
                  className="w-full h-40 bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 focus:ring-2 focus:ring-blue-500/50 outline-none resize-none"
                />
              </div>
            </div>

            <div className="p-6 bg-slate-950/50 border-t border-slate-800 flex justify-end gap-4">
              <button 
                onClick={() => setShowInviteModal(false)}
                className="px-6 py-2 text-slate-500 font-bold hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSendInvite}
                disabled={isSending || !inviteDraft.title || !inviteDraft.body}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-600 rounded-xl font-bold text-white transition-all shadow-xl shadow-blue-600/20 flex items-center gap-2"
              >
                {isSending ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Broadcasting...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Send Invitation
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderStudentReport = () => (
    <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in-95 duration-500">
      <div className="flex items-center justify-between">
        <button onClick={() => setActiveView('classes')} className="flex items-center gap-2 text-slate-500 hover:text-white transition-all">
          <ArrowLeft size={20} /> Back to Class
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white uppercase text-xl">{selectedStudent?.studentName[0]}</div>
          <div>
            <h3 className="text-xl font-bold text-white">{selectedStudent?.studentName}</h3>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Academic Assessment Hub</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-6">
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <ClipboardList size={18} className="text-blue-500" />
            Performance Scoring
          </h4>
          
          {[
            { id: 'writing', label: 'Writing Skills', icon: PenTool, color: 'blue' },
            { id: 'reading', label: 'Reading Comp.', icon: BookOpen, color: 'emerald' },
            { id: 'research', label: 'Research Depth', icon: Search, color: 'purple' },
            { id: 'lab', label: 'Laboratory Work', icon: FlaskConical, color: 'amber' },
            { id: 'quizzes', label: 'Quizzes & Tests', icon: ClipboardList, color: 'red' },
          ].map((metric) => (
            <div key={metric.id} className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-500 flex items-center gap-2">
                  <metric.icon size={14} /> {metric.label}
                </span>
                <span className="text-white">{(selectedStudent as any)?.[metric.id]} / 100</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={(selectedStudent as any)?.[metric.id]} 
                onChange={(e) => setSelectedStudent(prev => prev ? { ...prev, [metric.id]: parseInt(e.target.value) } : null)}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform"><Sparkles size={40} className="text-blue-500" /></div>
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Sparkles size={18} className="text-blue-500" />
              AI Performance Feedback
            </h4>
            
            {selectedStudent?.feedback ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                <p className="text-slate-300 leading-relaxed italic">"{selectedStudent.feedback}"</p>
                <button 
                  onClick={() => generateAIReport(selectedStudent)}
                  disabled={aiLoading}
                  className="text-[10px] font-bold text-blue-500 hover:text-blue-400 flex items-center gap-1 uppercase tracking-widest"
                >
                  {aiLoading ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                  Re-generate Feedback
                </button>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-slate-500 mb-6">Generate high-trust qualitative feedback using Gemini AI based on current scores.</p>
                <button 
                  onClick={() => generateAIReport(selectedStudent!)}
                  disabled={aiLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 transition-all rounded-xl text-sm font-bold text-white shadow-xl shadow-blue-600/20"
                >
                  {aiLoading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                  Generate Magic Report
                </button>
              </div>
            )}
          </div>

          <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-3xl p-6">
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Saving this report will instantly sync the student's Academic Progress on their dashboard and notify parents via the Parent Hub.
            </p>
            <button 
              onClick={handleSaveReport}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-600/10"
            >
              <Save size={18} />
              Finalize & Publish Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-outfit font-bold text-slate-50">Teacher Control Center</h1>
          <p className="text-slate-400 mt-2">Managing {selectedInstitute} Academic Year 2024</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl">
            <Building size={18} className="text-blue-500" />
            <select 
              value={selectedInstitute} 
              onChange={(e) => setSelectedInstitute(e.target.value)}
              className="bg-transparent text-sm font-bold text-slate-200 outline-none cursor-pointer"
            >
              <option className="bg-slate-900">Central High School</option>
              <option className="bg-slate-900">Kathmandu Model College</option>
              <option className="bg-slate-900">St. Xavier’s Academy</option>
            </select>
          </div>
        </div>
      </header>

      {activeView === 'overview' && renderOverview()}
      {activeView === 'classes' && renderClassManagement()}
      {activeView === 'student-report' && renderStudentReport()}
      {activeView === 'faculty-calendar' && renderFacultyCalendar()}
    </div>
  );
};

// Simple Refresh Icon for re-generating
const RefreshCw: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M3 21v-5h5" />
  </svg>
);

export default TeacherPortal;
