import { Patient, ScreenType, DoctorUser } from '../../types';
import {
  Mic,
  Users,
  AlertTriangle,
  FileText,
  Search,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertOctagon,
  Clock,
  Sparkles,
  User,
  Stethoscope,
} from 'lucide-react';
import { DisclaimerBanner } from '../common/DisclaimerBanner';

interface Props {
  doctor: DoctorUser;
  activePatient: Patient;
  recentPatients: Patient[];
  onNavigate: (screen: ScreenType) => void;
  onSelectPatient: (patientId: string) => void;
  onQuickVoiceAsk: (question: string) => void;
}

export const DashboardScreen = ({
  doctor,
  activePatient,
  recentPatients,
  onNavigate,
  onSelectPatient,
  onQuickVoiceAsk,
}: Props) => {
  return (
    <div className="space-y-6 pb-20">
      {/* Welcome Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 md:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{doctor.department} · {doctor.hospital}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Good Morning, {doctor.name}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Access the right patient information at the right time when seconds count.
            </p>

            {/* Role View Toggle: Continue as a Doctor / Continue as a Patient */}
            <div className="mt-3.5 inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                type="button"
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-teal-900 shadow-xs flex items-center gap-1.5"
              >
                <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                <span>Continue as a Doctor</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('patient_dashboard')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>Continue as a Patient</span>
              </button>
            </div>
          </div>

          {/* Quick Active Patient pill */}
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex items-center justify-between gap-4">
            <div>
              <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                Current Triage Subject
              </div>
              <div className="font-bold text-slate-900 text-sm">
                {activePatient.name}{' '}
                <span className="text-xs font-normal text-slate-500">
                  ({activePatient.id} · {activePatient.bloodGroup})
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                {activePatient.admissionStatus}
              </div>
            </div>
            <button
              onClick={() => onNavigate('patient_profile')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs hover:border-teal-300 transition-colors cursor-pointer"
            >
              View Profile
            </button>
          </div>
        </div>
      </div>

      {/* CORE USP: PROMINENT VOICE MEDICAL HISTORY SEARCH HERO CARD */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 text-white p-6 sm:p-8 shadow-md">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-300 bg-teal-800/60 border border-teal-500/30 px-3 py-1 rounded-md mb-3">
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              <span>Core Emergency Feature</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Voice Medical History Search
            </h2>
            <p className="mt-2 text-sm sm:text-base text-teal-100/90 leading-relaxed">
              Ask about a patient&apos;s medical history using your voice. Astra Ayu translates natural speech into verified electronic health record evidence instantly.
            </p>

            {/* Suggested Quick Inquiries */}
            <div className="mt-4 pt-4 border-t border-teal-700/50">
              <span className="text-xs font-semibold text-teal-200 block mb-2">
                Frequently Asked in Emergency:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  '“Does this patient have any known drug allergies?”',
                  '“What medications is the patient currently taking?”',
                  '“Has the patient undergone surgery before?”',
                ].map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onQuickVoiceAsk(q.replace(/“|”/g, ''));
                    }}
                    className="text-xs text-left bg-teal-800/80 hover:bg-teal-700 border border-teal-600/40 text-teal-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Large Start Voice Search Action */}
          <div className="flex flex-col items-center justify-center shrink-0">
            <button
              onClick={() => onNavigate('voice_search')}
              className="group relative flex flex-col items-center justify-center w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-teal-500 hover:bg-teal-400 active:scale-95 text-slate-950 shadow-xl shadow-teal-950/40 transition-all cursor-pointer ring-8 ring-teal-500/20"
            >
              <div className="text-3xl mb-1">🎙️</div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900 group-hover:text-black">
                Start Voice
              </span>
              <span className="text-[11px] font-medium text-slate-800">
                Search EHR
              </span>
            </button>
            <span className="text-[11px] text-teal-300 mt-2 font-mono">
              Target: {activePatient.name}
            </span>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* QUICK ACTIONS */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <button
            onClick={() => onNavigate('patient_search')}
            className="flex flex-col items-start p-4 bg-white border border-slate-200 rounded-xl hover:border-teal-500 hover:shadow-xs transition-all text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-3 group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-900 text-sm">Search Patient</span>
            <span className="text-xs text-slate-500 mt-0.5">By ID, Name or QR</span>
          </button>

          <button
            onClick={() => onNavigate('emergency')}
            className="flex flex-col items-start p-4 bg-red-50/70 border border-red-200 rounded-xl hover:bg-red-50 hover:border-red-400 hover:shadow-xs transition-all text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-red-600 text-white flex items-center justify-center mb-3 group-hover:bg-red-700 transition-colors">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <span className="font-bold text-red-950 text-sm">Emergency Mode</span>
            <span className="text-xs text-red-700 mt-0.5">Instant allergy alerts</span>
          </button>

          <button
            onClick={() => onNavigate('records')}
            className="flex flex-col items-start p-4 bg-white border border-slate-200 rounded-xl hover:border-teal-500 hover:shadow-xs transition-all text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-900 text-sm">Medical Records</span>
            <span className="text-xs text-slate-500 mt-0.5">View verified EHR files</span>
          </button>

          <button
            onClick={() => onNavigate('timeline')}
            className="flex flex-col items-start p-4 bg-white border border-slate-200 rounded-xl hover:border-teal-500 hover:shadow-xs transition-all text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Clock className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-900 text-sm">Timeline</span>
            <span className="text-xs text-slate-500 mt-0.5">Chronological events</span>
          </button>
        </div>
      </div>

      {/* ACTIVE PATIENT EMERGENCY SUMMARY CARD */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 text-sm sm:text-base">
              Active Patient: {activePatient.name}
            </span>
            <span className="text-xs text-slate-500">
              · {activePatient.age} yrs · {activePatient.gender} · Blood: <strong className="text-slate-900">{activePatient.bloodGroup}</strong>
            </span>
          </div>
          <button
            onClick={() => onNavigate('voice_search')}
            className="flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Voice Search This Patient</span>
          </button>
        </div>

        {/* Critical Alerts Banner if any */}
        {activePatient.emergencyAlerts.length > 0 && (
          <div className="mt-3.5 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="text-xs text-red-900">
              <span className="font-bold">Active Clinical Alerts: </span>
              {activePatient.emergencyAlerts.join(' · ')}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-1">
          {/* Known Allergies */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Known Allergies
            </div>
            {activePatient.knownAllergies.length > 0 ? (
              <div className="space-y-1">
                {activePatient.knownAllergies.map((a) => (
                  <div key={a.id} className="text-xs">
                    <span className="font-bold text-red-700">{a.allergen}</span>
                    <span className="text-slate-500 text-[11px]"> ({a.severity})</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-600 font-medium">
                No Known Drug Allergies (NKDA)
              </div>
            )}
          </div>

          {/* Current Medications */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Current Medications
            </div>
            {activePatient.currentMedications.length > 0 ? (
              <div className="space-y-1">
                {activePatient.currentMedications.slice(0, 2).map((m) => (
                  <div key={m.id} className="text-xs text-slate-800">
                    <span className="font-semibold">{m.name}</span>
                    <span className="text-slate-500"> · {m.dosage}</span>
                  </div>
                ))}
                {activePatient.currentMedications.length > 2 && (
                  <div className="text-[11px] text-teal-700 font-medium">
                    +{activePatient.currentMedications.length - 2} more on file
                  </div>
                )}
              </div>
            ) : (
              <div className="text-xs text-slate-600 font-medium">
                None actively prescribed
              </div>
            )}
          </div>

          {/* Chronic Conditions */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Chronic Conditions
            </div>
            {activePatient.chronicConditions.length > 0 ? (
              <div className="space-y-1">
                {activePatient.chronicConditions.map((c) => (
                  <div key={c.id} className="text-xs text-slate-800">
                    <span className="font-semibold">{c.condition}</span>
                    <span className="text-slate-500 text-[11px]"> ({c.icdCode})</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-600 font-medium">
                None recorded
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECONDARY CLINICAL STATS & RECENT PATIENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Patients Table / List */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Recent Patients</h3>
              <p className="text-xs text-slate-500">Triage admissions under Dr. Iyer</p>
            </div>
            <button
              onClick={() => onNavigate('patient_search')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentPatients.map((patient) => {
              const isSelected = patient.id === activePatient.id;
              return (
                <div
                  key={patient.id}
                  className={`py-3 flex items-center justify-between gap-3 transition-colors ${
                    isSelected ? 'bg-teal-50/50 -mx-2 px-2 rounded-lg' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">
                      {patient.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 text-xs sm:text-sm">
                          {patient.name}
                        </span>
                        <span className="text-slate-400 text-xs">·</span>
                        <span className="text-xs text-slate-500 font-mono">{patient.id}</span>
                        {isSelected && (
                          <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-1.5 py-0.2 rounded">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {patient.age}y / {patient.gender} · Blood Group: {patient.bloodGroup} · {patient.admissionStatus}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onSelectPatient(patient.id);
                        onNavigate('voice_search');
                      }}
                      className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Voice Search Patient"
                    >
                      <Mic className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Ask</span>
                    </button>
                    <button
                      onClick={() => {
                        onSelectPatient(patient.id);
                        onNavigate('patient_profile');
                      }}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
                    >
                      Profile
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Secondary Clinical Statistics */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Emergency Shift Overview</h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-teal-600" />
                  <span className="text-xs font-semibold text-slate-700">Recent Patients</span>
                </div>
                <span className="text-sm font-bold text-slate-900 font-mono">5 Active</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2.5">
                  <Mic className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-semibold text-slate-700">Active Searches</span>
                </div>
                <span className="text-sm font-bold text-slate-900 font-mono">14 Queries</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-semibold text-slate-700">Verification Rate</span>
                </div>
                <span className="text-sm font-bold text-emerald-700 font-mono">100% EHR Grounded</span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span>Zero-hallucination guardrails active.</span>
            </div>
          </div>

          <DisclaimerBanner compact />
        </div>
      </div>
    </div>
  );
};
