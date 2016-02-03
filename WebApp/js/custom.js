$(document).ready(function () {

    d3.csv("data/queryOutput/userListForDropDown.csv", function (error, data) {
        var selectUser = d3.select("#userListDiv")
          .append("div")
          .append("select")

        selectUser.on("change", function (d) {
            $('#userQuery').html("");
            var value = d3.select(this).property("value");
            fetchSelectedUserIntentionChartData(value);
            fetchUserOperationTimeSeriesData(value);
            //alert(value);
        });

        selectUser.selectAll("option")
          .data(data)
          .enter()
            .append("option")
            .attr("value", function (d) { return d.value; })
            .text(function (d) { return d.label; });
    });


    loadUserContributionListDiv();
    fetchAllUserIntentionChartData();
    fetchSelectedUserIntentionChartData('A0001');
    fetchUserOperationTimeSeriesData('A0001');
    //fetchUrlClickCountScatterChartData();
    //generateBubbleChart();
    //generateUserClickCountReport();
    fetchOperationSummaryChartData();
});

function loadUserContributionListDiv()
{
    d3.csv("data/queryOutput/userListForDropDown.csv", function (error, data) {
        var selectUser = d3.select("#userContributionListDiv")
          .append("div")
          .append("select")

        selectUser.on("change", function (d) {
            var value = d3.select(this).property("value");
            loadContribution(value);
        });

        selectUser.selectAll("option")
          .data(data)
          .enter()
            .append("option")
            .attr("value", function (d) { return d.value; })
            .text(function (d) { return d.label; });
    });
}

function generateAllUserIntentionChart(chartData) {
    var chart1 = c3.generate({
        bindto: '#chartIntentionAll',
        data: {
            columns: chartData,
            type: 'pie',
            order: null,
            onclick: function (d, i) {
                console.log("onclick", d, i);
            },
            onmouseover: function (d, i) { console.log("onmouseover", d, i); },
            onmouseout: function (d, i) { console.log("onmouseout", d, i); }
        },
        order: null,
        legend: {
            position: 'right'
        }
        //pie: {
        //    label: {
        //        format: function (value, ratio, id) {
        //            return id + ":" + ratio;
        //        }
        //    }
        //}
    });
}

function generateSelectedUserIntentionChart(chartData) {
    var chart2 = c3.generate({
        bindto: '#chartIntentionUser',
        data: {
            columns: chartData,
            type: 'pie',
            order: null,
            onclick: function (d, i) {
                console.log("onclick", d, i);
                fetchAndLoadSelectedUserQueries($("#userListDiv option:selected").text(), d.id);
            },
            onmouseover: function (d, i) { console.log("onmouseover", d, i); },
            onmouseout: function (d, i) { console.log("onmouseout", d, i); }
        },
        order: null,
        legend: {
            position: 'right'
        }
        //pie: {
        //    label: {
        //        format: function (value, ratio, id) {
        //            return id + ":" + ratio;
        //        }
        //    }
        //}
    });

    chart2.load({
        columns: chartData
    });
}

function fetchAllUserIntentionChartData() {
    d3.csv("data/queryOutput/intentionOverall.csv", function (error, data) {
        var columnArray = [];
        for (var i = 0; i < data.length; i++) {
            var cellArray = [];
            cellArray[0] = data[i].intention;
            cellArray[1] = data[i].intentionCount;
            columnArray[i] = cellArray;
        }
        generateAllUserIntentionChart(columnArray);
    });
}

