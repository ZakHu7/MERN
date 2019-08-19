/* EmployeeChart.js */
import React from 'react';

import { CanvasJSChart} from './canvasjs.react';

 
export default function EmployeeChart(props) {	
	//const [intervalIsSet, setIntervalIsSet] = React.useState(false);

	// // Similar to componentDidMount and componentDidUpdate:
	// useEffect(() => {
	// 	getDataFromDb();
	// 	// if (!intervalIsSet) {
	// 	// let interval = setInterval(getDataFromDb, 1000);
	// 	// setIntervalIsSet(interval);
	// 	// }
	// }, []);

	// function initializeEmployeeData(){
    //     axios.post(API + '/initializeEmployeeData', {
    //       id: 0,
    //     });
    // }

    // function getDataFromDb(){
	// 	axios.get(API + '/getEmployeeData')
    //       .then((res) => props.dataChange(res.data.data));
	// };
	
	function getDataPoints(){
		var dataPoints = [];
		//alert(props.data);
		for (var key in props.data) {
			// skip loop if the property is from prototype
			if (!props.data.hasOwnProperty(key) || key == "Employee") continue;
		
			var value = props.data[key];
			
			dataPoints.push({ y: value, label: key})
		}
		return dataPoints;
	}

	const options = {
		animationEnabled: true,
		exportEnabled: true,
		theme: "light2", // "light1", "dark1", "dark2"
		height: 400,
		title:{
			text: "Employee Data",
			fontFamily: "roboto",
            fontWeight: "300",
            fontSize: "28",
            horizontalAlign: "left",
            padding: "10",
		},
		toolTip: {
			fontFamily: "roboto",
        },
		data: [{
			type: "doughnut",
			//indexLabel: "{label}: {y}%",		
			startAngle: 0,
			dataPoints: getDataPoints(),
		}]
	}
	
	return (
		<div>
			<CanvasJSChart options = {options} 
				/* onRef={ref => this.chart = ref} */
			/>
			{/* <Button
				variant="contained"
				color="secondary"
				//onClick={() => initializeEmployeeData()}
			>
				REFRESH DATA
			</Button> */}
			{/* {JSON.stringify(props.data)} */}
			
			{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
		</div>
	);
	
}
