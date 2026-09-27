import { ScreenType } from '../../types';
import { Home, Users, User, Mic, AlertOctagon, FileText, Settings } from 'lucide-react';

interface Props {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  userRole?: 'patient' | 'doctor';
}

export const BottomNav = ({ currentScreen, onNavigate, userRole = 'doctor' }: Props) => {
  const isPatientMode = currentScreen === 'patient_dashboard' || userRole === 'patient';

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 lg:hidden pb-[env(safe-area-inset-bottom,0px)]"
    >
      <div className="flex items-center justify-around h-16 px-1 max-w-lg mx-auto">
        {/* Dashboard / Home */}
        <button
          onClick={() => onNavigate(isPatientMode ? 'patient_dashboard' : 'dashboard')}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[11px] font-medium transition-colors ${
            currentScreen === 'dashboard' || currentScreen === 'patient_dashboard'
              ? 'text-teal-700 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>{isPatientMode ? 'My Health' : 'Home'}</span>
        </button>

        {/* Profile / Patients */}
        <button
          onClick={() => onNavigate(isPatientMode ? 'patient_profile' : 'patient_search')}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[11px] font-medium transition-colors ${
            currentScreen === 'patient_search' || currentScreen === 'patient_profile'
              ? 'text-teal-700 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          {isPatientMode ? (
            <>
              <User className="w-5 h-5 mb-0.5" />
              <span>My Profile</span>
            </>
          ) : (
            <>
              <Users className="w-5 h-5 mb-0.5" />
              <span>Patients</span>
            </>
          )}
        </button>

        {/* Voice Search (PROMINENT CENTER CTA) */}
        <div className="flex flex-col items-center justify-center flex-1 -mt-5">
          <button
            onClick={() => onNavigate('voice_search')}
            aria-label="Start Voice Medical Search"
            className={`w-13 h-13 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
              currentScreen === 'voice_search' || currentScreen === 'ai_result'
                ? 'bg-teal-700 text-white ring-4 ring-teal-200'
                : 'bg-teal-600 hover:bg-teal-700 text-white ring-4 ring-white shadow-teal-700/25'
            }`}
          >
            <Mic className="w-6 h-6 text-white" />
          </button>
          <span className="text-[10px] font-bold text-teal-800 mt-1 tracking-tight">Voice Ask</span>
        </div>

        {/* Emergency */}
        <button
          onClick={() => onNavigate('emergency')}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[11px] font-medium transition-colors ${
            currentScreen === 'emergency' ? 'text-red-600 font-bold' : 'text-slate-500 hover:text-red-600'
          }`}
        >
          <AlertOctagon className="w-5 h-5 mb-0.5 text-red-600" />
          <span className="text-red-600">ER Alert</span>
        </button>

        {/* Records */}
        <button
          onClick={() => onNavigate('records')}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[11px] font-medium transition-colors ${
            currentScreen === 'records' || currentScreen === 'evidence_view'
              ? 'text-teal-700'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-5 h-5 mb-0.5" />
          <span>Records</span>
        </button>

        {/* Settings */}
        <button
          onClick={() => onNavigate('settings')}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[11px] font-medium transition-colors ${
            currentScreen === 'settings' ? 'text-teal-700' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Settings className="w-5 h-5 mb-0.5" />
          <span>Profile</span>
        </button>
      </div>
    </nav>
  );
};
