import { prisma } from '../../utils/database'
import { createSuccessResponse, createErrorResponse } from '../../utils/response'
import { hashPassword, generateVerificationToken, generateTokens, storeRefreshToken } from '../../services/auth.service'
import { sendWelcomeEmail } from '../../services/email.service'
import { sendPhoneVerificationSMS, generatePhoneVerificationCode } from '../../services/sms.service'
import { setAuthCookies } from '../../utils/cookies'

export default defineEventHandler(async (event) => {
  if (getMethod(event) !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
  }

  const csrfHeader = getHeader(event, 'x-csrf-token')
  const csrfCookie = getCookie(event, 'csrf_token')
  if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) {
    setResponseStatus(event, 403)
    return createErrorResponse('Invalid CSRF token', 'CSRF_INVALID')
  }

  try {
    const body = await readBody(event)
    const { email, password, firstName, lastName, phoneNumber } = body as {
      email?: string
      password?: string
      firstName?: string
      lastName?: string
      phoneNumber?: string
    }
    if (!password || !firstName) {
      setResponseStatus(event, 400)
      return createErrorResponse('Missing required fields')
    }

    // Normalize empty strings to null/undefined for database consistency
    const normalizedEmail = `${email && email.trim() !== '' ? email.trim() : null}`
    const normalizedPhoneNumber = phoneNumber && phoneNumber.trim() !== '' ? phoneNumber.trim() : null

    // Ensure at least one contact method is provided
    if (!normalizedEmail && !normalizedPhoneNumber) {
      setResponseStatus(event, 400)
      return createErrorResponse(
        'Please provide either an email address or phone number',
        'MISSING_CONTACT_INFO'
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          ...(normalizedEmail ? [{ email: normalizedEmail }] : []),
          ...(normalizedPhoneNumber ? [{ phoneNumber: normalizedPhoneNumber }] : [])
        ]
      }
    })

    if (existingUser) {
      setResponseStatus(event, 409)
      const conflictField = existingUser.email === normalizedEmail ? 'email' : 'phone number'
      return createErrorResponse(
        `An account with this ${conflictField} already exists`,
        'USER_ALREADY_EXISTS'
      )
    }

    // Hash password and generate verification tokens
    const passwordHash = await hashPassword(password)
    const emailVerificationToken = normalizedEmail ? generateVerificationToken() : null
    const phoneVerificationCode = normalizedPhoneNumber ? generatePhoneVerificationCode() : null

    // Create user
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        firstName,
        lastName,
        phoneNumber: normalizedPhoneNumber,
        passwordHash,
        emailVerificationToken,
        phoneVerificationToken: phoneVerificationCode,
        role: 'MEMBER',
        status: 'PENDING_VERIFICATION'
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        createdAt: true
      }
    })

    // Determine verification method based on priority: SMS > Email
    // If phone is provided, prefer SMS over email
    const shouldSendSMS = normalizedPhoneNumber !== null
    const shouldSendEmail = normalizedEmail !== null && (!shouldSendSMS || !normalizedPhoneNumber)

    let verificationMessage = ''

    // Send SMS verification if phone number is provided (higher priority)
    if (shouldSendSMS && phoneVerificationCode && normalizedPhoneNumber) {
      try {
        await sendPhoneVerificationSMS(normalizedPhoneNumber, firstName, phoneVerificationCode)
        verificationMessage = 'Account created successfully. Please check your phone for a verification code.'
      } catch (smsError) {
        console.error('Failed to send verification SMS:', smsError)
        // Fall back to email if SMS fails and email is available
        if (shouldSendEmail && normalizedEmail && emailVerificationToken) {
          try {
            await sendWelcomeEmail(normalizedEmail, firstName, emailVerificationToken)
            verificationMessage = 'Account created successfully. SMS failed, please check your email to verify your account.'
          } catch (emailError) {
            console.error('Failed to send welcome email:', emailError)
            verificationMessage = 'Account created successfully. Verification messages could not be sent. Please contact support.'
          }
        } else {
          verificationMessage = 'Account created successfully. SMS verification failed. Please contact support.'
        }
      }
    } 
    // Send email verification if no phone number or as fallback
    else if (shouldSendEmail && normalizedEmail && emailVerificationToken) {
      try {
        await sendWelcomeEmail(normalizedEmail, firstName, emailVerificationToken)
        verificationMessage = 'Account created successfully. Please check your email to verify your account.'
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError)
        verificationMessage = 'Account created successfully. Verification email could not be sent. Please contact support.'
      }
    }

    // Generate auth tokens and set cookies
  const tokens = generateTokens(user.id)
  await storeRefreshToken(tokens.refreshToken)
  setAuthCookies(event, tokens)

    setResponseStatus(event, 201)
    return createSuccessResponse({
      user,
      message: verificationMessage
    })

  } catch (error) {
    console.error('Registration error:', error)
    setResponseStatus(event, 500)
    return createErrorResponse(
      'An error occurred during registration. Please try again.',
      'REGISTRATION_ERROR'
    )
  }
})
