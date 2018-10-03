const initFormAnalytics = () => {
  // How to use:
  // 1. Attach `data-ga-event-form="Helpful Namespace"` to <form> elements
  // 2. Attach `data-ga-event-form-input="Helpful Label" to <input>s of type checkbox or radio
  // When users click on [type='submit'] in the form, an analytics event is triggered with the
  // namespace followed by the specified labels of the checked inputs.
  const dataAttrForm = "data-ga-event-form"
  const dataAttrInput = "data-ga-event-form-input"

  const triggerAnalyticsEvent = (category, action) => {
    ga("send", "event", {
      eventCategory: category,
      eventAction: action,
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

      triggerAnalyticsEvent("Form: " + namespace, values.join(", "))
    })
  }

  const $forms = document.querySelectorAll("[" + dataAttrForm + "]")

  for (let i = 0; i < $forms.length; i++) {
    attachAnalyticsToForm($forms[i])
  }
}

if (typeof ga !== "undefined") {
  initFormAnalytics()
}
