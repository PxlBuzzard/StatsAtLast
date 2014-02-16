var userName = "Pxl_Buzzard";
var amount = 9;
var chart = null;
graphData = [];

Template.hello.events({
    'click #fetchButton': function (e) {
        e.preventDefault();
        $('#fetchButton').attr('disabled', 'true').val('loading...');

        userName = $('#userName').val();
        Meteor.call('fetchFromService', userName, amount, function (err, respJson) {
            if (err) {
                console.log("error occured on receiving data on server. ", err);
            } else if(respJson) {
                Meteor.call('addSongs', respJson, userName, function (err, respJson) { });
            }
            $('#fetchButton').removeAttr('disabled').val('Fetch');
        });
    },

    'click #resetButton': function (e) {
        e.preventDefault();
        $('#resetButton').attr('disabled', 'true').val('clearing...');

        userName = $('#userName').val();
        Meteor.call('resetSongs', userName, function (err, respJson) {
            if (err) {
                console.log("error occured on receiving data on server. ", err);
            }
            $('#resetButton').removeAttr('disabled').val('Reset');
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
    // Get a list of all unique artists
    Songs.distinct('artist.text', function(error, result) {
        // Reset graphData
        graphData = [];

        for(var i = 0; i < result.length; ++i) {
            graphData.push([ result[i], ( Songs.find({ 'artist.text': result[i] }).count() / Songs.find().count() * 100.0 ) ]);
        }
    });

    // Make that chart
    chart = $('#chart-graph').highcharts({

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
