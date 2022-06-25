using System.Threading.Tasks;
using JHipsterNet.Core.Pagination;
using Dms.Domain;

namespace Dms.Domain.Services.Interfaces
{
    public interface IFilePartService
    {
        Task<FilePart> Save(FilePart filePart);

        Task<IPage<FilePart>> FindAll(IPageable pageable);

        Task<IPage<FilePart>> FindAllByUserId(IPageable pageable, string userId);

        Task<FilePart> FindOne(long id);

        Task Delete(long id);
    }
}
