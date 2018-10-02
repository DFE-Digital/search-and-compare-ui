using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using GovUk.Education.SearchAndCompare.Domain.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace GovUk.Education.SearchAndCompare.UI.Services
{
    public class Geocoder : IGeocoder
    {
        private readonly string apiKey;
        private readonly HttpClient client;

        public Geocoder(string apiKey, HttpClient client)
        {
            this.apiKey = apiKey;
            this.client = client;
        }

        public async Task<Coordinates> ResolvePostCodeAsync(string postCode)
        {
            var query = HttpUtility.ParseQueryString(string.Empty);
            query["key"] = apiKey;
            query["region"] = "uk";
            query["address"] = postCode;

            var response = await client.GetAsync("https://maps.googleapis.com/maps/api/geocode/json?" + query.ToString());

            dynamic json = JsonConvert.DeserializeObject(await response.Content.ReadAsStringAsync());

            if ("OK" != (string) json.status)
            {
                return null;
            }

            JArray addressComponents = json.results[0].address_components;
            var isInUk = addressComponents.Any(IsIndicativeOfUk);
            if (isInUk == false)
            {

                return null;
            }

            string formatted = json.results[0].formatted_address;
            double lat = json.results[0].geometry.location.lat;
            double lng = json.results[0].geometry.location.lng;

            return new Coordinates(lat, lng, postCode, formatted);
        }

        public async Task<IEnumerable<string>> SuggestLocationsAsync(string input)
        {
            var query = HttpUtility.ParseQueryString(string.Empty);
            query["key"] = apiKey;
            query["language"] = "en";
            query["input"] = input;
            query["components"] = "country:uk";
            query["types"] = "geocode";

            var response = await client.GetAsync("https://maps.googleapis.com/maps/api/place/autocomplete/json?" + query.ToString());

            dynamic json = JsonConvert.DeserializeObject(await response.Content.ReadAsStringAsync());

            var res = new List<string>();

            if ("OK" == (string) json.status)
            {
                foreach (var prediction in json.predictions)
                {
                    res.Add((string) prediction.description);
                }
            }

            return res;
        }

        private static bool IsIndicativeOfUk(JToken addressComponent)
        {
            JArray types = (JArray) addressComponent["types"];
            return types.Any(x => "country" == (string) x) &&
                (string) addressComponent["short_name"] == "GB";
        }
    }
}
