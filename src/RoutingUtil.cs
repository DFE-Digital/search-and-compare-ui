using Microsoft.AspNetCore.Routing;

namespace GovUk.Education.SearchAndCompare.UI
{
    public static class RoutingUtil
    {
        public static RouteValueDictionary Combine(params object[] routeObjects)
        {
            var res = new RouteValueDictionary();
            foreach (var item in routeObjects)
            {
                if (item == null) continue;
                var rvd = new RouteValueDictionary(item);
                foreach (var keyValue in rvd)
                {
                    res[keyValue.Key] = keyValue.Value;
                }
            }
            return res;
        }
    }
}
