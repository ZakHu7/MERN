import React, { useEffect } from 'react';

import axios from 'axios';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';


import EmployeeChart from './charts/EmployeeChart';
import AnnualRevenueChart from './charts/AnnualRevenueChart';
import ActualQuotedChart from './charts/ActualQuotedChart';
import BillableUtilization from './charts/BillableUtilization';
import RevenueBenchmarks from './charts/RevenueBenchmarks';

const API = 'http://192.168.23.114:3001/api';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
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
}

export default function CompanyData() {
    const classes = useStyles();

    const [employeeData, setEmployeeData] = React.useState([]);

    const [employeeChartData, setEmployeeChartData] = React.useState({});
    const [annualRevenueData, setAnnualRevenueData] = React.useState({});
    const [actualQuotedData, setActualQuotedData] = React.useState({});
    const [billableData, setBillableData] = React.useState({});

    
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
	};


    function handleStateChange(setState, value) {
        //alert(Array.isArray(value));
        setState(value);
    }

    function handleEmployeeDataChange(value) {

        var employeeArr = [];

        var size = value.length;
        var employeePieData = {};
        for (var i = 0; i < size; i++) {
            let employee = value[i];
            // For the EmployeeChart
            var category = employee.empTitle;
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
            <Button
                variant="contained"
                color="secondary"
                onClick={() => initializeAllData()}
            >
                REFRESH DATA
            </Button>
            <Grid container spacing={3}>
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
            <Grid container spacing={3}>
                <Grid item xs={6}>
                    <Paper className={classes.paper}>
                        <ActualQuotedChart 
                            data={actualQuotedData}
                        />
                    </Paper>
                </Grid>
                <Grid item xs={6}>
                    <Paper className={classes.paper}>
                        <BillableUtilization
                            employeeData={employeeData}
                            data={billableData}
                        />
                    </Paper>
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                <Grid item xs={4}>
                    <Paper className={classes.paper}>
                        <RevenueBenchmarks
                            employeeData={employeeData}
                            revenueData={annualRevenueData}
                        />
                    </Paper>
                </Grid>
                <Grid item xs={4}>
                    <Paper className={classes.paper}>
                        
                    </Paper>
                </Grid>
                <Grid item xs={4}>
                    <Paper className={classes.paper}>
                        
                    </Paper>
                </Grid>
            </Grid>
            
            {JSON.stringify(employeeData)}
        </div>
    );
}

