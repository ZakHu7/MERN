import React from 'react';



import CanvasJSReact from './canvasjs.react';
import { CanvasJS } from './canvasjs.react';
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
            res.push({ x: element.hours, y: element.area, color: colours[element.buildingType]});
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
        title:{
            text: "Area to Hours"
        },
        axisY: {
            title: "Area (Sq Foot)",
            includeZero: false,
            suffix: " ft" //+ "2".sup(),
        },
        axisX: {
            title: "Hours",
            suffix: "h",
            //interval: 2
        },
        data: [{
            type: "scatter",
            toolTipContent: "Hours - {x}, Area - {y} ",
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