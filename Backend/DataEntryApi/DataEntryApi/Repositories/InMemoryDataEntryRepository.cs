using DataEntryApi.Models;
using System.Collections.Concurrent;

namespace DataEntryApi.Repositories
{
    public class InMemoryDataEntryRepository : IDataEntryRepository
    {
        private readonly ConcurrentDictionary<int, DataEntry> _store = new();
        private int _idCounter = 0;

        public InMemoryDataEntryRepository()
        {
            // Seed sample in-memory data
            Add(new DataEntry { Name = "Ali", Description = "Seed entry 1" });
            Add(new DataEntry { Name = "Sara", Description = "Seed entry 2" });
        }

        public IEnumerable<DataEntry> GetAll()
            => _store.Values.OrderByDescending(x => x.CreatedAtUtc);

        public DataEntry? GetById(int id)
            => _store.TryGetValue(id, out var item) ? item : null;

        public DataEntry Add(DataEntry entry)
        {
            var id = Interlocked.Increment(ref _idCounter);
            entry.Id = id;
            entry.CreatedAtUtc = DateTime.UtcNow;

            _store.TryAdd(id, entry);
            return entry;
        }
    }
}
