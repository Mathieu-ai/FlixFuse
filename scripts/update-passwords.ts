import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../server/services/auth.service.ts'

const prisma = new PrismaClient()

async function main() {
  const emails = ['alice@example.com', 'bob@example.com', 'carol@example.com']
  for (const email of emails) {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      console.log('user not found', email)
      continue
    }
    const newHash = await hashPassword('password123')
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash: newHash } })
    console.log('updated password for', email)
  }
  // Also update users user1..user15
  for (let i = 1; i <= 15; i++) {
    const email = `user${i}@example.com`
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) continue
    const newHash = await hashPassword('password123')
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash: newHash } })
  }
  await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
