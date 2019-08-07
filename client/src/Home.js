import React from 'react';

import Controller from './Controller';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';


import Filters from './Filters';
import Chart from './Chart';
import Chart2 from './Chart2';


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

function createFilterInfo(value, setState) {
    return { value, setState };
}

function createQueryFilters(projectSize, buildingTypes) {
    return { projectSize, buildingTypes };
}

export default function Home() {
    const classes = useStyles();
    const [data, setData] = React.useState([]);
    const [page, setPage] = React.useState(0);

    const [projectSize, setProjectSize] = React.useState('');
    const [buildingTypes, setBuildingTypes] = React.useState([]);

    //Changes page of the table
    function handleStateChange(setState, value) {
        setState(value);
    }

    //Generic filter change event
    function handleFilterChange(setState, value) {
        setState(value);
        setPage(0);
    }

    return (
        <div className={classes.root}>
            
            
            <Grid container spacing={2}>
                {/* <Grid item xs>
                    <Paper className={classes.paper}>
                        {projectSize}
                    </Paper>
                </Grid> */}
                <Grid item xs={10}>
                    <Paper className={classes.paper}>
                        <Controller
                            filters={createQueryFilters(projectSize, buildingTypes)}
                            page={page}
                            pageChange={(value) => handleStateChange(setPage, value)}
                            data={data}
                            dataChange={(value) => handleStateChange(setData, value)}
                        />
                    </Paper>
                </Grid>
                <Grid item xs={2}>
                    <Paper className={classes.paper}>
                        <Filters 
                            projectSize={createFilterInfo(projectSize, setProjectSize)}
                            buildingType={createFilterInfo(buildingTypes, setBuildingTypes)}
                            onChange={(setState, value) => handleFilterChange(setState, value)}
                        />
                    </Paper>
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                <Grid item xs={6}>
                    <Paper className={classes.paper}>
                        <Chart
                            data={data}
                        />
                    </Paper>
                </Grid>
                <Grid item xs={6}>
                    <Paper className={classes.paper}>
                        <Chart2
                            data={data}
                        />
                    </Paper>
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        {JSON.stringify(data)}
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}

