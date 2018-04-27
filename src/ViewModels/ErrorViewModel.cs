using System;
using System.Collections.Generic;
using System.Linq;

namespace GovUk.Education.SearchAndCompare.UI.ViewModels
{
    public class ErrorViewModel
    {
        public IList<ErrorMessage> Messages {get; set;} = new List<ErrorMessage>();

        public string ApplicableUriOrNull {get; set;} = null;
        public ErrorViewModel()
        {
        }

        public ErrorViewModel(string propertyName, string name, string error, string uri = null)
        {
            Messages = new List<ErrorMessage>();
            Messages.Add(new ErrorMessage(propertyName, name, error));
            ApplicableUriOrNull = uri;
        }

        public bool AppliesToUrl(string url)
        {
            return ApplicableUriOrNull == null || ApplicableUriOrNull == url;
        }

        public bool HasError(string propertyName)
        {
            return Messages.Any(x => x.Id == propertyName);
        }

        public ErrorMessage GetError(string propertyName)
        {
            return Messages.FirstOrDefault(x => x.Id == propertyName) ?? new ErrorMessage();
        }

        public static ErrorViewModel NewEmpty() => new ErrorViewModel();



        public class ErrorMessage
        {
            public string Id {get; set;}
            public string Name {get; set;}
            public string Message {get; set;}

            public ErrorMessage(string id, string name, string message)
            {
                Id = id;
                Name = name;
                Message = message;
            }

            public ErrorMessage()
            {
            }
        }
    }
}
