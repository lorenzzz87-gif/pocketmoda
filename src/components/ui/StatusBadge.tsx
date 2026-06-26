import type { OrderStatus } from '../../types'
import { Badge } from './Badge'

const STATUS_CONFIG: Record<OrderStatus, { label_zh: string; variant: 'silver' | 'orange' | 'blue' | 'teal' | 'green' | 'red' }> = {
  pending:       { label_zh: '待确认',  variant: 'orange' },
  confirmed:     { label_zh: '已确认',  variant: 'blue' },
  in_production: { label_zh: '生产中',  variant: 'teal' },
  qc_check:      { label_zh: 'QC质检',  variant: 'orange' },
  shipped:       { label_zh: '已发货',  variant: 'teal' },
  delivered:     { label_zh: '已到货',  variant: 'green' },
  cancelled:     { label_zh: '已取消',  variant: 'red' },
}

export function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status]
  return <Badge variant={cfg.variant}>{cfg.label_zh}</Badge>
}

export { STATUS_CONFIG }
