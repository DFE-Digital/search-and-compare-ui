namespace GovUk.Education.SearchAndCompare.UI.Services.Maps.Models
{
    public interface IHtmlArea
    {
        string Shape { get; }

        string Coords { get; }

        string Href { get; }

        string Alt { get; set; }

        string Label { get; set; }
    }
}