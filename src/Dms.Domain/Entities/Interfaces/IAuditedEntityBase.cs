using System;

namespace Dms.Domain.Interfaces
{
    public interface IAuditedEntityBase
    {
        string CreatedBy { get; set; }

        DateTime CreatedDate { get; set; }

        string LastModifiedBy { get; set; }

        DateTime LastModifiedDate { get; set; }
    }
}
