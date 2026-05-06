import OpenAI from "openai";

let openai: OpenAI | null = null;

function getOpenAIClient() {
  if (openai) return openai;
  if (!process.env.OPENAI_API_KEY) return null;
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  return openai;
}

export async function getEmbedding(text: string) {
  const client = getOpenAIClient();
  if (!client) return null;
  
  const response = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  return response.data[0].embedding;
}

export function cosineSimilarity(vecA: number[], vecB: number[]) {
  let dotProduct = 0;
  let mA = 0;
  let mB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    mA += vecA[i] * vecA[i];
    mB += vecB[i] * vecB[i];
  }
  return dotProduct / (Math.sqrt(mA) * Math.sqrt(mB));
}

export async function generateAISuggestion(context: string, symptoms: string, notes: string) {
  const client = getOpenAIClient();
  if (!client) {
    return {
      suggestedDiagnosis: "AI not configured. Please add OPENAI_API_KEY.",
      clinicalSummary: "N/A",
      prescriptionDraft: "N/A"
    };
  }

  const prompt = `
You are a highly skilled clinical assistant. Your role is strictly to ASSIST the doctor, NOT to replace clinical judgment. 

Based on the following past consultation history (context):
${context}

And the current patient input:
Symptoms: ${symptoms}
Notes: ${notes}

Provide the following in JSON format:
{
  "suggestedDiagnosis": "...",
  "clinicalSummary": "...",
  "prescriptionDraft": "..."
}

WARNING: You must include a disclaimer that this is an AI-assisted suggestion only.
`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "system", content: prompt }],
    response_format: { type: "json_object" }
  });

  const content = response.choices[0].message.content;
  return content ? JSON.parse(content) : null;
}
