const initLocationsMap = () => {
  const locations = window.trainingLocations
  const bounds = new google.maps.LatLngBounds()
  const infoWindow = new google.maps.InfoWindow()
  const markers = []

  const locationMarker = {
    url: '/images/map-marker-black.png',
    scaledSize: new google.maps.Size(20, 32),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(0, 32)
  }

  const map = new google.maps.Map(document.getElementById('locations-map'), {
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: true,
    fullscreenControlOptions: {
      position: google.maps.ControlPosition.RIGHT_BOTTOM
    },
    zoom: 11,
    center: {
      lat: locations[0].lat,
      lng: locations[0].lng
    }
  })

  google.maps.event.addListener(map, 'click', function () {
    infoWindow.close()
  })

  for (let i = 0, length = locations.length; i < length; i++) {
    const location = locations[i]
    const latLng = new google.maps.LatLng(location.lat, location.lng)

    const marker = new google.maps.Marker({
      position: latLng,
      map,
      title: location.name,
      icon: locationMarker,
      zIndex: 2
    });

    (((marker, location) => {
      google.maps.event.addListener(marker, 'click', e => {
        const windowsContent = `
          <div class="search-info-window">
            <h3 class="govuk-heading-s">${location.name} ${ location.code ? `(${location.code})` : '' }</h3>
            ${ location.address ? `<p class="govuk-body">Address: ${location.address}</p>` : '' }
          </div>
        `
        infoWindow.setContent(windowsContent)
        infoWindow.setOptions({maxWidth:250})
        infoWindow.open(map, marker)
      })
    }))(marker, location)

    bounds.extend(latLng)
    markers.push(marker)
  }

  // Use provider address to center and zoom when only one location
  if (locations.length > 1) {
    map.fitBounds(bounds)
    map.panToBounds(bounds)
  }
}

export default initLocationsMap
