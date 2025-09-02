import { requireAuth } from '../../../utils/auth.middleware'
import { prisma } from '../../../utils/database'
import { createCommentSchema, formatValidationErrors } from '../../../utils/validation'
import { createSuccessResponse, createErrorResponse, createValidationErrorResponse } from '../../../utils/response'

// Safe comment fields that can be returned to the client
const SAFE_COMMENT_SELECT = {
  id: true,
  content: true,
  createdAt: true,
  updatedAt: true,
  isEdited: true,
  author: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      displayName: true,
      profilePicture: true
    }
  },
  _count: {
    select: {
      likes: true,
      replies: true
    }
  }
} as const

export default defineEventHandler(async (event) => {
  // Require authentication
  const user = await requireAuth(event)
  const postId = getRouterParam(event, 'id')

  if (!postId) {
    setResponseStatus(event, 400)
    return createErrorResponse('Post ID is required', 'MISSING_POST_ID')
  }

  if (getMethod(event) === 'GET') {
    try {
      const query = getQuery(event)
      const page = parseInt(query.page as string) || 1
      const limit = Math.min(parseInt(query.limit as string) || 20, 50)
      const skip = (page - 1) * limit

      // Get comments for the post
      const comments = await prisma.comment.findMany({
        where: { 
          postId: postId,
          parentId: null // Only top-level comments
        },
        select: SAFE_COMMENT_SELECT,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      })

      // Check which comments the user has liked
      const commentIds = comments.map(comment => comment.id)
      const userLikes = await prisma.like.findMany({
        where: {
          userId: user.id,
          commentId: { in: commentIds }
        },
        select: { commentId: true }
      })

      const likedCommentIds = new Set(userLikes.map(like => like.commentId))

      // Add isLiked field to comments
      const commentsWithLikes = comments.map(comment => ({
        ...comment,
        isLiked: likedCommentIds.has(comment.id),
        likesCount: comment._count.likes,
        repliesCount: comment._count.replies
      }))

      return createSuccessResponse({
        comments: commentsWithLikes,
        pagination: {
          page,
          limit,
          hasMore: comments.length === limit
        }
      })
    } catch (error) {
      console.error('Comments fetch error:', error)
      setResponseStatus(event, 500)
      return createErrorResponse(
        'An error occurred fetching comments. Please try again.',
        'COMMENTS_FETCH_ERROR'
      )
    }
  }

  if (getMethod(event) === 'POST') {
    try {
      const body = await readBody(event)
      
      // Validate request body
      const validation = createCommentSchema.safeParse({
        ...body,
        postId: postId
      })
      
      if (!validation.success) {
        setResponseStatus(event, 400)
        return createValidationErrorResponse(formatValidationErrors(validation.error))
      }

      const commentData = validation.data

      // Check if post exists
      const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { id: true }
      })

      if (!post) {
        setResponseStatus(event, 404)
        return createErrorResponse('Post not found', 'POST_NOT_FOUND')
      }

      // If it's a reply, check if parent comment exists
      if (commentData.parentId) {
        const parentComment = await prisma.comment.findUnique({
          where: { id: commentData.parentId },
          select: { id: true, postId: true }
        })

        if (!parentComment || parentComment.postId !== postId) {
          setResponseStatus(event, 404)
          return createErrorResponse('Parent comment not found', 'PARENT_COMMENT_NOT_FOUND')
        }
      }

      // Create the comment
      const newComment = await prisma.comment.create({
        data: {
          content: commentData.content,
          postId: postId,
          authorId: user.id,
          ...(commentData.parentId && { parentId: commentData.parentId })
        },
        select: SAFE_COMMENT_SELECT
      })

      setResponseStatus(event, 201)
      return createSuccessResponse({
        comment: {
          ...newComment,
          isLiked: false,
          likesCount: 0,
          repliesCount: 0
        }
      })
    } catch (error) {
      console.error('Comment creation error:', error)
      setResponseStatus(event, 500)
      return createErrorResponse(
        'An error occurred creating your comment. Please try again.',
        'COMMENT_CREATION_ERROR'
      )
    }
  }

  // Method not allowed
  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  })
})