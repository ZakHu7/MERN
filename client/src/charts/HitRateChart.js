import React from 'react';

import { CanvasJSChart} from './canvasjs.react';
import { getContrastRatio } from '@material-ui/core/styles';


var months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
"Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];


// Convert data into useable data for the chart
function getDataPoints(data) {
    var res = [];

    //alert(JSON.stringify(data[0]))
    //alert(data["percentages"] == undefined);
    if (data == undefined || Object.keys(data).length == 0 || data[0] == undefined) {
        return null;
    }
    var date = new Date();
    var currentYear = date.getFullYear();

    // Get the hit rate percentage from total received and total quoted
    data.forEach((item) => {
        if (item.year == currentYear) {
            let p = Math.round( item.received / item.total * 100 );
            res.push({ x: new Date(currentYear, item.month - 1), y: p , indexLabel: "Received:" + item.received + ", Total:" + item.total});
        }
    });

    return res;
}

// Convert data into useable data for the chart
function getPredictedDataPoints(data) {
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
        res.push({ x: new Date(currentYear, i), y: Math.round( val/4 ), indexLabel: "Past 4 Years Average" });
    });

    return res;
}

export default function Chart(props) {
    // var bar = new Array(12).fill(null);
    // bar[0].month += 10;
    // alert(bar);

    //var orderedData = getOrderedData(props.data);
    var myDataPoints = getDataPoints(props.data);
    var myPredictedDataPoints = getPredictedDataPoints(props.data);

    const options = {
        animationEnabled: true,
        exportEnabled: true,
        height: 400,
        theme: "light2", // "light1", "dark1", "dark2"
        title:{
            text: "Hit Rate",
            fontFamily: "roboto",
            fontWeight: "300",
            fontSize: "28",
            horizontalAlign: "left",
            padding: "10",
        },
        axisY: {
            title: "Percentage (%)",
            titleFontFamily: "roboto",
            labelFontFamily: "roboto",

            //includeZero: false,
            suffix: " %" //+ "2".sup(),
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
                    content += "Percentage: " + e.entries[i].dataPoint.y + "%";
					content += "<br/>";
				}
				return content;
			}
        },

        data: [{
            type: "line",
            name: " Hit Rate by Projects",
            color: "#fe6bd4",
            indexLabelFontSize: 0,
            dataPoints: myDataPoints
        },
        {
            type: "line",
            lineDashType: "dashDot",  
            name: " Hit Rate by Projects Prediction ",
            color: "#de6bfe",
            indexLabelFontSize: 0,
            dataPoints: myPredictedDataPoints
        }],
        
    }

    return (   
        <div>
        <CanvasJSChart options = {options}
            /* onRef = {ref => this.chart = ref} */
        />
        {JSON.stringify(props.data)}
      </div>
    );
}