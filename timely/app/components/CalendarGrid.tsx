import { useCalendarGrid, useLocale, DateValue } from 'react-aria'
import { DateDuration, getWeeksInMonth, endOfMonth } from '@internationalized/date'
import { CalendarState } from 'react-stately'
import { start } from 'repl'
import { CalendarCell } from './CalendarCell'

export function CalendarGrid({ state, offset = {}, dateAvailability }: {
  state: CalendarState,
  offset?: DateDuration,
  dateAvailability?: (date: DateValue) => boolean
}) {

  const startDate = state.visibleRange.start.add(offset)
  const endDate = endOfMonth(startDate)

  let { locale } = useLocale();
  let { gridProps, headerProps, weekDays } = useCalendarGrid(
    {
      startDate,
      endDate, 
      weekdayStyle: "short"
    },
    state
  );

  const weeksInMonth = getWeeksInMonth(startDate, locale)

  return (
    <table {...gridProps} cellPadding={0} className="flex-1">
      <thead {...headerProps} className='text-sm font-medium'>
        <tr>
          {weekDays.map((day, index) => <th key={index}>{day}</th>)}
        </tr>
      </thead>
      <tbody>
        {[...new Array(weeksInMonth).keys()].map((weekIndex) => (
          <tr key={weekIndex}>
            {state.getDatesInWeek(weekIndex).map((date, i) => (
              date
                ? (
                  <CalendarCell
                    month={startDate}
                    key={i}
                    state={state}
                    date={date}
                    dateAvailable={dateAvailability?.(date)}
                  />
                )
                : <td key={i} />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}