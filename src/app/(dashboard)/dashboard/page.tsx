import { prisma } from "@/lib/prisma";
import { Users, Stethoscope, Calendar, TrendingUp, ClipboardList, Pill, Receipt, Plus } from "lucide-react";
import Link from "next/link";
import { PushNotificationManager } from "@/components/pwa/PushNotificationManager";

export default async function DashboardPage() {
  const patientCount = await prisma.patient.count();
  const doctorCount = await prisma.doctor.count();
  const consultationCount = await prisma.consultation.count();

  const quickActions = [
    { name: "New Consultation", href: "/consultations/new", icon: ClipboardList, color: "bg-blue-600" },
    { name: "New Prescription", href: "/prescriptions/new", icon: Pill, color: "bg-emerald-600" },
    { name: "Create Invoice", href: "/billing/new", icon: Receipt, color: "bg-purple-600" },
    { name: "Add Patient", href: "/patients/new", icon: Plus, color: "bg-slate-900" },
  ];

  const stats = [
    { name: "Total Patients", value: patientCount, icon: Users, change: "+4.75%", changeType: "positive" },
    { name: "Active Doctors", value: doctorCount, icon: Stethoscope, change: "+1.02%", changeType: "positive" },
    { name: "Consultations", value: consultationCount, icon: Calendar, change: "-0.56%", changeType: "negative" },
    { name: "Revenue", value: "$12,426", icon: TrendingUp, change: "+14.05%", changeType: "positive" },
  ];

  const recentPatients = await prisma.patient.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold leading-7 text-slate-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Dashboard Overview
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {quickActions.map((action) => (
          <Link
            key={action.name}
            href={action.href}
            className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group"
          >
            <div className={`p-3 rounded-lg ${action.color} text-white group-hover:scale-110 transition-transform`}>
              <action.icon className="h-6 w-6" />
            </div>
            <span className="font-bold text-slate-900">{action.name}</span>
          </Link>
        ))}
      </div>

      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6 border border-slate-100"
          >
            <dt>
              <div className="absolute rounded-md bg-primary-50 p-3">
                <item.icon className="h-6 w-6 text-primary-600" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-slate-500">{item.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-slate-900">{item.value}</p>
              <p
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  item.changeType === "positive" ? "text-green-600" : "text-red-600"
                }`}
              >
                {item.change}
              </p>
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h3 className="text-base font-semibold leading-6 text-slate-900 mb-4">Recent Patients</h3>
          <div className="overflow-hidden bg-white shadow sm:rounded-md border border-slate-100">
            <ul role="list" className="divide-y divide-slate-200">
              {recentPatients.map((patient) => (
                <li key={patient.id}>
                  <div className="flex items-center px-4 py-4 sm:px-6 hover:bg-slate-50 transition-colors">
                    <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                      <div className="truncate">
                        <div className="flex text-sm">
                          <p className="truncate font-medium text-primary-600">
                            {patient.firstName} {patient.lastName}
                          </p>
                          <p className="ml-1 flex-shrink-0 font-normal text-slate-500">
                            in General
                          </p>
                        </div>
                        <div className="mt-2 flex">
                          <div className="flex items-center text-sm text-slate-500">
                            <Calendar className="mr-1.5 h-4 w-4 flex-shrink-0 text-slate-400" aria-hidden="true" />
                            <p>Added {patient.createdAt.toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="ml-5 flex-shrink-0">
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        Active
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-base font-semibold leading-6 text-slate-900 mb-4">PWA Settings</h3>
          <PushNotificationManager />
        </div>
      </div>
    </div>
  );
}
