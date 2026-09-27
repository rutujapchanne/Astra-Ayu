import { useState } from 'react';
import { DoctorUser, Patient, ScreenType } from '../../types';
import {
  Stethoscope,
  User,
  Volume2,
  Bell,
  Shield,
  Lock,
  LogOut,
  Info,
  Check,
  Building,
  Mail,
  Phone,
  Droplet,
} from 'lucide-react';
import { DisclaimerBanner } from '../common/DisclaimerBanner';

interface Props {
  doctor: DoctorUser;
  patient?: Patient;
  userRole?: 'patient' | 'doctor';
  onLogout: () => void;
  onNavigate: (screen: ScreenType) => void;
}

export const SettingsScreen = ({
  doctor,
  patient,
  userRole = 'doctor',
  onLogout,
}: Props) => {
  const [audioFeedback, setAudioFeedback] = useState(true);
  const [speechRate, setSpeechRate] = useState<'normal' | 'fast'>('normal');
  const [emergencyBanners, setEmergencyBanners] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);

  const isPatient = userRole === 'patient';

  const handleSavePreferences = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div className="space-y-6 pb-24 max-w-3xl mx-auto font-sans">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {isPatient ? 'Patient Profile & Settings' : 'Physician Profile & Settings'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {isPatient
            ? 'Your personal health account details, voice search settings, and security controls.'
            : 'Hospital credentials, voice engine preferences, and clinical verification controls.'}
        </p>
      </div>

      {/* ACCOUNT PROFILE CARD */}
      {isPatient && patient ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#E8FBF8] border border-[#B1F1E6] text-[#119C91] flex items-center justify-center font-bold text-2xl shadow-xs shrink-0">
              <User className="w-8 h-8 text-[#119C91]" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-slate-900">{patient.name}</h2>
                <span className="text-xs font-mono font-bold text-[#119C91] bg-[#E8FBF8] border border-[#B1F1E6] px-2 py-0.5 rounded">
                  {patient.id}
                </span>
                <span className="text-xs font-extrabold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded flex items-center gap-1">
                  <Droplet className="w-3 h-3 fill-red-600" />
                  <span>Blood: {patient.bloodGroup}</span>
                </span>
              </div>

              <p className="text-xs font-semibold text-slate-600 mt-1">
                {patient.age} yrs · {patient.gender} · {patient.admissionStatus}
              </p>

              <div className="mt-2 flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {patient.phone}
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  aarav.sharma@astraayu.health
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  Emergency Contact: <strong>{patient.emergencyContact.name}</strong> ({patient.emergencyContact.relationship}) - {patient.emergencyContact.phone}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Patient Session (AST-10021)</span>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-1 text-red-600 hover:text-red-700 font-semibold cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold text-2xl shadow-md shadow-teal-700/20 shrink-0">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-slate-900">{doctor.name}</h2>
                <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                  {doctor.medicalId}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-700 mt-0.5">{doctor.role}</p>

              <div className="mt-2 flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                <span className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  {doctor.hospital}
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {doctor.email}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Active Hospital Single-Sign-On Session (EHR Level 3)</span>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-1 text-red-600 hover:text-red-700 font-semibold cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* AUDIO & VOICE INTERACTION PREFERENCES */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Volume2 className="w-4 h-4 text-teal-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Voice & Speech Settings
          </h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-800">
                Text-To-Speech Response Readback
              </div>
              <div className="text-[11px] text-slate-500">
                Read synthesized clinical answer out loud automatically
              </div>
            </div>
            <input
              type="checkbox"
              checked={audioFeedback}
              onChange={(e) => {
                setAudioFeedback(e.target.checked);
                handleSavePreferences();
              }}
              className="w-4 h-4 text-teal-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div>
              <div className="text-xs font-semibold text-slate-800">
                Voice Playback Rate
              </div>
              <div className="text-[11px] text-slate-500">
                Speech speed for audio responses
              </div>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => {
                  setSpeechRate('normal');
                  handleSavePreferences();
                }}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  speechRate === 'normal'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600'
                }`}
              >
                1.0x Normal
              </button>
              <button
                type="button"
                onClick={() => {
                  setSpeechRate('fast');
                  handleSavePreferences();
                }}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  speechRate === 'fast'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600'
                }`}
              >
                1.2x Fast
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* EMERGENCY NOTIFICATIONS & ALERTS */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Bell className="w-4 h-4 text-amber-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Medical Alerts & Care Notifications
          </h3>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-800">
              High-Risk Allergy & Medication Safety Banners
            </div>
            <div className="text-[11px] text-slate-500">
              Show prominent warning headers for documented severe allergies and contraindications
            </div>
          </div>
          <input
            type="checkbox"
            checked={emergencyBanners}
            onChange={(e) => {
              setEmergencyBanners(e.target.checked);
              handleSavePreferences();
            }}
            className="w-4 h-4 text-red-600 rounded cursor-pointer"
          />
        </div>
      </div>

      {/* PRIVACY, SECURITY & ZERO-HALLUCINATION STATEMENT */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Shield className="w-4 h-4 text-[#119C91]" />
          <h3 className="text-sm font-bold text-slate-900">
            Personal Health Information Security
          </h3>
        </div>

        <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
          <p>
            <strong>Private Record Access:</strong> In patient mode, all medical history queries access only the verified personal electronic health record of <strong className="text-slate-900">Aarav Sharma (AST-10021)</strong>. No access to other patient accounts is permitted.
          </p>
          <p>
            <strong>Strict Grounding:</strong> Astra Ayu never estimates or generates unverified medical history.
          </p>
        </div>
      </div>

      {/* ABOUT ASTRA AYU */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-xs text-slate-600 space-y-3">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <Info className="w-4 h-4 text-[#119C91]" />
          <span>About Astra Ayu</span>
        </div>
        <p className="leading-relaxed">
          <strong>Astra Ayu</strong> is a personal health intelligence platform and emergency medical-history access system designed to help patients and doctors access verified health information when every second matters.
        </p>
        <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Version 2.4.0 (Personal Health Edition)</span>
          <span>Logged In: Aarav Sharma (AST-10021)</span>
        </div>
      </div>

      {/* Saved Toast */}
      {savedNotice && (
        <div className="fixed bottom-20 right-6 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-lg animate-bounce">
          <Check className="w-4 h-4 text-teal-400" />
          <span>Preferences updated</span>
        </div>
      )}

      {/* Regulatory Disclaimer */}
      <DisclaimerBanner />
    </div>
  );
};
