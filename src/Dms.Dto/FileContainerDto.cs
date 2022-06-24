using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Dms.Crosscutting.Enums;

namespace Dms.Dto
{

    public class FileContainerDto
    {
        public long Id { get; set; }
        [Required]
        public string Name { get; set; }
        public string ConcurrencyStamp { get; set; } = Guid.NewGuid().ToString();
        public FileStatus Status { get; set; }
        public string OwnerId { get; set; }
        public UserDto Owner { get; set; }
        public IList<FilePartDto> FileParts { get; set; } = new List<FilePartDto>();

        // jhipster-needle-dto-add-field - JHipster will add fields here, do not remove
    }
}
