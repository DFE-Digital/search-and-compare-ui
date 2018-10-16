const initGoogleMaps = () => {
  let $zoomLevel
  switch (window.map_settings[0].zoom) {
    case 5:
      $zoomLevel = 12;
      break
    case 10:
      $zoomLevel = 11;
      break
    case 20:
      $zoomLevel = 10;
      break
    case 50:
      $zoomLevel = 9;
      break
    case 100:
      $zoomLevel = 8;
  }

  const map = new google.maps.Map(document.getElementById('map'), {
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: true,
    fullscreenControlOptions: {
      position: google.maps.ControlPosition.RIGHT_BOTTOM
    },
    zoom: $zoomLevel,
    center: {
      lat: window.map_settings[0].search_lat,
      lng: window.map_settings[0].search_lng
    }
  })

  const customMarker = {
    url: '/images/map-marker.png',
    scaledSize: new google.maps.Size(20, 32),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(0, 32)
  }

  const customMarker2 = {
    url: '/images/map-marker-default.png',
    scaledSize: new google.maps.Size(20, 32),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(0, 32)
  }

  const customMarker3 = {
    url: '/images/text-map-marker.png',
    scaledSize: new google.maps.Size(60, 22),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(25, 10)
  }

  const courses = window.courses
  const infoWindow = new google.maps.InfoWindow()
  const markers = []

  for (let i = 0; i < courses.length; i++) {
    const course = courses[i]

    for (let j = 0; j < course.campuses.length; j++) {
      const campus = course.campuses[j]
      if (campus.lat.length > 1) {
        var latLng = new google.maps.LatLng(campus.lat, campus.lng)
      } else {
        var latLng = new google.maps.LatLng(course.provider[0].lat, course.provider[0].lng)
      }

      const marker = new google.maps.Marker({
        position: latLng,
        map,
        title: campus.name,
        icon: customMarker
      });

      (((marker, campus) => {
        google.maps.event.addListener(marker, 'click', e => {
          const windowsContent = `
            <div class="search-info-window">
              <h3 class="govuk-heading-s">
                <a href="${course.url}">${course.name} with ${course.provider[0].name}</a>
              </h3>
              <p class="govuk-body">Location: <br>${course.address}</p>
              <p class="govuk-body">Course offered:<br>${course.qual}</p>
              <p class="govuk-body">Financial support:<br>${course.finance}</p>
            </div>
          `

          infoWindow.setContent(windowsContent)
          infoWindow.setOptions({maxWidth:250})
          infoWindow.open(map, marker)
        })
      }))(marker, campus)

      markers.push(marker)
    }
  }

  // Add marker for search location
  const marker = new google.maps.Marker({
    position: map.getCenter(),
    map: map,
    icon: customMarker2
  });

  // 5 miles, 10 miles, 20 miles
  const $earthRadiusMiles = 3963.1676
  const $earthRadiusMeters = 6378100
  const $circles = [5, 10, 20]
  for (let i = 0; i < $circles.length; i++) {
    const radiusCircle = new google.maps.Circle({
      strokeColor: '#000000',
      strokeOpacity: 0.3,
      strokeWeight: 1,
      fillOpacity: 0,
      map: map,
      center: map.getCenter(),
      radius: ($circles[i] / $earthRadiusMiles) * $earthRadiusMeters
    })

    new google.maps.Marker({
      position: new google.maps.LatLng((window.map_settings[0].search_lat + ($circles[i] * 1.609/111.111)), window.map_settings[0].search_lng),
      map: map,
      icon: customMarker3,
      label: `${$circles[i]} miles`
    })
  }

  const $icons = {
    search_location: {
      name: 'Your location',
      icon: '/images/map-marker-default.png'
    },
    campus: {
      name: 'Training locations',
      icon: '/images/map-marker.png'
    }
  };

  const legend = document.getElementById('legend');
  const legendList = legend.querySelector('ul');
  for (let key in $icons) {
    var type = $icons[key];
    var name = type.name;
    var icon = type.icon;
    var listItem = document.createElement('li');
    listItem.innerHTML = '<img width="20" src="' + icon + '"> ' + name;
    legendList.appendChild(listItem);
  }

  map.controls[google.maps.ControlPosition.RIGHT_TOP].push(legend);
}

window.initGoogleMaps = initGoogleMaps
