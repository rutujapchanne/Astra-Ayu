import { Patient, ScreenType } from '../../types';
import {
  Mic,
  Clock,
  AlertTriangle,
  FileCheck,
  Phone,
  ShieldCheck,
  AlertOctagon,
  ArrowRight,
  Pill,
  HeartPulse,
  Syringe,
  Activity,
} from 'lucide-react';
import { DisclaimerBanner } from '../common/DisclaimerBanner';

interface Props {
  patient: Patient;
  onNavigate: (screen: ScreenType) => void;
  onOpenRecord: (recordId: string) => void;
  onQuickVoiceAsk: (question: string) => void;
}

export const PatientProfileScreen = ({
  patient,
  onNavigate,
  onOpenRecord,
  onQuickVoiceAsk,
}: Props) => {
  return (
    <div className="space-y-6 pb-20">
      {/* Patient Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center font-extrabold text-xl text-teal-800 shrink-0">
              {patient.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">{patient.name}</h1>
                <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                  {patient.id}
                </span>
                <span className="text-xs font-extrabold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                  Blood: {patient.bloodGroup}
                </span>
              </div>

              {/* Patient Core Metadata */}
              <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                <span>Age: <strong className="text-slate-700">{patient.age}</strong> yrs</span>
                <span aria-hidden="true">·</span>
                <span>Gender: <strong className="text-slate-700">{patient.gender}</strong></span>
                <span aria-hidden="true">·</span>
                <span>Status: <strong className="text-teal-800">{patient.admissionStatus}</strong></span>
                <span aria-hidden="true">·</span>
                <span>Admitted: {patient.admissionDate}</span>
              </div>

              {/* Emergency Contact */}
              <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  Emergency Contact: {patient.emergencyContact.name} ({patient.emergencyContact.relationship}) ·{' '}
                  <span className="font-mono text-slate-700">{patient.emergencyContact.phone}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Emergency Button */}
          <button
            onClick={() => onNavigate('emergency')}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
          >
            <AlertOctagon className="w-4 h-4 text-red-600" />
            <span>Emergency View</span>
          </button>
        </div>

        {/* Action CTAs */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
          {/* PRIMARY CTA: Ask Medical History */}
          <button
            onClick={() => onNavigate('voice_search')}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-sm shadow-sm transition-all cursor-pointer"
          >
            <Mic className="w-5 h-5" />
            <span>🎙️ Ask Medical History</span>
          </button>

          {/* SECONDARY CTA: View Full Timeline */}
          <button
            onClick={() => onNavigate('timeline')}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-semibold text-sm transition-colors cursor-pointer border border-slate-200"
          >
            <Clock className="w-4 h-4 text-slate-600" />
            <span>View Full Timeline</span>
          </button>
        </div>
      </div>

      {/* EMERGENCY HIGH-PRIORITY ALERTS */}
      {patient.emergencyAlerts.length > 0 && (
        <div className="p-4 bg-red-50/90 border border-red-200 rounded-2xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-red-800 tracking-wider mb-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>High-Priority Clinical Alerts</span>
          </div>
          <ul className="space-y-1.5 text-xs text-red-950 font-medium pl-6 list-disc">
            {patient.emergencyAlerts.map((alert, idx) => (
              <li key={idx}>{alert}</li>
            ))}
          </ul>
        </div>
      )}

      {/* CLINICAL VITALS STRIP */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <span className="flex items-center gap-1.5 text-teal-800 font-bold">
            <Activity className="w-4 h-4 text-teal-600" />
            Admission Vitals
          </span>
          <span className="text-[11px] font-normal text-slate-400">
            Recorded {patient.vitals.lastRecorded}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <div className="text-[10px] uppercase text-slate-400 font-semibold">Blood Pressure</div>
            <div className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
              {patient.vitals.bloodPressure}
            </div>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <div className="text-[10px] uppercase text-slate-400 font-semibold">Heart Rate</div>
            <div className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
              {patient.vitals.heartRate} <span className="text-xs font-normal text-slate-500">bpm</span>
            </div>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <div className="text-[10px] uppercase text-slate-400 font-semibold">Oxygen (SpO2)</div>
            <div className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
              {patient.vitals.oxygenSaturation}%
            </div>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <div className="text-[10px] uppercase text-slate-400 font-semibold">Temperature</div>
            <div className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
              {patient.vitals.temperature}
            </div>
          </div>
        </div>
      </div>

      {/* 1. KNOWN ALLERGIES SECTION */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Syringe className="w-4 h-4 text-red-600" />
            <h2 className="text-base font-bold text-slate-900">Known Allergies</h2>
          </div>
          <button
            onClick={() => onQuickVoiceAsk('Does this patient have any known drug allergies?')}
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Voice Inquire</span>
          </button>
        </div>

        {patient.knownAllergies.length === 0 ? (
          <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
            No known drug allergies (NKDA) recorded on electronic intake.
          </div>
        ) : (
          <div className="space-y-3">
            {patient.knownAllergies.map((allergy) => (
              <div
                key={allergy.id}
                className="p-3.5 bg-red-50/40 border border-red-200/80 rounded-xl flex flex-col justify-between gap-2"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-red-900 text-sm">{allergy.allergen}</span>
                    <span className="text-[11px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                      {allergy.severity} Severity
                    </span>
                  </div>
                  <p className="text-xs text-red-950/80 mt-1 leading-relaxed">
                    <strong>Documented Reaction:</strong> {allergy.reaction}
                  </p>
                </div>

                <div className="pt-2 border-t border-red-100 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span>Status: <strong className="text-slate-800">{allergy.status}</strong></span>
                    <span aria-hidden="true">·</span>
                    <span>Last Updated: <strong className="text-slate-800">{allergy.dateRecorded}</strong></span>
                  </div>
                  <button
                    onClick={() => onOpenRecord(allergy.sourceRecordId)}
                    className="font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>View Record Evidence</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. CHRONIC CONDITIONS SECTION */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-teal-600" />
            <h2 className="text-base font-bold text-slate-900">Chronic Conditions & Diagnoses</h2>
          </div>
          <button
            onClick={() => onQuickVoiceAsk('What major chronic conditions are recorded?')}
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Voice Inquire</span>
          </button>
        </div>

        {patient.chronicConditions.length === 0 ? (
          <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
            No active chronic medical conditions recorded on file.
          </div>
        ) : (
          <div className="space-y-3">
            {patient.chronicConditions.map((cond) => (
              <div
                key={cond.id}
                className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">
                    {cond.condition}{' '}
                    <span className="text-xs font-mono font-normal text-slate-500">
                      (ICD-10: {cond.icdCode})
                    </span>
                  </span>
                  <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                    {cond.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{cond.notes}</p>
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span>Diagnosed: <strong className="text-slate-700">{cond.diagnosedDate}</strong></span>
                    <span aria-hidden="true">·</span>
                    <span>By: {cond.diagnosedBy}</span>
                  </div>
                  <button
                    onClick={() => onOpenRecord(cond.sourceRecordId)}
                    className="font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Record</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. CURRENT MEDICATIONS SECTION */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Pill className="w-4 h-4 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">Current Medications</h2>
          </div>
          <button
            onClick={() => onQuickVoiceAsk('What medications is the patient currently taking?')}
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Voice Inquire</span>
          </button>
        </div>

        {patient.currentMedications.length === 0 ? (
          <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
            No active chronic medications listed on file.
          </div>
        ) : (
          <div className="space-y-3">
            {patient.currentMedications.map((med) => (
              <div
                key={med.id}
                className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-900 text-sm">
                    {med.name}{' '}
                    <span className="text-xs font-normal text-slate-500">
                      ({med.dosage} · {med.frequency})
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    {med.status}
                  </span>
                </div>
                <div className="text-xs text-slate-600 flex items-center gap-2">
                  <span>Indication: <strong className="text-slate-800">{med.indication}</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>Route: {med.route}</span>
                </div>
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span>Started: <strong className="text-slate-700">{med.startDate}</strong></span>
                    <span aria-hidden="true">·</span>
                    <span>Source: {med.sourceHospital}</span>
                  </div>
                  <button
                    onClick={() => onOpenRecord(med.sourceRecordId)}
                    className="font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Prescription</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. PREVIOUS SURGERIES SECTION */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Previous Surgeries & Interventions</h2>
          </div>
          <button
            onClick={() => onQuickVoiceAsk('Has the patient undergone surgery before?')}
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Voice Inquire</span>
          </button>
        </div>

        {patient.previousSurgeries.length === 0 ? (
          <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
            No previous surgical procedures or major operations documented.
          </div>
        ) : (
          <div className="space-y-3">
            {patient.previousSurgeries.map((surg) => (
              <div
                key={surg.id}
                className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{surg.procedure}</span>
                  <span className="text-xs font-mono font-semibold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded">
                    {surg.date}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{surg.notes}</p>
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Surgeon: {surg.surgeon} · {surg.hospital}</span>
                  <button
                    onClick={() => onOpenRecord(surg.sourceRecordId)}
                    className="font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Operative Summary</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <DisclaimerBanner />
    </div>
  );
};
