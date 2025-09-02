import { requireAuth } from '../../../../utils/auth.middleware'
import { prisma } from '../../../../utils/database'
import { createSuccessResponse, createErrorResponse } from '../../../../utils/response'
import { wsPublish } from '../../../../routes/_ws'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const conversationId = getRouterParam(event, 'id') as string
  const pid = getRouterParam(event, 'pid') as string
  if (getMethod(event) !== 'DELETE') {
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

  await prisma.conversationParticipant.delete({ where: { id: pid } })
  wsPublish(`conversation:${conversationId}`, { type: 'conversation.participant.removed', participantId: pid })
  return createSuccessResponse({ ok: true })
})
