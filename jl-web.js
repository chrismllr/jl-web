if (Meteor.isClient) {
  Template.Header.helpers({
    isWork: function() {
      return Router.current().location.get().path === '/';
    },
    isContact: function() {
      return Router.current().location.get().path === '/contact';
    }
  });

  Template.Projects.onCreated(function() {
    var _this = this;
    this.lightbox = new ReactiveVar(false);
    this.selectedProj = new ReactiveVar({});
    this.projects = []

    return Meteor.call('getClientConfig', function (err, result) {
      if (result) {
        Session.set('projects', result.projects)
      }
    });
  });

  Template.Projects.helpers({
    lightbox: function() {
      return Template.instance().lightbox.get();
    },
    projects: function() {
      return Session.get('projects');
    },
    selectedProj: function() {
      return Template.instance().selectedProj.get();
    }
  });

  Template.Projects.events({
    'click .project__item': function(e, t) {
      const lightboxInstance = t.lightbox;
      const selectedProjInstance = t.selectedProj;
      const curLightboxVal = lightboxInstance.get();

      lightboxInstance.set(!curLightboxVal);
      selectedProjInstance.set(this);

      console.log('new lightbox val', lightboxInstance.get());
      console.log('new selectedProj val', selectedProjInstance.get());

      setTimeout(function() {
        $(document).one('click', function() {
          lightboxInstance.set(!lightboxInstance.get());
          console.log('new lightbox val', lightboxInstance.get());
        });
      }, 50);
    }
  });

  Template.Contact.helpers({
    userImg: '/assets/justin.png'
  });
}

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

if (Meteor.isServer) {
  Meteor.startup(function () {
    YamlConfig.loadFiles(Assets);
  });
}
