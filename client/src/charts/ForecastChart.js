import React from 'react';

import { CanvasJSChart} from './canvasjs.react';


var months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
"Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];


// Convert data into useable data for the chart
function getQuotedDataPoints(data) {
    var res = [];

    if (data == undefined || Object.keys(data).length == 0 || data[0] == undefined) {
        return null;
    }
    var date = new Date();
    var currentYear = date.getFullYear();

    data.forEach((item) => {
        if (item.year == currentYear) {
            res.push({ x: new Date(currentYear, item.month - 1), y: item.total , indexLabel: "Total: "});
        }
    });

    return res;
}
// Convert data into useable data for the chart
function getActualDataPoints(data) {
    var res = [];

    if (data == undefined || Object.keys(data).length == 0 || data[0] == undefined) {
        return null;
    }
    var date = new Date();
    var currentYear = date.getFullYear();
    
    data.forEach((item) => {
        if (item.year == currentYear) {
            res.push({ x: new Date(currentYear, item.month - 1), y: item.received , indexLabel: "Received: "});
        }
    });

    return res;
}

// Convert data into useable data for the chart
function getPredictedQuotedDataPoints(data, type) {
    var res = [];

    if (data == undefined || Object.keys(data).length == 0 || data[0] == undefined) {
        return null;
    }
    var date = new Date();
    var currentYear = date.getFullYear();
    var predicted = new Array(12).fill(0);
    // Get the hit rate percentage from total received and total quoted
    data.forEach((item) => {
        if (item.year != currentYear) {
            //let p = item.received / item.total * 100;
            predicted[item.month - 1] += item.total;
        }
    });

    predicted.forEach((val, i) => {
        res.push({ x: new Date(currentYear, i), y: Math.round( val/4 ), indexLabel: "Past 4 Years Quoted Average" });
    });

    return res;
}

// Convert data into useable data for the chart
function getPredictedActualDataPoints(data, type) {
    var res = [];

    if (data == undefined || Object.keys(data).length == 0 || data[0] == undefined) {
        return null;
    }
    var date = new Date();
    var currentYear = date.getFullYear();
    var predicted = new Array(12).fill(0);
    // Get the hit rate percentage from total received and total quoted
    data.forEach((item) => {
        if (item.year != currentYear) {
            //let p = item.received / item.total * 100;
            predicted[item.month - 1] += item.received;
        }
    });

    predicted.forEach((val, i) => {
        res.push({ x: new Date(currentYear, i), y: Math.round( val/4 ), indexLabel: "Past 4 Years Actual Average" });
    });

    return res;
}

// Convert data into useable data for the chart
function getPredictedHitRateDataPoints(data, type) {
    var res = [];

    if (data == undefined || Object.keys(data).length == 0 || data[0] == undefined) {
        return null;
    }
    var date = new Date();
    var currentYear = date.getFullYear();
    var actual = new Array(12).fill(0);
    var percents = new Array(12).fill(0);
    // Get the hit rate percentage from total received and total quoted
    data.forEach((item) => {
        if (item.year != currentYear) {
            let p = item.received / item.total * 100;
            percents[item.month - 1] += p;
        } else {
            actual[item.month - 1] = item.total;
        }
    });

    var predicted = new Array(12).fill(0);
    // Get the hit rate percentage from total received and total quoted
    data.forEach((item) => {
        if (item.year != currentYear) {
            //let p = item.received / item.total * 100;
            predicted[item.month - 1] += item.total;
        }
    });
    //alert(actual)
    percents.forEach((val, i) => {
        const total = actual[i] == 0 ? predicted[i]/4 : actual[i];
        res.push({ x: new Date(currentYear, i), y: Math.round( total * val/4 /100), indexLabel: "Estimated From Hit Rate" });
    });

    return res;
}

export default function Chart(props) {
    // var bar = new Array(12).fill(null);
    // bar[0].month += 10;
    // alert(bar);

    //var orderedData = getOrderedData(props.data);
    var myQuotedDataPoints = getQuotedDataPoints(props.data);
    var myActualDataPoints = getActualDataPoints(props.data);
    var myPredictedQuotedDataPoints = getPredictedQuotedDataPoints(props.data);
    var myPredictedActualDataPoints = getPredictedActualDataPoints(props.data);
    var myPredictedHitRateDataPoints = getPredictedHitRateDataPoints(props.data);

    const options = {
        animationEnabled: true,
        exportEnabled: true,
        height: 400,
        theme: "light2", // "light1", "dark1", "dark2"
        title:{
            text: "Forecast",
            fontFamily: "roboto",
            fontWeight: "300",
            fontSize: "28",
            horizontalAlign: "left",
            padding: "10",
        },
        axisY: {
            title: "Dollar ($)",
            titleFontFamily: "roboto",
            labelFontFamily: "roboto",

            //includeZero: false,
            prefix: "$"
        },
        axisX: {
            title: "Month",
            titleFontFamily: "roboto",
            labelFontFamily: "roboto",

            intervalType: "month",
            valueFormatString: "MMM",
            interval: 1,
        },
        toolTip: {
            fontFamily: "roboto",
            contentFormatter: function (e) {
				var content = " ";
				for (var i = 0; i < e.entries.length; i++) {
                    content += "<strong>" + months[e.entries[i].dataPoint.x.getMonth()] + "</strong><br/>";
                    content += e.entries[i].dataPoint.indexLabel + "<br/>";
                    content += "$" + e.entries[i].dataPoint.y + "<br/>";
				}
				return content;
			}
        },

        data: [{
            type: "line",
            name: " Quoted Hours ",
            color: "#ee0290",
            indexLabelFontSize: 0,
            dataPoints: myQuotedDataPoints
        },
        {
            type: "line",
            name: " Actual Hours ",
            color: "#ee6002",
            indexLabelFontSize: 0,
            dataPoints: myActualDataPoints
        },
        {
            type: "line",
            lineDashType: "shortDot",  
            name: " Predicted Quoted Hours ",
            //color: "#ee6002",
            indexLabelFontSize: 0,
            dataPoints: myPredictedQuotedDataPoints
        },
        {
            type: "line",
            lineDashType: "shortDot",  
            name: " Predicted Actual Hours ",
            //color: "#ee6002",
            indexLabelFontSize: 0,
            dataPoints: myPredictedActualDataPoints
        },
        {
            type: "line",
            lineDashType: "shortDashDot",  
            name: " Predicted Hit Rate Hours ",
            //color: "#ee6002",
            indexLabelFontSize: 0,
            dataPoints: myPredictedHitRateDataPoints
        },]
        
    }

    return (   
        <div>
        <CanvasJSChart options = {options}
            /* onRef = {ref => this.chart = ref} */
        />
        {/* {JSON.stringify(props.data)} */}
      </div>
    );
}