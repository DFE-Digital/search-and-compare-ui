using System.Collections.Generic;
using GovUk.Education.SearchAndCompare.Domain.Models;

namespace GovUk.Education.SearchAndCompare.UI.Shared.Services
{
    public interface ICourseDetailsService
    {
        Course GetCourse(string providerCode, string courseCode);
        List<FeeCaps> GetFeeCaps();
    } 
}