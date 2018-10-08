﻿using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.Extensions.Configuration;

namespace GovUk.Education.SearchAndCompare.UI.Shared.Features
{
    public class FeatureFlags : IFeatureFlags
    {
        private readonly IConfiguration _config;
        private const string APPLY_2019 = "FEATURE_APPLY_2019";

        public FeatureFlags(IConfiguration config)
        {
            _config = config;
        }
        public bool Apply2019 => ShouldShow(APPLY_2019);

        private bool ShouldShow(string key) => _config.GetValue(key, false);
    }
}
