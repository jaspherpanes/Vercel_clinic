import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getEmbedding, cosineSimilarity, generateAISuggestion } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { patientId, symptoms, notes } = await req.json();

    // 1. Get embedding for the current query
    const queryText = `Symptoms: ${symptoms}. Notes: ${notes}`;
    const queryEmbedding = await getEmbedding(queryText);

    let context = "";
    
    if (queryEmbedding) {
      // 2. Fetch past consultations with embeddings
      // For simplicity, we fetch all consultations for this patient
      const pastConsultations = await prisma.consultation.findMany({
        where: { patientId },
        include: { embedding: true },
        take: 10
      });

      // 3. Compute similarity and pick top matches
      const matches = pastConsultations
        .filter(c => c.embedding)
        .map(c => ({
          content: `Symptoms: ${c.symptoms}. Diagnosis: ${c.diagnosis}. Treatment: ${c.treatment}.`,
          score: cosineSimilarity(queryEmbedding, JSON.parse(c.embedding!.embedding))
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

      context = matches.map(m => m.content).join("\n---\n");
    }

    // 4. Generate AI Suggestion
    const suggestion = await generateAISuggestion(context, symptoms, notes);

    // 5. Log AI usage
    await prisma.aILog.create({
      data: {
        doctorId: session.user.id,
        patientId,
        prompt: queryText,
        response: JSON.stringify(suggestion)
      }
    });

    return NextResponse.json(suggestion);
  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
