$(document).ready(function () {

    d3.csv("data/queryOutput/userListForDropDown.csv", function (error, data) {
        var selectUser = d3.select("#userListDiv")
          .append("div")
          .append("select")

        selectUser.on("change", function (d) {
            $('#userQuery').html("");
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

    fetchAllUserIntentionChartData();
    fetchSelectedUserIntentionChartData('A0001');
    fetchUserOperationTimeSeriesData();
    //fetchUrlClickCountScatterChartData();
    generateBubbleChart();
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
                fetchAndLoadSelectedUserQueries($("#userListDiv option:selected").text(), d.id);
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

function fetchAndLoadSelectedUserQueries(userId, intention)
{
    d3.csv("data/class_query_transformed.csv", function (error, data) {
        var htmlString = "<table>";
        htmlString += '<tr><td><h4> User Queries for ' + intention + '</h4></td></tr>';
        var index = 0;
        for (var i = 0; i < data.length; i++)
        {
            if (((data[i].u_id).localeCompare(userId) == 0) && ((data[i].intention).localeCompare(intention) == 0))
            {
                htmlString += '<tr><td>' +  data[i].query + '</td></tr>';
            }
        }
        htmlString += "</table>";
        $('#userQuery').html(htmlString);
    });
}


//------------------------------------------------------------------------

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

//------------------------------------------------------------------------

function generateBubbleChart()
{
    var diameter = 600,
    format = d3.format(",d"),
    color = d3.scale.category20c();

    var pack = d3.layout.pack()
        .size([diameter, diameter])
        .padding(1.5)
        .value(function (d) { return d.clickCount; });

    var vis = d3.select("#svgid").append("svg")
        .attr("width", diameter)
        .attr("height", diameter)
        .attr("class", "pack")
      .append("g");


    d3.csv("data/queryOutput/urlClickCountSummary.csv", function (csvData) {
        // put csv into a data structure pack layout will accept
        var data = { name: "operation", children: csvData };

        var node = vis.data([data]).selectAll("circle")
            .data(pack.nodes)
          .enter().append("circle")
            .attr("class", "node")
            .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; })
            .attr("r", function (d) { return d.r; })
            .style("fill", function (d) { return color(d.operation); });

        node.append("title").text(function (d) { return d.url + ": " + format(d.clickCount); });
    });
}