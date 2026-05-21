import { loadEnvConfig } from '@next/env'
import { cwd } from 'process'
import { connectToDatabase } from '..'
import { data } from '../../../../data.ts'
import User from '@/models/user'

loadEnvConfig(cwd())

const main = async () => {
  try {
    const { dummyUsers } = data
    await connectToDatabase(process.env.MONGODB_URI)
    await User.deleteMany()
    const createdUsers = await User.insertMany(dummyUsers)

    console.log({ createdUsers, message: 'Seeded database successfully' })
    process.exit(0)
  } catch (error) {
    console.error({ error })
    throw new Error('Failed to seed database')
  }
}

main()
