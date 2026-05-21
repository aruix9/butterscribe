import { connectToDatabase } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { sendEmail } from '@/utils/sendEmail'
import User from '@/models/user'

export async function POST(req: Request) {
  await connectToDatabase()

  try {
    const { name, email, password } = await req.json()

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return Response.json(
        { success: false, message: 'User already exists' },
        { status: 400 }
      )
    }

    // Create new user
    const hasPassword = await bcrypt.hash(password, 10)
    const user = new User({ name, email, password: hasPassword })
    await user.save()
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
