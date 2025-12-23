using System.ComponentModel.DataAnnotations;

namespace AuditService.Dtos
{
    public class CreateAuditLogRequest
    {
        [Required]
        [MinLength(2)]
        public string Action { get; set; } = string.Empty;

        [Required]
        [MinLength(2)]
        public string EntityType { get; set; } = string.Empty;

        [Required]
        public string EntityId { get; set; } = string.Empty;

        [Required]
        public string UserId { get; set; } = string.Empty;

        public string? Details { get; set; }
    }
}
