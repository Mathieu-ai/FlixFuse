import { requireAuth } from '../../utils/auth.middleware'
import { prisma } from '../../utils/database'
import { createSuccessResponse, createErrorResponse } from '../../utils/response'

// Safe conversation fields that can be returned to the client
const SAFE_CONVERSATION_SELECT = {
  id: true,
  name: true,
  isGroup: true,
  isPublic: true,
  description: true,
  avatar: true,
  lastMessageAt: true,
  isArchived: true,
  isMuted: true,
  tags: true,
  category: true,
  createdAt: true,
  updatedAt: true,
  participants: {
    select: {
      id: true,
      role: true,
      joinedAt: true,
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          displayName: true,
              profilePicture: true,
              isOnline: true,
              lastActiveAt: true
        }
      }
    }
  },
  messages: {
    select: {
      id: true,
      content: true,
      messageType: true,
      createdAt: true,
      sender: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          displayName: true,
          profilePicture: true
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 1 // Get last message
  },
  _count: {
    select: {
      messages: true,
      participants: true
    }
  }
} as const

export default defineEventHandler(async (event) => {
  // Require authentication
  const user = await requireAuth(event)

  if (getMethod(event) === 'GET') {
    try {
      const query = getQuery(event)
      const page = parseInt(query.page as string) || 1
      const limit = Math.min(parseInt(query.limit as string) || 20, 50)
      const skip = (page - 1) * limit

      // Get user's conversations
      const conversations = await prisma.conversation.findMany({
        where: {
          participants: {
            some: {
              userId: user.id
            }
          }
        },
        select: SAFE_CONVERSATION_SELECT,
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit
      })

      // Transform conversations for client
      const transformedConversations = conversations.map(conversation => ({
        ...conversation,
        lastMessage: conversation.messages[0] || null,
        messages: undefined, // Remove messages array
        messagesCount: conversation._count.messages,
        participantsCount: conversation._count.participants,
        _count: undefined // Remove _count
      }))

      return createSuccessResponse({
        conversations: transformedConversations,
        pagination: {
          page,
          limit,
          hasMore: conversations.length === limit
        }
      })
    } catch (error) {
      console.error('Conversations fetch error:', error)
      setResponseStatus(event, 500)
      return createErrorResponse(
        'An error occurred fetching conversations. Please try again.',
        'CONVERSATIONS_FETCH_ERROR'
      )
    }
  }

  if (getMethod(event) === 'POST') {
    try {
      const body = await readBody(event)
      const { participantIds, name, isGroup } = body

      if (!participantIds || !Array.isArray(participantIds) || participantIds.length === 0) {
        setResponseStatus(event, 400)
        return createErrorResponse('Participant IDs are required', 'MISSING_PARTICIPANTS')
      }

      // For direct messages, ensure only 2 participants (current user + one other)
      if (!isGroup && participantIds.length !== 1) {
        setResponseStatus(event, 400)
        return createErrorResponse('Direct messages must have exactly one other participant', 'INVALID_DM_PARTICIPANTS')
      }

      // Check if participants exist
      const participants = await prisma.user.findMany({
        where: {
          id: { in: participantIds }
        },
        select: { id: true }
      })

      if (participants.length !== participantIds.length) {
        setResponseStatus(event, 400)
        return createErrorResponse('Some participants not found', 'PARTICIPANTS_NOT_FOUND')
      }

      // For direct messages, check if conversation already exists
      if (!isGroup) {
        const existingConversation = await prisma.conversation.findFirst({
          where: {
            isGroup: false,
            participants: {
              every: {
                userId: { in: [user.id, participantIds[0]] }
              }
            }
          },
          select: { id: true }
        })

        if (existingConversation) {
          setResponseStatus(event, 400)
          return createErrorResponse('Conversation already exists', 'CONVERSATION_EXISTS')
        }
      }

      // Create conversation
      const conversation = await prisma.conversation.create({
        data: {
          name: name || null,
          isGroup: isGroup || false,
          participants: {
            create: [
              {
                userId: user.id,
                role: isGroup ? 'ADMIN' : 'MEMBER'
              },
              ...participantIds.map((participantId: string) => ({
                userId: participantId,
                role: 'MEMBER' as const
              }))
            ]
          }
        },
        select: SAFE_CONVERSATION_SELECT
      })

      // Notify invited participants so they can see the new conversation live
      try {
        const { wsPublish } = await import('../../routes/_ws')
        for (const pid of participantIds) {
          // user-scoped topic allows clients to subscribe once per session
          wsPublish(`user:${pid}:conversations`, {
            type: 'conversation.created',
            conversation: {
              ...conversation,
              lastMessage: null,
              messages: undefined,
              messagesCount: 0,
              participantsCount: conversation._count.participants,
              _count: undefined
            }
          })
        }
      } catch {
        // ignore ws errors
      }

      setResponseStatus(event, 201)
      return createSuccessResponse({
        conversation: {
          ...conversation,
          lastMessage: null,
          messages: undefined,
          messagesCount: 0,
          participantsCount: conversation._count.participants,
          _count: undefined
        }
      })
    } catch (error) {
      console.error('Conversation creation error:', error)
      setResponseStatus(event, 500)
      return createErrorResponse(
        'An error occurred creating the conversation. Please try again.',
        'CONVERSATION_CREATION_ERROR'
      )
    }
  }

  // Method not allowed
  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  })
})