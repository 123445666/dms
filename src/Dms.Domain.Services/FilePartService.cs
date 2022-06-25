using System.Threading.Tasks;
using JHipsterNet.Core.Pagination;
using Dms.Domain.Services.Interfaces;
using Dms.Domain.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using Dms.Crosscutting.Enums;

namespace Dms.Domain.Services
{
    public class FilePartService : IFilePartService
    {
        protected readonly IFilePartRepository _filePartRepository;

        public FilePartService(IFilePartRepository filePartRepository)
        {
            _filePartRepository = filePartRepository;
        }

        public virtual async Task<FilePart> Save(FilePart filePart)
        {
            await _filePartRepository.CreateOrUpdateAsync(filePart);
            await _filePartRepository.SaveChangesAsync();
            return filePart;
        }

        public virtual async Task<IPage<FilePart>> FindAll(IPageable pageable)
        {
            var page = await _filePartRepository.QueryHelper()
                .Include(filePart => filePart.Signer)
                .Include(filePart => filePart.FileContainer)
                .Filter(filePart => filePart.Status != FileStatus.DELETED)
                .GetPageAsync(pageable);
            return page;
        }

        public virtual async Task<IPage<FilePart>> FindAllByUserId(IPageable pageable, string userId)
        {
            var page = await _filePartRepository.QueryHelper()
                .Include(filePart => filePart.Signer)
                .Include(filePart => filePart.FileContainer)
                .Filter(fileContainer => fileContainer.SignerId.Equals(userId))
                .GetPageAsync(pageable);
            return page;
        }

        public virtual async Task<FilePart> FindOne(long id)
        {
            var result = await _filePartRepository.QueryHelper()
                .Include(filePart => filePart.Signer)
                .Include(filePart => filePart.FileContainer)
                .GetOneAsync(filePart => filePart.Id == id);
            return result;
        }

        public virtual async Task Delete(long id)
        {
            await _filePartRepository.DeleteByIdAsync(id);
            await _filePartRepository.SaveChangesAsync();
        }
    }
}
