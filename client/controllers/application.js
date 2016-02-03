// ---------------------------------------------------------
// Application
// ---------------------------------------------------------

Projects = new Mongo.Collection('projects');

Template.Application.onCreated(function() {
  var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);

  if (isSafari) {
    $('body').addClass('safari');
  }
});
