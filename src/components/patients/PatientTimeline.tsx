import { Calendar, Stethoscope, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

interface Consultation {
  id: string;
  date: Date;
  symptoms: string | null;
  diagnosis: string | null;
  treatment: string | null;
  doctor: {
    firstName: string;
    lastName: string;
  };
}

export function PatientTimeline({ consultations }: { consultations: Consultation[] }) {
  if (consultations.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
        <p className="text-slate-500">No medical history found for this patient.</p>
      </div>
    );
  }

  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {consultations.map((consultation, idx) => (
          <li key={consultation.id}>
            <div className="relative pb-8">
              {idx !== consultations.length - 1 ? (
                <span className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-slate-200" aria-hidden="true" />
              ) : null}
              <div className="relative flex items-start space-x-3">
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 ring-8 ring-white">
                    <Stethoscope className="h-5 w-5 text-primary-600" />
                  </div>
                </div>
                <div className="min-w-0 flex-1 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm">
                      <span className="font-bold text-slate-900">Dr. {consultation.doctor.firstName} {consultation.doctor.lastName}</span>
                    </div>
                    <div className="whitespace-nowrap text-right text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(consultation.date).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {consultation.symptoms && (
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase">Symptoms</h4>
                        <p className="text-sm text-slate-700">{consultation.symptoms}</p>
                      </div>
                    )}
                    {consultation.diagnosis && (
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase">Diagnosis</h4>
                        <p className="text-sm font-semibold text-primary-700">{consultation.diagnosis}</p>
                      </div>
                    )}
                    {consultation.treatment && (
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase">Treatment</h4>
                        <p className="text-sm text-slate-700">{consultation.treatment}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
