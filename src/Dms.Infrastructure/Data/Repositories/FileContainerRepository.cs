using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using JHipsterNet.Core.Pagination;
using JHipsterNet.Core.Pagination.Extensions;
using Dms.Domain;
using Dms.Domain.Repositories.Interfaces;
using Dms.Infrastructure.Data.Extensions;

namespace Dms.Infrastructure.Data.Repositories
{
    public class FileContainerRepository : GenericRepository<FileContainer, long>, IFileContainerRepository
    {
        public FileContainerRepository(IUnitOfWork context) : base(context)
        {
        }

        public override async Task<FileContainer> CreateOrUpdateAsync(FileContainer fileContainer)
        {
            List<Type> entitiesToBeUpdated = new List<Type>();
            entitiesToBeUpdated.Add(typeof(FileContainer));
            entitiesToBeUpdated.Add(typeof(FilePart));

            return await base.CreateOrUpdateAsync(fileContainer, entitiesToBeUpdated);
        }
    }
}
