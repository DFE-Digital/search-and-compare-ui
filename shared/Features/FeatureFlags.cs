using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.Extensions.Configuration;

namespace GovUk.Education.SearchAndCompare.UI.Shared.Features
{
    public class FeatureFlags : IFeatureFlags
    {
        private readonly IConfiguration _config;

        public FeatureFlags(IConfiguration config)
        {
            _config = config;
        }

        public bool Maps => ShouldShow("FEATURE_MAPS");

        public bool ShouldShow(string key)
        {
            var value = _config[key];
            return !string.IsNullOrWhiteSpace(value) && value.Trim().ToLower().Equals("true");
        }
    }
}
