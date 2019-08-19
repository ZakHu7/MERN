import React from 'react';

import { CanvasJSChart} from './canvasjs.react';

// Order the revenue data by year/id
function getOrderedData(revenueData) {
    var orderedData = [];
    var size = revenueData.length;
    for(var i = 0; i < size; i++) {
        let element = revenueData[i];
        orderedData[element.id] = element;
    }
    return orderedData;
}

// Convert data into useable data for the chart
function getPoints(revenueData, employeeData, type) {
    var res = [];

    //alert(JSON.stringify(data[0]))
    //alert(data["percentages"] == undefined);
    if (revenueData == undefined || Object.keys(revenueData).length == 0 || revenueData[0] == undefined) {
        return null;
    }

    var size = revenueData.length;
    for(var i = 0; i < size; i++) {
        let element = revenueData[i];
        if (element.year != null && element.revenue != null) {
            res.push({ x: element.year, y: Math.round( element.revenue / employeeData[type] )});
        }
    }
    return res;
}


export default function Chart(props) {

    var orderedData = getOrderedData(props.revenueData);
    var designerPoints = getPoints(orderedData, props.employeeData, "Designer");
    var employeePoints = getPoints(orderedData, props.employeeData, "Employee");

    const options = {
        animationEnabled: true,
        exportEnabled: true,
        height: 400,
        theme: "light2", // "light1", "dark1", "dark2"
        title:{
            text: "Revenue Benchmark",
            fontFamily: "roboto",
            fontWeight: "300",
            fontSize: "28",
            horizontalAlign: "left",
            padding: "10",
        },
        axisY: {
            title: "Revenue ($)",
            titleFontFamily: "roboto",
            labelFontFamily: "roboto",

            //includeZero: false,
            prefix: "$" //+ "2".sup(),
        },
        axisX: {
            title: "Year",
            titleFontFamily: "roboto",
            labelFontFamily: "roboto",
            valueFormatString: "####",
            interval: 1,
        },
        data: [{
            type: "line",
            name: "Revenue per Designer",
            color: "#FE6B8B",
            dataPoints: designerPoints
        },
        {
            type: "line",
            name: "Revenue per Employee",
            color: "#00d8a6",
            dataPoints: employeePoints
        }
        ]
        
    }

    return (   
        <div>
        <CanvasJSChart options = {options}
            /* onRef = {ref => this.chart = ref} */
        />
        {/* {JSON.stringify(props.revenueData)}
        {JSON.stringify(props.employeeData)} */}

      </div>
    );
}