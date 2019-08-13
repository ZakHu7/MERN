import React, { useEffect } from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';

import { CanvasJSChart} from './canvasjs.react';

const API = 'http://192.168.23.114:3001/api';

function getDataPoints(data) {
    var res = [];

    if (data == undefined || Object.keys(data).length == 0) {
        return null;
    }
    var size = data.length;
    for(var i = 0; i < size; i++) {
        let element = data[i];
        if (element.year != null && element.revenue != null) {
            res.push({ x: element.year, y: element.revenue});
        }
    }
    // data.forEach(element => {
    //     if (element.year != null && element.revenue != null) {
    //         res.push({ x: element.year, y: element.revenue});
    //     }
    // });
    //alert(Object.prototype.toString.call(data));
    return res;
}

export default function Chart(props) {
	const [intervalIsSet, setIntervalIsSet] = React.useState(false);


    useEffect(() => {
		getDataFromDb();
		// if (!intervalIsSet) {
		// let interval = setInterval(getDataFromDb, 1000);
		// setIntervalIsSet(interval);
		// }
	}, []);

    function initializeAnnualRevenueData(){
        axios.post(API + '/initializeAnnualRevenueData', {
          id: 0,
          name: "test",
        });
    }

    function getDataFromDb(){
        axios.get(API + '/getAnnualRevenueData')
          //.then((res) => alert("hi"))
          .then((res) => props.dataChange(res.data.data));
	};
	
    var myDataPoints = getDataPoints(props.data);

    const options = {
        animationEnabled: true,
        exportEnabled: true,
        theme: "light2", // "light1", "dark1", "dark2"
        height: 300,
        title:{
            text: "Annual Revenue Growth",
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
            includeZero: false,
            prefix: "$" //+ "2".sup(),
        },
        axisX: {
            title: "Year",
            titleFontFamily: "roboto",
            labelFontFamily: "roboto",
            valueFormatString: "####",
            interval: 1
        },
        toolTip: {
            fontFamily: "roboto",
        },
        dataPointWidth: 100,
        data: [{
            type: "column",
            dataPoints: myDataPoints,
        }]
    }

    return (   
        <div>
        <CanvasJSChart options = {options}
            /* onRef = {ref => this.chart = ref} */
        />
        <Button
            variant="contained"
            color="secondary"
            onClick={() => initializeAnnualRevenueData()}
        >
            REFRESH DATA
        </Button>
      </div>
    );
}