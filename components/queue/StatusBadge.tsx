import type { EntryStatus } from '@/types';
import { Badge } from '@/components/ui/Badge';

interface StatusBadgeProps {
  status: EntryStatus;
}

const statusVariantMap: Record<EntryStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  WAITING: 'secondary',
  SERVING: 'default',
  COMPLETED: 'outline',
  SKIPPED: 'destructive',
};

const statusLabelMap: Record<EntryStatus, string> = {
  WAITING: 'Waiting',
  SERVING: 'Serving',
  COMPLETED: 'Completed',
  SKIPPED: 'Skipped',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge variant={statusVariantMap[status]}>
      {statusLabelMap[status]}
    </Badge>
  );
}
