import { initAll } from 'govuk-frontend';
import BackLink from './Javascript/back-link';
import CookieMessage from './Javascript/cookie-message';
import './Javascript/accordion.js';
import './Javascript/toggle.js';
import './Javascript/typeahead.jquery.js';
import './Styles/site.scss';

initAll();

var $backLink = document.querySelector('[data-module="back-link"]')
new BackLink($backLink).init()

var $cookieMessage = document.querySelector('[data-module="cookie-message"]')
new CookieMessage($cookieMessage).init()

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

if (process.env.NODE_ENV == 'development') {
  module.hot.accept();
}
