"use client";

import { useState, useEffect } from "react";
import { getDrafts, clearAllDrafts } from "@/lib/offline";
import { createConsultation } from "@/app/(dashboard)/consultations/actions";
import { RefreshCw, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export function SyncBanner() {
  const [draftCount, setDraftCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", handleStatus);
    window.addEventListener("offline", handleStatus);

    const checkDrafts = async () => {
      const drafts = await getDrafts();
      setDraftCount(drafts.length);
    };
    
    checkDrafts();
    const interval = setInterval(checkDrafts, 5000);

    return () => {
      window.removeEventListener("online", handleStatus);
      window.removeEventListener("offline", handleStatus);
      clearInterval(interval);
    };
  }, []);

  const handleSync = async () => {
    if (!isOnline) return;
    setSyncing(true);
    try {
      const drafts = await getDrafts();
      for (const draft of drafts) {
        const formData = new FormData();
        Object.entries(draft).forEach(([key, value]) => {
          if (key !== 'id' && key !== 'timestamp') {
            formData.append(key, value as string);
          }
        });
        await createConsultation(formData);
      }
      await clearAllDrafts();
      setDraftCount(0);
      alert("All drafts synced successfully!");
    } catch (error) {
      console.error("Sync error:", error);
      alert("Some drafts failed to sync. Please try again.");
    } finally {
      setSyncing(false);
    }
  };

  if (draftCount === 0) return null;

  return (
    <div className="bg-primary-600 text-white px-4 py-2 flex items-center justify-between animate-in slide-in-from-top duration-300">
      <div className="flex items-center gap-2 text-sm font-medium">
        <AlertCircle className="h-4 w-4" />
        {draftCount} offline consultation{draftCount > 1 ? "s" : ""} pending sync.
      </div>
      <button
        onClick={handleSync}
        disabled={syncing || !isOnline}
        className="flex items-center gap-1.5 bg-white text-primary-600 px-3 py-1 rounded-md text-xs font-bold hover:bg-primary-50 transition-colors disabled:opacity-50"
      >
        {syncing ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
        {isOnline ? "Sync Now" : "Waiting for Network..."}
      </button>
    </div>
  );
}
