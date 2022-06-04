using System.Security.Authentication;

namespace Dms.Crosscutting.Exceptions
{
    public class UsernameNotFoundException : AuthenticationException
    {
        public UsernameNotFoundException(string message) : base(message)
        {
        }
    }
}
