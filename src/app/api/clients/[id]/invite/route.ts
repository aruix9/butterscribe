import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { connectToDatabase } from "@/lib/db";
import Client from "@/models/client";
import User from "@/models/user";
import Invitation from "@/models/invitation";
import { sendEmail } from "@/utils/sendEmail";
import crypto from "crypto";

export async function POST(
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
    const { email, role = 'user' } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: "Email address is required" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    await connectToDatabase();

    const client = await Client.findById(clientId);
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Check if user is already registered with us
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      // User exists -> directly attach user to client & update role if provided
      const updatePayload: any = { clientId: client._id };
      if (role && role !== existingUser.role) {
        updatePayload.role = role;
      }
      const updatedUser = await User.findByIdAndUpdate(existingUser._id, updatePayload, { new: true });
      const targetUser = updatedUser || existingUser;
      await Client.findByIdAndUpdate(client._id, { $addToSet: { users: existingUser._id } });

      return NextResponse.json({
        status: "added",
        message: `User ${targetUser.name} (${normalizedEmail}) has been attached to ${client.company} as ${targetUser.role}.`,
        user: {
          _id: targetUser._id,
          name: targetUser.name,
          email: targetUser.email,
          role: targetUser.role,
        }
      });
    }

    // User does NOT exist -> create unique invitation and send email
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Upsert invitation for this email & client
    const invitation = await Invitation.findOneAndUpdate(
      { email: normalizedEmail, clientId: client._id, status: 'pending' },
      {
        email: normalizedEmail,
        clientId: client._id,
        token,
        role,
        status: 'pending',
        // @ts-ignore
        invitedBy: session.user.id,
        expiresAt,
      },
      { upsert: true, new: true, runValidators: true }
    );

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || req.nextUrl.origin;
    const inviteLink = `${baseUrl}/auth/signup?inviteToken=${token}`;

    // Inline HTML fallback if email template file isn't present
    const htmlEmail = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; rounded: 10px;">
        <h2 style="color: #6366f1;">You're Invited to Join ${client.company}!</h2>
        <p>Hello,</p>
        <p>You have been invited to join <strong>${client.company}</strong> on Butterscribe.</p>
        <p>Please click the button below to complete your registration and automatically get access to ${client.company}:</p>
        <div style="margin: 30px 0; text-align: center;">
          <a href="${inviteLink}" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Accept Invitation & Register
          </a>
        </div>
        <p style="font-size: 12px; color: #888;">If the button above does not work, copy and paste this link into your browser:</p>
        <p style="font-size: 12px; color: #888; word-break: break-all;">${inviteLink}</p>
        <p style="font-size: 12px; color: #aaa; margin-top: 30px;">This invitation will expire in 7 days.</p>
      </div>
    `;

    try {
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.createTransport({
        host: process.env.MAIL_SERVICE || "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.MAIL_AUTH,
          pass: process.env.MAIL_PASS,
        },
        tls: { rejectUnauthorized: false },
      });

      await transporter.sendMail({
        from: process.env.MAIL_AUTH || 'no-reply@butterscribe.com',
        to: normalizedEmail,
        subject: `Invitation to join ${client.company} on Butterscribe`,
        html: htmlEmail,
      });
    } catch (mailErr) {
      console.warn("Direct SMTP delivery warning (saving invitation record regardless):", mailErr);
    }

    return NextResponse.json({
      status: "invited",
      message: `Invitation link generated & sent to ${normalizedEmail}.`,
      invitation: {
        _id: invitation._id,
        email: invitation.email,
        status: invitation.status,
        expiresAt: invitation.expiresAt,
        inviteLink,
      }
    });
  } catch (error: any) {
    console.error("Error inviting user to client:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process invitation" },
      { status: 500 }
    );
  }
}
