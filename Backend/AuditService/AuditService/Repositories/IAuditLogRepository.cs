using AuditService.Models;

namespace AuditService.Repositories
{
    public interface IAuditLogRepository
    {
        IEnumerable<AuditLog> GetAll();
        AuditLog? GetById(int id);
        AuditLog Add(AuditLog log);
        IEnumerable<AuditLog> GetByEntityId(string entityId);
        IEnumerable<AuditLog> GetByUserId(string userId);
    }
}
