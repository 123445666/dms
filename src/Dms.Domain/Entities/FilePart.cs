using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Dms.Crosscutting.Enums;

namespace Dms.Domain
{
    [Table("file_part")]
    public class FilePart : BaseEntity<long>
    {
        [Required]
        public string Name { get; set; }
        public byte[] Content { get; set; }
        public string contentContentType { get; set; }
        public string ConcurrencyStamp { get; set; } = Guid.NewGuid().ToString();
        public FileStatus Status { get; set; }
        public string SignerId { get; set; }
        public User Signer { get; set; }

        public long? FileContainerId { get; set; }
        public FileContainer FileContainer { get; set; }

        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

        public override bool Equals(object obj)
        {
            if (this == obj) return true;
            if (obj == null || GetType() != obj.GetType()) return false;
            var filePart = obj as FilePart;
            if (filePart?.Id == null || filePart?.Id == 0 || Id == 0) return false;
            return EqualityComparer<long>.Default.Equals(Id, filePart.Id);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Id);
        }

        public override string ToString()
        {
            return "FilePart{" +
                    $"ID='{Id}'" +
                    $", Name='{Name}'" +
                    $", Content='{Content}'" +
                    $", ConcurrencyStamp='{ConcurrencyStamp}'" +
                    $", Status='{Status}'" +
                    "}";
        }
    }
}
