import type { ReactNode } from 'react'
import type { TagColor } from '../../utils/colors'

interface TagProps {
  color?: TagColor
  children: ReactNode
}

export function Tag({ color, children }: TagProps) {
  return (
    <span className="tag tag--static" style={color ? { background: color.bg, color: color.text } : undefined}>
      {children}
    </span>
  )
}
