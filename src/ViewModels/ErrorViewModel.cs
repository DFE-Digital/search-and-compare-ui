using System;
using System.Collections.Generic;

namespace GovUk.Education.SearchAndCompare.UI.ViewModels
{
    public class ErrorViewModel
    {
        public IEnumerable<string> Messages {get;}

        public ErrorViewModel(string error)
        {
            Messages = new List<string>{error};
        }
    }
}