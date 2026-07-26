import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Invitation from "@/models/invitation";
import Client from "@/models/client";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    if (!token) {
      return NextResponse.json({ isValid: false, message: "Token is required" }, { status: 400 });
    }

    await connectToDatabase();

    const invitation = await Invitation.findOne({ token, status: "pending" }).populate("clientId");

    if (!invitation) {
      return NextResponse.json({ isValid: false, message: "Invitation link is invalid or has already been used." }, { status: 404 });
    }

    if (invitation.expiresAt && new Date(invitation.expiresAt) < new Date()) {
      await Invitation.findByIdAndUpdate(invitation._id, { status: "expired" });
      return NextResponse.json({ isValid: false, message: "Invitation link has expired." }, { status: 410 });
    }

    const client = invitation.clientId as any;

    return NextResponse.json({
      isValid: true,
      email: invitation.email,
      company: client?.company || "Butterscribe Client",
      role: invitation.role || "user",
    });
  } catch (error: any) {
    console.error("Error validating invitation token:", error);
    return NextResponse.json({ isValid: false, message: "Error validating invitation token" }, { status: 500 });
  }
}
