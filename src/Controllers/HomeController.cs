﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GovUk.Education.SearchAndCompare.UI.Controllers
{
    public class HomeController : CommonAttributesControllerBase
    {
        private readonly SearchConfig _searchConfig;

        public HomeController(SearchConfig searchConfig)
        {
            _searchConfig = searchConfig;
        }

        [HttpGet("")]
        [HttpGet("home")]
        [HttpGet("home/index")]
        public IActionResult Index()
        {
            // Before launch we don't have a gov.uk start page, so use our own.
            if (_searchConfig.PreLaunchMode)
            {
                return View("Index");
            }

            // After launch there will be a gov.uk start page, so bounce users past ours and on to the location search
            const bool hideBack = true;
            return RedirectToAction("LocationWizard", "Filter", new { hideBack });

        }

        [AllowAnonymous]
        public IActionResult Error()
        {
            return StatusCode(500);
        }
    }
}
