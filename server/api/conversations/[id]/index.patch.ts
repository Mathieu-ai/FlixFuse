import { requireAuth } from '../../../utils/auth.middleware'
import { prisma } from '../../../utils/database'
import { createSuccessResponse, createErrorResponse } from '../../../utils/response'
import { wsPublish } from '../../../routes/_ws'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const conversationId = getRouterParam(event, 'id') as string
  if (getMethod(event) !== 'PATCH') {
    throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
  }

  const participant = await prisma.conversationParticipant.findFirst({ where: { conversationId, userId: user.id } })
  if (!participant) {
    setResponseStatus(event, 403)
    return createErrorResponse('Not a participant', 'NOT_PARTICIPANT')
  }
  if (!['OWNER', 'ADMIN', 'MODERATOR'].includes(participant.role)) {
    setResponseStatus(event, 403)
    return createErrorResponse('Insufficient permissions', 'FORBIDDEN')
  }

  const body = await readBody(event)
  const data: Partial<{ name: string; description: string; avatar: string; isMuted: boolean; isArchived: boolean }> = {}
  const allowed = ['name', 'description', 'avatar', 'isMuted', 'isArchived'] as const
  for (const k of allowed) {
    if (Object.prototype.hasOwnProperty.call(body, k)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(data as any)[k] = (body as any)[k]
    }
  }

  const updated = await prisma.conversation.update({ where: { id: conversationId }, data, select: { id: true, name: true, description: true, avatar: true, isMuted: true, isArchived: true, updatedAt: true } })
  wsPublish(`conversation:${conversationId}`, { type: 'conversation.updated', conversation: updated })
  return createSuccessResponse({ conversation: updated })
})
