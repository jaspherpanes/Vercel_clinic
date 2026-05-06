"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Users, LayoutDashboard, Stethoscope, Settings, LogOut, ClipboardList, Pill, Receipt } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Patients", href: "/patients", icon: Users },
  { name: "Consultations", href: "/consultations", icon: ClipboardList },
  { name: "Prescriptions", href: "/prescriptions", icon: Pill },
  { name: "Billing", href: "/billing", icon: Receipt },
  { name: "Doctors", href: "/doctors", icon: Stethoscope },
  { name: "Users", href: "/users", icon: Settings, adminOnly: true },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = session?.user?.role || "STAFF";

  const filteredNavigation = navigation.filter(item => {
    if (item.adminOnly && userRole !== "ADMIN") return false;
    return true;
  });

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-slate-200">
      <div className="flex h-16 items-center px-6 border-b border-slate-200">
        <h1 className="text-xl font-bold text-primary-600 flex items-center gap-2">
          <Stethoscope className="h-6 w-6" />
          ClinicPro
        </h1>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {filteredNavigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-primary-50 text-primary-700"
                  : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0",
                  isActive ? "text-primary-600" : "text-slate-400 group-hover:text-slate-500"
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-200">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="group flex w-full items-center px-3 py-2 text-sm font-medium text-slate-700 rounded-md hover:bg-red-50 hover:text-red-700 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5 text-slate-400 group-hover:text-red-500" />
          Sign out
        </button>
      </div>
    </div>
  );
}
