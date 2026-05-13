import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

export async function POST(req: Request) {
  try {
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

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate content" }, { status: 500 });
  }
}
