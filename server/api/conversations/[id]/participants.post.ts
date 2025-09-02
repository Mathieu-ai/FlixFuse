import { requireAuth } from '../../../utils/auth.middleware'
import { prisma } from '../../../utils/database'
import { createSuccessResponse, createErrorResponse } from '../../../utils/response'
import { wsPublish } from '../../../routes/_ws'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const conversationId = getRouterParam(event, 'id') as string
  if (getMethod(event) !== 'POST') {
    throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
  }

  const actor = await prisma.conversationParticipant.findFirst({ where: { conversationId, userId: user.id } })
  if (!actor) {
    setResponseStatus(event, 403)
    return createErrorResponse('Not a participant', 'NOT_PARTICIPANT')
  }
  if (!['OWNER', 'ADMIN', 'MODERATOR'].includes(actor.role)) {
    setResponseStatus(event, 403)
    return createErrorResponse('Insufficient permissions', 'FORBIDDEN')
  }

  const body = await readBody(event)
  const { userIds } = body as { userIds?: string[] }
  if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
    setResponseStatus(event, 400)
    return createErrorResponse('userIds required', 'INVALID')
  }

  // Avoid duplicates
  const existing = await prisma.conversationParticipant.findMany({ where: { conversationId, userId: { in: userIds } }, select: { userId: true } })
  const toAdd = userIds.filter((id) => !existing.some((e) => e.userId === id))
  if (toAdd.length === 0) return createSuccessResponse({ added: 0 })

  await prisma.conversationParticipant.createMany({ data: toAdd.map((uid) => ({ conversationId, userId: uid, role: 'MEMBER' })) })
  wsPublish(`conversation:${conversationId}`, { type: 'conversation.participant.added', userIds: toAdd })
  return createSuccessResponse({ added: toAdd.length })
})
