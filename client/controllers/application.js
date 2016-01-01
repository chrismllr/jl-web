// ---------------------------------------------------------
// Application
// ---------------------------------------------------------

Template.Application.onCreated(function() {
  return Meteor.call('getClientConfig', function (err, result) {
    if (result) {
      Session.set('projects', result.projects);
    }
  });
});
