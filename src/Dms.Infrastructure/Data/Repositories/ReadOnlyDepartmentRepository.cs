using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using JHipsterNet.Core.Pagination;
using JHipsterNet.Core.Pagination.Extensions;
using Dms.Domain;
using Dms.Domain.Repositories.Interfaces;
using Dms.Infrastructure.Data.Extensions;

namespace Dms.Infrastructure.Data.Repositories
{
    public class ReadOnlyDepartmentRepository : ReadOnlyGenericRepository<Department, long>, IReadOnlyDepartmentRepository
    {
        public ReadOnlyDepartmentRepository(IUnitOfWork context) : base(context)
        {
        }
    }
}
