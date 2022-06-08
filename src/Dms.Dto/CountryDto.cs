using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Dms.Dto
{

    public class CountryDto
    {
        public long Id { get; set; }
        [Required]
        public string CountryName { get; set; }
        public long? RegionId { get; set; }
        public RegionDto Region { get; set; }

        // jhipster-needle-dto-add-field - JHipster will add fields here, do not remove
    }
}
