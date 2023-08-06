import {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  ADMIN_PHONE_NUMBER,
} from "../config.js"
import twilio from "twilio"

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

const sendSMS = async (user) => {
  try {
    await client.messages.create({
      body: `Se realizo una compra en la tienda. Revisar el correo electronico.
            Datos del comprador: ${user.email}`,
      from: "+14026837501",
      to: ADMIN_PHONE_NUMBER,
    })
  } catch (error) {
    console.error(error)
  }
}

export { sendSMS }
