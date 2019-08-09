import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

import { ThemeProvider } from '@material-ui/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

const theme = createMuiTheme({
    overrides: {
        MuiSlider: {
          valueLabel: {
            color: 'black',
            height: 300,
            width: 400,
            backgroundColor: "red"

          }
        }
    }
});
  

const useStyles = makeStyles({
  root: {
    width: 300,
  },
  markLabel: {
      width: 300,
  },
});

function valuetext(value) {
  return `${value}°C`;
}
  

export default function RangeSlider(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState([0, 100]);


  function valueLabelFormat(x) {
    if (props.logarithmic){
        var minp = 0;
        var maxp = 100;
        var minv = Math.log(props.min);
        var maxv = Math.log(props.max);
        var scale = (maxv-minv) / (maxp-minp);
        return Math.round(Math.exp(minv + scale*(x-minp)));
    }
    return x;
  }

  const handleChange = (event, newValue) => {
    props.onChange(newValue);
  };
  return (
    <div>


        <Typography id="range-slider" gutterBottom>
            {props.title}
        </Typography>
        <Slider
            value={props.value}
            onChange={handleChange}
            valueLabelDisplay="auto"
            aria-labelledby="range-slider"
            getAriaValueText={valuetext}
            valueLabelDisplay="auto"
            valueLabelFormat={valueLabelFormat}
            step="1"

        />

      {/* <ThemeProvider theme={theme}>

        <Typography id="range-slider" gutterBottom>
            {props.title}
        </Typography>
        <Slider
            value={props.value}
            onChange={handleChange}
            valueLabelDisplay="auto"
            aria-labelledby="range-slider"
            getAriaValueText={valuetext}
            valueLabelDisplay="auto"
            valueLabelFormat={valueLabelFormat}

        />
      </ThemeProvider> */}

    </div>
  );
}