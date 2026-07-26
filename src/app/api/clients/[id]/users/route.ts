import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { connectToDatabase } from "@/lib/db";
import Client from "@/models/client";
import User from "@/models/user";
import Invitation from "@/models/invitation";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: clientId } = await params;

    await connectToDatabase();

    const [users, pendingInvitations] = await Promise.all([
      User.find({ clientId }).select("_id name email role isActive createdAt").lean(),
      Invitation.find({ clientId, status: "pending" }).sort({ createdAt: -1 }).lean()
    ]);

    return NextResponse.json({ users, pendingInvitations });
  } catch (error: any) {
    console.error("Error fetching client users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: clientId } = await params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const invitationId = searchParams.get("invitationId");

    await connectToDatabase();

    if (userId) {
      await User.findByIdAndUpdate(userId, { $unset: { clientId: 1 } });
      await Client.findByIdAndUpdate(clientId, { $pull: { users: userId } });
      return NextResponse.json({ message: "User removed from client successfully" });
    }

    if (invitationId) {
      await Invitation.findByIdAndDelete(invitationId);
      return NextResponse.json({ message: "Pending invitation canceled successfully" });
    }

    return NextResponse.json({ error: "userId or invitationId required" }, { status: 400 });
  } catch (error: any) {
    console.error("Error removing client user/invitation:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
