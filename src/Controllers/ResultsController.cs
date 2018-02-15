using System;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using GovUk.Education.SearchAndCompare.UI.DatabaseAccess;
using GovUk.Education.SearchAndCompare.UI.Models;
using GovUk.Education.SearchAndCompare.UI;
using Microsoft.EntityFrameworkCore;
using GovUk.Education.SearchAndCompare.UI.ViewModels;
using GovUk.Education.SearchAndCompare.UI.ViewModels.Enums;
using System.Collections.Generic;

namespace GovUk.Education.SearchAndCompare.UI.Controllers
{
    //[Authorize]
    public class ResultsController : Controller
    {
        private int pageSize = 10;

        private readonly ISearchAndCompareApi _api;

        public ResultsController(ISearchAndCompareApi api)
        {
            _api = api;
        }

        [HttpGet("results")]
        public IActionResult Index(ResultsFilter filter)
        {
            var courses = _api.GetCourses(filter);

            var subjects = _api.GetSubjects(filter);

            var viewModel = new ResultsViewModel {
                Courses = courses,
                Subjects = subjects,
                FilterModel = filter
            };

            return View(viewModel);
        }

        [HttpGet("results/qualifications")]
        public IActionResult Qualifications(ResultsFilter model)
        {
            ViewData["Filter"] = model;
                        
            return View();
        }
    }
}
