import React from 'react';

import InputGroup from 'react-bootstrap/InputGroup';
import FormControlR from 'react-bootstrap/FormControl';

import { makeStyles } from '@material-ui/core/styles';

import SingleSelect from './inputs/SingleSelect';
import MultiSelect from './inputs/MultiSelect';



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
            <InputGroup className="mb-3">
                <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon3">
                        Search Here
                    </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControlR id="basic-url" aria-describedby="basic-addon3" />
            </InputGroup>

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
        </div>
    );
}