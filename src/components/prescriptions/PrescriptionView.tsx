"use client";

import { Pill, Printer, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface PrescriptionViewProps {
  prescription: {
    id: string;
    medications: string;
    patient: { firstName: string; lastName: string; gender: string; dateOfBirth: Date };
    doctor: { firstName: string; lastName: string; specialty: string };
    createdAt: Date;
  };
}

export function PrescriptionView({ prescription }: PrescriptionViewProps) {
  const medications = JSON.parse(prescription.medications);
  const [fontSize, setFontSize] = useState("text-base");
  const [alignment, setAlignment] = useState("text-left");

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between no-print">
        <Link
          href="/prescriptions"
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to list
        </Link>
        <div className="flex gap-4 items-center">
          <select 
            defaultValue={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            className="text-xs border border-slate-200 rounded px-2 py-1 outline-none"
          >
            <option value="text-sm">Small</option>
            <option value="text-base">Medium</option>
            <option value="text-lg">Large</option>
          </select>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-800 transition-all"
          >
            <Printer className="h-4 w-4" />
            Print Prescription
          </button>
        </div>
      </div>

      <div className={`bg-white shadow-2xl rounded-2xl p-12 min-h-[800px] border border-slate-100 ${fontSize} ${alignment}`}>
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-8 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Medical Prescription</h1>
            <p className="text-slate-500 font-medium">ClinicPro Medical Management System</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-slate-900 underline decoration-primary-500">Dr. {prescription.doctor.firstName} {prescription.doctor.lastName}</p>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{prescription.doctor.specialty}</p>
          </div>
        </div>

        {/* Patient Info */}
        <div className="grid grid-cols-2 gap-8 mb-12 bg-slate-50 p-6 rounded-xl border border-slate-100 no-print-bg">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Patient Name</label>
            <p className="font-bold text-slate-900">{prescription.patient.firstName} {prescription.patient.lastName}</p>
          </div>
          <div className="text-right">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Date</label>
            <p className="font-bold text-slate-900">{new Date(prescription.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* RX Symbol */}
        <div className="mb-6">
          <span className="text-5xl font-serif italic font-black text-slate-900">Rx</span>
        </div>

        {/* Medications Table */}
        <div className="space-y-8">
          {medications.map((med: any, idx: number) => (
            <div key={idx} className="border-b border-slate-100 pb-4">
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-black text-xl text-slate-900">{med.name}</span>
                <span className="text-sm font-bold text-slate-500 uppercase">Qty: {med.dosage}</span>
              </div>
              <p className="text-slate-600 italic leading-relaxed">{med.instructions}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-20 pt-12 border-t border-slate-100 flex justify-between items-end">
          <div className="text-[10px] text-slate-400 font-medium">
            <p>Invoice ID: {prescription.id}</p>
            <p>Digital Signature Verified</p>
          </div>
          <div className="text-center w-48">
            <div className="border-b border-slate-900 h-12 mb-2" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Doctor's Signature</p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          .no-print { display: none !important; }
          .bg-white { box-shadow: none !important; border: none !important; }
          .rounded-2xl { border-radius: 0 !important; }
          .p-12 { padding: 0 !important; }
          .min-h-\\[800px\\] { min-height: 0 !important; }
          .shadow-2xl { box-shadow: none !important; }
          .bg-white, .bg-white * { visibility: visible; }
          .bg-white { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print-bg { background-color: transparent !important; }
        }
      `}</style>
    </div>
  );
}
