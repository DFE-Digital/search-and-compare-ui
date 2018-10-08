using System;
using System.Net;
using System.Linq;
using GovUk.Education.SearchAndCompare.UI.Services;
using Microsoft.ApplicationInsights;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.Extensions.Logging;
using GovUk.Education.SearchAndCompare.Domain.Client;

namespace GovUk.Education.SearchAndCompare.UI.ActionFilters
{
    public class SearchAndCompareApiExceptionFilter : IExceptionFilter
    {
        private readonly ILogger _logger;

        public SearchAndCompareApiExceptionFilter(ILogger<SearchAndCompareApiExceptionFilter> logger)
        {
            _logger = logger;
        }

        public void OnException(ExceptionContext context)
        {

           var searchAndCompareApiException = GetSearchAndCompareApiException(context.Exception);
            if (searchAndCompareApiException != null)
            {
                _logger.LogCritical(searchAndCompareApiException, "Failed to connect to Search and Compare API");
                context.Result = new StatusCodeResult(503);
                context.ExceptionHandled = true;
            } else {
                _logger.LogError(context.Exception, "Unhandled exception");
            }

            new TelemetryClient().TrackException(context.Exception);
        }

        private SearchAndCompareApiException GetSearchAndCompareApiException(Exception exception)
        {
            SearchAndCompareApiException result = exception as SearchAndCompareApiException;

            if(result == null)
            {
                var aggregateException = exception as AggregateException;
                if(aggregateException != null)
                {
                    result = aggregateException.InnerExceptions.FirstOrDefault(x => x is SearchAndCompareApiException) as SearchAndCompareApiException;
                }
            }

            return result;
        }
    }
}
