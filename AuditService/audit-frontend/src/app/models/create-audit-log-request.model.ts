export interface CreateAuditLogRequest {
    action: string;
    entityType: string;
    entityId: string;
    userId: string;
    details?: string;
}
