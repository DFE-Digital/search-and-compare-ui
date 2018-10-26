using GovUk.Education.SearchAndCompare.Domain.Models;

namespace GovUk.Education.SearchAndCompare.UI.Services.Maps.Models
{
    public interface IMapMarker
    {
        Coordinates Coordinates { get; }
    }
}
