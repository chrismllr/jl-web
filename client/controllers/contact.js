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

var copyClipboard = function(txt) {
  var textArea = document.createElement("textarea");
  textArea.id = 'copy-email-textarea'
  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;
  textArea.style.opacity = 0;

  textArea.value = txt;
  document.body.appendChild(textArea);
  document.getElementById('copy-email-textarea').select();

  document.execCommand('copy');
};

Template.Contact.events({
  'click #copy-email': function(e, t) {
    copyClipboard(e.currentTarget.getAttribute('data-email'));
    setTimeout(function() { Tooltips.hide(); }, 3500);
  }
});
