using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Dms.Dto
{

    public class FileContainerDto
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string ConcurrencyStamp { get; set; }
        public long? CreatorId { get; set; }
        public UserDto Creator { get; set; }
        public long? OwnerId { get; set; }
        public UserDto Owner { get; set; }

        // jhipster-needle-dto-add-field - JHipster will add fields here, do not remove
    }
}
