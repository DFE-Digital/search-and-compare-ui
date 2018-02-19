using GovUk.Education.SearchAndCompare.Domain.Filters.Enums;

namespace GovUk.Education.SearchAndCompare.UI.ViewModels.Enums
{
    public static class SortByOptionExtensions
    {
        public static string FormattedName(this SortByOption sortBy)
        {
            switch(sortBy)
            {
                case SortByOption.AtoZ:
                {
                    return "Alphabetical A-Z";
                }
                case SortByOption.ZtoA:
                {
                    return "Alphabetical Z-A";
                }
                case SortByOption.Distance:
                {
                    return "Distance";
                }
                default:
                {
                    return "";
                }
            }
        }
    }
}