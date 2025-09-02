import { PrismaClient } from '@prisma/client'
import { comparePassword } from '../server/services/auth.service.ts'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.findUnique({ where: { email: 'alice@example.com' } })
  if (!user) {
    console.error('Alice not found')
    process.exit(1)
  }
  console.log('stored hash:', user.passwordHash)
  const ok = await comparePassword('password123', user.passwordHash)
  console.log('comparePassword result:', ok)
  await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
