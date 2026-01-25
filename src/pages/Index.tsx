import { useState } from 'react';
import { LandingPage } from '@/components/LandingPage';
import { Onboarding } from '@/components/Onboarding';
import { ProfessionalDashboard } from '@/components/ProfessionalDashboard';
import { PersonalDashboard } from '@/components/PersonalDashboard';
import { useProGuardState } from '@/hooks/useProGuardState';

type AppView = 'landing' | 'onboarding' | 'professional' | 'personal';

const Index = () => {
  const [view, setView] = useState<AppView>('landing');
  const proGuard = useProGuardState();

  const handleEnterPlatform = () => {
    setView('onboarding');
  };

  const handleSelectUser = (userId: string) => {
    proGuard.setCurrentUser(userId);
    setView('professional');
  };

  const handleLogout = () => {
    proGuard.setCurrentUser(null);
    setView('landing');
  };

  const handleSwitchToPersonal = () => {
    proGuard.setMode('personal');
    setView('personal');
  };

  const handleSwitchToProfessional = () => {
    proGuard.setMode('professional');
    setView('professional');
  };

  const handleAddPersonalConnection = (connection: Parameters<typeof proGuard.addPersonalConnection>[1]) => {
    if (proGuard.currentUser) {
      proGuard.addPersonalConnection(proGuard.currentUser.id, connection);
    }
  };

  return (
    <>
      {view === 'landing' && (
        <LandingPage onEnterPlatform={handleEnterPlatform} />
      )}
      
      {view === 'onboarding' && (
        <Onboarding 
          users={proGuard.users} 
          onSelectUser={handleSelectUser} 
        />
      )}
      
      {view === 'professional' && proGuard.currentUser && (
        <ProfessionalDashboard
          currentUser={proGuard.currentUser}
          users={proGuard.users}
          companies={proGuard.companies}
          projects={proGuard.projects}
          violations={proGuard.violations}
          auditResults={proGuard.auditResults}
          isAuditing={proGuard.isAuditing}
          companyStats={proGuard.companyStats}
          onRunAudit={proGuard.runIntegrityAudit}
          onUpdateProjectStatus={proGuard.updateProjectStatus}
          onSwitchToPersonal={handleSwitchToPersonal}
          onLogout={handleLogout}
        />
      )}
      
      {view === 'personal' && proGuard.currentUser && (
        <PersonalDashboard
          currentUser={proGuard.currentUser}
          onAddConnection={handleAddPersonalConnection}
          onSwitchToProfessional={handleSwitchToProfessional}
          onLogout={handleLogout}
        />
      )}
    </>
  );
};

export default Index;
