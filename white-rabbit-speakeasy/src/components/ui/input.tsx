import * as React from "react"
export const Input = ({ className, ...props }: any) => (
  <input className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`} {...props} />
)
