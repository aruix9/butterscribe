import { connectToDatabase } from '@/lib/db'
import User from '@/models/user'
import { sendEmail } from '@/utils/sendEmail'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(req: Request) {
  await connectToDatabase()
  try {
    const { password, token } = await req.json()
    const secret = process.env.JWT_SECRET
    if (!secret) {
      throw new Error('JWT_SECRET is not defined')
    }
    const decoded = jwt.verify(token, secret)
    if (
      typeof decoded !== 'object' ||
      decoded === null ||
      !('userId' in decoded)
    ) {
      throw new Error('Invalid token payload')
    }
    const user = await User.findById(decoded.userId)
    if (!user) {
      return Response.json(
        { success: false, message: 'User not found!' },
        { status: 400 }
      )
    }
    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Update the user's password
    user.password = hashedPassword
    await user.save()
    await sendEmail(
      user.email,
      'Butterscribe Password Reset Successful',
      'resetPassword.html'
    )

    return Response.json({
      success: true,
      message: 'User password was changed!',
    })
  } catch (error) {
    console.error('Error reset password user:', error)
    return Response.json(
      { success: false, message: 'Error reset password user' },
      { status: 500 }
    )
  }
}
