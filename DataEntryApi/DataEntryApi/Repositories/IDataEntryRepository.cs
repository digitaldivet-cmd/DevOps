
using DataEntryApi.Models;
namespace DataEntryApi.Repositories
{


    public interface IDataEntryRepository
    {
        IEnumerable<DataEntry> GetAll();
        DataEntry? GetById(int id);
        DataEntry Add(DataEntry entry);
    }

}
