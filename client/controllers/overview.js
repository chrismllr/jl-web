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
