import React, { useEffect } from 'react';

import axios from 'axios';
import Geocode from "react-geocode";

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';


import EmployeeChart from './charts/EmployeeChart';
import AnnualRevenueChart from './charts/AnnualRevenueChart';
import ActualQuotedChart from './charts/ActualQuotedChart';
import BillableUtilizationChart from './charts/BillableUtilizationChart';
import RevenueBenchmarksChart from './charts/RevenueBenchmarksChart';
import HitRateChart from './charts/HitRateChart';
import ForecastChart from './charts/ForecastChart';

import GoogleMap from './googleMap';


const API = 'http://192.168.23.114:3001/api';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: "whiteSmoke",
    },
    paper: {
        padding: theme.spacing(2),
        margin: 10,
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    button: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        margin: "auto",
        color: "white",
    }
}));

function initializeAllData(){
    axios.post(API + '/initializeEmployeeData', {
        id: 0,
    });
    axios.post(API + '/initializeAnnualRevenueData', {
        id: 0,
    });

    axios.post(API + '/initializeActualQuotedData', {
      id: 0,
    });
    axios.post(API + '/initializeBillableData', {
        id: 0,
    });
    axios.post(API + '/initializeHitRateData', {
        id: 0,
    });
    axios.post(API + '/initializeHitRateRevData', {
        id: 0,
    });


    axios.post(API + '/initializeMapData', {
        id: 0,
    });
}

export default function CompanyData() {
    const classes = useStyles();

    const [employeeData, setEmployeeData] = React.useState([]);

    const [employeeChartData, setEmployeeChartData] = React.useState({});
    const [annualRevenueData, setAnnualRevenueData] = React.useState({});
    const [actualQuotedData, setActualQuotedData] = React.useState({});
    const [billableData, setBillableData] = React.useState({});
    const [hitRateData, setHitRateData] = React.useState({});
    const [hitRateRevData, setHitRateRevData] = React.useState({});

    const [mapData, setMapData] = React.useState([]);

    
    useEffect(() => {
		getDataFromDb();
	}, []);

    function getDataFromDb(){
        axios.get(API + '/getEmployeeData')
          //.then((res) => alert(JSON.stringify(res.data.data)))
          .then((res) => handleEmployeeDataChange(res.data.data));
        axios.get(API + '/getAnnualRevenueData')
          .then((res) => setAnnualRevenueData(res.data.data));

        axios.get(API + '/getActualQuotedData')
          .then((res) => setActualQuotedData(res.data.data));
		axios.get(API + '/getBillableData')
          .then((res) => setBillableData(res.data.data));
        axios.get(API + '/getHitRateData')
          .then((res) => setHitRateData(res.data.data));
        axios.get(API + '/getHitRateRevData')
          .then((res) => setHitRateRevData(res.data.data));

        axios.get(API + '/getMapData')
          .then((res) => createMapData(res.data.data));
	};

    function createMapData(data) {
        var points = [];
        var length = data.length;
        var offset = 0;
        for (let i = 0; i < length; i++ ) {
            let item = data[i];
            //alert(i);
            // if (item.projectCity == null || item.projectState == null) {
            //     offset++;
            //     continue;
            // };
            
            //alert(item.projectCity);
            var address = item.projectStreet + " " + item.projectCity + " " + item.projectState + " " + item.projectZip;
            Geocode.fromAddress(address).then(
                response => {
                    const { lat, lng } = response.results[0].geometry.location;
                    //alert(JSON.stringify({lat, lng}));
                    //var points = mapData.slice();
                    points.push({latitude: lat, longitude: lng});
                    //alert(JSON.stringify(points));
                    if(i == length - 1) {
                        //alert(offset);
                        setMapData(points);

                    }
                    //alert(JSON.stringify(mapData));

                },
                error => {
                    console.error(error);
                }
            );

        }
        //alert(JSON.stringify(points));
        //setMapData(points);
    }

    function handleStateChange(setState, value) {
        //alert(Array.isArray(value));
        setState(value);
    }

    function handleEmployeeDataChange(value) {

        var employeeArr = [];

        var size = value.length;
        var employeePieData = {};
        employeePieData.Employee = 0;
        for (var i = 0; i < size; i++) {
            let employee = value[i];
            // For the EmployeeChart
            var category = employee.empTitle;
            employeePieData.Employee++;
            if(employeePieData.hasOwnProperty(category)){
                employeePieData[category]++;
            } else {
                employeePieData[category] = 1;
            }

            //For general employee purposes
            employeeArr.push({
                employeeID: employee.employeeID,
                name: employee.name,
                billable: [],
                notBillable: [],
            });
        }
        //alert(JSON.stringify(employeeArr));
        setEmployeeData(employeeArr);

        setEmployeeChartData(employeePieData);
    }


    return (
        <div className={classes.root}>
             <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        {/* {JSON.stringify(mapData)} */}
                        <GoogleMap 
                            data = {mapData}
                        />
                        <Button
                            className={classes.button}
                            variant="contained"
                            //onClick={() => initializeAllData()}
                        >
                            Save Points
                        </Button>
                        {/* {JSON.stringify(mapData)} */}
                    </Paper>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Button
                            className={classes.button}
                            variant="contained"
                            onClick={() => initializeAllData()}
                        >
                            REFRESH DATA
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <Paper className={classes.paper}>
                        <EmployeeChart
                            data={employeeChartData}
                            //dataChange={(value) => handleEmployeeDataChange(value)}
                        />
                    </Paper>
                </Grid>
                <Grid item xs={8}>
                    <Paper className={classes.paper}>
                        <AnnualRevenueChart
                            data={annualRevenueData}
                        />
                    </Paper>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Paper className={classes.paper}>
                        <ActualQuotedChart 
                            data={actualQuotedData}
                        />
                    </Paper>
                </Grid>
                <Grid item xs={6}>
                    <Paper className={classes.paper}>
                        <BillableUtilizationChart
                            employeeData={employeeData}
                            data={billableData}
                        />
                    </Paper>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <Paper className={classes.paper}>
                        <RevenueBenchmarksChart
                            employeeData={employeeChartData}
                            revenueData={annualRevenueData}
                        />
                    </Paper>
                </Grid>
                <Grid item xs={4}>
                    <Paper className={classes.paper}>
                        <HitRateChart
                            data = {hitRateData}
                            revData = {hitRateRevData}
                        />
                    </Paper>
                </Grid>
                <Grid item xs={4}>
                    <Paper className={classes.paper}>
                        <ForecastChart
                            data = {hitRateRevData}
                        />
                    </Paper>
                </Grid>
            </Grid>
            
            {/* {JSON.stringify(employeeData)} */}
        </div>
    );
}

