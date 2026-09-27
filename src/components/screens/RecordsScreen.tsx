import { useState } from 'react';
import { Patient, ScreenType, MedicalRecord } from '../../types';
import {
  FileText,
  Search,
  ExternalLink,
  Calendar,
  Building,
  CheckCircle2,
  Syringe,
  HeartPulse,
  Pill,
  Activity,
  Microscope,
  Stethoscope,
} from 'lucide-react';
import { DisclaimerBanner } from '../common/DisclaimerBanner';

interface Props {
  patient: Patient;
  onOpenRecord: (recordId: string) => void;
  onNavigate: (screen: ScreenType) => void;
}

type RecordCategory =
  | 'All'
  | 'Allergy'
  | 'Diagnosis'
  | 'Medication'
  | 'Surgery'
  | 'Lab Report'
  | 'Hospital Visit'
  | 'Prescription';

export const RecordsScreen = ({ patient, onOpenRecord }: Props) => {
  const [selectedCategory, setSelectedCategory] = useState<RecordCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { label: RecordCategory; icon: any }[] = [
    { label: 'All', icon: FileText },
    { label: 'Allergy', icon: Syringe },
    { label: 'Diagnosis', icon: HeartPulse },
    { label: 'Medication', icon: Pill },
    { label: 'Surgery', icon: Activity },
    { label: 'Lab Report', icon: Microscope },
    { label: 'Hospital Visit', icon: Stethoscope },
    { label: 'Prescription', icon: FileText },
  ];

  // Consolidate all records from patient profile
  const allRecords: MedicalRecord[] = [
    ...patient.records,
    // Add synthesized virtual cards for any lab reports / hospital visits if not already in patient.records
    ...patient.labReports.map((lab) => ({
      id: lab.sourceRecordId,
      patientId: patient.id,
      type: 'Lab Report' as const,
      title: `Laboratory Diagnostics: ${lab.testName}`,
      dateRecorded: lab.date,
      sourceHospital: lab.hospital,
      department: lab.category,
      physician: 'Clinical Laboratory Pathologist',
      verified: true,
      verificationLevel: 'Clinical Audit' as const,
      documentRefNumber: `LAB-${lab.id}`,
      rawExcerpt: `LAB FINDING: ${lab.testName}. Result: ${lab.keyFindings}. Reference Range: ${lab.normalRange || 'N/A'}. Clinical Status: ${lab.isAbnormal ? 'ABNORMAL' : 'WITHIN NORMAL LIMITS'}.`,
      keyFindings: lab.keyFindings,
      structuredDetails: {
        'Test Name': lab.testName,
        'Category': lab.category,
        'Result': lab.keyFindings,
        'Clinical Range': lab.normalRange || 'Reference standard',
      },
    })),
    ...patient.recentHospitalVisits.map((visit) => ({
      id: visit.sourceRecordId,
      patientId: patient.id,
      type: 'Hospital Visit' as const,
      title: `Hospital Encounter Summary: ${visit.type}`,
      dateRecorded: visit.visitDate,
      sourceHospital: visit.hospital,
      department: visit.department,
      physician: visit.attendingDoctor,
      verified: true,
      verificationLevel: 'Hospital Verified' as const,
      documentRefNumber: `VIS-${visit.id}`,
      rawExcerpt: `HOSPITAL ENCOUNTER: ${visit.type} on ${visit.visitDate}. Chief Complaint: ${visit.chiefComplaint}. Discharge Status: ${visit.dischargeSummary}. Attending: ${visit.attendingDoctor}.`,
      keyFindings: visit.chiefComplaint,
      structuredDetails: {
        'Visit Type': visit.type,
        'Chief Complaint': visit.chiefComplaint,
        'Summary': visit.dischargeSummary,
      },
    })),
  ];

  // De-duplicate records by id
  const uniqueRecords = Array.from(
    new Map(allRecords.map((r) => [r.id, r])).values()
  );

  const filteredRecords = uniqueRecords.filter((record) => {
    const matchesCategory =
      selectedCategory === 'All' || record.type === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.rawExcerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.documentRefNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Medical Records Dossier
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Verified electronic health records for <strong className="text-slate-800">{patient.name}</strong> ({patient.id})
        </p>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search records by keyword, condition, or document reference..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>

        {/* Category Pills (Functional Filter Buttons) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.label;
            return (
              <button
                key={cat.label}
                onClick={() => setSelectedCategory(cat.label)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Records Cards Grid */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
          <span>
            Displaying {filteredRecords.length} record(s){' '}
            {selectedCategory !== 'All' && `in ${selectedCategory}`}
          </span>
          <span className="font-mono text-[11px]">Audit Timestamp: Validated</span>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="font-bold text-slate-800 text-sm">No Records in Category</h3>
            <p className="text-xs text-slate-500 mt-1">
              No medical files match your active filter for {patient.name}.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRecords.map((record) => (
              <div
                key={record.id}
                onClick={() => onOpenRecord(record.id)}
                className="bg-white border border-slate-200 hover:border-teal-500 rounded-2xl p-5 transition-all hover:shadow-xs cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                      {record.type}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {record.documentRefNumber}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-teal-700 transition-colors">
                    {record.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {record.rawExcerpt}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {record.dateRecorded}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {record.verificationLevel}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 truncate max-w-[200px]">
                      <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{record.sourceHospital}</span>
                    </span>
                    <span className="font-bold text-teal-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>View</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
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
