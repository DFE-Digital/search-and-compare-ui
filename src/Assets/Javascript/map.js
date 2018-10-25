import MarkerWithLabelFactory from "markerwithlabel"

const initGoogleMaps = () => {
  const MarkerWithLabel = MarkerWithLabelFactory(google.maps)

  const bounds = new google.maps.LatLngBounds()

  let $zoomLevel
  switch (window.mapSettings.zoom) {
    case 5:
      $zoomLevel = 12
      break
    case 10:
      $zoomLevel = 11
      break
    case 20:
      $zoomLevel = 10
      break
    case 50:
      $zoomLevel = 9
      break
    case 100:
      $zoomLevel = 8
  }

  const centerLat = window.mapSettings.search_lat
  const centerLng = window.mapSettings.search_lng

  const map = new google.maps.Map(document.getElementById("map"), {
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
      lat: centerLat,
      lng: centerLng
    }
  })

  const searchMarker = {
    url: "/images/map-marker-red.png",
    scaledSize: new google.maps.Size(30, 44),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(12, 32)
  }

  const textMarker = {
    url: "/images/map-marker-text.png",
    scaledSize: new google.maps.Size(60, 22),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(25, 10)
  }

  const locations = window.locations
  const infoWindow = new google.maps.InfoWindow()

  google.maps.event.addListener(map, "click", function() {
    infoWindow.close()
  })

  for (let i = 0, length = locations.length; i < length; i++) {
    const data = locations[i]
    const latLng = new google.maps.LatLng(data.lat, data.lng)

    const marker = new MarkerWithLabel({
      map,
      position: latLng,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 0.1
      },
      title: data.title,
      labelContent: data.title,
      labelAnchor: new google.maps.Point(52, 20),
      labelClass: "map-marker-label"
    })
    ;((marker, data) => {
      google.maps.event.addListener(marker, "click", e => {
        const windowsContent = `
          <div class="search-info-window">
            ${
              data.no_of_courses > 1
                ? `<h3 class="govuk-heading-s">${data.title}</h3>`
                : `<h3 class="govuk-heading-s">${data.courses[0].name} with ${data.title}</h3>`
            }
            ${data.no_of_courses > 1 ? `<h4 class="govuk-heading-s">${data.no_of_courses} courses</h4>` : ""}
            <ul class="govuk-list">
              ${data.courses
                .map(
                  course =>
                    `<li>
                  <a href="${course.url}">${course.name} (${course.code})</a>
                  <br>
                  ${course.qual}
                </li>`
                )
                .join("")}
            </ul>
          </div>
        `

        infoWindow.setContent(windowsContent)
        infoWindow.setOptions({ maxWidth: 250 })
        infoWindow.open(map, marker)
      })
    })(marker, data)

    // Extend the bounds by the first 10 locations so we get a decent number as part of the first view.
    if (i < 10) {
      bounds.extend(latLng)
    }
  }

  // Add marker for search location
  new google.maps.Marker({
    position: map.getCenter(),
    map: map,
    icon: searchMarker
  })

  // 5 miles, 10 miles, 20 miles
  const $earthRadiusMiles = 3963.1676
  const $earthRadiusMeters = 6378100
  const $circles = [5, 10, 20]
  for (let i = 0; i < $circles.length; i++) {
    new google.maps.Circle({
      strokeColor: "#000000",
      strokeOpacity: 0.3,
      strokeWeight: 1,
      fillOpacity: 0,
      map: map,
      center: map.getCenter(),
      radius: ($circles[i] / $earthRadiusMiles) * $earthRadiusMeters
    })

    // Add label for each radius
    // https://stackoverflow.com/questions/7477003/calculating-new-longitude-latitude-from-old-n-meters
    new google.maps.Marker({
      position: new google.maps.LatLng(
        window.mapSettings.search_lat + ($circles[i] * 1.609) / 111.111,
        window.mapSettings.search_lng
      ),
      map: map,
      icon: textMarker,
      label: `${$circles[i]} miles`,
      zIndex: 1
    })
  }

  const $icons = {
    search_location: {
      name: "Your location",
      icon: searchMarker.url
    }
  }

  const legend = document.getElementById("legend")
  const legendList = legend.querySelector("ul")
  for (let key in $icons) {
    var type = $icons[key]
    var name = type.name
    var icon = type.icon
    var listItem = document.createElement("li")
    listItem.innerHTML = `<img width="20" src="${icon}"> ${name}`
    legendList.appendChild(listItem)
  }

  map.controls[google.maps.ControlPosition.RIGHT_TOP].push(legend)

  if (locations.length > 1) {
    map.fitBounds(bounds)
    map.panTo(new google.maps.LatLng(centerLat, centerLng))
  }
}

export default initGoogleMaps
