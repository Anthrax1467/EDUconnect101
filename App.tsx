
import React, { useState } from 'react';
import { EduView, UserRole, Institute, Region } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Community from './components/Community';
import Scholarships from './components/Scholarships';
import Academics from './components/Academics';
import TeacherPortal from './components/TeacherPortal';
import AIAdvisor from './components/AIAdvisor';
import Workshops from './components/Workshops';
import ResumeBuilder from './components/ResumeBuilder';
import ProjectLab from './components/ProjectLab';
import Blogs from './components/Blogs';
import FinanceHub from './components/FinanceHub';
import Login from './components/Login';
import InstitutePicker from './components/InstitutePicker';
import AbroadHub from './components/AbroadHub';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<EduView>(EduView.DASHBOARD);
  const [role, setRole] = useState<UserRole | null>(null);
  const [region, setRegion] = useState<Region>('nepal');
  const [isVerified, setIsVerified] = useState(false);
  const [selectedInstitute, setSelectedInstitute] = useState<Institute | null>(null);
  const [isAuth, setIsAuth] = useState(false);

  const handleLogin = (selectedRole: UserRole) => {
    setRole(selectedRole);
    if (selectedRole === 'guest') {
      setIsAuth(true);
      setCurrentView(EduView.BLOGS);
    }
  };

  const handleInstituteSelect = (inst: Institute) => {
    setSelectedInstitute(inst);
    setIsVerified(true);
    setIsAuth(true);
  };

  if (!role) {
    return <Login onSelectRole={handleLogin} />;
  }

  if (role !== 'guest' && !selectedInstitute) {
    return <InstitutePicker role={role} onSelect={handleInstituteSelect} />;
  }

  return (
    <div className="flex h-screen w-full bg-slate-950 overflow-hidden text-slate-100">
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        role={role}
        region={region}
        setRegion={setRegion}
        isVerified={isVerified}
        instituteName={selectedInstitute?.name || 'Guest Access'}
        onLogout={() => { setRole(null); setSelectedInstitute(null); setIsAuth(false); }}
      />
      
      <main className="flex-1 relative overflow-y-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="p-8 max-w-7xl mx-auto min-h-full flex flex-col">
          {currentView === EduView.DASHBOARD && (
            <Dashboard role={role} isVerified={isVerified} region={region} />
          )}
          
          {currentView === EduView.COMMUNITY && (
            <Community role={role} isVerified={isVerified} selectedInstitute={selectedInstitute} />
          )}

          {currentView === EduView.BLOGS && (
            <Blogs />
          )}
          
          {currentView === EduView.SCHOLARSHIPS && (
            <Scholarships role={role} />
          )}
          
          {currentView === EduView.ACADEMICS && (
            <Academics role={role} />
          )}

          {currentView === EduView.FINANCE && (
            <FinanceHub region={region} />
          )}

          {currentView === EduView.TEACHER_PORTAL && (
            <TeacherPortal />
          )}

          {currentView === EduView.AI_ADVISOR && (
            <AIAdvisor role={role} region={region} />
          )}

          {currentView === EduView.WORKSHOPS && (
            <Workshops />
          )}

          {currentView === EduView.RESUME && (
            <ResumeBuilder />
          )}

          {currentView === EduView.PROJECT_LAB && (
            <ProjectLab />
          )}

          {currentView === EduView.ABROAD_HUB && (
            <AbroadHub region={region} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
