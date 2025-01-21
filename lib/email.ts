import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function sendVerificationEmail(email: string, token: string) {
  const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email/${token}`

  const params = {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Subject: {
        Data: "Verify your email",
      },
      Body: {
        Html: {
          Data: `Please click this link to verify your email: <a href="${verificationLink}">${verificationLink}</a>`,
        },
      },
    },
  }

  try {
    const command = new SendEmailCommand(params)
    await sesClient.send(command)
  } catch (error) {
    console.error("Error sending email:", error)
    throw error
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${token}`

  const params = {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Subject: {
        Data: "Reset your password",
      },
      Body: {
        Html: {
          Data: `Please click this link to reset your password: <a href="${resetLink}">${resetLink}</a>`,
        },
      },
    },
  }

  try {
    const command = new SendEmailCommand(params)
    await sesClient.send(command)
  } catch (error) {
    console.error("Error sending email:", error)
    throw error
  }
}

