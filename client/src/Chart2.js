import React from 'react';



import CanvasJSReact from './canvasjs.react';
import { CanvasJS } from './canvasjs.react';
import { CanvasJSChart} from './canvasjs.react';

function getDataPoints(data) {
    var res = [];
    if (data == undefined) {
        return null;
    }
    data.forEach(element => {
        if (element.hours != null && element.quotedAmt != null && element.area != null) {
            res.push({ x: element.hours, y: element.quotedAmt / element.area});
        }
    });
    return res;
}

export default function Chart2(props) {
    var myDataPoints = getDataPoints(props.data);

    const options = {
        animationEnabled: true,
        exportEnabled: true,
        theme: "light2", // "light1", "dark1", "dark2"
        title:{
            text: "$ per Square Foot to Hours"
        },
        axisY: {
            title: "$ per Square Footage",
            includeZero: false,
            prefix: "$" //+ "2".sup(),
        },
        axisX: {
            title: "Hours",
            suffix: "h",
            //interval: 2
        },
        data: [{
            type: "scatter",
            toolTipContent: "Hours - {x}, $/ft^2  - {y}",
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