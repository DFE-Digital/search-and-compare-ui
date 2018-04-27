using System.Collections.Generic;
using System.Threading.Tasks;
using GovUk.Education.SearchAndCompare.Domain.Models;
using GovUk.Education.SearchAndCompare.UI.Services.Maps.Models;

namespace GovUk.Education.SearchAndCompare.UI.Services.Maps
{
    public interface IMapProvider
    {
        string ApiKey { get; }

        Task<byte[]> GetStaticMapImageAsync(
            IMapProjection<IMapMarker> mapProjection);

        IMapProjection<T> GetMapProjection<T>(
            IEnumerable<T> markers, Coordinates myLocation, int? height, int? zoomLevel)
            where T : IMapMarker;
    }
}
