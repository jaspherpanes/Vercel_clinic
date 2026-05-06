"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveDraft, getDrafts, clearDraft } from "@/lib/offline";
import { createConsultation } from "@/app/(dashboard)/consultations/actions";
import { Sparkles, Loader2, Save, WifiOff, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
}

interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
}

export function ConsultationForm({ patients, doctors }: { patients: Patient[], doctors: Doctor[] }) {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    symptoms: "",
    diagnosis: "",
    treatment: "",
    notes: "",
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!isOnline) {
      await saveDraft({
        id: Math.random().toString(36).substr(2, 9),
        ...formData
      });
      alert("Offline: Saved as draft. It will sync when you are back online.");
      router.push("/dashboard");
      return;
    }

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => data.append(key, value));
      await createConsultation(data);
      router.push("/patients/" + formData.patientId);
    } catch (error) {
      console.error(error);
      alert("Error saving consultation");
    } finally {
      setLoading(false);
    }
  };

  const getAISuggestions = async () => {
    if (!formData.symptoms) return alert("Please enter symptoms first");
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/suggest", {
        method: "POST",
        body: JSON.stringify({
          patientId: formData.patientId,
          symptoms: formData.symptoms,
          notes: formData.notes
        }),
      });
      const data = await res.json();
      setAiResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        {!isOnline && (
          <div className="flex items-center gap-2 p-3 bg-amber-50 text-amber-700 rounded-lg border border-amber-200 text-sm">
            <WifiOff className="h-4 w-4" />
            Working Offline: Consultations will be saved as drafts locally.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Patient</label>
            <select
              required
              value={formData.patientId}
              onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
              className="w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm h-10 px-3 border"
            >
              <option value="">Select Patient</option>
              {patients.map(p => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Doctor</label>
            <select
              required
              value={formData.doctorId}
              onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
              className="w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm h-10 px-3 border"
            >
              <option value="">Select Doctor</option>
              {doctors.map(d => <option key={d.id} value={d.id}>Dr. {d.firstName} {d.lastName}</option>)}
            </select>
          </div>
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-slate-700 mb-1">Symptoms</label>
          <textarea
            rows={3}
            value={formData.symptoms}
            onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
            className="w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-3 border"
            placeholder="Describe patient symptoms..."
          />
          <button
            type="button"
            onClick={getAISuggestions}
            disabled={aiLoading || !isOnline}
            className="absolute right-2 bottom-2 flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-md text-xs font-semibold hover:bg-primary-100 transition-colors disabled:opacity-50"
          >
            {aiLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
            AI Assist
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Diagnosis</label>
            <textarea
              rows={3}
              value={formData.diagnosis}
              onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
              className="w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-3 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Treatment Plan</label>
            <textarea
              rows={3}
              value={formData.treatment}
              onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
              className="w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-3 border"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Internal Notes</label>
          <textarea
            rows={2}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-3 border"
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-primary-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isOnline ? "Complete Consultation" : "Save Draft"}
          </button>
        </div>
      </form>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary-600" />
            AI Suggestions
          </h3>
          
          {aiResult ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="p-3 bg-primary-50 rounded-lg border border-primary-100">
                <h4 className="text-xs font-bold text-primary-700 uppercase tracking-wider mb-1">Suggested Diagnosis</h4>
                <p className="text-sm text-slate-700">{aiResult.suggestedDiagnosis}</p>
                <button 
                  onClick={() => setFormData({...formData, diagnosis: aiResult.suggestedDiagnosis})}
                  className="mt-2 text-xs font-semibold text-primary-600 hover:underline"
                >
                  Apply to Diagnosis
                </button>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Prescription Draft</h4>
                <p className="text-sm text-slate-700 italic">{aiResult.prescriptionDraft}</p>
              </div>
              <div className="flex items-start gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg text-xs italic">
                <AlertCircle className="h-4 w-4 shrink-0" />
                👉 AI-assisted suggestion only. Doctor must verify all outputs.
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400">
              <p className="text-sm">Input symptoms and click "AI Assist" for clinical suggestions.</p>
            </div>
          )}
        </div>

        <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-bold mb-2">Offline Support</h3>
          <p className="text-slate-400 text-sm mb-4">
            If you lose connection, your work is automatically saved as a draft.
          </p>
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <div className={cn("h-2 w-2 rounded-full", isOnline ? "bg-green-500" : "bg-red-500")} />
            {isOnline ? "Connection Stable" : "Offline Mode Active"}
          </div>
        </div>
      </div>
    </div>
  );
}
