namespace GovUk.Education.SearchAndCompare.UI.Services
{
    public class AnalyticsPolicy 
    {
        private bool _yesNo;

        private AnalyticsPolicy(bool yesNo)
        {
            _yesNo = yesNo;            
        }
        bool ShouldUseAnalytics => _yesNo;

        public static readonly AnalyticsPolicy Yes = new AnalyticsPolicy(true); 
        public static readonly AnalyticsPolicy No = new AnalyticsPolicy(false);
        public static AnalyticsPolicy FromEnv() => Yes; //System.Environment.GetEnvironmentVariable("ENABLE_GOOGLE_ANALYTICS") != null ? Yes : No; 
    }
}
