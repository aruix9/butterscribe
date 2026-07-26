import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { connectToDatabase } from "@/lib/db";
import Document from "@/models/document";
import User from "@/models/user";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Access check: only Super User or Manager can review approvals
    const userRole = (session.user as any)?.role?.toLowerCase();
    if (userRole !== 'super user' && userRole !== 'manager') {
      return NextResponse.json({ error: "Access Restricted: Manager or Super User role required" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const timeFilter = searchParams.get('timeFilter') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    await connectToDatabase();

    // @ts-ignore
    const currentUser = await User.findById(session.user.id);

    const query: any = {};

    // Manager scoping: Managers see documents written by themselves OR by users in their client team
    if (userRole === 'manager') {
      const clientUserIds: any[] = [];
      if (currentUser?.clientId) {
        const clientUsers = await User.find({ clientId: currentUser.clientId }).select('_id');
        clientUserIds.push(...clientUsers.map(u => u._id));
      }
      query.$or = [
        // @ts-ignore
        { userId: session.user.id },
        { userId: { $in: clientUserIds } },
        ...(currentUser?.clientId ? [{ clientId: currentUser.clientId }] : [])
      ];
    }

    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      if (query.$or) {
        // Wrap existing $or with search conditions using $and
        query.$and = [
          { $or: query.$or },
          { $or: [{ title: searchRegex }, { description: searchRegex }] }
        ];
        delete query.$or;
      } else {
        query.$or = [{ title: searchRegex }, { description: searchRegex }];
      }
    }

    if (status !== 'all') {
      query.status = status;
    }

    // Optional Quick Time Filtering (Today, This Week)
    if (timeFilter === 'today') {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      query.updatedAt = { $gte: startOfDay };
    } else if (timeFilter === 'week') {
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - 7);
      query.updatedAt = { $gte: startOfWeek };
    }

    const [documents, total] = await Promise.all([
      Document.find(query)
        .populate({ path: 'userId', select: 'name email role image', model: User })
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Document.countDocuments(query)
    ]);

    return NextResponse.json({
      documents,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error: any) {
    console.error("Error fetching approvals:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
