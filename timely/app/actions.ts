"use server"

import { parse } from "path"
import prisma from "./utils/db"
import { checkUser } from "./utils/hooks"
import { parseWithZod } from '@conform-to/zod'
import { EventSchema, onboardingSchema, onboardingValidation, settingsSchema } from "./utils/zodSchemas"
import { redirect } from "next/navigation"
import { raw } from "@prisma/client/runtime/library"
import { revalidatePath } from "next/cache"

export async function onboardingAction(prevState: any, formData: FormData) {
  const session = await checkUser()

  const submission = await parseWithZod(formData, {
    schema: onboardingValidation({
      async isUsernameUnique() {
        const existingUsername = await prisma.user.findUnique({
          where: {
            username: formData.get("username") as string
          }
        });
        return !existingUsername
      }
    }),
    async: true
  });

  if (submission.status !== "success") {
    return submission.reply()
  }
  const data = await prisma.user.update({
    where: {
      id: session.user?.id
    },
    data: {
      username: submission.value.username,
      name: submission.value.name,
      availability: {
        createMany: {
          data: [
            {
              day: 'Monday',
              from: '08:00',
              until: '18:00'
            },
            {
              day: 'Tuesday',
              from: '08:00',
              until: '18:00'
            },
            {
              day: 'Wednesday',
              from: '08:00',
              until: '18:00'
            },
            {
              day: 'Thursday',
              from: '08:00',
              until: '18:00'
            },
            {
              day: 'Friday',
              from: '08:00',
              until: '18:00'
            },
            {
              day: 'Saturday',
              from: '08:00',
              until: '18:00'
            },
            {
              day: 'Sunday',
              from: '08:00',
              until: '18:00'
            }
          ]
        }
      }
    }
  })
  return redirect("/onboarding/grant-id")
}

export async function settingsAction(prevState: any, data: FormData) {
  const session = await checkUser()

  const submission = parseWithZod(data, {
    schema: settingsSchema
  })

  if (submission.status !== "success") {
    return submission.reply()
  }

  const user = await prisma.user.update({
    where: {
      id: session.user?.id
    },
    data: {
      name: submission.value.name,
    }
  })

  return redirect("/dashboard")
}



export async function updateAvailability(formData: FormData) {
  const session = await checkUser()

  const rawData = Object.fromEntries(formData.entries())

  const data = Object.keys(rawData).filter((key) => key.startsWith("id-")).map(
    (key) => {
      const id = key.replace("id-", "")

      return {
        id,
        isActive: rawData[`isActive-${id}`] === "on",
        from: rawData[`from-${id}`] as string,
        until: rawData[`until-${id}`] as string
      }
    }
  )

  try {
    await prisma.$transaction(
      data.map((item) => (
        prisma.availability.update({
          where: {
            id: item.id
          },
          data: {
            isActive: item.isActive,
            from: item.from,
            until: item.until
          }
        })
      ))
    )
    revalidatePath("/dashboard/availability")
  } catch (error) {
    console.log(error)
  }
}

export async function createEvent(prevState: any, formData: FormData) {
  const session = await checkUser()
  const submission = parseWithZod(formData, {
    schema: EventSchema
  })

  if (submission.status !== "success") {
    return submission.reply()
  }

  await prisma.eventTypes.create({
    data: {
      title: submission.value.title,
      duration: submission.value.duration,
      url: submission.value.url,
      description: submission.value.description,
      videoSoftware: submission.value.videoPlatform,
      userId: session.user?.id
    }
  })

  return redirect("/dashboard")
}