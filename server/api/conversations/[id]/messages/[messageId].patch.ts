import { requireAuth } from '../../../../utils/auth.middleware'
import { prisma } from '../../../../utils/database'
import { createSuccessResponse, createErrorResponse } from '../../../../utils/response'
import { wsPublish } from '../../../../routes/_ws'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const conversationId = getRouterParam(event, 'id') as string
  const messageId = getRouterParam(event, 'messageId') as string

  if (getMethod(event) !== 'PATCH') {
    throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
  }

  if (!conversationId || !messageId) {
    setResponseStatus(event, 400)
    return createErrorResponse('Missing conversation or message id', 'MISSING_IDS')
  }

  const participant = await prisma.conversationParticipant.findFirst({ where: { conversationId, userId: user.id } })
  if (!participant) {
    setResponseStatus(event, 403)
    return createErrorResponse('Not a participant', 'NOT_PARTICIPANT')
  }

  const body = await readBody(event)
  const { content } = body as { content?: string }
  if (typeof content !== 'string' || content.trim() === '') {
    setResponseStatus(event, 400)
    return createErrorResponse('Content is required', 'EMPTY_CONTENT')
  }

  // Only author can edit (or admins with permission)
  const msg = await prisma.message.findUnique({ where: { id: messageId }, select: { id: true, senderId: true, conversationId: true } })
  if (!msg || msg.conversationId !== conversationId) {
    setResponseStatus(event, 404)
    return createErrorResponse('Message not found', 'NOT_FOUND')
  }
  const canAdminEdit = ['OWNER', 'ADMIN', 'MODERATOR'].includes(participant.role)
  if (msg.senderId !== user.id && !canAdminEdit) {
    setResponseStatus(event, 403)
    return createErrorResponse('You cannot edit this message', 'FORBIDDEN')
  }

  const updated = await prisma.message.update({
    where: { id: messageId },
    data: { content, isEdited: true, editedAt: new Date() },
    select: {
      id: true, content: true, isEdited: true, editedAt: true, messageType: true, attachments: true, createdAt: true, reactions: true,
      sender: { select: { id: true, firstName: true, lastName: true, displayName: true, profilePicture: true } },
      replyToId: true, replyTo: { select: { id: true, content: true, sender: { select: { id: true, firstName: true, displayName: true } } } }
    }
  })

  wsPublish(`conversation:${conversationId}`, { type: 'conversation.message.update', conversationId, message: updated })
  return createSuccessResponse({ message: updated })
})
