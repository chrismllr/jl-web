if (Meteor.isClient) {
  Template.Header.helpers({
    isWork: function() {
      return Router.current().location.get().path === '/';
    },
    isContact: function() {
      return Router.current().location.get().path === '/contact';
    }
  });

  Template.Header.onRendered(function() {
    var application = {
      init: function() {
        this.cacheDom();
        this.scrollEvents();
      },

      cacheDom: function() {
        this.$window = $(window);
        this.$siteHeader = $('#site-header');
        this.$siteContent = $('#site-content');
      },

      scrollEvents: function() {
        var _this = this;
        var height = this.$siteHeader.innerHeight();

        this.$window.on('scroll', function() {
          if (_this.$window.scrollTop() >= height) {
            _this.$siteHeader.addClass('scrolled-past');
            _this.$siteContent.css('margin-top', height);
          } else {
            _this.$siteContent.css('margin-top', 0);
            _this.$siteHeader.removeClass('scrolled-past');
          }
        });
      }
    };

    application.init();
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
  })
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
