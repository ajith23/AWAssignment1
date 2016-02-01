$(document).ready(function () {

    d3.csv("data/queryOutput/userListForDropDown.csv", function (error, data) {
        var selectUser = d3.select("#userListDiv")
          .append("div")
          .append("select")

        selectUser.on("change", function (d) {
            var value = d3.select(this).property("value");
            fetchSelectedUserIntentionChartData(value);
            //alert(value);
        });

        selectUser.selectAll("option")
          .data(data)
          .enter()
            .append("option")
            .attr("value", function (d) { return d.value; })
            .text(function (d) { return d.label; });
    });

    //var chart = c3.generate({
    //    bindto: '#chart',
    //    data: {
    //        columns: [
    //          ['label', 'a','b','c','d','e','f'],
    //          ['data1', 30, 200, 100, 400, 150, 250],
    //          ['data2', 50, 20, 10, 40, 15, 25]
    //        ],
    //        onclick: function(e) {
    //            //make all teh bar opacity 0.1
    //           var k = "#chart .c3-shape-" + e.index;
    //            alert(k);
    //            event.stopPropagation();
    //        },

    //        axes: {
    //            data2: 'y2', // ADD
    //            label: 'x'
    //        },
    //        types: {
    //            data1:'area',
    //            data2: 'area' // ADD
    //        }
    //    },
    //    axis: {
    //        y2: {
    //            show: true // ADD
    //        },
    //        x: {
    //            show: true
    //        }
    //    }

    //});
    fetchAllUserIntentionChartData();
    fetchSelectedUserIntentionChartData('A0001');
    fetchUserOperationTimeSeriesData();
    fetchUrlClickCountScatterChartData();
});

function generateAllUserIntentionChart(chartData)
{
    var chart1 = c3.generate({
        bindto: '#chartIntentionAll',
        data: {
            columns: chartData,
            type: 'pie',
            onclick: function (d, i) {
                console.log("onclick", d, i);
            },
            onmouseover: function (d, i) { console.log("onmouseover", d, i); },
            onmouseout: function (d, i) { console.log("onmouseout", d, i); }
        }
    });
}

function generateSelectedUserIntentionChart(chartData) {
    var chart2 = c3.generate({
        bindto: '#chartIntentionUser',
        data: {
            columns: chartData,
            type: 'pie',
            onclick: function (d, i) {
                console.log("onclick", d, i);
            },
            onmouseover: function (d, i) { console.log("onmouseover", d, i); },
            onmouseout: function (d, i) { console.log("onmouseout", d, i); }
        }
    });

    chart2.load({
        columns: chartData
    });
}

function fetchAllUserIntentionChartData()
{
    d3.csv("data/queryOutput/intentionOverall.csv", function (error, data) {
        var columnArray = [];
        for(var i=0;i<data.length; i++)
        {
            var cellArray = [];
            cellArray[0] = data[i].intention;
            cellArray[1] = data[i].intentionCount;
            columnArray[i] = cellArray;
        }
        generateAllUserIntentionChart(columnArray);
    });
}

function fetchSelectedUserIntentionChartData(userId)
{
    d3.csv("data/queryOutput/intentionUserSpecific.csv", function (error, data) {
        var columnArray = [];
        var index = 0;
        for (var i = 0; i < data.length; i++) {
            if ((data[i].u_id).localeCompare(userId) == 0) {
                var cellArray = [];
                cellArray[0] = data[i].intention;
                cellArray[1] = data[i].intentionCount;
                columnArray[index] = cellArray;
                index++;
            }
        }
        generateSelectedUserIntentionChart(columnArray);
    });
}






function generateUserOperationTimeSeriesChart(chartData) {
    var chart = c3.generate({
        bindto: '#chartUserOperationTimeSeries',
        data: {
            x: 'timestamp_actual',
             xFormat: '%Y-%m-%d %H:%M:%S.000' , // 'xFormat' can be used as custom format of 'x'
            columns: chartData
        },
        zoom: {
            enabled: true
        },
        subchart: {
            show: true
        },
        axis: {
            x: {
                type: 'timeseries',
                tick: {
                    format: '%Y-%m-%d %H:%M:%S.000'   //2015-08-26 00:46:40.000
                }
            }
        }
    });
}

function fetchUserOperationTimeSeriesData() {
    d3.csv("data/queryOutput/userOperationWRTTime.csv", function (error, data) {
        var columnArray = [];
        var cellArray1 = [];
        var cellArray2 = [];
        cellArray1[0] = 'timestamp_actual';
        cellArray2[0] = 'operationCount';
        for (var i = 0; i < data.length; i++) {
            cellArray1[i+1] = data[i].timestamp_actual;
            cellArray2[i+1] = data[i].operationCount;
        }
        columnArray[0] = cellArray1;
        columnArray[1] = cellArray2;
        generateUserOperationTimeSeriesChart(columnArray);
    });
}

function generateUrlClickCountScatterChart(chartData) {
    var chart = c3.generate({
        bindto: '#urlClickScatterChart',
        data: {
            columns: chartData,
            type: 'scatter'
        }
        
    });
}

function fetchUrlClickCountScatterChartData() {
    d3.csv("data/queryOutput/urlClickCountSummary.csv", function (error, data) {
        var columnArray = [];
        for (var i = 0; i < data.length; i++) {
            var cellArray = [];
            cellArray[0] = data[i].url;
            cellArray[1] = data[i].clickCount;
            columnArray[i] = cellArray;
        }
        generateUrlClickCountScatterChart(columnArray);
    });
}