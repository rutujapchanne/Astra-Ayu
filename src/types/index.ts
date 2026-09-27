export type ScreenType =
  | 'splash'
  | 'login'
  | 'dashboard'
  | 'patient_dashboard'
  | 'patient_search'
  | 'patient_profile'
  | 'voice_search'
  | 'ai_result'
  | 'evidence_view'
  | 'timeline'
  | 'emergency'
  | 'records'
  | 'settings';

export interface DoctorUser {
  name: string;
  medicalId: string;
  hospital: string;
  department: string;
  role: string;
  email: string;
  avatarUrl?: string;
}

export interface AllergyItem {
  id: string;
  allergen: string;
  type: 'Drug' | 'Food' | 'Environmental' | 'Contact';
  severity: 'Severe' | 'Moderate' | 'Mild';
  reaction: string;
  dateRecorded: string;
  sourceHospital: string;
  sourceRecordId: string;
  status: 'Active' | 'Resolved';
}

export interface ConditionItem {
  id: string;
  condition: string;
  icdCode: string;
  status: 'Active' | 'Chronic' | 'In Remission';
  diagnosedDate: string;
  diagnosedBy: string;
  sourceHospital: string;
  sourceRecordId: string;
  notes: string;
}

export interface MedicationItem {
  id: string;
  name: string;
  genericName: string;
  dosage: string;
  frequency: string;
  route: string;
  indication: string;
  startDate: string;
  prescribedBy: string;
  sourceHospital: string;
  sourceRecordId: string;
  status: 'Active' | 'Completed' | 'Suspended';
}

export interface SurgeryItem {
  id: string;
  procedure: string;
  date: string;
  hospital: string;
  surgeon: string;
  anesthesiaType: string;
  sourceRecordId: string;
  complications?: string;
  notes: string;
}

export interface HospitalVisitItem {
  id: string;
  visitDate: string;
  dischargeDate?: string;
  type: 'Emergency' | 'Inpatient Admission' | 'Outpatient Consultation' | 'Surgical';
  hospital: string;
  department: string;
  attendingDoctor: string;
  chiefComplaint: string;
  dischargeSummary: string;
  sourceRecordId: string;
}

export interface LabReportItem {
  id: string;
  testName: string;
  category: 'Hematology' | 'Biochemistry' | 'Radiology' | 'Microbiology';
  date: string;
  hospital: string;
  keyFindings: string;
  normalRange?: string;
  isAbnormal: boolean;
  sourceRecordId: string;
}

export interface PrescriptionItem {
  id: string;
  date: string;
  doctor: string;
  hospital: string;
  diagnosis: string;
  medications: string[];
  sourceRecordId: string;
}

export interface AppointmentItem {
  id: string;
  doctorName: string;
  doctorRole: string;
  department: string;
  hospital: string;
  date: string;
  time: string;
  status: 'Upcoming' | 'Completed' | 'Follow-up';
  location: string;
  type: 'In-Person' | 'Telehealth';
}

export interface ReminderItem {
  id: string;
  title: string;
  time: string;
  dosage?: string;
  frequency: string;
  type: 'Medication' | 'Checkup' | 'Lab Test' | 'Vitals';
  completed: boolean;
}

export interface TimelineItem {
  id: string;
  year: number;
  date: string;
  title: string;
  category: 'Allergy' | 'Surgery' | 'Medication' | 'Diagnosis' | 'Hospital Visit' | 'Emergency';
  hospital: string;
  description: string;
  sourceRecordId: string;
  isCritical?: boolean;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  type: 'Allergy' | 'Diagnosis' | 'Medication' | 'Surgery' | 'Lab Report' | 'Hospital Visit' | 'Prescription';
  title: string;
  dateRecorded: string;
  sourceHospital: string;
  department: string;
  physician: string;
  verified: boolean;
  verificationLevel: 'Hospital Verified' | 'Clinical Audit' | 'Emergency Triage Signed';
  documentRefNumber: string;
  rawExcerpt: string;
  keyFindings: string;
  structuredDetails: Record<string, string>;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  phone: string;
  admissionStatus: string;
  admissionDate: string;
  attendingDepartment: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  vitals: {
    bloodPressure: string;
    heartRate: number;
    oxygenSaturation: number;
    temperature: string;
    respiratoryRate: number;
    lastRecorded: string;
  };
  emergencyAlerts: string[];
  knownAllergies: AllergyItem[];
  chronicConditions: ConditionItem[];
  currentMedications: MedicationItem[];
  previousSurgeries: SurgeryItem[];
  recentHospitalVisits: HospitalVisitItem[];
  labReports: LabReportItem[];
  prescriptions: PrescriptionItem[];
  timeline: TimelineItem[];
  records: MedicalRecord[];
  appointments?: AppointmentItem[];
  reminders?: ReminderItem[];
}

export interface SearchEvidence {
  recordId: string;
  recordTitle: string;
  recordType: string;
  dateRecorded: string;
  sourceHospital: string;
  physician: string;
  documentRefNumber: string;
  extractedHighlight: string;
  rawExcerpt: string;
  category: string;
}

export interface AiSearchResult {
  id: string;
  query: string;
  patientId: string;
  patientName: string;
  timestamp: string;
  status: 'RECORD FOUND' | 'NO MATCHING MEDICAL RECORD FOUND' | 'MULTIPLE RECORDS FOUND';
  answer: string;
  confidence: 'High Confidence' | 'Direct Match' | 'Verified In EHR' | 'Information Unavailable';
  evidence: SearchEvidence | null;
  supportingItems?: string[];
  clinicalNotice: string;
  queriedCategory: 'allergies' | 'medications' | 'surgeries' | 'conditions' | 'general' | 'none';
}
