Template.songsList.helpers({
  songs: function() {
    return Songs.find();
  }
});
