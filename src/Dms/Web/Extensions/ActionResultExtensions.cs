using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Dms.Web.Extensions
{
    public static class ActionResultExtensions
    {
        public static ActionResult WithHeaders(this ActionResult receiver, IHeaderDictionary headers)
        {
            return new ActionResultWithHeaders(receiver, headers);
        }
    }
}
