"use client";

import { useState } from "react";
import { Stethoscope, UserPlus, Pencil, Trash2 } from "lucide-react";
import { DoctorForm } from "./DoctorForm";
import { deleteDoctor } from "@/app/(dashboard)/doctors/actions";

interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
  contactInfo: string | null;
}

interface DoctorManagerProps {
  doctors: Doctor[];
}

export function DoctorManager({ doctors }: DoctorManagerProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this doctor?")) {
      try {
        await deleteDoctor(id);
      } catch (error) {
        console.error(error);
        alert("Failed to delete doctor");
      }
    }
  }

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-slate-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Doctors Directory
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            A complete directory of all active doctors and their specialties.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            onClick={() => {
              setEditingDoctor(null);
              setIsFormOpen(true);
            }}
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-center text-sm font-bold text-white shadow-sm hover:bg-primary-500 transition-all hover:scale-105"
          >
            <UserPlus className="h-5 w-5" />
            Add Doctor
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {doctors.map((doctor) => (
          <div
            key={doctor.id}
            className="col-span-1 divide-y divide-slate-200 rounded-2xl bg-white shadow-sm border border-slate-200 transition-all hover:shadow-lg hover:-translate-y-1 group"
          >
            <div className="flex w-full items-center justify-between space-x-6 p-6">
              <div className="flex-1 truncate">
                <div className="flex items-center space-x-3">
                  <h3 className="truncate text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                    Dr. {doctor.firstName} {doctor.lastName}
                  </h3>
                  <span className="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-700 ring-1 ring-inset ring-green-600/20">
                    ACTIVE
                  </span>
                </div>
                <p className="mt-1 truncate text-sm font-medium text-primary-600/70">{doctor.specialty}</p>
                <p className="mt-2 truncate text-xs text-slate-400 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  {doctor.contactInfo || "No contact info"}
                </p>
              </div>
              <div className="h-14 w-14 flex-shrink-0 rounded-2xl bg-primary-50 flex items-center justify-center group-hover:bg-primary-600 group-hover:rotate-12 transition-all duration-300">
                <Stethoscope className="h-7 w-7 text-primary-600 group-hover:text-white transition-colors" />
              </div>
            </div>
            <div className="bg-slate-50/50 p-2 flex gap-2">
              <button
                onClick={() => {
                  setEditingDoctor(doctor);
                  setIsFormOpen(true);
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold text-slate-600 hover:text-primary-600 hover:bg-white rounded-xl transition-all"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(doctor.id)}
                className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold text-slate-600 hover:text-red-600 hover:bg-white rounded-xl transition-all"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {isFormOpen && (
        <DoctorForm
          doctor={editingDoctor || undefined}
          onClose={() => {
            setIsFormOpen(false);
            setEditingDoctor(null);
          }}
        />
      )}
    </div>
  );
}
