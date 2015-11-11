if (Meteor.isClient) {
  Template.Header.helpers({
    isWork: function() {
      return Router.current().location.get().path === '/';
    },
    isContact: function() {
      return Router.current().location.get().path === '/contact';
    }
  });

  Template.Projects.onCreated(function() {
    var _this = this;
    this.lightbox = new ReactiveVar(false);
    this.selectedProj = new ReactiveVar({});
    this.currentFeatureImg = new ReactiveVar({});

    return Meteor.call('getClientConfig', function (err, result) {
      if (result) {
        Session.set('projects', result.projects);
      }
    });
  });

  Template.Projects.onRendered(function() {
    var mySVGsToInject = document.querySelectorAll('img.inject-me');
    SVGInjector(mySVGsToInject);
  });

  Template.Projects.helpers({
    lightbox: function() {
      return Template.instance().lightbox.get();
    },
    projects: function() {
      return Session.get('projects');
    },
    selectedProj: function() {
      return Template.instance().selectedProj.get();
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

  const navigateFeature = function(ftImg, projects, elem, dir) {
    const currentFeatureImgInstance = ftImg;
    const currentFeatureImgPath = ftImg.curValue.img;
    const curIndex = projects.map(function (proj) {return proj.img}).indexOf(currentFeatureImgPath);
    let newProj = dir === 'fwd' ? projects[curIndex + 1] : projects[curIndex - 1];
    let canTransition = false;

    if (newProj) {
      currentFeatureImgInstance.set(newProj);
      canTransition = true;
    } else {
      newProj = Session.get('projects')[0];
      currentFeatureImgInstance.set(newProj);
    }

    const imgElem = elem;

    if (canTransition || dir === 'fwd') {
      imgElem.fadeOut('fast', function () {
        imgElem.attr('src', newProj.img);
        imgElem.fadeIn('fast');
      });
    }
  }

  Template.Projects.events({
    'click .project__item': function(e, t) {
      const lightboxInstance = t.lightbox;
      const selectedProjInstance = t.selectedProj;
      const curLightboxVal = lightboxInstance.get();

      lightboxInstance.set(!curLightboxVal);
      selectedProjInstance.set(this);

      setTimeout(function() {
        $(document).one('click', function() {
          lightboxInstance.set(!lightboxInstance.get());
        });
      }, 50);
    },

    'click #feature-img': function(e, t) {
      navigateFeature(t.currentFeatureImg, Session.get('projects'), $('#feature-img'), 'fwd');
    },

    'click #feature-img-fwd': function(e, t) {
      navigateFeature(t.currentFeatureImg, Session.get('projects'), $('#feature-img'), 'fwd');
    },

    'click #feature-img-back': function(e, t) {
      navigateFeature(t.currentFeatureImg, Session.get('projects'), $('#feature-img'), 'back');
    },

    'keyup': function(e, t) {
      e.preventDefault();
      const FWD = 39;
      const BACK = 37;

      if (e.keyCode === FWD) {
        navigateFeature(t.currentFeatureImg, Session.get('projects'), $('#feature-img'), 'fwd');
      } else if (e.keyCode === BACK) {
        navigateFeature(t.currentFeatureImg, Session.get('projects'), $('#feature-img'), 'back');
      }
    }
  });

  Template.Contact.helpers({
    userImg: '/assets/justin.png'
  });

  const copyClipboard = function(txt) {
    var textArea = document.createElement("textarea");
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.opacity = 0;

    textArea.value = txt;
    document.body.appendChild(textArea);
    textArea.select();

    document.execCommand('copy');
  };

  Template.Contact.events({
    'click #copy-email': function(e, t) {
      copyClipboard(e.currentTarget.getAttribute('data-email'));
      setTimeout(function() { Tooltips.hide(); }, 3500);
    }
  });
}

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

if (Meteor.isServer) {
  Meteor.startup(function () {
    YamlConfig.loadFiles(Assets);
  });
}
