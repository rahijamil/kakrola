import React from 'react'
import { cn } from '../utils'

export const DropdownCategoryTitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="text-[.65rem] font-semibold mb-1 uppercase text-text-500 px-1.5">
      {children}
    </div>
  )
}

export const DropdownButton = React.forwardRef<
  HTMLButtonElement,
  {
    children: React.ReactNode
    isActive?: boolean
    onClick?: () => void
    disabled?: boolean
    className?: string
  }
>(function DropdownButtonInner({ children, isActive, onClick, disabled, className }, ref) {
  const buttonClass = cn(
    'flex items-center gap-2 p-1.5 px-4 text-left text-text-700 bg-transparent w-full border-l-4 border-transparent transition',
    !isActive && !disabled,
    'hover:bg-primary-50 hover:border-primary-200',
    isActive && !disabled && 'bg-primary-50 border-primary-200',
    disabled && 'text-text-400 cursor-not-allowed',
    className,
  )

  return (
    <button className={buttonClass} disabled={disabled} onClick={onClick} ref={ref}>
      {children}
    </button>
  )
})

DropdownButton.displayName = 'DropdownButton'
