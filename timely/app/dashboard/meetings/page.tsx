import { DefaultEvents } from "@/app/components/DefaultEvents"
import prisma from "@/app/utils/db"
import { checkUser } from "@/app/utils/hooks"
import { nylas } from "@/app/utils/nylas"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { format, fromUnixTime } from "date-fns"
import { Car } from "lucide-react"


async function getData(id: string) {
  const data = await prisma.user.findUnique({
    where: {
      id: id
    },
    select: {
      grantId: true,
      grantEmail: true
    }
  })

  if (!data) {
    throw new Error("User not Found")
  }

  const meetingData = await nylas.events.list({
    identifier: data.grantId as string,
    queryParams: {
      calendarId: data.grantEmail as string
    }
  })

  return meetingData
}

export default async function Meetings() {
  const session = await checkUser()
  const data = await getData(session.user?.id as string)
  return (
    <>
    {data.data.length < 1 ? (
      <DefaultEvents
        title="No meetings scheduled"
        description="You can choose to schedule a meeting"
        buttonText="Create a new event"
        href="/dashboard/new"
      >

      </DefaultEvents>
    ) : (
      <Card>
        <CardHeader>
          <CardTitle>
            Bookings
          </CardTitle>
          <CardDescription>
            Your scheduled events and meetings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.data.map((item, idx) => (
            <div key={idx} className="grid grid-cols-3 justify-between items-center">
              <div>
                <p className="text-muted-foreground text-sm">
                  {format(fromUnixTime(item.when.startTime), "EEE, dd MMM")}
                </p>
                <p>
                  {format(fromUnixTime(item.when.startTime), "hh:mm a")}
                  {" "} - {" "}
                  {format(fromUnixTime(item.when.endTime), "hh:mm a")}
                </p>
              </div>
              <div className="flex flex-col items-start">
                <h2 className="text-sm font-medium">
                  {item.title}
                </h2>
                <p>
                  You and {item.participants[0].name}
                </p>
              </div>

            </div>
          ))}
        </CardContent>
      </Card>
    )}
    </>
  )
}