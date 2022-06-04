using System.Threading.Tasks;
using JHipsterNet.Core.Pagination;
using Dms.Domain;

namespace Dms.Domain.Services.Interfaces
{
    public interface IRegionService
    {
        Task<Region> Save(Region region);

        Task<IPage<Region>> FindAll(IPageable pageable);

        Task<Region> FindOne(long id);

        Task Delete(long id);
    }
}
