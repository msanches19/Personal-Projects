
import { CalendarState } from 'react-stately'
import { FocusableElement, DOMAttributes } from '@react-types/shared'
import { AriaButtonProps } from '@react-aria/button'
import { useDateFormatter } from '@react-aria/i18n'
import { VisuallyHidden } from '@react-aria/visually-hidden'
import { CalendarButton } from './CalendarButton'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
 


export function CalendarHeader({ state, calendarProps, prevButtonProps, nextButtonProps }: {
  state: CalendarState;
  calendarProps: DOMAttributes<FocusableElement>;
  prevButtonProps: AriaButtonProps<"button">;
  nextButtonProps: AriaButtonProps<"button">;
})  {

  const dateFormat = useDateFormatter({
    month: "short",
    year: "numeric",
    timeZone: state.timeZone
  })

  const [month, _, year] = dateFormat.formatToParts(
    state.visibleRange.start.toDate(state.timeZone)
  ).map((part) => (
    part.value
  ))

  return (
    <div className="flex items-center pb-4">
      <VisuallyHidden>
        <h2>
          {calendarProps["aria-label"]}
        </h2>
      </VisuallyHidden>
      <h2 className="font-bold flex-1">
        {month} 
        <span className="text-muted-foreground text-sm font-medium ml-1 mr-3">
           {year}
        </span>
      </h2>
      <div className="flex items-center gap-2">
        <CalendarButton {...prevButtonProps} >
          <ChevronLeftIcon className="size-4" />
        </CalendarButton>
        <CalendarButton {...nextButtonProps}>
          <ChevronRightIcon className="size-4" />
        </CalendarButton>
      </div>

    </div>
  )
  
}