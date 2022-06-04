using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Dms.Crosscutting.Enums;

namespace Dms.Dto
{

    public class FilePartDto
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public byte[] Content { get; set; }
        public string contentContentType { get; set; }
        public string ConcurrencyStamp { get; set; }
        public FileStatus Status { get; set; }
        public string SignerId { get; set; }
        public UserDto Signer { get; set; }
        public string FileContainerId { get; set; }
        public FileContainerDto FileContainer { get; set; }

        // jhipster-needle-dto-add-field - JHipster will add fields here, do not remove
    }
}
