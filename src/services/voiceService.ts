/**
 * Voice interaction and audio synthesis service for Astra Ayu
 */

// Global type declaration for Web Speech API
declare global {
  interface Window {
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
  }
}

export interface VoiceRecognitionController {
  start: (onInterim: (text: string) => void, onFinal: (text: string) => void, onError: (err: string) => void) => void;
  stop: () => void;
  isAvailable: boolean;
}

let activeRecognitionInstance: any = null;

export function getVoiceRecognitionController(): VoiceRecognitionController {
  const SpeechRecognitionClass =
    typeof window !== 'undefined'
      ? window.SpeechRecognition || window.webkitSpeechRecognition
      : null;

  const isAvailable = Boolean(SpeechRecognitionClass);

  return {
    isAvailable,
    start: (onInterim, onFinal, onError) => {
      if (!SpeechRecognitionClass) {
        onError('Speech recognition is not natively supported in this browser.');
        return;
      }

      try {
        if (activeRecognitionInstance) {
          activeRecognitionInstance.abort();
        }

        const recognition = new SpeechRecognitionClass();
        activeRecognitionInstance = recognition;
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          if (finalTranscript) {
            onFinal(finalTranscript);
          } else if (interimTranscript) {
            onInterim(interimTranscript);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          onError(event.error || 'Microphone error');
        };

        recognition.onend = () => {
          activeRecognitionInstance = null;
        };

        recognition.start();
      } catch (err: any) {
        onError(err?.message || 'Failed to start speech recognition');
      }
    },
    stop: () => {
      if (activeRecognitionInstance) {
        try {
          activeRecognitionInstance.stop();
        } catch {
          // ignore
        }
        activeRecognitionInstance = null;
      }
    },
  };
}

/**
 * Text-to-speech engine to speak clinical response clearly to emergency physician
 */
export function speakClinicalAnswer(text: string, onEnd?: () => void): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = () => onEnd();
    }

    // Try finding a clear professional voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice =
      voices.find((v) => v.name.includes('Natural') || v.name.includes('Google') || v.lang.startsWith('en')) || voices[0];
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis failed:', err);
    if (onEnd) onEnd();
  }
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}
