import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { connectToDatabase } from "@/lib/db";
import AiGeneration from "@/models/aiGeneration";
import Document from "@/models/document";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const systemPrompt = `
      You are a content strategy assistant. Based on the user's topic or prompt, generate a structured response with the following sections:
      1. Content Outline: A high-quality outline of the content sections. this should give only the main headings in numbered list format. No subheadings or paragraphs should be included. These headings will be used to create a table of contents.
      2. Keywords: all the below keyword types must be in numbered list format.
         - Long Tail Keywords (at least 5)
         - Short Tail Keywords (at least 5)
         - Question Keywords (at least 5 common questions)
      3. Follow up Questions: A list of 3-5 additional questions or ideas for related content.
      The output should be in below format:

      ## Content Outline
      1. [Heading]
         1. [Subheading]
         2. [Subheading]
      2. [Heading]
         1. [Subheading]
         2. [Subheading]
      ...
      ---
      ## Keywords
      1. Long Tail Keywords
         1. [Keyword]
         2. [Keyword]
         3. [Keyword]
         4. [Keyword]
         5. [Keyword]
      2. Short Tail Keywords
         1. [Keyword]
         2. [Keyword]
         3. [Keyword]
         4. [Keyword]
         5. [Keyword]
      3. Question Keywords
         1. [Question]
         2. [Question]
         3. [Question]
         4. [Question]
         5. [Question]

      ## Follow up Questions
         1. [Question]
         2. [Question]
         3. [Question]
         4. [Question]
         5. [Question]
    `;

    const result = await model.generateContent([systemPrompt, prompt]);
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
