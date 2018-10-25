const createPopupClass = () => {
  const panToWithOffset = function(map, latlng, offsetX, offsetY) {
    var ov = new google.maps.OverlayView()
    ov.onAdd = function() {
      var proj = this.getProjection()
      var aPoint = proj.fromLatLngToContainerPixel(latlng)
      aPoint.x = aPoint.x + offsetX
      aPoint.y = aPoint.y + offsetY
      map.panTo(proj.fromContainerPixelToLatLng(aPoint))
    }
    ov.draw = function() {}
    ov.setMap(map)
  }

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
      console.log("hello", e)
      this.closeOpenPopups()
    })
  }
  // NOTE: google.maps.OverlayView is only defined once the Maps API has
  // loaded. That is why Popup is defined inside initMap().
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
    var divPosition = this.getProjection().fromLatLngToDivPixel(this.position)
    // Hide the popup when it is far out of view.
    var display = Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000 ? "block" : "none"

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
        console.log(event, e)
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
    }
  })

  const textMarker = {
    url: "/images/map-marker-text.png",
    scaledSize: new google.maps.Size(60, 22),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(25, 10)
  }

  const locations = window.locations

  for (let i = 0, length = locations.length; i < length; i++) {
    const data = locations[i]
    const latLng = new google.maps.LatLng(data.lat, data.lng)

    const closedContent = document.createElement("div")
    closedContent.innerHTML = data.title

    const openContent = document.createElement("div")
    openContent.innerHTML = `
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
      <button class="popup-bubble__close">&times;<span class="govuk-visually-hidden">Close this popup</span></button>
    `

    const popup = new Popup(latLng, closedContent, openContent)
    popup.setMap(map)

    // Extend the bounds by the first 10 locations so we get a decent number as part of the first view.
    if (i < 10) {
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
}

export default initGoogleMaps
