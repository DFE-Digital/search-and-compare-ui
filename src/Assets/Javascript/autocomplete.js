import accessibleAutocomplete from "accessible-autocomplete"
import "accessible-autocomplete/dist/accessible-autocomplete.min.css"

export const requestFromApi = endpoint => {
  let xhr = null // Hoist this call so that we can abort previous requests.

  return (query, callback) => {
    if (xhr && xhr.readyState !== XMLHttpRequest.DONE) {
      xhr.abort()
    }
    const path = endpoint + "?query=" + query

    xhr = new XMLHttpRequest()
    xhr.addEventListener("load", function(evt) {
      let results = []
      try {
        results = JSON.parse(xhr.responseText)
      } catch (err) {
        console.error("Failed to parse results from endpoint " + path + ", error is:", err)
      }
      callback(results)
    })
    xhr.open("GET", path)
    xhr.send()
  }
}

const initAutocomplete = ($el, $input) => {
  accessibleAutocomplete({
    element: $el,
    id: $input.id,
    showNoOptionsFound: false,
    name: $input.getAttribute("name"),
    defaultValue: $input.value,
    minLength: 3,
    source: requestFromApi($input.getAttribute("data-url"))
  })

  $input.parentNode.removeChild($input)
}

export default initAutocomplete