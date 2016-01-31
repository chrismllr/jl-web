// ---------------------------------------------------------
// Overview
// ---------------------------------------------------------

Template.Overview.onCreated(function() {
  this.lightbox = new ReactiveVar(false);
  this.currentFeatureImg = new ReactiveVar({});
  $('body').addClass('overview');
});

Template.Overview.onRendered(function() {
  attachOverviewEvents();

  var manager = $('body').data('hammer');
  var swipeRecognizer = manager.get('swipe');

  swipeRecognizer.set({
    velocity: 500,
    threshold: 1000
  });
});

Template.Projects.onDestroyed(function() {
  detachOverviewEvents();
  $('body').removeClass('overview');
});

var attachOverviewEvents = function() {
  document.getElementById('body').addEventListener('keyup', overviewKeyup, false);
};

var detachOverviewEvents = function() {
  document.getElementById('body').removeEventListener('keyup', overviewKeyup, false);
};

var overviewKeyup = function(e) {
  e.preventDefault();
  var FWD = 39;
  var BACK = 37;

  if (e.keyCode === FWD) {
    var fwdBtn = document.getElementById('lightbox-img-fwd');
    if (fwdBtn) {
      fwdBtn.click();
    }
  } else if (e.keyCode === BACK) {
    var backBtn = document.getElementById('lightbox-img-back');
    if (backBtn) {
      backBtn.click();
    }
  }
};

Template.Overview.helpers({
  lightbox: function() {
    return Template.instance().lightbox.get();
  },

  featureImg: function() {
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
  },

  // hammerInitOptions: {
  //   swipe: { velocity: 0.2, threshold: 5 }
  // },

  templateGestures: {
    'swipeleft #lightbox-img-back': function(e, t) {
      e.preventDefault();
      navigateLightbox(t, Session.get('projects'), 'fwd');
    },
    'swiperight #lightbox-img-back': function(e, t) {
      e.preventDefault();
      navigateLightbox(t, Session.get('projects'), 'back');
    },
    'swipeleft #lightbox-img-fwd': function(e, t) {
      e.preventDefault();
      navigateLightbox(t, Session.get('projects'), 'fwd');
    },
    'swiperight #lightbox-img-fwd': function(e, t) {
      e.preventDefault();
      navigateLightbox(t, Session.get('projects'), 'back');
    }
  }
});

var navigateLightbox = function(t, projects, dir) {
  var currentFeatureImgInstance = t.currentFeatureImg;
  var curProjImg = currentFeatureImgInstance.curValue.img;
  var curIndex = projects.map(function (proj) {
    return proj.img;
  }).indexOf(curProjImg);

  var nextProj = dir === 'fwd' ? projects[curIndex + 1] : projects[curIndex - 1];

  if (nextProj) {
    currentFeatureImgInstance.set(nextProj);
  } else {
    if (dir === 'fwd') {
      currentFeatureImgInstance.set(projects[0]);
    } else {
      currentFeatureImgInstance.set(projects[projects.length - 1]);
    }
  }
};

Template.Overview.events({
  'click .overview__project__item': function(e, t) {
    var lightboxInstance = t.lightbox;
    var currentFeatureImgInstance = t.currentFeatureImg;
    var curLightboxVal = lightboxInstance.get();

    $('body').addClass('no-scroll');
    lightboxInstance.set(!curLightboxVal);
    currentFeatureImgInstance.set(this);

    setTimeout(function() {
      var mySVGsToInject = document.querySelectorAll('img.inject-me');
      new SVGInjector(mySVGsToInject);
    }, 50);
  },

  'click #lightbox-img-back': function(e, t) {
    navigateLightbox(t, Session.get('projects'), 'back');
  },

  'click #lightbox-img-fwd': function(e, t) {
    navigateLightbox(t, Session.get('projects'), 'fwd');
  },

  'click #close-lightbox': function(e, t) {
    var lightboxInstance = t.lightbox;
    var curLightboxVal = lightboxInstance.get();

    $('body').removeClass('no-scroll');
    $('.lightbox').addClass('exiting');

    setTimeout(function() {
      lightboxInstance.set(!curLightboxVal);
    },500);

  }
});
