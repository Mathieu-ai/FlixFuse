import { requireAuth } from '../../../../../utils/auth.middleware'
import { prisma } from '../../../../../utils/database'
import { createSuccessResponse, createErrorResponse } from '../../../../../utils/response'
import { wsPublish } from '../../../../../routes/_ws'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const conversationId = getRouterParam(event, 'id') as string
  const messageId = getRouterParam(event, 'messageId') as string

  if (getMethod(event) !== 'POST') {
    throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
  }

  const body = await readBody(event)
  const { reaction, action } = body as { reaction?: string; action?: 'add' | 'remove' }
  if (!reaction || !['add', 'remove'].includes(action as string)) {
    setResponseStatus(event, 400)
    return createErrorResponse('Invalid reaction payload', 'INVALID')
  }

  const participant = await prisma.conversationParticipant.findFirst({ where: { conversationId, userId: user.id } })
  if (!participant) {
    setResponseStatus(event, 403)
    return createErrorResponse('Not a participant', 'NOT_PARTICIPANT')
  }

  const msg = await prisma.message.findUnique({ where: { id: messageId }, select: { id: true, conversationId: true, reactions: true } })
  if (!msg || msg.conversationId !== conversationId) {
    setResponseStatus(event, 404)
    return createErrorResponse('Message not found', 'NOT_FOUND')
  }

  type Reaction = { userId: string; reaction: string; ts: number }
  const list: Reaction[] = Array.isArray(msg.reactions as unknown as Reaction[]) ? (msg.reactions as unknown as Reaction[]) : []
  const now = Date.now()
  let next: Reaction[]
  if (action === 'add') {
    // replace existing reaction by same user
  next = list.filter((r) => r.userId !== user.id)
    next.push({ userId: user.id, reaction, ts: now })
  } else {
  next = list.filter((r) => !(r.userId === user.id && r.reaction === reaction))
  }

  await prisma.message.update({ where: { id: messageId }, data: { reactions: next as unknown as object } })

  wsPublish(`conversation:${conversationId}`, { type: 'conversation.reaction', conversationId, messageId, reactions: next })
  return createSuccessResponse({ reactions: next })
})
