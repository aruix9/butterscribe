import { loadEnvConfig } from '@next/env'
import { cwd } from 'process'
import Link from '@/models/link'
import { data } from '../../../../data.ts'
import { connectToDatabase } from '..'

loadEnvConfig(cwd())

const main = async () => {
  try {
    const { dummyLinks } = data
    await connectToDatabase(process.env.MONGODB_URI)
    await Link.deleteMany()
    const createdLinks = await Link.insertMany(dummyLinks)

    console.log({ createdLinks, message: 'Seeded database successfully' })
    process.exit(0)
  } catch (error) {
    console.error({ error })
    throw new Error('Failed to seed database')
  }
}

main()
