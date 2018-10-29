import uniqBy from "lodash.uniqby"

const toRadians = n => (n * Math.PI) / 180

// From here: https://www.movable-type.co.uk/scripts/latlong.html
const distanceBetweenLatLng = (lat1, lng1, lat2, lng2) => {
  var R = 6371e3 // Earth’s radius in metres.
  var φ1 = toRadians(lat1)
  var φ2 = toRadians(lat2)
  var Δφ = toRadians(lat2 - lat1)
  var Δλ = toRadians(lng2 - lng1)

  var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  var d = R * c
  return d
}

distanceBetweenLatLng(50.854259, 0.573453, 51.5001754, -0.1332326)

let numberOfPins = 0

const createPopupClass = () => {
  const panToWithOffset = function(map, latlng, offsetX, offsetY) {
    const ov = new google.maps.OverlayView()
    ov.onAdd = function() {
      const proj = this.getProjection()
      const aPoint = proj.fromLatLngToContainerPixel(latlng)
      aPoint.x = aPoint.x + offsetX
      aPoint.y = aPoint.y + offsetY
      map.panTo(proj.fromContainerPixelToLatLng(aPoint))
    }
    ov.draw = function() {}
    ov.setMap(map)
  }

  // Based on: https://developers.google.com/maps/documentation/javascript/examples/overlay-popup
  /**
   * A customized popup on the map.
   * @param {!google.maps.LatLng} position
   * @param {!Element} content
   * @constructor
   * @extends {google.maps.OverlayView}
   */
  const Popup = function(position, closedContent, openContent) {
    this.position = position
    const content = document.createElement("div")
    content.classList.add("popup-bubble-content")
    closedContent.classList.add("popup-bubble__closed-content")
    openContent.classList.add("popup-bubble__open-content")
    content.appendChild(closedContent)
    content.appendChild(openContent)

    var pixelOffset = document.createElement("div")
    pixelOffset.classList.add("popup-bubble-anchor")
    pixelOffset.appendChild(content)

    this.anchor = document.createElement("div")
    this.anchor.classList.add("popup-tip-anchor")
    this.anchor.classList.add("expanded-label")
    this.anchor.appendChild(pixelOffset)

    // Optionally stop clicks, etc., from bubbling up to the map.
    this.stopEventPropagation()

    closedContent.addEventListener("click", e => {
      panToWithOffset(this.getMap(), this.position, 0, -150)
      this.closeOpenPopups()
      this.anchor.classList.toggle("open")
      e.stopPropagation()
    })

    const $closeButton = openContent.querySelector(".popup-bubble__close")
    $closeButton.addEventListener("click", e => {
      this.closeOpenPopups()
    })
  }
  // NOTE: google.maps.OverlayView is only defined once the Maps API has
  // loaded. That is why Popup is defined inside createPopupClass().
  Popup.prototype = Object.create(google.maps.OverlayView.prototype)

  /** Called when the popup is added to the map. */
  Popup.prototype.onAdd = function() {
    this.getPanes().floatPane.appendChild(this.anchor)
  }

  /** Called when the popup is removed from the map. */
  Popup.prototype.onRemove = function() {
    if (this.anchor.parentElement) {
      this.anchor.parentElement.removeChild(this.anchor)
    }
  }

  /** Called when the popup needs to draw itself. */
  Popup.prototype.draw = function() {
    var zoom = this.getMap().getZoom()

    var divPosition = this.getProjection().fromLatLngToDivPixel(this.position)
    // Hide the popup when it is far out of view.
    var display = Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000 ? "block" : "none"

    const isZoomedIn = zoom > 13
    const tooManyPins = numberOfPins > 50
    const expandTheLabel = isZoomedIn || !tooManyPins
    if (expandTheLabel) {
      this.anchor.classList.add("expanded-label")
    } else {
      this.anchor.classList.remove("expanded-label")
    }
    if (display === "block") {
      this.anchor.style.left = divPosition.x + "px"
      this.anchor.style.top = divPosition.y + "px"
    }
    if (this.anchor.style.display !== display) {
      this.anchor.style.display = display
    }
  }

  Popup.prototype.closeOpenPopups = () => {
    const $anchors = document.querySelectorAll(".popup-tip-anchor.open")
    for (let i = 0; i < $anchors.length; i++) {
      $anchors[i].classList.remove("open")
    }
  }

  /** Stops clicks/drags from bubbling up to the map. */
  Popup.prototype.stopEventPropagation = function() {
    var anchor = this.anchor
    anchor.style.cursor = "auto"
    ;[("click", "dblclick", "contextmenu", "wheel", "mousedown", "touchstart", "pointerdown")].forEach(function(event) {
      anchor.addEventListener(event, function(e) {
        e.stopPropagation()
      })
    })
  }

  return Popup
}

