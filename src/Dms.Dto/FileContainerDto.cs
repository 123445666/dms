using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Dms.Crosscutting.Enums;

namespace Dms.Dto
{

    public class FileContainerDto
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string ConcurrencyStamp { get; set; }
        public FileStatus Status { get; set; }
        public long? OwnerId { get; set; }
        public UserDto Owner { get; set; }

        // jhipster-needle-dto-add-field - JHipster will add fields here, do not remove
    }
}
