import { useState } from 'react';
import { Patient, ScreenType } from '../../types';
import {
  AlertOctagon,
  Mic,
  AlertTriangle,
  HeartPulse,
  Pill,
  Syringe,
  Activity,
  Phone,
  ArrowRight,
  ShieldAlert,
  Send,
} from 'lucide-react';
import { DisclaimerBanner } from '../common/DisclaimerBanner';

interface Props {
  patient: Patient;
  onNavigate: (screen: ScreenType) => void;
  onVoiceSearch: (query: string) => void;
}

export const EmergencyScreen = ({ patient, onNavigate, onVoiceSearch }: Props) => {
  const [quickQuery, setQuickQuery] = useState('');

  const emergencyQuickQuestions = [
    'Any recorded drug allergies?',
    'Is the patient on blood thinners or anticoagulants?',
    'What medications is the patient taking?',
    'Has the patient had major surgery before?',
  ];

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuery.trim()) return;
    onVoiceSearch(quickQuery.trim());
  };

  return (
    <div className="space-y-5 pb-24 max-w-4xl mx-auto">
      {/* EMERGENCY HIGH-PRIORITY BANNER */}
      <div className="bg-red-600 text-white rounded-3xl p-5 sm:p-6 shadow-lg shadow-red-700/25 border-2 border-red-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white text-red-600 flex items-center justify-center shrink-0">
              <AlertOctagon className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-100 bg-red-700/80 px-2 py-0.5 rounded">
                  EMERGENCY TRIAGE MODE
                </span>
                <span className="text-xs text-red-100">Live EHR Access</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-0.5">
                Emergency Medical History
              </h1>
            </div>
          </div>

          {/* Large Blood Group Badge */}
          <div className="bg-white text-slate-900 px-5 py-3 rounded-2xl text-center shadow-md border-2 border-red-200 shrink-0">
            <div className="text-[10px] font-black uppercase tracking-wider text-red-600">
              ABO / Rh Blood Group
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
              {patient.bloodGroup}
            </div>
          </div>
        </div>

        {/* Patient Identity Strip */}
        <div className="mt-4 pt-4 border-t border-red-500/60 flex flex-wrap items-center justify-between gap-2 text-xs text-red-50">
          <div>
            Patient: <strong className="text-white text-sm">{patient.name}</strong> ({patient.id}) ·{' '}
            {patient.age} yrs · {patient.gender} · {patient.admissionStatus}
          </div>
          <div className="flex items-center gap-1.5 font-mono">
            <Phone className="w-3.5 h-3.5" />
            <span>
              Kin: {patient.emergencyContact.name} ({patient.emergencyContact.relationship}) -{' '}
              {patient.emergencyContact.phone}
            </span>
          </div>
        </div>
      </div>

      {/* QUICK VOICE SEARCH FOR EMERGENCY (URGENT ACCESSIBILITY) */}
      <div className="bg-white border-2 border-red-300 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-red-600" />
            <span className="text-sm font-bold text-slate-900">
              Rapid Voice Inquiry
            </span>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Speak or tap urgent questions
          </span>
        </div>

        <form onSubmit={handleQuickSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={quickQuery}
              onChange={(e) => setQuickQuery(e.target.value)}
              placeholder="e.g. Any recorded drug allergies?..."
              className="w-full pl-3 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          <button
            type="button"
            onClick={() => onNavigate('voice_search')}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            title="Start Microphone Voice Search"
          >
            <Mic className="w-4 h-4" />
            <span className="hidden sm:inline">Voice Search</span>
          </button>

          <button
            type="submit"
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Quick Question Chips */}
        <div className="flex flex-wrap gap-2 pt-1">
          {emergencyQuickQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onVoiceSearch(q)}
              className="text-xs bg-red-50 hover:bg-red-100 text-red-900 border border-red-200 font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              &ldquo;{q}&rdquo;
            </button>
          ))}
        </div>
      </div>

      {/* 1. CRITICAL ALLERGY ALERTS (MASSIVE CONTRAINDICATION VISIBILITY) */}
      <div className="bg-white border-2 border-red-300 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-red-100">
          <div className="flex items-center gap-2">
            <Syringe className="w-5 h-5 text-red-600" />
            <h2 className="text-base font-extrabold text-slate-900">
              1. Drug & Severe Allergies
            </h2>
          </div>
          <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
            Check Before Injections / Rx
          </span>
        </div>

        {patient.knownAllergies.length === 0 ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-900 flex items-center gap-2">
            <span>✓ No Known Drug Allergies (NKDA) documented in hospital files.</span>
          </div>
        ) : (
          <div className="space-y-3">
            {patient.knownAllergies.map((allergy) => (
              <div
                key={allergy.id}
                className="p-4 bg-red-50 border-2 border-red-300 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    <span className="text-base font-extrabold text-red-950">
                      {allergy.allergen}
                    </span>
                    <span className="text-xs font-bold text-white bg-red-700 px-2 py-0.5 rounded">
                      {allergy.severity}
                    </span>
                  </div>
                  <div className="text-xs text-red-900 font-medium mt-1">
                    <strong>Reaction:</strong> {allergy.reaction}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Recorded {allergy.dateRecorded} at {allergy.sourceHospital}
                  </div>
                </div>

                <button
                  onClick={() => onVoiceSearch(`Tell me about ${allergy.allergen} allergy`)}
                  className="self-start sm:self-auto text-xs font-bold text-teal-800 bg-white border border-teal-300 hover:bg-teal-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  Inspect Evidence
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. CURRENT MEDICATIONS (BLEEDING RISKS & DRUG INTERACTIONS) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-extrabold text-slate-900">
              2. Active Medications & Regimens
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {patient.currentMedications.length} on record
          </span>
        </div>

        {patient.currentMedications.length === 0 ? (
          <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-500">
            No active chronic prescriptions logged.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {patient.currentMedications.map((med) => (
              <div
                key={med.id}
                className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{med.name}</span>
                  <span className="text-xs font-mono font-semibold text-slate-600 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                    {med.dosage}
                  </span>
                </div>
                <div className="text-xs text-slate-600">
                  {med.frequency} · {med.route}
                </div>
                <div className="text-[11px] text-teal-800 font-semibold pt-1">
                  Indication: {med.indication}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. MAJOR CHRONIC CONDITIONS & SURGERIES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Conditions */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <HeartPulse className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">
              3. Major Chronic Conditions
            </h3>
          </div>
          {patient.chronicConditions.length === 0 ? (
            <p className="text-xs text-slate-500">None documented.</p>
          ) : (
            <div className="space-y-2">
              {patient.chronicConditions.map((c) => (
                <div key={c.id} className="p-2.5 bg-slate-50 rounded-xl text-xs">
                  <div className="font-bold text-slate-900">
                    {c.condition} <span className="font-normal text-slate-500 font-mono">({c.icdCode})</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{c.notes}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Previous Surgeries */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Activity className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">
              4. Previous Major Surgeries
            </h3>
          </div>
          {patient.previousSurgeries.length === 0 ? (
            <p className="text-xs text-slate-500">No surgical history logged.</p>
          ) : (
            <div className="space-y-2">
              {patient.previousSurgeries.map((s) => (
                <div key={s.id} className="p-2.5 bg-slate-50 rounded-xl text-xs">
                  <div className="font-bold text-slate-900">{s.procedure}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {s.date} · {s.hospital}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Emergency Mode Strict Verification Notice */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold">Clinical Emergency Safety Notice:</span> Verify critical information against the original medical record before urgent interventions. Astra Ayu is an emergency record retrieval interface and does not formulate autonomous clinical or resuscitation decisions.
        </div>
      </div>

      {/* Bottom Profile Navigation CTA */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={() => onNavigate('patient_profile')}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
        >
          <span>Return to Standard Profile</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
