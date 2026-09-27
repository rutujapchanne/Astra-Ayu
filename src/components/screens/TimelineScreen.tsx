import { useState } from 'react';
import { Patient, ScreenType, TimelineItem } from '../../types';
import {
  Clock,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Building,
  FileText,
  Calendar,
  Mic,
  ArrowRight,
} from 'lucide-react';
import { DisclaimerBanner } from '../common/DisclaimerBanner';

interface Props {
  patient: Patient;
  onNavigate: (screen: ScreenType) => void;
  onOpenRecord: (recordId: string) => void;
}

export const TimelineScreen = ({ patient, onNavigate, onOpenRecord }: Props) => {
  const [expandedId, setExpandedId] = useState<string | null>(
    patient.timeline[0]?.id || null
  );

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // Group timeline by year
  const groupedTimeline = patient.timeline.reduce<Record<number, TimelineItem[]>>(
    (acc, item) => {
      if (!acc[item.year]) acc[item.year] = [];
      acc[item.year].push(item);
      return acc;
    },
    {}
  );

  const sortedYears = Object.keys(groupedTimeline)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="space-y-6 pb-24 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 mb-1">
            <Clock className="w-4 h-4 text-teal-600" />
            <span>Chronological Patient Journey</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Medical Timeline
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Historical events and documented hospital visits for{' '}
            <strong className="text-slate-800">{patient.name}</strong> ({patient.id})
          </p>
        </div>

        <button
          onClick={() => onNavigate('voice_search')}
          className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto shrink-0 shadow-xs"
        >
          <Mic className="w-3.5 h-3.5" />
          <span>Ask About Timeline</span>
        </button>
      </div>

      {patient.timeline.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="font-bold text-slate-800 text-sm">No Timeline Events Logged</h3>
          <p className="text-xs text-slate-500 mt-1">
            No historical hospital visits or past procedures recorded for this patient.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {sortedYears.map((year) => {
            const items = groupedTimeline[year];
            return (
              <div key={year} className="relative">
                {/* Year Marker */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="px-3 py-1 bg-slate-900 text-white text-xs font-extrabold font-mono rounded-lg shadow-xs">
                    {year}
                  </div>
                  <div className="h-px bg-slate-200 flex-1" />
                </div>

                {/* Timeline Items under this year */}
                <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-200 space-y-4 ml-3 sm:ml-4">
                  {items.map((item) => {
                    const isExpanded = expandedId === item.id;
                    const isCritical = item.isCritical;

                    return (
                      <div
                        key={item.id}
                        className={`relative p-4 sm:p-5 bg-white border rounded-2xl transition-all shadow-xs ${
                          isExpanded
                            ? 'border-teal-500 ring-2 ring-teal-500/10'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {/* Dot on the vertical line */}
                        <div
                          className={`absolute -left-[31px] sm:-left-[39px] top-6 w-3.5 h-3.5 rounded-full border-2 border-white ring-2 ${
                            isCritical
                              ? 'bg-red-600 ring-red-200'
                              : 'bg-teal-600 ring-teal-200'
                          }`}
                        />

                        {/* Top clickable row */}
                        <div
                          onClick={() => toggleExpand(item.id)}
                          className="flex items-start justify-between gap-3 cursor-pointer select-none"
                        >
                          <div>
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                  isCritical
                                    ? 'bg-red-100 text-red-800 border border-red-200'
                                    : 'bg-teal-50 text-teal-800 border border-teal-200'
                                }`}
                              >
                                {item.category}
                              </span>
                              <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                                <Calendar className="w-3 h-3" />
                                {item.date}
                              </span>
                            </div>

                            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                              {item.title}
                            </h3>

                            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                              <Building className="w-3.5 h-3.5 text-slate-400" />
                              <span>{item.hospital}</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </div>

                        {/* Expandable Details Content */}
                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                            <p className="text-xs text-slate-700 leading-relaxed">
                              {item.description}
                            </p>

                            {isCritical && (
                              <div className="flex items-center gap-2 text-xs font-semibold text-red-700 bg-red-50 p-2.5 rounded-lg border border-red-200">
                                <AlertTriangle className="w-4 h-4 shrink-0" />
                                <span>High-risk clinical finding logged on this date.</span>
                              </div>
                            )}

                            <div className="pt-2 flex items-center justify-between">
                              <button
                                onClick={() => onOpenRecord(item.sourceRecordId)}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-800 bg-teal-50 px-2.5 py-1.5 rounded-lg border border-teal-200 cursor-pointer"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>Open Full Clinical Record</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>

                              <span className="text-[11px] font-mono text-slate-400">
                                Ref: {item.sourceRecordId}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <DisclaimerBanner />
    </div>
  );
};
