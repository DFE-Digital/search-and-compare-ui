using System;
using Microsoft.AspNetCore.Mvc;

namespace GovUk.Education.SearchAndCompare.UI.Services
{
    public interface IRedirectUrlService
    {
        RedirectResult RedirectToNewApp(string path);
    }
}
