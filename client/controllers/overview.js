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
});

var attachOverviewEvents = function() {
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

var detachOverviewEvents = function() {
  document.getElementById('body').removeEventListener('keyup');
}

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

var navigate = function(t, projects, dir) {
  var currentFeatureImgInstance = t.currentFeatureImg;
  var curProjImg = currentFeatureImgInstance.curValue.img;
  var curIndex = projects.map(function (proj) {
    return proj.img;
  }).indexOf(curProjImg);
  var nextProj = dir === 'fwd' ? projects[curIndex + 1] : projects[curIndex - 1];

  if (nextProj) {
    currentFeatureImgInstance.set(nextProj);
  } else {
    currentFeatureImgInstance.set(projects[0]);
  }
}

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

  'click #feature-img-back': function(e, t) {
    navigate(t, Session.get('projects'), 'back');
  },

  'click #feature-img-fwd': function(e, t) {
    navigate(t, Session.get('projects'), 'fwd');
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
