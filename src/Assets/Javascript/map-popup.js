const createPopupClass = () => {
  const panToWithOffset = function(map, latlng, offsetX, offsetY) {
    const ov = new google.maps.OverlayView();
    ov.onAdd = function() {
      const proj = this.getProjection();
      const aPoint = proj.fromLatLngToContainerPixel(latlng);
      aPoint.x = aPoint.x + offsetX;
      aPoint.y = aPoint.y + offsetY;
      map.panTo(proj.fromContainerPixelToLatLng(aPoint));
    };
    ov.draw = function() {};
    ov.setMap(map);
  };

  // Based on: https://developers.google.com/maps/documentation/javascript/examples/overlay-popup
  const Popup = function(position, closedContent, openContent) {
    this.position = position;
    const content = document.createElement("div");
    content.classList.add("popup-bubble-content");
    closedContent.classList.add("popup-bubble__closed-content");
    openContent.classList.add("popup-bubble__open-content");
    openContent.insertAdjacentHTML(
      "beforeend",
      '<button class="popup-bubble__close">&times;<span class="govuk-visually-hidden">Close this popup</span></button>'
    );
    content.appendChild(closedContent);
    content.appendChild(openContent);

    var pixelOffset = document.createElement("div");
    pixelOffset.classList.add("popup-bubble-anchor");
    pixelOffset.appendChild(content);

    this.anchor = document.createElement("div");
    this.anchor.classList.add("popup-tip-anchor");
    this.anchor.appendChild(pixelOffset);

    this.stopEventPropagation();

    closedContent.addEventListener("click", e => {
      panToWithOffset(this.getMap(), this.position, 0, -150);
      this.closeOpenPopups();
      this.anchor.classList.toggle("open");
      e.stopPropagation();
    });

    const $closeButton = openContent.querySelector(".popup-bubble__close");
    $closeButton.addEventListener("click", e => {
      this.closeOpenPopups();
    });
  };
  // NOTE: google.maps.OverlayView is only defined once the Maps API has
  // loaded. That is why Popup is defined inside createPopupClass().
  Popup.prototype = Object.create(google.maps.OverlayView.prototype);

  // Called when the popup is added to the map.
  Popup.prototype.onAdd = function() {
    this.getPanes().floatPane.appendChild(this.anchor);
  };

  // Called when the popup is removed from the map.
  Popup.prototype.onRemove = function() {
    if (this.anchor.parentElement) {
      this.anchor.parentElement.removeChild(this.anchor);
    }
  };

  // Called when the popup needs to draw itself.
  Popup.prototype.draw = function() {
    var divPosition = this.getProjection().fromLatLngToDivPixel(this.position);
    // Hide the popup when it is far out of view.
    var display = Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000 ? "block" : "none";

    if (display === "block") {
      this.anchor.style.left = divPosition.x + "px";
      this.anchor.style.top = divPosition.y + "px";
    }
    if (this.anchor.style.display !== display) {
      this.anchor.style.display = display;
    }
  };

  Popup.prototype.closeOpenPopups = () => {
    const $anchors = document.querySelectorAll(".popup-tip-anchor.open");
    for (let i = 0; i < $anchors.length; i++) {
      $anchors[i].classList.remove("open");
    }
  };

  // Stops clicks/drags from bubbling up to the map.
  Popup.prototype.stopEventPropagation = function() {
    var anchor = this.anchor;
    anchor.style.cursor = "auto";
    [("click", "dblclick", "contextmenu", "wheel", "mousedown", "touchstart", "pointerdown")].forEach(function(event) {
      anchor.addEventListener(event, function(e) {
        e.stopPropagation();
      });
    });
  };

  return Popup;
};

export default createPopupClass;
