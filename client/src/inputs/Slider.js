import React from 'react';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
  

function valuetext(value) {
  return `${value}°C`;
}
  

export default function RangeSlider(props) {


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
            valueLabelFormat={valueLabelFormat}
            theme="secondary"
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