import { connectToDatabase } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { sendEmail } from '@/utils/sendEmail'
import User from '@/models/user'
import Invitation from '@/models/invitation'
import Client from '@/models/client'

export async function POST(req: Request) {
  await connectToDatabase()

  try {
    const { name, email, password, inviteToken } = await req.json()

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.trim().toLowerCase() })
    if (existingUser) {
      return Response.json(
        { success: false, message: 'User already exists' },
        { status: 400 }
      )
    }

    // Check invitation token if provided
    let assignedClientId = null;
    let invitationDoc = null;
    if (inviteToken) {
      invitationDoc = await Invitation.findOne({
        token: inviteToken,
        status: 'pending',
        expiresAt: { $gt: new Date() }
      });
      if (invitationDoc) {
        assignedClientId = invitationDoc.clientId;
      }
    }

    // Create new user
    const hasPassword = await bcrypt.hash(password, 10)
    const user = new User({
      name,
      email: email.trim().toLowerCase(),
      password: hasPassword,
      ...(assignedClientId ? { clientId: assignedClientId } : {}),
      ...(invitationDoc?.role ? { role: invitationDoc.role } : {})
    })
    await user.save()

    if (assignedClientId && invitationDoc) {
      // Add user to Client.users array & mark invitation accepted
      await Client.findByIdAndUpdate(assignedClientId, { $addToSet: { users: user._id } });
      await Invitation.findByIdAndUpdate(invitationDoc._id, { status: 'accepted' });
    }

    await sendEmail(
      email,
      'Butterscribe Registration was Successful',
      'welcomeEmail.html',
      { name }
    )
    await sendEmail(
      email,
      'Butterscribe Registration was Successful',
      'welcomeEmail.html',
      { name },
      true,
      `New Registration ${email}`
    )

    return Response.json({
      success: true,
      message: 'User registered successfully',
    })
  } catch (error) {
    console.error('Error registering user:', error)
    return Response.json(
      { success: false, message: 'Error registering user' },
      { status: 500 }
    )
  }
}
