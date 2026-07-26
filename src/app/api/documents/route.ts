import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { connectToDatabase } from "@/lib/db";
import Document from "@/models/document";
import User from "@/models/user";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // @ts-ignore - session.user might have id but it's not in the default type
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, title, description, body, status, startDate, endDate, aiGenerationId } = await req.json();

    if (!title && !id) {
      return NextResponse.json({ error: "Title is required for new documents" }, { status: 400 });
    }

    await connectToDatabase();

    // Fetch user to retrieve their clientId
    // @ts-ignore
    const currentUser = await User.findById(session.user.id).select('clientId');

    let document;
    if (id) {
      const updateData: any = {};
      if (title) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (body) updateData.body = body;
      if (status) updateData.status = status;
      if (startDate !== undefined) updateData.startDate = startDate;
      if (endDate !== undefined) updateData.endDate = endDate;
      if (aiGenerationId) updateData.aiGenerationId = aiGenerationId;

      document = await Document.findOneAndUpdate(
        // @ts-ignore
        { _id: id, userId: session.user.id },
        { $set: updateData },
        { new: true }
      );
      if (!document) {
        return NextResponse.json({ error: "Document not found or unauthorized" }, { status: 404 });
      }
    } else {
      document = await Document.create({
        title,
        description,
        body: body || '',
        // @ts-ignore
        userId: session.user.id,
        clientId: currentUser?.clientId || undefined,
        status: status || 'draft',
        startDate,
        endDate
      });
    }


    return NextResponse.json(document, { status: id ? 200 : 201 });
  } catch (error) {
    console.error("Error saving document:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    await connectToDatabase();

    const query: any = { 
      // @ts-ignore
      userId: session.user.id 
    };

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    if (status !== 'all') {
      query.status = status;
    }

    const [documents, total] = await Promise.all([
      Document.find(query)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit),
      Document.countDocuments(query)
    ]);

    return NextResponse.json({
      documents,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

