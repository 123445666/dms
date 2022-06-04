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
    public class FilePartRepository : GenericRepository<FilePart, long>, IFilePartRepository
    {
        public FilePartRepository(IUnitOfWork context) : base(context)
        {
        }

        public override async Task<FilePart> CreateOrUpdateAsync(FilePart filePart)
        {
            List<Type> entitiesToBeUpdated = new List<Type>();
            return await base.CreateOrUpdateAsync(filePart, entitiesToBeUpdated);
        }
    }
}
