import { useState, useTransition } from 'react';
import { ScreenType, Patient, AiSearchResult, MedicalRecord } from './types';
import { DEMO_PATIENTS, CURRENT_DOCTOR } from './data/patientsData';
import { searchPatientRecords } from './services/medicalSearchService';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { SplashScreen } from './components/screens/SplashScreen';
import { LoginScreen } from './components/screens/LoginScreen';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { PatientDashboardScreen } from './components/screens/PatientDashboardScreen';
import { PatientSearchScreen } from './components/screens/PatientSearchScreen';
import { PatientProfileScreen } from './components/screens/PatientProfileScreen';
import { VoiceSearchScreen } from './components/screens/VoiceSearchScreen';
import { AiResultScreen } from './components/screens/AiResultScreen';
import { EvidenceViewScreen } from './components/screens/EvidenceViewScreen';
import { TimelineScreen } from './components/screens/TimelineScreen';
import { EmergencyScreen } from './components/screens/EmergencyScreen';
import { RecordsScreen } from './components/screens/RecordsScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';

export default function App() {
  const [screen, setScreen] = useState<ScreenType>('splash');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<'patient' | 'doctor'>('patient');
  const [patients] = useState<Patient[]>(DEMO_PATIENTS);
  const [activePatientId, setActivePatientId] = useState<string>('AST-10021'); // Aarav Sharma
  const [activeSearchResult, setActiveSearchResult] = useState<AiSearchResult | null>(null);
  const [activeEvidenceRecord, setActiveEvidenceRecord] = useState<MedicalRecord | null>(null);
  const [voiceQueryDraft, setVoiceQueryDraft] = useState<string>('');
  const [, startTransition] = useTransition();

  const isPatientMode = userRole === 'patient';
  // In patient mode, active patient is strictly locked to Aarav Sharma (AST-10021)
  const activePatient = isPatientMode
    ? DEMO_PATIENTS[0]
    : (patients.find((p) => p.id === activePatientId) || patients[0]);

  const handleNavigate = (newScreen: ScreenType) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    startTransition(() => {
      // In patient mode, prevent accessing the multi-patient search screen
      if (userRole === 'patient' && newScreen === 'patient_search') {
        setScreen('patient_profile');
        return;
      }
      setScreen(newScreen);
    });
  };

  const handleSelectPatient = (patientId: string) => {
    if (userRole === 'patient') {
      setActivePatientId('AST-10021');
      return;
    }
    setActivePatientId(patientId);
  };

  const handleLoginSuccess = (role: 'patient' | 'doctor') => {
    setUserRole(role);
    setIsAuthenticated(true);
    if (role === 'patient') {
      setActivePatientId('AST-10021');
      handleNavigate('patient_dashboard');
    } else {
      handleNavigate('dashboard');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    handleNavigate('login');
  };

  // Main voice query execution workflow: Doctor speaks -> AI searches -> Evidence
  const handleSubmitVoiceQuery = (queryText: string) => {
    const result = searchPatientRecords(queryText, activePatient);
    setActiveSearchResult(result);
    setVoiceQueryDraft('');
    handleNavigate('ai_result');
  };

  // Quick ask from suggestion cards or Emergency screen
  const handleQuickVoiceAsk = (questionText: string) => {
    setVoiceQueryDraft(questionText);
    handleSubmitVoiceQuery(questionText);
  };

  // Direct evidence inspection
  const handleViewEvidence = (recordId: string) => {
    // Find record in active patient's records
    const record =
      activePatient.records.find((r) => r.id === recordId) ||
      activePatient.records[0] ||
      null;

    setActiveEvidenceRecord(record);
    handleNavigate('evidence_view');
  };

  // 1. Splash Screen
  if (screen === 'splash') {
    return <SplashScreen onFinish={() => handleNavigate('login')} />;
  }

  // 2. Login Screen
  if (screen === 'login' || !isAuthenticated) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans selection:bg-teal-500/20 selection:text-teal-900">
      {/* Top Clinical Navigation Bar */}
      <Header
        currentScreen={screen}
        onNavigate={handleNavigate}
        activePatient={activePatient}
        allPatients={isPatientMode ? [DEMO_PATIENTS[0]] : patients}
        onSelectPatient={handleSelectPatient}
        doctor={CURRENT_DOCTOR}
        userRole={userRole}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {screen === 'patient_dashboard' && (
          <PatientDashboardScreen
            patient={activePatient}
            onNavigate={handleNavigate}
            onOpenRecord={handleViewEvidence}
            onVoiceSearch={handleQuickVoiceAsk}
            onSwitchToDoctorView={() => {
              setUserRole('doctor');
              handleNavigate('dashboard');
            }}
          />
        )}

        {screen === 'dashboard' && (
          <DashboardScreen
            doctor={CURRENT_DOCTOR}
            activePatient={activePatient}
            recentPatients={patients}
            onNavigate={handleNavigate}
            onSelectPatient={handleSelectPatient}
            onQuickVoiceAsk={handleQuickVoiceAsk}
          />
        )}

        {screen === 'patient_search' && (
          <PatientSearchScreen
            patients={patients}
            activePatientId={activePatientId}
            onSelectPatient={handleSelectPatient}
            onNavigate={handleNavigate}
          />
        )}

        {screen === 'patient_profile' && (
          <PatientProfileScreen
            patient={activePatient}
            onNavigate={handleNavigate}
            onOpenRecord={handleViewEvidence}
            onQuickVoiceAsk={handleQuickVoiceAsk}
          />
        )}

        {screen === 'voice_search' && (
          <VoiceSearchScreen
            patient={activePatient}
            onNavigate={handleNavigate}
            onSubmitVoiceQuery={handleSubmitVoiceQuery}
            initialQuery={voiceQueryDraft}
          />
        )}

        {screen === 'ai_result' && activeSearchResult && (
          <AiResultScreen
            result={activeSearchResult}
            patient={activePatient}
            onNavigate={handleNavigate}
            onViewEvidence={handleViewEvidence}
            onAskNewQuestion={() => {
              setVoiceQueryDraft('');
              handleNavigate('voice_search');
            }}
          />
        )}

        {screen === 'evidence_view' && (
          <EvidenceViewScreen
            record={activeEvidenceRecord}
            patient={activePatient}
            lastSearchResult={activeSearchResult}
            onNavigate={handleNavigate}
            onBackToResult={() => {
              if (activeSearchResult) {
                handleNavigate('ai_result');
              } else {
                handleNavigate('records');
              }
            }}
          />
        )}

        {screen === 'timeline' && (
          <TimelineScreen
            patient={activePatient}
            onNavigate={handleNavigate}
            onOpenRecord={handleViewEvidence}
          />
        )}

        {screen === 'emergency' && (
          <EmergencyScreen
            patient={activePatient}
            onNavigate={handleNavigate}
            onVoiceSearch={handleQuickVoiceAsk}
          />
        )}

        {screen === 'records' && (
          <RecordsScreen
            patient={activePatient}
            onOpenRecord={handleViewEvidence}
            onNavigate={handleNavigate}
          />
        )}

        {screen === 'settings' && (
          <SettingsScreen
            doctor={CURRENT_DOCTOR}
            patient={activePatient}
            userRole={userRole}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav currentScreen={screen} onNavigate={handleNavigate} userRole={userRole} />
    </div>
  );
}
