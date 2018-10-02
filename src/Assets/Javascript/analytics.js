// How to use:
// 1. Attach `data-ga-event-form="Helpful Namespace"` to <form> elements
// 2. Attach `data-ga-event-form-input="Helpful Label" to <input>s of type checkbox or radio
// When users click on [type='submit'] in the form, an analytics event is triggered with the
// namespace followed by the specified labels of the checked inputs.
const dataAttrForm = "data-ga-event-form"
const dataAttrInput = "data-ga-event-form-input"

const triggerAnalyticsEvent = (namespace, label) => {
  ga("send", "event", {
    eventCategory: "Form: " + namespace,
    eventAction: label,
    transport: "beacon"
  })
}

const attachAnalyticsToForm = $form => {
  const namespace = $form.getAttribute(dataAttrForm)
  const $submitBtn = $form.querySelector('[type="submit"]')

  $submitBtn.addEventListener("click", () => {
    const $checkedInputs = $form.querySelectorAll("[" + dataAttrInput + "]:checked")
    const values = []

    for (let j = 0; j < $checkedInputs.length; j++) {
      values.push($checkedInputs[j].getAttribute(dataAttrInput))
    }

    triggerAnalyticsEvent(namespace, values.join(", "))
  })
}

if (typeof ga !== "undefined") {
  const $forms = document.querySelectorAll("[" + dataAttrForm + "]")

  for (let i = 0; i < $forms.length; i++) {
    attachAnalyticsToForm($forms[i])
  }
}
