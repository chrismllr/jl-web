if (Meteor.isClient) {
  Template.Header.helpers({
    isWork: function() {
      return Router.current().location.get().path === '/';
    },
    isContact: function() {
      return Router.current().location.get().path === '/contact';
    }
  });

  Template.Projects.helpers({
    projects: [
      {id: 1, img: '/content/img001.jpg'},
      {id: 2, img: '/content/img002.jpg'},
      {id: 3, img: '/content/img003.jpg'},
      {id: 4, img: '/content/img004.jpg'},
      {id: 5, img: '/content/img005.jpg'},
      {id: 6, img: '/content/img006.jpg'},
      {id: 7, img: '/content/img007.jpg'},
      {id: 8, img: '/content/moto-example.png'},
      {id: 9, img: '/content/chris-example.png'}
    ]
  });

  Template.Projects.onCreated(function() {
    this.lightbox = new ReactiveVar(false);
    this.selectedProj = new ReactiveVar({});
  });

  Template.Projects.events({
    'click .project__item': function(e, t) {
      const lightboxInstance = Template.instance().lightbox;
      const curLightboxVal = lightboxInstance.get();

      lightboxInstance.set(!curLightboxVal);
      Template.instance().selectedProj.set(this);

      console.log('new lightbox val', lightboxInstance.get());
      console.log('new selectedProj val', Template.instance().selectedProj.get());

      setTimeout(function() {
        $(document).one('click', function() {
          lightboxInstance.set(!lightboxInstance.get());
          console.log('new lightbox val', lightboxInstance.get());
        });
      }, 50);
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
}

if (Meteor.isServer) {
  Meteor.startup(function () {
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
