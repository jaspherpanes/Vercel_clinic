"use client";

import { useState } from "react";
import { createDoctor, updateDoctor } from "@/app/(dashboard)/doctors/actions";
import { Loader2, UserPlus, Save, X } from "lucide-react";

interface DoctorFormProps {
  doctor?: {
    id: string;
    firstName: string;
    lastName: string;
    specialty: string;
    contactInfo: string | null;
  };
  onClose: () => void;
}

export function DoctorForm({ doctor, onClose }: DoctorFormProps) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      if (doctor) {
        await updateDoctor(doctor.id, formData);
      } else {
        await createDoctor(formData);
      }
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to save doctor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            {doctor ? <Save className="h-5 w-5 text-primary-600" /> : <UserPlus className="h-5 w-5 text-primary-600" />}
            {doctor ? "Edit Doctor" : "Add New Doctor"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form action={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">First Name</label>
              <input
                name="firstName"
                defaultValue={doctor?.firstName}
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 transition-all"
                placeholder="e.g. Jane"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Last Name</label>
              <input
                name="lastName"
                defaultValue={doctor?.lastName}
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 transition-all"
                placeholder="e.g. Smith"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Specialty</label>
            <input
              name="specialty"
              defaultValue={doctor?.specialty}
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 transition-all"
              placeholder="e.g. Cardiology, Pediatrics"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Contact Info (Email/Phone)</label>
            <input
              name="contactInfo"
              defaultValue={doctor?.contactInfo || ""}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 transition-all"
              placeholder="jane.smith@example.com"
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
              {doctor ? "Save Changes" : "Add Doctor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
