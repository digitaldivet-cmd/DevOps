using AuditService.Dtos;
using AuditService.Models;
using AuditService.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace AuditService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuditLogsController : ControllerBase
{
    private readonly IAuditLogRepository _repo;

    public AuditLogsController(IAuditLogRepository repo)
    {
        _repo = repo;
    }

    // GET: /api/auditlogs
    [HttpGet]
    public IActionResult GetAll()
    {
        var logs = _repo.GetAll();
        return Ok(logs);
    }

    // GET: /api/auditlogs/{id}
    [HttpGet("{id:int}")]
    public IActionResult GetById(int id)
    {
        var log = _repo.GetById(id);
        if (log == null)
            return NotFound(new { message = $"Audit log with id={id} not found." });

        return Ok(log);
    }

    // GET: /api/auditlogs/entity/{entityId}
    [HttpGet("entity/{entityId}")]
    public IActionResult GetByEntityId(string entityId)
    {
        var logs = _repo.GetByEntityId(entityId);
        return Ok(logs);
    }

    // GET: /api/auditlogs/user/{userId}
    [HttpGet("user/{userId}")]
    public IActionResult GetByUserId(string userId)
    {
        var logs = _repo.GetByUserId(userId);
        return Ok(logs);
    }

    // POST: /api/auditlogs
    [HttpPost]
    public IActionResult Create([FromBody] CreateAuditLogRequest request)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        var log = new AuditLog
        {
            Action = request.Action.Trim(),
            EntityType = request.EntityType.Trim(),
            EntityId = request.EntityId.Trim(),
            UserId = request.UserId.Trim(),
            Details = request.Details?.Trim() ?? ""
        };

        var created = _repo.Add(log);

        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }
}
