// ---------------------------------------------------------
// Router
// ---------------------------------------------------------
Router.configure({
  layoutTemplate: 'Application'
});

Router.route('/', function () {
  this.layout('Application');

  this.render('Projects');
});

Router.route('/contact', function () {
  this.layout('Application');

  this.render('Contact');
});

Router.route('/overview', function () {
  this.layout('Application');

  this.render('Overview');
});
