import { addMinutes, format, fromUnixTime, isAfter, isBefore, parse } from 'date-fns'
import prisma from '../utils/db'
import { notFound } from 'next/navigation';
import { Prisma } from '@prisma/client';
import { nylas } from '../utils/nylas';
import { GetFreeBusyResponse, NylasResponse } from 'nylas';
import Link from 'next/link';
import { time } from 'console';
import { Button } from '@/components/ui/button';

interface IAppProps {
  date: Date,
  username: string,
  duration: number
}

async function getData(username: string, date: Date) {
  const day = format(date, "EEEE");
  const data = await prisma.availability.findFirst({
    where: {
      day: day as Prisma.EnumDayFilter,
      User: {
        username: username
      }
    },
    select: {
      from: true,
      until: true,
      id: true,
      User: {
        select: {
          grantEmail: true,
          grantId: true
        }
      }
    }
  });

  const startDate = new Date(date);
  const endDate = new Date(date);

  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  const calendarData = await nylas.calendars.getFreeBusy({
    identifier: data?.User?.grantId as string,
    requestBody: {
      startTime: Math.floor(startDate.getTime() / 1000),
      endTime: Math.floor(endDate.getTime() / 1000),
      emails: [data?.User?.grantEmail as string]
    }
  })

  return { data, calendarData }
}

function getTimeSlots(date: string, 
  availability: {
    from: string | undefined,
    until: string | undefined
  },
  calendarData: NylasResponse<GetFreeBusyResponse[]>,
  duration: number
) {
  const now = new Date();

  const fromObj = parse(
    `${date} ${availability.from}`,
    "yyyy-MM-dd HH:mm",
    new Date()
  );


  const untilObj = parse(
    `${date} ${availability.until}`,
    "yyyy-MM-dd HH:mm",
    new Date()
  );


  const busySlots = calendarData.data[0].timeSlots.map((slot) => ({
    start: fromUnixTime(slot.start),
    end: fromUnixTime(slot.end)
  }))

  const allSlots = [];
  let slot = fromObj;
  while (isBefore(slot, untilObj)) {
    allSlots.push(slot);
    slot = addMinutes(slot, duration)
  }

  const openSlots = allSlots.filter((slot) => {
    const slotEnd = addMinutes(slot, duration);
    return (
      isAfter(slot, now) && 
      !busySlots.some((busy: {start: any, end: any}) =>
        (!isBefore(slot, busy.start) && isBefore(slot, busy.end)) ||
        (isAfter(slotEnd, busy.start) && !isAfter(slotEnd, busy.end)) ||
        (isBefore(slot, busy.start) && isAfter(slotEnd, busy.end))
      ) 
    )
  })

  return openSlots.map((slot) => format(slot, "HH:mm"))

}

export async function TimeTable({ date, username, duration }: IAppProps) {

  const { data, calendarData } = await getData(username, date);
  const formattedDate = format(date, "yyyy-MM-dd")

  const availability = {
    from: data?.from,
    until: data?.until
  }

  const openSlots = getTimeSlots(formattedDate, availability, calendarData, duration)

  return (
    <div>
      <p className='text-lg font-semibold'>
        {format(date, "EEE")} {"  "}
        <span className='text-sm text-muted-foreground'>
          {format(date, "MMM. d")}
        </span>
      </p>
      <div className='mt-3 max-h-[350px] overflow-y-auto'>
        {openSlots.length > 0 ? (
          openSlots.map((slot, idx) => 
          <Link href={`?date=${format(date, "yyyy-MM-dd")}&time=${slot}`} key={idx}>
            <Button className='w-full mb-2' variant="outline">
              {slot}
            </Button>
          </Link>)
        ): (
          <p>
            No times available
          </p>
        )}
      </div>
    </div>
  )
}