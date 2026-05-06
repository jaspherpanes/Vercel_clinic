import { get, set, del, keys } from 'idb-keyval';

const DRAFTS_KEY = 'consultation_drafts';

export interface ConsultationDraft {
  id: string;
  patientId: string;
  doctorId: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  date: string;
  timestamp: number;
}

export async function saveDraft(draft: Omit<ConsultationDraft, 'timestamp'>) {
  const drafts = (await get<ConsultationDraft[]>(DRAFTS_KEY)) || [];
  const newDraft = { ...draft, timestamp: Date.now() };
  await set(DRAFTS_KEY, [...drafts, newDraft]);
  return newDraft;
}

export async function getDrafts() {
  return (await get<ConsultationDraft[]>(DRAFTS_KEY)) || [];
}

export async function clearDraft(id: string) {
  const drafts = (await get<ConsultationDraft[]>(DRAFTS_KEY)) || [];
  await set(DRAFTS_KEY, drafts.filter(d => d.id !== id));
}

export async function clearAllDrafts() {
  await del(DRAFTS_KEY);
}
