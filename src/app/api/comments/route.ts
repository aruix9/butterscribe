import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { connectToDatabase } from "@/lib/db";
import Comment from "@/models/comment";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const documentId = searchParams.get('documentId');

    if (!documentId) {
      return NextResponse.json({ error: "Document ID is required" }, { status: 400 });
    }

    await connectToDatabase();

    const comments = await Comment.find({ documentId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { documentId, text, selection, parentId } = await req.json();

    if (!documentId || !text) {
      return NextResponse.json({ error: "Document ID and text are required" }, { status: 400 });
    }

    await connectToDatabase();

    // If it's a reply, ensure the parent exists and doesn't have a parent (one level only)
    if (parentId) {
      const parent = await Comment.findById(parentId);
      if (!parent) {
        return NextResponse.json({ error: "Parent comment not found" }, { status: 404 });
      }
      if (parent.parentId) {
        return NextResponse.json({ error: "Only one level of nesting is allowed" }, { status: 400 });
      }
    }

    const comment = await Comment.create({
      documentId,
      // @ts-ignore
      userId: session.user.id,
      // @ts-ignore
      userName: session.user.name || session.user.email,
      // @ts-ignore
      userAvatar: session.user.image,
      text,
      selection,
      parentId
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