function fetchSelectedUserIntentionChartData(userId) {
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

function fetchAndLoadSelectedUserQueries(userId, intention) {
    d3.csv("data/queryOutput/intentionQuery.csv", function (error, data) {
        var htmlString = "<table>";
        htmlString += '<tr><td><h4> User Queries for ' + intention + '</h4></td></tr>';
        var index = 0;
        for (var i = 0; i < data.length; i++) {
            if (((data[i].u_id).localeCompare(userId) == 0) && ((data[i].intention).localeCompare(intention) == 0)) {
                htmlString += '<tr><td>' + data[i].query + '</td></tr>';
            }
        }
        htmlString += "</table>";
        $('#userQuery').html(htmlString);
    });
}

function fetchOperationSummaryChartData() {
    d3.csv("data/queryOutput/urlOperationSummary.csv", function (error, data) {
        var columnArray = [];
        var index = 0;
        var cellArrayScrollDown = [];
        var cellArrayScrollUp = [];
        var cellArrayTargetClicked = [];
        var cellArraySelect = [];

        var xScrollDown = [];
        var xScrollUp = [];
        var xTargetClicked = [];
        var xSelect = [];

        cellArrayScrollDown[0] = 'ScrollDown';
        cellArrayScrollUp[0] = 'ScrollUp';
        cellArrayTargetClicked[0] = 'TargetClicked';
        cellArraySelect[0] = 'Select';

        xScrollDown[0] = 'x1';
        xScrollUp[0] = 'x2';
        xTargetClicked[0] = 'x3';
        xSelect[0] = 'x4';

        for (var i = 0; i < data.length; i++) {

            if (data[i].operation.localeCompare('scroll_up') == 0) {
                cellArrayScrollUp[cellArrayScrollUp.length] = data[i].clickCount;
                xScrollUp[xScrollUp.length] = data[i].url;
            }
            else if (data[i].operation.localeCompare('scroll_down') == 0) {
                cellArrayScrollDown[cellArrayScrollDown.length] = data[i].clickCount;
                xScrollDown[xScrollDown.length] = data[i].url;
            }
            else if (data[i].operation.localeCompare('select') == 0) {
                cellArraySelect[cellArraySelect.length] = data[i].clickCount;
                xSelect[xSelect.length] = data[i].url;
            }
            else if (data[i].operation.localeCompare('target_clicked') == 0) {
                cellArrayTargetClicked[cellArrayTargetClicked.length] = data[i].clickCount;
                xTargetClicked[xTargetClicked.length] = data[i].url;
            }

            //columnArray[index] = cellArray;
            index++;
        }
        columnArray[0] = xScrollDown;
        columnArray[1] = xScrollUp;
        columnArray[2] = xTargetClicked;
        columnArray[3] = xSelect;
        columnArray[4] = cellArrayScrollDown;
        columnArray[5] = cellArrayScrollUp;
        columnArray[6] = cellArrayTargetClicked;
        columnArray[7] = cellArraySelect;

        generateUrlOperationSummaryChart(columnArray);
    });
}

function generateUrlOperationSummaryChart(chartData) {
    var chart = c3.generate({
        bindto: '#urlOperationSummaryChart',
        data: {
            xs: {
                'ScrollDown': 'x1',
                'ScrollUp': 'x2',
                'TargetClicked': 'x3',
                'Select': 'x4'
            },
            columns: chartData,
            //type: 'bar',
            //groups: [
            //    ['ScrollDown', 'ScrollUp', 'TargetClicked', 'Select']
            //]
        },
        zoom: {
            enabled: true
        },
        subchart: {
            show: true
        },
        grid: {
            x: {
                show: true
            },
            y: {
                show: true
            }
        },
        axis: {
            x: {
                type: 'category'
            }
        }
    });
}
//------------------------------------------------------------------------

function generateUserOperationTimeSeriesChart(chartData) {
    var chart = c3.generate({
        bindto: '#chartUserOperationTimeSeries',
        data: {
            xs: {
                'ScrollDown': 'ScrollDownTime',
                'ScrollUp': 'ScrollUpTime',
                'TargetClicked': 'TargetClickedTime',
                'Select': 'SelectTime',
            },
            //x: 'ScrollDown',
            xFormat: '%Y-%m-%d %H:%M:%S.000', // 'xFormat' can be used as custom format of 'x'
            columns: chartData,
            type: 'line',
            //groups: [
            //['ScrollDown', 'ScrollUp']
            //]
        },
        zoom: {
            enabled: true
        },
        //subchart: {
        //    show: true
        //},
        grid: {
            x: {
                show: true
            },
            y: {
                show: true
            }
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
    chart.load({
        columns: chartData
    });
}

function fetchUserOperationTimeSeriesData(userId) {
    d3.csv("data/queryOutput/userOperationTimeline.csv", function (error, data) {
        var columnArray = [];
        var cellArray1 = [];
        var cellArray2 = [];
        cellArray1[0] = 'timestamp_actual';
        cellArray2[0] = 'operationCount';
        
        var sdCountArray = [];
        var sdTimeArray = [];
        var suCountArray = [];
        var suTimeArray = [];
        var tcCountArray = [];
        var tcTimeArray = [];
        var sCountArray = [];
        var sTimeArray = [];

        sdCountArray[0] = 'ScrollDown'
        sdTimeArray[0] = 'ScrollDownTime'
        suCountArray[0] = 'ScrollUp'
        suTimeArray[0] = 'ScrollUpTime'
        tcCountArray[0] = 'TargetClicked'
        tcTimeArray[0] = 'TargetClickedTime'
        sCountArray[0] = 'Select'
        sTimeArray[0] = 'SelectTime'

        for (var i = 0; i < data.length; i++) {
            if ((data[i].u_id).localeCompare(userId) == 0) {
                //cellArray1[cellArray1.length] = data[i].timestamp_actual;
                //cellArray2[cellArray2.length] = data[i].operationCount;

                if ((data[i].operation).localeCompare('scroll_down') == 0) {
                    sdTimeArray[sdTimeArray.length] = data[i].timestamp_actual;
                    sdCountArray[sdCountArray.length] = data[i].operationCount;
                }
                else if ((data[i].operation).localeCompare('scroll_up') == 0) {
                    suTimeArray[suTimeArray.length] = data[i].timestamp_actual;
                    suCountArray[suCountArray.length] = data[i].operationCount;
                }
                else if ((data[i].operation).localeCompare('target_clicked') == 0) {
                    tcTimeArray[tcTimeArray.length] = data[i].timestamp_actual;
                    tcCountArray[tcCountArray.length] = data[i].operationCount;
                }
                else if ((data[i].operation).localeCompare('select') == 0) {
                    sTimeArray[sTimeArray.length] = data[i].timestamp_actual;
                    sCountArray[sCountArray.length] = data[i].operationCount;
                }
            }
        }
        columnArray[0] = sdTimeArray;
        columnArray[1] = suTimeArray;
        columnArray[2] = tcTimeArray;
        columnArray[3] = sTimeArray;
        columnArray[4] = sdCountArray;
        columnArray[5] = suCountArray;
        columnArray[6] = tcCountArray;
        columnArray[7] = sCountArray;
        
        generateUserOperationTimeSeriesChart(columnArray);
        $('#chartUserOperationTimeSeriesHeader').html('Opeartion History for ' + userId);
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


function generateUserClickCountReport() {
    var diameter = 500,
    format = d3.format(",d"),
    color = d3.scale.category20c();

    var pack = d3.layout.pack()
        .sort(null)
    .size([diameter, diameter])
    .padding(1.5)
    .value(function (d) { return d.userClickCount; });

    var vis = d3.select("#svgid").append("svg")
        .attr("width", diameter)
        .attr("height", diameter)
        .attr("class", "pack")
      .append("g");


    d3.csv("data/queryOutput/userClickCountReport.csv", function (csvData) {
        var data = { name: "operation", children: csvData };
        var node = vis.data([data]).selectAll("circle")
        .data(pack.nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; })
        .attr("r", function (d) { return d.r; })
        .style("fill", function (d) { return color(d.operation); })
        .on("mouseover", function (d) {
            $('#gaugeChartArea').show();
            //generateSelectedUserClickCountReportGuage(d.operation, d.userClickCount, d.u_id);

            d3.csv("data/queryOutput/userClickCountReport.csv", function (data12) {
                for (var i = 0; i < data12.length; i++) {
                    if (((data12[i].u_id).localeCompare(d.u_id) == 0) && ((data12[i].operation).localeCompare('target_clicked') == 0)) {
                        generateSelectedUserClickCountReportGuage('target_clicked', data12[i].userClickCount, d.u_id);
                    }
                    if (((data12[i].u_id).localeCompare(d.u_id) == 0) && ((data12[i].operation).localeCompare('select') == 0)) {
                        generateSelectedUserClickCountReportGuage('select', data12[i].userClickCount, d.u_id);
                    }
                    if (((data12[i].u_id).localeCompare(d.u_id) == 0) && ((data12[i].operation).localeCompare('scroll_up') == 0)) {
                        generateSelectedUserClickCountReportGuage('scroll_up', data12[i].userClickCount, d.u_id);
                    }
                    if (((data12[i].u_id).localeCompare(d.u_id) == 0) && ((data12[i].operation).localeCompare('scroll_down') == 0)) {
                        generateSelectedUserClickCountReportGuage('scroll_down', data12[i].userClickCount, d.u_id);
                    }
                }
            });

        })
        .on("onmouseout", function (d) {
            $('#gaugeChartArea').hide();
        });

        node.append("title").text(function (d) { return d.u_id + ": " + format(d.userClickCount); });
    });
}

function loadContribution(userId)
{
    $('#gaugeChartArea').show();
    d3.csv("data/queryOutput/userClickCountReport.csv", function (data12) {
        for (var i = 0; i < data12.length; i++) {
            if (((data12[i].u_id).localeCompare(userId) == 0) && ((data12[i].operation).localeCompare('target_clicked') == 0)) {
                generateSelectedUserClickCountReportGuage('target_clicked', data12[i].userClickCount, userId);
            }
            if (((data12[i].u_id).localeCompare(userId) == 0) && ((data12[i].operation).localeCompare('select') == 0)) {
                generateSelectedUserClickCountReportGuage('select', data12[i].userClickCount, userId);
            }
            if (((data12[i].u_id).localeCompare(userId) == 0) && ((data12[i].operation).localeCompare('scroll_up') == 0)) {
                generateSelectedUserClickCountReportGuage('scroll_up', data12[i].userClickCount, userId);
            }
            if (((data12[i].u_id).localeCompare(userId) == 0) && ((data12[i].operation).localeCompare('scroll_down') == 0)) {
                generateSelectedUserClickCountReportGuage('scroll_down', data12[i].userClickCount, userId);
            }
        }
    });
}

function generateSelectedUserClickCountReportGuage(operation, userClickCount, userId)
{
    var average =0.0;
    if (operation == 'target_clicked') average = 53.61
    else if (operation == 'scroll_up') average = 1811.71
    else if (operation == 'select') average = 13.71
    else average = 6713.14
    var d = userClickCount / average * 100.0
    var chart1 = c3.generate({
        bindto: '#' + operation + 'GuageChart',
        data: {
            columns: [['data', d]],
            type: 'gauge',
            onclick: function (d, i) { console.log("onclick", d, i); },
            onmouseover: function (d, i) { console.log("onmouseover", d, i); },
            onmouseout: function (d, i) { console.log("onmouseout", d, i); }
        },
        gauge: {
            label: {
                show: false
            } // to turn off the min/max labels.
        },
        color: {
            pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'], // the three color levels for the percentage values.
            threshold: {
                unit: 'value',
                values: [30, 60, 90, 100]
            }
        },
        size: {
            height: 100
        }
    });
    $('#userContributionDetailsHeader').html('User ' + userId + ' Contribution against average contribution details- ')
}