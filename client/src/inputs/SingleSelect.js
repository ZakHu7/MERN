import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';


const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));

function SingleSelect(props) {
    const classes = useStyles();
    // const [title, setTitle] = React.useState('');
    const [open, setOpen] = React.useState(false);
  
    function handleChange(event) {
      //setTitle(event.target.value);
      props.onChange(event.target.value);
    }
  
    function handleClose() {
      setOpen(false);
    }
  
    function handleOpen() {
      setOpen(true);
    }
  
    return (
  
        <FormControl className={classes.formControl}>
            <InputLabel htmlFor={props.title}>{props.title}</InputLabel>
            <Select
                open={open}
                onClose={handleClose}
                onOpen={handleOpen}
                value={props.value}
                onChange={handleChange}
                inputProps={{
                    title: props.title,
                    id: props.title,
                }}
            >
                <MenuItem value="">
                    <em>None</em>
                </MenuItem>
                {props.items.map(item => (
                    <MenuItem value={item}>{item}</MenuItem>

                ))}
                {/* <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem> */}
            </Select>
        </FormControl>
  
    );
  }


  export default SingleSelect;