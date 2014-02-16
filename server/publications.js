Meteor.publish('songs', function() {
  return Songs.find();
});

Meteor.publish('accounts', function() {
  return Accounts.find();
});
