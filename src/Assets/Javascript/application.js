if (!!$) {
  $(document).ready(function () {
    // Turn off jQuery animation
    jQuery.fx.off = true

    $('.typeahead').each(function () {
      var $this = $(this);
      var url = $this.data("url");
      $this.typeahead({
        minLength: 3,
        highlight: true
      }, {
        name: url.replace(/\//g, "-"),
        source: function (query, cbSync, cbAsync) {
          $.get(url, {
            query: query
          }, function (res) {
              cbAsync(res);
          });
        },
        limit: 10
      });
    });
  })
}

if ('addEventListener' in document && document.querySelectorAll) {
  document.addEventListener('DOMContentLoaded', function () {
    var accordions = document.querySelectorAll('.accordion')
    for (var i = accordions.length - 1; i >= 0; i--) {
      new Accordion(accordions[i])
    };
  })
}
