import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker, HeatMap } from 'google-maps-react';
import Geocode from "react-geocode";


import './googleMap.css';

const credentials = require("./googleMapsApi");

Geocode.setApiKey(credentials.apiKey);
//Geocode.enableDebug();

// Geocode.fromAddress("735 Tower St S, Fergus, ON, N1M2R2").then(
//     response => {
//       const { lat, lng } = response.results[0].geometry.location;
//       console.log(lat, lng);
//     },
//     error => {
//       console.error(error);
//     }
// );

// function getPositions(data) {
//     let res = [];
//     let d = data.slice(0,2);
//     console.log(d);
//     d.map((item) => {
//       res.push({lat: item.lat, lng: item.lng});
//     });
//     res.push( { lat: 25.782551, lng: -80.445368 });
//     console.log(res)
//     return res;
// }

const mapStyles = {
    width: '100%',
    height: '800px',
    position: "relative",
};

export class MapContainer extends Component {
    state = {
        userLocation: { lat: 43.5053421, lng: -80.55494519999999 },
        intervalIsSet: false,
        loading: true,
        points: [],
        // hidden: "hidden",
    };


    componentDidMount() {

        //console.log(this.state.loading);
        if (!this.state.intervalIsSet) {

            // The heatmap does not work unless the props are fully loaded in.
            // This updates the map when the props are fully loaded in so heatmaps work
            let interval = setInterval(() => {
                //console.log(this.props.data);
                if (this.props.data !== undefined && this.props.data.length != 0) {
                    this.setState({loading: false});
                    clearInterval(interval);
                }
            }, 1000);
            
        }
    }

    
    displayMarkers = () => {
        return this.props.data.map((item, index) => {
          return <Marker key={index} id={index} position={{
           lat: item.lat,
           lng: item.lng,
         }}/>
        })
    }

    displayHeatMap = (gradient) => {
        let length = this.props.data.length;
        let res = [];
        for (let i = 0; i < length; i+=50 ) {
            
            res.push(<HeatMap
                key={i}
                positions={this.props.data.slice(i, i+50)}
                radius={20}
                opcatiy={1}
                gradient = {gradient}
            
            />)
        }

        return res;
    }

    getPositions = () => {
        let res = [];
        this.props.data.map((item) => {
          res.push({lat: item.lat, lng: item.lng});
        });
        //alert(JSON.stringify(res))
        return res;
    }

    render() {
        const gradient = [
            'rgba(0, 255, 255, 0)',
            'rgba(0, 255, 255, 1)',
            'rgba(0, 191, 255, 1)',
            'rgba(0, 127, 255, 1)',
            'rgba(0, 63, 255, 1)',
            'rgba(0, 0, 255, 1)',
            'rgba(0, 0, 223, 1)',
            'rgba(0, 0, 191, 1)',
            'rgba(0, 0, 159, 1)',
            'rgba(0, 0, 127, 1)',
            'rgba(63, 0, 91, 1)',
            'rgba(127, 0, 63, 1)',
            'rgba(191, 0, 31, 1)',
            'rgba(255, 0, 0, 1)'
        ];
        
        const positions = [
            {"lat":43.4642578,"lng":-80.5204096},{"lat":43.093452,"lng":-82.00256259999999},
            { lat: 25.782551, lng: -80.445368 },
            { lat: 25.782745, lng: -80.444586 },
            // { lat: 25.782842, lng: -80.443688 },
            // { lat: 25.782919, lng: -80.442815 },
            // { lat: 25.782992, lng: -80.442112 },
            // { lat: 25.7831, lng: -80.441461 },
            // { lat: 25.783206, lng: -80.440829 },
            // { lat: 25.783273, lng: -80.440324 },
            // { lat: 25.783316, lng: -80.440023 },
            // { lat: 25.783357, lng: -80.439794 },
            // { lat: 25.783371, lng: -80.439687 },
            // { lat: 25.783368, lng: -80.439666 },
            // { lat: 25.783383, lng: -80.439594 },
            // { lat: 25.783508, lng: -80.439525 },
            // { lat: 25.783842, lng: -80.439591 },
            // { lat: 25.784147, lng: -80.439668 }
        ];

        //const p = getPositions(this.props.data);
        //console.log(p)

        const { loading, userLocation } = this.state;
        if (loading) {
            return null;
        }
        return (
            <div id="mapBox" className={this.state.hidden}>

                <Map
                    google={this.props.google}
                    zoom={4}
                    style={mapStyles}
                    initialCenter={userLocation}
                >
                    {/* <Marker
                        title={'The marker`s title will appear as a tooltip.'}
                        position={userLocation}
                    /> */}
                    {/* {this.displayMarkers()} */}
                    {this.displayHeatMap(gradient)}

                    {/* <HeatMap
                        positions={this.props.data.slice(0,100)}
                        radius={20}
                        opcatiy={1}
                        gradient = {gradient}
                        
                    />
                    <HeatMap
                        positions={this.props.data.slice(100,200)}
                        radius={20}
                        opcatiy={1}
                        gradient = {gradient}
                        
                    />
                    <HeatMap
                        positions={this.props.data.slice(200,300)}
                        radius={20}
                        opcatiy={1}
                        gradient = {gradient}
                        
                    />
                    <HeatMap
                        positions={this.props.data.slice(300,400)}
                        radius={20}
                        opcatiy={1}
                        gradient = {gradient}
                        
                    /> */}
                </Map>
                {JSON.stringify(this.props.data.length)}
                {/* {JSON.stringify(positions)} */}
            </div>

        );
    }
}

export default GoogleApiWrapper({
    apiKey: credentials.apiKey,
    libraries: ['visualization']
})(MapContainer);