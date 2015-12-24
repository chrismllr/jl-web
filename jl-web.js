if (Meteor.isServer) {
  // ---------------------------------------------------------
  // Server
  // ---------------------------------------------------------
  Meteor.startup(function () {
    YamlConfig.loadFiles(Assets);
  });
}



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




if (Meteor.isClient) {
  // ---------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------
  Template.registerHelper("get", function(obj, prop) {
    return obj[prop];
  });



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



  // ---------------------------------------------------------
  // Projects
  // ---------------------------------------------------------
  Template.Projects.onCreated(function() {
    this.currentFeatureImg = new ReactiveVar({});
  });

  Template.Projects.onRendered(function() {
    var mySVGsToInject = document.querySelectorAll('img.inject-me');
    SVGInjector(mySVGsToInject);
  });

  Template.Projects.helpers({
    projects: function() {
      return Session.get('projects');
    },
    currentFeatureImg: function() {
      Template.instance().currentFeatureImg.set(Session.get('projects')[0]);
      return Session.get('projects')[0];
    },
    templateGestures: {
      'swipeleft #feature-img': function(e, t) {
        navigateFeature(t.currentFeatureImg, Session.get('projects'), $('#feature-img'), 'fwd');
      },
      'swiperight #feature-img': function(e, t) {
        navigateFeature(t.currentFeatureImg, Session.get('projects'), $('#feature-img'), 'back');
      },
    }
  });

  var navigateFeature = function(ftImg, projects, elem, dir) {
    var currentFeatureImgInstance = ftImg;
    var currentFeatureImgPath = ftImg.curValue.img;
    var curIndex = projects.map(function (proj) { return proj.img; }).indexOf(currentFeatureImgPath);
    var newProj = dir === 'fwd' ? projects[curIndex + 1] : projects[curIndex - 1];
    var canTransition = false;

    if (newProj) {
      currentFeatureImgInstance.set(newProj);
      canTransition = true;
    } else {
      newProj = Session.get('projects')[0];
      currentFeatureImgInstance.set(newProj);
    }

    var imgElem = elem;

    if (canTransition || dir === 'fwd') {
      imgElem.fadeOut('fast', function () {
        var img = new Image();

        img.onload = function() {
          imgElem.attr('src', newProj.img);
          imgElem.fadeIn('fast');
        };

        img.src = newProj.img;
      });
    }
  };

  Template.Projects.events({
    'click #feature-img-fwd': function(e, t) {
      navigateFeature(t.currentFeatureImg, Session.get('projects'), $('#feature-img'), 'fwd');
    },

    'click #feature-img-back': function(e, t) {
      navigateFeature(t.currentFeatureImg, Session.get('projects'), $('#feature-img'), 'back');
    },

    'keyup': function(e, t) {
      e.preventDefault();
      var FWD = 39;
      var BACK = 37;

      if (e.keyCode === FWD) {
        navigateFeature(t.currentFeatureImg, Session.get('projects'), $('#feature-img'), 'fwd');
      } else if (e.keyCode === BACK) {
        navigateFeature(t.currentFeatureImg, Session.get('projects'), $('#feature-img'), 'back');
      }
    }
  });



  // ---------------------------------------------------------
  // Contact
  // ---------------------------------------------------------
  Template.Contact.helpers({
    userImg: '/assets/justin.png'
  });

  Template.Contact.onRendered(function() {
    var mySVGsToInject = document.querySelectorAll('img.inject-me');
    SVGInjector(mySVGsToInject);
  });

  var copyClipboard = function(txt) {
    var textArea = document.createElement("textarea");
    textArea.id = 'copy-email-textarea'
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.opacity = 0;

    textArea.value = txt;
    document.body.appendChild(textArea);
    document.getElementById('copy-email-textarea').select();

    document.execCommand('copy');
  };

  Template.Contact.events({
    'click #copy-email': function(e, t) {
      copyClipboard(e.currentTarget.getAttribute('data-email'));
      setTimeout(function() { Tooltips.hide(); }, 3500);
    }
  });



  // ---------------------------------------------------------
  // Overview
  // ---------------------------------------------------------

  Template.Overview.onCreated(function() {
    this.lightbox = new ReactiveVar(false);
    this.currentFeatureImg = new ReactiveVar({});
    $('body').addClass('overview');
  });

  Template.Overview.helpers({
    lightbox: function() {
      return Template.instance().lightbox.get();
    },

    currentFeatureImg: function() {
      Template.instance().currentFeatureImg.set(Session.get('projects')[0]);
      return Session.get('projects')[0];
    },

    projectCategories: function() {
      var projects = Session.get('projects');
      var projectCategories = projects.map(function(proj) {
        return proj.projectCategory;
      });
      return _.uniq(projectCategories);
    },

    projects: function() {
      var projects = Session.get('projects');
      if (projects) {
        var projectCategories = projects.map(function(proj) {
          return proj.projectCategory;
        });
        var uniqueCategories = _.uniq(projectCategories);
        return uniqueCategories.reduce(function(hash, cat) {
          hash[cat] = projects.filter(function(proj) {
            return proj.projectCategory === cat;
          });

          return hash;
        }, {});
      }
      return {};
    },

    currentFeatureImg: function() {
      return Template.instance().currentFeatureImg.get();
    }
  });

  Template.Overview.events({
    'click .overview__project__item': function(e, t) {
      var lightboxInstance = t.lightbox;
      var currentFeatureImgInstance = t.currentFeatureImg;
      var curLightboxVal = lightboxInstance.get();

      lightboxInstance.set(!curLightboxVal);
      currentFeatureImgInstance.set(this);

      setTimeout(function() {
        var mySVGsToInject = document.querySelectorAll('img.inject-me');
        SVGInjector(mySVGsToInject);
      }, 50);
    },

    'click #feature-img': function(e, t) {
      var projects = Session.get('projects');
      var currentFeatureImgInstance = t.currentFeatureImg;
      var curProjImg = currentFeatureImgInstance.curValue.img;
      var curIndex = projects.map(function (proj) { return proj.img; }).indexOf(curProjImg);
      var nextProj = projects[curIndex + 1];

      if (nextProj) {
        currentFeatureImgInstance.set(nextProj);
      } else {
        currentFeatureImgInstance.set(projects[0]);
      }
    },

    'click #close-lightbox': function(e, t) {
      var lightboxInstance = t.lightbox;
      var curLightboxVal = lightboxInstance.get();

      $('.lightbox').addClass('exiting');
      setTimeout(function() {
        lightboxInstance.set(!curLightboxVal);
      },500);

    }
  });
}
