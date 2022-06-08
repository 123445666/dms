using System.Threading.Tasks;
using JHipsterNet.Core.Pagination;
using Dms.Domain.Services.Interfaces;
using Dms.Domain.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Dms.Domain.Services
{
    public class FileContainerService : IFileContainerService
    {
        protected readonly IFileContainerRepository _fileContainerRepository;

        public FileContainerService(IFileContainerRepository fileContainerRepository)
        {
            _fileContainerRepository = fileContainerRepository;
        }

        public virtual async Task<FileContainer> Save(FileContainer fileContainer)
        {
            await _fileContainerRepository.CreateOrUpdateAsync(fileContainer);
            await _fileContainerRepository.SaveChangesAsync();
            return fileContainer;
        }

        public virtual async Task<IPage<FileContainer>> FindAll(IPageable pageable)
        {
            var page = await _fileContainerRepository.QueryHelper()
                .Include(fileContainer => fileContainer.Owner)
                .Include(fileContainer => fileContainer.FileParts)
                .GetPageAsync(pageable);
            return page;
        }

        public virtual async Task<FileContainer> FindOne(long id)
        {
            var result = await _fileContainerRepository.QueryHelper()
                .Include(fileContainer => fileContainer.Owner)
                .Include(fileContainer => fileContainer.FileParts)
                .GetOneAsync(fileContainer => fileContainer.Id == id);
            return result;
        }

        public virtual async Task Delete(long id)
        {
            await _fileContainerRepository.DeleteByIdAsync(id);
            await _fileContainerRepository.SaveChangesAsync();
        }
    }
}
