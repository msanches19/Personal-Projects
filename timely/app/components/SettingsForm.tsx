"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SubmitButton } from "./SubmitButtons"
import { useFormState } from "react-dom"
import { useActionState, useEffect, useMemo, useState } from "react"
import { settingsAction } from "../actions"
import { useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod"
import { settingsSchema } from "../utils/zodSchemas"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface IAppProps {
  name: string, 
  email: string, 
  image: string
}

export function SettingsForm({name, email, image}: IAppProps) {

  const [lastResult, action] = useActionState(settingsAction, undefined)
  const [form, fields] = useForm({
    lastResult,
    onValidate({formData}) {
      return parseWithZod(formData, {
        schema: settingsSchema
      })
    },
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput'
  })

  // const handleDeleteImage = () => {
  //   setImage("")
  // }
  
  return (
  <Card>
    <CardHeader>
      <CardTitle className="text-3xl">Settings</CardTitle>
      <CardDescription>
        Manage account settings
      </CardDescription>
    </CardHeader>

    <form 
      id={form.id}
      onSubmit={form.onSubmit}
      action={action}
      noValidate>
      <CardContent className="flex flex-col gap-y-4">
        <div className="flex flex-col gap-y-2">
          <Label>Full Name</Label>
          <Input name={fields.name.name}
          key={fields.name.key}
          defaultValue={name}
          placeholder="Name..."/>
          <p className="text-red-500 text-sm">
            {fields.name.errors}
          </p>
        </div>
        <div className="flex flex-col gap-y-2">
          <Label>Email</Label>
          <Input disabled defaultValue={email} placeholder="placeholder" />
        </div>
        {/* <div className="grid gap-y-5">
          <Label>Profile Image</Label>
          {currImage? (
            <div className="relative size-16">
              <img src={currImage} alt="Profile Image" className="size-16 rounded-lg"></img>
              <Button
                onClick={handleDeleteImage}
                variant="destructive"
                size="icon" 
                type="button"
                className="absolute -top-3 -right-3 size-5">
                <X className="size-2"/>
              </Button>
            </div>
          ): (
            <h1>No Profile Image</h1>
          )}
        </div> */}
      </CardContent>
      <CardFooter>
        <SubmitButton text="Update Profile" disabled={
          fields.name !== undefined && fields.name.errors !== undefined && fields.name.errors.length > 0
        }
        popup
        popupMessage="Name Updated"/>
      </CardFooter>
    </form>
  </Card>
  )
}