using System;

namespace GovUk.Education.SearchAndCompare.UI.Services.Maps.Models
{
    public class PixelCoordinates
    {
        public int ZoomLevel { get; private set; }

        public double X { get; set; }

        public double Y { get; set; }

        public PixelCoordinates(WorldCoordinates worldCoords, int zoomLevel)
        {
            ZoomLevel = zoomLevel;
            var multiplier = Math.Pow(2, zoomLevel);;
            X = worldCoords.X * multiplier;
            Y = worldCoords.Y * multiplier;
        }

        public PixelCoordinates(double x, double y, int zoomLevel)
        {
            X = x;
            Y = y;
            ZoomLevel = zoomLevel;
        }

        public static PixelCoordinates operator +(PixelCoordinates pc1, PixelCoordinates pc2)
        {
            if (pc1.ZoomLevel != pc2.ZoomLevel)
            {
                throw new Exception("Cannot add PixelCoordinates with different zoom levels");
            }
            return new PixelCoordinates(pc1.X + pc2.X, pc1.Y + pc2.Y, pc1.ZoomLevel);
        }
    }
}
