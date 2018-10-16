import { initAll } from "govuk-frontend"
import CookieMessage from "./Javascript/cookie-message"
import BackLink from "./Javascript/back-link"
import Accordion from "./Javascript/accordion"
import Toggle from "./Javascript/toggle"
import { initFormAnalytics, initExternalLinkAnalytics, initNavigationAnalytics } from "./Javascript/analytics.js"

jest.mock("govuk-frontend")
jest.mock("./Javascript/cookie-message")
jest.mock("./Javascript/back-link")
jest.mock("./Javascript/accordion")
jest.mock("./Javascript/toggle")

describe("App", () => {
  beforeAll(() => {
    document.body.innerHTML = `
<div>
  <div data-module="cookie-message"></div>
  <div data-module="back-link"></div>
  <div data-module="accordion">
    <div class="accordion-section">
      <div class="govuk-checkboxes">
        <input type="checkbox" checked>
      </div>
    </div>
  </div>
  <div data-module="toggle"></div>
  <input class="typeahead">
</div>
`

    require("./app")
  })

  describe("initialising the app", () => {
    it("should initialise govuk-frontend", () => {
      expect(initAll).toHaveBeenCalled()
    })

    it("should initialise CookieMessage", () => {
      expect(CookieMessage).toHaveBeenCalled()
    })

    it("should initialise BackLink", () => {
      expect(BackLink).toHaveBeenCalled()
    })

    it("should initialise BackLink", () => {
      expect(BackLink).toHaveBeenCalled()
    })

    describe("Accordion initialiser", () => {
      it("should call module", () => {
        expect(Accordion).toHaveBeenCalled()
      })

      it("should expand sections with ticked checkboxes", () => {
        const $section = document.querySelector(".accordion-section")
        expect($section.classList.contains("accordion-section--expanded")).toBe(true)
      })
    })

    it("should initialise Toggle", () => {
      expect(Toggle).toHaveBeenCalled()
    })
  })
})
