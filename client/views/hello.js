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
                //console.log("respJson: ", respJson);
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

Template.hello.accounts = function() {
    return Accounts.find();
};

Template.hello.accountCount = function() {
    return Accounts.find().count();
};

Template.hello.graph = $(function () {

    // Get the JSON and create the chart
    json = {};
    for(var i = 0; i < Session.get('recentTracks').length; ++i) {
        //json.push({ Session.get('recentTracks')[i].date.uts });
        //json[i] = Session.get('recentTracks')[i].date.uts;

        //json[Session.get('recentTracks').artist['#text']] +=  (1 / Session.get('recentTracks').length) * 100;
    }

    
    $('#chart-graph').highcharts({

        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title: {
            text: 'Browser market shares at a specific website, 2010'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    color: '#000000',
                    connectorColor: '#000000',
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                }
            }
        },
        series: [{
            type: 'pie',
            name: 'Bands and such',
            data: [
                ['Firefox',   45.0],
                ['IE',       26.8],
                {
                    name: 'Chrome',
                    y: 12.8,
                    sliced: true,
                    selected: true
                },
                ['Safari',    8.5],
                ['Opera',     6.2],
                ['Others',   0.7]
            ]
        }]
    });
});
