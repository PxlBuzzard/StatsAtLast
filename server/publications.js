Meteor.publish('songs', function() {
  return Songs.find();
});
