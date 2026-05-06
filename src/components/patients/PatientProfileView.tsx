"use client";

import { useState } from "react";
import { 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  Activity, 
  ClipboardList, 
  Pill, 
  FlaskConical, 
  Receipt, 
  FileText, 
  AlertCircle,
  Plus,
  ArrowUpRight,
  ChevronRight,
  Clock,
  Printer
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface PatientProfileViewProps {
  patient: any;
}

export function PatientProfileView({ patient }: PatientProfileViewProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", name: "Overview", icon: Activity },
    { id: "consultations", name: "Consultations", icon: ClipboardList },
    { id: "medications", name: "Medications", icon: Pill },
    { id: "labs", name: "Labs & Diagnostics", icon: FlaskConical },
    { id: "billing", name: "Billing", icon: Receipt },
    { id: "documents", name: "Documents", icon: FileText },
  ];

  const latestConsultation = patient.consultations[0];
  const vitals = latestConsultation?.vitalSigns ? JSON.parse(latestConsultation.vitalSigns) : null;
  const allergies = patient.consultations.map((c: any) => {
    const history = c.pastHistory ? JSON.parse(c.pastHistory) : null;
    return history?.allergies;
  }).filter(Boolean).join(", ");

  const age = new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear();

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* 👤 Professional Header Section */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden relative">
        <div className="bg-slate-900 h-32 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>
        <div className="px-10 pb-10 -mt-16 relative z-10">
          <div className="flex flex-col lg:flex-row items-end justify-between gap-8">
            <div className="flex items-end gap-8">
              <div className="h-40 w-40 rounded-[2rem] bg-white p-2 shadow-2xl ring-1 ring-slate-100">
                <div className="h-full w-full rounded-[1.5rem] bg-primary-50 flex items-center justify-center text-primary-600 border border-primary-100">
                  <User className="h-20 w-20" />
                </div>
              </div>
              <div className="pb-2">
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                    {patient.firstName} {patient.lastName}
                  </h1>
                  <span className="bg-primary-50 text-primary-700 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ring-1 ring-primary-100">
                    ID: {patient.id.slice(-8).toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-wrap gap-6 text-sm font-bold text-slate-500">
                  <span className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                    <Calendar className="h-4 w-4 text-primary-500" />
                    {new Date(patient.dateOfBirth).toLocaleDateString()} ({age} yrs)
                  </span>
                  <span className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 capitalize">
                    <User className="h-4 w-4 text-primary-500" />
                    {patient.gender}
                  </span>
                  <span className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                    <Phone className="h-4 w-4 text-primary-500" />
                    {patient.contactInfo || "N/A"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-4 pb-2 w-full lg:w-auto">
              <Link
                href={`/consultations/new?patientId=${patient.id}`}
                className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-primary-200 hover:bg-primary-700 hover:-translate-y-1 transition-all active:scale-95"
              >
                <Plus className="h-5 w-5" />
                New Consultation
              </Link>
            </div>
          </div>

          {/* 🚨 High Priority Alerts */}
          {allergies && (
            <div className="mt-8 flex items-center gap-4 bg-red-50 border border-red-100 p-4 rounded-2xl animate-pulse">
              <div className="h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600 shadow-sm">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-black text-red-600 uppercase tracking-widest">Medical Alert: Allergies</h4>
                <p className="text-sm font-bold text-red-900">{allergies}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ⚙️ Tab Navigation */}
      <div className="flex gap-2 p-1.5 bg-slate-100 rounded-3xl w-fit border border-slate-200 shadow-inner">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all",
              activeTab === tab.id 
                ? "bg-white text-primary-600 shadow-md ring-1 ring-slate-200" 
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
            )}
          >
            <tab.icon className={cn("h-4 w-4", activeTab === tab.id ? "text-primary-600" : "text-slate-400")} />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content Areas */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* --- OVERVIEW --- */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Snapshot Panel */}
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-[2rem] shadow-lg border border-slate-100 group hover:shadow-2xl transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Latest Vitals</h4>
                    <Activity className="h-4 w-4 text-red-500" />
                  </div>
                  {vitals ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-3xl font-black text-slate-900">{vitals.bp || "---"}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">BP (mmHg)</p>
                      </div>
                      <div>
                        <p className="text-3xl font-black text-slate-900">{vitals.temp || "---"}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Temp (°C)</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 italic">No vitals on record</p>
                  )}
                </div>
                <div className="bg-white p-8 rounded-[2rem] shadow-lg border border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Status</h4>
                    <Clock className="h-4 w-4 text-primary-500" />
                  </div>
                  <p className="text-3xl font-black text-slate-900">{latestConsultation?.diagnosis || "No Diagnosis"}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Last Visit: {latestConsultation ? new Date(latestConsultation.date).toLocaleDateString() : "Never"}</p>
                </div>
              </div>

              {/* Quick Actions / Summary */}
              <div className="bg-white rounded-[2rem] p-8 shadow-lg border border-slate-100">
                <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
                    <ClipboardList className="h-5 w-5" />
                  </div>
                  Visit Summary
                </h3>
                <div className="space-y-4">
                  {patient.consultations.slice(0, 3).map((c: any) => (
                    <div key={c.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-md transition-all cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className="text-center w-12">
                          <p className="text-xs font-black text-slate-400 uppercase">{new Date(c.date).toLocaleString('default', { month: 'short' })}</p>
                          <p className="text-lg font-black text-slate-900">{new Date(c.date).getDate()}</p>
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{c.diagnosis || "Medical Consultation"}</p>
                          <p className="text-xs text-slate-500 font-medium">Dr. {c.doctor.firstName} {c.doctor.lastName}</p>
                        </div>
                      </div>
                      <Link href={`/consultations/${c.id}`} className="p-2 rounded-xl bg-white text-slate-400 group-hover:text-primary-600 transition-all border border-transparent group-hover:border-primary-100">
                        <ChevronRight className="h-5 w-5" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Side Info Panel */}
            <div className="space-y-8">
              <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Patient Contact</h4>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <MapPin className="h-5 w-5 text-primary-500" />
                    <div>
                      <p className="text-xs font-bold text-slate-400 mb-1 uppercase">Address</p>
                      <p className="text-sm font-medium leading-relaxed">{patient.address || "No address on record"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <FileText className="h-5 w-5 text-primary-500" />
                    <div>
                      <p className="text-xs font-bold text-slate-400 mb-1 uppercase">Blood Type</p>
                      <p className="text-sm font-black underline decoration-primary-500">O Positive (Simulated)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- CONSULTATIONS TAB --- */}
        {activeTab === "consultations" && (
          <div className="bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="py-4 pl-8 pr-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                  <th className="px-3 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Attending Doctor</th>
                  <th className="px-3 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Diagnosis</th>
                  <th className="relative py-4 pl-3 pr-8"><span className="sr-only">View</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {patient.consultations.map((c: any) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="whitespace-nowrap py-4 pl-8 pr-3 text-sm font-bold text-slate-900">{new Date(c.date).toLocaleDateString()}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-600 font-medium">Dr. {c.doctor.firstName} {c.doctor.lastName}</td>
                    <td className="px-3 py-4 text-sm font-bold text-slate-900 truncate max-w-xs">{c.diagnosis}</td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-8 text-right text-sm font-medium">
                      <Link href={`/consultations/${c.id}`} className="text-primary-600 hover:text-primary-900 font-black uppercase text-[10px] tracking-widest">
                        Full Report
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- MEDICATIONS TAB --- */}
        {activeTab === "medications" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patient.consultations.map((c: any) => {
              const plan = c.treatmentPlan ? JSON.parse(c.treatmentPlan) : null;
              if (!plan?.medications?.length) return null;
              return plan.medications.map((med: any, idx: number) => (
                <div key={`${c.id}-${idx}`} className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 flex items-start gap-4 hover:shadow-2xl transition-all">
                  <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                    <Pill className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900">{med.name}</h4>
                    <p className="text-xs font-bold text-slate-500 uppercase mt-1">{med.dosage} • {med.frequency}</p>
                    <div className="mt-4 pt-4 border-t border-slate-50 text-[10px] text-slate-400">
                      <p className="font-bold">PRESCRIBED BY:</p>
                      <p className="uppercase tracking-widest">Dr. {c.doctor.lastName} • {new Date(c.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ));
            })}
          </div>
        )}

        {/* --- BILLING TAB --- */}
        {activeTab === "billing" && (
          <div className="bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="py-4 pl-8 pr-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Invoice</th>
                  <th className="px-3 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                  <th className="px-3 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-3 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                  <th className="relative py-4 pl-3 pr-8"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {patient.billings.map((b: any) => (
                  <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                    <td className="whitespace-nowrap py-4 pl-8 pr-3 text-sm font-black text-primary-600">{b.invoiceNo || "---"}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm font-black text-slate-900">₱{b.totalAmount.toFixed(2)}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-black ring-1 ring-inset",
                        b.status === "PAID" ? "bg-green-50 text-green-700 ring-green-600/20" : "bg-amber-50 text-amber-700 ring-amber-600/20"
                      )}>
                        {b.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 font-bold">{new Date(b.createdAt).toLocaleDateString()}</td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-8 text-right text-sm">
                      <button className="text-slate-400 hover:text-slate-900 transition-colors">
                        <Printer className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}
