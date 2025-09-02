import { requireAuth } from '../../../utils/auth.middleware'
import { prisma } from '../../../utils/database'
import { createSuccessResponse, createErrorResponse } from '../../../utils/response'

export default defineEventHandler(async (event) => {
  // Require authentication
  const user = await requireAuth(event)
  const postId = getRouterParam(event, 'id')

  if (!postId) {
    setResponseStatus(event, 400)
    return createErrorResponse('Post ID is required', 'MISSING_POST_ID')
  }

  if (getMethod(event) === 'POST') {
    try {
      // Check if post exists
      const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { id: true, authorId: true }
      })

      if (!post) {
        setResponseStatus(event, 404)
        return createErrorResponse('Post not found', 'POST_NOT_FOUND')
      }

      // Check if user already liked this post
      const existingLike = await prisma.like.findUnique({
        where: {
          userId_postId: {
            userId: user.id,
            postId: postId
          }
        }
      })

      if (existingLike) {
        setResponseStatus(event, 400)
        return createErrorResponse('Post already liked', 'ALREADY_LIKED')
      }

      // Create the like
      const like = await prisma.like.create({
        data: {
          userId: user.id,
          postId: postId,
          reactionType: 'LIKE'
        }
      })

      // Get updated like count
      const likesCount = await prisma.like.count({
        where: { postId: postId }
      })

      return createSuccessResponse({
        like,
        likesCount,
        isLiked: true
      })
    } catch (error) {
      console.error('Like creation error:', error)
      setResponseStatus(event, 500)
      return createErrorResponse(
        'An error occurred liking the post. Please try again.',
        'LIKE_CREATION_ERROR'
      )
    }
  }

  if (getMethod(event) === 'DELETE') {
    try {
      // Check if like exists
      const existingLike = await prisma.like.findUnique({
        where: {
          userId_postId: {
            userId: user.id,
            postId: postId
          }
        }
      })

      if (!existingLike) {
        setResponseStatus(event, 404)
        return createErrorResponse('Like not found', 'LIKE_NOT_FOUND')
      }

      // Delete the like
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId: user.id,
            postId: postId
          }
        }
      })

      // Get updated like count
      const likesCount = await prisma.like.count({
        where: { postId: postId }
      })

      return createSuccessResponse({
        likesCount,
        isLiked: false
      })
    } catch (error) {
      console.error('Like deletion error:', error)
      setResponseStatus(event, 500)
      return createErrorResponse(
        'An error occurred unliking the post. Please try again.',
        'LIKE_DELETION_ERROR'
      )
    }
  }

  // Method not allowed
  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  })
})
