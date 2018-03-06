using System;
using System.Collections.Generic;
using System.Linq;
using GovUk.Education.SearchAndCompare.Domain.Models;
using GovUk.Education.SearchAndCompare.UI.Services.Maps.Models;

namespace GovUk.Education.SearchAndCompare.UI.Services.Maps
{
    public class MapProjection<T> : IMapProjection<T> where T: IMapMarker
    {
        private int _pinRadius = 9;

        private int _pinOffset = 26;

        private int _maxZoomLevel = 22;

        private int _defaultWidth = 640;

        private int _defaultHeight = 640;

        private string alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        private Coordinates _centre;

        private Coordinates _centreOffset = new Coordinates(0, 0);

        private IEnumerable<T> _markers;

        public int ZoomLevel { get; set; }

        public int Width { get; set; }

        public int Height { get; set; }

        public Coordinates MyLocation { get; set; }

        public Coordinates Centre
        {
            get { return _centreOffset + _centre; }
            set { _centre = value; }
        }

        public WorldCoordinates WorldCentre
        {
            get { return new WorldCoordinates(Centre); }
        }

        public PixelCoordinates PixelCentre
        {
            get { return GetPixelCentre(ZoomLevel); }
        }

        public bool HasPreviousZoomLevel
        {
            get { return (ZoomLevel > 0); }
        }

        public int PreviousZoomLevel
        {
            get { return (Math.Max(ZoomLevel - 1, 0)); }
        }

        public bool HasNextZoomLevel
        {
            get { return (ZoomLevel < _maxZoomLevel); }
        }

        public int NextZoomLevel
        {
            get { return (Math.Min(ZoomLevel + 1, _maxZoomLevel)); }
        }

        public MapProjection(IEnumerable<T> markers, Coordinates myLocation, int? height, int? zoomLevel)
        {
            _markers = markers;
            MyLocation = myLocation;
            Centre = CalculateMapCentre(markers);
            Width = _defaultWidth;
            Height = height ?? _defaultHeight;
            ZoomLevel = zoomLevel?? FitZoomLevel(markers);
        }

        public IEnumerable<T> MarkersWithAreas
        {
            get
            {
                _markers.Zip(LabelsFromString(alphabet), (m, l) => new { Marker = m, Label = l }).ToList()
                    .ForEach(ml => AddMapMarker(ml.Marker, ml.Label));
                return _markers;
            }
        }

        public IHtmlArea MyLocationArea
        {
            get { return AreaFromCoordinates(MyLocation, ""); }
        }

        private void AddMapMarker(IMapMarker marker, char? label)
        {
            marker.Area = AreaFromCoordinates(marker.Coordinates, string.Format("{0}", label?? '.'));
        }

        private IHtmlArea AreaFromCoordinates(Coordinates coordinates, string name)
        {
            var markerPixelCoords = GetMarkerPixelCoordinates(coordinates, ZoomLevel);

            var area = new CircleArea(
                name,
                (int)(Math.Round(markerPixelCoords.X)),
                (int)(Math.Round(markerPixelCoords.Y)) - _pinOffset,
                _pinRadius);

            return area;
        }

        private PixelCoordinates GetPixelCentre(int zoomLevel)
        {
            return new PixelCoordinates(Width / 2, Height / 2, zoomLevel);
        }

        private PixelCoordinates GetMarkerPixelCoordinates(Coordinates coordinates, int zoomLevel)
        {
            var worldCoords = new WorldCoordinates(coordinates);

            var deltaFromCentre = worldCoords - WorldCentre;

            var pixelDeltaFromCentre = new PixelCoordinates(deltaFromCentre, zoomLevel);

            return GetPixelCentre(zoomLevel) + pixelDeltaFromCentre;
        }

        private bool IsInsideMap(PixelCoordinates pixelCoordinates)
        {
            return pixelCoordinates.X < (Width - _pinRadius)
                && pixelCoordinates.X > _pinRadius
                && pixelCoordinates.Y < Height
                && pixelCoordinates.Y > (_pinRadius * 2 + _pinOffset);
        }

        private int FitZoomLevel(IEnumerable<T> markers)
        {
            // Find max and min coords in pixel space at a given zoom level
            // Determine if these fall within +/- size of map in pixels
            // If they do, iterate to next smallest zoom level & check again
            var minCoords = new Coordinates(
                markers.Min(x => x.Coordinates.Latitude),
                markers.Min(x => x.Coordinates.Longitude));
            var maxCoords = new Coordinates(
                markers.Max(x => x.Coordinates.Latitude),
                markers.Max(x => x.Coordinates.Longitude));

            var zoomLevel = 0;

            PixelCoordinates minPixelCoordinates;
            PixelCoordinates maxPixelCoordinates;

            do
            {
                minPixelCoordinates = GetMarkerPixelCoordinates(minCoords, zoomLevel);
                maxPixelCoordinates = GetMarkerPixelCoordinates(maxCoords, zoomLevel);
                if (!IsInsideMap(minPixelCoordinates) || !IsInsideMap(maxPixelCoordinates))
                {
                    return zoomLevel - 1;
                }
                zoomLevel++;
            }
            while (zoomLevel < _maxZoomLevel);

            return zoomLevel;
        }

        private IEnumerable<char> LabelsFromString(string alphabet)
        {
            for (int i = 0; i < alphabet.Length; i++)
            {
                yield return alphabet[i];
            }
            while (true)
            {
                yield return '-';
            }
        }

        private Coordinates CalculateMapCentre(IEnumerable<T> markerCoordinates)
        {
            // Halfway between minimum and maximum
            var minLatitude = markerCoordinates.Min(x => x.Coordinates.Latitude);
            var maxLatitude = markerCoordinates.Max(x => x.Coordinates.Latitude);
            var centreLatitude = minLatitude + (maxLatitude - minLatitude) / 2;

            var minLongitude = markerCoordinates.Min(x => x.Coordinates.Longitude);
            var maxLongitude = markerCoordinates.Max(x => x.Coordinates.Longitude);
            var centreLongitude = minLongitude + (maxLongitude - minLongitude) / 2;

            return new Coordinates(centreLatitude, centreLongitude);
        }
    }
}