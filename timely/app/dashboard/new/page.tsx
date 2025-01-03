"use client"

import { createEvent } from "@/app/actions";
import { SubmitButton } from "@/app/components/SubmitButtons";
import { EventSchema } from "@/app/utils/zodSchemas";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import Link from "next/link";
import { useActionState, useState } from "react";


type Platform = "Zoom Meeting" | "Microsoft Teams"

export default function NewEvent() {

  const [videoPlatform, setPlatform] = useState<Platform>("Zoom Meeting")
  const [lastResult, action] = useActionState(createEvent, undefined)
  const [form, fields] = useForm({
    lastResult,
    onValidate( {formData} ) {
      return parseWithZod(formData, {
        schema: EventSchema
      })
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput"
  })

  return (
    <div className="w-full h-full flex flex-1 items-center justify-center">
      <Card>
        <CardHeader className="flex items-center justify-center">
          <CardTitle>
            Add New Appointment
          </CardTitle>
          <CardDescription>
            Allows people to book time with you
          </CardDescription>
        </CardHeader>
        <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
          <CardContent className="grid gap-y-5">
            <div className="flex flex-col gap-y-2">
              <Label>
                Title
              </Label>
              <Input 
                name={fields.title.name}
                key={fields.title.key} 
                defaultValue={fields.title.initialValue} 
                placeholder="30 minute meeting"
              />
              <p className="text-red-500 text-sm">{fields.title.errors}</p>
            </div>
            <div className="flex flex-col gap-y-2">
              <Label>
                Custom URL
              </Label>
              <div className="flex rounded-md">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-muted bg-muted text-sm text-muted-foreground">
                  timely.com/
                </span>
                <Input
                  name={fields.url.name}
                  key={fields.url.key}
                  defaultValue={fields.url.initialValue}
                  className="rounded-l-none" 
                  placeholder="example-url-1"
                />
              </div>
              <p className="text-red-500 text-sm">{fields.url.errors}</p>
            </div>
            <div className="flex flex-col gap-y-2">
              <Label>
                Description
              </Label>
              <Textarea 
                name={fields.description.name}
                key={fields.description.key}
                defaultValue={fields.description.initialValue}
                placeholder="Add description here..."
              />
              <p className="text-red-500 text-sm">{fields.description.errors}</p>
            </div>
            <div className="flex flex-col gap-y-2">
              <Label>
                Duration
              </Label>
              <Select
                name={fields.duration.name}
                key={fields.duration.key}
                defaultValue={fields.duration.initialValue}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select duration"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>
                      Duration
                    </SelectLabel>
                    <SelectItem value="15">
                      15 mins
                    </SelectItem>
                    <SelectItem value="30">
                      30 mins
                    </SelectItem>
                    <SelectItem value="45">
                      45 mins
                    </SelectItem>
                    <SelectItem value="60">
                      60 mins
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <p className="text-red-500 text-sm">{fields.duration.errors}</p>
            </div>
            <div className="grid gap-y-2">
              <Label>Video Call Provider</Label>
              <input 
                type="hidden" 
                name={fields.videoPlatform.name}
                value={videoPlatform}
              ></input>
              <ButtonGroup className="gap-x-2">
                <Button
                  type="button"
                  onClick={() => {
                    setPlatform("Zoom Meeting")
                  }}
                  variant={
                    videoPlatform ==="Zoom Meeting" ? "secondary" : "outline"
                  }
                  key="Zoom" 
                  className="w-full">
                    Zoom
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setPlatform("Microsoft Teams")
                  }}
                  variant={
                    videoPlatform === "Microsoft Teams" ? "secondary" : "outline"
                  }
                  key="Teams" 
                  className="w-full">
                    Teams
                </Button>
              </ButtonGroup>
              <p className="text-red-500 text-sm">{fields.videoPlatform.errors}</p>
            </div>
          </CardContent>
          <CardFooter className="w-full flex justify-between">
            <Button variant="secondary" asChild>
              <Link href="/dashboard">
                Cancel
              </Link>
            </Button>
            <SubmitButton
              text="Create New Event"

            ></SubmitButton>
          </CardFooter>
        </form>
      </Card>
    </div>
  )

}