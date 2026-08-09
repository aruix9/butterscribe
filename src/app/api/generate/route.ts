import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { connectToDatabase } from "@/lib/db";
import AiGeneration from "@/models/aiGeneration";
import Document from "@/models/document";
import Client from "@/models/client";
import { systemPrompt as defaultSystemPrompt } from "../../../../data";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { prompt, clientId, clientSystemPrompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    let customClientContext = "";
    if (clientSystemPrompt) {
      customClientContext = `\nClient Specific Context & Instructions:\n${clientSystemPrompt}\n`;
    } else if (clientId) {
      await connectToDatabase();
      const clientRecord = await Client.findById(clientId);
      if (clientRecord?.systemPrompt) {
        customClientContext = `\nClient Specific Context & Instructions:\n${clientRecord.systemPrompt}\n`;
      }
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const activeSystemPrompt = customClientContext.trim() ? customClientContext : defaultSystemPrompt;

    const result = await model.generateContent([activeSystemPrompt, prompt]);
    const response = await result.response;
    const text = response.text();

    // Save to database
    await connectToDatabase();

    // @ts-ignore
    const userId = session.user.id;
    const title = prompt.length > 50 ? `${prompt.substring(0, 50)}...` : prompt;

    // 1. Create a blank draft document for the user to write in
    const newDocument = await Document.create({
      title: title,
      body: '',
      userId,
      clientId: clientId || undefined,
      status: 'draft',
    });

    // 2. Create the AI generation record, linked to the new document
    const aiGen = await AiGeneration.create({
      title: title,
      prompt: prompt,
      response: text,
      userId,
      documentId: newDocument._id,
    });

    // 3. Back-link the document to its AI generation
    await Document.findByIdAndUpdate(newDocument._id, { aiGenerationId: aiGen._id });

    return NextResponse.json({ text, documentId: newDocument._id.toString(), aiGenerationId: aiGen._id.toString() });
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate content" }, { status: 500 });
  }
}
