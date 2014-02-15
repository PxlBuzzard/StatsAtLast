var userName = "Pxl_Buzzard";
var page = 1;

Template.hello.events({
    'click #fetchButton': function (e) {
        e.preventDefault();
        console.log("Recent tracks from last.fm!");
        $('#fetchButton').attr('disabled', 'true').val('loading...');
        userName = $('#userName').val();
        Meteor.call('fetchFromService', userName, page, function (err, respJson) {
            if (err) {
                window.alert("Error: " + err.reason);
                console.log("error occured on receiving data on server. ", err);
            } else if(respJson) {
                console.log("respJson: ", respJson);
                page++;
                //window.alert(respJson.length + ' tracks received.');
                if(Session.get('recentTracks'))
                    Session.set("recentTracks", Session.get('recentTracks').concat(respJson));
                else
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
