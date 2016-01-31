// ---------------------------------------------------------
// Application
// ---------------------------------------------------------

Template.Application.onCreated(function() {
  var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
  if (isSafari) {
    $('body').addClass('safari');
  }

  return Meteor.call('getClientConfig', function (err, result) {
    if (result) {
      Session.set('projects', result.projects);
    }
  });
});
