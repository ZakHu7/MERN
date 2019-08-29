import React from 'react';


export default function ProjectGeneralInfo(props){

    if(props.projectsInfo==null || props.projectsInfo[0] == undefined)
        return null;
    return (

        
        <span>
                    


        <strong>Total Number of Completed Projects: </strong>
        <div>
            {props.projectsInfo[2].numOccurences}
        </div>

        <br/>
        <strong>Currently Active Projects: </strong>
        <div>
            {props.projectsInfo[0].numOccurences}
        </div>
        <br/>
        <strong>Number of Projects on Hold: </strong>
        <div>
            {props.projectsInfo[3].numOccurences}
        </div>
        <br/>
        <strong>Currently Main Projects: </strong>
        <div>
            {props.projectsInfo[5].numOccurences}
        </div>
        <br/>
        <strong>Number of Cancelled Projects: </strong>
        <div>
            {props.projectsInfo[1].numOccurences}
        </div>
        </span>
    );
    

}