import { Badge } from '@/components/ui/badge'
import { UserRole, getRoleDisplayName, getRoleBadgeColor } from '@/lib/roles'

interface RoleBadgeProps {
  role: UserRole
  className?: string
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  return (
    <Badge className={`${getRoleBadgeColor(role)} ${className || ''}`}>
      {getRoleDisplayName(role)}
    </Badge>
  )
}