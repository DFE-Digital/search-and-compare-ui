import { initAll } from 'govuk-frontend';
import CookieMessage from './Javascript/cookie-message';
import BackLink from './Javascript/back-link';
import Accordion from './Javascript/accordion';
import Toggle from './Javascript/toggle';
import './Javascript/typeahead.jquery.js';
import './Styles/site.scss';

initAll();

var $cookieMessage = document.querySelector('[data-module="cookie-message"]');
new CookieMessage($cookieMessage).init();

var $backLink = document.querySelector('[data-module="back-link"]');
new BackLink($backLink).init();

var $accordions = document.querySelectorAll('[data-module="accordion"]')
for (var i = $accordions.length - 1; i >= 0; i--) {
  new Accordion($accordions[i]).init();
};

var $toggle = document.querySelectorAll('[data-module="toggle"]')
for (var i = $toggle.length - 1; i >= 0; i--) {
  new Toggle($toggle[i]).init();
};

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
