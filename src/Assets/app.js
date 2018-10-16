import { initAll } from "govuk-frontend"
import CookieMessage from "./Javascript/cookie-message"
import BackLink from "./Javascript/back-link"
import Accordion from "./Javascript/accordion"
import Toggle from "./Javascript/toggle"
import { initFormAnalytics, initExternalLinkAnalytics, initNavigationAnalytics } from "./Javascript/analytics.js"
import "./Javascript/map.js"
import "./Styles/site.scss"

initAll()

var $cookieMessage = document.querySelector('[data-module="cookie-message"]')
new CookieMessage($cookieMessage).init()

var $backLink = document.querySelector('[data-module="back-link"]')
new BackLink($backLink).init()

var $accordions = document.querySelectorAll('[data-module="accordion"]')
for (var i = $accordions.length - 1; i >= 0; i--) {
  var $accordion = $accordions[i]
  var $sections = $accordion.querySelectorAll(".accordion-section")
  for (var j = $sections.length - 1; j >= 0; j--) {
    var $section = $sections[j]
    var sectionContainsCheckedCheckboxes = !!$section.querySelector('.govuk-checkboxes input[type="checkbox"]:checked')
    if (sectionContainsCheckedCheckboxes) {
      $section.classList.add("accordion-section--expanded")
    }
  }
  try {
    new Accordion($accordion).init()
  } catch (e) {
    for (var j = $sections.length - 1; j >= 0; j--) {
      var $section = $sections[j]
      $section.classList.remove("accordion-section--hidden")
      $section.classList.add("accordion-section--expanded")
    }
  }
}

var $toggle = document.querySelectorAll('[data-module="toggle"]')
for (var i = $toggle.length - 1; i >= 0; i--) {
  new Toggle($toggle[i]).init()
}

if (typeof ga !== "undefined") {
  initFormAnalytics()
  initExternalLinkAnalytics()
  initNavigationAnalytics()
} else {
  /* istanbul ignore next */
  console.log("Google Analytics `window.ga` object not found. Skipping analytics.")
}

/* istanbul ignore next */
if (process.env.NODE_ENV == "development") {
  module.hot.accept()
}
