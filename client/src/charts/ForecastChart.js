import React from 'react';

import { CanvasJSChart} from './canvasjs.react';


var months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
"Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];


// Convert data into useable data for the chart
function getQuotedDataPoints(data, type) {
    var res = [];

    if (data == undefined || Object.keys(data).length == 0 || data[0] == undefined) {
        return null;
    }
    var date = new Date();
    var currentYear = date.getFullYear();

    data.forEach((item) => {
        if (item.year == currentYear) {
            res.push({ x: new Date(currentYear, item.month - 1), y: item.total , indexLabel: "Total: $" + item.total});
        }
    });

    return res;
}
// Convert data into useable data for the chart
function getActualDataPoints(data, type) {
    var res = [];

    if (data == undefined || Object.keys(data).length == 0 || data[0] == undefined) {
        return null;
    }
    var date = new Date();
    var currentYear = date.getFullYear();
    
    data.forEach((item) => {
        if (item.year == currentYear) {
            res.push({ x: new Date(currentYear, item.month - 1), y: item.received , indexLabel: "Received: $" + item.received});
        }
    });

    return res;
}

// Convert data into useable data for the chart
function getPredictedDataPoints(data, type) {
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
            let p = item.received / item.total * 100;
            predicted[item.month - 1] += p;
        }
    });

    predicted.forEach((val, i) => {
        res.push({ x: new Date(currentYear, i), y: Math.round( val/4 ), indexLabel: "Past 4 Years " + type + " Average" });
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
    //var myPredictedDataPoints = getPredictedDataPoints(props.data, 'Projects');

    //var myPredictedRevDataPoints = getPredictedDataPoints(props.revData, 'Revenue');

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