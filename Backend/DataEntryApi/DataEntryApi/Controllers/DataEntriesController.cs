using DataEntryApi.Dtos;
using DataEntryApi.Models;
using DataEntryApi.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace DataEntryApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DataEntriesController : ControllerBase
{
    private readonly IDataEntryRepository _repo;

    public DataEntriesController(IDataEntryRepository repo)
    {
        _repo = repo;
    }

    // GET: /api/dataentries
    [HttpGet]
    public IActionResult GetAll()
    {
        var items = _repo.GetAll();
        return Ok(items);
    }

    // GET: /api/dataentries/{id}
    [HttpGet("{id:int}")]
    public IActionResult GetById(int id)
    {
        var item = _repo.GetById(id);
        if (item == null)
            return NotFound(new { message = $"Entry with id={id} not found." });

        return Ok(item);
    }

    // POST: /api/dataentries
    [HttpPost]
    public IActionResult Create([FromBody] CreateDataEntryRequest request)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        var entry = new DataEntry
        {
            Name = request.Name.Trim(),
            Description = request.Description?.Trim() ?? ""
        };

        var created = _repo.Add(entry);

        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }
}
