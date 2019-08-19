import React from 'react';

import { CanvasJSChart} from './canvasjs.react';

// Creates the Billable Utilization chart.

// Convert data into useable data for the chart
function getData(data, employeeData) {
    var res = [];

    if (data == undefined || Object.keys(data).length == 0) {
        return null;
    }
    
    data.forEach((item) => {
        employeeData.forEach((employee) => {

            if (employee.employeeID == item.employeeID) {
                if (item.billable) {
                    employee.billable[item.month - 1] = item.hours;
                } else {
                    employee.notBillable[item.month - 1] = item.hours;
                }
            }
        });
    });
    var companyStats = new Array(12).fill(null);
    var employeeNum = 0;

    employeeData.forEach((employee) => {
        employeeNum++;
        let points = [];
        const length = Math.max(employee.billable.length, employee.notBillable.length);
        for (let i = 0; i < length; i++) {
            const bill = employee.billable[i];
            const noBill = employee.notBillable[i]
            const date = new Date(2019, i);
            if (bill == null && noBill == null ) {
                continue;
            } else if (bill == null) {
                points.push({ x: date, y: 0});
                companyStats[i] += 0;
            } else if (noBill == null) {
                points.push({ x: date, y: 100});
                companyStats[i] += 100;
            } else {
                points.push({ x: date, y: Math.round(bill / (noBill + bill) * 100)});
                companyStats[i] += Math.round(bill / (noBill + bill) * 100);
            }
        }

        let line = {
            type: "line",
            showInLegend: true, 
            label: employee.name,
            name: employee.name,
            dataPoints: points,
        };
        res.push(line);
    });

    var companyPoints = [];
    companyStats.forEach((stat, i) => {
        if (stat != null) {
            //const date = new Date(2019, i);
            companyPoints.push({ x: new Date(2019, i), y: Math.round(stat / employeeNum)});
        }
    });
    let companyLine = {
        type: "line",
        showInLegend: true, 
        label: "Company Stats",
        name: "Company Stats",
        dataPoints: companyPoints,
    };
    res.push(companyLine);

    return res;
}


export default function Chart(props) {

    var myData = getData(props.data, props.employeeData);

    const options = {
        animationEnabled: true,
        exportEnabled: true,
        height: 400,
        theme: "light2", // "light1", "dark1", "dark2"
        title:{
            text: "Billable Utilization",
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
        legend: {
            fontFamily: "roboto",
            cursor: "pointer",
            itemclick: function (e) {
                if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                    e.dataSeries.visible = false;
                } else {
                    e.dataSeries.visible = true;
                }

                e.chart.render();
            }
        },
        toolTip:{
            fontFamily: "roboto",             
            content: "{name}:{y}%",
        },
        data: myData,
        
    }

    return (   
        <div>
            <CanvasJSChart options = {options}
                /* onRef = {ref => this.chart = ref} */
            />
            {/* {JSON.stringify(myData)} */}
        </div>
    );
}