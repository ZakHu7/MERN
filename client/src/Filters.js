import React from 'react';

import InputGroup from 'react-bootstrap/InputGroup';
import FormControlR from 'react-bootstrap/FormControl';

import { makeStyles } from '@material-ui/core/styles';

import SingleSelect from './inputs/SingleSelect';
import MultiSelect from './inputs/MultiSelect';
import Search from './inputs/Search';
import Slider from './inputs/Slider';
import Test from './inputs/Test';



const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));




export default function Filters(props) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Search
                title={"Search Field"}
                value={props.search.value}
                onChange={(value) => props.onChange(props.search.setState, value)}
            />
            <Slider
                title={<span>Area (ft<span style={{verticalAlign: 'top', fontSize: 8}}>2</span>)</span>}
                logarithmic={true}
                min={100}
                max={99999}
                value={props.area.value}
                onChange={(area) => props.onChange(props.area.setState, area)}
            />

            <SingleSelect 
                title={"Project Size"}
                items={["Small", "Medium", "Large"]}
                value={props.projectSize.value}
                onChange={(size) => props.onChange(props.projectSize.setState, size)}
            />
            <MultiSelect 
                title={"Building Type"}
                items={["Null", "Assembly", "Base Building", "Grocery",
                        "Health Care Facility", "Industrial", 
                        "Institutional", "Miscellaneous", 
                        "Office", "Residential", "Restaurant", 
                        "Retail", "Warehouse"]}
                value={props.buildingType.value}
                onChange={(buildings) => props.onChange(props.buildingType.setState, buildings)}

            />
            {/* <Test /> */}
        </div>
    );
}