import React, { useEffect } from 'react';

import axios from 'axios';
import Geocode from "react-geocode";

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import MultiSelect from './inputs/MultiSelect';



import EmployeeChart from './charts/EmployeeChart';
import AnnualRevenueChart from './charts/AnnualRevenueChart';
import ActualQuotedChart from './charts/ActualQuotedChart';
import BillableUtilizationChart from './charts/BillableUtilizationChart';
import RevenueBenchmarksChart from './charts/RevenueBenchmarksChart';
import HitRateChart from './charts/HitRateChart';
import ForecastChart from './charts/ForecastChart';

import NivoLineChart from './charts/NivoLineChart';
import GeneralProjectInfo from './charts/ProjectGeneralInfo';


import GoogleMap from './googleMap';
import './CompanyData.css';


const API = 'http://localhost:3001/api';

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
    paperSmall: {
        //padding: theme.spacing(2),
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

    const [generalProjInfo, setGeneralProjInfo] = React.useState({});

    // Used for the Actual vs Quoted chart where custom lines can be made
    const [designersData, setDesignersData] = React.useState({id:[], name:[]});
    //const [designersID, setDesignersID] = React.useState([]);
    const [customLine1, setCustomLine1] = React.useState([]);
    const [customLine2, setCustomLine2] = React.useState([]);
    const [customLine3, setCustomLine3] = React.useState([]);
    const [customLine4, setCustomLine4] = React.useState([]);
    const [customLine5, setCustomLine5] = React.useState([]);
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
    
    function initializeAllData(){
        setLoadingData(true);

        axios.post(API + '/initializeEmployeeData', {
            id: 0,
        });
        axios.post(API + '/initializeAnnualRevenueData', {
            id: 0,
        });

        axios.post(API + '/initializeActualQuotedData', {
            id: 0,
            designers: designersData,
            //user: "company",
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
        axios.post(API + '/initializeProjectGeneralData', {
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
        createEmployeeData(empRes.data.data);


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

        const generalProjectRes = await axios.get(API + '/getProjectGeneralData');
        setGeneralProjInfo(generalProjectRes.data.data);
        
        const latLngRes = await axios.get(API + '/getLatLngData');
        createLatLngData(latLngRes.data.data);
    };
    
    function getProjectData(){
        axios.post(API + '/initializeProjectGeneralData', {
            id: 0,
        });
        
    }

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

    function createEmployeeData(value) {

        var employeeArr = [];
        const designerArr = [];
        const designerIDArr = [];

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

            //For a list of designers
            if (category == "Designer") {
                designerArr.push(employee.name);
                designerIDArr.push(employee.employeeID)
            }
        }


        setEmployeeData(employeeArr);

        setEmployeeChartData(employeePieData);


        const designersInfo = {
            id: designerIDArr,
            name: designerArr,
        }

        setDesignersData(designersInfo);
    }


    return (
        <div className={classes.root}>
             <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        {/* {JSON.stringify(actualQuotedData)} */}
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

                    </Paper>
                </Grid>
            </Grid>

            <Grid container spacing={0}>
                <Grid item xs={11}>
                    <Paper className={[classes.paper, classes.height].join(" ")}>
                        <NivoLineChart 
                            data={actualQuotedData}
                            customLine1={customLine1}
                            customLine2={customLine2}
                            customLine3={customLine3}
                            customLine4={customLine4}
                            customLine5={customLine5}

                            //foo = {console.log(actualQuotedData)}
                        />
                    </Paper>
                </Grid>
                <Grid item xs={1}>
                    <Paper className={[classes.paperSmall, classes.height].join(" ")}>
                        <MultiSelect 
                            title={"Custom Line 1"}
                            items={designersData.name}
                            value={customLine1}
                            onChange={(employees) => setCustomLine1(employees)}
                        />
                        <MultiSelect 
                            title={"Custom Line 2"}
                            items={designersData.name}
                            value={customLine2}
                            onChange={(employees) => setCustomLine2(employees)}
                        />
                        <MultiSelect 
                            title={"Custom Line 3"}
                            items={designersData.name}
                            value={customLine3}
                            onChange={(employees) => setCustomLine3(employees)}
                        />
                        <MultiSelect 
                            title={"Custom Line 4"}
                            items={designersData.name}
                            value={customLine4}
                            onChange={(employees) => setCustomLine4(employees)}
                        />
                        <MultiSelect 
                            title={"Custom Line 5"}
                            items={designersData.name}
                            value={customLine5}
                            onChange={(employees) => setCustomLine5(employees)}
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
            <Grid container spacing = {10}>
                <Grid item xs = {15}>
                    <Paper className = {classes.paper}>
                        
                    <GeneralProjectInfo 
                        projectsInfo = {generalProjInfo}
                        
                        />
                        <Button
                         className={classes.button3}
                         variant="contained"
                         onClick={() => getProjectData()}>
                             Refresh Projects Data
                         </Button>
                    </Paper>
                </Grid>

            </Grid>
            
            {/* {JSON.stringify(employeeData)} */}
        </div>
    );
}

