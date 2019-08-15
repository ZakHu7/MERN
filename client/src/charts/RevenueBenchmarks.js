import React from 'react';

import { CanvasJSChart} from './canvasjs.react';


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
    for (var i = 0; i < 12; i++ ) {
        //alert(data[0].percentages[i])
        let p = data[0].percentages[i] == null ? null : Math.round( data[0].percentages[i] );
        res.push({ x: new Date(2019, i), y: p });
    }

    //alert(res);
    return res;
}

// Get average of company stats
function getAvgDataPoints(data) {
    var res = [];
    if (data == undefined || Object.keys(data).length == 0 || data[0] == undefined) {
        return null;
    }
    var dataCount = 0;
    var total = 0;
    for (let i = 0; i < 12; i++ ) {
        let monthData = data[0].percentages[i];
        if (monthData != null) {
            dataCount++;
            total += Math.round(monthData);
        }
    }
    if (dataCount != 0) {
        let p = Math.round(total/dataCount);
        for (let i = 0; i < 12; i++ ) {
            res.push({ x: new Date(2019, i), y: dataCount <= i ? null : p});
        }
    }

    return res;
}

export default function Chart(props) {

    var myDataPoints = getDataPoints(props.data);
    var myAvgDataPoints = getAvgDataPoints(props.data);

    const options = {
        animationEnabled: true,
        exportEnabled: true,
        theme: "light2", // "light1", "dark1", "dark2"
        title:{
            text: "Actual vs Quoted",
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
            //suffix: "h",
            //interval: 2
        },
        toolTip: {
            fontFamily: "roboto",
            contentFormatter: function (e) {
				var content = " ";
				for (var i = 0; i < e.entries.length; i++) {
					content += months[e.entries[i].dataPoint.x.getMonth()] + ": " + "<strong>" + e.entries[i].dataPoint.y + " %</strong>";
					content += "<br/>";
				}
				return content;
			}
        },
        // data: [{
        //     type: "line",
        //     toolTipContent: "Date - {x}, Percent - {y} ",
        //     dataPoints: [
        //         { x: new Date(2019, 0), y: 100 },
        //         { x: new Date(2019, 1), y: 100 },
        //         { x: new Date(2019, 2), y: 100 }
        //     ]
        // }],
        data: [{
            type: "line",
            name: "Company Stat",
            color: "cadetblue",
            dataPoints: myDataPoints
        },
        {
            type: "line",
            lineDashType: "dashDot",              
            name: "Company Stat Average",
            color: "lightcoral",
            dataPoints: myAvgDataPoints
        }],
        
    }

    return (   
        <div>
        <CanvasJSChart options = {options}
            /* onRef = {ref => this.chart = ref} */
        />
        {/* <Button
            variant="contained"
            color="secondary"
            //onClick={() => initializeActualQuotedData()}
        >
            REFRESH DATA
        </Button> */}
      </div>
    );
}