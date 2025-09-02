import { requireAuth } from '../../../../utils/auth.middleware'
import { prisma } from '../../../../utils/database'
import { createSuccessResponse, createErrorResponse } from '../../../../utils/response'
import { wsPublish } from '../../../../routes/_ws'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const conversationId = getRouterParam(event, 'id') as string
  const pid = getRouterParam(event, 'pid') as string
  if (getMethod(event) !== 'PATCH') {
    throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
  }

  const actor = await prisma.conversationParticipant.findFirst({ where: { conversationId, userId: user.id } })
  if (!actor) {
    setResponseStatus(event, 403)
    return createErrorResponse('Not a participant', 'NOT_PARTICIPANT')
  }
  if (!['OWNER', 'ADMIN'].includes(actor.role)) {
    setResponseStatus(event, 403)
    return createErrorResponse('Insufficient permissions', 'FORBIDDEN')
  }

  const body = await readBody(event)
  const { role } = body as { role?: 'OWNER' | 'ADMIN' | 'MODERATOR' | 'MEMBER' }
  if (!role) {
    setResponseStatus(event, 400)
    return createErrorResponse('role required', 'INVALID')
  }

  const updated = await prisma.conversationParticipant.update({ where: { id: pid }, data: { role } })
  wsPublish(`conversation:${conversationId}`, { type: 'conversation.participant.role', participantId: pid, role })
  return createSuccessResponse({ participant: updated })
})
