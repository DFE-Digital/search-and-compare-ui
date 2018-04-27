using System.Net.Http;
using System.Web;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using GovUk.Education.SearchAndCompare.UI.Services.Maps.Models;
using GovUk.Education.SearchAndCompare.Domain.Models;
using GovUk.Education.SearchAndCompare.UI.Services.Http;

namespace GovUk.Education.SearchAndCompare.UI.Services.Maps
{
    public class MapProvider : IMapProvider
    {
        private readonly IHttpClientProvider httpClientProvider;

        private readonly string apiKey;

        public MapProvider(IHttpClientProvider httpClientProvider, string apiKey)
        {
            this.httpClientProvider = httpClientProvider;
            this.apiKey = apiKey;
        }

        public string ApiKey { get { return apiKey; } }

        public IMapProjection<T> GetMapProjection<T>(
            IEnumerable<T> markers, Coordinates myLocation, int? height, int? zoomLevel)
            where T : IMapMarker
        {
            return new MapProjection<T>(markers, myLocation, height, zoomLevel);
        }

        // Take a location to centre map on (lat, lng),
        // list of locations to show markers for (lat, lng)[],
        // and a radius to draw a circle (in miles?)
        public async Task<byte[]> GetStaticMapImageAsync(
            IMapProjection<IMapMarker> mapProjection)
        {
            using(var client = httpClientProvider.GetHttpClient())
            {
                var query = HttpUtility.ParseQueryString(string.Empty);
                query["key"] = apiKey;
                query["zoom"] = string.Format("{0}", mapProjection.ZoomLevel);
                query["center"] = mapProjection.Centre.FormattedCoordinates;
                query["size"] = string.Format("{0}x{1}", mapProjection.Width, mapProjection.Height);

                var queryString = query.ToString();

                // Your location marker
                queryString += string.Format("&markers={0}", HttpUtility.UrlEncode(
                    string.Format("color:green|{0},{1}",
                        mapProjection.Centre.Latitude, mapProjection.Centre.Longitude)));

                // Location markers
                mapProjection.MarkersWithAreas.ToList()
                    .ForEach(m => {
                        queryString += string.Format("&markers={0}", HttpUtility.UrlEncode(
                        string.Format("color:red|label:{0}|{1},{2}",
                            m.Area.Label, m.Coordinates.Latitude, m.Coordinates.Longitude)));
                    });
                var response = await client.GetAsync("https://maps.googleapis.com/maps/api/staticmap?" + queryString);

                return await response.Content.ReadAsByteArrayAsync();
            }
        }
    }
}
