namespace GovUk.Education.SearchAndCompare.UI.Services.Maps.Models
{
    public class CircleArea : IHtmlArea
    {
        public string Shape { get { return "circle"; } }

        private int _x;

        private int _y;

        private int _r;

        public string Coords {
            get {
                return string.Format("{0},{1},{2}", _x, _y, _r);
            }
        }

        public string Href { get { return string.Format("result-{0}", Label); } }

        public string Alt { get; set; }

        public string Label { get; set; }

        public CircleArea(string label, int x, int y, int r)
        {
            Label = label;
            _x = x;
            _y = y;
            _r = r;
        }
    }
}
