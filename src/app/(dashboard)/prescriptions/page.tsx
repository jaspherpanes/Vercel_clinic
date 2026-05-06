import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Pill, Calendar, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function PrescriptionsPage() {
  const prescriptions = await prisma.prescription.findMany({
    include: {
      patient: true,
      doctor: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-slate-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Prescriptions
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            View and manage patient prescriptions.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link
            href="/prescriptions/new"
            className="flex items-center gap-2 rounded-md bg-primary-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Prescription
          </Link>
        </div>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-slate-200 sm:rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-slate-300">
          <thead className="bg-slate-50">
            <tr>
              <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6">Date</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Patient</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Doctor</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Medications</th>
              <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {prescriptions.map((p) => {
              const meds = JSON.parse(p.medications);
              return (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-slate-900 sm:pl-6">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                    {p.patient.firstName} {p.patient.lastName}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                    Dr. {p.doctor.firstName} {p.doctor.lastName}
                  </td>
                  <td className="px-3 py-4 text-sm text-slate-900 max-w-xs truncate font-medium">
                    {meds.map((m: any) => m.name).join(", ")}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <Link 
                      href={`/prescriptions/${p.id}`}
                      className="text-primary-600 hover:text-primary-900 font-bold"
                    >
                      View / Print
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {prescriptions.length === 0 && (
          <div className="py-12 text-center text-slate-500">
            <Pill className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            <p>No prescriptions found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
