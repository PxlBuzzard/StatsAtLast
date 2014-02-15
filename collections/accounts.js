Accounts = new Meteor.Collection('accounts');

Meteor.methods({
	createNewAccount: function(json) {
		//scrub the json
		delete json.tracks;

		// save the meta
		Accounts.insert(json);
	},

	updatePages: function(json) {
		
	}
});
