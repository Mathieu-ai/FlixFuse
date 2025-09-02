import nodemailer from 'nodemailer'

// Create transporter using environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

// Test the connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP Connection Error:', error)
  } else {
    console.log('SMTP Server ready:', success)
  }
})

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  try {
    console.log('=== EMAIL DEBUG INFO ===')
    console.log('SMTP Config:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE,
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS ? '***configured***' : 'NOT SET',
      from: process.env.SMTP_FROM
    })
    console.log('Sending email to:', options.to)
    console.log('Subject:', options.subject)
    
    const result = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@pawgo.app',
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text
    })
    
    console.log('Email sent successfully:', result.messageId)
    console.log('Email response:', result.response)
  } catch (error) {
    console.error('=== EMAIL ERROR ===')
    console.error('Failed to send email:', error)
    if (error instanceof Error) {
      console.error('Error details:', error.message)
    }
    throw new Error('Failed to send email')
  }
}

export async function sendWelcomeEmail(email: string, firstName: string, verificationToken: string): Promise<void> {
  const verificationUrl = `${process.env.NUXT_PUBLIC_SITE_URL}/auth/verify-email?token=${verificationToken}`
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Welcome to PawGo!</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb;">Welcome to PawGo!</h1>
        </div>
        
        <p>Hi ${firstName},</p>
        
        <p>Welcome to PawGo, the social network for pet lovers! We're excited to have you join our community.</p>
        
        <p>To get started, please verify your email address by clicking the button below:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all;">${verificationUrl}</p>
        
        <p>Once verified, you can:</p>
        <ul>
          <li>Create profiles for your pets</li>
          <li>Connect with other pet owners</li>
          <li>Organize walks and events</li>
          <li>Share photos and stories</li>
        </ul>
        
        <p>If you didn't create an account with PawGo, please ignore this email.</p>
        
        <p>Best regards,<br>The PawGo Team</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e5e5;">
        <p style="font-size: 12px; color: #666;">
          This email was sent to ${email}. If you have questions, contact us at support@pawgo.app
        </p>
      </div>
    </body>
    </html>
  `
  
  await sendEmail({
    to: email,
    subject: 'Welcome to PawGo - Verify your email',
    html,
    text: `Welcome to PawGo! Please verify your email by visiting: ${verificationUrl}`
  })
}

export async function sendPasswordResetEmail(email: string, firstName: string, resetToken: string): Promise<void> {
  const resetUrl = `${process.env.NUXT_PUBLIC_SITE_URL}/auth/reset-password?token=${resetToken}`
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Reset Your Password - PawGo</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb;">Reset Your Password</h1>
        </div>
        
        <p>Hi ${firstName},</p>
        
        <p>We received a request to reset your password for your PawGo account.</p>
        
        <p>Click the button below to reset your password:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Reset Password
          </a>
        </div>
        
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all;">${resetUrl}</p>
        
        <p><strong>This link will expire in 1 hour for security reasons.</strong></p>
        
        <p>If you didn't request a password reset, please ignore this email. Your password will not be changed.</p>
        
        <p>Best regards,<br>The PawGo Team</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e5e5;">
        <p style="font-size: 12px; color: #666;">
          This email was sent to ${email}. If you have questions, contact us at support@pawgo.app
        </p>
      </div>
    </body>
    </html>
  `
  
  await sendEmail({
    to: email,
    subject: 'Reset Your Password - PawGo',
    html,
    text: `Reset your password by visiting: ${resetUrl}`
  })
}
