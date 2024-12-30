"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState } from "react";
import { onboardingAction } from "../actions";
import { useForm } from '@conform-to/react'
import { parseWithZod } from "@conform-to/zod";
import { onboardingSchema } from "../utils/zodSchemas";
import { SubmitButton } from "../components/SubmitButtons";


export function OnboardingForm() {
  const [lastResult, action] = useActionState(onboardingAction, undefined)

  const [form, fields] = useForm({
    lastResult,
    onValidate({formData}) {
      return parseWithZod(formData, {
        schema: onboardingSchema
      })
    },
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput'
  })
  console.log("here")
  return (
    <div className="min-h-screen w-screen flex items-center justify-center">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>
            Welcome to Timely
          </CardTitle>
          <CardDescription>
            We need the following information to set up your profile
          </CardDescription>
        </CardHeader>
        <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
          <CardContent className="grid gap-y-5">
            <div className="grid gap-y-2">
              <Label>
                Full Name
              </Label>
              <Input 
                name={fields.name.name}
                defaultValue={fields.name.initialValue} 
                key={fields.name.key}
                placeholder="Enter your full name" 
              />
              <p className="text-red-500 text-sm">{fields.name.errors}</p>
            </div>
            <div className="grid gap-y-2">
              <Label>
                Username
              </Label>
              <div className="flex rounded-md">
                <span className="h-10 inline-flex items-center px-2 rounded-l-md border
                border-r-0 border-muted bg-muted text-sm text-muted-foreground">
                  timely.com/
                </span>
                <Input
                  name={fields.username.name}
                  defaultValue={fields.username.initialValue}
                  key={fields.username.key}
                  placeholder="username"
                  className=" h-10 rounded-l-none flex items-center" 
                />
              </div>
              <p className="text-red-500 text-sm">{fields.username.errors?.[0]}</p>
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton text="Submit" className="w-full"/>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}