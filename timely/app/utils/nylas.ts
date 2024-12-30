import dotenv from "dotenv"
import Nylas from "nylas"


dotenv.config()

export const nylas = new Nylas({
  apiKey: process.env.NYLAS_API_SECRET!,
  apiUri: process.env.NYLAS_API_URI!
})


export const nylasConfig = {
  clientId: process.env.NYLAS_CLIENT_ID!,
  redirectUri: process.env.REDIRECT_URI! + "/api/oauth/exchange",
  apiKey: process.env.NYLAS_API_SECRET!,
  apiUri: process.env.NYLAS_API_URI!
}