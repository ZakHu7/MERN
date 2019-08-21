import React, { Component } from 'react';
import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
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

function findLatLong(points, callback) {
    //const points = [];

    for (let i = 0; i < 2; i++ ) {
        //alert(i);
        var test = i == 0 ? "Toronto" : "Ottawa";
        Geocode.fromAddress(test + ", Ontario").then(
            response => {
                const { lat, lng } = response.results[0].geometry.location;
                //alert(lat, lng);
                callback(lat, lng);

            },
            error => {
                console.error(error);
            }
        );
    }
}


const mapStyles = {
    width: '100%',
    height: '800px',
    position: "relative",
};

export class MapContainer extends Component {
    state = {
        userLocation: { lat: 43.513558, lng: -80.554540 },
        loading: true,
        points: [{latitude: 43, longitude: -80}],
    };


    componentDidMount(props) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;

                this.setState({
                    userLocation: { lat: latitude, lng: longitude },
                    loading: false
                });
            },
            () => {
                this.setState({ loading: false });
            }
        );
    }

    displayMarkers = () => {
        return this.props.data.map((store, index) => {
          return <Marker key={index} id={index} position={{
           lat: store.latitude,
           lng: store.longitude
         }}
         onClick={() => console.log("You clicked me!")} />
        })
    }

    render() {
        const { loading, userLocation } = this.state;
        if (loading) {
            return null;
        }
        return (
            <div id="mapBox">

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
                    {this.displayMarkers()}
                </Map>
                {/* {JSON.stringify(this.props.data)} */}
                {/* {JSON.stringify(this.state.points)} */}
            </div>

        );
    }
}

export default GoogleApiWrapper({
    apiKey: credentials.apiKey
})(MapContainer);