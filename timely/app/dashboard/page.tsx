import { notFound, redirect } from "next/navigation"
import { auth } from "../utils/auth"
import { checkUser } from "../utils/hooks"
import prisma from "../utils/db"
import { DefaultEvents } from "../components/DefaultEvents"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { User2, Users2 } from "lucide-react"
import { Switch } from "@/components/ui/switch"

async function getData(userId: string) {
  const data = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      username: true,
      events: {
        select: {
          id: true,
          active:true,
          title: true,
          url: true,
          duration: true
        }
      }
    }
  })

  if (!data) {
    return notFound()
  }

  return data
}

export default async function DashboardPage() {

  const session = await checkUser()
  const data = await getData(session.user?.id as string)

  return(
    <>
      {(data.events.length === 0) 
        ? (
          <DefaultEvents title="No events scheduled" description="Create events below" buttonText="Add Event" href="/dashboard/new"/>
        )
        : (
          <>
            <div className="flex items-center justify-between px-2">
              <div className="hidden sm:grid gap-y-1">
                <h1 className="text-3xl md:text-4xl font-semibold">Events</h1>
                <p className="text-muted-foreground">Create and Manage Events</p>
              </div>
              <Button asChild>
                <Link href="/dashboard/new">
                  Create New Event
                </Link>
              </Button>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {data.events.map((item) => (
                <div 
                  className="overflow-hidden shadow rounded-lg border relative"
                  key={item.id}
                >
            
                  <Link href="/" className="flex items-center p-5">
                    <div className="flex shrink-0">
                      <Users2 className="size-6"/>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-muted-foreground">
                          {item.duration} min meeting
                        </dt>
                        <dd className="text-lg font-medium">
                          {item.title}
                        </dd>
                      </dl>
                    </div>
                  </Link>
                  <div className="flex bg-muted px-5 py-3 justify-between items-center">
                    <Switch />
                    <Button>
                      Edit Event
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>

        )
      }
    </>
  )
}