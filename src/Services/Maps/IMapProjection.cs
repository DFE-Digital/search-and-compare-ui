using System.Collections.Generic;
using GovUk.Education.SearchAndCompare.Domain.Models;
using GovUk.Education.SearchAndCompare.UI.Services.Maps.Models;

namespace GovUk.Education.SearchAndCompare.UI.Services.Maps
{
    public interface IMapProjection<out T> where T : IMapMarker
    {
        int ZoomLevel { get; set; }

        int Width { get; set; }

        int Height { get; set; }

        bool HasPreviousZoomLevel { get; }

        int PreviousZoomLevel { get; }

        bool HasNextZoomLevel { get; }

        int NextZoomLevel { get; }

        Coordinates MyLocation { get; set; }

        Coordinates Centre { get; set; }

        IEnumerable<T> Markers { get; }
    }
}
