using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Dms.Domain
{
    public class Role : IdentityRole<string>
    {
        public ICollection<UserRole> UserRoles { get; set; }
    }
}
