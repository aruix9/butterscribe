import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { connectToDatabase } from "@/lib/db";
import Document from "@/models/document";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // @ts-ignore - session.user might have id but it's not in the default type
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, title, body, status } = await req.json();

    if (!title || !body) {
      return NextResponse.json({ error: "Title and body are required" }, { status: 400 });
    }

    await connectToDatabase();

    let document;
    if (id) {
      document = await Document.findOneAndUpdate(
        // @ts-ignore
        { _id: id, userId: session.user.id },
        { title, body, status },
        { returnDocument: 'after' }
      );
      if (!document) {
        return NextResponse.json({ error: "Document not found or unauthorized" }, { status: 404 });
      }
    } else {
      document = await Document.create({
        title,
        body,
        // @ts-ignore
        userId: session.user.id,
        status: status || 'draft',
      });
    }

    return NextResponse.json(document, { status: id ? 200 : 201 });
  } catch (error) {
    console.error("Error saving document:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    // @ts-ignore
    const documents = await Document.find({ userId: session.user.id }).sort({ updatedAt: -1 });

    return NextResponse.json(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
