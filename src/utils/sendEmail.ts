import nodemailer from 'nodemailer'
import fs from 'fs'

export const sendEmail = async (
  recipient: string | string[],
  subject: string,
  templateName: string,
  variables: Record<string, string> = {},
  sendToAdmin = false,
  adminSubject = ''
) => {
  try {
    const templatePath = `./src/emails/${templateName}`
    // Read the template file
    let htmlContent = fs.readFileSync(templatePath, 'utf-8')

    // Replace placeholders with actual values
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`
      htmlContent = htmlContent.replace(new RegExp(placeholder, 'g'), value)
    }

    // Configure transporter
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_SERVICE,
      port: 587, // Port for TLS
      secure: false, // Use TLS
      auth: {
        user: process.env.MAIL_AUTH,
        pass: process.env.MAIL_PASS,
      },
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
      },
    })

    // Email options
    const recipients =
      typeof recipient === 'string' ? recipient : recipient.join(',')
    const mailOptions = {
      from: process.env.MAIL_AUTH,
      to: !sendToAdmin ? recipients : process.env.MAIL_ADMIN,
      subject: !sendToAdmin ? subject : adminSubject,
      html: htmlContent,
    }

    // Send email
    const info = await transporter.sendMail(mailOptions)
    console.log(`Email sent: ${info.response}`)
    return { success: true, message: 'Email sent successfully' }
  } catch (error: unknown) {
    console.error('Error sending email:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Error sending email'
    return { success: false, message: errorMessage }
  }
}
