import { cn } from "@/lib/utils"
import { HtmlHTMLAttributes, PropsWithChildren } from "react"

export type CodeblockProps = HtmlHTMLAttributes<HTMLDivElement> & PropsWithChildren
export function Codeblock(props: CodeblockProps) {
  const { children, className, ...rest } = props
  return (<kbd className={cn("pointer-events-none inline-flex items-center gap-1 rounded-sm border bg-muted px-1.5 py-1 font-mono font-medium text-[80%] text-muted-foreground opacity-100", className)} {...rest}>
    {children}
  </kbd>)
}