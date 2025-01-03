"use client"

import { CalendarProps, DateValue, useCalendar, useLocale } from 'react-aria'
import { useCalendarState } from 'react-stately'
import { createCalendar } from '@internationalized/date'
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';

export function CalendarPanel(props: CalendarProps<DateValue> & {
  dateAvailability?: (date: DateValue) => boolean
}) {
  const { locale } = useLocale()
  let state = useCalendarState({
    ...props,
    locale, 
    createCalendar
  });
  
  let { calendarProps, prevButtonProps, nextButtonProps, title } = useCalendar(
    props, state
  );

  return (
    <div {...calendarProps} className="inline-block">
      <CalendarHeader
        state={state} 
        calendarProps={calendarProps} 
        prevButtonProps={prevButtonProps} 
        nextButtonProps={nextButtonProps}
      />
      <div className='flex gap-8'>
        <CalendarGrid state={state} dateAvailability={props.dateAvailability}/>

      </div>
    </div>
  );
}