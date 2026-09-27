import { useEffect, useState } from 'react';
import { Activity, ShieldCheck, Mic } from 'lucide-react';

interface Props {
  onFinish: () => void;
}

export const SplashScreen = ({ onFinish }: Props) => {
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onFinish, 400);
          return 100;
        }
        return prev + 15;
      });
    }, 180);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-slate-50 via-teal-50/30 to-blue-50/40 flex flex-col items-center justify-between p-6 overflow-hidden">
      {/* Subtle medical particle grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      {/* Top hospital verification badge */}
      <div className="pt-8 z-10 flex items-center gap-1.5 text-xs font-semibold text-teal-800 bg-teal-100/80 border border-teal-200 px-3 py-1 rounded-full">
        <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
        <span>Clinical Decision Support & EHR Access</span>
      </div>

      {/* Central Brand Card */}
      <div className="flex flex-col items-center text-center max-w-sm z-10 my-auto">
        <div className="relative mb-6">
          {/* Glowing pulse rings */}
          <div className="absolute -inset-4 bg-teal-400/20 rounded-3xl blur-xl animate-pulse" />
          <div className="relative w-24 h-24 rounded-3xl bg-teal-600 text-white flex items-center justify-center shadow-xl shadow-teal-700/25 border-2 border-teal-400/30">
            <Activity className="w-12 h-12 text-white animate-pulse" />
            <div className="absolute -bottom-1.5 -right-1.5 w-8 h-8 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-teal-400 shadow">
              <Mic className="w-4 h-4 text-teal-300" />
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          ASTRA AYU
        </h1>
        <p className="mt-2 text-base font-semibold text-teal-700">
          Voice-Based AI Medical History Search
        </p>

        <p className="mt-4 text-xs text-slate-500 leading-relaxed max-w-xs">
          Instant, verified past medical history retrieval for emergency physicians when patients cannot communicate.
        </p>

        {/* Loading Bar */}
        <div className="w-64 mt-8">
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-teal-600 h-full rounded-full transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono mt-2">
            <span>Loading encrypted EHR protocols...</span>
            <span>{progress}%</span>
          </div>
        </div>

        {/* Skip Button */}
        <button
          onClick={onFinish}
          className="mt-6 text-xs text-slate-400 hover:text-slate-700 font-medium underline underline-offset-4 cursor-pointer"
        >
          Skip to Login
        </button>
      </div>

      {/* Footer Disclaimer */}
      <div className="pb-4 text-center z-10 text-[11px] text-slate-400 max-w-md">
        Protected Health Information · HIPAA & Clinical Audit Compliant Prototype
      </div>
    </div>
  );
};
