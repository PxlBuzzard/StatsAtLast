var userName = "Pxl_Buzzard";

Template.hello.events({
    'click #fetchButton': function (e) {
        e.preventDefault();
        console.log("Recent tracks from last.fm!");
        $('#fetchButton').attr('disabled', 'true').val('loading...');
        userName = $('#userName').val();
        Meteor.call('fetchFromService', userName, function (err, respJson) {
            if (err) {
                window.alert("Error: " + err.reason);
                console.log("error occured on receiving data on server. ", err);
            } else if(respJson) {
                console.log("respJson: ", respJson);
                //window.alert(respJson.length + ' tracks received.');
                Session.set("recentTracks", respJson);
            }
            $('#fetchButton').removeAttr('disabled').val('Fetch');
        });
    }
});

Template.hello.recentTracks = function () {
    return Session.get("recentTracks") || [];
};

Template.hello.userName = function() {
    return userName;
};
