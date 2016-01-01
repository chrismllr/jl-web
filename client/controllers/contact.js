// ---------------------------------------------------------
// Contact
// ---------------------------------------------------------

Template.Contact.helpers({
  userImg: '/assets/justin.png'
});

Template.Contact.onRendered(function() {
  var mySVGsToInject = document.querySelectorAll('img.inject-me');
  SVGInjector(mySVGsToInject);
});

var copyClipboard = function(txt, cb) {
  var textArea = document.createElement("textarea");
  textArea.id = 'copy-email-textarea'
  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;
  textArea.style.opacity = 0;

  textArea.value = txt;
  document.body.appendChild(textArea);

  document.getElementById('copy-email-textarea').select();

  var successCopy = document.execCommand('copy');

  if (!successCopy) {
    cb('failed');
  } else {
    cb('success');
  }
};

Template.Contact.events({
  'click #copy-email': function(e, t) {
    var txt = e.currentTarget.getAttribute('data-email');

    copyClipboard(txt, function(result) {
      if (result === 'success') {
        setTimeout(function() { Tooltips.hide(); }, 3000);
      } else {
        changeTooltipTxt(txt);
      }
    });
  }
});

var changeTooltipTxt = function(txt) {
  document.getElementById('copy-email').dataset.tooltip = txt;
};
