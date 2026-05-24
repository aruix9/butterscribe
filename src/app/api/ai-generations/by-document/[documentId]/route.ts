import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { connectToDatabase } from "@/lib/db";
import AiGeneration from "@/models/aiGeneration";
import { Types } from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ documentId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { documentId } = await params;

    if (!Types.ObjectId.isValid(documentId)) {
      return NextResponse.json({ aiGeneration: null });
    }

    await connectToDatabase();

    const aiGeneration = await AiGeneration.findOne({
      documentId: new Types.ObjectId(documentId),
      userId: new Types.ObjectId(userId),
    });

    return NextResponse.json({
      aiGeneration: aiGeneration ?? null,
    });
  } catch (error) {
    console.error("Error fetching AI generation:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
