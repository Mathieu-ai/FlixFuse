import twilio from 'twilio'

const accountSid = process.env.TWILIO_SID
const authToken = process.env.TWILIO_TOKEN
const fromNumber = process.env.TWILIO_PHONE

if (!accountSid || !authToken || !fromNumber) {
  console.warn('Twilio credentials not configured. SMS functionality will be disabled.')
}

const client = accountSid && authToken ? twilio(accountSid, authToken) : null

export async function sendSMS(to: string, message: string): Promise<void> {
  if (!client) {
    throw new Error('Twilio not configured')
  }

  try {
    await client.messages.create({
      body: message,
      from: fromNumber,
      to: to
    })
  } catch (error) {
    console.error('SMS sending error:', error)
    throw new Error('Failed to send SMS')
  }
}

export async function sendPhoneVerificationSMS(phoneNumber: string, firstName: string, verificationCode: string): Promise<void> {
  const message = `Hi ${firstName}! Welcome to PawGo 🐾

Your verification code is: ${verificationCode}

Enter this code in the app to verify your phone number.

If you didn't sign up for PawGo, please ignore this message.

- The PawGo Team`

  await sendSMS(phoneNumber, message)
}

export function generatePhoneVerificationCode(): string {
  // Generate a 6-digit verification code
  return Math.floor(100000 + Math.random() * 900000).toString()
}
