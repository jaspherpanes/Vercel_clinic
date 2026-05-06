import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Stethoscope, Calendar, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function ConsultationsPage() {
  const consultations = await prisma.consultation.findMany({
    include: {
      patient: true,
      doctor: true,
    },
    orderBy: { date: "desc" },
  });

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-slate-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Consultation Records
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            View and manage all patient medical encounters.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link
            href="/consultations/new"
            className="flex items-center gap-2 rounded-md bg-primary-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Consultation
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
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Diagnosis</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Status</th>
              <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {consultations.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-slate-900 sm:pl-6">
                  {new Date(c.date).toLocaleDateString()}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                  <Link href={`/patients/${c.patientId}`} className="text-primary-600 hover:underline">
                    {c.patient.firstName} {c.patient.lastName}
                  </Link>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                  Dr. {c.doctor.firstName} {c.doctor.lastName}
                </td>
                <td className="px-3 py-4 text-sm text-slate-900 max-w-xs truncate font-medium">
                  {c.diagnosis || "---"}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                  <span className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset",
                    c.status === "COMPLETED" ? "bg-green-50 text-green-700 ring-green-600/20" : "bg-amber-50 text-amber-700 ring-amber-600/20"
                  )}>
                    {c.status}
                  </span>
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <div className="flex justify-end gap-3">
                    <Link href={`/consultations/${c.id}`} className="text-primary-600 hover:text-primary-900 font-black uppercase text-[10px] tracking-widest bg-primary-50 px-3 py-1 rounded-full ring-1 ring-primary-100 hover:bg-primary-600 hover:text-white transition-all">
                      View Record
                    </Link>
                    <Link href={`/patients/${c.patientId}`} className="text-slate-400 hover:text-slate-900 font-black uppercase text-[10px] tracking-widest">
                      Patient Profile
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {consultations.length === 0 && (
          <div className="py-12 text-center text-slate-500">
            <Stethoscope className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            <p>No consultations found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
