// ---------------------------------------------------------
// Projects
// ---------------------------------------------------------

var navigateFeature = function(ftImg, projects, elem, dir) {
  var currentFeatureImgInstance = ftImg;
  var currentFeatureImgPath = ftImg.curValue.img;
  var curIndex = projects.map(function (proj) {
    return proj.img;
  }).indexOf(currentFeatureImgPath);
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

Template.Projects.onCreated(function() {
  this.currentFeatureImg = new ReactiveVar({});
});

Template.Projects.onRendered(function() {
  var mySVGsToInject = document.querySelectorAll('img.inject-me');
  SVGInjector(mySVGsToInject);

  attachProjectsEvents();
});

Template.Projects.onDestroyed(function() {
  detachProjectsEvents();
});

var attachProjectsEvents = function() {
  document.getElementById('body').addEventListener('keyup', function(e, t) {
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
  });
}

var detachProjectsEvents = function() {
  document.getElementById('body').removeEventListener('keyup');
}

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

Template.Projects.events({
  'click #feature-img-fwd': function(e, t) {
    navigateFeature(t.currentFeatureImg, Session.get('projects'), $('#feature-img'), 'fwd');
  },

  'click #feature-img-back': function(e, t) {
    navigateFeature(t.currentFeatureImg, Session.get('projects'), $('#feature-img'), 'back');
  }
});
