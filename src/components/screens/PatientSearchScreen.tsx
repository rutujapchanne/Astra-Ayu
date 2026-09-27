import { useState, useMemo } from 'react';
import { Patient, ScreenType } from '../../types';
import { Search, QrCode, ArrowRight, UserCheck, CheckCircle2, Shield } from 'lucide-react';

interface Props {
  patients: Patient[];
  activePatientId: string;
  onSelectPatient: (patientId: string) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const PatientSearchScreen = ({
  patients,
  activePatientId,
  onSelectPatient,
  onNavigate,
}: Props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isScanningQR, setIsScanningQR] = useState(false);
  const [scanMessage, setScanMessage] = useState('');

  const filteredPatients = useMemo(() => {
    if (!searchTerm.trim()) return patients;
    const term = searchTerm.toLowerCase();
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.id.toLowerCase().includes(term) ||
        p.phone.includes(term) ||
        p.bloodGroup.toLowerCase().includes(term)
    );
  }, [patients, searchTerm]);

  const handleSimulateQRScan = () => {
    setIsScanningQR(true);
    setScanMessage('Calibrating optical scanner for hospital wristband / patient card...');
    setTimeout(() => {
      setScanMessage('Scanning digital QR identifier: AST-10021 (Aarav Sharma)...');
    }, 900);
    setTimeout(() => {
      setIsScanningQR(false);
      onSelectPatient('AST-10021');
      onNavigate('patient_profile');
    }, 1900);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Title & Description */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Find Patient</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Look up patient records by Patient ID, Name, Phone or Hospital Emergency Wristband QR.
        </p>
      </div>

      {/* Search Bar & QR Scanner Trigger */}
      <div className="bg-white p-4 sm:p-5 border border-slate-200 rounded-2xl shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Patient ID, Name, Phone or QR..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          <button
            onClick={handleSimulateQRScan}
            disabled={isScanningQR}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-teal-700" />
            <span>Scan Wristband QR</span>
          </button>
        </div>

        {/* QR Scanner Simulation Modal / Drawer */}
        {isScanningQR && (
          <div className="p-4 bg-teal-950 text-white rounded-xl border border-teal-800 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-teal-400">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                <span>CAMERA / OPTICAL SCANNER ACTIVE</span>
              </div>
              <button
                onClick={() => setIsScanningQR(false)}
                className="text-xs text-teal-300 hover:text-white"
              >
                Cancel
              </button>
            </div>
            <div className="relative h-32 w-full bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center border border-teal-700">
              <div className="w-40 h-24 border-2 border-dashed border-teal-400 rounded-md flex items-center justify-center">
                <div className="w-full h-0.5 bg-teal-400/80 animate-bounce" />
              </div>
            </div>
            <p className="text-xs text-center text-teal-200 font-mono">{scanMessage}</p>
          </div>
        )}

        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <Shield className="w-3.5 h-3.5 text-teal-600" />
          <span>Patient data masked according to emergency privacy standards. Sensitive identifiers shielded.</span>
        </div>
      </div>

      {/* Patient Results List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
          <span>Available Patients ({filteredPatients.length})</span>
          {searchTerm && <span>Filtered by &ldquo;{searchTerm}&rdquo;</span>}
        </div>

        {filteredPatients.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
            <p className="text-sm font-semibold text-slate-800">No matching patient record found</p>
            <p className="text-xs text-slate-500 mt-1">
              Verify the Patient ID (e.g., AST-10021) or search by patient full name.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredPatients.map((patient) => {
              const isActive = patient.id === activePatientId;
              return (
                <div
                  key={patient.id}
                  onClick={() => {
                    onSelectPatient(patient.id);
                    onNavigate('patient_profile');
                  }}
                  className={`p-4 bg-white border rounded-2xl transition-all hover:shadow-xs hover:border-teal-500 cursor-pointer flex flex-col justify-between ${
                    isActive ? 'border-teal-500 ring-2 ring-teal-500/20 bg-teal-50/20' : 'border-slate-200'
                  }`}
                >
                  <div>
                    {/* Top Row: Patient Name & ID */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-base">{patient.name}</h3>
                          {isActive && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-800 bg-teal-100 px-1.5 py-0.5 rounded">
                              <CheckCircle2 className="w-3 h-3 text-teal-700" />
                              Active
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-mono text-slate-500 mt-0.5">
                          ID: <span className="font-semibold text-slate-700">{patient.id}</span>
                        </div>
                      </div>

                      {/* Blood Group Display */}
                      <div className="text-right">
                        <div className="text-[10px] uppercase font-bold text-slate-400">Blood</div>
                        <div className="font-extrabold text-sm text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
                          {patient.bloodGroup}
                        </div>
                      </div>
                    </div>

                    {/* Minimal essential patient parameters: Age, Gender, Blood Group */}
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600">
                      <span>Age: <strong className="text-slate-900">{patient.age}</strong> yrs</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span>Gender: <strong className="text-slate-900">{patient.gender}</strong></span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="truncate text-slate-500">{patient.admissionStatus}</span>
                    </div>
                  </div>

                  {/* Action Link */}
                  <div className="mt-4 pt-2 flex items-center justify-between text-xs font-semibold text-teal-700 group">
                    <span className="flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Select & Open Profile</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-teal-600 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
