"use client";

import { 
  Activity, 
  Stethoscope, 
  Pill, 
  Calendar, 
  ArrowLeft, 
  User, 
  FileText, 
  Lock, 
  Printer, 
  Clock,
  ClipboardList
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ConsultationDetailProps {
  consultation: any;
}

export function ConsultationDetail({ consultation }: ConsultationDetailProps) {
  const vitals = consultation.vitalSigns ? JSON.parse(consultation.vitalSigns) : {};
  const hpi = consultation.hpi ? JSON.parse(consultation.hpi) : {};
  const physicalExam = consultation.physicalExam ? JSON.parse(consultation.physicalExam) : {};
  const pastHistory = consultation.pastHistory ? JSON.parse(consultation.pastHistory) : {};
  const treatmentPlan = consultation.treatmentPlan ? JSON.parse(consultation.treatmentPlan) : { medications: [], procedures: [] };

  const age = new Date().getFullYear() - new Date(consultation.patient.dateOfBirth).getFullYear();

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header / Top Bar */}
      <div className="flex items-center justify-between no-print">
        <Link
          href="/consultations"
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Records
        </Link>
        <div className="flex gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-bold hover:bg-slate-200 transition-all text-sm"
          >
            <Printer className="h-4 w-4" />
            Print Record
          </button>
          <Link
            href={`/consultations/${consultation.id}/edit`}
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-100 text-sm"
          >
            Edit Record
          </Link>
        </div>
      </div>

      {/* Main Record Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Context Strip */}
        <div className="bg-slate-900 px-10 py-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center text-white ring-1 ring-white/20">
              <User className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">{consultation.patient.firstName} {consultation.patient.lastName}</h1>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                Age: {age} • Sex: {consultation.patient.gender} • ID: {consultation.patient.id.slice(-8).toUpperCase()}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className={cn(
              "inline-flex items-center rounded-full px-3 py-1 text-xs font-black ring-1 ring-inset mb-2",
              consultation.status === "COMPLETED" ? "bg-green-500/10 text-green-400 ring-green-500/20" : "bg-amber-500/10 text-amber-400 ring-amber-500/20"
            )}>
              {consultation.status}
            </span>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Visit Date</p>
            <p className="text-white font-bold">{new Date(consultation.date).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="p-10 space-y-12">
          {/* Section: Visit Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Chief Complaint</h3>
                <p className="text-2xl font-bold text-slate-900 leading-tight">
                  {consultation.chiefComplaint || "No chief complaint recorded."}
                </p>
              </div>
              
              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">History of Present Illness (HPI)</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Onset</span>
                    <p className="text-sm font-bold text-slate-900">{hpi.onset || "---"}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Duration</span>
                    <p className="text-sm font-bold text-slate-900">{hpi.duration || "---"}</p>
                  </div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed italic">
                  {hpi.progression || "No narrative history available."}
                </p>
              </div>
            </div>

            <div className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Activity className="h-4 w-4 text-red-500" />
                Vitals recorded
              </h3>
              <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block">BP</label>
                  <p className="font-black text-slate-900">{vitals.bp || "---"}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block">HR</label>
                  <p className="font-black text-slate-900">{vitals.hr || "---"} <span className="text-[8px] text-slate-400">bpm</span></p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block">Temp</label>
                  <p className="font-black text-slate-900">{vitals.temp || "---"} <span className="text-[8px] text-slate-400">°C</span></p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block">SpO2</label>
                  <p className="font-black text-slate-900">{vitals.spo2 || "---"} <span className="text-[8px] text-slate-400">%</span></p>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase">Calculated BMI</span>
                <span className="text-xl font-black text-primary-600">{vitals.bmi || "---"}</span>
              </div>
            </div>
          </div>

          {/* Section: Physical Exam & Assessment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-slate-100">
            <div className="space-y-6">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-primary-600" />
                Physical Examination
              </h3>
              <div className="space-y-4">
                {Object.entries(physicalExam as Record<string, any>).map(([key, value]) => value && (
                  <div key={key}>
                    <label className="text-[10px] font-bold text-primary-600 uppercase block mb-1">{key}</label>
                    <p className="text-sm text-slate-700">{String(value)}</p>
                  </div>
                ))}
                {!Object.values(physicalExam as Record<string, any>).some(v => v) && <p className="text-sm text-slate-400 italic">No physical exam findings recorded.</p>}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-primary-600" />
                Assessment & Diagnosis
              </h3>
              <div className="bg-primary-50/30 p-6 rounded-2xl border border-primary-100">
                <label className="text-[10px] font-bold text-primary-600 uppercase block mb-1">Primary Diagnosis</label>
                <p className="text-xl font-black text-slate-900 mb-4">{consultation.diagnosis}</p>
                
                {consultation.secondaryDiag && (
                  <div className="mb-4">
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Secondary</label>
                    <p className="text-sm font-bold text-slate-700">{consultation.secondaryDiag}</p>
                  </div>
                )}
                
                {consultation.icdCodes && (
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">ICD-10 Code</label>
                    <span className="inline-flex items-center rounded-md bg-white px-2 py-1 text-xs font-bold text-slate-700 ring-1 ring-inset ring-slate-200">
                      {consultation.icdCodes}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section: Treatment Plan */}
          <div className="pt-12 border-t border-slate-100">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <Pill className="h-4 w-4 text-primary-600" />
              Treatment Plan & Orders
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-900">Prescribed Medications</h4>
                <div className="space-y-3">
                  {treatmentPlan.medications?.map((med: any, i: number) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                      <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-primary-600 shadow-sm">
                        <Pill className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{med.name} <span className="text-xs text-slate-500 font-normal ml-2">{med.dosage}</span></p>
                        <p className="text-xs text-slate-500 mt-0.5">{med.frequency} • {med.duration}</p>
                      </div>
                    </div>
                  ))}
                  {(!treatmentPlan.medications || treatmentPlan.medications.length === 0) && (
                    <p className="text-sm text-slate-400 italic">No medications prescribed.</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-900">Procedures & Follow-up</h4>
                <div className="space-y-4">
                  {treatmentPlan.procedures?.map((proc: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 text-sm">
                      <div className="h-2 w-2 rounded-full bg-primary-500" />
                      <span className="font-bold text-slate-700">{proc.name}</span>
                    </div>
                  ))}
                  <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                    <div className="flex items-center gap-2 text-amber-700 font-bold text-sm mb-2">
                      <Calendar className="h-4 w-4" />
                      Follow-up Instruction
                    </div>
                    <p className="text-sm text-amber-900 font-medium">
                      Return for review on <span className="font-black underline">{consultation.followUpDate ? new Date(consultation.followUpDate).toLocaleDateString() : "TBD"}</span>
                    </p>
                    <p className="text-xs text-amber-700 mt-2 italic">{consultation.followUpNotes || "Follow standard post-consultation care."}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer / Signature Strip */}
        <div className="bg-slate-50 px-10 py-8 border-t border-slate-200 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Attending Physician</p>
              <p className="font-bold text-slate-900 underline decoration-primary-500">Dr. {consultation.doctor.firstName} {consultation.doctor.lastName}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Clinic Record Digital Seal</p>
            <div className="flex items-center gap-2 text-primary-600 font-black text-sm">
              <Clock className="h-4 w-4" />
              {new Date(consultation.createdAt).toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Private Notes (Non-printable) */}
      {consultation.privateNotes && (
        <div className="bg-slate-900 rounded-3xl p-8 text-white no-print">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 mb-4">
            <Lock className="h-4 w-4" />
            🔐 Doctor's Private Notes
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed italic">
            {consultation.privateNotes}
          </p>
        </div>
      )}
    </div>
  );
}
