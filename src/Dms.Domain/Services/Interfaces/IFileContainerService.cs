using System.Threading.Tasks;
using JHipsterNet.Core.Pagination;
using Dms.Domain;

namespace Dms.Domain.Services.Interfaces
{
    public interface IFileContainerService
    {
        Task<FileContainer> Save(FileContainer fileContainer);

        Task<IPage<FileContainer>> FindAll(IPageable pageable);
        Task<IPage<FileContainer>> FindAllByUserId(IPageable pageable, string userId);

        Task<FileContainer> FindOne(long id);

        Task Delete(long id);
    }
}
