import { initAll } from "govuk-frontend";
import CookieMessage from "./Javascript/cookie-message";
import BackLink from "./Javascript/back-link";
import Toggle from "./Javascript/toggle";
import { initFormAnalytics, initExternalLinkAnalytics, initNavigationAnalytics } from "./Javascript/analytics.js";
import ScrollTracking from "./Javascript/scroll-tracking";
import CopyTracking from "./Javascript/copy-tracking";
import NoResultsTracking from "./Javascript/no-results-tracking";
import initAutocomplete from "./Javascript/autocomplete";
import initGoogleMaps from "./Javascript/map.js";
import initLocationsMap from "./Javascript/locations-map";
import "./Styles/site.scss";

initAll();

window.initGoogleMaps = initGoogleMaps;
window.initLocationsMap = initLocationsMap;

const $cookieMessage = document.querySelector('[data-module="cookie-message"]');
new CookieMessage($cookieMessage).init();

const $backLink = document.querySelector('[data-module="back-link"]');
new BackLink($backLink).init();

const $toggle = document.querySelectorAll('[data-module="toggle"]');
for (let i = $toggle.length - 1; i >= 0; i--) {
  new Toggle($toggle[i]).init();
}

try {
  const $locationAutocomplete = document.getElementById("location-autocomplete");
  const $locationInput = document.getElementById("location");
  if ($locationAutocomplete) {
    initAutocomplete($locationAutocomplete, $locationInput);
  }
} catch (err) {
  console.error("Failed to initialise location autocomplete:", err);
}

try {
  const $providerAutocomplete = document.getElementById("provider-autocomplete");
  const $providerInput = document.getElementById("provider");
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

  const $page = document.querySelector('[data-module*="ga-track"]');
  new ScrollTracking($page).init();
  new CopyTracking($page).init();

  const $searchInput = document.querySelector('[data-module="track-no-provider-results"]');
  new NoResultsTracking($searchInput).init();
} else {
  /* istanbul ignore next */
  console.log("Google Analytics `window.ga` object not found. Skipping analytics.");
}

/* istanbul ignore next */
if (process.env.NODE_ENV == "development") {
  module.hot.accept();
}
