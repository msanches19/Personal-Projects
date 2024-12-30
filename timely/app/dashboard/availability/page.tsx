import { updateAvailability } from "@/app/actions";
import { SubmitButton } from "@/app/components/SubmitButtons";
import prisma from "@/app/utils/db";
import { checkUser } from "@/app/utils/hooks";
import { times } from "@/app/utils/times";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { notFound } from "next/navigation";

async function getData(userId: string) {
  const data = await prisma.availability.findMany({
    where: {
      userId: userId
    }
  })
  if (!data) {
    return notFound()
  }
  return data
}

export default async function AvailabilityPage() {
  const session = await checkUser()
  const data = await getData(session.user?.id as string)
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl">
          Availability
        </CardTitle>
        <CardDescription>
          Manage your availability
        </CardDescription>
      </CardHeader>
      <form action={updateAvailability}>
        <CardContent className="flex flex-col gap-y-4">
          {data.map((item) => (
            <div key={item.id} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center gap-4">
              <input type="hidden" name={`id-${item.id}`} value={item.id}></input>
              <div className="flex items-center gap-x-3">
                <Switch name={`isActive-${item.id}`}defaultChecked={item.isActive}/>
                <p>{item.day}</p>
              </div>
              <Select name={`from-${item.id}`} defaultValue={item.from}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="From Time"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {times.map((time) => (
                      <SelectItem value={time.time} key={time.id}>
                          {time.time}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select name={`until-${item.id}`} defaultValue={item.until}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Until Time"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {times.map((time) => (
                      <SelectItem value={time.time} key={time.id}>
                          {time.time}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <SubmitButton text="Save Changes"/>
        </CardFooter>
      </form>
    </Card>
  )
}