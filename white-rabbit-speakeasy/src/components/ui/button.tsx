import * as React from "react"
export const Button = ({ className, ...props }: any) => (
  <button className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 ${className}`} {...props} />
)
