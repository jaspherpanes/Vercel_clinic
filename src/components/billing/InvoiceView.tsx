"use client";

import { 
  Printer, 
  ArrowLeft, 
  User, 
  FileText, 
  Clock, 
  CheckCircle,
  CreditCard,
  Phone,
  MapPin,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface InvoiceViewProps {
  invoice: any;
}

export function InvoiceView({ invoice }: InvoiceViewProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Action Bar */}
      <div className="flex items-center justify-between no-print">
        <Link
          href="/billing"
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Billing
        </Link>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2 rounded-xl font-black shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all text-sm"
        >
          <Printer className="h-4 w-4" />
          Print Receipt
        </button>
      </div>

      {/* The Actual Invoice / Receipt */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden" id="printable-receipt">
        {/* Header Strip */}
        <div className="bg-slate-900 p-10 text-white flex flex-col md:flex-row justify-between gap-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          <div className="relative z-10 flex items-center gap-6">
            <div className="h-16 w-16 rounded-2xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
              <ShieldCheck className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight">Vercel Clinic</h1>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Official Medical Receipt</p>
              <div className="flex gap-4 mt-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                <span>TIN: 123-456-789-000</span>
                <span>REG # 882299</span>
              </div>
            </div>
          </div>
          <div className="relative z-10 text-right">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Invoice Number</p>
            <p className="text-3xl font-black text-primary-500">#{invoice.invoiceNo}</p>
            <div className="mt-2 inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[10px] font-black text-green-400">
              <CheckCircle className="h-3 w-3" />
              STATUS: {invoice.status}
            </div>
          </div>
        </div>

        <div className="p-10 space-y-12">
          {/* Billing Context */}
          <div className="grid grid-cols-2 gap-12">
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Billed To</h3>
              <div>
                <p className="text-xl font-black text-slate-900">{invoice.patient.firstName} {invoice.patient.lastName}</p>
                <div className="mt-3 space-y-1.5">
                  <p className="text-xs font-bold text-slate-500 flex items-center gap-2">
                    <User className="h-3 w-3 text-primary-500" />
                    ID: {invoice.patient.id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-xs font-bold text-slate-500 flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-primary-500" />
                    {invoice.patient.address || "No address on file"}
                  </p>
                  <p className="text-xs font-bold text-slate-500 flex items-center gap-2">
                    <Phone className="h-3 w-3 text-primary-500" />
                    {invoice.patient.contactInfo || "No phone record"}
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right space-y-4">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment Info</h3>
              <div className="space-y-1.5">
                <p className="text-xs font-bold text-slate-500">
                  <span className="uppercase text-[9px] text-slate-400 mr-2">Date:</span>
                  {new Date(invoice.createdAt).toLocaleDateString()}
                </p>
                <p className="text-xs font-bold text-slate-500">
                  <span className="uppercase text-[9px] text-slate-400 mr-2">Method:</span>
                  {invoice.paymentMethod || "CASH"}
                </p>
                {invoice.orNo && (
                  <p className="text-sm font-black text-slate-900">
                    <span className="uppercase text-[9px] text-primary-500 mr-2">OR #:</span>
                    {invoice.orNo}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="py-4 pl-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                  <th className="px-3 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Qty</th>
                  <th className="px-3 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Unit Price</th>
                  <th className="py-4 pr-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {invoice.items.map((item: any) => (
                  <tr key={item.id}>
                    <td className="py-4 pl-6 text-sm font-bold text-slate-900">
                      {item.description}
                      <span className="block text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-0.5">{item.category}</span>
                    </td>
                    <td className="px-3 py-4 text-sm text-center font-bold text-slate-600">{item.quantity}</td>
                    <td className="px-3 py-4 text-sm text-right font-bold text-slate-600">₱{item.unitPrice.toLocaleString()}</td>
                    <td className="py-4 pr-6 text-sm text-right font-black text-slate-900">₱{item.subtotal.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="flex justify-end pt-8">
            <div className="w-full max-w-xs space-y-4">
              <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                <span>Subtotal</span>
                <span>₱{invoice.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold text-red-500">
                <span>Discount ({invoice.discountType})</span>
                <span>- ₱{invoice.discountAmount.toLocaleString()}</span>
              </div>
              <div className="pt-4 border-t-2 border-slate-900 flex justify-between items-end">
                <span className="text-xs font-black uppercase tracking-widest">Total Amount</span>
                <span className="text-3xl font-black text-slate-900">₱{invoice.totalAmount.toLocaleString()}</span>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                  <span>Amount Paid</span>
                  <span className="text-slate-900">₱{invoice.amountPaid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                  <span>Balance Due</span>
                  <span className="text-red-600 font-black">₱{invoice.balance.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Terms / Footer */}
          <div className="pt-12 border-t border-slate-100 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Thank you for trusting Vercel Clinic</p>
            <p className="text-[9px] text-slate-400 leading-relaxed max-w-sm mx-auto">
              This serves as an official receipt for medical services rendered. Please keep this for your records or HMO reimbursement.
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; padding: 0 !important; }
          #printable-receipt { border: none !important; box-shadow: none !important; }
          .rounded-[2.5rem] { border-radius: 0 !important; }
        }
      `}</style>
    </div>
  );
}
