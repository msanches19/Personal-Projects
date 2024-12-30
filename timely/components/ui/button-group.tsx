"use client"

import { cn } from "@/lib/utils";
import { Children, cloneElement, ReactElement } from "react";
import { ButtonProps } from "./button";

interface IAppProps {
  className?: string,
  children: ReactElement<ButtonProps>[]
}

export function ButtonGroup({ className, children }: IAppProps) {
  const numButtons = Children.count(children)
  return (
    <div className={cn("flex w-full", className)}>
      {children.map((child, index) => {
        const isFirstItem = index === 0;
        const isLastItem = index === numButtons - 1

        return cloneElement(child, {
          className: cn(
            {
              "border-l-0": !isFirstItem
            },
            child.props.className
          )
        })
      })}
    </div>
  )
}