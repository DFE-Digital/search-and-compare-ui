using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using GovUk.Education.SearchAndCompare.Domain.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using GovUk.Education.SearchAndCompare.UI.Exceptions;

namespace GovUk.Education.SearchAndCompare.UI.Services
{
    public class Geocoder : IGeocoder
    {
        private readonly string apiKey;
        private readonly HttpClient client;

        private static string okStatus = "OK";

        private static IList<string> badStatus = new List<string>(){
            "OVER_QUERY_LIMIT",
            "REQUEST_DENIED",
            "INVALID_REQUEST",
            "UNKNOWN_ERROR"};

        public Geocoder(string apiKey, HttpClient client)
        {
            this.apiKey = apiKey;
            this.client = client;
        }

        public async Task<GeocodingResult> ResolveAddressAsync(string address)
        {
            var query = HttpUtility.ParseQueryString(string.Empty);
            query["key"] = apiKey;
            query["components"] = "country:uk";
            query["address"] = address;

            var url = "https://maps.googleapis.com/maps/api/geocode/json?" + query.ToString();
            var response = await client.GetAsync(url);

            var content = await response.Content.ReadAsStringAsync();
            dynamic json = JsonConvert.DeserializeObject(content);

            var status = (string)json.status;
            if (badStatus.Any(x => x.Equals(status, StringComparison.InvariantCultureIgnoreCase)))
            {
                throw new GoogleMapsApiServiceException($"address: {address}, url: {url}, content: {content}");
            }
            else
            {
                if (status.Equals(okStatus, StringComparison.InvariantCultureIgnoreCase) && ((JArray) json.results).Any())
                {
                    var result = json.results[0];

                    // This is a workaround for when a non-existent gibberish address is fed into the
                    // geocoder. For some reason, it returns "the UK" as a result. We detect this by looking
                    // at the types of the first address component
                    var types = result.address_components[0].types;
                    if (Array.IndexOf(types.ToObject<string[]>(), "country") > -1) {
                        return null;
                    }

                    string formatted = result.formatted_address;
                    double lat = result.geometry.location.lat;
                    double lng = result.geometry.location.lng;

                    string granularity = result.address_components[0].types[0];
                    string region = ((JArray)result.address_components)
                        .Where(x => ((JArray)x["types"]).Any(y => (string)y == "administrative_area_level_2"))
                        .Select(x => x["long_name"].Value<string>())
                        .FirstOrDefault() ?? "";

                    return new GeocodingResult(lat, lng, address, formatted, granularity, region);
                }
                else
                {
                    return null;
                }

            }
        }

        public async Task<IEnumerable<string>> SuggestLocationsAsync(string input)
        {
            var query = HttpUtility.ParseQueryString(string.Empty);
            query["key"] = apiKey;
            query["language"] = "en";
            query["input"] = input;
            query["components"] = "country:uk";
            query["types"] = "geocode";

            var url = "https://maps.googleapis.com/maps/api/place/autocomplete/json?" + query.ToString();

            var response = await client.GetAsync(url);

            var content = await response.Content.ReadAsStringAsync();
            dynamic json = JsonConvert.DeserializeObject(content);
            var status = (string)json.status;

            var res = new List<string>();
            if (badStatus.Any(x => x.Equals(status, StringComparison.InvariantCultureIgnoreCase)))
            {
                throw new GoogleMapsApiServiceException($"input: {input}, url: {url}, content: {content}");
            }
            else
            {
                if (status.Equals(okStatus, StringComparison.InvariantCultureIgnoreCase))
                {
                    foreach (var prediction in json.predictions)
                    {
                        res.Add((string)prediction.description);
                    }
                }
            }

            return res;
        }
    }
}
