import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { connectToDatabase } from "@/lib/db";
import Document from "@/models/document";
import AiGeneration from "@/models/aiGeneration";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await connectToDatabase();

    // @ts-ignore
    const document = await Document.findOne({ _id: id, userId: session.user.id }).lean();

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // If document has a linked AI generation, fetch and attach it
    let aiGeneration = null;
    // @ts-ignore
    if (document.aiGenerationId) {
      // @ts-ignore
      aiGeneration = await AiGeneration.findById(document.aiGenerationId).lean();
    }

    return NextResponse.json({ ...document, aiGeneration });
  } catch (error) {
    console.error("Error fetching document:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await req.json();

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    await connectToDatabase();

    // @ts-ignore
    const document = await Document.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { status },
      { returnDocument: 'after' }
    );

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error("Error updating document:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
