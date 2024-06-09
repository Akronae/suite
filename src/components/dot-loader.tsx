import { HtmlHTMLAttributes } from 'react'
import './dot-loader.css'
import { cn } from '@/lib/utils'

export type DotLoaderProps = HtmlHTMLAttributes<HTMLDivElement>
export function DotLoader(props: DotLoaderProps) {
  const { className, ...rest } = props
  return (<div className={cn("dots", className)} {...rest}></div>)
}