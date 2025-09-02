import { prisma } from '../../utils/database'
import { resendVerificationSchema, formatValidationErrors } from '../../utils/validation'
import { createSuccessResponse, createErrorResponse, createValidationErrorResponse } from '../../utils/response'
import { generateVerificationToken } from '../../services/auth.service'
import { sendWelcomeEmail } from '../../services/email.service'
import { sendPhoneVerificationSMS, generatePhoneVerificationCode } from '../../services/sms.service'

export default defineEventHandler(async (event) => {
  if (getMethod(event) !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
  }

  try {
    const body = await readBody(event)
    console.log('Resend verification request:', body)
    
    // Validate request body
    const validation = resendVerificationSchema.safeParse(body)
    if (!validation.success) {
      console.log('Validation failed:', validation.error)
      setResponseStatus(event, 400)
      return createValidationErrorResponse(formatValidationErrors(validation.error))
    }

    const { type, identifier } = validation.data
    console.log('Resend verification for:', { type, identifier })

    // Find user by email or phone number
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { phoneNumber: identifier }
        ]
      }
    })

    console.log('Found user:', user ? { id: user.id, email: user.email, phoneNumber: user.phoneNumber } : 'No user found')

    if (!user) {
      // Don't reveal if user exists or not for security
      return createSuccessResponse({
        message: 'If an account with this information exists, a verification message will be sent.'
      })
    }

    // Check if already verified
    if (type === 'email' && user.isEmailVerified) {
      return createErrorResponse(
        'This email is already verified',
        'ALREADY_VERIFIED'
      )
    }

    if (type === 'phone' && user.isPhoneVerified) {
      return createErrorResponse(
        'This phone number is already verified',
        'ALREADY_VERIFIED'
      )
    }

    try {
      if (type === 'email') {
        if (!user.email) {
          return createErrorResponse(
            'No email address associated with this account',
            'NO_EMAIL_ADDRESS'
          )
        }

        // Generate new email verification token
        const emailVerificationToken = generateVerificationToken()
        
        await prisma.user.update({
          where: { id: user.id },
          data: { emailVerificationToken }
        })

        await sendWelcomeEmail(user.email, user.firstName, emailVerificationToken)
      } else if (type === 'phone') {
        if (!user.phoneNumber) {
          return createErrorResponse(
            'No phone number associated with this account',
            'NO_PHONE_NUMBER'
          )
        }

        // Generate new phone verification code
        const phoneVerificationCode = generatePhoneVerificationCode()
        
        await prisma.user.update({
          where: { id: user.id },
          data: { phoneVerificationToken: phoneVerificationCode }
        })

        await sendPhoneVerificationSMS(user.phoneNumber, user.firstName, phoneVerificationCode)
      }

      return createSuccessResponse({
        message: `Verification ${type === 'email' ? 'email' : 'code'} sent successfully.`
      })

    } catch (sendError) {
      console.error(`Failed to resend ${type} verification:`, sendError)
      setResponseStatus(event, 500)
      return createErrorResponse(
        `Failed to send verification ${type === 'email' ? 'email' : 'code'}. Please try again.`,
        'SEND_FAILED'
      )
    }

  } catch (error) {
    console.error('Resend verification error:', error)
    setResponseStatus(event, 500)
    return createErrorResponse(
      'An error occurred while resending verification. Please try again.',
      'RESEND_ERROR'
    )
  }
})
