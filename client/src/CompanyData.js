import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import Pie from './charts/Pie';


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



export default function CompanyData() {
    const classes = useStyles();

    const [employeeData, setEmployeeData] = React.useState({});

    

    function handleStateChange(setState, value) {
        //alert(Array.isArray(value));
        setState(value);
    }

    function handleEmployeeDataChange(value) {

        var size = value.length;
        var employeePieData = {};
        for (var i = 0; i < size; i++) {
            var category = value[i].empTitle;
            if(employeePieData.hasOwnProperty(category)){
                employeePieData[category]++;
            } else {
                employeePieData[category] = 1;
            }
        }
        
        setEmployeeData(employeePieData);
    }


    return (
        <div className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={3}>
                    <Paper className={classes.paper}>
                        <Pie
                            title="Employee Data"
                            data={employeeData}
                            dataChange={(value) => handleEmployeeDataChange(value)}
                        />
                    </Paper>
                </Grid>
                <Grid item xs={6}>
                    <Paper 
                        className={classes.paper}>
                    </Paper>
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        {JSON.stringify(employeeData)}
                    </Paper>
                </Grid>
            </Grid>
            
            
        </div>
    );
}

