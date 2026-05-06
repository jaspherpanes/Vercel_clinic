"use client";

import { 
  TrendingUp, 
  CreditCard, 
  Clock, 
  CheckCircle, 
  ArrowUpRight,
  Plus,
  Search,
  Filter,
  FileText,
  Printer
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface BillingDashboardProps {
  stats: {
    totalRevenue: number;
    pendingPayments: number;
    paidInvoices: number;
    todayCollection: number;
  };
  recentInvoices: any[];
}

export function BillingDashboard({ stats, recentInvoices }: BillingDashboardProps) {
  return (
    <div className="space-y-10 pb-20">
      {/* 📊 Financial Snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-all">
            <TrendingUp className="h-20 w-20" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">Total Revenue (Month)</p>
          <h3 className="text-4xl font-black mb-2">₱{stats.totalRevenue.toLocaleString()}</h3>
          <div className="flex items-center gap-2 text-green-400 text-xs font-bold">
            <ArrowUpRight className="h-4 w-4" />
            +12.5% from last month
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-xl group hover:shadow-2xl transition-all">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Pending Payments</p>
            <Clock className="h-5 w-5 text-amber-500" />
          </div>
          <h3 className="text-4xl font-black text-slate-900">₱{stats.pendingPayments.toLocaleString()}</h3>
          <p className="mt-2 text-xs font-bold text-slate-400 uppercase tracking-widest">Accounts Receivable</p>
        </div>

        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-xl group hover:shadow-2xl transition-all">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Paid Invoices</p>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
          <h3 className="text-4xl font-black text-slate-900">{stats.paidInvoices}</h3>
          <p className="mt-2 text-xs font-bold text-slate-400 uppercase tracking-widest">Completed Transactions</p>
        </div>

        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-xl group hover:shadow-2xl transition-all">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Today's Collection</p>
            <CreditCard className="h-5 w-5 text-primary-500" />
          </div>
          <h3 className="text-4xl font-black text-slate-900">₱{stats.todayCollection.toLocaleString()}</h3>
          <p className="mt-2 text-xs font-bold text-slate-400 uppercase tracking-widest">Real-time Cashflow</p>
        </div>
      </div>

      {/* 🧾 Main Invoice List */}
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200 overflow-hidden">
        <div className="px-10 py-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Invoice Management</h2>
            <p className="text-slate-500 text-sm font-medium">Manage patient billing, payments, and receipts.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                placeholder="Search Invoice or Patient..." 
                className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-primary-500 w-64 bg-white shadow-sm"
              />
            </div>
            <Link 
              href="/billing/new"
              className="flex items-center gap-2 bg-primary-600 text-white px-6 py-2.5 rounded-xl font-black text-sm shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all active:scale-95"
            >
              <Plus className="h-4 w-4" />
              Create Invoice
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="py-4 pl-10 pr-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Invoice No.</th>
                <th className="px-3 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient</th>
                <th className="px-3 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-3 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="px-3 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="relative py-4 pl-3 pr-10"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {recentInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="whitespace-nowrap py-5 pl-10 pr-3 text-sm font-black text-primary-600">
                    {invoice.invoiceNo}
                  </td>
                  <td className="whitespace-nowrap px-3 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-black">
                        {invoice.patient.firstName[0]}{invoice.patient.lastName[0]}
                      </div>
                      <p className="text-sm font-bold text-slate-900">{invoice.patient.firstName} {invoice.patient.lastName}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-5 text-xs font-bold text-slate-500">
                    {new Date(invoice.createdAt).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-3 py-5 text-sm font-black text-slate-900">
                    ₱{invoice.totalAmount.toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-3 py-5">
                    <span className={cn(
                      "inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black ring-1 ring-inset",
                      invoice.status === "PAID" 
                        ? "bg-green-50 text-green-700 ring-green-600/20" 
                        : (invoice.status === "PARTIAL" ? "bg-amber-50 text-amber-700 ring-amber-600/20" : "bg-red-50 text-red-700 ring-red-600/20")
                    )}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="relative whitespace-nowrap py-5 pl-3 pr-10 text-right text-sm">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <Link href={`/billing/${invoice.id}`} className="p-2 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-primary-600 hover:border-primary-100 transition-all shadow-sm">
                        <FileText className="h-4 w-4" />
                      </Link>
                      <button className="p-2 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-slate-900 shadow-sm">
                        <Printer className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {recentInvoices.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-slate-400 font-bold italic">
                    No transactions found for the selected period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
