import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

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

const notifyStaffTemplate = (kioskDetails: string) => `
  <!DOCTYPE html>
  <html lang="fr">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nouvelle Demande de Kiosque</title>
    <style>
      body {
        font-family: 'Segoe UI', Arial, sans-serif;
        line-height: 1.6;
        color: #333333;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #f5f5f5;
      }
      .container {
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      .header {
        background-color: #E55210;
        padding: 30px 20px;
        text-align: center;
      }
      .header h1 {
        color: #ffffff;
        margin: 0;
        font-size: 24px;
        font-weight: 600;
      }
      .content {
        padding: 30px;
      }
      .details-box {
        background-color: #f8f9fa;
        border-left: 4px solid #E55210;
        padding: 20px;
        margin: 20px 0;
        border-radius: 4px;
      }
      .button {
        display: inline-block;
        background-color: #E55210;
        color: #ffffff;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 6px;
        margin: 20px 0;
        font-weight: 500;
      }
      .footer {
        background-color: #f8f9fa;
        padding: 20px;
        text-align: center;
        font-size: 12px;
        color: #6c757d;
        border-top: 1px solid #e9ecef;
      }
      hr {
        border: none;
        border-top: 1px solid #e9ecef;
        margin: 20px 0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Nouvelle Demande de Kiosque</h1>
      </div>
      
      <div class="content">
        <p style="font-size: 16px; margin-bottom: 20px;">Bonjour,</p>
        
        <p>Une nouvelle demande de kiosque a été soumise. Veuillez trouver ci-dessous les détails complets :</p>
        
        <div class="details-box">
          ${kioskDetails}
        </div>
        
        <p><strong>Prochaines étapes :</strong></p>
        <ul>
          <li>Contacter le client pour confirmer la demande</li>
          <li>Préparer une proforma avec le détail des prix</li>
          <li>Planifier l'installation du kiosque</li>
        </ul>
        
        <div style="text-align: center;">
          <a href="${process.env.NEXTAUTH_URL}/admin/kiosk-requests" class="button">
            Accéder au panneau d'administration
          </a>
        </div>
        
        <hr />
        
        <p style="font-size: 14px; color: #6c757d;">
          Cet email a été généré automatiquement. Merci de ne pas y répondre.
        </p>
      </div>
      
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Kiosk Online. Tous droits réservés.</p>
        <p>Plateforme de gestion de kiosques</p>
      </div>
    </div>
  </body>
  </html>
`

const notifyClientTemplate = (kioskName: string, kioskAddress: string) => `
  <!DOCTYPE html>
  <html lang="fr">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nouveau Kiosque Ajouté</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #FF6B6B;">Nouveau Kiosque Ajouté</h1>
    <p>Nous sommes heureux de vous informer qu'un nouveau kiosque a été ajouté à votre compte :</p>
    <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px;">
      <p><strong>Nom du kiosque :</strong> ${kioskName}</p>
      <p><strong>Adresse :</strong> ${kioskAddress}</p>
    </div>
    <p>Si vous avez des questions ou besoin d'assistance, n'hésitez pas à nous contacter.</p>
    <p>Merci de votre confiance,<br>L'équipe Kiosk Online</p>
  </body>
  </html>
`

export async function sendVerificationEmail(email: string, token: string) {
  const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email/${token}`

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: "Verify your email",
      html: emailTemplate(
        "Verify Your Email",
        "Thank you for signing up! Please click the button below to verify your email address:",
        "Verify Email",
        verificationLink,
      ),
    })
  } catch (error) {
    console.error("Error sending email:", error)
    throw error
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password/${token}`

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: "Reset your password",
      html: emailTemplate(
        "Reset Your Password",
        "You have requested to reset your password. Click the button below to set a new password:",
        "Reset Password",
        resetLink,
      ),
    })
  } catch (error) {
    console.error("Error sending email:", error)
    throw error
  }
}

export async function sendTemporaryPasswordEmail(email: string, temporaryPassword: string) {
  const loginLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/login`

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: "Your Temporary Password",
      html: emailTemplate(
        "Your Temporary Password",
        `Your temporary password is: <strong>${temporaryPassword}</strong><br><br>Please use this password to log in and change it immediately for security reasons.`,
        "Go to Login",
        loginLink,
      ),
    })
  } catch (error) {
    console.error("Error sending email:", error)
    throw error
  }
}

// Alternative: Send individually if batch sending fails
export async function sendStaffNotificationIndividual(staffEmails: string[], requestDetails: string) {
  if (!staffEmails || staffEmails.length === 0) return

  const results = await Promise.allSettled(
    staffEmails.map(async (email) => {
      try {
        await resend.emails.send({
          from: process.env.EMAIL_FROM!,
          to: email,
          subject: "🔔 Nouvelle Demande de Kiosque",
          html: notifyStaffTemplate(requestDetails),
        })
        console.log(`Staff notification sent to ${email}`)
      } catch (error) {
        console.error(`Failed to send to ${email}:`, error)
      }
    })
  )

  return results
}

export async function sendClientNotification(clientEmail: string, kioskName: string, kioskAddress: string) {
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: clientEmail,
      subject: "Nouveau Kiosque Ajouté",
      html: notifyClientTemplate(kioskName, kioskAddress),
    })
  } catch (error) {
    console.error("Error sending client notification:", error)
    throw error
  }
}

