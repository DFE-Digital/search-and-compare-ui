import Accordion from "./accordion"

describe("Accordion module", () => {
  it("exposes a function", () => {
    expect(typeof Accordion).toBe("function")
  })

  let accordion

  beforeEach(() => {
    document.body.innerHTML = `
<div data-module="accordion">
  <div class="accordion-section">
    <div class="accordion-section-header">Header 1</div>
    <div class="accordion-section-body">Body 1</div>
  </div>
  <div class="accordion-section">
    <div class="accordion-section-header">Header 2</div>
    <div class="accordion-section-body">Body 2</div>
  </div>
</div>
`
    accordion = new Accordion(document.querySelector('[data-module="accordion"]'))
  })

  describe("init()", () => {
    describe("when in an incompatible environment", () => {
      let realNodeList = window.NodeList

      beforeEach(() => {
        window.NodeList = null
        accordion.init()
      })

      it("leaves HTML untouched", () => {
        expect(document.body.innerHTML).toMatchSnapshot()
      })

      afterEach(() => {
        window.NodeList = realNodeList
      })
    })

    describe("when all sections are closed", () => {
      beforeEach(() => {
        accordion.init()
      })

      it("initialises accordion HTML correctly", () => {
        expect(document.body.innerHTML).toMatchSnapshot()
      })
    })

    describe("when one section is open", () => {
      beforeEach(() => {
        document.querySelector(".accordion-section").classList.add("accordion-section--expanded")
        accordion.init()
      })

      it("initialises accordion HTML correctly", () => {
        expect(document.body.innerHTML).toMatchSnapshot()
      })
    })
  })

  describe("events", () => {
    describe("clicking on open all", () => {
      beforeEach(() => {
        accordion.init()
        document.querySelector(".accordion-expand-all").click()
      })

      it("opens all accordion sections", () => {
        document.querySelectorAll(".accordion-section").forEach($section => {
          expect($section.getAttribute("aria-expanded")).toBe("true")
        })
      })
    })

    describe("clicking on an accordion section header", () => {
      let $sections

      beforeEach(() => {
        accordion.init()
        $sections = document.querySelectorAll(".accordion-section")
        $sections[0].querySelector(".accordion-section-header").click()
      })

      it("opens the first accordion section", () => {
        expect($sections[0].getAttribute("aria-expanded")).toBe("true")
      })

      it("does NOT open the second accordion section", () => {
        expect($sections[1].getAttribute("aria-expanded")).toBe("false")
      })
    })

    describe("pressing enter on an accordion section header", () => {
      let $sections

      beforeEach(() => {
        accordion.init()
        $sections = document.querySelectorAll(".accordion-section")
        $sections[0]
          .querySelector(".accordion-section-header")
          .dispatchEvent(new KeyboardEvent("keypress", { key: "Enter" }))
      })

      it("opens the first accordion section", () => {
        expect($sections[0].getAttribute("aria-expanded")).toBe("true")
      })

      it("does NOT open the second accordion section", () => {
        expect($sections[1].getAttribute("aria-expanded")).toBe("false")
      })
    })

    describe("pressing a random key on an accordion section header", () => {
      let $sections

      beforeEach(() => {
        accordion.init()
        $sections = document.querySelectorAll(".accordion-section")
        $sections[0]
          .querySelector(".accordion-section-header")
          .dispatchEvent(new KeyboardEvent("keypress", { key: "j" }))
      })

      it("does NOT open any accordion sections", () => {
        $sections.forEach($section => {
          expect($section.getAttribute("aria-expanded")).toBe("false")
        })
      })
    })

    describe("clicking on all accordion section headers in turn", () => {
      beforeEach(() => {
        accordion.init()
        document.querySelectorAll(".accordion-section-header").forEach($section => $section.click())
      })

      it("opens all sections", () => {
        document
          .querySelectorAll(".accordion-section")
          .forEach($section => expect($section.getAttribute("aria-expanded")).toBe("true"))
      })

      it("changes 'Open all' button to 'Close all'", () => {
        expect(document.querySelector(".accordion-expand-all").innerHTML).toBe("Close all")
      })
    })
  })
})
