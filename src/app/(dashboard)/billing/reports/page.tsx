import { getRevenueReport } from "./actions";
import { 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  BarChart3,
  Calendar,
  CreditCard,
  Building2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default async function BillingReportsPage() {
  const report = await getRevenueReport();

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Financial Intelligence</h2>
        <p className="text-slate-500 font-medium">Real-time revenue analytics and collection tracking.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-10 w-10 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600">
              <TrendingUp className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Monthly Revenue</p>
          </div>
          <p className="text-4xl font-black text-slate-900">₱{report.monthTotal.toLocaleString()}</p>
          <div className="mt-4 flex items-center gap-2 text-xs font-bold text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            Current Billing Period
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-10 w-10 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
              <AlertCircle className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Pending Collections</p>
          </div>
          <p className="text-4xl font-black text-slate-900">
            ₱{report.unpaidInvoices.reduce((acc, curr) => acc + curr.balance, 0).toLocaleString()}
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs font-bold text-orange-600">
            {report.unpaidInvoices.length} Unpaid Invoices
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Building2 className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">HMO / Insurance</p>
          </div>
          <p className="text-4xl font-black text-slate-900">₱{report.hmoStats.total.toLocaleString()}</p>
          <div className="mt-4 flex items-center gap-2 text-xs font-bold text-indigo-600">
            {report.hmoStats.count} Processed Claims
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-3xl shadow-xl text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center">
              <Calendar className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Daily Collection</p>
          </div>
          <p className="text-4xl font-black">₱{report.dayTotal.toLocaleString()}</p>
          <div className="mt-4 flex items-center gap-2 text-xs font-bold text-primary-400">
            Today, {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Services */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary-600" />
              Top Revenue Generators
            </h3>
          </div>
          <div className="p-8 space-y-6">
            {report.topServices.map((service, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 font-bold">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{service.description}</p>
                    <p className="text-xs text-slate-500 font-medium">{service._count.id} Instances</p>
                  </div>
                </div>
                <p className="font-black text-slate-900">₱{service._sum.subtotal?.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Unpaid Invoices */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100">
            <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-red-500" />
              Outstanding Balances
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <th className="px-8 py-4">Patient</th>
                  <th className="px-8 py-4">Balance</th>
                  <th className="px-8 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {report.unpaidInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 transition-all">
                    <td className="px-8 py-4">
                      <p className="font-bold text-slate-900">{inv.patient.firstName} {inv.patient.lastName}</p>
                      <p className="text-[10px] text-slate-500">Invoice #{inv.id.slice(-6).toUpperCase()}</p>
                    </td>
                    <td className="px-8 py-4 font-black text-red-600">₱{inv.balance.toLocaleString()}</td>
                    <td className="px-8 py-4">
                      <span className={cn(
                        "text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest",
                        inv.status === "PARTIAL" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                      )}>
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
