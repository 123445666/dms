using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Dms.Domain
{
    public class FullAuditedAggregateRoot<TKey>
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public TKey Id { get; set; }
        public virtual DateTime CreationTime
        {
            get;
            set;
        }

        public virtual Guid? CreatorId
        {
            get;
            set;
        }
        public virtual DateTime? LastModificationTime
        {
            get;
            set;
        }

        public virtual Guid? LastModifierId
        {
            get;
            set;
        }
        public virtual bool IsDeleted
        {
            get;
            set;
        }

        public virtual Guid? DeleterId
        {
            get;
            set;
        }

        public virtual DateTime? DeletionTime
        {
            get;
            set;
        }
    }
}
