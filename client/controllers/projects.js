/* globals Projects */

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
  setup(ftImg, projects, dir, self) {
    this.runSlideshow = setTimeout(() => {
      navigateFeature(ftImg, projects, dir, (newFtImg) => {
        this.remind(newFtImg, projects, 'fwd', self);
      });
    }, 5000);
  },

  remind(ftImg, projects, dir, self) {
    this.runSlideshow = setTimeout(() => {
      navigateFeature(ftImg, projects, dir, (newFtImg) => {
        this.remind(newFtImg, projects, 'fwd', self);
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
  this.currentFeatureImg = new ReactiveVar({});

  $('body').addClass('projects');
});

Template.Projects.onRendered(function() {
  var mySVGsToInject = document.querySelectorAll('img.inject-me');
  new SVGInjector(mySVGsToInject);

  attachProjectsEvents();
  slideshow.setup(this.currentFeatureImg, Projects.find().fetch(), 'fwd', this);
});

Template.Projects.onDestroyed(function() {
  detachProjectsEvents();
  slideshow.cancel();
  $('body').removeClass('projects');
});

var navigateFeature = function(ftImg, projects, dir, cb) {
  var elem = $('#feature-img');
  var currentFeatureImgInstance = ftImg;
  var currentFeatureImgPath = ftImg.curValue.img;
  var curIndex = projects.map(proj => proj.img).indexOf(currentFeatureImgPath);

  var nextProj = dir === 'fwd' ? projects[curIndex + 1] : projects[curIndex - 1];

  if (!nextProj) {
    if (dir !== 'fwd') {
      nextProj = projects[projects.length - 1];
    } else {
      nextProj = projects[0];
    }
  }

  currentFeatureImgInstance.set(nextProj);
  elem.attr('src', nextProj.img);
  elem.attr('alt', nextProj.name);

  cb(currentFeatureImgInstance);
};

Template.Projects.helpers({
  currentFeatureImg() {
    Template.instance().currentFeatureImg.set(Projects.find().fetch()[0]);
    return Projects.find().fetch()[0];
  },

  templateGestures: {
    'swipeleft #feature-img-back': function(e, t) {
      e.preventDefault();
      navigateFeature(t.currentFeatureImg, Projects.find().fetch(), 'fwd', function(newFtImg) {
        slideshow.cancel();
        slideshow.setup(newFtImg, Projects.find().fetch(), 'fwd');
      });
    },
    'swiperight #feature-img-back': function(e, t) {
      e.preventDefault();
      navigateFeature(t.currentFeatureImg, Projects.find().fetch(), 'back', function(newFtImg) {
        slideshow.cancel();
        slideshow.setup(newFtImg, Projects.find().fetch(), 'fwd');
      });
    },
    'swipeleft #feature-img-fwd': function(e, t) {
      e.preventDefault();
      navigateFeature(t.currentFeatureImg, Projects.find().fetch(), 'fwd', function(newFtImg) {
        slideshow.cancel();
        slideshow.setup(newFtImg, Projects.find().fetch(), 'fwd');
      });
    },
    'swiperight #feature-img-fwd': function(e, t) {
      e.preventDefault();
      navigateFeature(t.currentFeatureImg, Projects.find().fetch(), 'back', function(newFtImg) {
        slideshow.cancel();
        slideshow.setup(newFtImg, Projects.find().fetch(), 'fwd');
      });
    }
  }
});

Template.Projects.events({
  'click #feature-img-fwd': function(e, t) {
    navigateFeature(t.currentFeatureImg, Projects.find().fetch(), 'fwd', function(newFtImg) {
      slideshow.cancel();
      slideshow.setup(newFtImg, Projects.find().fetch(), 'fwd');
    });
  },

  'click #feature-img-back': function(e, t) {
    navigateFeature(t.currentFeatureImg, Projects.find().fetch(), 'back', function(newFtImg) {
      slideshow.cancel();
      slideshow.setup(newFtImg, Projects.find().fetch(), 'fwd');
    });
  }
});
