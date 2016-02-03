// ---------------------------------------------------------
// Header
// ---------------------------------------------------------

Template.Header.helpers({
  isContact() {
    return Router.current().location.get().path === '/contact';
  },
  isOverview() {
    return Router.current().location.get().path === '/overview';
  },
});
