import { createMeeting } from "@/app/actions";
import { Calendar } from "@/app/components/Calendar";
import { SubmitButton } from "@/app/components/SubmitButtons";
import { TimeTable } from "@/app/components/TimeTable";
import prisma from "@/app/utils/db";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CalendarX2, Clock, Video } from "lucide-react";
import { GetServerSideProps } from "next";
import { notFound } from "next/navigation";
import React from 'react'

async function getData(url: string, username: string) {
  const data = await prisma.event.findFirst({
    where: {
      url: url,
      User: {
        username: username
      },
      active: true
    },
    select: {
      id: true,
      description: true,
      title: true,
      duration: true,
      videoSoftware: true,
      User: {
        select: {
          name: true,
          image: true,
          availability: {
            select: {
              day: true,
              isActive: true
            }
          }
        }
      }
    }
  });

  if (!data) {
    return notFound();
  }
  return data;
}


export default async function BookingForm({ params: paramsPromise, searchParams: searchParamsPromise }: {
  params: Promise<{username: string; url: string}>,
  searchParams: Promise<{date?: string, time?: string}>
}) {

  const [params, searchParams] = await Promise.all([
    paramsPromise, 
    searchParamsPromise
  ])
  const selectedDate = searchParams.date ? new Date(`${searchParams.date}T00:00:00`) : new Date()

  const data = await getData(params.url, params.username);
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    day: 'numeric',
    month: 'long'
  }).format(selectedDate)

  const showForm = !!searchParams.date && !!searchParams.time
  return (
    <div className="min-h-screen w-screen flex items-center justify-center">
      {showForm ? (
        <Card className="max-w-[600px] w-full mx-auto">
          <CardContent className="p-5 grid md:grid-cols-[1fr_auto_1fr] gap-4">
            <div>
              <img src={data.User?.image as string} alt="Profile Pic" 
                className="size-10 rounded-full"
              />
              <p className="text-sm font-medium mt-1 text-muted-foreground">
                {data.User?.name}
              </p>
              <h1 className="text-2xl font-semibold mt-2">
                {data.title}
              </h1>
              <p className="text-sm font-medium text-muted-foreground">
                {data.description}
              </p>
              <div className="mt-5 flex flex-col gap-y-3">
                <p className="flex items-center">
                  <CalendarX2 className="size-4 mr-2 text-primary"/>
                  <span className="text-sm font-medium text-muted-foreground">
                    {formattedDate.toString()}
                  </span>
                </p>
                <p className="flex items-center">
                  <Clock className="size-4 mr-2 text-primary"/>
                  <span className="text-sm font-medium text-muted-foreground">
                    {data.duration} Minutes
                  </span>
                </p>
                <p className="flex items-center">
                  <Video className="size-4 mr-2 text-primary"/>
                  <span className="text-sm font-medium text-muted-foreground">
                    {data.videoSoftware}
                  </span>
                </p>
              </div>
            </div>
            <Separator orientation="vertical" className="w-[1px] h-full"/>
            <form className="flex flex-col gap-y-4" action={createMeeting}>
              <input type="hidden" name="from" value={searchParams.time}/>
              <input type="hidden" name="date" value={searchParams.date} />
              <input type="hidden" name="duration" value={data.duration} />
              <input type="hidden" name="provider" value={data.videoSoftware} />
              <input type="hidden" name="username" value={params.username} />
              <input type="hidden" name="eventId" value={data.id} />
              <div className="flex flex-col gap-y-2">
                <Label>
                  Your Name
                </Label>
                <Input name="name" placeholder="Your Name"/>
              </div>
              <div className="flex flex-col gap-y-2">
                <Label>
                  Your Email
                </Label>
                <Input name="email" placeholder="yourname@provider.com"/>
              </div>
              <SubmitButton className="w-full mt-5" text="Book Meeting"/>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="max-w-[1000px] w-full mx-auto">
          <CardContent className="p-5 grid md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-4">
            <div>
              <img src={data.User?.image as string} alt="Profile Pic" 
                className="size-10 rounded-full"
              />
              <p className="text-sm font-medium mt-1 text-muted-foreground">
                {data.User?.name}
              </p>
              <h1 className="text-2xl font-semibold mt-2">
                {data.title}
              </h1>
              <p className="text-sm font-medium text-muted-foreground">
                {data.description}
              </p>
              <div className="mt-5 flex flex-col gap-y-3">
                <p className="flex items-center">
                  <CalendarX2 className="size-4 mr-2 text-primary"/>
                  <span className="text-sm font-medium text-muted-foreground">
                    {formattedDate.toString()}
                  </span>
                </p>
                <p className="flex items-center">
                  <Clock className="size-4 mr-2 text-primary"/>
                  <span className="text-sm font-medium text-muted-foreground">
                    {data.duration} Minutes
                  </span>
                </p>
                <p className="flex items-center">
                  <Video className="size-4 mr-2 text-primary"/>
                  <span className="text-sm font-medium text-muted-foreground">
                    {data.videoSoftware}
                  </span>
                </p>
              </div>
            </div>
            <Separator orientation="vertical" className="w-[1px] h-full"/>
            <Calendar availability={data.User?.availability as any}/>
            <Separator orientation="vertical" className="w-[1px]"/>
            <TimeTable date={selectedDate} username={params.username} duration={data.duration}/>
          </CardContent>
        </Card>
      )}
    </div>
  )
}