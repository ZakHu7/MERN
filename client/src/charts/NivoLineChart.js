import React from 'react';

import { ResponsiveLine } from '@nivo/line'


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
        res.push({ x: months[i], y: p });
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
            res.push({ x: months[i], y: dataCount <= i ? null : p});
        }
    }
    return res;
}



// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
export default function MyResponsiveLine(props) {
    var myDataPoints = getDataPoints(props.data);
    var myAvgDataPoints = getAvgDataPoints(props.data);
    let data = [{
            id: "Average",
            data: myAvgDataPoints
        },
        {
            id: "Company",
            data: myDataPoints
        }]
    
    if( myAvgDataPoints == null){
        return null;
    }
    //alert(JSON.stringify(myAvgDataPoints));
    
    return (
        <ResponsiveLine
            data={data}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', stacked: false, min: '0', max: 'auto' }}
            curve="natural"
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
            pointColor={{ theme: 'background' }}
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