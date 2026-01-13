const nodemailer = require("nodemailer")

const createTransporter = () => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    })

    return transporter
  } catch (error) {
    console.log(error)
  }
}


module.exports = { createTransporter }

