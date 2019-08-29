import React from 'react';
const greenStyle = {color: 'green'};
const redStyle = {color: 'red'};
const goldStyle = {color: 'gold'};
const blueStyle = {color: 'blue'}
export default function ProjectGeneralInfo(props){

    if(props.projectsInfo==null || props.projectsInfo[0] == undefined)
        return null;
    return (

        
        <span>
                    


        <strong >Total Number of </strong> <strong style={greenStyle}> Completed </strong> <strong>Projects: </strong>
        <div style={greenStyle}>
            {props.projectsInfo[2].numOccurences}
        </div>

        <br/>
        <strong>Currently </strong> <strong style = {blueStyle}> Active </strong> <strong>Projects: </strong>
        <div style = {blueStyle}>
            {props.projectsInfo[0].numOccurences}
        </div>
        <br/>
        <strong>Number of Projects on</strong> <strong style = {goldStyle}> Hold: </strong>
        <div style = {goldStyle}>
            {props.projectsInfo[3].numOccurences}
        </div>
        <br/>
        <strong>Currently Main Projects: </strong>
        <div>
            {props.projectsInfo[5].numOccurences}
        </div>
        <br/>
        <strong>Number of  </strong> <strong style = {redStyle}>Cancelled </strong> <strong>Projects: </strong>
        <div style = {redStyle}>
            {props.projectsInfo[1].numOccurences}
        </div>
        </span>
    );
    

}