import { useRef } from "react"
import { mergeProps, useCalendarCell, useFocusRing } from 'react-aria'
import { CalendarState } from 'react-stately'
import { CalendarDate, getLocalTimeZone, isSameMonth, isToday } from '@internationalized/date'
import { cn } from "@/lib/utils"

export function CalendarCell({ state, date, month, dateAvailable}: {
  state: CalendarState,
  date: CalendarDate,
  month: CalendarDate,
  dateAvailable?: boolean
}) {

  let ref = useRef(null)
  let {
    cellProps,
    buttonProps,
    isSelected,
    isDisabled,
    formattedDate
  } = useCalendarCell({ date }, state, ref)

  const { focusProps, isFocusVisible } = useFocusRing()

  const today = isToday(date, getLocalTimeZone())

  const sameMonth = isSameMonth(month, date)

  const disabled = isDisabled || !dateAvailable

  return (
    <td {...cellProps} className={`px-0.5 py-0.5 relative ${isFocusVisible ? `z-10` : `z-0`}`}>
      <div 
        ref={ref}
        hidden={!sameMonth}
        className="size-10 sm:size-12 outline-none group rounded-md"
        {...mergeProps(buttonProps, focusProps)}
      >
        <div 
          className={cn(
            "size-full rounded-sm flex items-center justify-center text-sm font-semibold",
            disabled ? "text-muted-foreground cursor-default" : "",
            isSelected ? "bg-primary text-white" : "",
            !isSelected && !disabled? "bg-secondary hover:bg-primary/10" : "" 
          )}
        >
        {formattedDate}
        {today && (
          <div className={cn(
            "absolute bottom-2 size-1.5 bg-primary rounded-full",
            isSelected ? "bg-white" : ""
          )}/>
        )}
        </div>
      </div>

    </td>
  )
}