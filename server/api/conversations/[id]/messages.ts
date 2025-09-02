import { requireAuth } from '../../../utils/auth.middleware'
import { prisma } from '../../../utils/database'
import { createSuccessResponse, createErrorResponse } from '../../../utils/response'
import { wsPublish } from '../../../routes/_ws'

// Safe message fields that can be returned to the client
const SAFE_MESSAGE_SELECT = {
  id: true,
  content: true,
  messageType: true,
  attachments: true,
  thumbnails: true,
  isEdited: true,
  editedAt: true,
  replyToId: true,
  createdAt: true,
  reactions: true,
  readBy: true,
  sender: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      displayName: true,
  profilePicture: true,
  isOnline: true,
  lastActiveAt: true
    }
  },
  replyTo: {
    select: {
      id: true,
      content: true,
      sender: {
        select: {
          id: true,
          firstName: true,
          displayName: true
        }
      }
    }
  }
} as const

export default defineEventHandler(async (event) => {
  // Require authentication
  const user = await requireAuth(event)
  const conversationId = getRouterParam(event, 'id')

  if (!conversationId) {
    setResponseStatus(event, 400)
    return createErrorResponse('Conversation ID is required', 'MISSING_CONVERSATION_ID')
  }

  // Check if user is participant in the conversation
  const participant = await prisma.conversationParticipant.findFirst({
    where: {
      conversationId: conversationId,
      userId: user.id
    }
  })

  if (!participant) {
    setResponseStatus(event, 403)
    return createErrorResponse('You are not a participant in this conversation', 'NOT_PARTICIPANT')
  }

  if (getMethod(event) === 'GET') {
    try {
      const query = getQuery(event)
      const page = parseInt(query.page as string) || 1
      const limit = Math.min(parseInt(query.limit as string) || 10, 100)
      const beforeId = (query.beforeId as string) || undefined

      // Cursor pagination: load older messages older than beforeId if provided
  const baseWhere = { conversationId: conversationId }

      const messages = await prisma.message.findMany({
        where: baseWhere,
        select: SAFE_MESSAGE_SELECT,
        orderBy: { createdAt: 'desc' },
        ...(beforeId ? { cursor: { id: beforeId }, skip: 1 } : {}),
        take: limit
      })

  // Note: read receipts update skipped for now (JSON field); implement separately if needed

      // Reverse to show oldest first
      const orderedMessages = messages.reverse()

      const nextBeforeId = orderedMessages.length ? orderedMessages[0]!.id : undefined
      return createSuccessResponse({
        messages: orderedMessages,
        pagination: {
          page,
          limit,
          hasMore: messages.length === limit,
          nextBeforeId
        }
      })
    } catch (error) {
      console.error('Messages fetch error:', error)
      setResponseStatus(event, 500)
      return createErrorResponse(
        'An error occurred fetching messages. Please try again.',
        'MESSAGES_FETCH_ERROR'
      )
    }
  }

  if (getMethod(event) === 'POST') {
    try {
      const body = await readBody(event)
  const { content, messageType = 'TEXT', mediaUrls, attachments, replyToId } = body

  const payloadAttachments: string[] = attachments || mediaUrls || []

  if (!content && (!payloadAttachments || payloadAttachments.length === 0)) {
        setResponseStatus(event, 400)
        return createErrorResponse('Message content or media is required', 'EMPTY_MESSAGE')
      }

      // Validate reply message if replyToId is provided
      if (replyToId) {
        const replyMessage = await prisma.message.findFirst({
          where: {
            id: replyToId,
            conversationId: conversationId
          }
        })

        if (!replyMessage) {
          setResponseStatus(event, 404)
          return createErrorResponse('Reply message not found', 'REPLY_MESSAGE_NOT_FOUND')
        }
      }

      // Create the message
      const newMessage = await prisma.message.create({
        data: {
          content: content || '',
          messageType: messageType,
          attachments: payloadAttachments || [],
          conversationId: conversationId,
          senderId: user.id,
          readBy: [user.id], // JSON array of userIds for simplicity
          ...(replyToId && { replyToId: replyToId })
        },
  select: SAFE_MESSAGE_SELECT
      })

      // Update conversation's lastMessageAt
      await prisma.conversation.update({
        where: { id: conversationId },
        data: { 
          lastMessageAt: new Date(),
          updatedAt: new Date()
        }
      })

      // Broadcast over WebSocket to conversation topic
      wsPublish(`conversation:${conversationId}`, {
        type: 'conversation.message',
        conversationId,
        message: newMessage
      })

      // Additionally notify all participants on their user-scoped topic for reliability
      try {
        const participants = await prisma.conversationParticipant.findMany({
          where: { conversationId },
          select: { userId: true }
        })
        for (const p of participants) {
          wsPublish(`user:${p.userId}:conversations`, {
            type: 'conversation.message',
            conversationId,
            message: newMessage
          })
        }
      } catch {
        // ignore participant fetch/publish errors
      }

      setResponseStatus(event, 201)
      return createSuccessResponse({
        message: newMessage
      })
    } catch (error) {
      console.error('Message creation error:', error)
      setResponseStatus(event, 500)
      return createErrorResponse(
        'An error occurred sending your message. Please try again.',
        'MESSAGE_CREATION_ERROR'
      )
    }
  }

  // Method not allowed
  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  })
})