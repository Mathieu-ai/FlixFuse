import { requireAuth } from '../../../../utils/auth.middleware'
import { prisma } from '../../../../utils/database'
import { createSuccessResponse, createErrorResponse } from '../../../../utils/response'
import { wsPublish } from '../../../../routes/_ws'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const conversationId = getRouterParam(event, 'id') as string
  const messageId = getRouterParam(event, 'messageId') as string

  if (getMethod(event) !== 'DELETE') {
    throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
  }

  const msg = await prisma.message.findUnique({ where: { id: messageId }, select: { id: true, senderId: true, conversationId: true } })
  if (!msg || msg.conversationId !== conversationId) {
    setResponseStatus(event, 404)
    return createErrorResponse('Message not found', 'NOT_FOUND')
  }

  const participant = await prisma.conversationParticipant.findFirst({ where: { conversationId, userId: user.id } })
  if (!participant) {
    setResponseStatus(event, 403)
    return createErrorResponse('Not a participant', 'NOT_PARTICIPANT')
  }

  const canAdminDelete = ['OWNER', 'ADMIN', 'MODERATOR'].includes(participant.role)
  if (msg.senderId !== user.id && !canAdminDelete) {
    setResponseStatus(event, 403)
    return createErrorResponse('You cannot delete this message', 'FORBIDDEN')
  }

  const updated = await prisma.message.update({
    where: { id: messageId },
    data: { isDeleted: true, deletedAt: new Date(), deletedBy: user.id, deleteType: 'FOR_EVERYONE' },
    select: { id: true }
  })

  wsPublish(`conversation:${conversationId}`, { type: 'conversation.message.delete', conversationId, messageId: updated.id })
  return createSuccessResponse({ ok: true })
})
