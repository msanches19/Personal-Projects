"use client"

import { CalendarPanel } from "./CalendarPanel";
import { today, getLocalTimeZone, parseDate, CalendarDate } from '@internationalized/date'
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DateValue } from 'react-aria'


interface IAppProps {
  availability: {
    day: string,
    isActive: boolean
  }[]
}

export function Calendar({ availability }: IAppProps) {

  const searchParams = useSearchParams()
  const router = useRouter();

  const [date, setDate] = useState(() => {
    const dateParams = searchParams.get("date")

    return dateParams ? parseDate(dateParams) : today(getLocalTimeZone());
  })

  useEffect(() => {
    const dateParams = searchParams.get("date");
    if (dateParams) {
      setDate(parseDate(dateParams))
    }

  }, [searchParams])

  const handleDateChange = (date: DateValue) => {
    setDate(date as CalendarDate);

    const url = new URL(window.location.href);
    url.searchParams.set("date", date.toString());
    router.push(url.toString());
  }

  const dateAvailability = (date: DateValue) => {
    const weekday = date.toDate(getLocalTimeZone()).getDay();
    const idx = weekday === 0 ? 6 : weekday - 1;
    return availability[idx].isActive;
  }
  return (
    <CalendarPanel 
      minValue={today(getLocalTimeZone())} 
      dateAvailability={dateAvailability} 
      value={date}
      onChange={handleDateChange}
    />
  )
}