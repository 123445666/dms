using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Dms.Domain
{
    [Table("file_container")]
    public class FileContainer : BaseEntity<long>
    {
        public string Name { get; set; }
        public string ConcurrencyStamp { get; set; }
        public string CreatorId { get; set; }
        public User Creator { get; set; }
        public string OwnerId { get; set; }
        public User Owner { get; set; }
        public IList<FilePart> FileParts { get; set; } = new List<FilePart>();

        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

        public override bool Equals(object obj)
        {
            if (this == obj) return true;
            if (obj == null || GetType() != obj.GetType()) return false;
            var fileContainer = obj as FileContainer;
            if (fileContainer?.Id == null || fileContainer?.Id == 0 || Id == 0) return false;
            return EqualityComparer<long>.Default.Equals(Id, fileContainer.Id);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Id);
        }

        public override string ToString()
        {
            return "FileContainer{" +
                    $"ID='{Id}'" +
                    $", Name='{Name}'" +
                    $", ConcurrencyStamp='{ConcurrencyStamp}'" +
                    "}";
        }
    }
}
