import { redirect } from "next/navigation";
import { OnboardingForm } from "../components/OnboardingForm";
import prisma from "../utils/db";
import { checkUser } from "../utils/hooks";


export default async function OnboardingPage() {

  const session = await checkUser()
  const user = await prisma.user.findUnique({
    where: {id: session.user?.id},
    select: {username: true},
  })

  if(user?.username) {
    return redirect("/dashboard")
  }
  return (
    <OnboardingForm />
  )
}