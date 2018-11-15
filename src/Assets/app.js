import { initAll } from "govuk-frontend";
import CookieMessage from "./Javascript/cookie-message";
import BackLink from "./Javascript/back-link";
import Accordion from "./Javascript/accordion";
import Toggle from "./Javascript/toggle";
import { initFormAnalytics, initExternalLinkAnalytics, initNavigationAnalytics } from "./Javascript/analytics.js";
import initAutocomplete from "./Javascript/autocomplete";
import initGoogleMaps from "./Javascript/map.js";
import initLocationsMap from "./Javascript/locations-map";
import "./Styles/site.scss";

initAll();

window.initGoogleMaps = initGoogleMaps;
window.initLocationsMap = initLocationsMap;

var $cookieMessage = document.querySelector('[data-module="cookie-message"]');
new CookieMessage($cookieMessage).init();

var $backLink = document.querySelector('[data-module="back-link"]');
new BackLink($backLink).init();

var $accordions = document.querySelectorAll('[data-module="accordion"]');
for (var i = $accordions.length - 1; i >= 0; i--) {
  var $accordion = $accordions[i];
  var $sections = $accordion.querySelectorAll(".accordion-section");
  for (var j = $sections.length - 1; j >= 0; j--) {
    var $section = $sections[j];
    var sectionContainsCheckedCheckboxes = !!$section.querySelector('.govuk-checkboxes input[type="checkbox"]:checked');
    if (sectionContainsCheckedCheckboxes) {
      $section.classList.add("accordion-section--expanded");
    }
  }
  try {
    new Accordion($accordion).init();
  } catch (e) {
    for (var j = $sections.length - 1; j >= 0; j--) {
      var $section = $sections[j];
      $section.classList.remove("accordion-section--hidden");
      $section.classList.add("accordion-section--expanded");
    }
  }
}

var $toggle = document.querySelectorAll('[data-module="toggle"]');
for (var i = $toggle.length - 1; i >= 0; i--) {
  new Toggle($toggle[i]).init();
}

try {
  var $locationAutocomplete = document.getElementById("location-autocomplete");
  var $locationInput = document.getElementById("location");
  if ($locationAutocomplete) {
    initAutocomplete($locationAutocomplete, $locationInput);
  }
} catch (err) {
  console.error("Failed to initialise location autocomplete:", err);
}

try {
  var $providerAutocomplete = document.getElementById("provider-autocomplete");
  var $providerInput = document.getElementById("query");
  if ($providerAutocomplete) {
    initAutocomplete($providerAutocomplete, $providerInput);
  }
} catch (err) {
  console.error("Failed to initialise provider autocomplete:", err);
}

if (typeof ga !== "undefined") {
  initFormAnalytics();
  initExternalLinkAnalytics();
  initNavigationAnalytics();
} else {
  /* istanbul ignore next */
  console.log("Google Analytics `window.ga` object not found. Skipping analytics.");
}

/* istanbul ignore next */
if (process.env.NODE_ENV == "development") {
  module.hot.accept();
}
