using System;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using GovUk.Education.SearchAndCompare.UI.DatabaseAccess;
using GovUk.Education.SearchAndCompare.UI.Models;
using GovUk.Education.SearchAndCompare.UI;
using GovUk.Education.SearchAndCompare.UI.ViewModels;
using System.Collections.Generic;
using GovUk.Education.SearchAndCompare.UI.Services;
using GovUk.Education.SearchAndCompare.UI.ViewModels.Enums;

namespace GovUk.Education.SearchAndCompare.UI.Controllers
{

    //[Authorize]
    public class FilterController : Controller
    {
        private readonly ISearchAndCompareApi _api;

        private readonly IGeocoder _geocoder;

        public FilterController(ISearchAndCompareApi api, IGeocoder geocoder)
        {
            _api = api;
            _geocoder = geocoder;
        }

        [HttpPost("results/filter/sortby")]
        public IActionResult SortBy(ResultsFilter model)
        {
            return RedirectToAction("Index", "Results", model.ToRouteValues());
        }

        [HttpGet("results/filter/subject")]
        [ActionName("Subject")]
        public IActionResult SubjectGet(ResultsFilter model)
        {
            var subjectAreas = _api.GetSubjectAreas();

            var viewModel = new SubjectFilterViewModel {
                SubjectAreas = subjectAreas,
                FilterModel = model
            };
            
            return View(viewModel);
        }

        [HttpPost("results/filter/subject")]
        [ActionName("Subject")]
        public IActionResult SubjectPost(ResultsFilter model)
        {
            return RedirectToAction("Index", "Results", model.ToRouteValues());
        }

        [HttpGet("results/filter/location")]
        public IActionResult Location(ResultsFilter model)
        {
            return View(model);
        }

        [HttpPost("results/filter/location")]
        public async Task<IActionResult> Location(bool applyFilter, ResultsFilter model)
        {
            if (!applyFilter)
            {
                model.lat = null;
                model.lng = null;
                model.loc = null; 
                model.rad = null;
                model.page = null;
                return RedirectToAction("Index", "Results", model.ToRouteValues());
            }

            var coords = await _geocoder.ResolvePostCodeAsync(model.loc);
            if (coords == null) 
            {
                return RedirectToAction(nameof(Location));
            }
            else
            {
                model.lat = coords.Latitude;
                model.lng = coords.Longitude;
                model.loc = coords.FormattedLocation;
                model.page = null;
                model.sortby = (int)SortByOption.Distance;
            }

            return RedirectToAction("Index", "Results", model.ToRouteValues());
        }
    }
}
