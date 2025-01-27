import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

const emailTemplate = (title: string, content: string, buttonText: string, buttonUrl: string) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center">
          <h1 style="color: #FF6B6B;">${title}</h1>
          <p>${content}</p>
          <a href="${buttonUrl}" style="display: inline-block; padding: 10px 20px; background-color: #FF6B6B; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">${buttonText}</a>
          <p style="margin-top: 20px; font-size: 12px; color: #888;">If the button doesn't work, copy and paste this link into your browser: ${buttonUrl}</p>
        </td>
      </tr>
    </table>
  </body>
  </html>
`

export async function sendVerificationEmail(email: string, token: string) {
  const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email/${token}`

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
          Data: emailTemplate(
            "Verify Your Email",
            "Thank you for signing up! Please click the button below to verify your email address:",
            "Verify Email",
            verificationLink,
          ),
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
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password/${token}`

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
          Data: emailTemplate(
            "Reset Your Password",
            "You have requested to reset your password. Click the button below to set a new password:",
            "Reset Password",
            resetLink,
          ),
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

export async function sendTemporaryPasswordEmail(email: string, temporaryPassword: string) {
  const loginLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/login`

  const params = {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Subject: {
        Data: "Your Temporary Password",
      },
      Body: {
        Html: {
          Data: emailTemplate(
            "Your Temporary Password",
            `Your temporary password is: <strong>${temporaryPassword}</strong><br><br>Please use this password to log in and change it immediately for security reasons.`,
            "Go to Login",
            loginLink,
          ),
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

