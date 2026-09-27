import { AlertCircle } from 'lucide-react';

interface Props {
  className?: string;
  compact?: boolean;
}

export const DisclaimerBanner = ({ className = '', compact = false }: Props) => {
  return (
    <div
      role="note"
      aria-label="Clinical verification notice"
      className={`border-l-4 border-amber-500 bg-amber-50/90 text-amber-900 rounded-r-lg p-3 text-xs leading-relaxed ${className}`}
    >
      <div className="flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-amber-950">Clinical Verification Requirement:</span>{' '}
          {compact
            ? 'AI-assisted record retrieval only. Verify critical data against the original EHR before intervention.'
            : 'Astra Ayu does not provide medical diagnoses or autonomous treatment decisions. Retrieved findings represent documented historical records and must be independently verified by licensed healthcare professionals prior to clinical intervention.'}
        </div>
      </div>
    </div>
  );
};
