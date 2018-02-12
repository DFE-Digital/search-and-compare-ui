namespace GovUk.Education.SearchAndCompare.UI.ViewModels.Enums
{
    public static class RadiusOptionExtensions
    {
        public static double ToMetres(this RadiusOption radiusOption)
        {
            return 1.60934 * 1000 * ((int) radiusOption);
        }
    }
}