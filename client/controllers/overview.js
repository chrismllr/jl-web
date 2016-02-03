/* globals Projects */

const overviewKeyup = (e) => {
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

const attachOverviewEvents = () => {
  document.getElementById('body').addEventListener('keyup', overviewKeyup, false);
};

const detachOverviewEvents = () => {
  document.getElementById('body').removeEventListener('keyup', overviewKeyup, false);
};

const navigateLightbox = (t, projects, dir) => {
  var currentFeatureImgInstance = t.currentFeatureImg;
  var curProjImg = currentFeatureImgInstance.curValue.img;
  var curIndex = projects.map(proj => proj.img).indexOf(curProjImg);

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
});

Template.Projects.onDestroyed(function() {
  detachOverviewEvents();
  $('body').removeClass('overview');
});

Template.Overview.helpers({
  lightbox() {
    return Template.instance().lightbox.get();
  },

  featureImg() {
    Template.instance().currentFeatureImg.set(Projects.find().fetch()[0]);
    return Projects.find().fetch()[0];
  },

  projectCategories() {
    var projects = Projects.find().fetch();
    var projectCategories = projects.map(proj => proj.projectCategory);
    return _.uniq(projectCategories);
  },

  projects() {
    var projects = Projects.find().fetch();
    if (projects) {
      var projectCategories = projects.map(proj => proj.projectCategory);
      var uniqueCategories = _.uniq(projectCategories);
      return uniqueCategories.reduce((hash, cat) => {
        hash[cat] = projects.filter(proj => proj.projectCategory === cat);
        return hash;
      }, {});
    }
    return {};
  },

  currentFeatureImg() {
    return Template.instance().currentFeatureImg.get();
  },

  templateGestures: {
    'swipeleft #lightbox-img-back': function(e, t) {
      e.preventDefault();
      navigateLightbox(t, Projects.find().fetch(), 'fwd');
    },
    'swiperight #lightbox-img-back': function(e, t) {
      e.preventDefault();
      navigateLightbox(t, Projects.find().fetch(), 'back');
    },
    'swipeleft #lightbox-img-fwd': function(e, t) {
      e.preventDefault();
      navigateLightbox(t, Projects.find().fetch(), 'fwd');
    },
    'swiperight #lightbox-img-fwd': function(e, t) {
      e.preventDefault();
      navigateLightbox(t, Projects.find().fetch(), 'back');
    }
  }
});

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
    navigateLightbox(t, Projects.find().fetch(), 'back');
  },

  'click #lightbox-img-fwd': function(e, t) {
    navigateLightbox(t, Projects.find().fetch(), 'fwd');
  },

  'click #close-lightbox': function(e, t) {
    var lightboxInstance = t.lightbox;
    var curLightboxVal = lightboxInstance.get();

    $('body').removeClass('no-scroll');
    $('.lightbox').addClass('exiting');

    setTimeout(() => lightboxInstance.set(!curLightboxVal), 500);

  }
});
