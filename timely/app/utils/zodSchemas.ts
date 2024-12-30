import { conformZodMessage } from '@conform-to/zod'
import { z } from 'zod'



export const EventSchema = z.object({
  title: z.string().min(3).max(150),
  duration: z.number().min(15).max(60),
  url: z.string().min(3).max(150),
  description: z.string().min(3).max(300),
  videoPlatform: z.string().min(3)
})

export const settingsSchema = z.object({
  name: z.string().min(3).max(50)
})


export const onboardingSchema = z.object({
  name: z.string().min(3).max(50),
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9-]+$/, {
    message: 'Username must only contain letters, numbers and hyphens'
  })
})


export function onboardingValidation(options?: {
  isUsernameUnique: () => Promise<boolean>
}) {
  return z.object({
    username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9-]+$/, {
      message: 'Username must only contain letters, numbers and hyphens'
    }).pipe(
      z.string().superRefine((_, ctx) => {
        if (typeof options?.isUsernameUnique != "function") {
          ctx.addIssue({
            code: 'custom',
            message: conformZodMessage.VALIDATION_UNDEFINED,
            fatal: true
          });
          return
        }
  
        return options.isUsernameUnique().then((isUnique) => {
          if (!isUnique) {
            ctx.addIssue({
              code: 'custom',
              message: 'Username already exists',
            })
          }
        })
      })
    ),
    name: z.string().min(3).max(50)
  })
}