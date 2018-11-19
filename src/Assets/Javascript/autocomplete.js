import accessibleAutocomplete from "accessible-autocomplete";
import "accessible-autocomplete/dist/accessible-autocomplete.min.css";

export const requestFromApi = endpoint => {
  let xhr = null; // Hoist this call so that we can abort previous requests.

  return (query, callback) => {
    if (xhr && xhr.readyState !== XMLHttpRequest.DONE) {
      xhr.abort();
    }
    const path = `${endpoint}?query=${query}`;

    xhr = new XMLHttpRequest();
    xhr.addEventListener("load", evt => {
      let results = [];
      try {
        results = JSON.parse(xhr.responseText);
      } catch (err) {
        console.error(`Failed to parse results from endpoint ${path}, error is:`, err);
      }
      callback(results);
    });
    xhr.open("GET", path);
    xhr.send();
  };
};

const triggerAnalyticsEvent = (category, action) => {
  ga("send", "event", {
    eventCategory: category,
    eventAction: action,
    transport: "beacon",
    nonInteraction: true
  });
};

const inputValueTemplate = result => (typeof result === "string" ? result : result && result.name);
const suggestionTemplate = result =>
  typeof result === "string" ? result : result && `${result.name} (${result.providerCode})`;

const initAutocomplete = ($el, $input) => {
  accessibleAutocomplete({
    element: $el,
    id: $input.id,
    showNoOptionsFound: true,
    name: $input.getAttribute("name"),
    defaultValue: $input.value,
    minLength: 3,
    source: requestFromApi($input.getAttribute("data-url")),
    templates: {
      inputValue: inputValueTemplate,
      suggestion: suggestionTemplate
    },
    confirmOnBlur: false,
    onConfirm: val => {
      const postcodeRegex = /([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})/;

      const selectedValue = typeof val === "string" ? val.replace(postcodeRegex, "POSTCODE") : val.name;

      triggerAnalyticsEvent(`Search by ${$input.id}: Results`, selectedValue);
    }
  });

  $input.parentNode.removeChild($input);
};

export default initAutocomplete;
