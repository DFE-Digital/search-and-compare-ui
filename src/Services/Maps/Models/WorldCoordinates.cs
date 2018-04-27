using System;
using GovUk.Education.SearchAndCompare.Domain.Models;

namespace GovUk.Education.SearchAndCompare.UI.Services.Maps.Models
{
    public class WorldCoordinates
    {
        private int _tileSize = 256;

        public double X { get; set; }

        public double Y { get; set; }

        public WorldCoordinates(Coordinates coordinates)
        {
            X = LonToX(coordinates.Longitude);
            Y = LatToY(coordinates.Latitude);
        }

        private WorldCoordinates(double x, double y)
        {
            X = x;
            Y = y;
        }

        public static WorldCoordinates operator -(WorldCoordinates wc1, WorldCoordinates wc2)
        {
            return new WorldCoordinates(wc1.X - wc2.X, wc1.Y - wc2.Y);
        }

        private double LonToX(double longitude)
        {
            return (longitude + 180) / 360 * 256;
        }

        private double LatToY(double latitude)
        {
            return ((1 - Math.Log(
                Math.Tan(latitude * Math.PI / 180) + 1 / Math.Cos(latitude * Math.PI / 180)
                ) / Math.PI) / 2) * _tileSize;
        }
    }
}