const initGoogleMaps = () => {
  const Popup = createPopupClass()

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
    },
    styles: [
      {
        featureType: "poi.business",
        stylers: [
          {
            visibility: "off"
          }
        ]
      },
      {
        featureType: "poi.park",
        elementType: "labels.text",
        stylers: [
          {
            visibility: "off"
          }
        ]
      }
    ]
  })

  const textMarker = {
    url: "/images/map-marker-text.png",
    scaledSize: new google.maps.Size(60, 22),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(25, 10)
  }

  const locations = window.locations

  const postcodeRegex = /([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})/

  const foundPostcodes = new Set()
  const foundLocationsWithoutPostcode = new Set()

  const extractPostcodeIfExists = addressToUse => {
    const postcodeResults = postcodeRegex.exec(addressToUse)
    const postcode = (postcodeResults || []).filter(Boolean).shift()
    if (postcode) {
      foundPostcodes.add(postcode)
    } else {
      foundLocationsWithoutPostcode.add(addressToUse)
    }
    return postcode ? postcode.replace(" ", "") : null
  }

  // pins = {
  //   'lat,lng': {
  //       distance: meters,
  //       locations: []
  //   }
  // }
  const pins = locations.reduce((pins, location) => {
    const isCampus = location["is_campus_location"] === "true"
    const addressToUse = isCampus ? location["campus_address"] : location["course_contactAddress"]
    const postcode = extractPostcodeIfExists(addressToUse)
    const key = postcode || `${location.lat},${location.lng}`
    const pin = pins[key] || {}
    pin.distance = distanceBetweenLatLng(centerLat, centerLng, location.lat, location.lng) / 1609.344
    pin.locations = (pin.locations || []).concat([location])
    pin.providers = pin.providers || {}
    const currentProvider = location["provider_name"]
    pin.providers[currentProvider] = (pin.providers[currentProvider] || []).concat([location])
    pins[key] = pin
    return pins
  }, {})

  // pinsByProviders = {
  //   'lat,lng': {
  //       distance: meters,
  //       locations: []
  //   }
  // }

  console.log("pins", pins)
  console.log("sorted", Object.values(pins).sort((left, right) => left.distance - right.distance))
  console.log("foundPostcodes", foundPostcodes)
  console.log("foundLocationsWithoutPostcode", foundLocationsWithoutPostcode)

  Object.values(pins)
    .sort((left, right) => left.distance - right.distance)
    .forEach((pin, idx) => {
      if (pin.distance >= window.mapSettings.zoom) {
        return
      }
      numberOfPins++
      const lat = pin.locations[0].lat
      const lng = pin.locations[0].lng
      const latLng = new google.maps.LatLng(lat, lng)

      const closedContent = document.createElement("div")
      closedContent.innerHTML = `
        <span class="full-content">${
          Object.keys(pin.providers).length === 1
            ? Object.keys(pin.providers)[0]
            : `${Object.keys(pin.providers).length} providers`
        }</span>
        <span class="condensed-content">${
          Object.keys(pin.providers).length === 1
            ? Object.values(pin.providers)[0][0].url.split("/")[2]
            : `${Object.keys(pin.providers).length} providers`
        }</span>
      `

      const openContent = document.createElement("div")
      openContent.innerHTML = `
        ${Object.keys(pin.providers)
          .map(provider => {
            const sortedCourses = pin.providers[provider].sort(
              (c1, c2) => (c1["is_campus_location"] === "true" ? -1 : 1)
            )
            const courses = uniqBy(sortedCourses, course => course["url"])
            const campusLocation = courses.find(course => course["is_campus_location"] === "true")
            const showCampusName = campusLocation && campusLocation["campus_name"] !== "Main Site"
            const anyOfTheLocationsAreCampuses = !!campusLocation
            const firstCourse = courses[0]
            const firstCourseIsCampus = firstCourse["is_campus_location"] === "true"
            const address = firstCourseIsCampus ? firstCourse["campus_address"] : firstCourse["course_contactAddress"]

            return `
              <h3 class="govuk-heading-s">${provider} (${pin.providers[provider][0].url.split("/")[2]})</h3>
              <p class="govuk-body">
                ${pin.distance.toFixed(1)} ${pin.distance === 1 ? "mile" : "miles"} away
              </p>
              <p class="govuk-body">
                ${showCampusName ? `<span class="campus-name">${campusLocation["campus_name"]}</span><br />` : ""}
                <span class="address">${address}</span>
              </p>
              <ul class="govuk-list">
                ${courses
                  .map(
                    course => `
                    <li>
                      <a href="${course["url"]}" class="govuk-!-font-weight-bold">${course["course_name"]} ${
                      course["course_programmeCode"]
                    }</a><br>
                      ${course["qual"]}
                    </li>
                  `
                  )
                  .join("")}
              </ul>
            `
          })
          .join("<hr class='govuk-section-break--m'>")}
        <button class="popup-bubble__close">&times;<span class="govuk-visually-hidden">Close this popup</span></button>
      `
      // <ul class="govuk-list">
      //   ${pin.locations
      //     .map(
      //       location => `
      //       <li>distance: ${location["distance"]}</li>
      //       <li>course_name: ${location["course_name"]}</li>
      //       <li>course_programmeCode: ${location["course_programmeCode"]}</li>
      //       <li>qual: ${location["qual"]}</li>
      //       <li>url: ${location["url"]}</li>
      //       <li>is_provider_location: ${location["is_provider_location"]}</li>
      //       <li>is_campus_location: ${location["is_campus_location"]}</li>
      //       <li>campus_name: ${location["campus_name"]}</li>
      //       <li>provider_name: ${location["provider_name"]}</li>
      //     `
      //     )
      //     .join("")}
      // </ul>

      const popup = new Popup(latLng, closedContent, openContent)
      popup.setMap(map)

      // Extend the bounds by the first 5 locations so we get a decent number as part of the first view.
      if (idx < 5) {
        bounds.extend(latLng)
      }
    })

  console.log("numberOfPins", numberOfPins)

  for (let i = 0, length = locations.length; false; i++) {
    const data = locations[i]
    const latLng = new google.maps.LatLng(data.lat, data.lng)

    const closedContent = document.createElement("div")
    closedContent.innerHTML = data["provider_name"]

    const openContent = document.createElement("div")
    openContent.innerHTML = `
      <h3 class="govuk-heading-s">${data["provider_name"]}</h3>
      <ul class="govuk-list">
        <li>${data["course_name"]}</li>
        <li>${data["course_programmeCode"]}</li>
        <li>${data["qual"]}</li>
        <li>${data["url"]}</li>
        <li>Provider: ${data["is_provider_location"]}</li>
        <li>Campus: ${data["is_campus_location"]}</li>
        <li>campus_name: ${data["campus_name"]}</li>
      </ul>
      <button class="popup-bubble__close">&times;<span class="govuk-visually-hidden">Close this popup</span></button>
    `

    const popup = new Popup(latLng, closedContent, openContent)
    popup.setMap(map)

    // Extend the bounds by the first 5 locations so we get a decent number as part of the first view.
    if (i < 5) {
      bounds.extend(latLng)
    }
  }

  // Add marker for search location
  new google.maps.Marker({
    position: map.getCenter(),
    map: map
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

  if (locations.length > 1) {
    map.fitBounds(bounds)
    map.panTo(new google.maps.LatLng(centerLat, centerLng))
  }

  const $courseLinks = document.querySelectorAll(".map-course-link")
  Array.from($courseLinks).forEach($link => {
    $link.addEventListener("click", evt => {
      evt.preventDefault()
      const href = evt.target.href
      const popupLink = document.querySelector(`.popup-bubble-content [href="${"/course" + href.split("course")[1]}"]`)
      // ⚠️ PROTOTYPE CODE QUARANTINE ZONE ️️⚠️
      popupLink.parentElement.parentElement.parentElement.parentElement
        .querySelector(".popup-bubble__closed-content")
        .dispatchEvent(new Event("click"))
    })
  })
}

export default initGoogleMaps
