"use client";

import { useState, useEffect } from "react";
import { Bell, BellOff, Loader2 } from "lucide-react";

export function PushNotificationManager() {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [loading, setLoading] = useState(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!("Notification" in window)) return;
    setLoading(true);
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === "granted") {
        new Notification("Notifications Enabled!", {
          body: "You will now receive clinical updates and reminders.",
          icon: "/icons/icon-192x192.png"
        });
      }
    } catch (error) {
      console.error("Notification error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || !("Notification" in window)) return null;

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${permission === "granted" ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-400"}`}>
          {permission === "granted" ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900">Push Notifications</h4>
          <p className="text-xs text-slate-500">
            {permission === "granted" ? "Enabled for appointment reminders" : "Get notified for urgent patient updates"}
          </p>
        </div>
      </div>
      
      {permission !== "granted" && (
        <button
          onClick={requestPermission}
          disabled={loading}
          className="bg-primary-600 text-white px-3 py-1.5 rounded-md text-xs font-bold hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center gap-1.5"
        >
          {loading && <Loader2 className="h-3 w-3 animate-spin" />}
          Enable
        </button>
      )}
    </div>
  );
}
