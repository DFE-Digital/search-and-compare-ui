// Toggle element visibility
var toggle = function (elem) {
  elem.classList.toggle('is-visible');
};

// Listen for click events
document.addEventListener('click', function (event) {

  // Make sure clicked element is our toggle
  if (!event.target.classList.contains('js-toggle')) return;

  // Add is-toggled to anchor to change arrow direction
  event.target.classList.toggle('is-toggled');

  // Prevent default link behavior
  event.preventDefault();

  // Get the content
  var content = document.querySelector(event.target.dataset.target);
  if (!content) return;

  // Toggle the content
  toggle(content);

}, false);
