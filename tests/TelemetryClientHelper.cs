using System.Collections.Generic;
using GovUk.Education.SearchAndCompare.Domain.Client;
using GovUk.Education.SearchAndCompare.Domain.Models;
using GovUk.Education.SearchAndCompare.UI;
using GovUk.Education.SearchAndCompare.UI.Controllers;
using GovUk.Education.SearchAndCompare.UI.Filters;
using GovUk.Education.SearchAndCompare.UI.Services;
using GovUk.Education.SearchAndCompare.UI.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Moq;
using NUnit.Framework;
using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.Channel;
using Microsoft.ApplicationInsights.Extensibility;

namespace GovUk.Education.SearchAndCompare.UI.Unit
{
    public static class TelemetryClientHelper
    {
        public static TelemetryClient GetMocked()
        {
            var MockTelemetryChannel = new Mock<ITelemetryChannel>();

            TelemetryConfiguration configuration = new TelemetryConfiguration
            {
                TelemetryChannel = MockTelemetryChannel.Object,
                InstrumentationKey = "InstrumentationKey"
            };
            configuration.TelemetryInitializers.Add(new OperationCorrelationTelemetryInitializer());

            TelemetryClient telemetryClient = new TelemetryClient(configuration);

            return telemetryClient;
        }
    }
}
