﻿using System;
using System.Collections.Generic;
using System.Text;

namespace GovUk.Education.SearchAndCompare.UI.Shared.Features
{
    public interface IFeatureFlags
    {
        bool Apply2019 { get; }
        bool Maps { get; }
    }
}