"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  User, 
  Calculator, 
  CreditCard, 
  Save, 
  ArrowLeft,
  Loader2,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createBilling } from "@/app/(dashboard)/billing/actions";
import { useRouter } from "next/navigation";

interface InvoiceFormProps {
  patients: { id: string; firstName: string; lastName: string; address?: string }[];
  consultations?: any[];
}

export function InvoiceForm({ patients, consultations }: InvoiceFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [items, setItems] = useState<any[]>([
    { description: "Consultation Fee", quantity: 1, unitPrice: 500, category: "CONSULTATION" }
  ]);
  const [discountType, setDiscountType] = useState("NONE");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("CASH");

  // Calculate Totals
  const subtotal = items.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
  
  useEffect(() => {
    if (discountType === "SENIOR" || discountType === "PWD") {
      // 20% discount standard in PH
      setDiscountAmount(subtotal * 0.2);
    } else if (discountType === "NONE") {
      setDiscountAmount(0);
    }
  }, [subtotal, discountType]);

  const grandTotal = subtotal - discountAmount;
  const change = amountPaid > grandTotal ? amountPaid - grandTotal : 0;

  const addItem = () => setItems([...items, { description: "", quantity: 1, unitPrice: 0, category: "OTHER" }]);
  const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    formData.append("items", JSON.stringify(items));
    formData.append("discountAmount", discountAmount.toString());
    formData.append("amountPaid", amountPaid.toString());

    try {
      await createBilling(formData);
      router.push("/billing");
    } catch (err) {
      console.error(err);
      alert("Failed to create invoice");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8 pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Invoice Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <User className="h-4 w-4" />
              Patient Selection
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Select Patient</label>
                <select 
                  name="patientId" 
                  required
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500 font-bold text-slate-900"
                >
                  <option value="">-- Choose a patient --</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Related Consultation</label>
                  <select name="consultationId" className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500 text-sm font-medium">
                    <option value="null">Walk-in / No Consultation</option>
                    {consultations?.filter(c => c.patientId === selectedPatientId).map(c => (
                      <option key={c.id} value={c.id}>{new Date(c.date).toLocaleDateString()} - {c.diagnosis}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Invoice Date</label>
                  <input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500 text-sm font-medium" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Charges Breakdown
              </h3>
              <button 
                type="button" 
                onClick={addItem}
                className="text-[10px] bg-slate-900 text-white px-3 py-1.5 rounded-xl font-black hover:bg-slate-800 transition-all flex items-center gap-1"
              >
                <Plus className="h-3 w-3" />
                Add Charge
              </button>
            </div>
            
            <div className="space-y-3">
              {items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-3 items-center p-3 rounded-2xl bg-slate-50 border border-slate-100 group">
                  <div className="col-span-6">
                    <input 
                      placeholder="Description" 
                      value={item.description}
                      onChange={(e) => {
                        const newItems = [...items];
                        newItems[idx].description = e.target.value;
                        setItems(newItems);
                      }}
                      className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-900" 
                    />
                  </div>
                  <div className="col-span-2">
                    <input 
                      type="number" 
                      placeholder="Qty" 
                      value={item.quantity}
                      onChange={(e) => {
                        const newItems = [...items];
                        newItems[idx].quantity = parseInt(e.target.value) || 0;
                        setItems(newItems);
                      }}
                      className="w-full bg-transparent border-none focus:ring-0 text-sm text-center font-bold" 
                    />
                  </div>
                  <div className="col-span-3">
                    <div className="flex items-center">
                      <span className="text-xs text-slate-400 font-bold mr-1">₱</span>
                      <input 
                        type="number" 
                        placeholder="Price" 
                        value={item.unitPrice}
                        onChange={(e) => {
                          const newItems = [...items];
                          newItems[idx].unitPrice = parseFloat(e.target.value) || 0;
                          setItems(newItems);
                        }}
                        className="w-full bg-transparent border-none focus:ring-0 text-sm font-black text-slate-900" 
                      />
                    </div>
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button type="button" onClick={() => removeItem(idx)} className="text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Totals & Payment */}
        <div className="space-y-8">
          <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Calculator className="h-24 w-24" />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Subtotal</span>
                <span className="font-bold">₱{subtotal.toLocaleString()}</span>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Discount Type</label>
                <select 
                  name="discountType"
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value)}
                  className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="NONE" className="bg-slate-900">None</option>
                  <option value="SENIOR" className="bg-slate-900">Senior Citizen (20%)</option>
                  <option value="PWD" className="bg-slate-900">PWD (20%)</option>
                  <option value="PROMO" className="bg-slate-900">Special Promo</option>
                </select>
              </div>

              {discountType === "PROMO" && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Manual Discount (₱)</label>
                  <input 
                    type="number" 
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-primary-500" 
                  />
                </div>
              )}

              <div className="pt-6 border-t border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest">Discount</span>
                  <span className="font-bold text-red-400">- ₱{discountAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-sm font-black uppercase tracking-widest text-slate-400 mb-1">Grand Total</span>
                  <span className="text-4xl font-black">₱{grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 space-y-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary-500" />
              Payment Details
            </h3>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Payment Method</label>
              <div className="grid grid-cols-2 gap-2">
                {["CASH", "GCASH", "MAYA", "CARD"].map(method => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={cn(
                      "py-2.5 rounded-xl text-[10px] font-black tracking-widest border transition-all",
                      paymentMethod === method 
                        ? "bg-primary-600 text-white border-primary-600 shadow-md" 
                        : "bg-slate-50 text-slate-400 border-slate-200 hover:border-slate-300"
                    )}
                  >
                    {method}
                  </button>
                ))}
                <input type="hidden" name="paymentMethod" value={paymentMethod} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Amount Received (₱)</label>
              <input 
                type="number" 
                value={amountPaid}
                onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500 font-black text-xl text-slate-900" 
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Change Due</span>
              <span className="text-lg font-black text-slate-900">₱{change.toLocaleString()}</span>
            </div>

            <button
              type="submit"
              disabled={loading || !selectedPatientId}
              className="w-full bg-primary-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-primary-100 hover:bg-primary-700 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              Generate Invoice
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
