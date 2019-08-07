import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';



const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  dense: {
    marginTop: theme.spacing(2),
  },
  menu: {
    width: 200,
  },
}));

export default function OutlinedTextFields(props) {
  const classes = useStyles();

  function handleChange(event) {
    props.onChange(event.target.value);
    //alert(event.target.value);
  }


  return (
    <form noValidate autoComplete="off">

      <TextField
        id="outlined-search"
        label={props.title}
        type="search"
        className={classes.textField}
        margin="normal"
        variant="outlined"
        onChange={handleChange}

      />
     
    </form>
  );
}