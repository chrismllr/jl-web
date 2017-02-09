// ---------------------------------------------------------
// Router
// ---------------------------------------------------------
Router.configure({
  layoutTemplate: 'Application'
});

Router.route('/', function () {
  this.layout('Application');

  this.render('Projects');
}
// , {
//   waitOn: function() {
//     return Meteor.subscribe('projects');
//   }
// }
);

Router.route('/contact', function () {
  this.layout('Application');

  this.render('Contact');
});

Router.route('/overview', function () {
  this.layout('Application');

  this.render('Overview');
});
