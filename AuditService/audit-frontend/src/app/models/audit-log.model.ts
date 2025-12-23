export interface AuditLog {
  id: number;
  action: string;
  entityType: string;
  entityId: string;
  userId: string;
  timestamp: Date;
  details: string;
}
