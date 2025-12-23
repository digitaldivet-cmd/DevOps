using AuditService.Models;

namespace AuditService.Repositories
{
    public class InMemoryAuditLogRepository : IAuditLogRepository
    {
        private readonly List<AuditLog> _logs = new();
        private int _nextId = 1;
        private readonly object _lock = new();

        public IEnumerable<AuditLog> GetAll()
        {
            lock (_lock)
            {
                return _logs.ToList();
            }
        }

        public AuditLog? GetById(int id)
        {
            lock (_lock)
            {
                return _logs.FirstOrDefault(l => l.Id == id);
            }
        }

        public AuditLog Add(AuditLog log)
        {
            lock (_lock)
            {
                log.Id = _nextId++;
                log.Timestamp = DateTime.UtcNow;
                _logs.Add(log);
                return log;
            }
        }

        public IEnumerable<AuditLog> GetByEntityId(string entityId)
        {
            lock (_lock)
            {
                return _logs.Where(l => l.EntityId == entityId).ToList();
            }
        }

        public IEnumerable<AuditLog> GetByUserId(string userId)
        {
            lock (_lock)
            {
                return _logs.Where(l => l.UserId == userId).ToList();
            }
        }
    }
}
