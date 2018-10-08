﻿using System.Diagnostics;
using GovUk.Education.SearchAndCompare.UI.ViewModels;
using GovUk.Education.SearchAndCompare.UI.Services;
using Microsoft.AspNetCore.Mvc;
using GovUk.Education.SearchAndCompare.UI.ActionFilters;

using Microsoft.AspNetCore.Mvc.Filters;

namespace GovUk.Education.SearchAndCompare.UI.Controllers
{
    public class LegalController : Controller
    {
        [HttpGet("cookies")]
        public IActionResult Cookies()
        {
            return View();
        }

        [HttpGet("privacy-policy")]
        public IActionResult Privacy()
        {
            return View();
        }

        [HttpGet("terms-conditions")]
        public IActionResult TandC()
        {
            return View();
        }
    }
}
