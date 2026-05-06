"use client";

import { useState } from "react";
import { createPatient, updatePatient } from "@/app/(dashboard)/patients/actions";
import { Loader2, UserPlus, Save, X } from "lucide-react";

interface PatientFormProps {
  patient?: {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    gender: string;
    contactInfo: string | null;
    address: string | null;
  };
  onClose: () => void;
}

export function PatientForm({ patient, onClose }: PatientFormProps) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      if (patient) {
        await updatePatient(patient.id, formData);
      } else {
        await createPatient(formData);
      }
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to save patient");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            {patient ? <Save className="h-5 w-5 text-primary-600" /> : <UserPlus className="h-5 w-5 text-primary-600" />}
            {patient ? "Edit Patient" : "Add New Patient"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form action={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">First Name</label>
              <input
                name="firstName"
                defaultValue={patient?.firstName}
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Last Name</label>
              <input
                name="lastName"
                defaultValue={patient?.lastName}
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Date of Birth</label>
              <input
                name="dateOfBirth"
                type="date"
                defaultValue={patient?.dateOfBirth ? new Date(patient.dateOfBirth).toISOString().split('T')[0] : ""}
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Gender</label>
              <select
                name="gender"
                defaultValue={patient?.gender || "Male"}
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Contact Info</label>
            <input
              name="contactInfo"
              defaultValue={patient?.contactInfo || ""}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              placeholder="Phone or Email"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Address</label>
            <textarea
              name="address"
              defaultValue={patient?.address || ""}
              rows={2}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none"
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 rounded-lg bg-primary-600 text-white font-bold hover:bg-primary-700 transition-all flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {patient ? "Update Patient" : "Register Patient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
