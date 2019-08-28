import React from 'react';

import { CanvasJSChart} from './canvasjs.react';
function getDataPoints(data) {
    var res = [];
    var colours = {
        null: "Black",
        "Assembly": "Aqua",
        "Base Building": "Chocolate",
        "Grocery": "Coral",
        "Health Care Facility": "Cyan",
        "Industrial": "DimGrey",
        "Institutional": "Lavender",
        "Miscellaneous": "Red",
        "Office": "SeaGreen",
        "Residential": "Green",
        "Restaurant": "Purple",
        "Retail": "LightCoral",
        "Warehouse": "Orange"
    };
    if (data == undefined) {
        return null;
    }
    data.forEach(element => {
        if (element.hours != null && element.area != null) {
            res.push({ x: element.hours, y: Math.round(element.area), color: colours[element.buildingType]});
        }
    });
    return res;
}

export default function Chart(props) {
    var myDataPoints = getDataPoints(props.data);

    const options = {
        animationEnabled: true,
        exportEnabled: true,
        theme: "light2", // "light1", "dark1", "dark2"
        height: 380,
        title:{
            text: "Area to Hours",
            fontFamily: "roboto",
            fontWeight: "300",
            fontSize: "28",
            horizontalAlign: "left",
            padding: "10",
        },
        axisY: {
            title: "Area (Sq Foot)",
            titleFontFamily: "roboto",
            labelFontFamily: "roboto",
            includeZero: false,
            suffix: " ft" //+ "2".sup(),
        },
        axisX: {
            title: "Hours",
            titleFontFamily: "roboto",
            labelFontFamily: "roboto",
            suffix: "h",
            //interval: 2
        },
        toolTip: {
            fontFamily: "roboto",
        },
        data: [{
            type: "scatter",
            toolTipContent: "{x}h: {y} sqft",
            dataPoints: myDataPoints
        }]
    }

    return (   
        <div>
        <CanvasJSChart options = {options}
            /* onRef = {ref => this.chart = ref} */
        />
      </div>
    );
}