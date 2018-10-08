using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.Extensions.Configuration;

namespace GovUk.Education.SearchAndCompare.UI.Shared.Features
{
    public class FeatureFlags : IFeatureFlags
    {
        private readonly IConfiguration _config;
        private const string FeaturePrefix = "FEATURE_";
        private const string Apply2019Key = FeaturePrefix + "APPLY_2019";
        private const string MapsKey = FeaturePrefix + "MAPS";

        public FeatureFlags(IConfiguration config)
        {
            _config = config;
        }

        public bool Apply2019 => ShouldShow(Apply2019Key);
        public bool Maps => ShouldShow(MapsKey);

        private bool ShouldShow(string key) => _config.GetValue(key, false);
    }
}
