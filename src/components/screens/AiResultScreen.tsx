import { useState, useEffect } from 'react';
import { AiSearchResult, Patient, ScreenType } from '../../types';
import {
  FileText,
  Volume2,
  VolumeX,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Mic,
  Calendar,
  Building,
  User,
  ExternalLink,
} from 'lucide-react';
import { DisclaimerBanner } from '../common/DisclaimerBanner';
import { speakClinicalAnswer, stopSpeaking } from '../../services/voiceService';

interface Props {
  result: AiSearchResult;
  patient: Patient;
  onNavigate: (screen: ScreenType) => void;
  onViewEvidence: (recordId: string) => void;
  onAskNewQuestion: () => void;
}

export const AiResultScreen = ({
  result,
  patient,
  onNavigate,
  onViewEvidence,
  onAskNewQuestion,
}: Props) => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const processingSteps = [
    { label: 'Understanding Voice Audio', icon: '🎙️' },
    { label: 'Processing Clinical Query', icon: '🧠' },
    { label: 'Searching Patient EHR Records', icon: '🔎' },
    { label: 'Retrieving Verified Evidence', icon: '📄' },
    { label: 'Preparing Formatted Response', icon: '✓' },
  ];

  // Animated pipeline progression
  useEffect(() => {
    setIsProcessing(true);
    setCurrentStepIndex(0);

    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= processingSteps.length - 1) {
          clearInterval(stepInterval);
          setTimeout(() => {
            setIsProcessing(false);
          }, 350);
          return prev;
        }
        return prev + 1;
      });
    }, 380);

    return () => clearInterval(stepInterval);
  }, [result.id]);

  const handleToggleSpeech = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speakClinicalAnswer(result.answer, () => {
        setIsSpeaking(false);
      });
    }
  };

  // If still running the animated verification pipeline
  if (isProcessing) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-teal-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-teal-700/20 mb-6 animate-bounce">
          {processingSteps[currentStepIndex].icon}
        </div>

        <h2 className="text-xl font-bold text-slate-900 mb-2">
          {processingSteps[currentStepIndex].label}
        </h2>
        <p className="text-xs text-slate-500 mb-8">
          Analyzing verified electronic health records for {patient.name} ({patient.id})...
        </p>

        {/* Step Progression List */}
        <div className="w-full space-y-2 text-left bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          {processingSteps.map((step, idx) => {
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <div
                key={idx}
                className={`flex items-center gap-3 p-2 rounded-lg text-xs transition-colors ${
                  isCurrent
                    ? 'bg-teal-50 text-teal-900 font-bold'
                    : isDone
                    ? 'text-slate-600'
                    : 'text-slate-300'
                }`}
              >
                <span className="text-sm">{step.icon}</span>
                <span className="flex-1">{step.label}</span>
                {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                {isCurrent && (
                  <span className="w-2 h-2 rounded-full bg-teal-600 animate-ping" />
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={() => setIsProcessing(false)}
          className="mt-6 text-xs text-slate-400 hover:text-slate-700 underline"
        >
          Skip animation
        </button>
      </div>
    );
  }

  const isFound = result.status === 'RECORD FOUND';

  return (
    <div className="space-y-6 pb-24 max-w-3xl mx-auto">
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('voice_search')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Voice Search</span>
        </button>

        <div className="text-xs text-slate-500">
          Target: <strong className="text-slate-800">{patient.name}</strong> ({patient.id})
        </div>
      </div>

      {/* Main Evidence-Based Result Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Question Header */}
        <div className="pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Doctor Question
            </span>
            <span className="text-xs font-mono text-slate-400">{result.timestamp}</span>
          </div>
          <div className="text-lg sm:text-xl font-bold text-slate-900">
            &ldquo;{result.query}&rdquo;
          </div>
        </div>

        {/* Status Badge & AI Synthesized Answer */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              {isFound ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>RECORD FOUND</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 border border-slate-300 px-3 py-1 rounded-full">
                  <XCircle className="w-3.5 h-3.5 text-slate-500" />
                  <span>NO MATCHING MEDICAL RECORD FOUND</span>
                </span>
              )}
              <span className="text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full">
                {result.confidence}
              </span>
            </div>

            {/* Read Answer Aloud Button */}
            <button
              onClick={handleToggleSpeech}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                isSpeaking
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Stop Audio</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-teal-600" />
                  <span>Read Aloud</span>
                </>
              )}
            </button>
          </div>

          {/* AI Result Text */}
          <div
            className={`p-5 rounded-2xl border text-base sm:text-lg font-bold leading-relaxed ${
              isFound
                ? 'bg-teal-50/70 border-teal-200 text-teal-950'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            {result.answer}
          </div>
        </div>

        {/* EVIDENCE PANEL (Only when record is found) */}
        {result.evidence ? (
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-teal-700" />
                Supporting Medical Record Evidence
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                Ref: {result.evidence.documentRefNumber}
              </span>
            </div>

            {/* Extracted Evidence Highlight */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="text-[11px] font-semibold text-teal-800 uppercase tracking-wider">
                Extracted Clinical Finding
              </div>
              <p className="text-sm font-bold text-slate-900">
                {result.evidence.extractedHighlight}
              </p>
            </div>

            {/* Source Document Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Recorded Date</div>
                  <div className="font-semibold text-slate-800">{result.evidence.dateRecorded}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Source Hospital</div>
                  <div className="font-semibold text-slate-800 truncate">{result.evidence.sourceHospital}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Attending Physician</div>
                  <div className="font-semibold text-slate-800 truncate">{result.evidence.physician}</div>
                </div>
              </div>
            </div>

            {/* Primary CTA: VIEW FULL EVIDENCE RECORD */}
            <div className="pt-2">
              <button
                onClick={() => onViewEvidence(result.evidence!.recordId)}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-sm shadow-xs transition-colors cursor-pointer"
              >
                <span>View Full Supporting Medical Record</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Empty / Negative result guidance */
          <div className="p-5 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-2">
            <div className="text-xs font-bold text-amber-900">
              Zero-Hallucination Safe State
            </div>
            <p className="text-xs text-amber-800/90 leading-relaxed">
              No matching records for this inquiry exist in the patient electronic medical dossier. Astra Ayu does not invent, extrapolate, or hypothesize past medical history.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onAskNewQuestion}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <Mic className="w-4 h-4 text-teal-400" />
            <span>Ask Another Question</span>
          </button>

          <button
            onClick={() => onNavigate('patient_profile')}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer border border-slate-200"
          >
            <span>Back to Patient Profile</span>
          </button>
        </div>

        {/* Clinical Disclaimer */}
        <DisclaimerBanner />
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-slate-400 text-center">
        <ShieldCheck className="w-4 h-4 text-teal-600" />
        <span>Grounded search audit log saved with query ID: {result.id}</span>
      </div>
    </div>
  );
};
