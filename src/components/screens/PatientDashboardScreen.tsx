import { useState } from 'react';
import { Patient, ScreenType, ReminderItem } from '../../types';
import {
  User,
  Heart,
  Pill,
  Calendar,
  Clock,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Mic,
  QrCode,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Shield,
  Activity,
  Plus,
  Stethoscope,
  Building,
  Download,
} from 'lucide-react';
import { DisclaimerBanner } from '../common/DisclaimerBanner';

interface Props {
  patient: Patient;
  onNavigate: (screen: ScreenType) => void;
  onOpenRecord: (recordId: string) => void;
  onVoiceSearch: (query: string) => void;
  onSwitchToDoctorView: () => void;
}

type TabType =
  | 'overview'
  | 'medical_history'
  | 'records'
  | 'prescriptions'
  | 'medications'
  | 'appointments'
  | 'reminders'
  | 'timeline';

export const PatientDashboardScreen = ({
  patient,
  onNavigate,
  onOpenRecord,
  onVoiceSearch,
  onSwitchToDoctorView,
}: Props) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [reminders, setReminders] = useState<ReminderItem[]>(patient.reminders || []);
  const [showQRModal, setShowQRModal] = useState(false);
  const [quickQuery, setQuickQuery] = useState('');

  const toggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  };

  const handleVoiceQuickAsk = (q: string) => {
    onVoiceSearch(q);
  };

  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuery.trim()) return;
    onVoiceSearch(quickQuery.trim());
  };

  return (
    <div className="space-y-6 pb-24 max-w-5xl mx-auto font-sans">
      {/* PATIENT HEADER & EMERGENCY IDENTIFIER CARD */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#E8FBF8] border border-[#B1F1E6] flex items-center justify-center text-2xl font-black text-[#119C91] shrink-0 shadow-xs">
              {patient.name[0]}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#119C91] bg-[#E8FBF8] border border-[#B1F1E6] px-2.5 py-0.5 rounded-full">
                  Logged In Patient
                </span>
                <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                  AST-10021
                </span>
                <span className="text-xs font-black text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                  B+
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
                Aarav Sharma
              </h1>

              <p className="text-xs text-slate-500 mt-1">
                42 yrs · Male · Phone: +91 98450 23110 · Emergency Kin: Sunita Sharma (Spouse) - +91 98450 23112
              </p>
            </div>
          </div>

          {/* Action cluster on right */}
          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            <button
              onClick={() => setShowQRModal(true)}
              className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-[#119C91]" />
              <span>Medical ID QR</span>
            </button>
          </div>
        </div>

        {/* High-priority Allergy Warning for Patient Safety */}
        {patient.knownAllergies.length > 0 && (
          <div className="mt-5 p-3.5 bg-red-50/80 border border-red-200 rounded-2xl flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="text-xs text-red-900">
              <span className="font-bold">Active Medical Alerts: </span>
              {patient.knownAllergies.map((a) => `${a.allergen} (${a.severity} Allergy)`).join(' · ')}
            </div>
          </div>
        )}
      </div>

      {/* QR MODAL */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-[#119C91]">Emergency Medical ID</span>
              <button
                onClick={() => setShowQRModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center">
              <div className="w-40 h-40 bg-white border-2 border-slate-900 rounded-xl flex items-center justify-center shadow-inner relative">
                <QrCode className="w-32 h-32 text-slate-900" />
              </div>
              <p className="text-xs font-mono font-bold text-slate-800 mt-3">
                ID: {patient.id}
              </p>
              <p className="text-[11px] text-slate-500">
                Blood: {patient.bloodGroup} · {patient.name}
              </p>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Show this QR code to triage nurses or emergency responders for instant access to verified allergies and medications.
            </p>

            <button
              onClick={() => {
                alert('Medical ID Card downloaded to your device.');
                setShowQRModal(false);
              }}
              className="w-full py-2.5 bg-[#119C91] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Digital Emergency Card</span>
            </button>
          </div>
        </div>
      )}

      {/* AI HEALTH SEARCH HERO CARD */}
      <div className="bg-gradient-to-br from-[#0F3835] via-[#114B46] to-[#0A2624] text-white rounded-3xl p-5 sm:p-7 shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#119C91]/30 border border-[#119C91]/50 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#A5EFE3]" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#A5EFE3]">
              Personal AI Health Search
            </span>
          </div>

          <div className="max-w-xl">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Ask about your medications, allergies or records
            </h2>
            <p className="text-xs sm:text-sm text-teal-100/90 mt-1 leading-relaxed">
              Speak or type to instantly search your verified medical dossier without searching through paper files.
            </p>
          </div>

          {/* Quick Search input form */}
          <form onSubmit={handleQuerySubmit} className="flex gap-2 max-w-2xl">
            <div className="relative flex-1">
              <input
                type="text"
                value={quickQuery}
                onChange={(e) => setQuickQuery(e.target.value)}
                placeholder="e.g. What medications do I take in the morning?..."
                className="w-full pl-3.5 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-xs sm:text-sm text-white placeholder:text-teal-200/70 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-[#A5EFE3]"
              />
            </div>
            <button
              type="button"
              onClick={() => onNavigate('voice_search')}
              className="px-4 py-3 bg-[#119C91] hover:bg-[#0E8A80] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              title="Ask using your voice"
            >
              <Mic className="w-4 h-4" />
              <span className="hidden sm:inline">Voice Search</span>
            </button>
          </form>

          {/* Suggested Quick Questions */}
          <div className="flex flex-wrap gap-2 pt-1">
            {[
              'What medicines am I currently taking?',
              'Do I have any recorded drug allergies?',
              'Have I had surgery before?',
              'What chronic conditions are in my history?',
            ].map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleVoiceQuickAsk(q)}
                className="text-[11px] bg-white/10 hover:bg-white/20 border border-white/15 text-teal-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                &ldquo;{q}&rdquo;
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS FOR PATIENT FEATURES */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-1.5 shadow-xs overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1 min-w-max">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'medical_history', label: 'Medical History', icon: Heart },
            { id: 'records', label: 'Records', icon: FileText },
            { id: 'prescriptions', label: 'Prescriptions', icon: FileText },
            { id: 'medications', label: 'Medications', icon: Pill },
            { id: 'appointments', label: 'Appointments', icon: Calendar },
            { id: 'reminders', label: 'Reminders', icon: Clock },
            { id: 'timeline', label: 'Health Timeline', icon: Clock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#119C91] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB CONTENT PANELS */}

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick stats cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="bg-white border border-slate-200 rounded-2xl p-4">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Active Meds
              </div>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {patient.currentMedications.length}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">Regular prescriptions</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Allergies Logged
              </div>
              <div className="text-2xl font-black text-red-600 mt-1">
                {patient.knownAllergies.length}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">Critical warnings</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Appointments
              </div>
              <div className="text-2xl font-black text-[#119C91] mt-1">
                {patient.appointments?.filter((a) => a.status === 'Upcoming').length || 1}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">Upcoming consultations</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Today&apos;s Tasks
              </div>
              <div className="text-2xl font-black text-emerald-600 mt-1">
                {reminders.filter((r) => r.completed).length} / {reminders.length}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">Reminders done</div>
            </div>
          </div>

          {/* Today's Reminders Preview & Next Appointment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Reminders widget */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#119C91]" />
                  <h3 className="font-bold text-slate-900 text-sm">Today&apos;s Medication & Care</h3>
                </div>
                <button
                  onClick={() => setActiveTab('reminders')}
                  className="text-xs font-semibold text-[#119C91] hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="space-y-2">
                {reminders.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleReminder(item.id)}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                      item.completed
                        ? 'bg-slate-50 border-slate-200 text-slate-400'
                        : 'bg-[#E8FBF8]/40 border-[#B1F1E6]/70 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-[#119C91] shrink-0" />
                      )}
                      <div>
                        <div className={`text-xs font-bold ${item.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {item.title}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {item.dosage ? `${item.dosage} · ` : ''}{item.time}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold uppercase text-slate-400">
                      {item.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Upcoming Appointment */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-slate-900 text-sm">Next Appointment</h3>
                </div>
                <button
                  onClick={() => setActiveTab('appointments')}
                  className="text-xs font-semibold text-[#119C91] hover:underline"
                >
                  Schedule
                </button>
              </div>

              {patient.appointments && patient.appointments[0] ? (
                <div className="p-4 bg-blue-50/50 border border-blue-200/80 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-950">
                      {patient.appointments[0].doctorName}
                    </span>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                      {patient.appointments[0].type}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 font-medium">
                    {patient.appointments[0].department} · {patient.appointments[0].hospital}
                  </div>
                  <div className="pt-2 border-t border-blue-100 flex items-center justify-between text-xs text-slate-700">
                    <span className="font-bold text-slate-900 font-mono">
                      📅 {patient.appointments[0].date} at {patient.appointments[0].time}
                    </span>
                    <span className="text-[11px] text-slate-500">{patient.appointments[0].location}</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 text-xs text-slate-500 rounded-xl text-center">
                  No upcoming appointments scheduled.
                </div>
              )}

              {/* Quick Link to Records */}
              <div className="pt-1">
                <button
                  onClick={() => setActiveTab('records')}
                  className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-slate-200 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-[#119C91]" />
                  <span>Browse {patient.records.length} Medical Records</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. MEDICAL HISTORY TAB */}
      {activeTab === 'medical_history' && (
        <div className="space-y-5">
          {/* Allergies */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Recorded Allergies</h3>
              <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded">
                Important Clinical Safety
              </span>
            </div>

            {patient.knownAllergies.length === 0 ? (
              <p className="text-xs text-slate-500">No known allergies documented.</p>
            ) : (
              <div className="space-y-3">
                {patient.knownAllergies.map((a) => (
                  <div key={a.id} className="p-4 bg-red-50/60 border border-red-200 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-red-950 text-sm">{a.allergen}</span>
                      <span className="text-[11px] font-bold text-white bg-red-600 px-2 py-0.5 rounded">
                        {a.severity}
                      </span>
                    </div>
                    <p className="text-xs text-red-900 mt-1">
                      <strong>Reaction:</strong> {a.reaction}
                    </p>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Recorded on {a.dateRecorded} at {a.sourceHospital}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chronic Conditions */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base pb-3 border-b border-slate-100">
              Diagnosed Chronic Conditions
            </h3>
            <div className="space-y-3">
              {patient.chronicConditions.map((c) => (
                <div key={c.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">
                      {c.condition}{' '}
                      <span className="text-xs font-mono font-normal text-slate-500">
                        (ICD: {c.icdCode})
                      </span>
                    </span>
                    <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                      {c.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{c.notes}</p>
                  <div className="text-[11px] text-slate-400 pt-1">
                    Diagnosed on {c.diagnosedDate} by {c.diagnosedBy} ({c.sourceHospital})
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Previous Surgeries */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base pb-3 border-b border-slate-100">
              Surgical Interventions
            </h3>
            <div className="space-y-3">
              {patient.previousSurgeries.map((s) => (
                <div key={s.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{s.procedure}</span>
                    <span className="text-xs font-mono text-slate-600">{s.date}</span>
                  </div>
                  <p className="text-xs text-slate-600">{s.notes}</p>
                  <div className="text-[11px] text-slate-400 pt-1">
                    Performed at {s.hospital} by {s.surgeon}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. RECORDS TAB */}
      {activeTab === 'records' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Your Medical Records</h3>
              <p className="text-xs text-slate-500">
                Official documents, hospital discharges, and lab reports
              </p>
            </div>
            <button
              onClick={() => onNavigate('records')}
              className="text-xs font-bold text-[#119C91] hover:underline"
            >
              Open Full Dossier →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {patient.records.map((rec) => (
              <div
                key={rec.id}
                onClick={() => onOpenRecord(rec.id)}
                className="p-4 bg-slate-50 hover:bg-[#E8FBF8]/40 border border-slate-200 hover:border-[#119C91] rounded-2xl transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#119C91] bg-white border border-[#B1F1E6] px-2 py-0.5 rounded">
                    {rec.type}
                  </span>
                  <span className="font-mono text-slate-400 text-[11px]">
                    {rec.documentRefNumber}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm group-hover:text-[#119C91] transition-colors">
                  {rec.title}
                </h4>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {rec.rawExcerpt}
                </p>
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{rec.dateRecorded}</span>
                  <span className="font-bold text-[#119C91] flex items-center gap-1">
                    <span>View Record</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. PRESCRIPTIONS TAB */}
      {activeTab === 'prescriptions' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base">Doctor Prescriptions</h3>
            <span className="text-xs text-slate-500">Digitally Verified</span>
          </div>

          <div className="space-y-4">
            {patient.prescriptions.map((rx) => (
              <div key={rx.id} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      Rx for {rx.diagnosis}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Prescribed by {rx.doctor} · {rx.hospital}
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-700 bg-white border border-slate-200 px-2.5 py-1 rounded">
                    {rx.date}
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Medications Prescribed
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-800 font-medium">
                    {rx.medications.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#119C91]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => onOpenRecord(rx.sourceRecordId)}
                    className="text-xs font-bold text-[#119C91] hover:underline"
                  >
                    View Official Electronic Prescription →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. MEDICATIONS TAB */}
      {activeTab === 'medications' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base">Current Medication Schedule</h3>
            <span className="text-xs text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              Active Regimen
            </span>
          </div>

          <div className="space-y-3">
            {patient.currentMedications.map((med) => (
              <div
                key={med.id}
                className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm sm:text-base">
                      {med.name}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded">
                      {med.dosage}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    <strong>Schedule:</strong> {med.frequency} · <strong>Route:</strong> {med.route}
                  </p>
                  <p className="text-[11px] text-[#119C91] font-medium mt-0.5">
                    Indication: {med.indication}
                  </p>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="text-[11px] text-slate-400 block">
                    Started {med.startDate}
                  </span>
                  <button
                    onClick={() => onOpenRecord(med.sourceRecordId)}
                    className="mt-1 text-xs font-bold text-[#119C91] hover:underline"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. APPOINTMENTS TAB */}
      {activeTab === 'appointments' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Doctor Consultations</h3>
              <p className="text-xs text-slate-500">Upcoming visits and completed reviews</p>
            </div>
            <button
              onClick={() => alert('Appointment booking system connected to Metro Apex OPD.')}
              className="px-3.5 py-1.5 bg-[#119C91] text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </button>
          </div>

          <div className="space-y-3">
            {patient.appointments?.map((apt) => (
              <div
                key={apt.id}
                className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm sm:text-base">
                      {apt.doctorName}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        apt.status === 'Upcoming'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    {apt.doctorRole} · {apt.department}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Location: {apt.location} ({apt.hospital})
                  </p>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <div className="text-xs font-bold text-slate-900 font-mono">
                    {apt.date} · {apt.time}
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">{apt.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. REMINDERS TAB */}
      {activeTab === 'reminders' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Health Reminders</h3>
              <p className="text-xs text-slate-500">
                Click any task to check off completed medications or tests
              </p>
            </div>
            <span className="text-xs font-bold text-[#119C91] font-mono">
              {reminders.filter((r) => r.completed).length} of {reminders.length} Completed
            </span>
          </div>

          <div className="space-y-2.5">
            {reminders.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleReminder(item.id)}
                className={`p-4 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                  item.completed
                    ? 'bg-slate-50/70 border-slate-200 text-slate-400'
                    : 'bg-[#E8FBF8]/50 border-[#B1F1E6] text-slate-800 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  {item.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  ) : (
                    <Circle className="w-6 h-6 text-[#119C91] shrink-0" />
                  )}
                  <div>
                    <div
                      className={`text-sm font-bold ${
                        item.completed ? 'line-through text-slate-400' : 'text-slate-900'
                      }`}
                    >
                      {item.title}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {item.dosage ? `${item.dosage} · ` : ''}{item.time} ({item.frequency})
                    </div>
                  </div>
                </div>

                <span className="text-xs font-semibold uppercase text-slate-400">
                  {item.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. HEALTH TIMELINE TAB */}
      {activeTab === 'timeline' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Your Health Journey</h3>
              <p className="text-xs text-slate-500">Chronological summary of verified events</p>
            </div>
            <button
              onClick={() => onNavigate('timeline')}
              className="text-xs font-bold text-[#119C91] hover:underline"
            >
              Full Interactive Timeline →
            </button>
          </div>

          <div className="space-y-4">
            {patient.timeline.map((item) => (
              <div key={item.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{item.title}</span>
                  <span className="text-xs font-mono font-bold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded">
                    {item.year}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{item.description}</p>
                <div className="text-[11px] text-slate-400 pt-1 flex items-center justify-between">
                  <span>{item.date} · {item.hospital}</span>
                  <button
                    onClick={() => onOpenRecord(item.sourceRecordId)}
                    className="font-bold text-[#119C91] hover:underline cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Verification Notice */}
      <DisclaimerBanner />
    </div>
  );
};
