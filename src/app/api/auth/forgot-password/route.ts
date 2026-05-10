import { connectToDatabase } from '@/lib/db'
import User from '@/models/user'
import { sendEmail } from '@/utils/sendEmail'
import jwt from 'jsonwebtoken'

export async function POST(req: Request) {
  await connectToDatabase()

  try {
    const email = await req.text(); 
    // Check if user already exists
    const user = await User.findOne({ email })
    if (!user) {
      return Response.json(
        { success: false, message: 'User not found!' },
        { status: 400 }
      )
    }

    // Generate a reset token (JWT)
    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    })

    // Send password reset email with the token
    const resetUrl = `${process.env.CLIENT_URL}/auth/reset-password/${resetToken}`

    await sendEmail(
      email,
      'Butterscribe Password Reset Request',
      'forgotPassword.html',
      { resetUrl }
    )

    return Response.json({
      success: true,
      message: 'Password reset email sent!',
    })
  } catch (error) {
    console.error('Error forgot password user:', error)
    return Response.json(
      { success: false, message: 'Error forgot password user' },
      { status: 500 }
    )
  }
}
