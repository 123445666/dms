using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Dms.Dto
{

    public class RegionDto
    {
        public long Id { get; set; }
        [Required]
        public string RegionName { get; set; }

        // jhipster-needle-dto-add-field - JHipster will add fields here, do not remove
    }
}
