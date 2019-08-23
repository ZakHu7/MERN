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

import NivoLineChart from './charts/NivoLineChart';


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
    },
    button2: {
        background: 'linear-gradient(45deg, #fe6bd4 30%, #fe6b8b 90%)',
        margin: "10px",
        paddingTop: 10,
        color: "white",
    },
    button3: {
        background: 'linear-gradient(45deg, #fe6b8b 30%, #fe6bd4 90%)',
        margin: "10px",
        paddingTop: 10,
        color: "white",
    },
    height: {
        height: "500px",
    }
}));




export default function CompanyData() {
    const classes = useStyles();
    const [loadingData, setLoadingData] = React.useState(false);

    const [employeeData, setEmployeeData] = React.useState([]);

    const [employeeChartData, setEmployeeChartData] = React.useState({});
    const [annualRevenueData, setAnnualRevenueData] = React.useState({});
    const [actualQuotedData, setActualQuotedData] = React.useState({});
    const [billableData, setBillableData] = React.useState({});
    const [hitRateData, setHitRateData] = React.useState({});
    const [hitRateRevData, setHitRateRevData] = React.useState({});

    const [mapData, setMapData] = React.useState([]);
    const [latLngData, setLatLngData] = React.useState([]);

    
    useEffect(() => {
        getDataFromDb();
        setLoadingData(false);
    }, [loadingData]);

    useEffect(() => {
        //alert(JSON.stringify(mapData.length != 0));
        if (mapData.length != 0) {
            console.log(mapData);
            fetchLatLngData();
        }
    }, [mapData]);

    async function fetchLatLngData() {
        //alert('hi');
        await axios.post(API + '/saveLatLngData', {
            id: 0,
            data: mapData,
        });
    }
    
    async function initializeAllData(){
        setLoadingData(true);

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

        //await alert('hi');
    }
    
    async function getMapData(){
        setLoadingData(true);
        const mapRes = await axios.get(API + '/getMapData')
        await createMapData(mapRes.data.data);
        //console.log(mapData);

    }

    async function getDataFromDb(){
        //alert(loadingData);

        const empRes = await axios.get(API + '/getEmployeeData');
        //alert(JSON.stringify(empRes.data.data));
        handleEmployeeDataChange(empRes.data.data);


        const annRevRes = await axios.get(API + '/getAnnualRevenueData');
        setAnnualRevenueData(annRevRes.data.data);

        const actQuoRes = await axios.get(API + '/getActualQuotedData');
        setActualQuotedData(actQuoRes.data.data);
        const billRes = await axios.get(API + '/getBillableData');
        setBillableData(billRes.data.data);
        const hitRateRes = await axios.get(API + '/getHitRateData');
        setHitRateData(hitRateRes.data.data);
        const hitRateRevRes = await axios.get(API + '/getHitRateRevData');
        setHitRateRevData(hitRateRevRes.data.data);


        const latLngRes = await axios.get(API + '/getLatLngData');
        createLatLngData(latLngRes.data.data);
    };
    


    function createLatLngData(data) {
        var points = [];
        if (data === undefined) {
            return;
        }
        var length = data.length;
        for (let i = 0; i < length; i++ ) {
            let item = data[i];

            points.push({lat: item.lat, lng: item.lng});
        }
        setLatLngData(points);
    }

    function createMapData(data) {
        var points = [];
        var length = data.length;
        for (let i = 0; i < length; i++ ) {
            let item = data[i];
            let addressArr = [];
            if (item.projectStreet != null) {
                addressArr.push(item.projectStreet);
            }
            if (item.projectCity != null) {
                addressArr.push(item.projectCity);
            }
            if (item.projectState != null) {
                addressArr.push(item.projectState);
            } else {
                addressArr.push("Ontario, Canada");
            }
            if (item.projectZip != null) {
                addressArr.push(item.projectZip);
            }

            var address = addressArr.join(", ");
            // if (item.projectCity != "St. Thomas ") {
            //     continue;
            // }
            //alert(address);
            Geocode.fromAddress(address).then(
                response => {
                    const { lat, lng } = response.results[0].geometry.location;

                    points.push(
                        {projectCode: item.projectCode,
                         city: item.projectCity,
                         province: item.projectState,
                         latitude: lat,
                         longitude: lng,
                        });
                    // if(item.projectCode == "18-179") {
                    //     setMapData(points);
                    // }
                    if(i == length - 1) {
                        setMapData(points);
                    }
                },
                error => {
                    console.error(error);
                }
            );
        }
    }

    // function handleStateChange(setState, value) {
    //     //alert(Array.isArray(value));
    //     setState(value);
    // }

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
        setEmployeeData(employeeArr);

        setEmployeeChartData(employeePieData);
    }


    return (
        <div className={classes.root}>
             <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        {JSON.stringify(mapData)}
                        <GoogleMap 
                            data = {latLngData}
                            //wait = {5000}
                        />
                        <Button
                            className={classes.button2}
                            variant="contained"
                            onClick={() => getMapData()}
                        >
                            Get Map Data
                        </Button>
                        {/* {JSON.stringify(mapData)} */}
                    </Paper>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper className={[classes.paper, classes.height].join(" ")}>
                        <NivoLineChart 
                            data={actualQuotedData}
                            //foo = {console.log(actualQuotedData)}
                        />
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

