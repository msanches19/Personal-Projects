import { SettingsForm } from "@/app/components/SettingsForm";
import prisma from "@/app/utils/db";
import { checkUser } from "@/app/utils/hooks";
import { notFound } from "next/navigation";

async function getData(id: string) {
  const data = await prisma.user.findUnique({
    where: {
      id: id
    },
    select: {
      name: true,
      email: true, 
      image: true
    }
  })

  if(!data) {
    return notFound()
  }

  return data
}

export default async function Settings() {

  const session = await checkUser()
  const data = await getData(session.user?.id as string)

  return (
    <div>
      <SettingsForm email={data.email} name={data.name as string} image={data.image as string} />
    </div>
  )
}