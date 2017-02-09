/* globals Projects */
const Cs = require('../contentful.service');

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

const navigateLightbox = (t, projects, index, dir) => {
  var indexInstance = t.curIndex;
  var curIndex = index;

  var nextIndex = dir === 'fwd' ? curIndex + 1 : curIndex - 1;

  if (nextIndex) {
    indexInstance.set(nextIndex);
  } else {
    if (dir === 'fwd') {
      indexInstance.set(0);
    } else {
      indexInstance.set(projects.length - 1);
    }
  }
};

// ---------------------------------------------------------
// Overview
// ---------------------------------------------------------

Template.Overview.onCreated(function() {
  $('body').addClass('overview');
  this.projects = new ReactiveVar([]);
  this.curIndex = new ReactiveVar(0);
  this.lightbox = new ReactiveVar(false);

  Cs.getProjects()
    .then((projects) => {
      this.projects.set(projects);
    });
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

  featureImage () {
    return Template.instance().projects.get()[
      Template.instance().curIndex.get()
    ];
  },

  projectCategories() {
    var projects = Template.instance().projects.get();
    var projectCategories = projects.map(proj => proj.projectCategory);
    return _.uniq(projectCategories);
  },

  projects() {
    var projects = Template.instance().projects.get();

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
  
  templateGestures: {
    'swipeleft #lightbox-img-back': function(e, t) {
      e.preventDefault();
      navigateLightbox(t, Template.instance().projects.get(), 'fwd');
    },
    'swiperight #lightbox-img-back': function(e, t) {
      e.preventDefault();
      navigateLightbox(t, Template.instance().projects.get(), 'back');
    },
    'swipeleft #lightbox-img-fwd': function(e, t) {
      e.preventDefault();
      navigateLightbox(t, Template.instance().projects.get(), 'fwd');
    },
    'swiperight #lightbox-img-fwd': function(e, t) {
      e.preventDefault();
      navigateLightbox(t, Template.instance().projects.get(), 'back');
    }
  }
});

Template.Overview.events({
  'click .overview__project__item': function(e, t) {
    var lightboxInstance = t.lightbox;
    var indexInstance = t.curIndex;
    var curLightboxVal = lightboxInstance.get();

    $('body').addClass('no-scroll');
    lightboxInstance.set(!curLightboxVal);
    indexInstance.set(
      t.projects.get().indexOf(this)
    );

    setTimeout(function() {
      var mySVGsToInject = document.querySelectorAll('img.inject-me');
      new SVGInjector(mySVGsToInject);
    }, 50);
  },

  'click #lightbox-img-back': function(e, t) {
    navigateLightbox(t, Template.instance().projects.get(), Template.instance().curIndex.get(), 'back');
  },

  'click #lightbox-img-fwd': function(e, t) {
    navigateLightbox(t, Template.instance().projects.get(),  Template.instance().curIndex.get(), 'fwd');
  },

  'click #close-lightbox': function(e, t) {
    var lightboxInstance = t.lightbox;
    var curLightboxVal = lightboxInstance.get();

    $('body').removeClass('no-scroll');
    $('.lightbox').addClass('exiting');

    setTimeout(() => lightboxInstance.set(!curLightboxVal), 500);
  }
});
