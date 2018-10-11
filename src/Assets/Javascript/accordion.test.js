import Accordion from "./accordion"

describe("Accordion module", () => {
  it("exposes a function", () => {
    expect(typeof Accordion).toBe("function")
  })

  let accordion

  beforeEach(() => {
    document.body.innerHTML = `
<div data-module="accordion">
  <div class="govuk-accordion__section">
    <div class="govuk-accordion__section-header">Header 1</div>
    <div class="govuk-accordion__section-body">Body 1</div>
  </div>
  <div class="govuk-accordion__section">
    <div class="govuk-accordion__section-header">Header 2</div>
    <div class="govuk-accordion__section-body">Body 2</div>
  </div>
</div>
`
    accordion = new Accordion(document.querySelector('[data-module="accordion"]'))
  })

  describe("init()", () => {
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
        document.querySelector(".govuk-accordion__section").classList.add("govuk-accordion__section--expanded")
        accordion.init()
      })

      it("initialises accordion HTML correctly", () => {
        expect(document.body.innerHTML).toMatchSnapshot()
      })
    })

    // describe("when all sections are open", () => {
    //   beforeEach(() => {
    //     document
    //       .querySelectorAll(".govuk-accordion__section")
    //       .forEach($section => $section.classList.add("govuk-accordion__section--expanded"))
    //     accordion.init()
    //   })

    //   it("initialises accordion HTML correctly", () => {
    //     expect(document.querySelector(".govuk-accordion__expand-all").innerHTML).toBe("Close all")
    //     expect(document.body.innerHTML).toMatchSnapshot()
    //   })
    // })
  })

  describe("events", () => {
    describe("clicking on open all", () => {
      beforeEach(() => {
        accordion.init()
        document.querySelector(".govuk-accordion__expand-all").click()
      })

      it("opens all accordion sections", () => {
        document.querySelectorAll(".govuk-accordion__section").forEach($section => {
          expect($section.getAttribute("aria-expanded")).toBe("true")
        })
      })
    })

    describe("clicking on an accordion section header", () => {
      let $sections

      beforeEach(() => {
        accordion.init()
        $sections = document.querySelectorAll(".govuk-accordion__section")
        $sections[0].querySelector(".govuk-accordion__section-header").click()
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
        $sections = document.querySelectorAll(".govuk-accordion__section")
        $sections[0]
          .querySelector(".govuk-accordion__section-header")
          .dispatchEvent(new KeyboardEvent("keypress", { keyCode: 13 }))
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
        $sections = document.querySelectorAll(".govuk-accordion__section")
        $sections[0]
          .querySelector(".govuk-accordion__section-header")
          .dispatchEvent(new KeyboardEvent("keypress", { keyCode: 65 }))
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
        document.querySelectorAll(".govuk-accordion__section-header").forEach($section => $section.click())
      })

      it("opens all sections", () => {
        document
          .querySelectorAll(".govuk-accordion__section")
          .forEach($section => expect($section.getAttribute("aria-expanded")).toBe("true"))
      })

      it("changes 'Open all' button to 'Close all'", () => {
        expect(document.querySelector(".govuk-accordion__expand-all").innerHTML).toBe("Close all")
      })
    })
  })
})
