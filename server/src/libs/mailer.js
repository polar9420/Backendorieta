import { MAIL_PASSWORD, MAIL_USER } from "../config.js"
import nodemailer from "nodemailer"
import { Logger } from "../logger/index.js"

export const sendMail = async (
  user,
  ticket,
  productsPurchased,
  productsNotPurchased
) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASSWORD,
      },
    })

    const mailOptions = {
      from: MAIL_USER,
      to: user.email,
      subject: `Ticket de compra ${ticket.code}`,
      html: `<h1>Gracias por tu compra</h1>
            <p>El total de tu compra es: ${ticket.amount}</p>
            <p>El codigo de tu ticket es: ${ticket.code}</p>
            <h2>Productos comprados</h2>
            <ul>
                ${productsPurchased
                  .map(
                    (product) => `<li>${product.title} - ${product.price}</li>`
                  )
                  .join("")}
            </ul>
            <h2>Productos no comprados</h2>
            <ul>
                ${productsNotPurchased
                  .map(
                    (product) => `<li>${product.title} - ${product.price}</li>`
                  )
                  .join("")}
            </ul>
            `,
    }

    const info = await transporter.sendMail(mailOptions)

    return info
  } catch (error) {
    console.error(error)
    throw new Error("Server error")
  }
}

export const sendMailResetPassword = async (mailTo, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASSWORD,
      },
    })

    const mailOptions = {
      from: MAIL_USER,
      to: mailTo,
      subject: `Recuperacion de contraseña`,
      html: `<h1>Recuperacion de contraseña</h1>
            <p>Para recuperar tu contraseña ingresa al siguiente link</p>
            <a href="http://localhost:5173/auth/new-password/${token}">Recuperar contraseña</a>
            `,
    }

    const info = await transporter.sendMail(mailOptions)

    return info
  } catch (error) {
    console.error(error)
    throw new Error("Server error")
  }
}

export const sendMailChangedPassword = async (mailTo) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASSWORD,
      },
    })

    const mailOptions = {
      from: MAIL_USER,
      to: mailTo,
      subject: `Contraseña cambiada`,
      html: `<h1>Contraseña cambiada</h1>
            <p>Tu contraseña ha sido cambiada exitosamente</p>
            `,
    }

    const info = await transporter.sendMail(mailOptions)

    Logger.info(`Changed password email sent to ${mailTo}: ${info.messageId}`)
  } catch (error) {
    Logger.error(`Error sending changed password email to ${mailTo}: ${error}`)
  }
}

export const sendMailProductDeleted = async (mailTo, product) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASSWORD,
      },
    })

    const mailOptions = {
      from: MAIL_USER,
      to: mailTo,
      subject: `Producto eliminado`,
      html: `<h1>Producto eliminado</h1>
            <p>El producto ${product.title} ha sido eliminado</p>
            `,
    }

    const info = await transporter.sendMail(mailOptions)

    Logger.info(`Product deleted email sent to ${mailTo}: ${info.messageId}`)
  } catch (error) {
    Logger.error(`Error sending product deleted email to ${mailTo}: ${error}`)
  }
}

export const sendMailUserDeleted = async (mailTo) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASSWORD,
      },
    })

    const mailOptions = {
      from: MAIL_USER,
      to: mailTo,
      subject: `Usuario eliminado`,
      html: `<h1>Usuario eliminado</h1>
            <p>El usuario ${mailTo} ha sido eliminado</p>
            `,
    }

    const info = await transporter.sendMail(mailOptions)

    Logger.info(`User deleted email sent to ${mailTo}: ${info.messageId}`)
  } catch (error) {
    Logger.error(`Error sending user deleted email to ${mailTo}: ${error}`)
  }
}
