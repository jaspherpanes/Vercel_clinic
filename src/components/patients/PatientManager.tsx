"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Pencil, Trash2, Eye, User as UserIcon } from "lucide-react";
import { PatientForm } from "./PatientForm";
import { deletePatient } from "@/app/(dashboard)/patients/actions";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: string;
  contactInfo: string | null;
  address: string | null;
}

interface PatientManagerProps {
  patients: Patient[];
}

export function PatientManager({ patients: initialPatients }: PatientManagerProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setSearchQuery(q);
  }, [searchParams]);

  const filteredPatients = initialPatients.filter((p) => {
    const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this patient record?")) {
      try {
        await deletePatient(id);
      } catch (error) {
        console.error(error);
        alert("Failed to delete patient");
      }
    }
  }

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-slate-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Patient Management
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Search, register, and manage patient clinical profiles.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            onClick={() => {
              setEditingPatient(null);
              setIsFormOpen(true);
            }}
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-center text-sm font-bold text-white shadow-sm hover:bg-primary-500 transition-all hover:scale-105"
          >
            <Plus className="h-4 w-4" />
            Add Patient
          </button>
        </div>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-slate-200 sm:rounded-2xl overflow-hidden border border-slate-200">
        <div className="border-b border-slate-200 px-6 py-4 bg-slate-50/30 flex items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-lg border-0 py-2 pl-10 pr-3 text-slate-900 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-primary-600 sm:text-sm transition-all"
            />
          </div>
          <div className="text-xs font-bold text-slate-400">
            {filteredPatients.length} Patients Found
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="py-4 pl-6 pr-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Patient Name</th>
                <th className="px-3 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">DOB</th>
                <th className="px-3 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Gender</th>
                <th className="px-3 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                <th className="relative py-4 pl-3 pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="whitespace-nowrap py-4 pl-6 pr-3 sm:pl-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 font-bold group-hover:bg-primary-600 group-hover:text-white transition-all">
                        {patient.firstName[0]}{patient.lastName[0]}
                      </div>
                      <div className="font-bold text-slate-900">{patient.firstName} {patient.lastName}</div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-600">
                    {new Date(patient.dateOfBirth).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold ring-1 ring-inset",
                      patient.gender === "Male" ? "bg-blue-50 text-blue-700 ring-blue-600/20" : "bg-pink-50 text-pink-700 ring-pink-600/20"
                    )}>
                      {patient.gender}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 font-medium">
                    {patient.contactInfo || "-"}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/patients/${patient.id}`}
                        className="p-2 text-slate-400 hover:text-primary-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all"
                        title="View Profile"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => {
                          setEditingPatient(patient);
                          setIsFormOpen(true);
                        }}
                        className="p-2 text-slate-400 hover:text-primary-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all"
                        title="Edit Record"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(patient.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all"
                        title="Delete Record"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredPatients.length === 0 && (
          <div className="py-20 text-center text-slate-400">
            <UserIcon className="mx-auto h-12 w-12 text-slate-200 mb-4" />
            <p className="font-medium text-lg text-slate-900">No patients found</p>
            <p className="text-sm">Try searching for a different name or add a new record.</p>
          </div>
        )}
      </div>

      {isFormOpen && (
        <PatientForm
          patient={editingPatient || undefined}
          onClose={() => {
            setIsFormOpen(false);
            setEditingPatient(null);
          }}
        />
      )}
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
