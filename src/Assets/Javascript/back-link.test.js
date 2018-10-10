import BackLink from "./back-link"

window.addEventListener = jest.fn().mockImplementation((_, cb) => cb())

describe("Back Link module", () => {
  it("exposes a function", () => {
    expect(typeof BackLink).toBe("function")
  })

  describe("init()", () => {
    describe("with no element", () => {
      beforeEach(() => {
        const backLink = new BackLink()
        backLink.init()
      })

      it("does nothing", () => {
        expect(window.addEventListener).not.toHaveBeenCalled()
      })
    })

    describe("with an element", () => {
      let backLink

      beforeAll(() => {
        backLink = new BackLink({})
        backLink.init()
      })

      it("sets up event listener on window", () => {
        expect(window.addEventListener).toHaveBeenCalledWith("load", expect.any(Function))
      })

      describe("when on a page which does have an internal referrer", () => {
        const domElement = { appendChild: jest.fn() }

        beforeAll(() => {
          Object.defineProperty(document, "referrer", { value: "http://localhost", configurable: true })
          new BackLink(domElement).init()
        })

        it("calls appendChild on element with correct arguments", () => {
          expect(domElement.appendChild.mock.calls).toMatchSnapshot()
        })
      })

      describe("when on a page which does NOT have an internal referrer", () => {
        const domElement = { appendChild: jest.fn() }

        beforeAll(() => {
          Object.defineProperty(document, "referrer", { value: "http://google.com", configurable: true })
          new BackLink(domElement).init()
        })

        it("does NOT call appendChild on element", () => {
          expect(domElement.appendChild).not.toHaveBeenCalled()
        })
      })
    })
  })
})
