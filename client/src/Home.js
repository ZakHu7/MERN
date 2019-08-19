import React from 'react';

import Controller from './Controller';

//for the layout
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

//different sections
import Filters from './Filters';
import AreatoHoursChart from './charts/AreatoHoursChart';
import DollarsPerSquareFootChart from './charts/DollarsPerSquareFootChart';


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

function createQueryFilters(search, projectSize, buildingTypes, area) {
    return { search, projectSize, buildingTypes, area };
}

function convertArea(x) {

    var minp = 0;
    var maxp = 100;
    var minv = Math.log(100);
    var maxv = Math.log(99999);
    var scale = (maxv-minv) / (maxp-minp);
    return Math.round(Math.exp(minv + scale*(x-minp)));

}

export default function Home() {
    const classes = useStyles();
    const [data, setData] = React.useState([]);
    const [page, setPage] = React.useState(0);

    const [search, setSearch] = React.useState('');
    const [projectSize, setProjectSize] = React.useState('');
    const [buildingTypes, setBuildingTypes] = React.useState([]);
    const [area, setArea] = React.useState([0, 100]);

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
                            filters={createQueryFilters(search, projectSize, buildingTypes, area.map(item => convertArea(item)))}
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
                            search={createFilterInfo(search, setSearch)}
                            projectSize={createFilterInfo(projectSize, setProjectSize)}
                            buildingType={createFilterInfo(buildingTypes, setBuildingTypes)}
                            area={createFilterInfo(area, setArea)}
                            onChange={(setState, value) => handleFilterChange(setState, value)}
                        />
                    </Paper>
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                <Grid item xs={6}>
                    <Paper className={classes.paper}>
                        <AreatoHoursChart
                            data={data}
                        />
                    </Paper>
                </Grid>
                <Grid item xs={6}>
                    <Paper className={classes.paper}>
                        <DollarsPerSquareFootChart
                            data={data}
                        />
                    </Paper>
                </Grid>
            </Grid>
            {/* <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        {JSON.stringify(data)}
                    </Paper>
                </Grid>
            </Grid> */}
        </div>
    );
}

