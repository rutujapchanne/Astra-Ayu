import { Patient, ScreenType, DoctorUser } from '../../types';
import { ShieldCheck, Activity, AlertTriangle, User, ChevronDown, Stethoscope } from 'lucide-react';

interface Props {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  activePatient: Patient;
  allPatients: Patient[];
  onSelectPatient: (patientId: string) => void;
  doctor: DoctorUser;
  userRole?: 'patient' | 'doctor';
}

export const Header = ({
  currentScreen,
  onNavigate,
  activePatient,
  allPatients,
  onSelectPatient,
  doctor,
  userRole = 'doctor',
}: Props) => {
  const isPatientMode = currentScreen === 'patient_dashboard' || userRole === 'patient';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand Identity */}
          <button
            onClick={() => onNavigate(isPatientMode ? 'patient_dashboard' : 'dashboard')}
            className="flex items-center gap-2.5 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded-lg p-1 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-sm shadow-teal-700/20 group-hover:bg-teal-700 transition-colors">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 tracking-tight text-lg">ASTRA AYU</span>
                <span className="hidden sm:inline-block text-[10px] font-semibold tracking-wider uppercase text-teal-800 bg-teal-50 border border-teal-200 px-1.5 py-0.5 rounded">
                  {isPatientMode ? 'PATIENT' : 'EHR AI'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Voice-Based AI Medical History Search
              </p>
            </div>
          </button>

          {/* Center Patient Identity: Fixed identity for Patient, Dropdown for Doctor */}
          <div className="flex items-center gap-2">
            {isPatientMode ? (
              <div className="flex items-center gap-2 bg-slate-100/90 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 shadow-xs">
                <User className="w-3.5 h-3.5 text-[#119C91]" />
                <span className="font-bold text-slate-900">Aarav Sharma</span>
                <span className="text-slate-400">·</span>
                <span className="font-mono text-slate-600 font-semibold">AST-10021</span>
                <span className="text-slate-400">·</span>
                <span className="font-black text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.2 rounded text-[11px]">
                  B+
                </span>
              </div>
            ) : (
              <div className="relative">
                <label htmlFor="patient-switcher" className="sr-only">
                  Select Active Patient
                </label>
                <div className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200/80 transition-colors border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-slate-500 font-normal hidden md:inline">Patient:</span>
                  <select
                    id="patient-switcher"
                    value={activePatient.id}
                    onChange={(e) => onSelectPatient(e.target.value)}
                    className="bg-transparent font-semibold text-slate-900 focus:outline-none cursor-pointer pr-1"
                  >
                    {allPatients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.id}) · {p.bloodGroup}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                </div>
              </div>
            )}
          </div>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2">
            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 mr-2 text-xs font-semibold text-slate-600">
              {isPatientMode ? (
                <>
                  <button
                    onClick={() => onNavigate('patient_dashboard')}
                    className={`px-3 py-1.5 rounded-md transition-colors ${
                      currentScreen === 'patient_dashboard' ? 'text-teal-700 bg-teal-50' : 'hover:text-slate-900'
                    }`}
                  >
                    My Health
                  </button>
                  <button
                    onClick={() => onNavigate('patient_profile')}
                    className={`px-3 py-1.5 rounded-md transition-colors ${
                      currentScreen === 'patient_profile' ? 'text-teal-700 bg-teal-50' : 'hover:text-slate-900'
                    }`}
                  >
                    Medical History
                  </button>
                  <button
                    onClick={() => onNavigate('records')}
                    className={`px-3 py-1.5 rounded-md transition-colors ${
                      currentScreen === 'records' ? 'text-teal-700 bg-teal-50' : 'hover:text-slate-900'
                    }`}
                  >
                    Records
                  </button>
                  <button
                    onClick={() => onNavigate('timeline')}
                    className={`px-3 py-1.5 rounded-md transition-colors ${
                      currentScreen === 'timeline' ? 'text-teal-700 bg-teal-50' : 'hover:text-slate-900'
                    }`}
                  >
                    Timeline
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className={`px-3 py-1.5 rounded-md transition-colors ${
                      currentScreen === 'dashboard' ? 'text-teal-700 bg-teal-50' : 'hover:text-slate-900'
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => onNavigate('patient_profile')}
                    className={`px-3 py-1.5 rounded-md transition-colors ${
                      currentScreen === 'patient_profile' ? 'text-teal-700 bg-teal-50' : 'hover:text-slate-900'
                    }`}
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => onNavigate('timeline')}
                    className={`px-3 py-1.5 rounded-md transition-colors ${
                      currentScreen === 'timeline' ? 'text-teal-700 bg-teal-50' : 'hover:text-slate-900'
                    }`}
                  >
                    Timeline
                  </button>
                  <button
                    onClick={() => onNavigate('records')}
                    className={`px-3 py-1.5 rounded-md transition-colors ${
                      currentScreen === 'records' ? 'text-teal-700 bg-teal-50' : 'hover:text-slate-900'
                    }`}
                  >
                    Records
                  </button>
                </>
              )}
            </nav>

            {/* Portal Switcher Button */}
            {isPatientMode ? (
              <button
                onClick={() => onNavigate('dashboard')}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                title="Switch to Healthcare Provider (Doctor Portal)"
              >
                <Stethoscope className="w-3.5 h-3.5 text-teal-700" />
                <span>Doctor Portal</span>
              </button>
            ) : (
              <button
                onClick={() => onNavigate('patient_dashboard')}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                title="Switch to Patient Portal"
              >
                <User className="w-3.5 h-3.5 text-teal-700" />
                <span>Patient Portal</span>
              </button>
            )}

            {/* Emergency Mode Button */}
            <button
              onClick={() => onNavigate('emergency')}
              aria-label="Enter Emergency Mode"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                currentScreen === 'emergency'
                  ? 'bg-red-700 text-white ring-2 ring-red-400 ring-offset-1'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
              <span className="tracking-wide">EMERGENCY</span>
            </button>

            {/* Profile shortcut */}
            <button
              onClick={() => onNavigate('settings')}
              className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-700 text-xs cursor-pointer"
              title={isPatientMode ? `${activePatient.name} - Account & Settings` : `${doctor.name} - Settings`}
            >
              <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 text-slate-700 flex items-center justify-center font-semibold text-xs">
                {isPatientMode ? (
                  <User className="w-4 h-4 text-[#119C91]" />
                ) : (
                  <Stethoscope className="w-4 h-4 text-teal-700" />
                )}
              </div>
              <span className="hidden xl:inline font-semibold">
                {isPatientMode ? 'Aarav' : doctor.name.split(' ')[1]}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Subtle Protected Medical Record Notice */}
      <div className="bg-slate-100/70 border-t border-slate-200/60 px-4 py-1 text-[11px] text-slate-500 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <span className="flex items-center gap-1.5 truncate">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span className="truncate">
              {isPatientMode ? (
                <>
                  Logged in as Patient: <span className="font-semibold text-slate-800">Aarav Sharma</span> (AST-10021) · Protected Health Information (PHI)
                </>
              ) : (
                <>
                  Authorized clinical access: <span className="font-semibold text-slate-700">{doctor.name}</span> ({doctor.medicalId}) · Protected Health Information (PHI)
                </>
              )}
            </span>
          </span>
          <span className="hidden sm:inline text-slate-400">AES-256 Verified EHR Session</span>
        </div>
      </div>
    </header>
  );
};
