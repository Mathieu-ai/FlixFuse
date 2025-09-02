import { requireAuth } from '../../utils/auth.middleware'
import { prisma } from '../../utils/database'
import { createPostSchema, formatValidationErrors } from '../../utils/validation'
import { createSuccessResponse, createErrorResponse, createValidationErrorResponse } from '../../utils/response'

// Safe post fields that can be returned to the client
const SAFE_POST_SELECT = {
  id: true,
  content: true,
  images: true,
  videos: true,
  postType: true,
  category: true,
  hashtags: true,
  visibility: true,
  location: true,
  tags: true,
  isUrgent: true,
  expiresAt: true,
  isResolved: true,
  viewCount: true,
  shareCount: true,
  saveCount: true,
  title: true,
  excerpt: true,
  createdAt: true,
  updatedAt: true,
  publishedAt: true,
  author: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      displayName: true,
      profilePicture: true
    }
  },
  pet: {
    select: {
      id: true,
      name: true,
      species: true,
      breed: true,
      profilePhoto: true
    }
  },
  _count: {
    select: {
      likes: true,
      comments: true,
      shares: true,
      saves: true
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
      const limit = Math.min(parseInt(query.limit as string) || 20, 50) // Max 50 posts per request
      const skip = (page - 1) * limit

      // Get posts from user's network (following + own posts)
      // For now, we'll show all public posts as we haven't implemented following yet
      const posts = await prisma.post.findMany({
        where: {
          visibility: 'PUBLIC',
          authorId: { not: user.id } // Exclude own posts for feed, show them separately
        },
        select: SAFE_POST_SELECT,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      })

      // Get user's own recent posts
      const userPosts = await prisma.post.findMany({
        where: { authorId: user.id },
        select: SAFE_POST_SELECT,
        orderBy: { createdAt: 'desc' },
        take: 5 // Show last 5 user posts
      })

      // Check which posts the user has liked
      const postIds = posts.map(post => post.id)
      const userLikes = await prisma.like.findMany({
        where: {
          userId: user.id,
          postId: { in: postIds }
        },
        select: { postId: true }
      })

      const likedPostIds = new Set(userLikes.map(like => like.postId))

      // Add isLiked field to posts
      const postsWithLikes = posts.map(post => ({
        ...post,
        isLiked: likedPostIds.has(post.id),
        likesCount: post._count.likes,
        commentsCount: post._count.comments,
        sharesCount: post._count.shares
      }))

      return createSuccessResponse({
        posts: postsWithLikes,
        userPosts: userPosts.map(post => ({
          ...post,
          isLiked: false, // User can't like their own posts
          likesCount: post._count.likes,
          commentsCount: post._count.comments,
          sharesCount: post._count.shares
        })),
        pagination: {
          page,
          limit,
          hasMore: posts.length === limit
        },
        message: `Found ${posts.length} posts`
      })
    } catch (error) {
      console.error('Posts fetch error:', error)
      setResponseStatus(event, 500)
      return createErrorResponse(
        'An error occurred fetching posts. Please try again.',
        'POSTS_FETCH_ERROR'
      )
    }
  }

  if (getMethod(event) === 'POST') {
    try {
      const body = await readBody(event)
      
      // Validate request body
      const validation = createPostSchema.safeParse(body)
      if (!validation.success) {
        setResponseStatus(event, 400)
        return createValidationErrorResponse(formatValidationErrors(validation.error))
      }

      const postData = validation.data

      // Verify pet ownership if petId is provided
      if (postData.petId) {
        const pet = await prisma.pet.findFirst({
          where: {
            id: postData.petId,
            ownerId: user.id
          }
        })

        if (!pet) {
          setResponseStatus(event, 403)
          return createErrorResponse(
            'You can only create posts for your own pets',
            'UNAUTHORIZED_PET_ACCESS'
          )
        }
      }

      // Prepare data for database insertion
      const createData = {
        content: postData.content,
        postType: postData.postType,
        authorId: user.id,
        publishedAt: new Date(),
        ...(postData.images && { images: postData.images }),
        ...(postData.videos && { videos: postData.videos }),
        ...(postData.category && { category: postData.category }),
        ...(postData.petId && { petId: postData.petId }),
        ...(postData.hashtags && { hashtags: postData.hashtags }),
        ...(postData.location && { location: postData.location }),
        ...(postData.tags && { tags: postData.tags }),
        ...(postData.visibility && { visibility: postData.visibility }),
        ...(postData.isUrgent !== undefined && { isUrgent: postData.isUrgent }),
        ...(postData.expiresAt && { expiresAt: new Date(postData.expiresAt) }),
        ...(postData.title && { title: postData.title }),
        ...(postData.excerpt && { excerpt: postData.excerpt })
      }

      // Create the post
      const newPost = await prisma.post.create({
        data: createData,
        select: SAFE_POST_SELECT
      })

      setResponseStatus(event, 201)
      return createSuccessResponse({
        post: {
          ...newPost,
          isLiked: false,
          likesCount: 0,
          commentsCount: 0,
          sharesCount: 0,
          savesCount: 0
        }
      })
    } catch (error) {
      console.error('Post creation error:', error)
      setResponseStatus(event, 500)
      return createErrorResponse(
        'An error occurred creating your post. Please try again.',
        'POST_CREATION_ERROR'
      )
    }
  }

  // Method not allowed
  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  })
})
