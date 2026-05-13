import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { connectToDatabase } from "@/lib/db";
import AiGeneration from "@/models/aiGeneration";
import { Types } from "mongoose";

export async function GET(
  req: Request,
  { params }: { params: { documentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { documentId } = await params;

    if (!Types.ObjectId.isValid(documentId)) {
      return NextResponse.json({ aiGeneration: null });
    }

    await connectToDatabase();

    const aiGeneration = await AiGeneration.findOne({
      documentId: new Types.ObjectId(documentId),
      // @ts-ignore
      userId: new Types.ObjectId(session.user.id),
    });

    return NextResponse.json({ aiGeneration: aiGeneration ?? null });
  } catch (error) {
    console.error("Error fetching AI generation:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
