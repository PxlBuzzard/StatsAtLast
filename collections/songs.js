Songs = new Meteor.Collection('songs');

Meteor.methods({
	fetchFromService: function(userName, page, amount) {
		if (amount > 200) amount = 200;
		var url = "http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user="+userName+"&api_key="+Meteor.settings.lastfm_apikey+"&limit="+amount+"&page="+page+"&format=json";

		var result = HTTP.get(url, {timeout:30000});
		if(result.statusCode === 200) {
			var respJson = JSON.parse(result.content);
			console.log(respJson.recenttracks['@attr'].user);

			// grab the metadata about page numbers and update database
			if (!Accounts.findOne({user: respJson.recenttracks['@attr'].user}))
				Meteor.call('createNewAccount', respJson.recenttracks['@attr']);

			// travel down to track list
			respJson = respJson.recenttracks.track;

			// clean last fm json
			for(var i = 0; i < respJson.length; ++i) {
				respJson[i].artist.text = respJson[i].artist['#text'];
				respJson[i].album.text = respJson[i].album['#text'];
				delete respJson[i].artist['#text'];
				delete respJson[i].album['#text'];
			}

			return respJson;
		} else {
			console.log("Response issue: ", result.statusCode);
			var errorJson = JSON.parse(result.content);
			throw new Meteor.Error(result.statusCode, errorJson.error);
		}
	},

	addSongs: function(json, userName) {
		for(var i = 0; i < json.length; ++i) {
			Songs.insert(json[i]);
		}
	}
});
