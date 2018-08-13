function BackLink ($module) {
  this.$module = $module
}

BackLink.prototype.init = function () {
  var $module = this.$module

  if (!$module) {
    return
  }

  window.addEventListener('load', function () {
    var $isInternalReferrer = document.referrer.indexOf(location.protocol + "//" + location.host) === 0;

    if ($isInternalReferrer) {
      var $link = document.createElement("a");
      $link.setAttribute("href", "javascript:history.back()");
      $link.setAttribute("class", "govuk-back-link")
      $link.textContent = "Back to search results";

      $module.appendChild($link);
    }
  })
}

export default BackLink
