Projects = new Mongo.Collection('projects');

if (Projects.find().count() === 0) {
  var data = JSON.parse(Assets.getText("projects.json"));

  data.projects.forEach(function (item) {
    Projects.insert(item);
  });
}

Meteor.publish('projects', function() {
  return Projects.find();
});
