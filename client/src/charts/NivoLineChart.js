import React from 'react';

import { ResponsiveLine } from '@nivo/line'


var months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
"Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];


// Convert data into useable data for the chart
function getCompanyDataPoints(data) {
    var res = [];

    //alert(JSON.stringify(data[0]))
    //alert(data["percentages"] == undefined);
    if (data == undefined || Object.keys(data).length == 0 || data[0] == undefined) {
        return null;
    }
    var companyStats = [];
    data.forEach(item => {
        if (item.name == "Company") {
            companyStats = item.percentages;
        }
    })
    for (var i = 0; i < 12; i++ ) {
        //alert(data[0].percentages[i])
        let p = companyStats[i] == null ? null : Math.round( companyStats[i] );
        res.push({ x: months[i], y: p });
    }

    //alert(res);
    return res;
}

// Get average of company stats
function getCompanyAvgDataPoints(data) {
    var res = [];
    if (data == undefined || Object.keys(data).length == 0 || data[0] == undefined) {
        return null;
    }
    var companyStats = [];
    data.forEach(item => {
        if (item.name == "Company") {
            companyStats = item.percentages;
        }
    })
    var dataCount = 0;
    var total = 0;
    for (let i = 0; i < 12; i++ ) {
        let monthData = companyStats[i];
        if (monthData != null) {
            dataCount++;
            total += Math.round(monthData);
        }
    }
    if (dataCount != 0) {
        let p = Math.round(total/dataCount);
        for (let i = 0; i < 12; i++ ) {
            res.push({ x: months[i], y: dataCount <= i ? null : p});
        }
    }
    return res;
}

// Create custom lines
function createCustomLine(data, names) {
    var res = [];
    //alert(names);

    if (data == undefined || Object.keys(data).length == 0 || data[0] == undefined 
        || names == undefined || names.length == 0) {
        return null;
    }
    var totalStats = new Array(12).fill(null);
    var count = 0;
    data.forEach(item => {
        if (names.includes(item.name)) {
            for (var i = 0; i < 12; i++ ) {
                let p = item.percentages[i] == null ? null : Math.round( item.percentages[i] );
                totalStats[i] += p;
            }
            count++;
        }
    })
    if (count != 0) {
        for (let i = 0; i < 12; i++ ) {
            let p = Math.round(totalStats[i]/count);
            res.push({ x: months[i], y: p == 0 ? null : p});
        }
    }

    //alert(res);
    return res;
}

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
export default function MyResponsiveLine(props) {
    var companyDataPoints = getCompanyDataPoints(props.data);
    var companyAvgDataPoints = getCompanyAvgDataPoints(props.data);
    var customLine1 = createCustomLine(props.data, props.customLine1);
    var customLine2 = createCustomLine(props.data, props.customLine2);
    var customLine3 = createCustomLine(props.data, props.customLine3);
    var customLine4 = createCustomLine(props.data, props.customLine4);
    var customLine5 = createCustomLine(props.data, props.customLine5);
    //alert(JSON.stringify(props.customLine1));

    let data = [{
            id: "Average",
            data: companyAvgDataPoints
        },
        {
            id: "Company",
            data: companyDataPoints
        }
    ]
    
    if (companyAvgDataPoints == null) {
        return null;
    }
    if (customLine1 != null) {
        data.push({
            id: "Custom Line 1",
            data: customLine1,
        })
    }
    if (customLine2 != null) {
        data.push({
            id: "Custom Line 2",
            data: customLine2,
        })
    }
    if (customLine3 != null) {
        data.push({
            id: "Custom Line 3",
            data: customLine3,
        })
    }
    if (customLine4 != null) {
        data.push({
            id: "Custom Line 4",
            data: customLine4,
        })
    }
    if (customLine5 != null) {
        data.push({
            id: "Custom Line 5",
            data: customLine5,
        })
    }
    //alert(JSON.stringify(myAvgDataPoints));
    //alert(null + 10);
    return (
        <ResponsiveLine
            data={data}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 0, max: 'auto' }}
            curve="cardinal"
            axisTop={null}
            axisRight={null}
            axisBottom={{
                orient: 'bottom',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Month',
                legendOffset: 36,
                legendPosition: 'middle'
            }}
            axisLeft={{
                orient: 'left',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Percentage',
                legendOffset: -40,
                legendPosition: 'middle'
            }}
            colors={{ scheme: 'nivo' }}
            lineWidth={4}
            pointSize={10}
            pointColor={{ from: 'color', modifiers: [] }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabel="y"
            pointLabelYOffset={-12}
            enableArea={true}
            areaOpacity={0.05}
            crosshairType="cross"
            useMesh={true}
            //debugMesh={true}
            legends={[
                {
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 100,
                    translateY: 0,
                    itemsSpacing: 0,
                    itemDirection: 'left-to-right',
                    itemWidth: 80,
                    itemHeight: 20,
                    itemOpacity: 0.75,
                    symbolSize: 12,
                    symbolShape: 'circle',
                    symbolBorderColor: 'rgba(0, 0, 0, .5)',
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemBackground: 'rgba(0, 0, 0, .03)',
                                itemOpacity: 1
                            }
                        }
                    ]
                }
            ]}
            motionStiffness={80}
            motionDamping={10}
        />
    );
    
}