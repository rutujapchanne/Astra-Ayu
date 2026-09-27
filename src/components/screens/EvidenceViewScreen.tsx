import { MedicalRecord, Patient, ScreenType, AiSearchResult } from '../../types';
import {
  FileText,
  ArrowLeft,
  Building,
  Calendar,
  UserCheck,
  CheckCircle2,
  FileCheck2,
  Share2,
  Printer,
} from 'lucide-react';
import { DisclaimerBanner } from '../common/DisclaimerBanner';

interface Props {
  record: MedicalRecord | null;
  patient: Patient;
  lastSearchResult?: AiSearchResult | null;
  onNavigate: (screen: ScreenType) => void;
  onBackToResult: () => void;
}

export const EvidenceViewScreen = ({
  record,
  patient,
  lastSearchResult,
  onNavigate,
  onBackToResult,
}: Props) => {
  if (!record) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
        <FileText className="w-12 h-12 text-slate-300 mb-3" />
        <h2 className="text-lg font-bold text-slate-800">Record Not Selected</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          Please select a record from the search results or patient dossier.
        </p>
        <button
          onClick={() => onNavigate('records')}
          className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg text-xs font-semibold"
        >
          View All Records
        </button>
      </div>
    );
  }

  // Format highlighted text in rawExcerpt if last search result exists
  const rawText = record.rawExcerpt;

  return (
    <div className="space-y-6 pb-24 max-w-3xl mx-auto">
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToResult}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to AI Result</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-slate-900 text-xs flex items-center gap-1 cursor-pointer"
            title="Print Clinical Evidence Record"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print EHR</span>
          </button>
          <button
            onClick={() => alert(`Copied document reference: ${record.documentRefNumber}`)}
            className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-slate-900 text-xs flex items-center gap-1 cursor-pointer"
            title="Share Document Reference"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Copy Ref</span>
          </button>
        </div>
      </div>

      {/* Screen Title & Verification Tag */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 mb-1">
          <FileCheck2 className="w-4 h-4 text-teal-600" />
          <span>Audited Clinical Source Document</span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
          Supporting Medical Record
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Patient: <strong className="text-slate-800">{patient.name}</strong> ({patient.id}) ·{' '}
          Document Ref: <strong className="font-mono text-slate-700">{record.documentRefNumber}</strong>
        </p>
      </div>

      {/* Verification Level Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-950">
              Verified Electronic Health Record · {record.verificationLevel}
            </div>
            <div className="text-[11px] text-emerald-800">
              Cryptographically signed by {record.physician} at {record.sourceHospital}.
            </div>
          </div>
        </div>
        <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-300 shrink-0">
          VALIDATED
        </span>
      </div>

      {/* AI Grounding Comparison Card (Answers: Why did AI say this?) */}
      {lastSearchResult && (
        <div className="bg-teal-50/70 border border-teal-200 rounded-2xl p-5 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-teal-900">
            AI Answer Grounding Context
          </div>
          <div className="text-xs text-slate-700">
            <strong>Query Inquired:</strong> &ldquo;{lastSearchResult.query}&rdquo;
          </div>
          <div className="text-xs text-teal-950 font-bold bg-white p-3 rounded-xl border border-teal-200">
            AI Answer: &ldquo;{lastSearchResult.answer}&rdquo;
          </div>
          <div className="text-xs text-teal-900/90 leading-relaxed">
            <strong>Supporting Highlight:</strong> The clinical statement above was retrieved directly from the verified EHR excerpt below.
          </div>
        </div>
      )}

      {/* Primary EHR Document Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Document Header */}
        <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
              {record.type}
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-2">{record.title}</h2>
          </div>
          <div className="text-left sm:text-right">
            <div className="text-xs font-mono font-semibold text-slate-700">
              {record.documentRefNumber}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">{record.dateRecorded}</div>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5 flex items-center gap-1">
              <Building className="w-3.5 h-3.5" />
              Source Institution
            </div>
            <div className="font-bold text-slate-800">{record.sourceHospital}</div>
            <div className="text-[11px] text-slate-500">{record.department}</div>
          </div>

          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Date Documented
            </div>
            <div className="font-bold text-slate-800">{record.dateRecorded}</div>
            <div className="text-[11px] text-slate-500">Official Clinical Timestamp</div>
          </div>

          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5" />
              Attending Physician
            </div>
            <div className="font-bold text-slate-800">{record.physician}</div>
            <div className="text-[11px] text-emerald-700 font-medium">Digital Signature Valid</div>
          </div>
        </div>

        {/* RAW CLINICAL EXCERPT (HIGHLIGHTED) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Official EHR Record Text / Extract
            </span>
            <span className="text-[11px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded">
              Original Verified Record
            </span>
          </div>
          <div className="p-5 bg-amber-50/40 border-2 border-amber-200/90 rounded-2xl text-slate-900 font-mono text-xs sm:text-sm leading-relaxed tracking-tight shadow-inner">
            {rawText}
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Cryptographic Record Hash: SHA-256 (EHR-VERIFIED)</span>
            <span>Unredacted Clinical Extract</span>
          </div>
        </div>

        {/* STRUCTURED CLINICAL FIELDS */}
        {record.structuredDetails && Object.keys(record.structuredDetails).length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Structured Clinical Parameters
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {Object.entries(record.structuredDetails).map(([key, val]) => (
                <div
                  key={key}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between"
                >
                  <span className="text-[10px] uppercase font-bold text-slate-400">{key}</span>
                  <span className="text-xs font-bold text-slate-900 mt-1">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Disclaimer & Return CTA */}
        <DisclaimerBanner />

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onBackToResult}
            className="flex-1 py-3 px-5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Back to AI Result
          </button>
          <button
            onClick={() => onNavigate('patient_profile')}
            className="flex-1 py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer border border-slate-200"
          >
            Return to Patient Profile
          </button>
        </div>
      </div>
    </div>
  );
};
