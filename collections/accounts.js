Accounts = new Meteor.Collection('accounts');

Meteor.methods({
	createNewAccount: function(json) {
		// scrub the json
		delete json.tracks;

		// string to int the page number
		json.page = 1;

		// save the meta
		Accounts.insert(json);
	},

	updatePages: function(json) {
		
	}
});
