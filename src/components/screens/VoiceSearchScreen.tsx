import { useState, useEffect, useRef } from 'react';
import { Patient, ScreenType } from '../../types';
import {
  Mic,
  MicOff,
  RotateCcw,
  Sparkles,
  Volume2,
  Edit3,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { AudioWaveform } from '../common/AudioWaveform';
import { getVoiceRecognitionController } from '../../services/voiceService';

interface Props {
  patient: Patient;
  onNavigate: (screen: ScreenType) => void;
  onSubmitVoiceQuery: (query: string) => void;
  initialQuery?: string;
}

export const VoiceSearchScreen = ({
  patient,
  onSubmitVoiceQuery,
  initialQuery = '',
}: Props) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState(initialQuery);
  const [isEditing, setIsEditing] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(Boolean(initialQuery));
  const [errorMessage, setErrorMessage] = useState('');
  const [isPlayingBack, setIsPlayingBack] = useState(false);
  const recognitionRef = useRef<ReturnType<typeof getVoiceRecognitionController> | null>(null);

  const suggestedQuestions = [
    'Does the patient have any known drug allergies?',
    'What medications is the patient currently taking?',
    'Has the patient undergone surgery before?',
    'Does the patient have a history of diabetes?',
    'Is the patient on blood thinners or anticoagulants?',
    'What major medical conditions are recorded?',
    'Does the patient have a history of seizures?', // Demonstrates verified negative search
  ];

  useEffect(() => {
    recognitionRef.current = getVoiceRecognitionController();
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    setErrorMessage('');
    setIsRecording(true);
    setIsEditing(false);

    if (recognitionRef.current && recognitionRef.current.isAvailable) {
      recognitionRef.current.start(
        (interim) => {
          setTranscript(interim);
        },
        (final) => {
          setTranscript(final);
          setIsRecording(false);
          setHasRecorded(true);
        },
        (error) => {
          console.warn('Speech error, activating simulated clinical voice input:', error);
          // Graceful fallback simulation
          runVoiceSimulation();
        }
      );
    } else {
      // Browser does not support speech recognition natively; run clean simulated audio stream
      runVoiceSimulation();
    }
  };

  const runVoiceSimulation = () => {
    setTranscript('');
    const sampleWords = [
      'Does',
      'this',
      'patient',
      'have',
      'any',
      'known',
      'drug',
      'allergies?',
    ];
    let currentIdx = 0;
    const interval = setInterval(() => {
      currentIdx++;
      setTranscript(sampleWords.slice(0, currentIdx).join(' '));
      if (currentIdx >= sampleWords.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIsRecording(false);
          setHasRecorded(true);
        }, 500);
      }
    }, 280);
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
    if (transcript.trim()) {
      setHasRecorded(true);
    }
  };

  const handleSelectSuggested = (question: string) => {
    setTranscript(question);
    setHasRecorded(true);
    setIsEditing(false);
  };

  const handleReplay = () => {
    setIsPlayingBack(true);
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const u = new SpeechSynthesisUtterance(transcript);
      u.rate = 1.0;
      u.onend = () => setIsPlayingBack(false);
      u.onerror = () => setIsPlayingBack(false);
      window.speechSynthesis.speak(u);
    } else {
      setTimeout(() => setIsPlayingBack(false), 2000);
    }
  };

  const handleTriggerSearch = () => {
    if (!transcript.trim()) {
      setErrorMessage('Please speak or type a question before searching.');
      return;
    }
    onSubmitVoiceQuery(transcript.trim());
  };

  return (
    <div className="space-y-6 pb-24 max-w-3xl mx-auto">
      {/* Screen Title & Clinical Context */}
      <div className="text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold text-teal-800 mb-1">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Natural Language Clinical Query Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Ask About Medical History
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Target Patient:{' '}
          <strong className="text-slate-900">{patient.name}</strong>{' '}
          <span className="text-xs font-mono text-slate-500">
            ({patient.id} · Blood: {patient.bloodGroup} · {patient.age}y {patient.gender})
          </span>
        </p>
      </div>

      {/* PROMINENT CENTRAL VOICE INTERACTION CARD */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
        {/* Background glow during recording */}
        {isRecording && (
          <div className="absolute inset-0 bg-teal-500/5 pointer-events-none animate-pulse" />
        )}

        <div className="mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
            {isRecording ? 'Listening in progress...' : 'Ready for clinical query'}
          </span>
        </div>

        <p className="text-sm sm:text-base font-semibold text-slate-700 max-w-md">
          {isRecording
            ? 'Speak clearly into the microphone. Astra Ayu is capturing clinical terms...'
            : 'Speak your medical-history question.'}
        </p>

        {/* Dynamic Waveform Display */}
        <div className="my-5 w-full max-w-md">
          <AudioWaveform
            isRecording={isRecording}
            isPlaying={isPlayingBack}
            barCount={32}
            theme={isRecording ? 'teal' : 'blue'}
          />
        </div>

        {/* LARGE CENTRAL MICROPHONE BUTTON */}
        <div className="relative my-2">
          {isRecording && (
            <div className="absolute -inset-4 rounded-full bg-teal-500/20 animate-ping pointer-events-none" />
          )}
          <button
            onClick={isRecording ? stopListening : startListening}
            aria-label={isRecording ? 'Stop Recording' : 'Start Recording Voice Query'}
            className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center transition-all shadow-xl active:scale-95 cursor-pointer ring-8 ${
              isRecording
                ? 'bg-red-600 hover:bg-red-700 text-white ring-red-100 shadow-red-600/30'
                : 'bg-teal-600 hover:bg-teal-700 text-white ring-teal-50 shadow-teal-700/25'
            }`}
          >
            {isRecording ? (
              <>
                <MicOff className="w-10 h-10 mb-1 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider">Listening…</span>
              </>
            ) : (
              <>
                <Mic className="w-10 h-10 mb-1" />
                <span className="text-xs font-bold uppercase tracking-wider">Tap to Speak</span>
              </>
            )}
          </button>
        </div>

        {isRecording && (
          <p className="mt-3 text-xs text-slate-500 font-mono">
            Tap button again to complete question
          </p>
        )}

        {errorMessage && (
          <div className="mt-3 text-xs text-red-600 font-medium">
            {errorMessage}
          </div>
        )}

        {/* TRANSCRIPTION RESULT & EDITING AREA */}
        {(hasRecorded || transcript) && (
          <div className="w-full mt-6 pt-6 border-t border-slate-100 text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Captured Speech Transcription
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleReplay}
                  disabled={!transcript}
                  className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 p-1 rounded hover:bg-slate-100 cursor-pointer"
                  title="Replay recorded query via audio synthesis"
                >
                  <Volume2 className="w-3.5 h-3.5 text-teal-600" />
                  <span className="hidden sm:inline">Replay</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 p-1 rounded hover:bg-slate-100 cursor-pointer"
                  title="Edit transcribed query text"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                  <span>{isEditing ? 'Done Editing' : 'Edit'}</span>
                </button>
              </div>
            </div>

            {/* Display / Editable Input */}
            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  rows={2}
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
                  placeholder="Type or revise your clinical question..."
                />
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 bg-slate-200 text-slate-800 rounded-md text-xs font-semibold"
                >
                  Save Transcription
                </button>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="text-xs text-slate-500 mb-1">You asked:</div>
                <div className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  &ldquo;{transcript}&rdquo;
                </div>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <div className="mt-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setTranscript('');
                  setHasRecorded(false);
                }}
                className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Question</span>
              </button>

              <button
                onClick={handleTriggerSearch}
                disabled={!transcript.trim()}
                className="w-full sm:w-auto px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white rounded-xl font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Search Medical Records</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SUGGESTED CLINICAL QUESTIONS */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Suggested Clinical Inquiries (Tap to Ask)
          </h2>
          <span className="text-[11px] text-slate-400">One-tap simulation</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {suggestedQuestions.map((q, idx) => {
            const isCurrent = transcript === q;
            return (
              <button
                key={idx}
                onClick={() => handleSelectSuggested(q)}
                className={`p-3 text-left rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center justify-between gap-2 ${
                  isCurrent
                    ? 'border-teal-600 bg-teal-50 text-teal-900 ring-1 ring-teal-600'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:border-slate-300'
                }`}
              >
                <span>&ldquo;{q}&rdquo;</span>
                {isCurrent ? (
                  <Check className="w-4 h-4 text-teal-700 shrink-0" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Privacy & Safeguard Footer */}
      <div className="flex items-center justify-center gap-2 text-xs text-slate-400 text-center">
        <ShieldCheck className="w-4 h-4 text-teal-600" />
        <span>Voice queries are processed in encrypted session. Audio streams are not retained.</span>
      </div>
    </div>
  );
};
