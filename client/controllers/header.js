// ---------------------------------------------------------
// Header
// ---------------------------------------------------------

Template.Header.helpers({
  isContact: function() {
    return Router.current().location.get().path === '/contact';
  },
  isOverview: function() {
    return Router.current().location.get().path === '/overview';
  },
});
