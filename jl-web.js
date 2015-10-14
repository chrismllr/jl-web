if (Meteor.isClient) {
  Template.Projects.helpers({
    projects: [
      {id: 1, title: 'Project One', colors: {primary: '#A7D7B0', secondary: '#5BA36A'}},
      {id: 2, title: 'Project Two', colors: {primary: '#CBE7F5', secondary: '#07B5E5'}},
      {id: 3, title: 'Project Two', colors: {primary: '#CBE7F5', secondary: '#07B5E5'}},
      {id: 4, title: 'Project Two', colors: {primary: '#CBE7F5', secondary: '#07B5E5'}},
      {id: 5, title: 'Project Two', colors: {primary: '#CBE7F5', secondary: '#07B5E5'}},
      {id: 6, title: 'Project Two', colors: {primary: '#CBE7F5', secondary: '#07B5E5'}},
      {id: 7, title: 'Project Two', colors: {primary: '#CBE7F5', secondary: '#07B5E5'}},
      {id: 8, title: 'Project Two', colors: {primary: '#CBE7F5', secondary: '#07B5E5'}}
    ]
  });

  Template.Header.onCreated(function() {
    this.swapForText = new ReactiveVar(false);
  });

  Template.Header.helpers({
    swapForText: function() {
      return Template.instance().swapForText.get();
    }
  });

  Template.Header.events({
    'click #swap-text': function() {
      var val = Template.instance().swapForText.get();
      Template.instance().swapForText.set(!val);
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
      },

      scrollEvents: function() {
        var _this = this;
        var height = this.$siteHeader.innerHeight();

        this.$window.on('scroll', function() {
          if (_this.$window.scrollTop() >= height - 110) {
            _this.$siteHeader.addClass('scrolled-past');
            _this.$window.scrollTop(110);
          } else {
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
});
