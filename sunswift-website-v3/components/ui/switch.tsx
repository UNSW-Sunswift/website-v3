"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type SwitchProps = Omit<React.ComponentPropsWithoutRef<"button">, "onChange"> & {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      checked,
      defaultChecked = false,
      onCheckedChange,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const isControlled = checked !== undefined
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked)
    const isChecked = isControlled ? checked : internalChecked

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) {
        event.preventDefault()
        return
      }

      const next = !isChecked
      if (!isControlled) {
        setInternalChecked(next)
      }
      onCheckedChange?.(next)
      props.onClick?.(event)
    }

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={isChecked}
        data-state={isChecked ? "checked" : "unchecked"}
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full border border-border bg-muted transition-colors duration-200",
          "data-[state=checked]:border-primary data-[state=checked]:bg-primary",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        <span
          aria-hidden="true"
          className={cn(
            "inline-block size-5 translate-x-0.5 rounded-full bg-background shadow transition-transform duration-200",
            "data-[state=checked]:translate-x-5"
          )}
          data-state={isChecked ? "checked" : "unchecked"}
        />
      </button>
    )
  }
)

Switch.displayName = "Switch"

export { Switch }
