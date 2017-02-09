/* globals Projects */
import Cs from '../contentful.service';

const projectKeyup = (e) => {
  e.preventDefault();
  var FWD = 39;
  var BACK = 37;

  if (e.keyCode === FWD) {
    var fwdBtn = document.getElementById('feature-img-fwd');
    if (fwdBtn) {
      fwdBtn.click();
    }
  } else if (e.keyCode === BACK) {
    var backBtn = document.getElementById('feature-img-back');
    if (backBtn) {
      backBtn.click();
    }
  }
};

const attachProjectsEvents = () => {
  document.getElementById('body').addEventListener('keyup', projectKeyup, false);
};

const detachProjectsEvents = () => {
  document.getElementById('body').removeEventListener('keyup', projectKeyup, false);
};

const slideshow = {
  setup(index, projects, dir, self) {
    this.runSlideshow = setTimeout(() => {
      navigateFeature(index, projects, dir, (newIndex) => {
        this.remind(newIndex, projects, 'fwd', self);
      });
    }, 5000);
  },

  remind(ftImg, projects, dir, self) {
    this.runSlideshow = setTimeout(() => {
      navigateFeature(index, projects, dir, (newIndex) => {
        this.remind(newIndex, projects, 'fwd', self);
      });
    }, 5000);
  },

  cancel() {
    clearTimeout(this.runSlideshow);
    this.runSlideshow = undefined;
  }
};

// ---------------------------------------------------------
// Projects
// ---------------------------------------------------------

Template.Projects.onCreated(function() {
  $('body').addClass('projects');
  this.curIndex = new ReactiveVar(0);
  this.projects = new ReactiveVar([]);

  Cs.getProjects().then((projects) => {
    this.projects.set(projects);
    slideshow.setup(this.curIndex, projects, 'fwd', this);
  });
});

Template.Projects.onRendered(function() {
  var mySVGsToInject = document.querySelectorAll('img.inject-me');
  new SVGInjector(mySVGsToInject);

  attachProjectsEvents();
  
});

Template.Projects.onDestroyed(function() {
  detachProjectsEvents();
  slideshow.cancel();
  $('body').removeClass('projects');
});

var navigateFeature = function(indexInstance, projects, dir, cb) {
  var elem = $('#feature-img');
  var curIndex = indexInstance.get();

  var nextIndex = dir === 'fwd' ? curIndex + 1 : curIndex - 1;

  if (nextIndex > projects.length - 1) {
    indexInstance.set(0);
  } else if (nextIndex >= 0) {
    indexInstance.set(nextIndex);
  } else {
    indexInstance.set(projects.length - 1);
  }

  cb(indexInstance);
};

Template.Projects.helpers({
  featureImage () {
    return Template.instance().projects.get()[
      Template.instance().curIndex.get()
    ];
  },

  templateGestures: {
    'swipeleft #feature-img-back': function(e, t) {
      e.preventDefault();
      navigateFeature(t.curIndex, Template.instance().projects.get(), 'fwd', function(newFtImg) {
        slideshow.cancel();
        slideshow.setup(newFtImg, Template.instance().projects.get(), 'fwd');
      });
    },
    'swiperight #feature-img-back': function(e, t) {
      e.preventDefault();
      navigateFeature(t.curIndex, Template.instance().projects.get(), 'back', function(newFtImg) {
        slideshow.cancel();
        slideshow.setup(newFtImg, Template.instance().projects.get(), 'fwd');
      });
    },
    'swipeleft #feature-img-fwd': function(e, t) {
      e.preventDefault();
      navigateFeature(t.curIndex, Template.instance().projects.get(), 'fwd', function(newFtImg) {
        slideshow.cancel();
        slideshow.setup(newFtImg, Template.instance().projects.get(), 'fwd');
      });
    },
    'swiperight #feature-img-fwd': function(e, t) {
      e.preventDefault();
      navigateFeature(t.curIndex, Template.instance().projects.get(), 'back', function(newFtImg) {
        slideshow.cancel();
        slideshow.setup(newFtImg, Template.instance().projects.get(), 'fwd');
      });
    }
  }
});

Template.Projects.events({
  'click #feature-img-fwd': function(e, t) {
    navigateFeature(t.curIndex, Template.instance().projects.get(), 'fwd', function(newFtImg) {
      slideshow.cancel();
      slideshow.setup(newFtImg, Template.instance().projects.get(), 'fwd');
    });
  },

  'click #feature-img-back': function(e, t) {
    navigateFeature(t.curIndex, Template.instance().projects.get(), 'back', function(newIndex) {
      slideshow.cancel();
      slideshow.setup(newIndex, Template.instance().projects.get(), 'fwd');
    });
  }
});
