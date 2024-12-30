import prisma from "@/app/utils/db";
import { checkUser } from "@/app/utils/hooks";
import { nylas, nylasConfig } from "@/app/utils/nylas";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {

  const session = await checkUser()

  const url = new URL(request.url)
  const code = url.searchParams.get('code')

  if (!code) {
    return Response.json("No authorization code returned from Nylas", {
      status: 400
    })
  }

  try {
    const response = await nylas.auth.exchangeCodeForToken({
      clientSecret: nylasConfig.apiKey,
      clientId: nylasConfig.clientId,
      redirectUri: nylasConfig.redirectUri,
      code: code
    })

    const { grantId, email } = response

    await prisma.user.update({
      where: {
        id: session.user?.id
      },
      data: {
        grantId: grantId, 
        grantEmail: email
      }
    })
    
  } catch(error) {
    return Response.json("Unknown error occurred", {
      status: 400
    })
  }

  redirect("/dashboard")


}