Songs = new Meteor.Collection('songs');

Meteor.methods({
	fetchFromService: function(userName, amount) {
		if (amount > 200) amount = 200;
		var page = 1;
		if (Accounts.findOne({user: userName}))
			page = Accounts.findOne({user: userName}).page;
		console.log(page);
		var url = "http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user="+userName+"&api_key="+Meteor.settings.lastfm_apikey+"&limit="+amount+"&page="+page+"&format=json";

		var result = HTTP.get(url, {timeout:30000});
		if(result.statusCode === 200) {
			var respJson = JSON.parse(result.content);
			console.log(respJson.recenttracks['@attr'].user);

			// grab the metadata about page numbers and update database
			if (!Accounts.findOne({user: userName})) {
				Meteor.call('createNewAccount', respJson.recenttracks['@attr']);
			}

			// inc the page counter
			Accounts.update({user: userName}, {$inc: {page: 1}});

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
	},

	resetSongs: function(userName) {
		Songs.remove({});
		Accounts.update({user: userName}, {page: 1});
	}
});
