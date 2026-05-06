"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPrescription } from "@/app/(dashboard)/prescriptions/actions";
import { Plus, Trash2, Printer, Save, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export function PrescriptionForm({ patients, doctors }: { patients: any[], doctors: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fontSize, setFontSize] = useState("text-base");
  const [alignment, setAlignment] = useState("text-left");
  
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    notes: "",
  });

  const [medications, setMedications] = useState<Medication[]>([
    { name: "", dosage: "", frequency: "", duration: "" }
  ]);

  const addMedication = () => {
    setMedications([...medications, { name: "", dosage: "", frequency: "", duration: "" }]);
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const updateMedication = (index: number, field: keyof Medication, value: string) => {
    const newMedications = [...medications];
    newMedications[index][field] = value;
    setMedications(newMedications);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("patientId", formData.patientId);
      data.append("doctorId", formData.doctorId);
      data.append("notes", formData.notes);
      data.append("medications", JSON.stringify(medications));
      
      await createPrescription(data);
      alert("Prescription saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Error saving prescription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* Edit Form */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6 print:hidden">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Patient</label>
            <select
              value={formData.patientId}
              onChange={(e) => setFormData({...formData, patientId: e.target.value})}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">Select Patient</option>
              {patients.map(p => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Doctor</label>
            <select
              value={formData.doctorId}
              onChange={(e) => setFormData({...formData, doctorId: e.target.value})}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">Select Doctor</option>
              {doctors.map(d => <option key={d.id} value={d.id}>Dr. {d.firstName} {d.lastName}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Medications</h3>
            <button
              type="button"
              onClick={addMedication}
              className="flex items-center gap-1 text-primary-600 hover:text-primary-700 font-semibold text-xs"
            >
              <Plus className="h-3 w-3" /> Add Row
            </button>
          </div>
          
          {medications.map((med, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-2 items-center pb-3 border-b border-slate-100 last:border-0">
              <div className="col-span-4">
                <input
                  placeholder="Name"
                  value={med.name}
                  onChange={(e) => updateMedication(idx, "name", e.target.value)}
                  className="w-full rounded border border-slate-200 px-2 py-1 text-sm"
                />
              </div>
              <div className="col-span-2">
                <input
                  placeholder="Dosage"
                  value={med.dosage}
                  onChange={(e) => updateMedication(idx, "dosage", e.target.value)}
                  className="w-full rounded border border-slate-200 px-2 py-1 text-sm"
                />
              </div>
              <div className="col-span-3">
                <input
                  placeholder="Freq"
                  value={med.frequency}
                  onChange={(e) => updateMedication(idx, "frequency", e.target.value)}
                  className="w-full rounded border border-slate-200 px-2 py-1 text-sm"
                />
              </div>
              <div className="col-span-2">
                <input
                  placeholder="Dur"
                  value={med.duration}
                  onChange={(e) => updateMedication(idx, "duration", e.target.value)}
                  className="w-full rounded border border-slate-200 px-2 py-1 text-sm"
                />
              </div>
              <div className="col-span-1">
                <button onClick={() => removeMedication(idx)} className="text-slate-400 hover:text-red-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Additional Instructions</label>
          <textarea
            rows={2}
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
          />
        </div>

        <div className="flex gap-4 pt-4 border-t">
          <div className="flex-1 space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Layout</label>
            <div className="flex gap-2">
              <select 
                defaultValue={fontSize}
                onChange={(e) => setFontSize(e.target.value)} 
                className="text-xs border rounded p-1"
              >
                <option value="text-sm">Small</option>
                <option value="text-base">Medium</option>
                <option value="text-lg">Large</option>
              </select>
              <select 
                defaultValue={alignment}
                onChange={(e) => setAlignment(e.target.value)} 
                className="text-xs border rounded p-1"
              >
                <option value="text-left">Left</option>
                <option value="text-center">Center</option>
              </select>
            </div>
          </div>
          <div className="flex items-end gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-md font-semibold hover:bg-slate-800"
            >
              <Printer className="h-4 w-4" />
              Print
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-primary-700"
            >
              <Save className="h-4 w-4" />
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className={cn(
        "bg-white p-12 rounded-xl border border-slate-200 shadow-xl min-h-[600px] flex flex-col",
        "print:border-0 print:shadow-none print:p-0 print:m-0 print:fixed print:inset-0 print:z-50",
        alignment,
        fontSize
      )}>
        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-tighter">Medical Prescription</h1>
            <p className="text-xs text-slate-500 mt-1 italic font-medium">Official Medical Documentation</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-slate-900">ClinicPro Healthcare</p>
            <p className="text-xs text-slate-500">123 Health Ave, Medical City</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b border-slate-100">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Patient Details</p>
            <p className="font-bold text-slate-900">
              {patients.find(p => p.id === formData.patientId)?.firstName || "---"} {patients.find(p => p.id === formData.patientId)?.lastName || ""}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Date</p>
            <p className="font-bold text-slate-900">{new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-3xl font-serif font-bold italic opacity-20 select-none">Rx</span>
          </div>
          
          <table className="w-full text-left">
            <thead className="border-b border-slate-900">
              <tr>
                <th className="py-2 font-bold">Medication</th>
                <th className="py-2 font-bold">Dosage</th>
                <th className="py-2 font-bold">Frequency</th>
                <th className="py-2 font-bold">Duration</th>
              </tr>
            </thead>
            <tbody>
              {medications.map((med, idx) => (
                <tr key={idx} className="border-b border-slate-100 last:border-0">
                  <td className="py-3 font-medium">{med.name || "---"}</td>
                  <td className="py-3">{med.dosage || "---"}</td>
                  <td className="py-3">{med.frequency || "---"}</td>
                  <td className="py-3">{med.duration || "---"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {formData.notes && (
            <div className="mt-8 pt-8 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Special Instructions</p>
              <p className="text-slate-700 leading-relaxed italic">{formData.notes}</p>
            </div>
          )}
        </div>

        <div className="mt-12 pt-12 flex justify-between items-end">
          <div className="text-xs text-slate-400 italic">
            This document is valid only with an authorized signature.
          </div>
          <div className="text-center w-48">
            <div className="border-b-2 border-slate-900 mb-2 h-12" />
            <p className="text-xs font-bold uppercase tracking-widest text-slate-900">
              Dr. {doctors.find(d => d.id === formData.doctorId)?.lastName || "Signature"}
            </p>
            <p className="text-[10px] text-slate-400">Authorized Practitioner</p>
          </div>
        </div>
      </div>
    </div>
  );
}
