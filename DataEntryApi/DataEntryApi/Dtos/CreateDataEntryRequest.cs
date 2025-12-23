using System.ComponentModel.DataAnnotations;

namespace DataEntryApi.Dtos
{
    public class CreateDataEntryRequest
    {
        [Required]
        [MinLength(2)]
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }
    }
}
