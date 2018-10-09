const initGoogleMaps = () => {
  const map = new google.maps.Map(document.getElementById('map'), {
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: true
  })

  const customMarker = {
    url: '/images/map-marker.png',
    scaledSize: new google.maps.Size(20, 32),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(0, 32)
  }

  const locations = window.locations
  const infoWindow = new google.maps.InfoWindow()
  const bounds = new google.maps.LatLngBounds()
  const markers = []

  for (let i = 0, length = locations.length; i < length; i++) {
    const data = locations[i]
    const latLng = new google.maps.LatLng(data.lat, data.lng)

    const marker = new google.maps.Marker({
      position: latLng,
      map,
      title: data.title,
      icon: customMarker
    });

    (((marker, data) => {
      google.maps.event.addListener(marker, 'click', e => {
        const windowsContent = `
          <div class="search-info-window">
            <h4 class="govuk-heading-s">${data.title}</h4>
            <p class="govuk-body">${data.distance} away</p>
            ${ data.no_of_courses > 1 ? `<h5 class="govuk-heading-s">${data.no_of_courses} courses</h5>` : ''}
            <ul class="govuk-list">
              ${data.courses.map(course =>
                `<li>
                  <a href="${course.url}">${course.name}(${course.code})</a>
                  <br>
                  ${course.qual}
                </li>`
              ).join('')}
            </ul>
          </div>
        `

        infoWindow.setContent(windowsContent)
        infoWindow.setOptions({maxWidth:250})
        infoWindow.open(map, marker)
      })
    }))(marker, data)

    bounds.extend(latLng)
    markers.push(marker)
  }

  map.fitBounds(bounds)
  map.panToBounds(bounds)

  const markerCluster = new MarkerClusterer(map, markers, { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' })
}

window.initGoogleMaps = initGoogleMaps
