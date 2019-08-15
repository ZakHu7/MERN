import React from 'react';

import { CanvasJSChart} from './canvasjs.react';


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
	//const [intervalIsSet, setIntervalIsSet] = React.useState(false);


    // useEffect(() => {
	// 	getDataFromDb();
	// }, []);

    // function initializeAnnualRevenueData(){
    //     axios.post(API + '/initializeAnnualRevenueData', {
    //       id: 0,
    //     });
    // }

    // function getDataFromDb(){
    //     axios.get(API + '/getAnnualRevenueData')
    //       .then((res) => props.dataChange(res.data.data));
	// };
	
    var myDataPoints = getDataPoints(props.data);

    const options = {
        animationEnabled: true,
        exportEnabled: true,
        theme: "light2", // "light1", "dark1", "dark2"
        height: 300,
        title:{
            text: "Annual Revenue 'Growth'",
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
        {/* <Button
            variant="contained"
            color="secondary"
            //onClick={() => initializeAnnualRevenueData()}
        >
            REFRESH DATA
        </Button> */}
      </div>
    );
}