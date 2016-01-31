// ---------------------------------------------------------
// Projects
// ---------------------------------------------------------

var navigateFeature = function(ftImg, projects, elem, dir) {
  var currentFeatureImgInstance = ftImg;
  var currentFeatureImgPath = ftImg.curValue.img;
  var curIndex = projects.map(function (proj) {
    return proj.img;
  }).indexOf(currentFeatureImgPath);

  var nextProj = dir === 'fwd' ? projects[curIndex + 1] : projects[curIndex - 1];

  if (!nextProj) {
    if (dir !== 'fwd') {
      nextProj = projects[projects.length - 1];
    } else {
      nextProj = projects[0];
    }
  }

  currentFeatureImgInstance.set(nextProj);

  var imgElem = elem;

  imgElem.fadeOut('fast', function () {
    var img = new Image();

    img.onload = function() {
      imgElem.attr('src', nextProj.img);
      imgElem.fadeIn('fast');
    };

    img.src = nextProj.img;
  });
};

Template.Projects.onCreated(function() {
  this.currentFeatureImg = new ReactiveVar({});
  $('body').addClass('projects');
});

Template.Projects.onRendered(function() {
  var mySVGsToInject = document.querySelectorAll('img.inject-me');
  new SVGInjector(mySVGsToInject);

  attachProjectsEvents();
});

Template.Projects.onDestroyed(function() {
  detachProjectsEvents();
  $('body').removeClass('projects');
});

var attachProjectsEvents = function() {
  document.getElementById('body').addEventListener('keyup', projectKeyup, false);
};

var detachProjectsEvents = function() {
  document.getElementById('body').removeEventListener('keyup', projectKeyup, false);
};

var projectKeyup = function(e) {
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

Template.Projects.helpers({
  projects: function() {
    return Session.get('projects');
  },
  currentFeatureImg: function() {
    Template.instance().currentFeatureImg.set(Session.get('projects')[0]);
    return Session.get('projects')[0];
  },
  templateGestures: {
    'swipeleft #feature-img-back': function(e, t) {
      e.preventDefault();
      navigateFeature(t.currentFeatureImg, Session.get('projects'), $('#feature-img'), 'fwd');
    },
    'swiperight #feature-img-back': function(e, t) {
      e.preventDefault();
      navigateFeature(t.currentFeatureImg, Session.get('projects'), $('#feature-img'), 'back');
    },
    'swipeleft #feature-img-fwd': function(e, t) {
      e.preventDefault();
      navigateFeature(t.currentFeatureImg, Session.get('projects'), $('#feature-img'), 'fwd');
    },
    'swiperight #feature-img-fwd': function(e, t) {
      e.preventDefault();
      navigateFeature(t.currentFeatureImg, Session.get('projects'), $('#feature-img'), 'back');
    }
  }
});

Template.Projects.events({
  'click #feature-img-fwd': function(e, t) {
    navigateFeature(t.currentFeatureImg, Session.get('projects'), $('#feature-img'), 'fwd');
  },

  'click #feature-img-back': function(e, t) {
    navigateFeature(t.currentFeatureImg, Session.get('projects'), $('#feature-img'), 'back');
  }
});
