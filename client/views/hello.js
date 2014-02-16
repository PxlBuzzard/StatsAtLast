var userName = "Pxl_Buzzard";
var page = 1;
var amount = 10;
var graphData = [];

Template.hello.events({
    'click #fetchButton': function (e) {
        e.preventDefault();
        $('#fetchButton').attr('disabled', 'true').val('loading...');

        userName = $('#userName').val();
        Meteor.call('fetchFromService', userName, page, amount, function (err, respJson) {
            if (err) {
                console.log("error occured on receiving data on server. ", err);
            } else if(respJson) {
                page++;
                Meteor.call('addSongs', respJson, userName, function (err, respJson) { });
            }
            $('#fetchButton').removeAttr('disabled').val('Fetch');
        });
    }
});

Template.hello.recentTracks = function () {
    return Songs.find() || [];
};

Template.hello.userName = function() {
    return userName;
};

Template.hello.accounts = function() {
    return Accounts.find() || [];
};

Template.hello.accountCount = function() {
    return Accounts.find().count() || -1;
};

Template.hello.rendered = function () {

    // Let's whip that data into shape
    //graphData = {};
    //for(var i = 0; i < Songs.find().count(); ++i) {
        //json.push({ Session.get('recentTracks')[i].date.uts });
        //json[i] = Session.get('recentTracks')[i].date.uts;

        //json[Session.get('recentTracks').artist['#text']] +=  (1 / Session.get('recentTracks').length) * 100;

        /*if(graphData.indexOf(Songs.find()[i]) > -1 ) {
            graphData
        } else {
            graphData.push([ Songs.find()[i].name, (1 / Songs.find().count() ) ]);
        }*/
    //}

    var uniqueArtists = [];
    Songs.distinct('artist.text', function(error, result) {
        uniqueArtists = result;

        for(var i = 0; i < uniqueArtists.length; ++i) {
            graphData.push([ uniqueArtists[i], (1.0 / Songs.find({ 'artist.text': uniqueArtists[i] }).count() * 100.0 ) ]);
        }
    });

    $('#chart-graph').highcharts({

        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title: {
            text: 'Most recent ' + Songs.find().count() + ' songs played'
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
            name: 'Percent of plays',
            data: graphData
        }]
    });
};
